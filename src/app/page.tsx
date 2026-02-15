"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon, BriefcaseIcon, UsersIcon, StarIcon, MessageCircleIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  // Mock data for featured projects
  const featuredProjects = [
    {
      id: 1,
      title: "Web Application Development",
      description: "Build a modern web application with React and Node.js",
      budget: "$2,500 - $5,000",
      skills: ["React", "Node.js", "MongoDB"],
      posted: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      description: "Design intuitive mobile app interfaces for iOS and Android",
      budget: "$1,000 - $2,000",
      skills: ["UI/UX", "Figma", "Prototyping"],
      posted: "5 hours ago",
    },
    {
      id: 3,
      title: "E-commerce Website",
      description: "Develop a fully functional e-commerce platform",
      budget: "$3,000 - $7,000",
      skills: ["Shopify", "CSS", "JavaScript"],
      posted: "1 day ago",
    },
    {
      id: 4,
      title: "Logo Design & Brand Identity",
      description: "Create a professional logo and brand identity package",
      budget: "$500 - $1,500",
      skills: ["Graphic Design", "Branding", "Illustrator"],
      posted: "3 hours ago",
    },
    {
      id: 5,
      title: "Content Writing for Tech Blog",
      description: "Write engaging articles about the latest tech trends",
      budget: "$25 - $50/hr",
      skills: ["Content Writing", "Research", "SEO"],
      posted: "6 hours ago",
    },
    {
      id: 6,
      title: "Social Media Marketing Campaign",
      description: "Plan and execute a social media strategy for a startup",
      budget: "$2,000 - $4,000",
      skills: ["Social Media", "Marketing", "Analytics"],
      posted: "1 day ago",
    },
  ];

  const popularTags = [
    "Web Development", "Mobile Development", "UI/UX Design", 
    "Graphic Design", "Writing", "Video Editing", "Marketing", 
    "SEO", "Data Analysis", "Virtual Assistance", "Photography"
  ];

  const whyChooseUs = [
    {
      title: "Verified Professionals",
      description: "All freelancers are verified and rated by previous clients",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "Secure Payments",
      description: "Your payments are protected until project completion",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "24/7 Support",
      description: "Our team is always ready to help you with any issues",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "Flexible Hiring",
      description: "Hire for hourly or fixed-price projects as you need",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    }
  ];

  const advantages = [
    "Fast project completion",
    "Direct communication with freelancers",
    "Competitive pricing",
    "Quality guarantee",
    "Easy project management",
    "Flexible working arrangements"
  ];

  const whoIsItFor = [
    "Startups and small businesses",
    "Enterprises looking for specialized skills",
    "Individuals needing one-time projects",
    "Agencies expanding their team",
    "Entrepreneurs launching new products",
    "Companies scaling temporarily"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('heroSubtitle')}
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Input 
              placeholder={t('searchPlaceholder')} 
              className="py-6 pl-12 pr-4 rounded-full shadow-lg text-lg h-16"
              id="search-input"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            
            <Button 
              className="mt-4 w-full md:w-auto rounded-full py-6 text-lg h-16" 
              onClick={() => {
                const searchInput = document.getElementById('search-input') as HTMLInputElement;
                if (searchInput) {
                  const query = searchInput.value.trim();
                  if (query) {
                    // In a real app, this would search projects/freelancers
                    // For now, we'll just navigate to the projects page with the search query
                    window.location.href = `/projects?search=${encodeURIComponent(query)}`;
                  } else {
                    alert('Будь ласка, введіть пошуковий запит');
                  }
                }
              }}
            >
              {t('searchPlaceholder')}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Recently Open Orders */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t('recentlyOpenedOrders')}</h2>
            <Button variant="link" className="text-lg">
              {t('viewAll')} <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    {project.budget}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {project.posted}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Tags */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">{t('popularOrderTags')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularTags.map((tag, index) => (
              <Button key={index} variant="outline" className="rounded-full px-6 py-2">
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('whyChooseUs')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Freelance Market - Fast and Convenient */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('freelanceMarket')}</h2>
            <p className="text-xl mb-8">
              Знайдіть справжніх професіоналів для будь-якого проекту. Проста взаємодія, безпечні платежі та гарантія якості.
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6 text-lg">
                <a href="/start-cooperation">Розпочати співпрацю</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advantages of the Platform */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('advantagesOfPlatform')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-lg">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Who Is It For */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('whoIsItFor')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whoIsItFor.map((audience, index) => (
              <div key={index} className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{audience}</h3>
                <p className="text-muted-foreground">
                  Ідеально підходить для цієї категорії клієнтів з урахуванням їхніх специфічних потреб та вимог.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why It's More Convenient to Work Through the Exchange */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('whyItMoreConvenient')}</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Безпечні платежі</h3>
                  <p className="text-muted-foreground">
                    Ваші кошти захищені до моменту підтвердження виконання робіт. Ми гарантуємо повернення коштів при незадовільному результаті.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Перевірені фахівці</h3>
                  <p className="text-muted-foreground">
                    Кожен виконавець проходить перевірку та має відгуки попередніх клієнтів. Це забезпечує високу якість виконання робіт.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Зручна комунікація</h3>
                  <p className="text-muted-foreground">
                    Всі переговори та передача файлів відбуваються в середині платформи, що забезпечує безпеку та зручність.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Today */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Приєднуйтесь вже сьогодні</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Приєднуйтесь до тисяч задоволених клієнтів та фрілансерів, які вже знайшли один одного на нашій платформі
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6 text-lg">
              <a href="/start-cooperation">{t('createProfile')}</a>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
