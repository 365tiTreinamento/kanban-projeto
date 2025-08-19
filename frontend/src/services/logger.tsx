// Adicione este método à classe Logger
checkStorage(); void {
  if (this.isDevelopment) {
    try {
      const keys = Object.keys(localStorage);
      this.debug('LocalStorage contents', { keys });
      
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        this.debug(`Storage item: ${key}`, { value });
      });
    } catch (error) {
      this.error('Error checking localStorage', error);
    }
  }
}