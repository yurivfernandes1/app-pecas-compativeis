import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsService } from './AnalyticsService';

export interface ErrorLog {
  id: string;
  type: 'network' | 'data' | 'component' | 'navigation' | 'storage' | 'unknown';
  message: string;
  stack?: string;
  timestamp: string;
  resolved: boolean;
  retryCount: number;
  context?: any;
}

export interface RecoveryStrategy {
  type: string;
  maxRetries: number;
  retryDelay: number;
  fallbackAction?: () => Promise<void>;
  shouldRetry?: (error: Error, retryCount: number) => boolean;
}

class ErrorRecoveryService {
  private static instance: ErrorRecoveryService;
  private errorLogs: ErrorLog[] = [];
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private readonly MAX_ERROR_LOGS = 100;
  private readonly STORAGE_KEY = '@golf_mk3_error_logs';

  private constructor() {
    this.initializeRecoveryStrategies();
    this.loadErrorLogs();
  }

  static getInstance(): ErrorRecoveryService {
    if (!ErrorRecoveryService.instance) {
      ErrorRecoveryService.instance = new ErrorRecoveryService();
    }
    return ErrorRecoveryService.instance;
  }

  private initializeRecoveryStrategies() {
    // Estratégia para erros de rede
    this.recoveryStrategies.set('network', {
      type: 'network',
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: (error, retryCount) => {
        // Retry para erros de timeout ou conexão
        return retryCount < 3 && (
          error.message.includes('timeout') ||
          error.message.includes('network') ||
          error.message.includes('fetch')
        );
      },
      fallbackAction: async () => {
        // Usar dados em cache quando disponível
        console.log('Using cached data as fallback');
      }
    });

    // Estratégia para erros de dados
    this.recoveryStrategies.set('data', {
      type: 'data',
      maxRetries: 2,
      retryDelay: 500,
      shouldRetry: (error, retryCount) => {
        return retryCount < 2 && !error.message.includes('parse');
      },
      fallbackAction: async () => {
        // Recarregar dados do storage local
        console.log('Reloading data from local storage');
      }
    });

    // Estratégia para erros de componente
    this.recoveryStrategies.set('component', {
      type: 'component',
      maxRetries: 1,
      retryDelay: 0,
      shouldRetry: () => false, // Não retry automático para erros de componente
      fallbackAction: async () => {
        // Mostrar componente de fallback
        console.log('Showing fallback component');
      }
    });

    // Estratégia para erros de navegação
    this.recoveryStrategies.set('navigation', {
      type: 'navigation',
      maxRetries: 2,
      retryDelay: 100,
      shouldRetry: (error, retryCount) => {
        return retryCount < 2;
      },
      fallbackAction: async () => {
        // Navegar para tela inicial
        console.log('Navigating to home screen');
      }
    });

    // Estratégia para erros de storage
    this.recoveryStrategies.set('storage', {
      type: 'storage',
      maxRetries: 3,
      retryDelay: 200,
      shouldRetry: (error, retryCount) => {
        return retryCount < 3 && !error.message.includes('quota');
      },
      fallbackAction: async () => {
        // Limpar storage antigo
        await this.clearOldStorageData();
      }
    });
  }

  // Registrar um erro
  async logError(
    type: ErrorLog['type'],
    error: Error,
    context?: any
  ): Promise<string> {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      resolved: false,
      retryCount: 0,
      context,
    };

    this.errorLogs.unshift(errorLog);

    // Manter apenas os últimos N logs
    if (this.errorLogs.length > this.MAX_ERROR_LOGS) {
      this.errorLogs = this.errorLogs.slice(0, this.MAX_ERROR_LOGS);
    }

    // Salvar no storage
    await this.saveErrorLogs();

    // Enviar para analytics
    AnalyticsService.trackError(error.name, error.message, {
      errorId: errorLog.id,
      errorType: type,
      context,
    });

    console.error(`[ErrorRecovery] ${type.toUpperCase()}:`, error.message);

