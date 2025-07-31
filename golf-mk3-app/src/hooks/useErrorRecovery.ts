import { useState, useCallback, useRef } from 'react';
import ErrorRecoveryService, { ErrorLog } from '../services/ErrorRecoveryService';
import { AnalyticsService } from '../services/AnalyticsService';

interface UseErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onRecovery?: (retryCount: number) => void;
  fallbackData?: any;
}

interface ErrorRecoveryState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  hasError: boolean;
}

export const useErrorRecovery = <T = any>(
  operation: () => Promise<T>,
  errorType: ErrorLog['type'] = 'unknown',
  options: UseErrorRecoveryOptions = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRecovery,
    fallbackData,
  } = options;

  const [state, setState] = useState<ErrorRecoveryState>({
    isLoading: false,
    error: null,
    retryCount: 0,
    hasError: false,
  });

  const [data, setData] = useState<T | null>(null);
  const operationRef = useRef(operation);
  operationRef.current = operation;

  // Executar operação com recovery automático
  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      hasError: false,
    }));

    try {
      const result = await ErrorRecoveryService.attemptRecovery(
        errorType,
        operationRef.current,
        {
          maxRetries,
          retryDelay,
          timestamp: new Date().toISOString(),
        }
      );

      setData(result);
      setState(prev => ({
        ...prev,
        isLoading: false,
        retryCount: 0,
      }));

      // Callback de sucesso após recovery
      if (state.retryCount > 0 && onRecovery) {
        onRecovery(state.retryCount);
      }

      return result;
    } catch (error) {
      const err = error as Error;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err,
        hasError: true,
        retryCount: prev.retryCount + 1,
      }));

      // Callback de erro
      if (onError) {
        onError(err);
      }

      // Se há dados de fallback, usar eles
      if (fallbackData !== undefined) {
        setData(fallbackData);
        
        // Track uso de fallback
        AnalyticsService.trackEvent('error_recovery_fallback_used', {\n          errorType,\n          errorMessage: err.message,\n        });\n        \n        return fallbackData;\n      }\n\n      throw err;\n    }\n  }, [errorType, maxRetries, retryDelay, onError, onRecovery, fallbackData, state.retryCount]);\n\n  // Retry manual\n  const retry = useCallback(async (): Promise<T | null> => {\n    // Track retry manual\n    AnalyticsService.trackEvent('error_recovery_manual_retry', {\n      errorType,\n      retryCount: state.retryCount,\n    });\n\n    return execute();\n  }, [execute, errorType, state.retryCount]);\n\n  // Reset do estado de erro\n  const reset = useCallback(() => {\n    setState({\n      isLoading: false,\n      error: null,\n      retryCount: 0,\n      hasError: false,\n    });\n    setData(null);\n  }, []);\n\n  // Verificar se pode tentar novamente\n  const canRetry = state.retryCount < maxRetries && state.hasError;\n\n  return {\n    // Estado\n    ...state,\n    data,\n    canRetry,\n    \n    // Ações\n    execute,\n    retry,\n    reset,\n  };\n};\n\n// Hook para monitorar erros globais\nexport const useErrorMonitoring = () => {\n  const [errorStats, setErrorStats] = useState(ErrorRecoveryService.getErrorStats());\n  const [isHealthy, setIsHealthy] = useState(true);\n\n  // Atualizar estatísticas\n  const refreshStats = useCallback(() => {\n    const stats = ErrorRecoveryService.getErrorStats();\n    setErrorStats(stats);\n  }, []);\n\n  // Verificar saúde do sistema\n  const checkHealth = useCallback(async () => {\n    const healthCheck = await ErrorRecoveryService.performHealthCheck();\n    setIsHealthy(healthCheck.healthy);\n    return healthCheck;\n  }, []);\n\n  // Limpar logs antigos\n  const clearOldLogs = useCallback(async (days: number = 7) => {\n    const removedCount = await ErrorRecoveryService.clearOldLogs(days);\n    refreshStats();\n    return removedCount;\n  }, [refreshStats]);\n\n  // Obter logs recentes\n  const getRecentLogs = useCallback((limit: number = 10) => {\n    return ErrorRecoveryService.getErrorLogs(limit);\n  }, []);\n\n  return {\n    errorStats,\n    isHealthy,\n    refreshStats,\n    checkHealth,\n    clearOldLogs,\n    getRecentLogs,\n  };\n};\n\n// Hook para tratamento de erros específicos de rede\nexport const useNetworkErrorRecovery = <T = any>(\n  networkOperation: () => Promise<T>,\n  options: UseErrorRecoveryOptions & {\n    offlineData?: T;\n    cacheKey?: string;\n  } = {}\n) => {\n  const { offlineData, cacheKey, ...recoveryOptions } = options;\n  \n  const recovery = useErrorRecovery(\n    networkOperation,\n    'network',\n    {\n      ...recoveryOptions,\n      fallbackData: offlineData,\n      maxRetries: 3,\n      retryDelay: 2000,\n    }\n  );\n\n  // Verificar se está offline\n  const isOffline = recovery.error?.message.includes('network') || \n                   recovery.error?.message.includes('fetch');\n\n  return {\n    ...recovery,\n    isOffline,\n  };\n};\n\n// Hook para tratamento de erros de dados\nexport const useDataErrorRecovery = <T = any>(\n  dataOperation: () => Promise<T>,\n  options: UseErrorRecoveryOptions & {\n    defaultData?: T;\n    validateData?: (data: T) => boolean;\n  } = {}\n) => {\n  const { defaultData, validateData, ...recoveryOptions } = options;\n  \n  const recovery = useErrorRecovery(\n    async () => {\n      const result = await dataOperation();\n      \n      // Validar dados se função fornecida\n      if (validateData && !validateData(result)) {\n        throw new Error('Data validation failed');\n      }\n      \n      return result;\n    },\n    'data',\n    {\n      ...recoveryOptions,\n      fallbackData: defaultData,\n      maxRetries: 2,\n      retryDelay: 1000,\n    }\n  );\n\n  return recovery;\n};\n\n// Hook para tratamento de erros de componente\nexport const useComponentErrorRecovery = (\n  componentName: string,\n  onError?: (error: Error, errorInfo: any) => void\n) => {\n  const [hasError, setHasError] = useState(false);\n  const [error, setError] = useState<Error | null>(null);\n\n  const handleError = useCallback(async (error: Error, errorInfo?: any) => {\n    setHasError(true);\n    setError(error);\n\n    // Log do erro\n    await ErrorRecoveryService.logError('component', error, {\n      componentName,\n      ...errorInfo,\n    });\n\n    // Callback personalizado\n    if (onError) {\n      onError(error, errorInfo);\n    }\n\n    // Track erro de componente\n    AnalyticsService.trackError(error.name, error.message, {\n      componentName,\n      errorType: 'component',\n      ...errorInfo,\n    });\n  }, [componentName, onError]);\n\n  const reset = useCallback(() => {\n    setHasError(false);\n    setError(null);\n  }, []);\n\n  return {\n    hasError,\n    error,\n    handleError,\n    reset,\n  };\n};\n\nexport default useErrorRecovery;