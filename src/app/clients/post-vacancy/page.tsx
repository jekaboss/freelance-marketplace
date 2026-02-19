"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { BriefcaseIcon, ArrowRightIcon } from "lucide-react";

export default function PostVacancyPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [employment, setEmployment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleContinue = () => {
    if (!title.trim()) {
      setError("Введіть назву вакансії");
      return;
    }
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/clients/post-vacancy`);
      return;
    }
    // Зберігаємо дані в localStorage для наступного кроку
    localStorage.setItem('newVacancyTitle', title);
    localStorage.setItem('newVacancySalary', salary);
    localStorage.setItem('newVacancyEmployment', employment);
    router.push('/clients/post-vacancy-description');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 flex justify-center w-full">
        <div className="w-full max-w-2xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Опублікувати Вакансію
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Крок 1 з 2 - Основна інформація
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg md:text-xl">
                Деталі Вакансії
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {error && (
                <div className="p-3 md:p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {!isAuthenticated && (
                <div className="p-3 md:p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm">
                  Будь ласка, увійдіть щоб опублікувати вакансію
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm md:text-base">
                  Назва Вакансії *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Senior React Developer"
                  className="h-9 md:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm md:text-base">
                  Заробітна Плата (опціонально)
                </Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Наприклад: 3000"
                  type="number"
                  className="h-9 md:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment" className="text-sm md:text-base">
                  Тип Зайнятості
                </Label>
                <select
                  id="employment"
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                  className="w-full p-2 md:p-3 border rounded-lg h-9 md:h-10"
                >
                  <option value="">Оберіть тип зайнятості</option>
                  <option value="full-time">Повна зайнятість</option>
                  <option value="part-time">Часткова зайнятість</option>
                  <option value="contract">Контракт</option>
                  <option value="freelance">Фріланс</option>
                  <option value="remote">Віддалено</option>
                </select>
              </div>

              <div className="pt-4 md:pt-6 space-y-3">
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full h-9 md:h-10 text-sm md:text-base"
                >
                  Продовжити
                  <ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>

                <Link href="/projects" className="block">
                  <Button variant="outline" className="w-full h-9 md:h-10 text-sm md:text-base">
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
