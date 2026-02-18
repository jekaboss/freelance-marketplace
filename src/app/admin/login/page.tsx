"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/components/admin-provider";
import { useTranslation } from "react-i18next";
import { ShieldIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  const { loginAdmin } = useAdmin();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const ok = await loginAdmin(email, password);
    setLoading(false);

    if (ok) {
      setTimeout(() => {
        try {
          const rawUser = localStorage.getItem("authUser");
          if (rawUser) {
            const userData = JSON.parse(rawUser);
            if (userData.role === "admin") {
              window.location.href = "/admin";
            } else {
              setError("У вас немає прав адміністратора");
            }
          } else {
            setError("Користувача не знайдено");
          }
        } catch {
          setError("Помилка перевірки");
        }
      }, 100);
    } else {
      setError("Невірні облікові дані");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center py-6 md:py-12 px-3 md:px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <div className="mx-auto bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <ShieldIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Access your administrative dashboard</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl md:text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Username</Label>
                  <Input id="email" name="email" type="text" placeholder="admin" required className="h-9 md:h-10" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      required
                      className="pr-10 h-9 md:h-10"
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

                {error && <p className="text-xs md:text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-9 md:h-10 text-sm md:text-base" disabled={loading}>
                  {loading ? "..." : t("login")}
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
