"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { CameraIcon, UserIcon, CreditCardIcon, BriefcaseIcon, SettingsIcon, LanguagesIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export default function PersonalDataPage() {
  const { user, token, apiMode } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Work format
  const [workFormats, setWorkFormats] = useState({
    freelanceProjects: true,
    permanentRemote: false,
  });

  // Languages
  const [languages, setLanguages] = useState<{ language: string; level: string }[]>([
    { language: "ukrainian", level: "native" },
  ]);

  // Personal info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
  });

  // Account info
  const [accountInfo, setAccountInfo] = useState({
    login: "",
    profileType: "client",
  });

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    telegram: "",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.full_name?.split(" ")[0] || "",
        lastName: user.full_name?.split(" ")[1] || "",
        birthDate: "",
        country: "Україна",
      });

      setAccountInfo({
        login: user.email?.split("@")[0] || "",
        profileType: user.role === "freelancer" ? "freelancer" : "client",
      });

      setContactInfo({
        email: user.email || "",
        phone: "",
        telegram: "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save personal info
      await apiRequest(`/auth/me`, {
        method: "PATCH",
        token,
        body: {
          full_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
        },
      }, apiMode);

      showToast("Дані збережено успішно!", "success");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Помилка збереження";
      showToast(`Помилка: ${errMsg}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "beginner" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Особисті дані</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Керуйте вашою особистою інформацією та налаштуваннями</p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Мої дані */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Мої дані
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Фото */}
                <div className="space-y-2">
                  <Label>Фото</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatarUrl} />
                      <AvatarFallback>{user?.full_name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Змінити фото
                    </Button>
                  </div>
                </div>

                {/* Контактні дані */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Контактні дані
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        placeholder="+380 XX XXX XX XX"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        placeholder="@username"
                        value={contactInfo.telegram}
                        onChange={(e) => setContactInfo({ ...contactInfo, telegram: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Платіжні дані */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" />
                    Платіжні дані
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Платіжні дані будуть доступні після підключення платіжної системи.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Формат роботи на сервісі */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  Формат роботи на сервісі
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Фриланс-проєкти</Label>
                    <p className="text-sm text-muted-foreground">
                      Доступні разові проєкти та замовлення
                    </p>
                  </div>
                  <Switch
                    checked={workFormats.freelanceProjects}
                    onCheckedChange={(val) => setWorkFormats({ ...workFormats, freelanceProjects: val })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Постійна віддалена робота</Label>
                    <p className="text-sm text-muted-foreground">
                      Доступні вакансії на постійній основі
                    </p>
                  </div>
                  <Switch
                    checked={workFormats.permanentRemote}
                    onCheckedChange={(val) => setWorkFormats({ ...workFormats, permanentRemote: val })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Параметри облікового запису */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Параметри облікового запису
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Логін</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={accountInfo.login} disabled className="max-w-xs" />
                    <Button variant="outline" size="sm">Змінити</Button>
                  </div>
                </div>
                <div>
                  <Label>Тип профілю</Label>
                  <div className="mt-1">
                    <Select value={accountInfo.profileType} disabled>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Роботодавець</SelectItem>
                        <SelectItem value="freelancer">Фрилансер</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Тип профілю не можна змінити після створення
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <LanguagesIcon className="h-4 w-4" />
                    Рівень володіння мовами
                  </Label>
                  <div className="space-y-2 mt-2">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex gap-2">
                        <Select
                          value={lang.language}
                          onValueChange={(val) => updateLanguage(index, "language", val)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Оберіть мову" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ukrainian">🇺🇦 Українська</SelectItem>
                            <SelectItem value="russian">🇷🇺 Російська</SelectItem>
                            <SelectItem value="english">🇬🇧 Англійська</SelectItem>
                            <SelectItem value="polish">🇵🇱 Польська</SelectItem>
                            <SelectItem value="german">🇩🇪 Німецька</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={lang.level}
                          onValueChange={(val) => updateLanguage(index, "level", val)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Початковий</SelectItem>
                            <SelectItem value="intermediate">Середній</SelectItem>
                            <SelectItem value="advanced">Високий</SelectItem>
                            <SelectItem value="fluent">Вільний</SelectItem>
                            <SelectItem value="native">Рідна</SelectItem>
                          </SelectContent>
                        </Select>
                        {languages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLanguage(index)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addLanguage}>
                      + Додати мову
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Особиста інформація */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Особиста інформація
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">Ім'я *</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Прізвище *</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="birthDate">Дата народження</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={personalInfo.birthDate}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, birthDate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Після збереження ці дані не можна буде змінити.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="country">Країна *</Label>
                    <Select value={personalInfo.country} onValueChange={(val) => setPersonalInfo({ ...personalInfo, country: val })}>
                      <SelectTrigger id="country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Україна">🇺🇦 Україна</SelectItem>
                        <SelectItem value="Польща">🇵🇱 Польща</SelectItem>
                        <SelectItem value="Німеччина">🇩🇪 Німеччина</SelectItem>
                        <SelectItem value="США">🇺🇸 США</SelectItem>
                        <SelectItem value="Інша">🌍 Інша</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button onClick={handleSave} size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? "Збереження..." : "Зберегти зміни"}
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
