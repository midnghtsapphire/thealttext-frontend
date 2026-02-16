/**
 * TheAltText Frontend — Authentication Hook
 * Standalone auth state management.
 */
import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('thealttext_token');
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const res = await authAPI.me();
      setUser(res.data);
    } catch {
      localStorage.removeItem('thealttext_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('thealttext_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const res = await authAPI.register({ email, password, full_name: fullName });
    localStorage.setItem('thealttext_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('thealttext_token');
    setUser(null);
  };

  return { user, loading, isAuthenticated, login, register, logout, refreshUser };
}
