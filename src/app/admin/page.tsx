"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import { ActivityIcon, ZapIcon, LogOutIcon, RadiationIcon } from "lucide-react";
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isAdmin, isHydrated, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

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

  const stats = [
    { name: 'Total Projects', value: '1,248' },
    { name: 'Active Freelancers', value: '342' },
    { name: 'Registered Clients', value: '586' },
    { name: 'Completed Projects', value: '987' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Smith', action: 'Created new project', time: '2 minutes ago' },
    { id: 2, user: 'Alex Johnson', action: 'Submitted proposal', time: '15 minutes ago' },
    { id: 3, user: 'Maria Garcia', action: 'Registered as freelancer', time: '1 hour ago' },
    { id: 4, user: 'David Chen', action: 'Updated profile', time: '3 hours ago' },
  ];

  return (
    <div className="admin-page min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      
      <Header />
      
      <div className="flex flex-1">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <StalkerSidebar />
        </div>
        
        <div className="flex-1 container py-12 px-4 relative z-10">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  STALKER Admin Dashboard
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Secure Zone Management Interface
                </p>
              </div>
              <Button 
                onClick={logoutAdmin} 
                variant="outline"
                className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text"
              >
                <LogOutIcon className="h-4 w-4" />
                Exit Zone
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-stalker-card border-stalker-border shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-stalker-green to-stalker-yellow text-stalker-dark">
                  <CardTitle className="text-lg text-stalker-dark">{stat.name}</CardTitle>
                </div>
                <CardContent className="pt-6 bg-stalker-card">
                  <div className="text-3xl font-bold text-stalker-green">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-stalker-card border-stalker-border shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-green to-stalker-yellow p-4">
                <CardTitle className="flex items-center gap-2 text-stalker-dark">
                  <ActivityIcon className="h-5 w-5" />
                  Zone Activity Log
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between pb-4 border-b border-stalker-border last:border-0 last:pb-0 group hover:bg-stalker-darker/50 p-3 rounded-lg transition-all duration-300">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-stalker-green rounded-full animate-pulse"></div>
                          <p className="font-medium text-stalker-green truncate">{activity.user}</p>
                        </div>
                        <p className="text-sm text-stalker-muted truncate ml-6">{activity.action}</p>
                        <div className="mt-2 flex items-center text-xs text-stalker-text/70 gap-2 ml-6">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-stalker-yellow rounded-full"></div>
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-stalker-green">
                            <RadiationIcon className="h-3 w-3" />
                            <span>Secure Zone</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
