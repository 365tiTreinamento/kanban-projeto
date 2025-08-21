import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { logger } from '../services/logger';
import { storage } from '../utils/storage';

interface User {
  id: number;
  email: string;
  displayName: string;
  globalRole: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = storage.getAuthToken();
      const userData = storage.get<User>('user');

      logger.debug('Auth initialization', { hasToken: !!token, hasUserData: !!userData });

      if (token && userData && userData.id && userData.email) {
        setUser(userData);
        logger.info('User authenticated from storage', { userId: userData.id });
      } else {
        logger.debug('No valid auth data found in storage');
        storage.clearAuthData();
      }
    } catch (error) {
      logger.error('Error initializing auth', error);
      storage.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      logger.info('Login attempt', { email });
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data;
      
      // Validar dados do servidor
      if (!token || !userData || !userData.id || !userData.email) {
        throw new Error('Invalid response from server');
      }

      storage.setAuthData(token, userData);
      setUser(userData);
      
      logger.info('Login successful', { userId: userData.id, email: userData.email });
    } catch (error: any) {
      logger.error('Login failed', error);
      storage.clearAuthData();
      setUser(null);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    logger.info('User logout', { userId: user?.id });
    storage.clearAuthData();
    setUser(null);
    
    // Logout no servidor (não bloqueante)
    authService.logout().catch(error => {
      logger.warn('Logout API call failed', error);
    });
  };

  const value = {
    user,
    login,
    logout,
    loading
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