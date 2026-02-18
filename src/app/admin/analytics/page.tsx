"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, BarChart3, TrendingUp, Users, DollarSign, Activity, RadiationIcon, LogOutIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminAnalyticsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Mock data for analytics
  const stats = [
    { name: 'Total Users', value: '12,483', change: '+12%', icon: Users },
    { name: 'Active Projects', value: '1,248', change: '+5%', icon: Activity },
    { name: 'Monthly Revenue', value: '$42,870', change: '+8%', icon: DollarSign },
    { name: 'Avg. Response Time', value: '2.4s', change: '-0.3s', icon: TrendingUp },
  ];

  const chartData = [
    { month: 'Jan', users: 1200, projects: 80, revenue: 12000 },
    { month: 'Feb', users: 1900, projects: 120, revenue: 18000 },
    { month: 'Mar', users: 2400, projects: 180, revenue: 24000 },
    { month: 'Apr', users: 3100, projects: 220, revenue: 30000 },
    { month: 'May', users: 4200, projects: 280, revenue: 36000 },
    { month: 'Jun', users: 5100, projects: 320, revenue: 42000 },
    { month: 'Jul', users: 6200, projects: 380, revenue: 48000 },
  ];

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <StalkerSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 relative z-10 flex justify-center w-full">
          <div className="w-full max-w-7xl">
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  ANALYTICS DASHBOARD
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Real-time platform statistics and metrics
                </p>
              </div>
              <Button
                onClick={logoutAdmin}
                variant="outline"
                className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text text-sm"
              >
                <LogOutIcon className="h-3 w-3 md:h-4 md:w-4" />
                Exit Zone
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-stalker-green to-stalker-yellow text-stalker-dark">
                      <CardTitle className="text-lg text-stalker-dark flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {stat.name}
                      </CardTitle>
                    </div>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-stalker-green">{stat.value}</div>
                      <div className="mt-2 flex items-center text-sm">
                        <span className="text-stalker-green">{stat.change}</span>
                        <span className="text-stalker-muted ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                  <CardTitle className="text-stalker-dark flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    User Growth
                  </CardTitle>
                </div>
                <CardContent className="pt-6">
                  <div className="h-80 flex items-end justify-between space-x-2">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-stalker-text text-sm mb-1">{data.users}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-stalker-green to-stalker-blue rounded-t-lg"
                          style={{ height: `${(data.users / 7000) * 250}px` }}
                        ></div>
                        <div className="text-stalker-muted text-xs mt-2">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue Chart */}
              <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                  <CardTitle className="text-stalker-dark flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </div>
                <CardContent className="pt-6">
                  <div className="h-80 flex items-end justify-between space-x-2">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-stalker-text text-sm mb-1">${Math.round(data.revenue / 1000)}k</div>
                        <div 
                          className="w-full bg-gradient-to-t from-stalker-yellow to-stalker-orange rounded-t-lg"
                          style={{ height: `${(data.revenue / 60000) * 250}px` }}
                        ></div>
                        <div className="text-stalker-muted text-xs mt-2">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl mt-8 overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-start justify-between pb-4 border-b border-stalker-border last:border-0 last:pb-0 group hover:bg-stalker-darker/50 p-3 rounded-lg transition-all duration-300 ease-in-out">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-stalker-green rounded-full animate-pulse"></div>
                          <p className="font-medium text-stalker-green truncate">User Registration</p>
                        </div>
                        <p className="text-sm text-stalker-muted truncate ml-6">New user registered with email example{index}@domain.com</p>
                        <div className="mt-2 flex items-center text-xs text-stalker-text/70 gap-2 ml-6">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-stalker-yellow rounded-full"></div>
                            <span>Today, 14:{index}2</span>
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
      </div>

      <Footer />
    </div>
  );
}