"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RadiationIcon, UserIcon, BriefcaseIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, BarChart, Shield, FolderPlus, Bell, FileText, DollarSign, MessageSquare, CreditCard, Globe } from "lucide-react";

export function StalkerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
      {/* Mobile/Tablet menu button - FAB style - shows only on small-medium screens */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-20 left-4 z-50 bg-stalker-green text-stalker-dark border-stalker-border shadow-lg shadow-stalker-green/30 hover:bg-stalker-yellow"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </Button>

      {/* Mobile/Tablet sidebar - Full screen on mobile/tablet */}
      <div 
        className={`fixed lg:hidden left-0 top-32 z-40 flex flex-col w-72 h-[calc(100vh-128px)] bg-stalker-dark border-r border-stalker-border transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-2 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-0 px-1">
            <div className="flex items-center gap-2">
              <RadiationIcon className="h-7 w-7 text-stalker-green flex-shrink-0" />
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                ZONE
              </h2>
            </div>
          </div>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={`cursor-pointer transition-all duration-200 rounded-lg p-3 flex items-center gap-3 ${
                      isActive 
                        ? 'bg-stalker-card border border-stalker-green shadow-lg shadow-stalker-green/20' 
                        : 'border border-stalker-border hover:bg-stalker-card'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-stalker-green/50 bg-stalker-darker flex-shrink-0">
                      <Icon className={`h-6 w-6 ${isActive ? 'text-stalker-green' : 'text-stalker-green'}`} />
                    </div>
                    <span className={`text-sm whitespace-nowrap ${isActive ? 'text-stalker-green font-semibold' : 'text-stalker-text'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Exit button */}
          <Link href="/admin/login" onClick={(e) => { e.preventDefault(); localStorage.removeItem('isAdmin'); window.location.href = '/admin/login'; }}>
            <div 
              className="cursor-pointer transition-all duration-200 rounded-lg p-3 flex items-center gap-3 border border-stalker-border hover:bg-stalker-card mt-auto"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-stalker-red/50 bg-stalker-darker flex-shrink-0">
                <LogOutIcon className="h-6 w-6 text-stalker-red" />
              </div>
              <span className="text-sm text-stalker-text whitespace-nowrap">Exit Zone</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Desktop Sidebar - Icons only by default, expands on hover */}
      <div 
        className={`hidden lg:flex fixed left-0 top-0 z-40 flex-col h-full bg-stalker-dark border-r border-stalker-border transition-all duration-300 ease-in-out ${
          isHovered ? 'w-56' : 'w-24'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 h-full flex flex-col gap-2">
          {/* Header - shows icon by default, label on hover */}
          <div className="flex items-center gap-3 mb-1">
            <RadiationIcon className="h-8 w-8 text-stalker-green flex-shrink-0" />
            {isHovered && (
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow whitespace-nowrap">
                ZONE
              </h2>
            )}
          </div>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={`cursor-pointer transition-all duration-200 rounded-lg p-3 flex items-center gap-3 ${
                      isActive 
                        ? 'bg-stalker-card border border-stalker-green shadow-lg shadow-stalker-green/20' 
                        : 'hover:bg-stalker-card border border-stalker-border'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg border flex-shrink-0 transition-all ${
                      isActive
                        ? 'border-stalker-green bg-stalker-darker'
                        : 'border-stalker-green/30 bg-stalker-darker'
                    }`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-stalker-green' : 'text-stalker-green'}`} />
                    </div>
                    {isHovered && (
                      <span className={`text-sm whitespace-nowrap transition-opacity ${isActive ? 'text-stalker-green font-semibold' : 'text-stalker-text'}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Exit button */}
          <Link href="/admin/login" onClick={(e) => { e.preventDefault(); localStorage.removeItem('isAdmin'); window.location.href = '/admin/login'; }}>
            <div 
              className="cursor-pointer transition-all duration-200 rounded-lg p-3 flex items-center gap-3 hover:bg-stalker-card border border-stalker-border mt-auto"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-stalker-red/30 bg-stalker-darker flex-shrink-0">
                <LogOutIcon className="h-6 w-6 text-stalker-red" />
              </div>
              {isHovered && (
                <span className="text-sm text-stalker-text whitespace-nowrap">Exit Zone</span>
              )}
            </div>
          </Link>
        </div>
      </div>

    </>
  );
}
