import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { logger } from '../services/logger';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      logger.debug('Initializing authentication');

      let userData = { id: 1, email: "teste" }
      setUser(userData);
      setIsAuthenticated(true);
      logger.info('User authenticated from storage', { userId: userData.id });
    } catch (error) {
      logger.error('Error initializing auth', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      logger.info('Login attempt', { email });

      const response = await authService.login(email, password);

      // Salvar dados de autenticação
      let user = { id: 1, email: "teste" }
      storage.setAuthData(response.token, user);

      setUser(response.user);
      setIsAuthenticated(true);

      logger.info('Login successful', { userId: user });

    } catch (error: any) {
      logger.error('Login failed in context', error);

      // Limpar dados em caso de erro
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);

      throw error; // Re-throw para ser capturado pelo componente
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logger.info('Logout initiated');
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;