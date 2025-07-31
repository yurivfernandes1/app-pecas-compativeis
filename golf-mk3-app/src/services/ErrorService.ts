import { Platform } from 'react-native';

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SCREENSHOT_VIOLATION = 'SCREENSHOT_VIOLATION',
  ANALYTICS_ERROR = 'ANALYTICS_ERROR',
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  NAVIGATION_ERROR = 'NAVIGATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
  platform: string;
  appVersion: string;
  stackTrace?: string;
  context?: {
    screen?: string;
    action?: string;
    component?: string;
    props?: any;
  };
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  type: 'primary' | 'secondary';
}

class ErrorService {
  private static instance: ErrorService;
  private errors: AppError[] = [];
  private maxErrors = 100;
  private errorHandlers: Map<ErrorType, (error: AppError) => void> = new Map();

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // Registrar handler para tipo específico de erro
  registerErrorHandler(type: ErrorType, handler: (error: AppError) => void): void {
    this.errorHandlers.set(type, handler);
  }

  // Capturar e processar erro
  captureError(
    type: ErrorType,
    message: string,
    details?: any,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: AppError['context']
  ): AppError {
    const error: AppError = {
      id: this.generateErrorId(),
      type,
      severity,
      message,
      details,
      timestamp: Date.now(),
      platform: Platform.OS,
      appVersion: '1.0.0', // TODO: Get from app config
      stackTrace: this.captureStackTrace(),
      context,
    };

    // Adicionar à lista de erros
    this.addError(error);

    // Executar handler específico se existir
    const handler = this.errorHandlers.get(type);
    if (handler) {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Log do erro
    this.logError(error);

    // Reportar erro se crítico
    if (severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(error);
    }

    return error;
  }

  // Capturar erro de componente React
  captureComponentError(
    error: Error,
    errorInfo: { componentStack: string },
    componentName?: string
  ): AppError {
    return this.captureError(
      ErrorType.COMPONENT_ERROR,
      error.message,
      {
        originalError: error.toString(),
        componentStack: errorInfo.componentStack,
        componentName,
      },
      ErrorSeverity.HIGH,
      {
        component: componentName,
      }
    );
  }

  // Capturar erro de rede
  captureNetworkError(
    url: string,
    method: string,
    status?: number,
    response?: any
  ): AppError {
    return this.captureError(
      ErrorType.NETWORK_ERROR,
      `Network request failed: ${method} ${url}`,
      {
        url,
        method,
        status,
        response,
      },
      status && status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      {
        action: `${method} ${url}`,
      }
    );
  }

  // Capturar erro de dados
  captureDataError(
    operation: string,
    data?: any,
    expectedFormat?: string
  ): AppError {
    return this.captureError(
      ErrorType.DATA_CORRUPTION,
      `Data operation failed: ${operation}`,
      {
        operation,
        data,
        expectedFormat,
      },
      ErrorSeverity.HIGH
    );
  }

  // Capturar erro de navegação
  captureNavigationError(
    route: string,
    params?: any,
    error?: Error
  ): AppError {
    return this.captureError(
      ErrorType.NAVIGATION_ERROR,
      `Navigation failed to: ${route}`,
      {
        route,
        params,
        originalError: error?.toString(),
      },
      ErrorSeverity.MEDIUM,
      {
        action: `navigate_to_${route}`,
      }
    );
  }

  // Obter estratégia de recuperação para erro
  getRecoveryStrategy(error: AppError): ErrorRecoveryAction[] {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return [
          {
            label: 'Tentar Novamente',
            action: () => this.retryLastNetworkRequest(error),
            type: 'primary',
          },
          {
            label: 'Usar Cache',
            action: () => this.useCachedData(error),
            type: 'secondary',
          },
        ];

      case ErrorType.DATA_CORRUPTION:
        return [
          {
            label: 'Recarregar Dados',
            action: () => this.reloadData(error),
            type: 'primary',
          },
          {
            label: 'Usar Backup',
            action: () => this.useBackupData(error),
            type: 'secondary',
          },
        ];

      case ErrorType.COMPONENT_ERROR:
        return [
          {
            label: 'Recarregar Tela',
            action: () => this.reloadScreen(error),
            type: 'primary',
          },
          {
            label: 'Voltar',
            action: () => this.goBack(error),
            type: 'secondary',
          },
        ];

      case ErrorType.NAVIGATION_ERROR:
        return [
          {
            label: 'Ir para Home',
            action: () => this.navigateToHome(error),
            type: 'primary',
          },
          {
            label: 'Tentar Novamente',
            action: () => this.retryNavigation(error),
            type: 'secondary',
          },
        ];

      default:
        return [
          {
            label: 'Recarregar App',
            action: () => this.reloadApp(error),
            type: 'primary',
          },
        ];
    }
  }

