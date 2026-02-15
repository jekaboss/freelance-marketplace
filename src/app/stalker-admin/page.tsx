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

export default function StalkerAdminDashboard() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
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
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      
      <Header />
      
      <div className="container py-12 px-4 flex-grow relative z-10">
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
        
        {/* Stats Overview */}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="bg-stalker-card border-stalker-border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
              <CardTitle className="flex items-center gap-2 text-stalker-dark">
                <ZapIcon className="h-5 w-5" />
                Zone Operations
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-stalker-green to-stalker-yellow hover:from-stalker-green hover:to-stalker-yellow text-stalker-dark border border-stalker-border shadow-md">
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
              <Button asChild className="w-full bg-gradient-to-r from-stalker-blue to-stalker-teal hover:from-stalker-blue hover:to-stalker-teal text-stalker-dark border border-stalker-border shadow-md">
                <Link href="/admin/freelancers">Monitor Freelancers</Link>
              </Button>
              <Button asChild className="w-full bg-gradient-to-r from-stalker-red to-stalker-orange hover:from-stalker-red hover:to-stalker-orange text-stalker-dark border border-stalker-border shadow-md">
                <Link href="/admin/users">Control Users</Link>
              </Button>
              <Button asChild className="w-full bg-gradient-to-r from-stalker-purple to-stalker-pink hover:from-stalker-purple hover:to-stalker-pink text-stalker-dark border border-stalker-border shadow-md">
                <Link href="/admin/settings">Modify Parameters</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="bg-stalker-card border-stalker-border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-stalker-green to-stalker-yellow p-4">
              <CardTitle className="flex items-center gap-2 text-stalker-dark">
                <ActivityIcon className="h-5 w-5" />
                Zone Activity Log
              </CardTitle>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between pb-4 border-b border-stalker-border last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-stalker-green">{activity.user}</p>
                      <p className="text-sm text-stalker-muted">{activity.action}</p>
                    </div>
                    <Badge variant="secondary" className="bg-stalker-badge text-stalker-text border-stalker-border">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}