"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const base = "px-4 py-3 rounded-md shadow-lg border text-sm flex items-center justify-between gap-3";
  const variants: Record<ToastVariant, string> = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  return (
    <div className={`${base} ${variants[toast.variant]}`}>
      <span>{toast.message}</span>
      <button className="text-xs underline" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts, showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
