"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon, SearchIcon, MapPinIcon, ClockIcon, DollarSignIcon, Building2Icon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import Link from "next/link";

type Vacancy = {
  id: number;
  title: string;
  company: string;
  description: string;
  salary: string;
  employment: string;
  posted: string;
  skills: string[];
  location: string;
  applications: number;
};

type ServiceCategory = {
  name: string;
  translationKey: string;
  services: { name: string; translationKey: string; id: string }[];
};

const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    description: "Шукаємо досвідченого React розробника для створення сучасних веб-додатків. Робота в міжнародній команді.",
    salary: "$3000 - $5000",
    employment: "Full-time",
    posted: "2 days ago",
    skills: ["React", "TypeScript", "Node.js"],
    location: "Remote",
    applications: 25,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "DesignStudio",
    description: "Потрібен креативний дизайнер для створення інтерфейсів мобільних додатків та веб-сайтів.",
    salary: "$2000 - $3500",
    employment: "Full-time",
    posted: "1 day ago",
    skills: ["Figma", "UI/UX", "Prototyping"],
    location: "Kyiv, Ukraine",
    applications: 18,
  },
  {
    id: 3,
    title: "Python Backend Developer",
    company: "DataSoft",
    description: "Розробка backend рішень на Python. Досвід роботи з Django або FastAPI обов'язковий.",
    salary: "$2500 - $4000",
    employment: "Full-time",
    posted: "3 hours ago",
    skills: ["Python", "Django", "PostgreSQL"],
    location: "Remote",
    applications: 12,
  },
  {
    id: 4,
    title: "Content Manager",
    company: "MediaGroup",
    description: "Управління контентом сайту, написання статей, робота з соцмережами.",
    salary: "$800 - $1200",
    employment: "Part-time",
    posted: "5 hours ago",
    skills: ["Content Writing", "Social Media", "SEO"],
    location: "Lviv, Ukraine",
    applications: 30,
  },
  {
    id: 5,
    title: "Mobile Developer (React Native)",
    company: "AppFactory",
    description: "Створення крос-платформних мобільних додатків для iOS та Android.",
    salary: "$2000 - $3500",
    employment: "Contract",
    posted: "1 day ago",
    skills: ["React Native", "iOS", "Android"],
    location: "Remote",
    applications: 15,
  },
  {
    id: 6,
    title: "Digital Marketing Specialist",
    company: "MarketPro",
    description: "Просування продуктів в соцмережах, налаштування реклами, аналітика.",
    salary: "$1000 - $2000",
    employment: "Full-time",
    posted: "2 days ago",
    skills: ["Facebook Ads", "Instagram", "Google Ads"],
    location: "Kharkiv, Ukraine",
    applications: 22,
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    name: "Development & IT",
    translationKey: "programmingAndTech",
    services: [
      { name: "Web Development", translationKey: "webDevelopment", id: "web-dev" },
      { name: "Mobile Development", translationKey: "mobileDevelopment", id: "mobile-dev" },
      { name: "Frontend", translationKey: "reactDevelopment", id: "frontend" },
      { name: "Backend", translationKey: "pythonDevelopment", id: "backend" },
      { name: "Full Stack", translationKey: "webDevelopment", id: "full-stack" },
      { name: "DevOps", translationKey: "devopsAndCloud", id: "devops" },
      { name: "Data Science", translationKey: "dataScience", id: "data-science" },
    ],
  },
  {
    name: "Design",
    translationKey: "designAndCreative",
    services: [
      { name: "UI/UX Design", translationKey: "designAndCreative", id: "ui-ux" },
      { name: "Graphic Design", translationKey: "logoDesign", id: "graphic-design" },
      { name: "Web Design", translationKey: "webDesign", id: "web-design" },
      { name: "Mobile Design", translationKey: "appDesign", id: "mobile-design" },
    ],
  },
  {
    name: "Writing & Translation",
    translationKey: "writingAndTranslation",
    services: [
      { name: "Content Writing", translationKey: "contentWriting", id: "content-writing" },
      { name: "Copywriting", translationKey: "copywriting", id: "copywriting" },
      { name: "Translation", translationKey: "translation", id: "translation" },
      { name: "Editing", translationKey: "proofreadingAndEditing", id: "editing" },
    ],
  },
  {
    name: "Marketing",
    translationKey: "digitalMarketing",
    services: [
      { name: "Social Media Marketing", translationKey: "socialMediaMarketing", id: "social-media" },
      { name: "SEO", translationKey: "seoAndSem", id: "seo" },
      { name: "Digital Marketing", translationKey: "digitalMarketing", id: "digital-marketing" },
      { name: "Content Marketing", translationKey: "contentMarketing", id: "content-marketing" },
    ],
  },
  {
    name: "Business",
    translationKey: "businessConsulting",
    services: [
      { name: "Project Management", translationKey: "projectManagement", id: "project-management" },
      { name: "Virtual Assistant", translationKey: "virtualAssistant", id: "virtual-assistant" },
      { name: "Customer Support", translationKey: "customerSupport", id: "customer-support" },
      { name: "Sales", translationKey: "salesAndLeadGeneration", id: "sales" },
    ],
  },
];

