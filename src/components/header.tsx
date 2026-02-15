"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ServerIcon, UserIcon, LogOutIcon } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
        <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  );
}
