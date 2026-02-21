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
import { useToast } from "@/components/toast-provider";
import { BriefcaseIcon } from "lucide-react";
import { setUserScopedItem } from "@/lib/user-storage";

const CURRENCIES = [
  "USD","EUR","UAH","GBP","PLN","CZK","CHF","CAD","AUD","NZD",
  "JPY","CNY","KRW","SGD","HKD","TWD","THB","MYR","IDR","PHP",
  "VND","INR","PKR","BDT","LKR","NPR","AED","SAR","QAR","KWD",
  "BHD","OMR","JOD","ILS","EGP","TRY","GEL","AMD","AZN","KZT",
  "UZS","RUB","MDL","RON","BGN","HUF","SEK","NOK","DKK","ISK",
  "RSD","ALL","MKD","BAM","HRK","ZAR","NGN","KES","GHS","MAD",
  "DZD","TND","BRL","MXN","ARS","CLP","COP","PEN","UYU","BOB",
  "PYG","CRC","DOP","GTQ","HNL","NIO","PAB","JMD"
];

export default function PostVacancyPage() {
  const { isAuthenticated, user, isHydrated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [specialization, setSpecialization] = useState("");
  const [employmentType, setEmploymentType] = useState<"" | "full-time" | "part-time">("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
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

  const handlePublish = () => {
    setError(null);

    if (!title.trim()) {
      setError("Введіть назву вакансії");
      return;
    }
    if (!description.trim()) {
      setError("Введіть опис вакансії");
      return;
    }
    if (!salaryFrom || !salaryTo) {
      setError("Вкажіть зарплату від і до");
      return;
    }
    if (Number.isNaN(Number(salaryFrom)) || Number.isNaN(Number(salaryTo))) {
      setError("Зарплата має бути числом");
      return;
    }
    if (Number(salaryFrom) > Number(salaryTo)) {
      setError("Зарплата 'від' не може бути більшою за 'до'");
      return;
    }
    if (!specialization.trim()) {
      setError("Вкажіть спеціалізацію");
      return;
    }
    if (!employmentType) {
      setError("Оберіть тип зайнятості");
      return;
    }

    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/vacancies/post`);
      return;
    }

    setLoading(true);

    const draftVacancy = {
      title,
      description,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      currency,
      specialization,
      employmentType,
      additionalInstructions,
    };

    setUserScopedItem("newVacancyDraft", JSON.stringify(draftVacancy), user?.id || null);

    showToast("Вакансію опубліковано", "success");
    setLoading(false);
    router.push("/vacancies");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 md:mb-8 text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Публікація вакансії на постійну віддалену роботу
            </h1>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg md:text-xl">Деталі вакансії</CardTitle>
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
                  Назва вакансії *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Senior React Developer"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base">
                  Опис вакансії *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть обов'язки, умови роботи та вимоги до кандидата..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px] gap-3">
                <div className="space-y-2">
                  <Label htmlFor="salary-from" className="text-sm md:text-base">
                    Зарплата від *
                  </Label>
                  <Input
                    id="salary-from"
                    type="number"
                    min="0"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    placeholder="1000"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary-to" className="text-sm md:text-base">
                    Зарплата до *
                  </Label>
                  <Input
                    id="salary-to"
                    type="number"
                    min="0"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    placeholder="2500"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm md:text-base">
                    Валюта *
                  </Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 border rounded-lg h-10"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm md:text-base">
                  Спеціалізація *
                </Label>
                <Input
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Наприклад: Frontend Developer / UI Designer / QA Engineer"
                  className="h-10"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base">Тип зайнятості *</Label>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setEmploymentType("full-time")}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      employmentType === "full-time" ? "border-primary bg-primary/5" : "hover:bg-accent"
                    }`}
                  >
                    <p className="font-medium">Повна зайнятість</p>
                    <p className="text-sm text-muted-foreground">
                      Вакансія передбачає наявність робітника на робочому місті протягом усього робочого тижня та всього робочого дня.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmploymentType("part-time")}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      employmentType === "part-time" ? "border-primary bg-primary/5" : "hover:bg-accent"
                    }`}
                  >
                    <p className="font-medium">Неповна зайнятість</p>
                    <p className="text-sm text-muted-foreground">
                      Завантаження робітника неповне або нерегулярне (обговорюється при співбесіді)
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-sm md:text-base">
                  Додаткові інструкції
                </Label>
                <Textarea
                  id="instructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Додайте важливі деталі, графік співбесід, формат тестового, дедлайни тощо."
                  className="min-h-[100px]"
                />
              </div>

              <div className="pt-4 md:pt-6">
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full h-10 text-base"
                >
                  {loading ? "Публікація..." : "Опублікувати вакансію"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Вартість розміщення — від 7$
                </p>
              </div>
            </CardContent>
          </Card>

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