export default function VacanciesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [employmentFilter, setEmploymentFilter] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Development & IT");

  const filteredVacancies = useMemo(() => {
    let filtered = mockVacancies;
    
    if (selectedCategory) {
      filtered = filtered.filter(vacancy => 
        vacancy.skills.some(skill => 
          skill.toLowerCase().includes(selectedCategory.toLowerCase())
        ) ||
        vacancy.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    if (employmentFilter) {
      filtered = filtered.filter(vacancy => vacancy.employment === employmentFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(vacancy =>
        vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [selectedCategory, employmentFilter, searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Вакансії</h1>
            <p className="text-muted-foreground text-lg">Знайдіть найкращих фахівців для вашої команди</p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <Link href="/clients/post-vacancy">
              <Button size="lg" className="gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Опублікувати вакансію
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
              {/* Category Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 justify-center">
                    <SearchIcon className="h-5 w-5" />
                    Категорії
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                  {serviceCategories.map((category) => (
                    <div key={category.translationKey}>
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors text-left font-medium"
                      >
                        <span>{t(category.translationKey)}</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedCategory === category.name && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => {
                                setSelectedCategory(service.translationKey);
                              }}
                              className={`block w-full text-left p-2 rounded-md text-sm transition-colors ${
                                selectedCategory === service.translationKey
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              {t(service.translationKey)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Employment Type Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Тип зайнятості</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { value: "", label: "Всі" },
                    { value: "Full-time", label: "Повна" },
                    { value: "Part-time", label: "Часткова" },
                    { value: "Contract", label: "Контракт" },
                    { value: "Freelance", label: "Фріланс" },
                    { value: "Remote", label: "Віддалено" },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employment"
                        checked={employmentFilter === item.value}
                        onChange={() => setEmploymentFilter(item.value)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              {/* Clear Filters */}
              {(selectedCategory || employmentFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("");
                    setEmploymentFilter("");
                  }}
                  className="w-full"
                >
                  Очистити фільтри
                </Button>
              )}
            </aside>

            {/* Main Content - Vacancies List */}
            <div className="flex-1">
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-xl">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Пошук вакансій..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Всі вакансії</h2>
                <p className="text-sm text-muted-foreground">{filteredVacancies.length} вакансій знайдено</p>
              </div>

              {/* Vacancies List */}
              {filteredVacancies.length === 0 ? (
                <Card className="max-w-md mx-auto">
                  <CardContent className="py-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">Вакансії не знайдено</h3>
                    <p className="text-muted-foreground mb-4">
                      Спробуйте змінити параметри пошуку
                    </p>
                    <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); setEmploymentFilter(''); }}>
                      Очистити фільтри
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredVacancies.map((vacancy) => (
                    <Card key={vacancy.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Building2Icon className="h-4 w-4" />
                              {vacancy.company}
                            </div>
                          </div>
                          <Badge variant="secondary" className="sm:flex-shrink-0">{vacancy.salary}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">{vacancy.description}</p>

                        {/* Skills */}
                        {vacancy.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {vacancy.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <MapPinIcon className="mr-1 h-3.5 w-3.5" />
                            {vacancy.location}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 h-3.5 w-3.5" />
                            Опубліковано {vacancy.posted}
                          </div>
                          <div className="flex items-center">
                            <DollarSignIcon className="mr-1 h-3.5 w-3.5" />
                            {vacancy.employment}
                          </div>
                          <div className="flex items-center">
                            <BriefcaseIcon className="mr-1 h-3.5 w-3.5" />
                            {vacancy.applications} відгуків
                          </div>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-4 flex gap-2">
                        <Button className="flex-1 sm:flex-none">Відгукнутися</Button>
                        <Button variant="outline" className="flex-1 sm:flex-none">Детальніше</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
