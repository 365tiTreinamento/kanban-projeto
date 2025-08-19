import { useEffect, useRef } from 'react';
import { logger } from '../services/logger';

export const useLogger = (componentName: string) => {
  const mountTime = useRef(performance.now());

  useEffect(() => {
    logger.debug(`Component ${componentName} mounted`);
    
    return () => {
      const lifetime = performance.now() - mountTime.current;
      logger.debug(`Component ${componentName} unmounted`, { lifetime: `${lifetime.toFixed(2)}ms` });
    };
  }, [componentName]);

  const logAction = (action: string, details?: any) => {
    logger.action(`${componentName}: ${action}`, details);
  };

  const logError = (error: any, context?: string) => {
    logger.error(`${componentName}: ${context || 'Error'}`, error);
  };

  const logPerf = (marker: string) => {
    logger.perf(`${componentName}: ${marker}`, mountTime.current);
  };

  return {
    logAction,
    logError,
    logPerf,
    debug: (message: string, data?: any) => logger.debug(`${componentName}: ${message}`, data),
    info: (message: string, data?: any) => logger.info(`${componentName}: ${message}`, data),
    warn: (message: string, data?: any) => logger.warn(`${componentName}: ${message}`, data),
  };
};