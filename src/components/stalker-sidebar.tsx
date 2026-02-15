"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RadiationIcon, UserIcon, BriefcaseIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, BarChart, Shield, FolderPlus, Bell, FileText, DollarSign, MessageSquare, CreditCard, Globe } from "lucide-react";

export function StalkerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: RadiationIcon },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/moderation", label: "Moderation", icon: Shield },
    { href: "/admin/categories", label: "Categories", icon: FolderPlus },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/content", label: "Content", icon: FileText },
    { href: "/admin/payments", label: "Payments", icon: DollarSign },
    { href: "/admin/support", label: "Support", icon: MessageSquare },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/admin/system-messages", label: "System Messages", icon: Globe },
    { href: "/admin/projects", label: "Projects", icon: BriefcaseIcon },
    { href: "/admin/freelancers", label: "Freelancers", icon: UserIcon },
    { href: "/admin/users", label: "Users", icon: UserIcon },
    { href: "/admin/activity-log", label: "Activity Log", icon: RadiationIcon },
    { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-stalker-dark text-stalker-green border-stalker-border"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div 
        className={`fixed lg:relative z-40 h-full w-64 bg-stalker-dark border-r border-stalker-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <RadiationIcon className="h-8 w-8 text-stalker-green" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
              ZONE CONTROL
            </h2>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'bg-stalker-card border-stalker-green shadow-lg shadow-stalker-green/20' 
                        : 'bg-stalker-card hover:bg-stalker-darker border-stalker-border'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-stalker-green' : 'text-stalker-muted'}`} />
                      <span className={`${isActive ? 'text-stalker-green font-semibold' : 'text-stalker-text'}`}>
                        {item.label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            
            <Link href="/admin/login" onClick={(e) => { e.preventDefault(); localStorage.removeItem('isAdmin'); window.location.href = '/admin/login'; }}>
              <Card 
                className="cursor-pointer transition-all duration-200 bg-stalker-card hover:bg-stalker-darker border-stalker-border mt-4"
                onClick={() => setIsOpen(false)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <LogOutIcon className="h-5 w-5 text-stalker-red" />
                  <span className="text-stalker-text">Exit Zone</span>
                </CardContent>
              </Card>
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}