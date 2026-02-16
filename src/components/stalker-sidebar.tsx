"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RadiationIcon, UserIcon, BriefcaseIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, BarChart, Shield, FolderPlus, Bell, FileText, DollarSign, MessageSquare, CreditCard, Globe } from "lucide-react";

export function StalkerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Track if we're in compact mode (tablets: 768px - 1024px)
  const [isCompactMode, setIsCompactMode] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      setIsCompactMode(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

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
      {/* Mobile menu button - FAB style - shows only on small screens below md */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 z-50 bg-stalker-green text-stalker-dark border-stalker-border shadow-lg shadow-stalker-green/30 hover:bg-stalker-yellow"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </Button>

      {/* Sidebar - Full screen on mobile, side on tablet+ desktop */}
      <div 
        className={`fixed md:relative z-40 h-full bg-stalker-dark border-r border-stalker-border transform transition-all duration-300 ease-in-out ${
          // lg+: always full width, md-md: collapsible, mobile: full screen when open
          isOpen || isHovered ? 'lg:w-64 w-72 md:w-64' : (isCompactMode ? 'lg:w-64 w-16 md:w-16' : 'lg:w-64')
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        onMouseEnter={() => isCompactMode && setIsHovered(true)}
        onMouseLeave={() => isCompactMode && setIsHovered(false)}
        onClick={() => isCompactMode && setIsOpen(!isOpen)}
      >
        <div className="p-2 md:p-2 h-full overflow-y-auto">
          {/* Header - always visible */}
          <div className="flex items-center justify-center md:justify-between mb-4 md:mb-6 px-1">
            <div className="flex items-center gap-2">
              <RadiationIcon className="h-7 w-7 text-stalker-green flex-shrink-0" />
              {(isOpen || isHovered || !isCompactMode) && (
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow whitespace-nowrap">
                  ZONE
                </h2>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-stalker-muted hover:text-stalker-text"
              onClick={toggleSidebar}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
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
                    <CardContent className={`p-2 md:p-2.5 flex items-center ${isCompactMode ? 'justify-center' : 'justify-start'} gap-2 md:gap-3`}>
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-stalker-green' : 'text-stalker-muted'}`} />
                      {(isOpen || isHovered || !isCompactMode) && (
                        <span className={`text-sm whitespace-nowrap ${isActive ? 'text-stalker-green font-semibold' : 'text-stalker-text'}`}>
                          {item.label}
                        </span>
                      )}
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
                <CardContent className={`p-2 md:p-2.5 flex items-center ${isCompactMode ? 'justify-center' : 'justify-start'} gap-2 md:gap-3`}>
                  <LogOutIcon className="h-5 w-5 text-stalker-red flex-shrink-0" />
                  {(isOpen || isHovered || !isCompactMode) && (
                    <span className="text-sm text-stalker-text whitespace-nowrap">Exit Zone</span>
                  )}
                </CardContent>
              </Card>
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
