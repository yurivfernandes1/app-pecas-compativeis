import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils';

export interface AppMonitoringData {
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    memoryUsage?: number;
    networkStatus: 'online' | 'offline';
  };
  userInteractions: {
    totalClicks: number;
    lastActivity: string;
    sessionDuration: number;
  };
  errors: {
    jsErrors: number;
    networkErrors: number;
    lastError?: string;
  };
}

export const useAppMonitoring = (componentName: string) => {
  const [monitoring, setMonitoring] = useState<AppMonitoringData>({
    performanceMetrics: {
      loadTime: 0,
      renderTime: 0,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    },
    userInteractions: {
      totalClicks: 0,
      lastActivity: new Date().toISOString(),
      sessionDuration: 0
    },
    errors: {
      jsErrors: 0,
      networkErrors: 0
    }
  });

  const [sessionStart] = useState(Date.now());

  // Log de entrada no componente
  useEffect(() => {
    const renderStart = performance.now();
    
    logger.info(`Componente ${componentName} montado`, componentName, {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Medir tempo de renderização
    const renderTime = performance.now() - renderStart;
    
    setMonitoring(prev => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        renderTime
      }
    }));

    // Cleanup ao desmontar
    return () => {
      const sessionDuration = Date.now() - sessionStart;
      logger.info(`Componente ${componentName} desmontado`, componentName, {
        sessionDuration: `${sessionDuration}ms`,
        timestamp: new Date().toISOString()
      });
    };
  }, [componentName, sessionStart]);

  // Monitorar métricas de performance
  useEffect(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        setMonitoring(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            loadTime
          }
        }));
      }

      // Monitorar memória se disponível
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMonitoring(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            memoryUsage: memory.usedJSHeapSize
          }
        }));
      }
    }
  }, []);

  // Monitorar status da rede
  useEffect(() => {
    const handleOnline = () => {
      setMonitoring(prev => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          networkStatus: 'online'
        }
      }));
      logger.info('Conectividade restaurada', componentName);
    };

    const handleOffline = () => {
      setMonitoring(prev => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          networkStatus: 'offline'
        }
      }));
      logger.warn('Perda de conectividade detectada', componentName);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [componentName]);

  // Atualizar duração da sessão periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionDuration = Date.now() - sessionStart;
      setMonitoring(prev => ({
        ...prev,
        userInteractions: {
          ...prev.userInteractions,
          sessionDuration
        }
      }));
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, [sessionStart]);

  // Função para logar interações do usuário
  const logUserInteraction = useCallback((interactionType: string, details?: any) => {
    logger.info(`Interação do usuário: ${interactionType}`, componentName, details);
    
    setMonitoring(prev => ({
      ...prev,
      userInteractions: {
        ...prev.userInteractions,
        totalClicks: prev.userInteractions.totalClicks + 1,
        lastActivity: new Date().toISOString()
      }
    }));
  }, [componentName]);

  // Função para logar erros
  const logError = useCallback((error: Error | string, context?: any) => {
    const errorMessage = error instanceof Error ? error.message : error;
    logger.error(`Erro em ${componentName}: ${errorMessage}`, componentName, {
      error: error instanceof Error ? error.stack : error,
      context,
      timestamp: new Date().toISOString()
    });

    setMonitoring(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        jsErrors: prev.errors.jsErrors + 1,
        lastError: errorMessage
      }
    }));
  }, [componentName]);

  // Função para logar warning
  const logWarning = useCallback((message: string, details?: any) => {
    logger.warn(message, componentName, details);
  }, [componentName]);

  // Função para logar debug info
  const logDebug = useCallback((message: string, details?: any) => {
    logger.debug(message, componentName, details);
  }, [componentName]);

  // Função para testar funcionalidade específica
  const testFeature = useCallback(async (featureName: string, testFunction: () => Promise<void>) => {
    const startTime = performance.now();
    
    try {
      logger.info(`Iniciando teste: ${featureName}`, componentName);
      await testFunction();
      const duration = performance.now() - startTime;
      logger.info(`Teste concluído com sucesso: ${featureName}`, componentName, {
        duration: `${duration.toFixed(2)}ms`
      });
      return { success: true, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      logError(error instanceof Error ? error : new Error(String(error)), {
        featureName,
        duration: `${duration.toFixed(2)}ms`
      });
      return { success: false, duration, error };
    }
  }, [componentName, logError]);

  return {
    monitoring,
    logUserInteraction,
    logError,
    logWarning,
    logDebug,
    testFeature
  };
};

export default useAppMonitoring;
