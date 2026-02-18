"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, FilterIcon, RadiationIcon, LogOutIcon, EyeIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface ActivityLogEntry {
  id: number;
  user: string;
 action: string;
  timestamp: string;
  ip: string;
 userAgent: string;
 status: 'success' | 'warning' | 'error';
  details?: string;
}

export default function AdminActivityLogPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('all');

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Mock data for activity log
  const activityLog: ActivityLogEntry[] = [
    {
      id: 1,
      user: 'admin@stalker.zone',
      action: 'Logged into admin panel',
      timestamp: '2024-12-18 14:32:15',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
    },
    {
      id: 2,
      user: 'client_user@example.com',
      action: 'Created new project: Web Application',
      timestamp: '2024-12-18 14:28:42',
      ip: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'success',
    },
    {
      id: 3,
      user: 'freelancer_dev@proton.me',
      action: 'Submitted proposal for Mobile App Project',
      timestamp: '2024-12-18 14:25:11',
      ip: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
      status: 'success',
    },
    {
      id: 4,
      user: 'moderator@stalker.zone',
      action: 'Reviewed and approved freelancer profile',
      timestamp: '2024-12-18 14:20:07',
      ip: '192.0.2.56',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
    },
    {
      id: 5,
      user: 'unknown_user',
      action: 'Failed login attempt',
      timestamp: '2024-12-18 14:15:33',
      ip: '10.0.0.123',
      userAgent: 'Unknown Bot Agent',
      status: 'error',
      details: 'Multiple failed attempts from same IP'
    },
    {
      id: 6,
      user: 'premium_client@vip.org',
      action: 'Upgraded subscription plan',
      timestamp: '2024-12-18 14:10:2',
      ip: '203.0.113.78',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_1)',
      status: 'success',
    },
    {
      id: 7,
      user: 'new_freelancer@outlook.com',
      action: 'Registered as new freelancer',
      timestamp: '2024-12-18 14:05:49',
      ip: '198.51.100.91',
      userAgent: 'Mozilla/5.0 (Android 12; Mobile)',
      status: 'success',
    },
    {
      id: 8,
      user: 'admin@stalker.zone',
      action: 'Updated system settings',
      timestamp: '2024-12-18 14:02:18',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'warning',
      details: 'Critical settings modified'
    },
    {
      id: 9,
      user: 'security_bot',
      action: 'Detected suspicious activity',
      timestamp: '2024-12-18 13:58:37',
      ip: '192.0.2.101',
      userAgent: 'Security Monitoring System',
      status: 'error',
      details: 'Potential security threat detected'
    },
    {
      id: 10,
      user: 'payment_gateway',
      action: 'Processed payment for project',
      timestamp: '2024-12-18 13:55:04',
      ip: '203.0.113.12',
      userAgent: 'Payment Processing Service',
      status: 'success',
    },
  ];

  const filteredActivities = filter === 'all' 
    ? activityLog 
    : activityLog.filter(activity => activity.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-stalker-green text-stalker-dark';
      case 'warning': return 'bg-stalker-yellow text-stalker-dark';
      case 'error': return 'bg-stalker-red text-stalker-dark';
      default: return 'bg-stalker-border text-stalker-text';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-4 w-4" />;
      case 'warning': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'error': return <AlertTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

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
                  ZONE ACTIVITY LOG
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Real-time monitoring of all system activities
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
          
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-stalker-dark">
                  <span className="text-xl flex items-center gap-2">
                    <RadiationIcon className="h-5 w-5" />
                    Security Activity Feed
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Input 
                        placeholder="Search activities..." 
                        className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                      />
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FilterIcon className="h-4 w-4 text-stalker-text" />
                      <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                      >
                        <option value="all">All Activities</option>
                        <option value="success">Successful</option>
                        <option value="warning">Warnings</option>
                        <option value="error">Errors</option>
                      </select>
                    </div>
                  </div>
                </CardTitle>
              </div>
              
              <CardContent className="pt-6">
                <div className="overflow-x-auto rounded-lg border border-stalker-border">
                  <table className="w-full">
                    <thead className="bg-stalker-border">
                      <tr>
                        <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Time</th>
                        <th className="text-left py-3 px-4 text-stalker-green">User</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Action</th>
                        <th className="text-left py-3 px-4 text-stalker-green">IP Address</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                        <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((activity, index) => (
                        <tr 
                          key={activity.id} 
                          className={`border-b border-stalker-border ${index % 2 === 0 ? 'bg-stalker-dark' : 'bg-stalker-darker'} hover:bg-stalker-card transition-colors`}
                        >
                          <td className="py-3 px-4 text-stalker-text flex items-center gap-2">
                            <ClockIcon className="h-4 w-4 text-stalker-muted" />
                            {activity.timestamp}
                          </td>
                          <td className="py-3 px-4 font-medium text-stalker-green">{activity.user}</td>
                          <td className="py-3 px-4 text-stalker-text">{activity.action}</td>
                          <td className="py-3 px-4 text-stalker-text font-mono text-sm">{activity.ip}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="default"
                              className={`${getStatusColor(activity.status)} flex items-center justify-center gap-1 min-w-[10px]`}
                            >
                              {getStatusIcon(activity.status)}
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {activity.details ? (
                              <div className="group relative">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-stalker-border text-stalker-text hover:bg-stalker-border flex items-center gap-1"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  View
                                </Button>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-stalker-darker border border-stalker-border rounded p-3 z-10">
                                  <p className="text-sm text-stalker-text">{activity.details}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-stalker-muted italic">No details</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="text-stalker-muted">
                    Showing {filteredActivities.length} of {activityLog.length} activities
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-stalker-border text-stalker-text hover:bg-stalker-border">
                      Previous
                    </Button>
                    <Button className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <Card className="bg-stalker-card border-stalker-border shadow-lg">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-green">
                    {activityLog.length}
                  </div>
                  <div className="text-stalker-muted mt-1">Total Activities</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-lg">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-green">
                    {activityLog.filter(a => a.status === 'success').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Successful Actions</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-lg">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-yellow">
                    {activityLog.filter(a => a.status === 'warning').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Warnings</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-lg">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-red">
                    {activityLog.filter(a => a.status === 'error').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Security Events</div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
