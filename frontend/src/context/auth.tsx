import { createContext, useCallback, useEffect, useState } from 'react';
import { useSignIn } from '../services/authentication';
import { Login } from '../types/Auth';

const key = 'tanstack.auth.user';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (login: Login) => Promise<void>;
  logout: () => Promise<void>;
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
  const isAuthenticated = !!user;
  const loginMutation = useSignIn();

  const logout = useCallback(async () => {
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (login: Login) => {
      loginMutation.mutate(login, {
        onSuccess: (data) => {
          setStoredUser(data.user);
          setUser(data.user);
        },
        onError: (error) => {
          console.error('Error logging in: ', error);
          logout();
        },
      });
    },

    [loginMutation, logout]
  );

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
