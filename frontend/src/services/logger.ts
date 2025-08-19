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

    const sensitiveFields = ['password', 'token', 'authorization', 'email', 'accessToken', 'refreshToken'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
      if (sanitized.headers?.authorization) {
        sanitized.headers.authorization = '***REDACTED***';
      }
      if (sanitized.config?.headers?.Authorization) {
        sanitized.config.headers.Authorization = '***REDACTED***';
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
    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  // Verificar conteúdo do storage (apenas desenvolvimento)
  checkStorage(): void {
    if (this.isDevelopment) {
      try {
        const keys = Object.keys(localStorage);
        this.debug('LocalStorage contents', { keys });
        
        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            this.debug(`Storage item: ${key}`, { 
              value: value && value.length > 100 ? value.substring(0, 100) + '...' : value 
            });
          } catch (error) {
            this.debug(`Error reading key: ${key}`, { error: error.message });
          }
        });
      } catch (error) {
        this.error('Error checking localStorage', error);
      }
    }
  }

  // Verificar dados de autenticação
  checkAuthStorage(): void {
    if (this.isDevelopment) {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        this.debug('Auth storage check', {
          hasToken: !!token,
          tokenLength: token?.length,
          hasUser: !!user,
          userValid: user ? this.isValidJson(user) : false
        });

        if (user) {
          try {
            const userData = JSON.parse(user);
            this.debug('User data structure', {
              id: userData?.id,
              email: userData?.email,
              keys: userData ? Object.keys(userData) : []
            });
          } catch (error) {
            this.debug('User data is invalid JSON', { 
              userValue: user.substring(0, 50) + (user.length > 50 ? '...' : '') 
            });
          }
        }
      } catch (error) {
        this.error('Error checking auth storage', error);
      }
    }
  }

  // Validar se string é JSON válido
  private isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Limpar dados de autenticação corrompidos
  clearCorruptedAuthData(): void {
    try {
      const user = localStorage.getItem('user');
      if (user && !this.isValidJson(user)) {
        this.warn('Clearing corrupted user data', { user });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      this.error('Error clearing corrupted auth data', error);
    }
  }
}

// Instância singleton do logger
export const logger = new Logger();

// Inicializar verificação de dados corrompidos
if (typeof window !== 'undefined') {
  logger.clearCorruptedAuthData();
  logger.checkAuthStorage();
}