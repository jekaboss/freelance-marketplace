"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { ActivityIcon, RadiationIcon, LogOutIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";

export default function AdminDashboard() {
  const { logoutAdmin } = useAdmin();
  const { t } = useTranslation();

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
    <>
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
              STALKER Admin
            </h1>
            <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
              <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
              Secure Zone Management
            </p>
          </div>
          <Button 
            onClick={logoutAdmin} 
            variant="outline"
            className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text text-sm"
          >
            <LogOutIcon className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Exit Zone</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-stalker-card border-stalker-border shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="p-3 md:p-4 lg:p-5 bg-gradient-to-r from-stalker-green to-stalker-yellow text-stalker-dark">
              <CardTitle className="text-sm md:text-base lg:text-lg text-stalker-dark">{stat.name}</CardTitle>
            </div>
            <CardContent className="pt-3 md:pt-4 lg:pt-6 bg-stalker-card">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-stalker-green">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <Card className="bg-stalker-card border-stalker-border shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-stalker-green to-stalker-yellow p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-stalker-dark text-sm md:text-base">
              <ActivityIcon className="h-4 w-4 md:h-5 md:w-5" />
              Zone Activity Log
            </CardTitle>
          </div>
          <CardContent className="pt-3 md:pt-4 lg:pt-6">
            <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto pr-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between pb-3 md:pb-4 border-b border-stalker-border last:border-0 last:pb-0 group hover:bg-stalker-darker/50 p-2 md:p-3 rounded-lg transition-all duration-300">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-stalker-green rounded-full animate-pulse flex-shrink-0"></div>
                      <p className="font-medium text-stalker-green truncate text-sm">{activity.user}</p>
                    </div>
                    <p className="text-xs md:text-sm text-stalker-muted truncate ml-5 md:ml-6">{activity.action}</p>
                    <div className="mt-1 md:mt-2 flex items-center text-xs text-stalker-text/70 gap-2 ml-5 md:ml-6">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stalker-yellow rounded-full flex-shrink-0"></div>
                        <span className="hidden sm:inline">{activity.time}</span>
                        <span className="sm:hidden">• {activity.time.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-stalker-green">
                        <RadiationIcon className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
                        <span className="hidden md:inline">Secure Zone</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
