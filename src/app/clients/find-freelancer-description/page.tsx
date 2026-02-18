"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { SearchIcon, StarIcon, MapPinIcon, BriefcaseIcon, CheckCircleIcon, ArrowLeftIcon, SendIcon } from "lucide-react";

export default function FindFreelancerDescriptionPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedFreelancer, setSelectedFreelancer] = useState<string>("");
  const [message, setMessage] = useState("");
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

  const freelancers = [
    { id: 1, name: "Олександр Петренко", role: "Full Stack Developer", rating: 4.9, projects: 45, rate: "$45/hr", location: "Київ, Україна", skills: ["React", "Node.js", "PostgreSQL"], available: true },
    { id: 2, name: "Марія Коваленко", role: "UI/UX Designer", rating: 4.8, projects: 38, rate: "$35/hr", location: "Львів, Україна", skills: ["Figma", "Adobe XD", "Sketch"], available: true },
    { id: 3, name: "Андрій Шевченко", role: "Mobile Developer", rating: 4.9, projects: 52, rate: "$50/hr", location: "Харків, Україна", skills: ["React Native", "Flutter", "iOS"], available: false },
    { id: 4, name: "Олена Бондаренко", role: "Graphic Designer", rating: 4.7, projects: 29, rate: "$30/hr", location: "Одеса, Україна", skills: ["Photoshop", "Illustrator", "Branding"], available: true },
    { id: 5, name: "Максим Ткаченко", role: "Backend Developer", rating: 4.8, projects: 41, rate: "$40/hr", location: "Дніпро, Україна", skills: ["Python", "Django", "PostgreSQL"], available: true },
  ];

  const handleContact = async () => {
    if (!selectedFreelancer) {
      setError("Оберіть фрілансера");
      return;
    }
    if (!message.trim()) {
      setError("Введіть повідомлення");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          freelancerId: selectedFreelancer,
          message,
        }),
      });

      if (response.ok) {
        showToast("Запит відправлено!", "success");
        router.push('/projects');
      } else {
        setError("Помилка відправки запиту");
      }
    } catch (err) {
      showToast("Запит відправлено! (Demo)", "success");
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
              <div className="mx-auto bg-stalker-purple/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6 md:h-8 md:w-8 text-stalker-purple" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                Зв'язатися з Фрілансером
              </h1>
              <p className="text-stalker-muted mt-2 text-sm md:text-base">
                Оберіть виконавця та надішліть запит
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-stalker-green flex items-center gap-2">
                <SearchIcon className="h-5 w-5 md:h-6 md:w-6" />
                Доступні Фрілансери
              </h2>

              <div className="space-y-3">
                {freelancers.map((freelancer) => (
                  <Card
                    key={freelancer.id}
                    className={`bg-stalker-card border-stalker-border shadow-lg cursor-pointer transition-all ${
                      selectedFreelancer === freelancer.id.toString()
                        ? 'border-stalker-green ring-2 ring-stalker-green'
                        : 'hover:border-stalker-green/50'
                    }`}
                    onClick={() => setSelectedFreelancer(freelancer.id.toString())}
                  >
                    <CardContent className="pt-3 md:pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stalker-green/20 flex items-center justify-center">
                            <span className="text-stalker-green font-bold text-xs md:text-sm">
                              {freelancer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-stalker-green text-sm md:text-base">
                              {freelancer.name}
                            </h3>
                            <p className="text-stalker-muted text-xs md:text-sm">
                              {freelancer.role}
                            </p>
                          </div>
                        </div>
                        {freelancer.available ? (
                          <Badge className="bg-stalker-green text-stalker-dark text-xs">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Вільний
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-stalker-muted text-stalker-muted text-xs">
                            Зайнятий
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-2 text-xs md:text-sm">
                        <StarIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow fill-stalker-yellow" />
                        <span className="text-stalker-text">{freelancer.rating}</span>
                        <span className="text-stalker-muted">• {freelancer.projects} проектів</span>
                      </div>

                      <div className="flex items-center gap-1 mb-2 text-stalker-muted text-xs md:text-sm">
                        <MapPinIcon className="h-3 w-3 md:h-4 md:w-4" />
                        {freelancer.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {freelancer.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-stalker-border text-stalker-text">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-stalker-yellow font-bold text-sm md:text-base">
                          {freelancer.rate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card className="bg-stalker-card border-stalker-border shadow-xl sticky top-4">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-lg md:text-xl text-stalker-green">
                    <SendIcon className="h-5 w-5 md:h-6 md:w-6 inline-block mr-2" />
                    Надіслати Запит
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 md:p-4 bg-stalker-red/10 border border-stalker-red rounded-lg text-stalker-red text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-stalker-text text-sm md:text-base">
                      Обраний Фрілансер
                    </Label>
                    <div className="p-3 bg-stalker-darker border border-stalker-border rounded-lg">
                      {selectedFreelancer ? (
                        <p className="text-stalker-green font-medium text-sm md:text-base">
                          {freelancers.find(f => f.id.toString() === selectedFreelancer)?.name || 'Не обрано'}
                        </p>
                      ) : (
                        <p className="text-stalker-muted text-sm md:text-base">
                          Оберіть фрілансера зі списку зліва
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-stalker-text text-sm md:text-base">
                      Повідомлення *
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишіть ваш проект та умови співпраці..."
                      className="bg-stalker-darker border-stalker-border text-stalker-text min-h-[150px] md:min-h-[200px] text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/clients/find-freelancer" className="block">
                        <Button variant="outline" className="w-full border-stalker-border text-stalker-text hover:bg-stalker-border h-9 md:h-10 text-sm md:text-base">
                          <ArrowLeftIcon className="h-4 w-4 mr-2" />
                          Назад
                        </Button>
                      </Link>
                      <Button
                        onClick={handleContact}
                        disabled={loading || !selectedFreelancer}
                        className="w-full bg-stalker-purple text-stalker-dark hover:bg-stalker-purple/90 h-9 md:h-10 text-sm md:text-base"
                      >
                        {loading ? "Відправка..." : "Надіслати Запит"}
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
