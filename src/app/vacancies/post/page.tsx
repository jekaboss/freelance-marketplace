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
import { BriefcaseIcon, ArrowRightIcon, DollarSignIcon, ClockIcon, UsersIcon } from "lucide-react";

export default function PostVacancyPage() {
  const { isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [employment, setEmployment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
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
    if (!description.trim()) {
      setError("Введіть опис вакансії");
      return;
    }
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/vacancies/post`);
      return;
    }
    
    // Зберігаємо дані в localStorage для наступного кроку
    localStorage.setItem('newVacancyTitle', title);
    localStorage.setItem('newVacancyCompany', company);
    localStorage.setItem('newVacancySalary', salary);
    localStorage.setItem('newVacancyEmployment', employment);
    localStorage.setItem('newVacancyDescription', description);
    localStorage.setItem('newVacancyRequirements', requirements);
    localStorage.setItem('newVacancyLocation', location);
    
    router.push('/vacancies/post/step-2');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Опублікувати Вакансію
            </h1>
            <p className="text-muted-foreground">
              Крок 1 з 2 - Основна інформація
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Швидкий пошук</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Відгуки вже через кілька годин
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSignIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Безкоштовно</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Публікація вакансій безкоштовна
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <ClockIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">24/7 Доступ</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Керуйте вакансіями у будь-який час
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Card */}
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

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm md:text-base">
                  Назва Вакансії *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Senior React Developer"
                  className="h-10"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm md:text-base">
                  Назва Компанії
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Наприклад: TechCorp"
                  className="h-10"
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm md:text-base">
                  Заробітна Плата (опціонально)
                </Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Наприклад: 3000-5000"
                  type="text"
                  className="h-10"
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <Label htmlFor="employment" className="text-sm md:text-base">
                  Тип Зайнятості *
                </Label>
                <select
                  id="employment"
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                  className="w-full p-2 border rounded-lg h-10"
                >
                  <option value="">Оберіть тип зайнятості</option>
                  <option value="Full-time">Повна зайнятість</option>
                  <option value="Part-time">Часткова зайнятість</option>
                  <option value="Contract">Контракт</option>
                  <option value="Freelance">Фріланс</option>
                  <option value="Remote">Віддалено</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm md:text-base">
                  Локація
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Наприклад: Київ, Україна або Remote"
                  className="h-10"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base">
                  Опис Вакансії *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть обов'язки, умови роботи та вимоги до кандидата..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm md:text-base">
                  Вимоги до Кандидата
                </Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Вкажіть необхідні навички, досвід та освіту..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 md:pt-6 space-y-3">
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full h-10 text-base"
                >
                  Продовжити
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>

                <Link href="/vacancies" className="block">
                  <Button variant="outline" className="w-full h-10 text-base">
                    Скасувати
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Потрібна допомога?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Звернутися в підтримку
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
