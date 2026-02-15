"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { ShieldIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  const { loginAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Спеціальний випадок для admin - без пароля
    if (email.toLowerCase() === 'admin') {
      if (typeof window !== 'undefined') {
        // Створюємо фейковий токен для адміна
        const adminToken = 'admin-token-' + Date.now();
        localStorage.setItem('authToken', adminToken);
        localStorage.setItem('authUser', JSON.stringify({ id: 0, email: 'admin@localhost', role: 'admin', fullName: 'Administrator' }));
        
        // Перенаправляємо на сторінку адміна
        window.location.href = '/admin';
        return;
      }
    }

    // Спроба звичайного логіну
    const ok = await loginAdmin(email, password);
    setLoading(false);

    if (ok) {
      // Перевіряємо роль після успішного логіну
      setTimeout(() => {
        try {
          const rawUser = localStorage.getItem("authUser");
          if (rawUser) {
            const userData = JSON.parse(rawUser);
            if (userData.role === 'admin') {
              window.location.href = '/admin';
            } else {
              setError('У вас немає прав адміністратора');
            }
          } else {
            setError('Користувача не знайдено');
          }
        } catch {
          setError('Помилка перевірки');
        }
      }, 100);
    } else {
      setError('Невірні облікові дані');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />

      <div className="container py-12 px-4 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground mt-2">Access your administrative dashboard</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Username</Label>
                  <Input id="email" name="email" type="text" placeholder="admin" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter admin password" 
                      required 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "..." : t('login')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
