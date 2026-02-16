"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isHydrated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isHydrated, router]);

  // Показуємо Loading поки завантажується
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-stalker-dark text-stalker-text flex items-center justify-center">
        <p className="text-stalker-muted">Loading...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      
      <Header />
      
      <div className="flex flex-1 relative z-10">
        {/* Sidebar - visible on md+ screens */}
        <div className="hidden md:block w-16 lg:w-64 flex-shrink-0 transition-all duration-300">
          <StalkerSidebar />
        </div>
        
        {/* Mobile sidebar - FAB button for small screens */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <StalkerSidebar />
        </div>
        
        {/* Main content - with left margin for compact sidebar on tablets */}
        <div className="flex-1 ml-16 lg:ml-0 container py-6 md:py-8 lg:py-12 px-3 md:px-4">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
