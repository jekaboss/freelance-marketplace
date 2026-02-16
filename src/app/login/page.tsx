"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) {
      setError(t("errorLoginFailed"));
      showToast(t("errorLoginFailed"), "error");
      return;
    }
    showToast(t("success"), "success");
    
    // Get user from localStorage after login
    setTimeout(() => {
      try {
        const rawUser = localStorage.getItem("authUser");
        if (rawUser) {
          const userData = JSON.parse(rawUser);
          if (userData.role === "freelancer") {
            router.push("/freelancers");
          } else if (userData.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
        } else {
          router.push("/profile");
        }
      } catch {
        router.push("/profile");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-6 md:py-8 px-4 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl">{t('login')}</CardTitle>
            <CardDescription className="text-sm">Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 md:h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pr-10 h-10 md:h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full h-10 md:h-11" onClick={handleLogin} disabled={loading}>
              {loading ? "..." : "Sign In"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-3 md:my-4" />
            <div className="space-y-2 w-full">
              <Button variant="outline" className="w-full h-10 md:h-11 text-sm">Continue with Google</Button>
              <Button variant="outline" className="w-full h-10 md:h-11 text-sm">Continue with GitHub</Button>
            </div>
            <p className="mt-3 md:mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
