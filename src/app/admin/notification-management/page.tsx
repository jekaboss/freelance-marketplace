"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchIcon, Bell, Mail, Globe, Users, RadiationIcon, LogOutIcon, Edit3, Trash2, Send, Clock, Check, X, Settings, EyeIcon, Plus } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'email' | 'push' | 'banner';
  targetAudience: 'all' | 'freelancers' | 'clients' | 'premium';
  status: 'sent' | 'draft' | 'scheduled';
  createdAt: string;
  sentAt?: string;
  recipients: number;
  opened: number;
}

export default function AdminNotificationManagementPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: 'System Maintenance Notice', 
      content: 'Scheduled maintenance on Sunday from 2 AM to 4 AM. Services may be temporarily unavailable.', 
      type: 'system', 
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
      type: 'email', 
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
      type: 'push', 
      targetAudience: 'premium',
      status: 'scheduled',
      createdAt: '2024-12-10',
      sentAt: '2024-12-20',
      recipients: 420,
      opened: 0
    },
    { 
      id: 4, 
      title: 'Welcome Message', 
      content: 'Welcome to our platform! Get started with your first project today.', 
      type: 'banner', 
      targetAudience: 'all',
      status: 'draft',
      createdAt: '2024-12-08',
      recipients: 0,
      opened: 0
    },
    { 
      id: 5, 
      title: 'Project Deadline Reminder', 
      content: 'Don\'t forget about your upcoming project deadlines. Check your dashboard for details.', 
      type: 'email', 
      targetAudience: 'freelancers',
      status: 'sent',
      createdAt: '2024-12-05',
      sentAt: '2024-12-05',
      recipients: 1800,
      opened: 1200
    },
    { 
      id: 6, 
      title: 'Security Update', 
      content: 'We\'ve implemented additional security measures to protect your data.', 
      type: 'system', 
      targetAudience: 'all',
      status: 'draft',
      createdAt: '2024-12-01',
      recipients: 0,
      opened: 0
    },
  ]);

  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    type: 'system' as const,
    targetAudience: 'all' as const,
    status: 'draft' as const
  });

  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  const handleAddNotification = () => {
    if (newNotification.title.trim() && newNotification.content.trim()) {
      const notification: Notification = {
        id: notifications.length + 1,
        title: newNotification.title,
        content: newNotification.content,
        type: newNotification.type,
        targetAudience: newNotification.targetAudience,
        status: newNotification.status,
        createdAt: new Date().toISOString().split('T')[0],
        recipients: 0,
        opened: 0
      };
      setNotifications([...notifications, notification]);
      setNewNotification({ 
        title: '', 
        content: '', 
        type: 'system', 
        targetAudience: 'all', 
        status: 'draft' 
      });
      alert(`New notification "${newNotification.title}" added successfully!`);
    }
  };

  const handleUpdateNotification = () => {
    if (editingNotification) {
      setNotifications(notifications.map(notif => 
        notif.id === editingNotification.id ? editingNotification : notif
      ));
      setEditingNotification(null);
      alert(`"${editingNotification.title}" updated successfully!`);
    }
  };

  const handleDeleteNotification = (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notif => notif.id !== id));
      alert('Notification deleted successfully!');
    }
  };

  const handleSendNotification = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, status: 'sent', sentAt: new Date().toISOString().split('T')[0]} : notif
    ));
    alert(`Notification #${id} sent successfully!`);
  };

  const handleScheduleNotification = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, status: 'scheduled'} : notif
    ));
    alert(`Notification #${id} scheduled successfully!`);
  };

  const filteredNotifications = notifications;

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'system': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'email': return 'bg-stalker-purple/20 text-stalker-purple';
      case 'push': return 'bg-stalker-green/20 text-stalker-green';
      case 'banner': return 'bg-stalker-yellow/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch(audience) {
      case 'all': return 'bg-stalker-cyan/20 text-stalker-dark';
      case 'freelancers': return 'bg-stalker-blue/20 text-stalker-dark';
      case 'clients': return 'bg-stalker-green/20 text-stalker-dark';
      case 'premium': return 'bg-stalker-yellow/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
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
                  NOTIFICATION MANAGEMENT
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
                  activeTab === 'notifications'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-4 w-4 inline mr-2" />
                Notifications ({notifications.length})
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
                Notification Settings
              </button>
            </div>
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <span>Notification Center</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search notifications..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                        
                        <select 
                          className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option>All Types</option>
                          <option>System</option>
                          <option>Email</option>
                          <option>Push</option>
                          <option>Banner</option>
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
                          {filteredNotifications.map((notification) => (
                            <tr key={notification.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{notification.title}</td>
                              <td className="py-3 px-4">
                                <Badge className={getTypeColor(notification.type)}>
                                  <Mail className="h-4 w-4 mr-1" />
                                  <span className="capitalize">{notification.type}</span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={getAudienceColor(notification.targetAudience)}>
                                  <Users className="h-4 w-4 mr-1" />
                                  <span className="capitalize">{notification.targetAudience}</span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  className={getStatusColor(notification.status)}
                                >
                                  {notification.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">{notification.recipients.toLocaleString()}</td>
                              <td className="py-3 px-4 text-stalker-text">
                                {notification.opened ? 
                                  `${Math.round((notification.opened / notification.recipients) * 100)}% (${notification.opened})` : 
                                  'N/A'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Viewing notification details: ${notification.title}`)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                    onClick={() => setEditingNotification(notification)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  
                                  {notification.status === 'draft' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10"
                                        onClick={() => handleScheduleNotification(notification.id)}
                                      >
                                        <Clock className="h-4 w-4 mr-1" />
                                        Schedule
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                                        onClick={() => handleSendNotification(notification.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        Send
                                      </Button>
                                    </>
                                  )}
                                  
                                  {notification.status === 'scheduled' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                      onClick={() => handleSendNotification(notification.id)}
                                    >
                                      <Send className="h-4 w-4 mr-1" />
                                      Send Now
                                    </Button>
                                  )}
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                    onClick={() => handleDeleteNotification(notification.id)}
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
                    
                    {filteredNotifications.length === 0 && (
                      <div className="text-center py-10 text-stalker-muted">
                        No notifications found
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Add/Edit Notification Form */}
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>{editingNotification ? 'Edit Notification' : 'Create New Notification'}</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Title</label>
                          <Input
                            placeholder="Enter notification title..."
                            value={editingNotification ? editingNotification.title : newNotification.title}
                            onChange={(e) => 
                              editingNotification 
                                ? setEditingNotification({...editingNotification, title: e.target.value}) 
                                : setNewNotification({...newNotification, title: e.target.value})
                            }
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Type</label>
                          <select
                            value={editingNotification ? editingNotification.type : newNotification.type}
                            onChange={(e) => 
                              editingNotification 
                                ? setEditingNotification({...editingNotification, type: e.target.value as any}) 
                                : setNewNotification({...newNotification, type: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="system">System Notification</option>
                            <option value="email">Email Notification</option>
                            <option value="push">Push Notification</option>
                            <option value="banner">Banner Notification</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Target Audience</label>
                          <select
                            value={editingNotification ? editingNotification.targetAudience : newNotification.targetAudience}
                            onChange={(e) => 
                              editingNotification 
                                ? setEditingNotification({...editingNotification, targetAudience: e.target.value as any}) 
                                : setNewNotification({...newNotification, targetAudience: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="all">All Users</option>
                            <option value="freelancers">Freelancers Only</option>
                            <option value="clients">Clients Only</option>
                            <option value="premium">Premium Members</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Status</label>
                          <select
                            value={editingNotification ? editingNotification.status : newNotification.status}
                            onChange={(e) => 
                              editingNotification 
                                ? setEditingNotification({...editingNotification, status: e.target.value as any}) 
                                : setNewNotification({...newNotification, status: e.target.value as any})
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
                            placeholder="Enter notification content..."
                            value={editingNotification ? editingNotification.content : newNotification.content}
                            onChange={(e) => 
                              editingNotification 
                                ? setEditingNotification({...editingNotification, content: e.target.value}) 
                                : setNewNotification({...newNotification, content: e.target.value})
                            }
                            rows={6}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div className="pt-4">
                          {editingNotification ? (
                            <div className="flex gap-3">
                              <Button 
                                onClick={handleUpdateNotification}
                                className="flex-1 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Update Notification
                              </Button>
                              <Button 
                                onClick={() => setEditingNotification(null)}
                                variant="outline"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={handleAddNotification}
                              className="w-full bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Create Notification
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Notification Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Notification Settings</span>
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
      
      <Footer />
    </div>
  );
}