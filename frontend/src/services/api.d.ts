declare module 'services/api' {
  export const authService: {
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
    register: (userData: any) => Promise<any>;
    getProfile: () => Promise<any>;
  };
  // ... outras exportações
}