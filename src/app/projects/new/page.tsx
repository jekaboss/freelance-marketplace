"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast-provider";

export default function NewProjectPage() {
  const { token, apiMode, isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError(t("errorRequired"));
      return;
    }
    if (!token || !user) {
      setError(t("errorNotAuthenticated"));
      return;
    }
    if (user.role === "freelancer") {
      setError(t("errorFreelancerCannotCreate"));
      return;
    }

    const budgetValue = budget ? Number(budget) : undefined;
    if (budget && Number.isNaN(budgetValue)) {
      setError(t("errorBudgetNumber"));
      return;
    }

    setLoading(true);
    try {
      await apiRequest(
        "/projects",
        { method: "POST", token, body: { clientId: user.id, client_id: user.id, title, description, budget: budgetValue } },
        apiMode
      );
      showToast(t("success"), "success");
      router.push("/projects");
    } catch {
      setError(t("errorSaveFailed"));
      showToast(t("errorSaveFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-10 px-4 flex-grow flex items-start justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                {t("errorNotAuthenticated")}{" "}
                <Link href="/login" className="underline">Login</Link>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input id="project-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <textarea
                id="project-description"
                className="w-full p-2 border rounded-md min-h-[140px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-budget">Budget (optional)</Label>
              <Input id="project-budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : "Create Project"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/projects")}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
