"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import Link from "next/link";

export default function PortfolioPage() {
  const { t } = useTranslation();

  // Mock data for portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Website",
      category: "Web Development",
      description: "A fully responsive e-commerce website built with React and Node.js",
      image: "/placeholder-image.jpg",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      year: "2024",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "Mobile Development",
      description: "Secure banking application with biometric authentication",
      image: "/placeholder-image.jpg",
      tags: ["React Native", "Firebase", "Biometrics"],
      year: "2024",
    },
    {
      id: 3,
      title: "Brand Identity Design",
      category: "Design",
      description: "Complete brand identity for a tech startup including logo and guidelines",
      image: "/placeholder-image.jpg",
      tags: ["Branding", "Logo Design", "Illustration"],
      year: "2023",
    },
    {
      id: 4,
      title: "Social Media Dashboard",
      category: "Web Development",
      description: "Analytics dashboard for managing multiple social media accounts",
      image: "/placeholder-image.jpg",
      tags: ["Vue.js", "D3.js", "API Integration"],
      year: "2023",
    },
    {
      id: 5,
      title: "Health & Fitness App",
      category: "Mobile Development",
      description: "Comprehensive fitness tracking application with workout plans",
      image: "/placeholder-image.jpg",
      tags: ["Flutter", "HealthKit", "Workout Plans"],
      year: "2024",
    },
    {
      id: 6,
      title: "Corporate Website Redesign",
      category: "Web Development",
      description: "Modern redesign of corporate website with improved UX",
      image: "/placeholder-image.jpg",
      tags: ["Next.js", "Tailwind CSS", "Accessibility"],
      year: "2023",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container py-8 px-4 flex-grow">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('portfolio')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of work samples and successful projects
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{item.title}</CardTitle>
                    <Badge variant="secondary">{item.year}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/portfolio/${item.id}`}>
                    <Button className="mt-4 w-full">View Case Study</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}