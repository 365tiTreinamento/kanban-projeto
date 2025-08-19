class Logger {
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  // Log de informação geral
  info(message: string, data?: any): void {
    this.log('INFO', message, data, '#3498db');
  }

  // Log de debug (apenas em desenvolvimento)
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log('DEBUG', message, data, '#2ecc71');
    }
  }

  // Log de warning
  warn(message: string, data?: any): void {
    this.log('WARN', message, data, '#f39c12');
  }

  // Log de erro
  error(message: string, error?: any): void {
    this.log('ERROR', message, error, '#e74c3c');
  }

  // Log de ações do usuário
  action(action: string, details?: any): void {
    this.log('ACTION', action, details, '#9b59b6');
  }

  // Log de performance
  perf(marker: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.log('PERF', `${marker} - ${duration.toFixed(2)}ms`, null, '#1abc9c');
  }

  // Método base de logging
  private log(level: string, message: string, data: any, color: string): void {
    const timestamp = new Date().toISOString();
    const logEntry: any = {
      timestamp,
      level,
      message,
      ...(data && { data: this.sanitizeData(data) })
    };

    // Console colorido para desenvolvimento
    if (this.isDevelopment) {
      const style = `color: ${color}; font-weight: bold`;
      console.log(`%c[${timestamp}] ${level}: ${message}`, style);
      if (data) {
        console.log('%cData:', 'color: #7f8c8d', this.sanitizeData(data));
      }
    } else {
      // Em produção, enviar para servidor/analytics
      this.sendToServer(logEntry);
    }

    // Salvar no localStorage para debug (últimos 100 logs)
    this.saveToLocalStorage(logEntry);
  }

  // Sanitizar dados sensíveis
  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveFields = ['password', 'token', 'authorization', 'email'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  // Enviar logs para o servidor (em produção)
  private sendToServer(logEntry: any): void {
    if (!this.isDevelopment) {
      // Implementar envio para API/analytics
      try {
        // Exemplo: enviar para endpoint de logs
        fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        }).catch(() => {
          // Falha silenciosa para não poluir console
        });
      } catch (error) {
        // Ignorar erros de envio
      }
    }
  }

  // Salvar logs no localStorage para debug
  private saveToLocalStorage(logEntry: any): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      const newLogs = [...existingLogs, logEntry].slice(-100); // Manter apenas últimos 100 logs
      localStorage.setItem('app_logs', JSON.stringify(newLogs));
    } catch (error) {
      console.error('Failed to save logs to localStorage:', error);
    }
  }

  // Obter logs do localStorage
  getLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Limpar logs
  clearLogs(): void {
    localStorage.removeItem('app_logs');
  }
}

// Instância singleton do logger
export const logger = new Logger();