"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { RadiationIcon, BriefcaseIcon, ArrowRightIcon } from "lucide-react";
import { setUserScopedItem } from "@/lib/user-storage";

export default function CreateProjectPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stalker-muted">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleContinue = () => {
    if (!title.trim()) {
      setError("Введіть назву проекту");
      return;
    }
    // Зберігаємо дані в localStorage для наступного кроку
    setUserScopedItem('newProjectTitle', title, user?.id || null);
    setUserScopedItem('newProjectBudget', budget, user?.id || null);
    router.push('/clients/create-project-description');
  };

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 flex justify-center w-full">
        <div className="w-full max-w-2xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-stalker-green/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-green" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Створити Проект
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Крок 1 з 2 - Основна інформація
              </p>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg md:text-xl text-stalker-green">
                <RadiationIcon className="h-5 w-5 md:h-6 md:w-6 inline-block mr-2" />
                Основні Деталі Проекту
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {error && (
                <div className="p-3 md:p-4 bg-stalker-red/10 border border-stalker-red rounded-lg text-stalker-red text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-stalker-text text-sm md:text-base">
                  Назва Проекту *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Створення інтернет-магазину"
                  className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-stalker-text text-sm md:text-base">
                  Бюджет (опціонально)
                </Label>
                <Input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Наприклад: 5000"
                  type="number"
                  className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                />
              </div>

              <div className="pt-4 md:pt-6 space-y-3">
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full bg-stalker-green text-stalker-dark hover:bg-stalker-green/90 h-9 md:h-10 text-sm md:text-base"
                >
                  Продовжити
                  <ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>

                <Link href="/projects" className="block">
                  <Button variant="outline" className="w-full border-stalker-border text-stalker-text hover:bg-stalker-border h-9 md:h-10 text-sm md:text-base">
                    Скасувати
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
