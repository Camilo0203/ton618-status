import { useState, useEffect, useCallback, useRef } from 'react';
import { runAllChecks } from '../services/checker.js';

const POLL_INTERVAL = parseInt(import.meta.env.VITE_POLL_INTERVAL_MS || '60000', 10);
const HISTORY_LENGTH = 90; // 90 data points shown in uptime bars

export function useStatusPoller() {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const poll = useCallback(async () => {
    try {
      const data = await runAllChecks();
      setResults(data);
      setError(null);

      setHistory(prev => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(data)) {
          if (key === 'checkedAt') continue;
          const arr = prev[key] || [];
          next[key] = [...arr, val.status].slice(-HISTORY_LENGTH);
        }
        return next;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [poll]);

  return { results, history, loading, error, refresh: poll };
}
