"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, Bell, Mail, Send, Copy, Trash2, RadiationIcon, LogOutIcon, Edit3 } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminNotificationsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Welcome to our platform', 
      type: 'welcome', 
      recipients: 'New users', 
      date: '2024-12-15', 
      status: 'sent',
      content: 'Welcome to our freelance marketplace!'
    },
    { 
      id: 2, 
      title: 'Project deadline approaching', 
      type: 'reminder', 
      recipients: 'Project owners', 
      date: '2024-12-16', 
      status: 'scheduled',
      content: 'Your project deadline is approaching, please take action.'
    },
    { 
      id: 3, 
      title: 'Payment received', 
      type: 'payment', 
      recipients: 'Freelancers', 
      date: '2024-12-17', 
      status: 'draft',
      content: 'We have processed your payment successfully.'
    },
    { 
      id: 4, 
      title: 'Account verification required', 
      type: 'verification', 
      recipients: 'All users', 
      date: '2024-12-18', 
      status: 'pending',
      content: 'Please verify your account to continue using our services.'
    },
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    type: 'general',
    recipients: 'all',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('manage');

  const handleCreateNotification = () => {
    if (newNotification.title.trim() && newNotification.content.trim()) {
      const notification = {
        id: notifications.length + 1,
        title: newNotification.title,
        type: newNotification.type,
        recipients: newNotification.recipients,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        content: newNotification.content
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({ title: '', type: 'general', recipients: 'all', content: '' });
      alert('Notification created successfully!');
    }
  };

  const handleSendNotification = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, status: 'sent'} : n
    ));
    alert('Notification sent successfully!');
  };

  const handleDeleteNotification = (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
      alert('Notification deleted successfully!');
    }
  };

  const handleResendNotification = (id: number) => {
    alert(`Resending notification #${id}`);
  };

  const notificationTypes = [
    { value: 'general', label: 'General Notification' },
    { value: 'alert', label: 'Alert/Warning' },
    { value: 'payment', label: 'Payment Related' },
    { value: 'project', label: 'Project Updates' },
    { value: 'verification', label: 'Verification Required' },
    { value: 'marketing', label: 'Marketing/Promotion' },
  ];

  const recipientOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'freelancers', label: 'Freelancers Only' },
    { value: 'clients', label: 'Clients Only' },
    { value: 'premium', label: 'Premium Members' },
    { value: 'inactive', label: 'Inactive Users' },
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
        <div className="flex-1 container py-12 px-4 relative z-10">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  NOTIFICATION CENTER
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Manage platform notifications and communications
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
                  activeTab === 'manage'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('manage')}
              >
                <Bell className="h-4 w-4 inline mr-2" />
                Manage Notifications
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'create'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('create')}
              >
                <Send className="h-4 w-4 inline mr-2" />
                Create New
              </button>
            </div>
            
            {/* Manage Notifications Tab */}
            {activeTab === 'manage' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <span>Notification Queue</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search notifications..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
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
                            <th className="text-left py-3 px-4 text-stalker-green">Recipients</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Date</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notification) => (
                            <tr key={notification.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{notification.title}</td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text capitalize">
                                  {notification.type}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">{notification.recipients}</td>
                              <td className="py-3 px-4 text-stalker-text">{notification.date}</td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant="default"
                                  className={
                                    notification.status === 'sent' 
                                      ? 'bg-stalker-green text-stalker-dark' 
                                      : notification.status === 'scheduled'
                                        ? 'bg-stalker-yellow text-stalker-dark'
                                        : notification.status === 'draft'
                                          ? 'bg-stalker-blue text-stalker-dark'
                                          : 'bg-stalker-border text-stalker-text'
                                  }
                                >
                                  {notification.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Editing notification #${notification.id}`)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                      notification.status === 'draft' || notification.status === 'pending'
                                        ? 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                        : 'border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10'
                                    }
                                    onClick={() => 
                                      notification.status === 'draft' || notification.status === 'pending' 
                                        ? handleSendNotification(notification.id) 
                                        : handleResendNotification(notification.id)
                                    }
                                  >
                                    {notification.status === 'draft' || notification.status === 'pending' ? (
                                      <>
                                        <Send className="h-4 w-4 mr-1" />
                                        Send
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-1" />
                                        Resend
                                      </>
                                    )}
                                  </Button>
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
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Create Notification Tab */}
            {activeTab === 'create' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>Create New Notification</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Title</label>
                          <Input
                            placeholder="Enter notification title..."
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Type</label>
                          <select
                            value={newNotification.type}
                            onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            {notificationTypes.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Recipients</label>
                          <select
                            value={newNotification.recipients}
                            onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            {recipientOptions.map((recipient) => (
                              <option key={recipient.value} value={recipient.value}>{recipient.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Content</label>
                          <Textarea
                            placeholder="Enter notification content..."
                            value={newNotification.content}
                            onChange={(e) => setNewNotification({...newNotification, content: e.target.value})}
                            rows={6}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                          <Button 
                            onClick={handleCreateNotification}
                            className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90 flex-1"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Save Draft
                          </Button>
                          <Button 
                            onClick={() => {
                              if (newNotification.title.trim() && newNotification.content.trim()) {
                                handleSendNotification(notifications.length + 1);
                                setNewNotification({ title: '', type: 'general', recipients: 'all', content: '' });
                              }
                            }}
                            variant="outline"
                            className="border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10 flex-1"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Now
                          </Button>
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
      
      <Footer />
    </div>
  );
}