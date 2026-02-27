'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, setSession, clearSession, isAdmin } from '../services/authService';
import { isUserBlocked } from '../services/blockService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const session = getSession();
      if (session) {
        try {
          const blocked = await isUserBlocked(session.email);
          if (blocked) {
            clearSession();
          } else {
            setUser(session);
          }
        } catch {
          setUser(session); // allow login if block-check fails
        }
      }
      setLoading(false);
    }
    restoreSession();
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

  const value = {
    user,
    login,
    loginAsGuest,
    logout,
    loading,
    isGuest,
    isSuperAdmin: user && !isGuest ? isAdmin(user.email) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
