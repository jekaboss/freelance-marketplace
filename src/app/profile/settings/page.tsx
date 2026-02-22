"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';
import { BellIcon, GlobeIcon, PaletteIcon } from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { token, apiMode } = useAuth();
  const [user, setUser] = useState<any>(null);

  // Email Notifications
  const [emailSettings, setEmailSettings] = useState({
    privateMessages: true,
    serviceInfo: true,
    specialOffers: false,
    quarterlyDigest: true,
    weeklyBlog: true,
  });

  // Push & Sound
  const [pushSettings, setPushSettings] = useState({
    browserPush: true,
    personalNotifications: true,
    soundEnabled: true,
  });

  // Language & Translation
  const [language, setLanguage] = useState("uk");
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [excludeLanguages, setExcludeLanguages] = useState<string[]>(["uk"]);

  // Theme
  const [theme, setTheme] = useState("light");

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.email) setEmailSettings(settings.email);
        if (settings.push) setPushSettings(settings.push);
        if (settings.language) setLanguage(settings.language);
        if (settings.autoTranslate !== undefined) setAutoTranslate(settings.autoTranslate);
        if (settings.excludeLanguages) setExcludeLanguages(settings.excludeLanguages);
        if (settings.theme) setTheme(settings.theme);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    // Load user data
    if (token) {
      apiRequest("/auth/me", { token }, apiMode)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => console.error("Failed to load user:", err));
    }
  }, [token, apiMode]);

  const saveSettings = () => {
    const settings = {
      email: emailSettings,
      push: pushSettings,
      language,
      autoTranslate,
      excludeLanguages,
      theme,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    showToast("Настройки збережені", "success");
  };

  const handleEmailChange = (key: string, value: boolean) => {
    setEmailSettings({ ...emailSettings, [key]: value });
  };

  const handlePushChange = (key: string, value: boolean) => {
    setPushSettings({ ...pushSettings, [key]: value });
  };

  const toggleExcludeLanguage = (lang: string) => {
    setExcludeLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <div className="container py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Настройки</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Керуйте ваші преференціями та повідомленнями</p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="notifications">
                <BellIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Повідомлення</span>
              </TabsTrigger>
              <TabsTrigger value="language">
                <GlobeIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Мова</span>
              </TabsTrigger>
              <TabsTrigger value="theme">
                <PaletteIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Тема</span>
              </TabsTrigger>
              <TabsTrigger value="privacy">Приватність</TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📧 E-mail повідомлення
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Нові приватні повідомлення</Label>
                    <Switch
                      checked={emailSettings.privateMessages}
                      onCheckedChange={(val) => handleEmailChange('privateMessages', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Інформаційні повідомлення сервісу</Label>
                    <Switch
                      checked={emailSettings.serviceInfo}
                      onCheckedChange={(val) => handleEmailChange('serviceInfo', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Спеціальні пропозиції від сервісу</Label>
                    <Switch
                      checked={emailSettings.specialOffers}
                      onCheckedChange={(val) => handleEmailChange('specialOffers', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Дайджест новин сервісу — не частіше разу на квартал</Label>
                    <Switch
                      checked={emailSettings.quarterlyDigest}
                      onCheckedChange={(val) => handleEmailChange('quarterlyDigest', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Дайджест нових публікацій у блозі — не частіше разу на тиждень</Label>
                    <Switch
                      checked={emailSettings.weeklyBlog}
                      onCheckedChange={(val) => handleEmailChange('weeklyBlog', val)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Push & Sound */}
              <Card>
                <CardHeader>
                  <CardTitle>🔔 Push та звукові повідомлення</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Push повідомлення в браузері</Label>
                    <Switch
                      checked={pushSettings.browserPush}
                      onCheckedChange={(val) => handlePushChange('browserPush', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Нові особисті сповіщення (звукове повідомлення)</Label>
                    <Switch
                      checked={pushSettings.personalNotifications}
                      onCheckedChange={(val) => handlePushChange('personalNotifications', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Включити звук</Label>
                    <Switch
                      checked={pushSettings.soundEnabled}
                      onCheckedChange={(val) => handlePushChange('soundEnabled', val)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Language Tab */}
            <TabsContent value="language" className="space-y-6">
              {/* Localization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🌐 Локалізація та автопереклад
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language-select">Бажана мова</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="uk">🇺🇦 Українська</SelectItem>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Автопереклад</Label>
                        <p className="text-sm text-muted-foreground">
                          Автоматично перекладати контент бажаною мовою
                        </p>
                      </div>
                      <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                    </div>

                    {autoTranslate && (
                      <div className="ml-6 p-4 bg-muted rounded-lg space-y-3">
                        <Label className="block font-semibold">
                          Автопереклад не потрібен для:
                        </Label>
                        <div className="space-y-2">
                          {["ru", "en", "pl", "de"].map((lang) => (
                            <div key={lang} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`exclude-${lang}`}
                                checked={excludeLanguages.includes(lang)}
                                onChange={() => toggleExcludeLanguage(lang)}
                                className="rounded"
                              />
                              <Label htmlFor={`exclude-${lang}`} className="cursor-pointer">
                                {lang === "ru" && "🇷🇺 Русский"}
                                {lang === "en" && "🇬🇧 English"}
                                {lang === "pl" && "🇵🇱 Polski"}
                                {lang === "de" && "🇩🇪 Deutsch"}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Візуальні вподобання</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Тема відображення</Label>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                        className="h-24 flex flex-col gap-2"
                      >
                        <div className="w-8 h-8 rounded bg-white border border-gray-300"></div>
                        <span>Світла</span>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                        className="h-24 flex flex-col gap-2"
                      >
                        <div className="w-8 h-8 rounded bg-gray-900 border border-gray-600"></div>
                        <span>Темна</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔒 Приватність</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Опції приватності буде додано пізніше</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex gap-4">
            <Button onClick={saveSettings} size="lg" className="flex-1">
              Зберегти настройки
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Скасувати
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
