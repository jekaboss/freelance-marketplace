"use client";

import { Header } from "@/components/header";
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useAdmin } from "@/components/admin-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isHydrated } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAdmin && !isLoginRoute) {
      router.push('/admin/login');
      return;
    }
    if (isHydrated) {
      setShowContent(true);
    }
  }, [isAdmin, isHydrated, isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  // For SSR - render a container with the same structure but hidden content
  // This ensures DOM hydration matches between server and client
  if (!showContent) {
    return (
      <div className="admin-page min-h-screen bg-stalker-dark text-stalker-text flex flex-col opacity-0 pointer-events-none">
        <Header />
        <div className="flex flex-1 relative z-10">
          <div className="hidden lg:block flex-shrink-0 transition-all duration-300">
            <StalkerSidebar />
          </div>
          <div className="lg:hidden">
            <StalkerSidebar />
          </div>
          <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 w-full overflow-hidden flex justify-center">
            <main className="w-full max-w-7xl">{children}</main>
          </div>
        </div>
      </div>
    );
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
          <main className="w-full max-w-7xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
