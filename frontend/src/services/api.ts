import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.3.70.107:8085/api';

// Log da URL da API
logger.debug('API Base URL', { API_BASE_URL });

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para debug
api.interceptors.request.use(
  (config) => {
    logger.debug('API Request', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Interceptor de response para debug
api.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    logger.error('API Response Error', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);