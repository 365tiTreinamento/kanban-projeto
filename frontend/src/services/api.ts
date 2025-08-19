import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.3.70.107:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  register: (userData: any) => api.post('/auth/register', userData),
  
  getProfile: () => api.get('/auth/profile'),
};

// Serviço de projetos
export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (project: any) => api.post('/projects', project),
  update: (id: number, project: any) => api.put(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Serviço de cards
export const cardService = {
  getAll: (projectId: number) => api.get(`/projects/${projectId}/cards`),
  getById: (id: number) => api.get(`/cards/${id}`),
  create: (projectId: number, card: any) => api.post(`/projects/${projectId}/cards`, card),
  update: (id: number, card: any) => api.put(`/cards/${id}`, card),
  delete: (id: number) => api.delete(`/cards/${id}`),
  move: (id: number, columnId: number, reasonId: number) => 
    api.post(`/cards/${id}/move`, { columnId, reasonId }),
};

// Serviço de colunas
export const columnService = {
  getAll: (projectId: number) => api.get(`/projects/${projectId}/columns`),
  getById: (id: number) => api.get(`/columns/${id}`),
  create: (projectId: number, column: any) => api.post(`/projects/${projectId}/columns`, column),
  update: (id: number, column: any) => api.put(`/columns/${id}`, column),
  delete: (id: number) => api.delete(`/columns/${id}`),
};

// Serviço de entradas de tempo
export const timeEntryService = {
  start: (cardId: number, classification: string) =>
    api.post(`/cards/${cardId}/time/start`, { classification }),
  stop: (cardId: number) => api.post(`/cards/${cardId}/time/stop`),
  getByCard: (cardId: number) => api.get(`/cards/${cardId}/time`),
  getByUser: (userId: number) => api.get(`/users/${userId}/time`),
};

// Serviço de usuários
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Serviço de logs de atividade
export const activityLogService = {
  getAll: () => api.get('/activity-logs'),
  getByUser: (userId: number) => api.get(`/users/${userId}/activity-logs`),
  getByProject: (projectId: number) => api.get(`/projects/${projectId}/activity-logs`),
};

// Serviço de motivos de movimento
export const movementReasonService = {
  getAll: () => api.get('/movement-reasons'),
  getById: (id: number) => api.get(`/movement-reasons/${id}`),
  create: (reason: any) => api.post('/movement-reasons', reason),
  update: (id: number, reason: any) => api.put(`/movement-reasons/${id}`, reason),
  delete: (id: number) => api.delete(`/movement-reasons/${id}`),
};

export default api;