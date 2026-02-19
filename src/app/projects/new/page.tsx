"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";
import { apiRequest } from "@/lib/api-client";
import { 
  BriefcaseIcon, 
  PhoneIcon, 
  FolderIcon, 
  UploadIcon, 
  CreditCardIcon, 
  Building2Icon,
  UserIcon,
  CheckCircle2Icon,
  ClockIcon
} from "lucide-react";
import { CategorySelectorDialog } from "@/components/category-selector-dialog";
import { Badge } from "@/components/ui/badge";

export default function NewProjectPage() {
  const { token, apiMode, isAuthenticated, user, isHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [paymentType, setPaymentType] = useState<"personal" | "company">("personal");
  const [budget, setBudget] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  // Validation & loading state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-10 px-4 flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t("errorRequired");
    }

    if (!description.trim()) {
      newErrors.description = t("errorRequired");
    }

    if (!phone.trim()) {
      newErrors.phone = t("errorRequired");
    } else {
      // Simple phone validation - at least 10 digits
      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        newErrors.phone = t("phoneFormatError");
      }
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = t("errorRequired");
    }

    if (budget && Number.isNaN(Number(budget))) {
      newErrors.budget = t("errorBudgetNumber");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrors({});
    
    if (!validateForm()) {
      showToast(t("errorRequired"), "error");
      return;
    }

    if (!isAuthenticated || !user || !token) {
      showToast(t("errorNotAuthenticated"), "error");
      router.push("/login");
      return;
    }

    if (user.role === "freelancer") {
      showToast(t("errorFreelancerCannotCreate"), "error");
      return;
    }

    setLoading(true);
    try {
      const budgetValue = budget ? Number(budget) : undefined;

      const requestBody = {
        clientId: user.id,
        client_id: user.id,
        title,
        description,
        phone,
        categoryIds: selectedCategories,
        paymentType,
        budget: budgetValue,
        fileNames: attachedFiles.map(f => f.name),
      };

      await apiRequest("/projects", {
        method: "POST",
        token,
        body: requestBody,
      }, apiMode);

      showToast(t("projectCreatedSuccess"), "success");
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      const message = error instanceof Error && error.message
        ? error.message
        : t("projectCreatedError");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{t("createProjectTitle")}</h1>
            </div>

            {/* Steps Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t("step1AddProject")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("step1Desc")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t("step2ReceiveProposals")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("step2Desc")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t("step3StartCooperation")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("step3Desc")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t("step4WriteReview")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("step4Desc")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* 1. Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">
                    {t("projectNameLabel")} *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("projectNamePlaceholder")}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* 2. Project Description with File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">
                    {t("projectDescriptionLabel")} *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("projectDescriptionPlaceholder")}
                    className={`min-h-[140px] ${errors.description ? "border-destructive" : ""}`}
                  />
                  
                  {/* File Upload */}
                  <div className="pt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <UploadIcon className="h-4 w-4" />
                      {t("addFile")}
                    </Button>
                    
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {attachedFiles.map((file, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-2 pr-1"
                          >
                            <FolderIcon className="h-3 w-3" />
                            <span className="text-xs truncate max-w-[200px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="hover:text-destructive"
                            >
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* 3. Mobile Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    {t("mobilePhoneLabel")} *
                  </Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("mobilePhonePlaceholder")}
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                      type="tel"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* 4. Categories */}
                <div className="space-y-2">
                  <Label className="text-base">
                    {t("categoriesLabel")} *
                  </Label>
                  <CategorySelectorDialog
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                  {errors.categories && (
                    <p className="text-sm text-destructive">{errors.categories}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Budget & Payment Section */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Safe Deal Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("safeDealDescription")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Payment Type */}
                <div className="space-y-3">
                  <Label className="text-base">{t("paymentLabel")} *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentType === "personal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentType("personal")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{t("paymentPersonal")}</p>
                        </div>
                        {paymentType === "personal" && (
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentType === "company"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentType("company")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{t("paymentCompany")}</p>
                        </div>
                        {paymentType === "company" && (
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Project Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-base">
                    {t("projectBudgetLabel")}
                  </Label>
                  <div className="relative">
                    <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder={t("projectBudgetPlaceholder")}
                      type="number"
                      className={`pl-10 ${errors.budget ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-sm text-destructive">{errors.budget}</p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("budgetNote")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="flex-1 h-12 text-base"
              >
                {loading ? (
                  <ClockIcon className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <CheckCircle2Icon className="h-5 w-5 mr-2" />
                )}
                {t("publishProject")}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/projects")}
                size="lg"
                className="h-12 text-base"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
