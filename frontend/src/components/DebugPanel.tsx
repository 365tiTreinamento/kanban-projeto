import React, { useState, useEffect } from 'react';
import { logger } from '../services/logger';
import './DebugPanel.css';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen && autoRefresh) {
      const interval = setInterval(() => {
        setLogs(logger.getLogs());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, autoRefresh]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setLogs(logger.getLogs());
    }
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const downloadLogs = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-debug-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button className="debug-panel-toggle" onClick={togglePanel}>
        🐞 Debug
      </button>
    );
  }

  return (
    <div className="debug-panel">
      <div className="debug-panel-header">
        <h3>Debug Panel</h3>
        <div className="debug-actions">
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button onClick={clearLogs}>Clear</button>
          <button onClick={downloadLogs}>Download</button>
          <button onClick={togglePanel}>Close</button>
        </div>
      </div>

      <div className="debug-panel-content">
        <div className="log-filters">
          <span>Filter: </span>
          <button onClick={() => setLogs(logger.getLogs())}>All</button>
          <button onClick={() => setLogs(logger.getLogs().filter(log => log.level === 'ERROR'))}>Errors</button>
          <button onClick={() => setLogs(logger.getLogs().filter(log => log.level === 'ACTION'))}>Actions</button>
        </div>

        <div className="logs-list">
          {logs.slice().reverse().map((log, index) => (
            <div key={index} className={`log-entry log-${log.level.toLowerCase()}`}>
              <span className="log-time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="log-level">[{log.level}]</span>
              <span className="log-message">{log.message}</span>
              {log.data && (
                <pre className="log-data">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;