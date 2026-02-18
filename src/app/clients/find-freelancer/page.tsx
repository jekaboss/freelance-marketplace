"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SearchIcon, MapPinIcon, StarIcon, ArrowRightIcon, UsersIcon } from "lucide-react";

export default function FindFreelancerPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [location, setLocation] = useState("");

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category) params.set('category', category);
    if (minRate) params.set('minRate', minRate);
    if (maxRate) params.set('maxRate', maxRate);
    if (location) params.set('location', location);
    
    router.push(`/clients/find-freelancer-description?${params.toString()}`);
  };

  const topFreelancers = [
    { id: 1, name: "Олександр Петренко", role: "Full Stack Developer", rating: 4.9, projects: 45, rate: "$45/hr", location: "Київ, Україна", skills: ["React", "Node.js", "PostgreSQL"] },
    { id: 2, name: "Марія Коваленко", role: "UI/UX Designer", rating: 4.8, projects: 38, rate: "$35/hr", location: "Львів, Україна", skills: ["Figma", "Adobe XD", "Sketch"] },
    { id: 3, name: "Андрій Шевченко", role: "Mobile Developer", rating: 4.9, projects: 52, rate: "$50/hr", location: "Харків, Україна", skills: ["React Native", "Flutter", "iOS"] },
  ];

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 flex justify-center w-full">
        <div className="w-full max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div className="text-center">
              <div className="mx-auto bg-stalker-purple/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-purple" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Знайти Фрілансера
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Знайдіть найкращих виконавців для вашого проекту
              </p>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl mb-6">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-lg md:text-xl text-stalker-green flex items-center gap-2">
                <SearchIcon className="h-5 w-5 md:h-6 md:w-6" />
                Пошук Фрілансерів
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-stalker-text text-sm md:text-base">
                    Ключові Слова
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Наприклад: React Developer"
                      className="pl-10 bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-stalker-text text-sm md:text-base">
                    Категорія
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 md:p-3 border rounded-lg bg-stalker-darker border-stalker-border text-stalker-text text-sm md:text-base h-9 md:h-10"
                  >
                    <option value="">Всі категорії</option>
                    <option value="web-development">Веб-розробка</option>
                    <option value="mobile-development">Мобільна розробка</option>
                    <option value="design">Дизайн</option>
                    <option value="writing">Написання текстів</option>
                    <option value="marketing">Маркетинг</option>
                    <option value="video">Відео та анімація</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-stalker-text text-sm md:text-base">
                    Ставка ($/год)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                      placeholder="Мін"
                      type="number"
                      className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                    />
                    <Input
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      placeholder="Макс"
                      type="number"
                      className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-stalker-text text-sm md:text-base">
                    Локація
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Наприклад: Київ, Україна"
                    className="bg-stalker-darker border-stalker-border text-stalker-text h-9 md:h-10"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full bg-stalker-purple text-stalker-dark hover:bg-stalker-purple/90 h-9 md:h-10 text-sm md:text-base"
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Знайти Фрілансерів
              </Button>
            </CardContent>
          </Card>

          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-stalker-green mb-3 md:mb-4">
              Топ Фрілансери
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="bg-stalker-card border-stalker-border shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-4 md:pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stalker-green/20 flex items-center justify-center">
                        <span className="text-stalker-green font-bold text-sm md:text-base">
                          {freelancer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stalker-green text-sm md:text-base truncate">
                          {freelancer.name}
                        </h3>
                        <p className="text-stalker-muted text-xs md:text-sm truncate">
                          {freelancer.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <StarIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow fill-stalker-yellow" />
                      <span className="text-stalker-text text-sm">{freelancer.rating}</span>
                      <span className="text-stalker-muted text-xs md:text-sm">• {freelancer.projects} проектів</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3 text-stalker-muted text-xs md:text-sm">
                      <MapPinIcon className="h-3 w-3 md:h-4 md:w-4" />
                      {freelancer.location}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {freelancer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-stalker-border text-stalker-text">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-stalker-yellow font-bold text-sm md:text-base">
                        {freelancer.rate}
                      </span>
                      <Link href={`/freelancers/${freelancer.id}`}>
                        <Button size="sm" className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90 h-8 md:h-9 text-xs md:text-sm">
                          Профіль
                          <ArrowRightIcon className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/freelancers">
              <Button variant="outline" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-9 md:h-10 text-sm md:text-base">
                Переглянути Всіх Фрілансерів
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
