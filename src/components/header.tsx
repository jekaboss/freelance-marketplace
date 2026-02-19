"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ServerIcon, UserIcon, LogOutIcon, Menu, X, Briefcase, Users, FileText, Shield, Search, Building2, SettingsIcon, MessageSquareIcon, ClipboardListIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { AuthModal } from "@/components/auth-modal";
import { useAdmin } from "@/components/admin-provider";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getApiBase, getProvidersForMode } from "@/lib/api-client";

// SSR-safe admin link
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

// Menu item component with icon (for reference)
function MenuItem({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
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
  const unreadMessages = isHydrated && isAuthenticated && typeof window !== "undefined"
    ? Number(localStorage.getItem("unreadMessagesCount") || 0)
    : 0;

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto grid h-16 grid-cols-[auto_1fr_auto] items-center px-4">
        <Logo />

        {/* Desktop Navigation - shows on md and larger */}
                <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 text-sm font-medium justify-self-center">
          <Link href="/projects" className="inline-flex items-center px-1 py-2 hover:text-primary transition-colors">
            {"\u041c\u043e\u0457 \u0437\u0430\u0432\u0434\u0430\u043d\u043d\u044f"}
          </Link>
          <Link href="/freelancers" className="inline-flex items-center px-1 py-2 hover:text-primary transition-colors">
            {"\u0424\u0440\u0438\u043b\u0430\u043d\u0441\u0435\u0440\u0438"}
          </Link>
          <Link href="/vacancies" className="inline-flex items-center px-1 py-2 hover:text-primary transition-colors">
            {"\u0428\u0443\u043a\u0430\u0447\u0456"}
          </Link>
          <Link href="/freelance-work" className="inline-flex items-center px-1 py-2 hover:text-primary transition-colors">
            {"\u041f\u043e\u0441\u043b\u0443\u0433\u0438"}
          </Link>
          <div className="relative group cursor-pointer">
            <span className="inline-flex items-center px-1 py-2 hover:text-primary transition-colors">
              {"\u041d\u043e\u0432\u0435 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f"}
            </span>
            <div className="absolute left-0 top-full pt-1 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-background rounded-md border shadow-lg p-2">
                <Link href="/projects/new" className="flex items-start gap-3 px-3 py-3 rounded-md hover:bg-accent transition-colors">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{"\u041e\u043f\u0443\u0431\u043b\u0456\u043a\u0443\u0432\u0430\u0442\u0438 \u043f\u0440\u043e\u0454\u043a\u0442"}</p>
                  </div>
                </Link>
                <Link href="/vacancies/post" className="flex items-start gap-3 px-3 py-3 rounded-md hover:bg-accent transition-colors">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{"\u0421\u0442\u0432\u043e\u0440\u0438\u0442\u0438 \u0432\u0430\u043a\u0430\u043d\u0441\u0456\u044e"}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <AdminLink isAdmin={isAdmin} />
        </nav>

        <div className="flex items-center space-x-2 lg:space-x-4 justify-self-end">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            suppressHydrationWarning
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isHydrated && isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Messages"
              onClick={() => router.push("/messages")}
            >
              <MessageSquareIcon className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute right-1.5 top-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </Button>
          )}

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
                    {"\u041c\u0456\u0439 \u043a\u0430\u0431\u0456\u043d\u0435\u0442"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/projects">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {"\u041f\u0440\u043e\u0444\u0456\u043b\u044c \u0440\u043e\u0431\u043e\u0442\u043e\u0434\u0430\u0432\u0446\u044f"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Users className="mr-2 h-4 w-4" />
                    {"\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u0442\u0430 \u043d\u043e\u0442\u0430\u0442\u043a\u0438"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <ClipboardListIcon className="mr-2 h-4 w-4" />
                    {"\u041e\u0441\u043e\u0431\u0438\u0441\u0442\u0456 \u0434\u0430\u043d\u0456"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    {"\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f"}
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
            <>
              <AuthModal defaultTab="signup" buttonLabel={t('login')} />
            </>
          )}

          {/* Mobile Menu Button - shows on small screens only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            suppressHydrationWarning
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - shows below md breakpoint */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {/* Mobile For Clients Section */}
            <div className="border-b pb-2 mb-2">
              <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('forClients')}</p>
              <Link 
                href="/projects/new" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('createFreelanceProject')}</p>
                    <p className="text-xs text-muted-foreground">{t('createFreelanceProjectDesc')}</p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/vacancies/post" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('postVacancy')}</p>
                    <p className="text-xs text-muted-foreground">{t('postVacancyDesc')}</p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/freelancers" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('findFreelancer')}</p>
                    <p className="text-xs text-muted-foreground">{t('findFreelancerDesc')}</p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/business-safe" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('businessSafe')}</p>
                    <p className="text-xs text-muted-foreground">{t('businessSafeDesc')}</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile For Freelancers Section */}
            <div className="border-b pb-2 mb-2">
              <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('forFreelancers')}</p>
              <Link
                href="/freelance-work"
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('findFreelanceProject')}</p>
                    <p className="text-xs text-muted-foreground">{t('findFreelanceProjectDesc')}</p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/resume/post" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('postResume')}</p>
                    <p className="text-xs text-muted-foreground">{t('postResumeDesc')}</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Vacancies Section */}
            <div className="border-b pb-2 mb-2">
              <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('vacancies')}</p>
              <Link 
                href="/vacancies" 
                className="px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('listVacancies')}</p>
                    <p className="text-xs text-muted-foreground">{t('listVacanciesDesc')}</p>
                  </div>
                </div>
              </Link>
            </div>

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
