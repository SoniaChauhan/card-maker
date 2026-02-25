import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, setSession, clearSession, isAdmin } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  function login(userData) {
    setSession(userData);
    setUser(userData);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isSuperAdmin: user ? isAdmin(user.email) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