  // Obter mensagem amigável para o usuário
  getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return 'Problema de conexão. Verifique sua internet e tente novamente.';
      
      case ErrorType.DATA_CORRUPTION:
        return 'Dados corrompidos detectados. Tentaremos recuperar automaticamente.';
      
      case ErrorType.COMPONENT_ERROR:
        return 'Algo deu errado nesta tela. Vamos tentar recarregar.';
      
      case ErrorType.NAVIGATION_ERROR:
        return 'Não foi possível navegar para esta tela.';
      
      case ErrorType.STORAGE_ERROR:
        return 'Problema ao salvar dados. Verifique o espaço disponível.';
      
      case ErrorType.PERMISSION_DENIED:
        return 'Permissão negada. Verifique as configurações do app.';
      
      default:
        return 'Ocorreu um erro inesperado. Nossa equipe foi notificada.';
    }
  }

  // Verificar se erro deve ser mostrado ao usuário
  shouldShowToUser(error: AppError): boolean {
    // Não mostrar erros de analytics ou screenshot
    if (error.type === ErrorType.ANALYTICS_ERROR || 
        error.type === ErrorType.SCREENSHOT_VIOLATION) {
      return false;
    }

    // Mostrar erros críticos e altos
    if (error.severity === ErrorSeverity.CRITICAL || 
        error.severity === ErrorSeverity.HIGH) {
      return true;
    }

    // Mostrar erros médios que afetam funcionalidade
    if (error.severity === ErrorSeverity.MEDIUM && 
        (error.type === ErrorType.NETWORK_ERROR || 
         error.type === ErrorType.DATA_CORRUPTION ||
         error.type === ErrorType.NAVIGATION_ERROR)) {
      return true;
    }

    return false;
  }

  // Obter estatísticas de erros
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: AppError[];
  } {
    const byType = {} as Record<ErrorType, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    // Inicializar contadores
    Object.values(ErrorType).forEach(type => {
      byType[type] = 0;
    });
    Object.values(ErrorSeverity).forEach(severity => {
      bySeverity[severity] = 0;
    });

    // Contar erros
    this.errors.forEach(error => {
      byType[error.type]++;
      bySeverity[error.severity]++;
    });

    // Erros recentes (últimas 24h)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = this.errors.filter(error => error.timestamp > oneDayAgo);

    return {
      total: this.errors.length,
      byType,
      bySeverity,
      recent,
    };
  }

  // Limpar erros antigos
  clearOldErrors(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    this.errors = this.errors.filter(error => error.timestamp > cutoff);
  }

  // Métodos privados
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private captureStackTrace(): string {
    try {
      throw new Error();
    } catch (e) {
      return (e as Error).stack || 'No stack trace available';
    }
  }

  private addError(error: AppError): void {
    this.errors.unshift(error);
    
    // Manter apenas os últimos N erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const message = `[${error.type}] ${error.message}`;
    
    switch (logLevel) {
      case 'error':
        console.error(message, error);
        break;
      case 'warn':
        console.warn(message, error);
        break;
      default:
        console.log(message, error);
    }
  }

  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'log' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      default:
        return 'log';
    }
  }

  private reportCriticalError(error: AppError): void {
    // TODO: Implementar envio para serviço de monitoramento
    console.error('CRITICAL ERROR:', error);
  }

  // Estratégias de recuperação
  private async retryLastNetworkRequest(error: AppError): Promise<void> {
    // TODO: Implementar retry de request
    console.log('Retrying network request:', error.details?.url);
  }

  private async useCachedData(error: AppError): Promise<void> {
    // TODO: Implementar uso de cache
    console.log('Using cached data for:', error.details?.url);
  }

  private async reloadData(error: AppError): Promise<void> {
    // TODO: Implementar reload de dados
    console.log('Reloading data for:', error.details?.operation);
  }

  private async useBackupData(error: AppError): Promise<void> {
    // TODO: Implementar uso de backup
    console.log('Using backup data for:', error.details?.operation);
  }

  private async reloadScreen(error: AppError): Promise<void> {
    // TODO: Implementar reload de tela
    console.log('Reloading screen:', error.context?.screen);
  }

  private async goBack(error: AppError): Promise<void> {
    // TODO: Implementar navegação para trás
    console.log('Going back from:', error.context?.screen);
  }

  private async navigateToHome(error: AppError): Promise<void> {
    // TODO: Implementar navegação para home
    console.log('Navigating to home from:', error.context?.screen);
  }

  private async retryNavigation(error: AppError): Promise<void> {
    // TODO: Implementar retry de navegação
    console.log('Retrying navigation to:', error.details?.route);
  }

  private async reloadApp(error: AppError): Promise<void> {
    // TODO: Implementar reload do app
    console.log('Reloading app due to:', error.type);
  }
}

export default ErrorService;