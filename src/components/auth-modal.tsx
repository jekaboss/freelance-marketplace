"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { UserIcon, FolderIcon, UserCheckIcon, UsersIcon, MessageSquareIcon, BellIcon, SettingsIcon, LogOutIcon, MenuIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const MIN_PASSWORD_LENGTH = 6;

export function AuthModal({ defaultTab = "login", buttonLabel }: { defaultTab?: "login" | "signup"; buttonLabel?: string }) {
  const { t } = useTranslation();
  const { login, register, logout, isAuthenticated, user, isHydrated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  // Все useState должны быть в начале!
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [accountType, setAccountType] = useState<"freelancer" | "client">("client");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Wait for hydration - не useState, поэтому можно после
  if (!isHydrated) {
    return null;
  }

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const ok = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!ok) {
      setError(t("errorLoginFailed"));
      showToast(t("errorLoginFailed"), "error");
      return;
    }
    showToast(t("success"), "success");
    setIsOpen(false);
    setTimeout(() => {
      try {
        const rawUser = sessionStorage.getItem("authUser") || localStorage.getItem("authUser");
        const role = rawUser ? JSON.parse(rawUser)?.role : undefined;
        if (role === "admin") {
          router.push("/admin");
          return;
        }
      } catch {
        // ignore parse error and keep current page
      }
    }, 50);
  };

  const handleSignup = async () => {
    setError(null);
    if (signupPassword.length < MIN_PASSWORD_LENGTH) {
      const message = t("errorPasswordTooShort", {
        min: MIN_PASSWORD_LENGTH,
        defaultValue: "Password must be at least {{min}} characters",
      });
      setError(message);
      showToast(message, "error");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError(t("errorPasswordMismatch"));
      showToast(t("errorPasswordMismatch"), "error");
      return;
    }

    setLoading(true);
    const ok = await register({
      email: signupEmail,
      password: signupPassword,
      fullName: `${firstName} ${lastName}`.trim(),
      role: accountType,
    });
    setLoading(false);

    if (!ok) {
      setError(t("errorRegistrationFailed"));
      showToast(t("errorRegistrationFailed"), "error");
      return;
    }

    showToast(t("success"), "success");
    setIsOpen(false);
    if (accountType === "client") {
      router.push("/projects/new");
      return;
    }
    router.push("/freelancers");
  };

  // Получить initials для аватарки
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Проверка, является ли пользователь админом
  const isAdmin = user?.role === "admin";

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || user?.email} />
              <AvatarFallback className={isAdmin ? "bg-stalker-green text-stalker-dark" : "bg-primary text-primary-foreground"}>
                {getInitials(user?.fullName || user?.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        {/* МЕНЮ ДЛЯ АДМИНА - только картинка, настройки и выход */}
        {isAdmin ? (
          <DropdownMenuContent className="w-48" align="end" forceMount>
            <div className="flex items-center justify-center p-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || user?.email} />
                <AvatarFallback className="bg-stalker-green text-stalker-dark text-lg">
                  {getInitials(user?.fullName || user?.email)}
                </AvatarFallback>
              </Avatar>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Налаштування</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Вихід</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
        
        /* МЕНЮ ДЛЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ */
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || user?.email} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user?.fullName || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName || "Користувач"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Мій кабінет</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/portfolio')}>
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>Портфоліо</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/freelancers')}>
              <UserCheckIcon className="mr-2 h-4 w-4" />
              <span>Профіль фрилансера</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/projects')}>
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>Профіль шукача</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              <span>Команда та нотатки</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellIcon className="mr-2 h-4 w-4" />
              <span>Що нового?</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-orange-500">
              <BellIcon className="mr-2 h-4 w-4" />
              <span>1</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Особисті дані</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Налаштування</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Вихід</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg">
          {buttonLabel || t('login')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('authentication')}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('login')}</CardTitle>
                <CardDescription>{t('loginDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">{t('email')}</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showLoginPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                  {loading ? "..." : t('login')}
                </Button>
                <Button variant="link" className="mt-2">
                  {t('forgotPassword')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t('signup')}</CardTitle>
                <CardDescription>{t('signupDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-type">{t('accountType')}</Label>
                  <select
                    id="account-type"
                    className="w-full p-2 border rounded-md"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as "freelancer" | "client")}
                  >
                    <option value="client">{t('client')}</option>
                    <option value="freelancer">{t('freelancer')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">{t('firstName')}</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t('firstNamePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">{t('lastName')}</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('lastNamePlaceholder')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">{t('email')}</Label>
                  <Input id="email-signup" type="email" placeholder="name@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">{t('password')}</Label>
                  <div className="relative">
                    <Input 
                      id="password-signup" 
                      type={showSignupPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={signupPassword} 
                      onChange={(e) => setSignupPassword(e.target.value)} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignupPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Input 
                      id="confirm-password" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" onClick={handleSignup} disabled={loading}>
                  {loading ? "..." : t('createAccount')}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">{t('termsAndConditions')}</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
