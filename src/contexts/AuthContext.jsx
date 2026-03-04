'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, setSession, clearSession, isAdmin } from '../services/authService';
import { isUserBlocked } from '../services/blockService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login as guest - no sign in/sign up required
    const guest = { name: 'Guest', email: 'guest@cardmaker.app', role: 'guest', isGuest: true };
    setUser(guest);
    setLoading(false);
  }, []);

  function login(userData) {
    setSession(userData);
    setUser(userData);
  }

  function loginAsGuest() {
    const guest = { name: 'Guest', email: 'guest@cardmaker.app', role: 'guest', isGuest: true };
    setUser(guest);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const isGuest = !!user?.isGuest;
  const isFreePlan = !isGuest && user?.plan !== 'premium';

  const value = {
    user,
    login,
    loginAsGuest,
    logout,
    loading,
    isGuest,
    isFreePlan,
    isSuperAdmin: user && !isGuest ? isAdmin(user.email) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
