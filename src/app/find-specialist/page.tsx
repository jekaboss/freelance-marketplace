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

export default function FindSpecialistPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container py-8 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Знайти фахівця</h1>
            <p className="text-muted-foreground text-lg">
              Опишіть ваші вимоги, і ми знайдемо ідеального фахівця для вашого проекту
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Вимоги до фахівця</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialist-name">Ім'я фахівця (за бажанням)</Label>
                  <Input id="specialist-name" placeholder="Вкажіть конкретного фахівця, якщо знаєте" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категорія фахівця</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть категорію" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-dev">Веб-розробник</SelectItem>
                      <SelectItem value="mobile-dev">Мобільний розробник</SelectItem>
                      <SelectItem value="designer">Дизайнер</SelectItem>
                      <SelectItem value="marketing">Маркетолог</SelectItem>
                      <SelectItem value="writer">Копірайтер</SelectItem>
                      <SelectItem value="seo">SEO-фахівець</SelectItem>
                      <SelectItem value="data-analyst">Аналітик даних</SelectItem>
                      <SelectItem value="project-manager">Менеджер проектів</SelectItem>
                      <SelectItem value="other">Інше</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Рівень досвіду</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть рівень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (до 2 років)</SelectItem>
                      <SelectItem value="middle">Middle (2-5 років)</SelectItem>
                      <SelectItem value="senior">Senior (5+ років)</SelectItem>
                      <SelectItem value="expert">Експерт (10+ років)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Доступність</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть доступність" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part-time">Неповний робочий день</SelectItem>
                      <SelectItem value="full-time">Повний робочий день</SelectItem>
                      <SelectItem value="project-basis">За проектами</SelectItem>
                      <SelectItem value="immediate">Може почати негайно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Основні вимоги</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Опишіть основні вимоги до фахівця, необхідні навички та досвід..." 
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-skills">Бажані навички</Label>
                <Input 
                  id="preferred-skills" 
                  placeholder="Вкажіть додаткові навички, які вітаються (наприклад: Adobe Creative Suite, Google Analytics)" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Бюджет на годину (якщо за погодинною оплатою)</Label>
                  <Input 
                    id="budget" 
                    type="number" 
                    placeholder="Наприклад: 30" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Місцезнаходження (опційно)</Label>
                  <Input 
                    id="location" 
                    placeholder="Вкажіть бажане місцезнаходження або 'Віддалено'" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-info">Додаткова інформація</Label>
                <Textarea 
                  id="additional-info" 
                  placeholder="Додайте будь-яку додаткову інформацію про проект або фахівця, якого шукаєте..." 
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <Button className="w-full md:w-auto px-8 py-6 text-lg">
                  Знайти фахівця
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Перевірені фахівці</h3>
              <p className="text-muted-foreground">
                Усі фахівці проходять ретельну перевірку та мають перевірені портфоліо
              </p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Прозорий процес</h3>
              <p className="text-muted-foreground">
                Ви можете відстежувати прогрес роботи в режимі реального часу
              </p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Гарантія задоволення</h3>
              <p className="text-muted-foreground">
                Якщо результат вас не влаштовує, ми гарантуємо повернення коштів
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}