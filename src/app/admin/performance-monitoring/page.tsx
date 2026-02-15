"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, Activity, Server, Cpu, HardDrive, Wifi, Clock, TrendingUp, BarChart3, Gauge, RadiationIcon, LogOutIcon, EyeIcon, RefreshCw } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState, useEffect } from "react";

interface PerformanceMetric {
  id: number;
  name: string;
  currentValue: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface ServerStatus {
  id: number;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  status: 'operational' | 'degraded' | 'offline';
  lastChecked: string;
}

export default function AdminPerformanceMonitoringPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { 
      id: 1, 
      name: 'Response Time', 
      currentValue: 120, 
      threshold: 200, 
      status: 'normal', 
      unit: 'ms', 
      trend: 'down',
      lastUpdated: '2024-12-18 14:30'
    },
    { 
      id: 2, 
      name: 'Server Load', 
      currentValue: 45, 
      threshold: 80, 
      status: 'normal', 
      unit: '%', 
      trend: 'stable',
      lastUpdated: '2024-12-18 14:30'
    },
    { 
      id: 3, 
      name: 'Database Connections', 
      currentValue: 128, 
      threshold: 200, 
      status: 'normal', 
      unit: 'conn', 
      trend: 'up',
      lastUpdated: '2024-12-18 14:30'
    },
    { 
      id: 4, 
      name: 'Memory Usage', 
      currentValue: 78, 
      threshold: 90, 
      status: 'warning', 
      unit: '%', 
      trend: 'up',
      lastUpdated: '2024-12-18 14:30'
    },
    { 
      id: 5, 
      name: 'Disk Space', 
      currentValue: 85, 
      threshold: 95, 
      status: 'warning', 
      unit: '%', 
      trend: 'up',
      lastUpdated: '2024-12-18 14:30'
    },
    { 
      id: 6, 
      name: 'Error Rate', 
      currentValue: 0.2, 
      threshold: 1.0, 
      status: 'normal', 
      unit: '%', 
      trend: 'down',
      lastUpdated: '2024-12-18 14:30'
    },
  ]);

  const [servers, setServers] = useState<ServerStatus[]>([
    { 
      id: 1, 
      name: 'Web Server 1', 
      cpuUsage: 35, 
      memoryUsage: 68, 
      diskUsage: 72, 
      networkLatency: 12, 
      status: 'operational', 
      lastChecked: '2024-12-18 14:28'
    },
    { 
      id: 2, 
      name: 'Web Server 2', 
      cpuUsage: 52, 
      memoryUsage: 75, 
      diskUsage: 68, 
      networkLatency: 15, 
      status: 'operational', 
      lastChecked: '2024-12-18 14:28'
    },
    { 
      id: 3, 
      name: 'Database Server', 
      cpuUsage: 68, 
      memoryUsage: 82, 
      diskUsage: 85, 
      networkLatency: 22, 
      status: 'degraded', 
      lastChecked: '2024-12-18 14:28'
    },
    { 
      id: 4, 
      name: 'Cache Server', 
      cpuUsage: 22, 
      memoryUsage: 45, 
      diskUsage: 30, 
      networkLatency: 8, 
      status: 'operational', 
      lastChecked: '2024-12-18 14:28'
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Simulate data refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Update metrics with new simulated values
      const updatedMetrics = metrics.map(metric => ({
        ...metric,
        currentValue: metric.currentValue + (Math.random() * 10 - 5),
        lastUpdated: new Date().toLocaleString('sv-SE')
      }));
      
      const updatedServers = servers.map(server => ({
        ...server,
        cpuUsage: Math.min(100, Math.max(0, server.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, server.memoryUsage + (Math.random() * 10 - 5))),
        diskUsage: Math.min(100, Math.max(0, server.diskUsage + (Math.random() * 5 - 2.5))),
        networkLatency: Math.max(0, server.networkLatency + (Math.random() * 5 - 2.5)),
        lastChecked: new Date().toLocaleString('sv-SE')
      }));
      
      setMetrics(updatedMetrics);
      setServers(updatedServers);
      setRefreshing(false);
      alert('Performance data refreshed successfully!');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'bg-stalker-green text-stalker-dark';
      case 'warning': return 'bg-stalker-yellow text-stalker-dark';
      case 'critical': return 'bg-stalker-red text-stalker-dark';
      case 'operational': return 'bg-stalker-green text-stalker-dark';
      case 'degraded': return 'bg-stalker-yellow text-stalker-dark';
      case 'offline': return 'bg-stalker-red text-stalker-dark';
      default: return 'bg-stalker-border text-stalker-text';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-stalker-red" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-stalker-green rotate-180" />;
      default: return <Clock className="h-4 w-4 text-stalker-muted" />;
    }
  };

  const calculateOverallHealth = () => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    
    if (criticalCount > 0) return { status: 'critical', text: 'Critical Issues Detected' };
    if (warningCount > 0) return { status: 'warning', text: 'Performance Warnings' };
    return { status: 'normal', text: 'System Operational' };
  };

  const overallHealth = calculateOverallHealth();

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
        <div className="flex-1 container py-12 px-4 relative z-10">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  PERFORMANCE MONITORING
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Monitor system performance and server health
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </Button>
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
          
            {/* Overall Health Status */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  <span>System Health Overview</span>
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl font-bold ${
                      overallHealth.status === 'normal' 
                        ? 'text-stalker-green' 
                        : overallHealth.status === 'warning' 
                          ? 'text-stalker-yellow' 
                          : 'text-stalker-red'
                    }`}>
                      {overallHealth.text}
                    </div>
                    <Badge className={getStatusColor(overallHealth.status)}>
                      {overallHealth.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stalker-green">{metrics.filter(m => m.status === 'normal').length}</div>
                      <div className="text-stalker-muted text-sm">Normal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stalker-yellow">{metrics.filter(m => m.status === 'warning').length}</div>
                      <div className="text-stalker-muted text-sm">Warning</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stalker-red">{metrics.filter(m => m.status === 'critical').length}</div>
                      <div className="text-stalker-muted text-sm">Critical</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Metrics */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Input 
                        placeholder="Search metrics..." 
                        className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                      />
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                    </div>
                  </div>
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metrics.map((metric) => (
                    <Card key={metric.id} className="bg-stalker-darker border-stalker-border">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-stalker-green flex items-center gap-2">
                            {metric.name}
                          </CardTitle>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-baseline mb-2">
                          <div className="text-3xl font-bold text-stalker-green">
                            {typeof metric.currentValue === 'number' ? metric.currentValue.toFixed(1) : metric.currentValue}
                            <span className="text-lg text-stalker-text ml-1">{metric.unit}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-stalker-text mb-1">
                            <span>Threshold: {metric.threshold}{metric.unit}</span>
                            <span>{Math.round((metric.currentValue / metric.threshold) * 100)}%</span>
                          </div>
                          <div className="w-full bg-stalker-border rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                metric.status === 'normal' 
                                  ? 'bg-stalker-green' 
                                  : metric.status === 'warning' 
                                    ? 'bg-stalker-yellow' 
                                    : 'bg-stalker-red'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (metric.currentValue / metric.threshold) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-stalker-muted flex justify-between">
                          <span>Last updated: {metric.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Server Status */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    <span>Server Status</span>
                  </div>
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stalker-border">
                      <tr>
                        <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Server</th>
                        <th className="text-left py-3 px-4 text-stalker-green">CPU</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Memory</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Disk</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Network</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                        <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Last Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((server) => (
                        <tr key={server.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                          <td className="py-3 px-4 font-medium text-stalker-green">{server.name}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-stalker-text" />
                              <span>{server.cpuUsage}%</span>
                              <div className="w-16 bg-stalker-border rounded-full h-1.5 ml-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    server.cpuUsage < 70 
                                      ? 'bg-stalker-green' 
                                      : server.cpuUsage < 90 
                                        ? 'bg-stalker-yellow' 
                                        : 'bg-stalker-red'
                                  }`}
                                  style={{ width: `${server.cpuUsage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4 text-stalker-text" />
                              <span>{server.memoryUsage}%</span>
                              <div className="w-16 bg-stalker-border rounded-full h-1.5 ml-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    server.memoryUsage < 70 
                                      ? 'bg-stalker-green' 
                                      : server.memoryUsage < 90 
                                        ? 'bg-stalker-yellow' 
                                        : 'bg-stalker-red'
                                  }`}
                                  style={{ width: `${server.memoryUsage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4 text-stalker-text" />
                              <span>{server.diskUsage}%</span>
                              <div className="w-16 bg-stalker-border rounded-full h-1.5 ml-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    server.diskUsage < 80 
                                      ? 'bg-stalker-green' 
                                      : server.diskUsage < 95 
                                        ? 'bg-stalker-yellow' 
                                        : 'bg-stalker-red'
                                  }`}
                                  style={{ width: `${server.diskUsage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-stalker-text" />
                              <span>{server.networkLatency}ms</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(server.status)}>
                              {server.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-stalker-text">{server.lastChecked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => alert('Detailed server reports would be generated here')}
                    variant="outline"
                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Detailed Reports
                  </Button>
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