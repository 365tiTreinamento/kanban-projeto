import { api } from './api';
import { logger } from './logger';
import { storage } from '../utils/storage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    displayName: string;
    globalRole: string;
  };
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  globalRole: string;
}

class AuthService {
  private baseURL = '/auth';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      logger.info('Attempting login', { email });
      
      const response = await api.post<LoginResponse>(`${this.baseURL}/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Validar resposta
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      if (!user.id || !user.email) {
        throw new Error('Invalid user data in response');
      }

      logger.info('Login successful', { userId: user.id, email: user.email });
      return response.data;

    } catch (error: any) {
      logger.error('Login service error', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${this.baseURL}/logout`);
      logger.info('Logout successful');
    } catch (error: any) {
      logger.warn('Logout API call failed', error);
      // Não throw error para logout para não bloquear o usuário
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>(`${this.baseURL}/profile`);
      return response.data;
    } catch (error: any) {
      logger.error('Get profile failed', error);
      throw error;
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await api.post<{ token: string }>(`${this.baseURL}/refresh`);
      return response.data;
    } catch (error: any) {
      logger.error('Refresh token failed', error);
      throw error;
    }
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return storage.isValidAuthData();
  }

  // Obter usuário atual do storage
  getCurrentUser(): User | null {
    return storage.getUser();
  }

  // Obter token atual
  getToken(): string | null {
    return storage.getAuthToken();
  }

  // Manipular erros de autenticação
  private handleAuthError(error: any): Error {
    if (error.response) {
      // Erro do servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error(data?.message || 'Invalid credentials');
        case 403:
          return new Error(data?.message || 'Access denied');
        case 404:
          return new Error('Authentication service not found');
        case 500:
          return new Error('Server error during authentication');
        default:
          return new Error(data?.message || `Authentication failed (${status})`);
      }
    } else if (error.request) {
      // Erro de rede
      return new Error('Network error: Cannot connect to authentication server');
    } else {
      // Erro local
      return new Error(error.message || 'Authentication failed');
    }
  }
}

export const authService = new AuthService();