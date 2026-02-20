"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ApiMode, apiRequestToProvider, getApiBase, getProvidersForMode } from "@/lib/api-client";

type AuthUser = {
  id: number;
  email: string;
  role: "client" | "freelancer" | "admin";
  fullName?: string;
  avatarUrl?: string;
  avatar_url?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrated: boolean;
  apiMode: ApiMode;
  setApiMode: (mode: ApiMode) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { email: string; password: string; fullName: string; role: AuthUser["role"] }) => Promise<boolean>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN = "authToken";
const STORAGE_USER = "authUser";
const STORAGE_API_MODE = "apiMode";

function decodeJwt(token: string): { sub?: string; email?: string; role?: AuthUser["role"]; fullName?: string; full_name?: string; avatar_url?: string } {
  const payload = token.split(".")[1];
  if (!payload) {
    return {};
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = typeof window === "undefined"
    ? Buffer.from(normalized, "base64").toString("utf8")
    : atob(normalized);

  try {
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

function getInitialAuth() {
  const defaultApiMode = (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || "auto";

  if (typeof window === "undefined") {
    return { token: null, user: null, apiMode: defaultApiMode };
  }

  const token = localStorage.getItem(STORAGE_TOKEN);
  const rawUser = localStorage.getItem(STORAGE_USER);
  const apiMode = (localStorage.getItem(STORAGE_API_MODE) as ApiMode) || defaultApiMode;

  return {
    token: token || null,
    user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
    apiMode,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = getInitialAuth();
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<AuthUser | null>(initial.user);
  const [apiMode, setApiModeState] = useState<ApiMode>(initial.apiMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch fresh user data on mount to get updated avatar
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token || typeof window === "undefined") {
        setIsHydrated(true);
        return;
      }
      
      // Якщо це фейковий токен адміна - не робимо fetch до API
      if (token.startsWith('admin-token-')) {
        setIsHydrated(true);
        return;
      }
      
      try {
        const apiBase = getApiBase("fastapi");
        
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(prev => prev ? { 
            ...prev, 
            avatarUrl: userData.avatar_url || userData.avatarUrl || prev.avatarUrl,
            fullName: userData.full_name || userData.fullName || prev.fullName
          } : null);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      } finally {
        setIsHydrated(true);
      }
    };
    
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (token) {
      localStorage.setItem(STORAGE_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_TOKEN);
    }

    if (user) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER);
    }
  }, [token, user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_API_MODE, apiMode);
    }
  }, [apiMode]);

  const setApiMode = (mode: ApiMode) => {
    setApiModeState(mode);
  };

  const login = async (email: string, password: string) => {
    const providers = getProvidersForMode(apiMode);
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const body = { email, password };
        const response = await apiRequestToProvider<{ accessToken?: string; access_token?: string }>(
          provider,
          "/auth/login",
          { method: "POST", body }
        );

        const newToken = response.accessToken || response.access_token;
        if (!newToken) {
          throw new Error("Missing token in response");
        }

        const payload = decodeJwt(newToken);
        const role = payload.role || "client";
        const id = payload.sub ? Number(payload.sub) : 0;
        const fullName = payload.fullName || payload.full_name;
        const avatarUrl = payload.avatar_url || undefined;

        setToken(newToken);
        setUser({ id, email, role, fullName, avatarUrl });
        return true;
      } catch (error) {
        lastError = error as Error;
      }
    }

    console.error(lastError);
    return false;
  };

  const register = async (payload: { email: string; password: string; fullName: string; role: AuthUser["role"] }) => {
    const providers = getProvidersForMode(apiMode);
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const body = provider === "nest"
          ? { email: payload.email, password: payload.password, fullName: payload.fullName, role: payload.role }
          : { email: payload.email, password: payload.password, full_name: payload.fullName, role: payload.role };

        const response = await apiRequestToProvider<{ accessToken?: string; access_token?: string }>(
          provider,
          "/auth/register",
          { method: "POST", body }
        );

        const newToken = response.accessToken || response.access_token;
        if (!newToken) {
          throw new Error("Missing token in response");
        }

        const decoded = decodeJwt(newToken);
        const role = decoded.role || payload.role;
        const id = decoded.sub ? Number(decoded.sub) : 0;
        const fullName = decoded.fullName || decoded.full_name || payload.fullName;

        setToken(newToken);
        setUser({ id, email: payload.email, role, fullName });
        return true;
      } catch (error) {
        lastError = error as Error;
      }
    }

    console.error(lastError);
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setUser((prev) => prev ? { ...prev, avatarUrl } : null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      isHydrated,
      apiMode,
      setApiMode,
      login,
      register,
      logout,
      updateUserAvatar,
    }),
    [user, token, isHydrated, apiMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
