"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchIcon, Bell, Mail, Globe, Users, AlertTriangle, Info, CheckCircle, Clock, RadiationIcon, LogOutIcon, Edit3, Trash2, Send, Check, X, Settings, EyeIcon, Plus } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface SystemMessage {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'critical' | 'announcement';
  targetAudience: 'all' | 'freelancers' | 'clients' | 'premium';
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  sentAt?: string;
  scheduledAt?: string;
  recipients: number;
  opened: number;
}

export default function AdminSystemMessagesPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const [messages, setMessages] = useState<SystemMessage[]>([
    { 
      id: 1, 
      title: 'Platform Maintenance Notice', 
      content: 'Scheduled maintenance on Sunday from 2 AM to 4 AM. Services may be temporarily unavailable.', 
      type: 'warning', 
      targetAudience: 'all',
      status: 'sent',
      createdAt: '2024-12-15',
      sentAt: '2024-12-15',
      recipients: 3200,
      opened: 1890
    },
    { 
      id: 2, 
      title: 'New Feature: Enhanced Search', 
      content: 'We\'ve launched our improved search functionality with advanced filtering options.', 
      type: 'info', 
      targetAudience: 'all',
      status: 'sent',
      createdAt: '2024-12-12',
      sentAt: '2024-12-12',
      recipients: 3200,
      opened: 2100
    },
    { 
      id: 3, 
      title: 'Special Offer for Premium Users', 
      content: 'Exclusive discount for our premium members. Limited time offer!', 
      type: 'announcement', 
      targetAudience: 'premium',
      status: 'scheduled',
      createdAt: '2024-12-10',
      scheduledAt: '2024-12-20',
      recipients: 420,
      opened: 0
    },
    { 
      id: 4, 
      title: 'Security Advisory', 
      content: 'We recently detected suspicious activity on our platform. We recommend changing your passwords.', 
      type: 'critical', 
      targetAudience: 'all',
      status: 'draft',
      createdAt: '2024-12-01',
      recipients: 0,
      opened: 0
    },
  ]);

  const [activeTab, setActiveTab] = useState<'messages' | 'settings'>('messages');
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    targetAudience: 'all' as const,
    status: 'draft' as const
  });

  const [editingMessage, setEditingMessage] = useState<SystemMessage | null>(null);

  const handleSendMessage = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, status: 'sent', sentAt: new Date().toISOString().split('T')[0]} : msg
    ));
    alert(`Message #${id} sent successfully!`);
  };

  const handleScheduleMessage = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, status: 'scheduled'} : msg
    ));
    alert(`Message #${id} scheduled successfully!`);
  };

  const handleDeleteMessage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      alert('Message deleted successfully!');
    }
  };

  const handleCreateMessage = () => {
    if (newMessage.title.trim() && newMessage.content.trim()) {
      const message: SystemMessage = {
        id: messages.length + 1,
        title: newMessage.title,
        content: newMessage.content,
        type: newMessage.type,
        targetAudience: newMessage.targetAudience,
        status: newMessage.status,
        createdAt: new Date().toISOString().split('T')[0],
        recipients: 0,
        opened: 0
      };
      setMessages([...messages, message]);
      setNewMessage({ 
        title: '', 
        content: '', 
        type: 'info', 
        targetAudience: 'all', 
        status: 'draft' 
      });
      alert(`New message "${newMessage.title}" created successfully!`);
    }
  };

  const handleUpdateMessage = () => {
    if (editingMessage) {
      setMessages(messages.map(msg => 
        msg.id === editingMessage.id ? editingMessage : msg
      ));
      setEditingMessage(null);
      alert(`"${editingMessage.title}" updated successfully!`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'announcement': return <Bell className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'warning': return 'bg-stalker-yellow/20 text-stalker-yellow';
      case 'critical': return 'bg-stalker-red/20 text-stalker-dark';
      case 'announcement': return 'bg-stalker-green/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getTargetAudienceLabel = (audience: string) => {
    switch(audience) {
      case 'all': return 'All Users';
      case 'freelancers': return 'Freelancers Only';
      case 'clients': return 'Clients Only';
      case 'premium': return 'Premium Members';
      default: return audience;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-stalker-green/20 text-stalker-dark';
      case 'draft': return 'bg-stalker-yellow/20 text-stalker-dark';
      case 'scheduled': return 'bg-stalker-blue/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const filteredMessages = messages;

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
                  SYSTEM MESSAGES
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Send and manage platform notifications
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
          
            {/* Tab Navigation */}
            <div className="flex border-b border-stalker-border mb-8">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'messages'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('messages')}
              >
                <Bell className="h-4 w-4 inline mr-2" />
                Messages ({messages.length})
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
                Message Settings
              </button>
            </div>
            
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>System Announcements</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search messages..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                        
                        <select 
                          className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option>All Types</option>
                          <option>Informational</option>
                          <option>Warning</option>
                          <option>Critical</option>
                          <option>Announcement</option>
                        </select>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stalker-border">
                          <tr>
                            <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Title</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Type</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Audience</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Recipients</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Engagement</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMessages.map((message) => (
                            <tr key={message.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{message.title}</td>
                              <td className="py-3 px-4">
                                <Badge className={getTypeColor(message.type)}>
                                  {getTypeIcon(message.type)}
                                  <span className="ml-1 capitalize">{message.type}</span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-stalker-muted" />
                                  {getTargetAudienceLabel(message.targetAudience)}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  className={getStatusColor(message.status)}
                                >
                                  {message.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">{message.recipients.toLocaleString()}</td>
                              <td className="py-3 px-4 text-stalker-text">
                                {message.opened ? 
                                  `${Math.round((message.opened / message.recipients) * 100)}% (${message.opened})` : 
                                  'N/A'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Viewing message details: ${message.title}`)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                    onClick={() => setEditingMessage(message)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  
                                  {message.status === 'draft' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10"
                                        onClick={() => handleScheduleMessage(message.id)}
                                      >
                                        <Clock className="h-4 w-4 mr-1" />
                                        Schedule
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                                        onClick={() => handleSendMessage(message.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        Send
                                      </Button>
                                    </>
                                  )}
                                  
                                  {message.status === 'scheduled' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                      onClick={() => handleSendMessage(message.id)}
                                    >
                                      <Send className="h-4 w-4 mr-1" />
                                      Send Now
                                    </Button>
                                  )}
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {filteredMessages.length === 0 && (
                      <div className="text-center py-10 text-stalker-muted">
                        No messages found
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Add/Edit Message Form */}
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>{editingMessage ? 'Edit Message' : 'Create New Message'}</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Title</label>
                          <Input
                            placeholder="Enter message title..."
                            value={editingMessage ? editingMessage.title : newMessage.title}
                            onChange={(e) => 
                              editingMessage 
                                ? setEditingMessage({...editingMessage, title: e.target.value}) 
                                : setNewMessage({...newMessage, title: e.target.value})
                            }
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Type</label>
                          <select
                            value={editingMessage ? editingMessage.type : newMessage.type}
                            onChange={(e) => 
                              editingMessage 
                                ? setEditingMessage({...editingMessage, type: e.target.value as any}) 
                                : setNewMessage({...newMessage, type: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="info">Informational</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical Alert</option>
                            <option value="announcement">Announcement</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Target Audience</label>
                          <select
                            value={editingMessage ? editingMessage.targetAudience : newMessage.targetAudience}
                            onChange={(e) => 
                              editingMessage 
                                ? setEditingMessage({...editingMessage, targetAudience: e.target.value as any}) 
                                : setNewMessage({...newMessage, targetAudience: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="all">All Users</option>
                            <option value="freelancers">Freelancers Only</option>
                            <option value="clients">Clients Only</option>
                            <option value="premium">Premium Members Only</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Status</label>
                          <select
                            value={editingMessage ? editingMessage.status : newMessage.status}
                            onChange={(e) => 
                              editingMessage 
                                ? setEditingMessage({...editingMessage, status: e.target.value as any}) 
                                : setNewMessage({...newMessage, status: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="sent">Sent</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Content</label>
                          <Textarea
                            placeholder="Enter message content..."
                            value={editingMessage ? editingMessage.content : newMessage.content}
                            onChange={(e) => 
                              editingMessage 
                                ? setEditingMessage({...editingMessage, content: e.target.value}) 
                                : setNewMessage({...newMessage, content: e.target.value})
                            }
                            rows={8}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div className="pt-4">
                          {editingMessage ? (
                            <div className="flex gap-3">
                              <Button 
                                onClick={handleUpdateMessage}
                                className="flex-1 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Update Message
                              </Button>
                              <Button 
                                onClick={() => setEditingMessage(null)}
                                variant="outline"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={handleCreateMessage}
                              className="w-full bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create Message
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Message Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Message Settings</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Delivery Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Email Delivery</h4>
                              <p className="text-sm text-stalker-muted">Enable email notifications for users</p>
                            </div>
                            <Switch 
                              checked={true}
                              onCheckedChange={() => alert('Email delivery setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Push Notifications</h4>
                              <p className="text-sm text-stalker-muted">Enable push notifications for mobile/web app</p>
                            </div>
                            <Switch 
                              checked={true}
                              onCheckedChange={() => alert('Push notifications setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Banner Notifications</h4>
                              <p className="text-sm text-stalker-muted">Display banner notifications on platform</p>
                            </div>
                            <Switch 
                              checked={false}
                              onCheckedChange={() => alert('Banner notifications setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Template Management</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-stalker-green mb-2">Welcome Email Template</label>
                            <Textarea
                              placeholder="Enter welcome email template..."
                              defaultValue="Dear {username}, welcome to our platform! We're excited to have you join our community of professionals..."
                              rows={4}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Project Notification Template</label>
                            <Textarea
                              placeholder="Enter project notification template..."
                              defaultValue="Hi {username}, you have a new {notification_type} for project '{project_title}'. Please check your dashboard for details."
                              rows={4}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Notification Categories</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['Project Updates', 'Payment Alerts', 'Account Notifications', 'Promotional', 'System Alerts'].map((category, index) => (
                            <Badge key={index} variant="secondary" className="bg-stalker-border text-stalker-text">
                              {category}
                              <button 
                                className="ml-2 text-stalker-red hover:text-stalker-red/80"
                                onClick={() => alert(`Removing category: ${category}`)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          
                          <div className="relative">
                            <Input 
                              placeholder="Add new category..." 
                              className="bg-stalker-darker border-stalker-border text-stalker-text pl-10 py-1"
                            />
                            <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-8 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90">
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}