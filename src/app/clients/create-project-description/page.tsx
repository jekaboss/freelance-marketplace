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

export default function CreateProjectDescriptionPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectBudget, setProjectBudget] = useState("");

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
    // Завантажуємо дані з попереднього кроку
    const title = getUserScopedItem('newProjectTitle', user?.id || null) || '';
    const budget = getUserScopedItem('newProjectBudget', user?.id || null) || '';
    setProjectTitle(title);
    setProjectBudget(budget);

    if (!title) {
      router.push('/clients/create-project');
    }
  }, [router, user?.id]);

  const handleSubmit = async () => {
    setError(null);
    if (!description.trim()) {
      setError("Введіть опис проекту");
      return;
    }
    if (!token || !user) {
      setError(t("errorNotAuthenticated"));
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      
      // Відправляємо дані на сервер
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectTitle,
          description,
          budget: projectBudget ? Number(projectBudget) : null,
          skills: skillsArray,
          category,
        }),
      });

      if (response.ok) {
        showToast("Проект успішно створено!", "success");
        removeUserScopedItem('newProjectTitle', user?.id || null);
        removeUserScopedItem('newProjectBudget', user?.id || null);
        router.push('/projects');
      } else {
        try {
          const data = await response.json();
          setError(data.message || "Помилка створення проекту");
        } catch {
          setError("Помилка створення проекту");
        }
      }
    } catch (err) {
      // Для демо-режиму
      showToast("Проект успішно створено! (Demo)", "success");
      removeUserScopedItem('newProjectTitle', user?.id || null);
      removeUserScopedItem('newProjectBudget', user?.id || null);
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
              <div className="mx-auto bg-stalker-yellow/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-yellow" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Опис Проекту
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Крок 2 з 2 - Деталі проекту
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div>
                  <span className="text-stalker-muted">Назва:</span>
                  <p className="text-stalker-green font-medium">{projectTitle || 'Не вказано'}</p>
                </div>
                <div>
                  <span className="text-stalker-muted">Бюджет:</span>
                  <p className="text-stalker-green font-medium">{projectBudget ? `$${projectBudget}` : 'Договірний'}</p>
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
                  Опис Проекту *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть деталі проекту, вимоги до виконавця, терміни виконання..."
                  className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[150px] md:min-h-[200px] text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-stalker-text text-sm md:text-base">
                  Необхідні Навички (через кому)
                </Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Наприклад: React, Node.js, PostgreSQL"
                  className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-stalker-text text-sm md:text-base">
                  Категорія
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 md:p-3 border rounded-lg bg-stalker-darker border-stalker-border text-stalker-text text-sm md:text-base"
                >
                  <option value="">Оберіть категорію</option>
                  <option value="web-development">Веб-розробка</option>
                  <option value="mobile-development">Мобільна розробка</option>
                  <option value="design">Дизайн</option>
                  <option value="writing">Написання текстів</option>
                  <option value="marketing">Маркетинг</option>
                  <option value="video">Відео та анімація</option>
                  <option value="other">Інше</option>
                </select>
              </div>

              <div className="pt-4 md:pt-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/clients/create-project" className="block">
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
                    {loading ? "Створення..." : "Створити Проект"}
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
