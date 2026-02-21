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
import { ShieldIcon, LockIcon, CheckCircleIcon, ArrowRightIcon, DollarSignIcon } from "lucide-react";
import { setUserScopedItem } from "@/lib/user-storage";

export default function BusinessSafePage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();

  const [projectName, setProjectName] = useState("");
  const [amount, setAmount] = useState("");
  const [milestones, setMilestones] = useState("");
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
    if (!projectName.trim()) {
      setError("Введіть назву проекту");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Введіть коректну суму");
      return;
    }
    
    setUserScopedItem('businessSafeProject', projectName, user?.id || null);
    setUserScopedItem('businessSafeAmount', amount, user?.id || null);
    setUserScopedItem('businessSafeMilestones', milestones, user?.id || null);
    router.push('/clients/business-safe-description');
  };

  const features = [
    { icon: LockIcon, title: "Безпечна Угода", description: "Кошти блокуються до виконання умов" },
    { icon: CheckCircleIcon, title: "Гарантія Якості", description: "Оплата після прийняття роботи" },
    { icon: DollarSignIcon, title: "Фіксована Ціна", description: "Ніяких прихованих платежів" },
  ];

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 flex justify-center w-full">
        <div className="w-full max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-stalker-green/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <ShieldIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-green" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Business Safe
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Безпечна угода для вашого проекту
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-stalker-card border-stalker-border shadow-lg">
                <CardContent className="pt-4 md:pt-6 text-center">
                  <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-stalker-green mx-auto mb-3" />
                  <h3 className="font-semibold text-stalker-green text-sm md:text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-stalker-muted text-xs md:text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg md:text-xl text-stalker-green flex items-center justify-center gap-2">
                <LockIcon className="h-5 w-5 md:h-6 md:w-6" />
                Створити Безпечну Угоду
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {error && (
                <div className="p-3 md:p-4 bg-stalker-red/10 border border-stalker-red rounded-lg text-stalker-red text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-stalker-text text-sm md:text-base">
                  Назва Проекту *
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Наприклад: Розробка сайту для магазину"
                  className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-stalker-text text-sm md:text-base">
                  Сума Угоди ($) *
                </Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Наприклад: 5000"
                  type="number"
                  className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestones" className="text-stalker-text text-sm md:text-base">
                  Етапи Оплати (опціонально)
                </Label>
                <Textarea
                  id="milestones"
                  value={milestones}
                  onChange={(e) => setMilestones(e.target.value)}
                  placeholder="Опишіть етапи виконання та умови оплати..."
                  className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[100px] md:min-h-[120px] text-sm md:text-base"
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
