"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useAdmin } from "@/components/admin-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isHydrated } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isHydrated && !isAdmin && !isLoginRoute) {
      router.push('/admin/login');
    }
  }, [isAdmin, isHydrated, isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

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
        {/* Sidebar - visible on lg+ screens, collapsible on hover */}
        <div className="hidden lg:block flex-shrink-0 transition-all duration-300">
          <StalkerSidebar />
        </div>
        
        {/* Mobile/Tablet sidebar - FAB button for small-medium screens */}
        <div className="lg:hidden">
          <StalkerSidebar />
        </div>
        
        {/* Main content - centered */}
        <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 w-full overflow-hidden flex justify-center">
          <style jsx global>{`
            .admin-page main header.sticky,
            .admin-page main footer {
              display: none !important;
            }
          `}</style>
          <main className="w-full max-w-7xl">{children}</main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
