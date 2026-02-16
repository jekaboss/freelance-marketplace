"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ServerIcon, UserIcon, LogOutIcon, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { AuthModal } from "@/components/auth-modal";
import { useAdmin } from "@/components/admin-provider";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getApiBase, getProvidersForMode } from "@/lib/api-client";

// Компонент для відображення посилання на адмін-панель, який працює коректно з SSR
function AdminLink({ isAdmin }: { isAdmin: boolean }) {
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isAdmin) {
    return null;
  }

  return (
    <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground">
      {t('adminPanel')}
    </Link>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { isAdmin } = useAdmin();
  const { apiMode, setApiMode, user, isAuthenticated, logout, isHydrated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const apiModes = [
    { value: "auto", label: "Auto" },
    { value: "nest", label: "NestJS" },
    { value: "fastapi", label: "FastAPI" },
  ] as const;

  // Get avatar URL with full path
  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return null;
    // If already full URL, return as is
    if (user.avatarUrl.startsWith('http')) return user.avatarUrl;
    // Otherwise, construct full URL
    try {
      const providers = getProvidersForMode(apiMode);
      const apiBase = getApiBase(providers[0]);
      const baseRoot = apiBase.replace(/\/api$/, "");
      return `${baseRoot}${user.avatarUrl}`;
    } catch {
      return user.avatarUrl;
    }
  };

  const avatarUrl = isHydrated ? getAvatarUrl() : null;
  const displayName = isHydrated ? (user?.fullName || user?.email || "User") : "User";

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation - shows on md and larger */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
            {t('home')}
          </Link>
          <Link href="/projects" className="transition-colors hover:text-foreground/80 text-foreground">
            {t('projects')}
          </Link>
          <Link href="/freelancers" className="transition-colors hover:text-foreground/80 text-foreground">
            {t('freelancers')}
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground/80 text-foreground">
            {t('portfolio')}
          </Link>
          <Link href="/start-cooperation" className="transition-colors hover:text-foreground/80 text-foreground">
            {t('startCooperation')}
          </Link>
          <AdminLink isAdmin={isAdmin} />
        </nav>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Theme & API buttons - hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle theme">
                  <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>{t('lightMode')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>{t('darkMode')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>{t('systemMode')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Change API provider">
                  <ServerIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {apiModes.map((mode) => (
                  <DropdownMenuItem
                    key={mode.value}
                    onClick={() => setApiMode(mode.value)}
                    className={apiMode === mode.value ? "bg-accent" : ""}
                  >
                    {mode.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User menu or Auth button */}
          {isHydrated && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl || undefined} alt={displayName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10">
                      {displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {t('profile') || 'Profile'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  {t('logout') || 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal />
          )}

          {/* Mobile Menu Button - shows on small screens only */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - shows below md breakpoint */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            <Link 
              href="/" 
              className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={closeMobileMenu}
            >
              {t('home')}
            </Link>
            <Link 
              href="/projects" 
              className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={closeMobileMenu}
            >
              {t('projects')}
            </Link>
            <Link 
              href="/freelancers" 
              className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={closeMobileMenu}
            >
              {t('freelancers')}
            </Link>
            <Link 
              href="/portfolio" 
              className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={closeMobileMenu}
            >
              {t('portfolio')}
            </Link>
            <Link 
              href="/start-cooperation" 
              className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={closeMobileMenu}
            >
              {t('startCooperation')}
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                {t('adminPanel')}
              </Link>
            )}
            {/* Mobile theme toggle */}
            <div className="sm:hidden pt-2 border-t">
              <p className="px-4 py-2 text-sm text-muted-foreground">Theme</p>
              <div className="flex gap-2 px-4">
                <Button variant="outline" size="sm" onClick={() => setTheme("light")} className="flex-1">
                  <SunIcon className="h-4 w-4 mr-2" />
                  {t('lightMode')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTheme("dark")} className="flex-1">
                  <MoonIcon className="h-4 w-4 mr-2" />
                  {t('darkMode')}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
