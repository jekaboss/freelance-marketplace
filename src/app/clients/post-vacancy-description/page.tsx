"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { RadiationIcon, FileTextIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { getUserScopedItem, removeUserScopedItem } from "@/lib/user-storage";

export default function PostVacancyDescriptionPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [vacancySalary, setVacancySalary] = useState("");
  const [vacancyEmployment, setVacancyEmployment] = useState("");

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

  useEffect(() => {
    const title = getUserScopedItem('newVacancyTitle', user?.id || null) || '';
    const salary = getUserScopedItem('newVacancySalary', user?.id || null) || '';
    const employment = getUserScopedItem('newVacancyEmployment', user?.id || null) || '';
    setVacancyTitle(title);
    setVacancySalary(salary);
    setVacancyEmployment(employment);

    if (!title) {
      router.push('/clients/post-vacancy');
    }
  }, [router, user?.id]);

  const handleSubmit = async () => {
    setError(null);
    if (!description.trim()) {
      setError("Введіть опис вакансії");
      return;
    }
    if (!token || !user) {
      setError(t("errorNotAuthenticated"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: vacancyTitle,
          description,
          salary: vacancySalary ? Number(vacancySalary) : null,
          employment: vacancyEmployment,
          requirements: requirements.split('\n').filter(r => r.trim()),
          benefits: benefits.split('\n').filter(b => b.trim()),
        }),
      });

      if (response.ok) {
        showToast("Вакансію успішно створено!", "success");
        removeUserScopedItem('newVacancyTitle', user?.id || null);
        removeUserScopedItem('newVacancySalary', user?.id || null);
        removeUserScopedItem('newVacancyEmployment', user?.id || null);
        router.push('/projects');
      } else {
        try {
          const data = await response.json();
          setError(data.message || "Помилка при створенні вакансії");
        } catch {
          setError("Помилка при створенні вакансії");
        }
      }
    } catch (err) {
      showToast("Вакансію успішно створено! (Demo)", "success");
      removeUserScopedItem('newVacancyTitle', user?.id || null);
      removeUserScopedItem('newVacancySalary', user?.id || null);
      removeUserScopedItem('newVacancyEmployment', user?.id || null);
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 flex justify-center w-full">
        <div className="w-full max-w-3xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-stalker-blue/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-blue" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Опис Вакансії
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Крок 2 з 2 - Деталі вакансії
              </p>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl mb-4 md:mb-6">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base text-stalker-muted">
                <CheckCircleIcon className="h-4 w-4 inline-block mr-2" />
                Основна інформація
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm">
                <div>
                  <span className="text-stalker-muted">Назва:</span>
                  <p className="text-stalker-blue font-medium">{vacancyTitle || 'Не вказано'}</p>
                </div>
                <div>
                  <span className="text-stalker-muted">Зарплата:</span>
                  <p className="text-stalker-green font-medium">{vacancySalary ? `$${vacancySalary}` : 'Договірна'}</p>
                </div>
                <div>
                  <span className="text-stalker-muted">Зайнятість:</span>
                  <p className="text-stalker-yellow font-medium">
                    {vacancyEmployment === 'full-time' ? 'Повна' : 
                     vacancyEmployment === 'part-time' ? 'Часткова' : 
                     vacancyEmployment || 'Не вказано'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-stalker-card border-stalker-border shadow-xl">
            <CardHeader className="text-center pb-2 md:pb-3">
              <CardTitle className="text-lg md:text-xl text-stalker-green">
                <RadiationIcon className="h-5 w-5 md:h-6 md:w-6 inline-block mr-2" />
                Детальний Опис
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {error && (
                <div className="p-3 md:p-4 bg-stalker-red/10 border border-stalker-red rounded-lg text-stalker-red text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-stalker-text text-sm md:text-base">
                  Опис Вакансії *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть обов'язки, задачі та умови роботи..."
                  className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[120px] md:min-h-[150px] text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-stalker-text text-sm md:text-base">
                  Вимоги до Кандидата (кожен з нового рядка)
                </Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="3+ років досвіду з React&#10;Знання TypeScript&#10;Досвід роботи з REST API"
                  className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits" className="text-stalker-text text-sm md:text-base">
                  Переваги (кожен з нового рядка)
                </Label>
                <Textarea
                  id="benefits"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Конкурентна зарплата&#10;Віддалена робота&#10;Навчання за рахунок компанії"
                  className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                />
              </div>

              <div className="pt-4 md:pt-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/clients/post-vacancy" className="block">
                    <Button variant="outline" className="w-full border-stalker-border text-stalker-text hover:bg-stalker-border h-9 md:h-10 text-sm md:text-base">
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Назад
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90 h-9 md:h-10 text-sm md:text-base"
                  >
                    {loading ? "Створення..." : "Опублікувати Вакансію"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