    return errorLog.id;
  }

  // Tentar recuperar de um erro
  async attemptRecovery<T>(
    errorType: ErrorLog['type'],
    operation: () => Promise<T>,
    context?: any
  ): Promise<T> {
    const strategy = this.recoveryStrategies.get(errorType);
    
    if (!strategy) {
      throw new Error(`No recovery strategy found for error type: ${errorType}`);
    }

    let lastError: Error;
    let retryCount = 0;

    while (retryCount <= strategy.maxRetries) {
      try {
        const result = await operation();
        
        // Se sucesso após retry, marcar como resolvido
        if (retryCount > 0) {
          await this.markErrorAsResolved(errorType, retryCount);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Log do erro
        const errorId = await this.logError(errorType, lastError, {
          ...context,
          retryCount,
          operation: operation.name || 'anonymous',
        });

        // Verificar se deve tentar novamente
        if (
          retryCount < strategy.maxRetries &&
          (!strategy.shouldRetry || strategy.shouldRetry(lastError, retryCount))
        ) {
          retryCount++;
          
          // Aguardar antes do próximo retry
          if (strategy.retryDelay > 0) {
            await this.delay(strategy.retryDelay * retryCount); // Backoff exponencial
          }
          
          console.log(`[ErrorRecovery] Retry ${retryCount}/${strategy.maxRetries} for ${errorType}`);
          continue;
        }

        // Se chegou aqui, esgotaram-se as tentativas
        break;
      }
    }

    // Tentar ação de fallback
    if (strategy.fallbackAction) {
      try {
        await strategy.fallbackAction();
        console.log(`[ErrorRecovery] Fallback action executed for ${errorType}`);
      } catch (fallbackError) {
        console.error(`[ErrorRecovery] Fallback action failed:`, fallbackError);
      }
    }

    // Lançar o último erro
    throw lastError!;
  }

  // Marcar erro como resolvido
  private async markErrorAsResolved(errorType: string, retryCount: number) {
    const recentErrors = this.errorLogs
      .filter(log => log.type === errorType && !log.resolved)
      .slice(0, 5); // Últimos 5 erros do tipo

    recentErrors.forEach(log => {
      log.resolved = true;
      log.retryCount = retryCount;
    });

    await this.saveErrorLogs();

    // Track recovery success
    AnalyticsService.trackEvent('error_recovery_success', {
      errorType,
      retryCount,
      resolvedErrors: recentErrors.length,
    });
  }

  // Obter estatísticas de erro
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    resolved: number;
    recent: ErrorLog[];
  } {
    const byType: Record<string, number> = {};
    let resolved = 0;

    this.errorLogs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
      if (log.resolved) resolved++;
    });

    const recent = this.errorLogs
      .slice(0, 10)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      total: this.errorLogs.length,
      byType,
      resolved,
      recent,
    };
  }

  // Limpar logs antigos
  async clearOldLogs(olderThanDays: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const initialCount = this.errorLogs.length;
    this.errorLogs = this.errorLogs.filter(
      log => new Date(log.timestamp) > cutoffDate
    );

    await this.saveErrorLogs();
    
    const removedCount = initialCount - this.errorLogs.length;
    console.log(`[ErrorRecovery] Cleared ${removedCount} old error logs`);
    
    return removedCount;
  }

  // Obter logs de erro
  getErrorLogs(limit?: number): ErrorLog[] {
    return limit ? this.errorLogs.slice(0, limit) : [...this.errorLogs];
  }

  // Salvar logs no storage
  private async saveErrorLogs(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.errorLogs)
      );
    } catch (error) {
      console.error('[ErrorRecovery] Failed to save error logs:', error);
    }
  }

  // Carregar logs do storage
  private async loadErrorLogs(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.errorLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[ErrorRecovery] Failed to load error logs:', error);
      this.errorLogs = [];
    }
  }

  // Limpar dados antigos do storage
  private async clearOldStorageData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const oldKeys = keys.filter(key => 
        key.includes('cache_') && 
        key.includes('_old')
      );
      
      if (oldKeys.length > 0) {
        await AsyncStorage.multiRemove(oldKeys);
        console.log(`[ErrorRecovery] Cleared ${oldKeys.length} old cache entries`);
      }
    } catch (error) {
      console.error('[ErrorRecovery] Failed to clear old storage data:', error);
    }
  }

  // Utilitário para delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Registrar estratégia customizada
  registerRecoveryStrategy(type: string, strategy: RecoveryStrategy): void {
    this.recoveryStrategies.set(type, strategy);
  }

  // Verificar saúde do sistema
  async performHealthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Verificar taxa de erro recente
    const recentErrors = this.errorLogs.filter(
      log => new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Última hora
    );

    if (recentErrors.length > 10) {
      issues.push('High error rate in the last hour');
      recommendations.push('Consider investigating recurring issues');
    }

    // Verificar erros não resolvidos
    const unresolvedErrors = this.errorLogs.filter(log => !log.resolved);
    if (unresolvedErrors.length > 20) {
      issues.push('Many unresolved errors');
      recommendations.push('Review error handling strategies');
    }

    // Verificar tipos de erro dominantes
    const stats = this.getErrorStats();
    const dominantType = Object.entries(stats.byType)
      .sort(([,a], [,b]) => b - a)[0];

    if (dominantType && dominantType[1] > stats.total * 0.5) {
      issues.push(`Dominant error type: ${dominantType[0]}`);
      recommendations.push(`Focus on improving ${dominantType[0]} error handling`);
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations,
    };
  }
}

export default ErrorRecoveryService.getInstance();