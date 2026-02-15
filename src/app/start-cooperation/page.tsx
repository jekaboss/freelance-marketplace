"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

export default function StartCooperationPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container py-8 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Розпочати співпрацю</h1>
            <p className="text-muted-foreground text-lg">
              Розкажіть нам про ваш проект, і ми знайдемо найкращого фахівця для вас
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Деталі проекту</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Назва проекту</Label>
                  <Input id="project-title" placeholder="Введіть назву проекту" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категорія</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть категорію" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-dev">Веб-розробка</SelectItem>
                      <SelectItem value="mobile-dev">Мобільна розробка</SelectItem>
                      <SelectItem value="design">Дизайн</SelectItem>
                      <SelectItem value="marketing">Маркетинг</SelectItem>
                      <SelectItem value="writing">Копірайтинг</SelectItem>
                      <SelectItem value="other">Інше</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Бюджет</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть бюджет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-500">До $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1000</SelectItem>
                      <SelectItem value="1000-2500">$1000 - $2500</SelectItem>
                      <SelectItem value="2500-5000">$2500 - $5000</SelectItem>
                      <SelectItem value="over-5000">Більше $5000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Термін виконання</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть термін" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-week">Менше тижня</SelectItem>
                      <SelectItem value="week">Тиждень</SelectItem>
                      <SelectItem value="month">Місяць</SelectItem>
                      <SelectItem value="long-term">Довгостроковий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Опис проекту</Label>
                <Textarea 
                  id="description" 
                  placeholder="Детально опишіть ваш проект, вимоги та очікування..." 
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Необхідні навички</Label>
                <Input 
                  id="skills" 
                  placeholder="Введіть потрібні навички через кому (наприклад: React, Node.js, UI/UX)" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachment">Додати файли (опційно)</Label>
                <Input id="attachment" type="file" multiple />
              </div>
              
              <div className="pt-4">
                <Button className="w-full md:w-auto px-8 py-6 text-lg">
                  Відправити проект
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Швидкий пошук</h3>
              <p className="text-muted-foreground">
                Ми знайдемо найкращого фахівця за лічені години замість днів
              </p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Безпечна угода</h3>
              <p className="text-muted-foreground">
                Ваші кошти захищені до моменту підтвердження виконання робіт
              </p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Гарантована якість</h3>
              <p className="text-muted-foreground">
                Усі фахівці проходять перевірку та мають відгуки попередніх клієнтів
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}