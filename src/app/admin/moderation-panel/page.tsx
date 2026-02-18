"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, Shield, User, Briefcase, MessageSquare, Check, X, Eye, Clock, RadiationIcon, LogOutIcon, Settings } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface ModerationItem {
  id: number;
  type: 'profile' | 'project' | 'review' | 'content';
  title: string;
  content: string;
  author: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
}

export default function AdminModerationPanelPage() {
  const { isAdmin, logoutAdmin, isHydrated } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isHydrated) {
    return null; // Don't render anything until hydration is complete
  }

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  const [items, setItems] = useState<ModerationItem[]>([
    { 
      id: 1, 
      type: 'profile', 
      title: 'New Freelancer Profile', 
      content: 'Experienced full-stack developer with expertise in React, Node.js, and cloud technologies...', 
      author: 'Alex Johnson', 
      date: '2024-12-18 14:32', 
      status: 'pending',
      category: 'Development'
    },
    { 
      id: 2, 
      type: 'project', 
      title: 'E-commerce Website Development', 
      content: 'Need a team to build a custom e-commerce solution with payment integration and inventory management...', 
      author: 'Maria Garcia', 
      date: '2024-12-18 13:45', 
      status: 'pending',
      category: 'Web Development'
    },
    { 
      id: 3, 
      type: 'review', 
      title: 'Review for Project Delivery', 
      content: 'Great communication and timely delivery. Will work with again!', 
      author: 'David Chen', 
      date: '2024-12-18 12:20', 
      status: 'pending',
      category: 'Service Feedback'
    },
    { 
      id: 4, 
      type: 'content', 
      title: 'Blog Post Submission', 
      content: 'How to optimize your workflow as a remote developer - tips and best practices...', 
      author: 'Sarah Williams', 
      date: '2024-12-18 11:15', 
      status: 'pending',
      category: 'Article'
    },
    { 
      id: 5, 
      type: 'profile', 
      title: 'Designer Portfolio', 
      content: 'Creative UI/UX designer with 5+ years of experience in mobile and web applications...', 
      author: 'Michael Brown', 
      date: '2024-12-18 10:30', 
      status: 'pending',
      category: 'Design'
    },
  ]);

  const [activeTab, setActiveTab] = useState<'moderation' | 'settings'>('moderation');
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    criteria: '',
    action: 'flag' as const
  });

  const handleApprove = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? {...item, status: 'approved'} : item
    ));
    alert(`Item #${id} approved successfully!`);
  };

  const handleReject = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? {...item, status: 'rejected'} : item
    ));
    alert(`Item #${id} rejected successfully!`);
  };

  const handleCreateRule = () => {
    if (newRule.name.trim() && newRule.criteria.trim()) {
      alert(`New moderation rule "${newRule.name}" created successfully!`);
      setNewRule({ name: '', description: '', criteria: '', action: 'flag' });
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'profile': return <User className="h-4 w-4" />;
      case 'project': return <Briefcase className="h-4 w-4" />;
      case 'review': return <MessageSquare className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'profile': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'project': return 'bg-stalker-green/20 text-stalker-green';
      case 'review': return 'bg-stalker-purple/20 text-stalker-purple';
      case 'content': return 'bg-stalker-yellow/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-stalker-green/20 text-stalker-dark';
      case 'rejected': return 'bg-stalker-red/20 text-stalker-dark';
      case 'pending': return 'bg-stalker-yellow/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const filteredItems = items;

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
          
            {/* Tab Navigation */}
            <div className="flex border-b border-stalker-border mb-8">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'moderation'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('moderation')}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Content Moderation
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'settings'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Moderation Rules
              </button>
            </div>
            
            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <span>Moderation Queue</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search moderation items..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                        
                        <select 
                          className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option>All Types</option>
                          <option>Profiles</option>
                          <option>Projects</option>
                          <option>Reviews</option>
                          <option>Content</option>
                        </select>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {filteredItems.map((item) => (
                        <Card key={item.id} className="bg-stalker-darker border-stalker-border">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Badge className={getTypeColor(item.type)}>
                                  {getTypeIcon(item.type)}
                                  <span className="ml-1 capitalize">{item.type}</span>
                                </Badge>
                                <div>
                                  <CardTitle className="text-stalker-green">{item.title}</CardTitle>
                                  <p className="text-stalker-text text-sm mt-1">by {item.author} • {item.date}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-stalker-text mb-4 line-clamp-3">{item.content}</p>
                            
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                {item.category}
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                  onClick={() => alert(`Viewing details for item: ${item.title}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                  onClick={() => handleApprove(item.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                  onClick={() => handleReject(item.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
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
            )}
            
            {/* Moderation Rules Tab */}
            {activeTab === 'settings' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Moderation Rules</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Create New Rule</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-stalker-green mb-2">Rule Name</label>
                            <Input
                              placeholder="Enter rule name..."
                              value={newRule.name}
                              onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Description</label>
                            <Textarea
                              placeholder="Describe what this rule checks for..."
                              value={newRule.description}
                              onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                              rows={3}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Criteria</label>
                            <Input
                              placeholder="Enter detection criteria (keywords, patterns, etc.)"
                              value={newRule.criteria}
                              onChange={(e) => setNewRule({...newRule, criteria: e.target.value})}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Action</label>
                            <select
                              value={newRule.action}
                              onChange={(e) => setNewRule({...newRule, action: e.target.value as any})}
                              className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                            >
                              <option value="flag">Flag for Review</option>
                              <option value="reject">Auto-Reject</option>
                              <option value="warn">Issue Warning</option>
                              <option value="approve">Auto-Approve</option>
                            </select>
                          </div>
                          
                          <Button 
                            onClick={handleCreateRule}
                            className="w-full bg-stalker-green text-stalker-dark hover:bg-stalker-green/90 mt-4"
                          >
                            Create Moderation Rule
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Existing Rules</h3>
                        
                        <div className="space-y-4">
                          <Card className="bg-stalker-darker border-stalker-border">
                            <CardHeader>
                              <CardTitle className="text-stalker-green">Profanity Filter</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-stalker-text mb-2">Automatically detects and flags content containing inappropriate language.</p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                  Keyword Detection
                                </Badge>
                                <Badge className="bg-stalker-yellow/20 text-stalker-dark">
                                  Flag for Review
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-stalker-darker border-stalker-border">
                            <CardHeader>
                              <CardTitle className="text-stalker-green">Spam Detection</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-stalker-text mb-2">Identifies repetitive content and promotional material.</p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                  Pattern Recognition
                                </Badge>
                                <Badge className="bg-stalker-yellow/20 text-stalker-dark">
                                  Flag for Review
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-stalker-darker border-stalker-border">
                            <CardHeader>
                              <CardTitle className="text-stalker-green">Profile Completeness</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-stalker-text mb-2">Checks if profiles meet minimum completeness requirements.</p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                  Validation Rule
                                </Badge>
                                <Badge className="bg-stalker-green/20 text-stalker-dark">
                                  Auto-Approve
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}