"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";

type AdminContextType = {
  isAdmin: boolean;
  isHydrated: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeCredentials: (newUsername: string, newPassword: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isAdmin, isHydrated, login, logout } = useAuth();

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    const ok = await login(email, password);
    if (!ok) {
      return false;
    }

    if (typeof window === "undefined") {
      return false;
    }

    const rawUser = localStorage.getItem("authUser");
    if (!rawUser) {
      return false;
    }

    try {
      const user = JSON.parse(rawUser) as { role?: string };
      return user.role === "admin";
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    logout();
  };

  const changeCredentials = () => {
    // Admin credentials are managed by the backend.
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isHydrated, loginAdmin, logoutAdmin, changeCredentials }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
