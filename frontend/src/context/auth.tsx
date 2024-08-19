import { createContext, useCallback, useEffect, useState } from 'react';
import { AuthResponse } from '../types/Auth';

const key = 'tanstack.auth.user';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (login: AuthResponse) => void;
  logout: () => void;
  user: string | null;
}

export const AuthContext = createContext<AuthContext | null>(null);

function getStoredUser() {
  return localStorage.getItem(key);
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user);
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const logout = useCallback(() => {
    setStoredUser(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((data: AuthResponse) => {
    setStoredUser(data.user);
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
