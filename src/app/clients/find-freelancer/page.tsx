"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { 
  SearchIcon, 
  MapPinIcon, 
  StarIcon, 
  ArrowRightIcon, 
  UsersIcon,
  BriefcaseIcon,
  FilterIcon
} from "lucide-react";

interface FreelancerWork {
  id: number;
  title: string;
  description: string;
  image?: string;
  skills: string[];
}

interface Freelancer {
  id: number;
  name: string;
  role: string;
  rating: number;
  projects: number;
  rate: string;
  country: string;
  city: string;
  skills: string[];
  avatar?: string;
  works: FreelancerWork[];
}

export default function FindFreelancerPage() {
  const { isHydrated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Countries and cities data
  const countries = [
    { value: "", label: t("allCountries") },
    { value: "ukraine", label: "Україна" },
    { value: "poland", label: "Польща" },
    { value: "germany", label: "Німеччина" },
    { value: "usa", label: "США" },
    { value: "uk", label: "Великобританія" },
    { value: "canada", label: "Канада" },
    { value: "remote", label: "Remote" },
  ];

  const citiesByCountry: Record<string, { value: string; label: string }[]> = {
    ukraine: [
      { value: "", label: t("allCities") },
      { value: "kyiv", label: "Київ" },
      { value: "lviv", label: "Львів" },
      { value: "kharkiv", label: "Харків" },
      { value: "odesa", label: "Одеса" },
      { value: "dnipro", label: "Дніпро" },
    ],
    poland: [
      { value: "", label: t("allCities") },
      { value: "warsaw", label: "Варшава" },
      { value: "krakow", label: "Краків" },
      { value: "gdansk", label: "Гданськ" },
    ],
    germany: [
      { value: "", label: t("allCities") },
      { value: "berlin", label: "Берлін" },
      { value: "munich", label: "Мюнхен" },
      { value: "hamburg", label: "Гамбург" },
    ],
    usa: [
      { value: "", label: t("allCities") },
      { value: "new-york", label: "Нью-Йорк" },
      { value: "san-francisco", label: "Сан-Франциско" },
      { value: "los-angeles", label: "Лос-Анджелес" },
    ],
    uk: [
      { value: "", label: t("allCities") },
      { value: "london", label: "Лондон" },
      { value: "manchester", label: "Манчестер" },
    ],
    canada: [
      { value: "", label: t("allCities") },
      { value: "toronto", label: "Торонто" },
      { value: "vancouver", label: "Ванкувер" },
    ],
    remote: [
      { value: "", label: t("allCities") },
    ],
  };

  const currentCities = selectedCountry ? (citiesByCountry[selectedCountry] || []) : [];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t("loading")}</p>
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
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedCity) params.set('city', selectedCity);

    router.push(`/clients/find-freelancer-description?${params.toString()}`);
  };

  const topFreelancers: Freelancer[] = [
    { 
      id: 1, 
      name: "Олександр Петренко", 
      role: "Full Stack Developer", 
      rating: 4.9, 
      projects: 45, 
      rate: "$45/hr", 
      country: "Україна",
      city: "Київ",
      skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
      works: [
        { id: 1, title: "Інтернет-магазин електроніки", description: "Розробка повноцінного e-commerce рішення", skills: ["React", "Node.js"] },
        { id: 2, title: "CRM система", description: "Система управління клієнтами", skills: ["Vue.js", "Python"] },
      ]
    },
    { 
      id: 2, 
      name: "Марія Коваленко", 
      role: "UI/UX Designer", 
      rating: 4.8, 
      projects: 38, 
      rate: "$35/hr", 
      country: "Україна",
      city: "Львів",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      works: [
        { id: 3, title: "Дизайн мобільного додатку", description: "UI/UX дизайн для фітнес додатку", skills: ["Figma", "Prototyping"] },
        { id: 4, title: "Ребрендинг компанії", description: "Повний ребрендинг IT компанії", skills: ["Adobe XD", "Illustrator"] },
      ]
    },
    { 
      id: 3, 
      name: "Андрій Шевченко", 
      role: "Mobile Developer", 
      rating: 4.9, 
      projects: 52, 
      rate: "$50/hr", 
      country: "Україна",
      city: "Харків",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      works: [
        { id: 5, title: "Додаток для доставки їжі", description: "Мобільний додаток для iOS та Android", skills: ["React Native", "Firebase"] },
        { id: 6, title: "Фінтех додаток", description: "Додаток для управління фінансами", skills: ["Flutter", "GraphQL"] },
      ]
    },
    { 
      id: 4, 
      name: "Олена Бондаренко", 
      role: "Graphic Designer", 
      rating: 4.7, 
      projects: 67, 
      rate: "$30/hr", 
      country: "Польща",
      city: "Варшава",
      skills: ["Photoshop", "Illustrator", "InDesign", "Branding"],
      works: [
        { id: 7, title: "Логотип для стартапу", description: "Створення фірмового стилю", skills: ["Illustrator", "Branding"] },
        { id: 8, title: "Дизайн упаковки", description: "Дизайн упаковки для косметики", skills: ["Photoshop", "InDesign"] },
      ]
    },
    { 
      id: 5, 
      name: "John Smith", 
      role: "DevOps Engineer", 
      rating: 5.0, 
      projects: 34, 
      rate: "$65/hr", 
      country: "Німеччина",
      city: "Берлін",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      works: [
        { id: 9, title: "Налаштування AWS інфраструктури", description: "Повна міграція на AWS", skills: ["AWS", "Terraform"] },
        { id: 10, title: "CI/CD пайплайни", description: "Автоматизація деплою", skills: ["Docker", "Jenkins"] },
      ]
    },
    { 
      id: 6, 
      name: "Emma Wilson", 
      role: "Content Writer", 
      rating: 4.8, 
      projects: 89, 
      rate: "$25/hr", 
      country: "Великобританія",
      city: "Лондон",
      skills: ["Copywriting", "SEO", "Blog Writing", "Technical Writing"],
      works: [
        { id: 11, title: "SEO статті для блогу", description: "Написання 50+ статей", skills: ["SEO", "Copywriting"] },
        { id: 12, title: "Технічна документація", description: "Документація для API", skills: ["Technical Writing"] },
      ]
    },
  ];

  const filteredFreelancers = topFreelancers.filter(freelancer => {
    if (searchQuery && !freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !freelancer.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (category && !freelancer.skills.some(s => s.toLowerCase().includes(category.toLowerCase()))) {
      return false;
    }
    if (selectedCountry && freelancer.country !== countries.find(c => c.value === selectedCountry)?.label) {
      return false;
    }
    if (selectedCity && freelancer.city !== currentCities.find(c => c.value === selectedCity)?.label) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t("bestFreelancers")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("findFreelancersDesc")}
            </p>
          </div>

          {/* Search & Filters Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                {t("searchFreelancers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Keywords Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">{t("searchKeywords")}</Label>
                  <div className="relative">
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("searchKeywordsPlaceholder")}
                      className="pl-10"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">{t("categoryLabel")}</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md h-10"
                  >
                    <option value="">{t("allCategories")}</option>
                    <option value="react">{t("webDevelopment")}</option>
                    <option value="mobile">{t("mobileDevelopment")}</option>
                    <option value="design">{t("design")}</option>
                    <option value="writing">{t("writing")}</option>
                    <option value="marketing">{t("marketing")}</option>
                    <option value="video">{t("videoAnimation")}</option>
                  </select>
                </div>

                {/* Rate Range */}
                <div className="space-y-2">
                  <Label>{t("rateLabel")}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                      placeholder={t("minLabel")}
                      type="number"
                      className="flex-1"
                    />
                    <Input
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      placeholder={t("maxLabel")}
                      type="number"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Location Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">{t("countryLabel")}</Label>
                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedCity("");
                    }}
                    className="w-full p-2 border rounded-md h-10"
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">{t("cityLabel")}</Label>
                  <select
                    id="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedCountry}
                    className="w-full p-2 border rounded-md h-10 disabled:opacity-50"
                  >
                    {currentCities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full"
                size="lg"
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                {t("searchFreelancers")}
              </Button>
            </CardContent>
          </Card>

          {/* Top Freelancers Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <StarIcon className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                {t("topFreelancers")}
              </h2>
              <Link href="/freelancers">
                <Button variant="outline">
                  {t("viewAllFreelancers")}
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {filteredFreelancers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t("noFreelancersFound")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      {/* Freelancer Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {freelancer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                          <p className="text-muted-foreground">{freelancer.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium ml-1">{freelancer.rating}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{freelancer.projects} {t("projects")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-medium">{freelancer.rate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{freelancer.city}, {freelancer.country}</span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {freelancer.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Works Portfolio */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BriefcaseIcon className="h-4 w-4" />
                          Роботи
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {freelancer.works.map((work) => (
                            <Card key={work.id} className="bg-card/50">
                              <CardContent className="p-3">
                                <h5 className="font-medium text-sm mb-1 truncate">{work.title}</h5>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{work.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {work.skills.slice(0, 2).map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/freelancers/${freelancer.id}`} className="flex-1">
                          <Button className="w-full">
                            {t("profile")}
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1">
                          <FilterIcon className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
