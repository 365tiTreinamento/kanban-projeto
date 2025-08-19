import { logger } from '../services/logger';

export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === 'undefined' || item === 'null') {
        return defaultValue;
      }
      
      // Tentar fazer parse como JSON primeiro
      try {
        return JSON.parse(item) as T;
      } catch {
        // Se falhar o parse, retornar como string
        return item as unknown as T;
      }
    } catch (error) {
      logger.error(`Error reading from localStorage key: ${key}`, error);
      return defaultValue;
    }
  },

  set: (key: string, value: any): void => {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
        return;
      }

      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      logger.error(`Error writing to localStorage key: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error(`Error removing from localStorage key: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Error clearing localStorage', error);
    }
  },

  // Métodos específicos para auth
  getAuthToken: (): string | null => {
    return storage.get<string>('token');
  },

  getUser: (): any | null => {
    return storage.get('user');
  },

  setAuthData: (token: string, user: any): void => {
    storage.set('token', token);
    storage.set('user', user);
  },

  clearAuthData: (): void => {
    storage.remove('token');
    storage.remove('user');
  }
};