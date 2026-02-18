"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { RadiationIcon, LogOutIcon } from "lucide-react";
import { StalkerSidebar } from "@/components/stalker-sidebar";

export default function AdminSettingsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUsername = formData.get('newUsername') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmNewPassword') as string;

    if (newUsername && newPassword && newPassword === confirmPassword) {
      // In a real application, this would update the credentials securely
      localStorage.setItem('adminUsername', newUsername);
      localStorage.setItem('adminPassword', newPassword);
      alert('Credentials updated successfully!');
    } else if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const maintenanceMode = (formData.get('maintenanceMode') as string) === 'on';
    const systemLogLevel = formData.get('systemLogLevel') as string;
    const backupSchedule = formData.get('backupSchedule') as string;
    const notificationThreshold = formData.get('notificationThreshold') as string;
    
    // In a real application, this would update system settings
    alert(`System settings updated:\nMaintenance Mode: ${maintenanceMode}\nLog Level: ${systemLogLevel}\nBackup Schedule: ${backupSchedule}\nNotification Threshold: ${notificationThreshold}`);
  };

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const smtpHost = formData.get('smtpHost') as string;
    const smtpPort = formData.get('smtpPort') as string;
    const smtpUser = formData.get('smtpUser') as string;
    const smtpPass = formData.get('smtpPass') as string;
    const fromEmail = formData.get('fromEmail') as string;
    
    // In a real application, this would update email settings
    alert(`Email settings updated:\nSMTP Host: ${smtpHost}\nSMTP Port: ${smtpPort}\nFrom Email: ${fromEmail}`);
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
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                SECURE SETTINGS
              </h1>
              <p className="text-stalker-muted mt-2 flex items-center gap-2 justify-center text-sm">
                <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                Change your admin credentials here
              </p>
            </div>
          </div>

          <div>
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="p-5 bg-gradient-to-r from-stalker-red to-stalker-orange text-stalker-dark rounded-t-xl -m-5 -mx-5">
                  <CardTitle className="text-2xl text-stalker-dark flex items-center gap-2 justify-center">
                    <RadiationIcon className="h-6 w-6" />
                    Change Admin Credentials
                  </CardTitle>
                </div>
                <p className="text-sm text-stalker-muted mt-4">
                  Update your username and password for admin access
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangeCredentials} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newUsername" className="text-stalker-text">New Username</Label>
                    <Input 
                      id="newUsername" 
                      name="newUsername" 
                      type="text" 
                      placeholder="Enter new username"
                      required
                      className="bg-stalker-darker border-stalker-border text-stalker-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-stalker-text">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      placeholder="Enter new password"
                      required
                      className="bg-stalker-darker border-stalker-border text-stalker-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-stalker-text">Confirm New Password</Label>
                    <Input 
                      id="confirmNewPassword" 
                      name="confirmNewPassword" 
                      type="password" 
                      placeholder="Confirm new password"
                      required
                      className="bg-stalker-darker border-stalker-border text-stalker-text"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-stalker-green to-stalker-yellow text-stalker-dark hover:from-stalker-green hover:to-stalker-yellow">
                    Update Credentials
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-stalker-card border-stalker-border shadow-xl mt-8">
              <CardHeader>
                <CardTitle className="text-stalker-green">Additional Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="two-factor" className="text-stalker-text">Two-Factor Authentication</Label>
                      <p className="text-sm text-stalker-muted">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="two-factor" className="data-[state=checked]:bg-stalker-green" onClick={() => alert('Two-Factor Authentication setting updated')} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="notifications" className="text-stalker-text">Email Notifications</Label>
                      <p className="text-sm text-stalker-muted">
                        Receive notifications about account activity
                      </p>
                    </div>
                    <Switch id="notifications" checked className="data-[state=checked]:bg-stalker-green" onClick={() => alert('Email Notifications setting updated')} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="auto-logout" className="text-stalker-text">Auto Logout</Label>
                      <p className="text-sm text-stalker-muted">
                        Automatically logout after period of inactivity
                      </p>
                    </div>
                    <Select defaultValue="30" onValueChange={(value) => alert(`Auto Logout setting updated to: ${value} minutes`)}>
                      <SelectTrigger className="w-24 bg-stalker-darker border-stalker-border text-stalker-text">
                        <SelectValue placeholder="Minutes" />
                      </SelectTrigger>
                      <SelectContent className="bg-stalker-darker border-stalker-border text-stalker-text">
                        <SelectItem value="15" className="hover:bg-stalker-border">15 min</SelectItem>
                        <SelectItem value="30" className="hover:bg-stalker-border">30 min</SelectItem>
                        <SelectItem value="60" className="hover:bg-stalker-border">1 hour</SelectItem>
                        <SelectItem value="0" className="hover:bg-stalker-border">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* System Settings Card */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl mt-8 overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2 justify-center">
                  <RadiationIcon className="h-6 w-6" />
                  System Configuration
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceMode" className="text-stalker-text">Maintenance Mode</Label>
                      <div className="flex items-center gap-3">
                        <Switch id="maintenanceMode" name="maintenanceMode" className="data-[state=checked]:bg-stalker-green" />
                        <span className="text-stalker-muted text-sm">Enable maintenance mode</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="systemLogLevel" className="text-stalker-text">Log Level</Label>
                      <Select name="systemLogLevel" defaultValue="info">
                        <SelectTrigger className="bg-stalker-darker border-stalker-border text-stalker-text">
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent className="bg-stalker-darker border-stalker-border text-stalker-text">
                          <SelectItem value="debug" className="hover:bg-stalker-border">Debug</SelectItem>
                          <SelectItem value="info" className="hover:bg-stalker-border">Info</SelectItem>
                          <SelectItem value="warn" className="hover:bg-stalker-border">Warning</SelectItem>
                          <SelectItem value="error" className="hover:bg-stalker-border">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="backupSchedule" className="text-stalker-text">Backup Schedule</Label>
                      <Select name="backupSchedule" defaultValue="daily">
                        <SelectTrigger className="bg-stalker-darker border-stalker-border text-stalker-text">
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-stalker-darker border-stalker-border text-stalker-text">
                          <SelectItem value="hourly" className="hover:bg-stalker-border">Hourly</SelectItem>
                          <SelectItem value="daily" className="hover:bg-stalker-border">Daily</SelectItem>
                          <SelectItem value="weekly" className="hover:bg-stalker-border">Weekly</SelectItem>
                          <SelectItem value="monthly" className="hover:bg-stalker-border">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notificationThreshold" className="text-stalker-text">Notification Threshold</Label>
                      <Input 
                        id="notificationThreshold" 
                        name="notificationThreshold" 
                        type="number" 
                        placeholder="Enter threshold value"
                        defaultValue="100"
                        min="1"
                        max="1000"
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-stalker-blue to-stalker-purple text-stalker-dark hover:from-stalker-blue hover:to-stalker-purple">
                    Update System Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Email Settings Card */}
            <Card className="bg-stalker-card border-stalker-border shadow-xl mt-8 overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                <CardTitle className="text-stalker-dark flex items-center gap-2 justify-center">
                  <RadiationIcon className="h-6 w-6" />
                  Email Configuration
                </CardTitle>
              </div>
              <CardContent className="pt-6">
                <form onSubmit={handleEmailSettingsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost" className="text-stalker-text">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        name="smtpHost" 
                        type="text" 
                        placeholder="smtp.example.com"
                        defaultValue="smtp.gmail.com"
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort" className="text-stalker-text">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        name="smtpPort" 
                        type="number" 
                        placeholder="587"
                        defaultValue="587"
                        min="1"
                        max="65535"
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser" className="text-stalker-text">SMTP Username</Label>
                      <Input 
                        id="smtpUser" 
                        name="smtpUser" 
                        type="email" 
                        placeholder="username@example.com"
                        defaultValue="admin@example.com"
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPass" className="text-stalker-text">SMTP Password</Label>
                      <Input 
                        id="smtpPass" 
                        name="smtpPass" 
                        type="password" 
                        placeholder="Enter password"
                        defaultValue="password123"
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail" className="text-stalker-text">From Email</Label>
                    <Input 
                      id="fromEmail" 
                      name="fromEmail" 
                      type="email" 
                      placeholder="noreply@example.com"
                      defaultValue="noreply@stalker-zone.com"
                      className="bg-stalker-darker border-stalker-border text-stalker-text"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-stalker-cyan to-stalker-teal text-stalker-dark hover:from-stalker-cyan hover:to-stalker-teal">
                    Update Email Settings
                  </Button>
                </form>
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
