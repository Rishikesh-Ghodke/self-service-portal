import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await authApi.getMe();
      setUser(result.data);
      setStatus('authenticated');
    } catch (err) {
      setUser(null);
      setStatus(err.status === 401 ? 'unauthenticated' : 'error');
      if (err.status !== 401) setError(err.message);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await authApi.signInWithGoogle();
      setUser(result.data);
      setStatus('authenticated');
    } catch (err) {
      setStatus('unauthenticated');
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, error, signIn, signOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
