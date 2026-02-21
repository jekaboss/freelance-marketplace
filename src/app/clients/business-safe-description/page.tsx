"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { ShieldIcon, LockIcon, CheckCircleIcon, ArrowLeftIcon, FileTextIcon, UsersIcon } from "lucide-react";
import { getUserScopedItem, removeUserScopedItem } from "@/lib/user-storage";

export default function BusinessSafeDescriptionPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();

  const [description, setDescription] = useState("");
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [terms, setTerms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [amount, setAmount] = useState("");
  const [milestones, setMilestones] = useState("");

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
    const name = getUserScopedItem('businessSafeProject', user?.id || null) || '';
    const amt = getUserScopedItem('businessSafeAmount', user?.id || null) || '';
    const milestonesData = getUserScopedItem('businessSafeMilestones', user?.id || null) || '';
    setProjectName(name);
    setAmount(amt);
    setMilestones(milestonesData);

    if (!name) {
      router.push('/clients/business-safe');
    }
  }, [router, user?.id]);

  const handleSubmit = async () => {
    setError(null);
    if (!description.trim()) {
      setError("Введіть опис проекту");
      return;
    }
    if (!freelancerEmail.trim()) {
      setError("Введіть email фрілансера");
      return;
    }
    if (!token || !user) {
      setError(t("errorNotAuthenticated"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/business-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName,
          amount: Number(amount),
          description,
          freelancerEmail,
          milestones: milestones.split('\n').filter(m => m.trim()),
          terms: terms.split('\n').filter(t => t.trim()),
        }),
      });

      if (response.ok) {
        showToast("Угоду успішно створено!", "success");
        removeUserScopedItem('businessSafeProject', user?.id || null);
        removeUserScopedItem('businessSafeAmount', user?.id || null);
        removeUserScopedItem('businessSafeMilestones', user?.id || null);
        router.push('/projects');
      } else {
        const data = await response.json();
        setError(data.message || "Помилка створення угоди");
      }
    } catch (err) {
      showToast("Угоду успішно створено! (Demo)", "success");
      removeUserScopedItem('businessSafeProject', user?.id || null);
      removeUserScopedItem('businessSafeAmount', user?.id || null);
      removeUserScopedItem('businessSafeMilestones', user?.id || null);
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
        <div className="w-full max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-stalker-green/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-green" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Деталі Угоди
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Заповніть деталі безпечної угоди
              </p>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl mb-4 md:mb-6">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base text-stalker-muted flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4" />
                Основна інформація
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div>
                  <span className="text-stalker-muted">Назва проекту:</span>
                  <p className="text-stalker-green font-medium">{projectName || 'Не вказано'}</p>
                </div>
                <div>
                  <span className="text-stalker-muted">Сума угоди:</span>
                  <p className="text-stalker-yellow font-bold text-lg">${amount || '0'}</p>
                </div>
                {milestones && (
                  <div className="md:col-span-2">
                    <span className="text-stalker-muted">Етапи:</span>
                    <p className="text-stalker-text mt-1 whitespace-pre-line">{milestones}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardHeader className="text-center pb-2 md:pb-3">
                  <CardTitle className="text-lg md:text-xl text-stalker-green flex items-center justify-center gap-2">
                    <ShieldIcon className="h-5 w-5 md:h-6 md:w-6" />
                    Деталі Угоди
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
                      Опис Проекту *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Детально опишіть завдання, вимоги та очікуваний результат..."
                      className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[120px] md:min-h-[150px] text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freelancerEmail" className="text-stalker-text text-sm md:text-base">
                      Email Фрілансера *
                    </Label>
                    <Input
                      id="freelancerEmail"
                      value={freelancerEmail}
                      onChange={(e) => setFreelancerEmail(e.target.value)}
                      placeholder="freelancer@example.com"
                      type="email"
                      className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms" className="text-stalker-text text-sm md:text-base">
                      Умови Угоди (кожен з нового рядка)
                    </Label>
                    <Textarea
                      id="terms"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="Оплата після виконання&#10;Термін виконання 14 днів&#10;Гарантійний період 30 днів"
                      className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-stalker-card border-stalker-border shadow-xl sticky top-4">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-base md:text-lg text-stalker-green flex items-center gap-2">
                    <LockIcon className="h-4 w-4 md:h-5 md:w-5" />
                    Як Це Працює
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stalker-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-stalker-green font-bold text-xs md:text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stalker-text text-sm md:text-base">Створення Угоди</h4>
                      <p className="text-stalker-muted text-xs md:text-sm">Ви створюєте угоду та вносите умови</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stalker-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-stalker-green font-bold text-xs md:text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stalker-text text-sm md:text-base">Запрошення Фрілансера</h4>
                      <p className="text-stalker-muted text-xs md:text-sm">Фрілансер отримує запрошення</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stalker-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-stalker-green font-bold text-xs md:text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stalker-text text-sm md:text-base">Блокування Коштів</h4>
                      <p className="text-stalker-muted text-xs md:text-sm">Кошти блокуються на рахунку</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stalker-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-stalker-green font-bold text-xs md:text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stalker-text text-sm md:text-base">Виконання Роботи</h4>
                      <p className="text-stalker-muted text-xs md:text-sm">Фрілансер виконує роботу</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stalker-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-stalker-green font-bold text-xs md:text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stalker-text text-sm md:text-base">Прийняття та Оплата</h4>
                      <p className="text-stalker-muted text-xs md:text-sm">Ви приймаєте роботу, кошти перераховуються</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stalker-border">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldIcon className="h-5 w-5 text-stalker-green" />
                      <span className="font-semibold text-stalker-green text-sm md:text-base">100% Захист</span>
                    </div>
                    <p className="text-stalker-muted text-xs md:text-sm">
                      Ваші кошти захищені до моменту прийняття роботи
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/clients/business-safe" className="block">
                        <Button variant="outline" className="w-full border-stalker-border text-stalker-text hover:bg-stalker-border h-9 md:h-10 text-sm md:text-base">
                          <ArrowLeftIcon className="h-4 w-4 mr-2" />
                          Назад
                        </Button>
                      </Link>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-stalker-green text-stalker-dark hover:bg-stalker-green/90 h-9 md:h-10 text-sm md:text-base"
                      >
                        {loading ? "Створення..." : "Створити Угоду"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
