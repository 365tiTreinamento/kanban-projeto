import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.3.70.107:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Serviço de projetos
export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (project: any) => api.post('/projects', project),
  update: (id: number, project: any) => api.put(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
  getMembers: (projectId: number) => api.get(`/projects/${projectId}/members`),
  addMember: (projectId: number, memberData: any) => 
    api.post(`/projects/${projectId}/members`, memberData),
  removeMember: (projectId: number, userId: number) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

// Serviço de colunas
export const columnService = {
  getAll: (projectId: number) => api.get(`/projects/${projectId}/columns`),
  getById: (id: number) => api.get(`/columns/${id}`),
  create: (projectId: number, column: any) => 
    api.post(`/projects/${projectId}/columns`, column),
  update: (id: number, column: any) => api.put(`/columns/${id}`, column),
  delete: (id: number) => api.delete(`/columns/${id}`),
  reorder: (projectId: number, columns: any[]) =>
    api.put(`/projects/${projectId}/columns/reorder`, { columns }),
};

// Serviço de cards
export const cardService = {
  getAll: (projectId: number) => api.get(`/projects/${projectId}/cards`),
  getById: (id: number) => api.get(`/cards/${id}`),
  create: (projectId: number, card: any) => 
    api.post(`/projects/${projectId}/cards`, card),
  update: (id: number, card: any) => api.put(`/cards/${id}`, card),
  delete: (id: number) => api.delete(`/cards/${id}`),
  move: (id: number, columnId: number, reasonId: number) => 
    api.post(`/cards/${id}/move`, { columnId, reasonId }),
  reorder: (columnId: number, cards: any[]) =>
    api.put(`/columns/${columnId}/cards/reorder`, { cards }),
  getAssignees: (cardId: number) => api.get(`/cards/${cardId}/assignees`),
  addAssignee: (cardId: number, userId: number) =>
    api.post(`/cards/${cardId}/assignees`, { userId }),
  removeAssignee: (cardId: number, userId: number) =>
    api.delete(`/cards/${cardId}/assignees/${userId}`),
};

// Serviço de entradas de tempo
export const timeEntryService = {
  start: (cardId: number, classification: string, note?: string) =>
    api.post(`/cards/${cardId}/time/start`, { classification, note }),
  stop: (cardId: number, note?: string) => 
    api.post(`/cards/${cardId}/time/stop`, { note }),
  pause: (cardId: number, classification: string, note?: string) =>
    api.post(`/cards/${cardId}/time/pause`, { classification, note }),
  resume: (cardId: number, note?: string) =>
    api.post(`/cards/${cardId}/time/resume`, { note }),
  getByCard: (cardId: number) => api.get(`/cards/${cardId}/time`),
  getByUser: (userId: number) => api.get(`/users/${userId}/time`),
  getByProject: (projectId: number) => api.get(`/projects/${projectId}/time`),
  update: (id: number, data: any) => api.put(`/time-entries/${id}`, data),
  delete: (id: number) => api.delete(`/time-entries/${id}`),
};

// Serviço de usuários
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: number) => api.delete(`/users/${id}`),
  search: (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  changePassword: (passwordData: any) => api.put('/users/password', passwordData),
};

// Serviço de logs de atividade
export const activityLogService = {
  getAll: (params?: any) => api.get('/activity-logs', { params }),
  getByUser: (userId: number, params?: any) => 
    api.get(`/users/${userId}/activity-logs`, { params }),
  getByProject: (projectId: number, params?: any) => 
    api.get(`/projects/${projectId}/activity-logs`, { params }),
  getByCard: (cardId: number, params?: any) => 
    api.get(`/cards/${cardId}/activity-logs`, { params }),
};

// Serviço de motivos de movimento
export const movementReasonService = {
  getAll: () => api.get('/movement-reasons'),
  getById: (id: number) => api.get(`/movement-reasons/${id}`),
  create: (reason: any) => api.post('/movement-reasons', reason),
  update: (id: number, reason: any) => api.put(`/movement-reasons/${id}`, reason),
  delete: (id: number) => api.delete(`/movement-reasons/${id}`),
  getActive: () => api.get('/movement-reasons/active'),
};

// Serviço de anexos
export const attachmentService = {
  getByCard: (cardId: number) => api.get(`/cards/${cardId}/attachments`),
  upload: (cardId: number, formData: FormData) =>
    api.post(`/cards/${cardId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: number) => api.delete(`/attachments/${id}`),
  setAsLogo: (id: number) => api.put(`/attachments/${id}/logo`),
};

// Serviço de relatórios
export const reportService = {
  getProjectTimeReport: (projectId: number, params?: any) =>
    api.get(`/projects/${projectId}/reports/time`, { params }),
  getUserTimeReport: (userId: number, params?: any) =>
    api.get(`/users/${userId}/reports/time`, { params }),
  getCardTimeReport: (cardId: number, params?: any) =>
    api.get(`/cards/${cardId}/reports/time`, { params }),
  getMovementReport: (projectId: number, params?: any) =>
    api.get(`/projects/${projectId}/reports/movements`, { params }),
};

// Utilitários da API
export const apiUtils = {
  get: (url: string) => api.get(url),
  post: (url: string, data?: any) => api.post(url, data),
  put: (url: string, data?: any) => api.put(url, data),
  delete: (url: string) => api.delete(url),
  setBaseURL: (baseURL: string) => {
    api.defaults.baseURL = baseURL;
  },
  setAuthToken: (token: string) => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  },
};

export default api;