export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  component?: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
  error?: string;
  details?: any;
}

export interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  checks: {
    name: string;
    status: 'passed' | 'failed';
    message: string;
    duration: number;
  }[];
  performance: {
    loadTime: number;
    memoryUsage?: number;
    networkStatus: 'online' | 'offline';
  };
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private createLogEntry(
    level: LogEntry['level'], 
    message: string, 
    component?: string, 
    data?: any
  ): LogEntry {
    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      component,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  info(message: string, component?: string, data?: any): void {
    const entry = this.createLogEntry('info', message, component, data);
    this.addLog(entry);
    console.log(`[INFO] ${component ? `[${component}] ` : ''}${message}`, data);
  }

  warn(message: string, component?: string, data?: any): void {
    const entry = this.createLogEntry('warn', message, component, data);
    this.addLog(entry);
    console.warn(`[WARN] ${component ? `[${component}] ` : ''}${message}`, data);
  }

  error(message: string, component?: string, data?: any): void {
    const entry = this.createLogEntry('error', message, component, data);
    this.addLog(entry);
    console.error(`[ERROR] ${component ? `[${component}] ` : ''}${message}`, data);
  }

  debug(message: string, component?: string, data?: any): void {
    const entry = this.createLogEntry('debug', message, component, data);
    this.addLog(entry);
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${component ? `[${component}] ` : ''}${message}`, data);
    }
  }

  private addLog(entry: LogEntry): void {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Salvar no localStorage
    try {
      localStorage.setItem('app-logs', JSON.stringify(this.logs.slice(0, 100))); // Manter apenas os últimos 100
    } catch (error) {
      console.warn('Failed to save logs to localStorage:', error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('app-logs');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Carregar logs do localStorage na inicialização
  loadStoredLogs(): void {
    try {
      const storedLogs = localStorage.getItem('app-logs');
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        if (Array.isArray(parsed)) {
          this.logs = parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load logs from localStorage:', error);
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Carregar logs armazenados na inicialização
logger.loadStoredLogs();

// Capturar erros globais
window.addEventListener('error', (event) => {
  logger.error(
    `Global Error: ${event.message}`,
    'Global',
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }
  );
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error(
    `Unhandled Promise Rejection: ${event.reason}`,
    'Global',
    {
      reason: event.reason,
      stack: event.reason?.stack
    }
  );
});

export default logger;
