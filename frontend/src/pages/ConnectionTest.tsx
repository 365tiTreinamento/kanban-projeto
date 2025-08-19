import React, { useState } from 'react';
import { api } from '../services/api';
import { logger } from '../services/logger';

const ConnectionTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setResult({
        success: true,
        status: response.status,
        data: response.data
      });
      logger.info('Connection test successful', response.data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      logger.error('Connection test failed', error);
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/test');
      setResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Connection Test</h2>
      <button onClick={testConnection} disabled={loading}>
        Test API Connection
      </button>
      <button onClick={testAuthEndpoint} disabled={loading} style={{ marginLeft: '10px' }}>
        Test Auth Endpoint
      </button>
      
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;