import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useCallback, useEffect, useState } from "react";
import { AuthResponse, UserResponse } from "../types/Auth";

const key = "expenses-user";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (login: AuthResponse) => void;
  logout: () => void;
  getToken: () => string;
  user: UserResponse | null;
}

export const AuthContext = createContext<AuthContext | null>(null);

function getStoredUser() {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored) as AuthResponse;
  }
  return null;
}

function setStoredUser(data: AuthResponse | null) {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(getStoredUser()?.user || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const logout = useCallback(() => {
    setStoredUser(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((data: AuthResponse) => {
    setStoredUser(data);
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  const getToken = useCallback(() => {
    const stored = getStoredUser();
    if (stored) {
      return stored.token;
    } else {
      logout();
      return "";
    }
  }, [logout]);

  useEffect(() => {
    setUser(getStoredUser()?.user || null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getToken }}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}
