"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, UserCheck, FileText, MessageSquare, Shield, RadiationIcon, LogOutIcon, EyeIcon, CheckIcon, XIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminModerationPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  // Mock data for moderation queue
  const pendingItems = [
    {
      id: 1,
      type: 'profile',
      user: 'Alex Johnson',
      content: 'Full Stack Developer with 5 years of experience...',
      date: '2024-12-18 14:32',
      status: 'pending',
      category: 'freelancer'
    },
    {
      id: 2,
      type: 'project',
      user: 'Maria Garcia',
      content: 'Need a mobile app for restaurant ordering system...',
      date: '2024-12-18 13:45',
      status: 'pending',
      category: 'development'
    },
    {
      id: 3,
      type: 'review',
      user: 'David Chen',
      content: 'Great experience working with this freelancer...',
      date: '2024-12-18 12:20',
      status: 'pending',
      category: 'service'
    },
    {
      id: 4,
      type: 'profile',
      user: 'Sarah Williams',
      content: 'UI/UX Designer specializing in mobile applications...',
      date: '2024-12-18 11:15',
      status: 'pending',
      category: 'designer'
    },
    {
      id: 5,
      type: 'project',
      user: 'Michael Brown',
      content: 'Looking for a team to develop an e-commerce platform...',
      date: '2024-12-18 10:30',
      status: 'pending',
      category: 'web-development'
    },
  ];

  const [items, setItems] = useState(pendingItems);
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  const handleApprove = (id: number) => {
    alert(`Approved item #${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  const handleReject = (id: number) => {
    alert(`Rejected item #${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'profile': return <UserCheck className="h-4 w-4" />;
      case 'project': return <FileText className="h-4 w-4" />;
      case 'review': return <MessageSquare className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'profile': return 'bg-stalker-blue text-stalker-dark';
      case 'project': return 'bg-stalker-green text-stalker-dark';
      case 'review': return 'bg-stalker-yellow text-stalker-dark';
      default: return 'bg-stalker-border text-stalker-text';
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
                  MODERATION PANEL
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Review and manage user-generated content
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-green">
                    {items.length}
                  </div>
                  <div className="text-stalker-muted mt-1">Pending Reviews</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-blue">
                    {items.filter(i => i.type === 'profile').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Profiles</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-yellow">
                    {items.filter(i => i.type === 'project').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Projects</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-purple">
                    {items.filter(i => i.type === 'review').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Reviews</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-stalker-dark">
                  <span className="text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Content Approval Queue
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Input 
                        placeholder="Search content..." 
                        className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                      />
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                      >
                        <option value="all">All Content</option>
                        <option value="profile">Profiles</option>
                        <option value="project">Projects</option>
                        <option value="review">Reviews</option>
                      </select>
                    </div>
                  </div>
                </CardTitle>
              </div>
              
              <CardContent className="pt-6">
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="bg-stalker-darker border-stalker-border p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>
                              {getTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                            <span className="text-stalker-muted text-sm">{item.date}</span>
                            <span className="text-stalker-green font-medium">{item.user}</span>
                          </div>
                          <p className="text-stalker-text line-clamp-2">{item.content}</p>
                          <div className="mt-2">
                            <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-stalker-border text-stalker-text hover:bg-stalker-border flex items-center gap-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-stalker-green text-stalker-green hover:bg-stalker-green/10 flex items-center gap-1"
                            onClick={() => handleApprove(item.id)}
                          >
                            <CheckIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-stalker-red text-stalker-red hover:bg-stalker-red/10 flex items-center gap-1"
                            onClick={() => handleReject(item.id)}
                          >
                            <XIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-10 text-stalker-muted">
                    No items in the moderation queue
                  </div>
                )}
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