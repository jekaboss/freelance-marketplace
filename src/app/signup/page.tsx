"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignupPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [accountType, setAccountType] = useState<"freelancer" | "client">("client");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError(t("errorPasswordMismatch"));
      showToast(t("errorPasswordMismatch"), "error");
      return;
    }

    setLoading(true);
    const ok = await register({
      email,
      password,
      fullName: `${firstName} ${lastName}`.trim(),
      role: accountType,
    });
    setLoading(false);

    if (!ok) {
      setError(t("errorRegistrationFailed"));
      showToast(t("errorRegistrationFailed"), "error");
      return;
    }

    showToast(t("success"), "success");
    
    // Redirect based on account type
    setTimeout(() => {
      if (accountType === "freelancer") {
        router.push("/freelancers");
      } else {
        router.push("/profile");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-6 md:py-8 px-4 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl">{t('signup')}</CardTitle>
            <CardDescription className="text-sm">Create an account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-type" className="text-sm">Account Type</Label>
              <select id="account-type" className="w-full p-2.5 border rounded-md text-sm" value={accountType} onChange={(e) => setAccountType(e.target.value as "freelancer" | "client")}>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-sm">First Name</Label>
                <Input id="first-name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 md:h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-sm">Last Name</Label>
                <Input id="last-name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 md:h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 md:h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pr-10 h-10 md:h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirm-password" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="pr-10 h-10 md:h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full h-10 md:h-11" onClick={handleSignup} disabled={loading}>
              {loading ? "..." : "Create Account"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-3 md:my-4" />
            <div className="space-y-2 w-full">
              <Button variant="outline" className="w-full h-10 md:h-11 text-sm">Continue with Google</Button>
              <Button variant="outline" className="w-full h-10 md:h-11 text-sm">Continue with GitHub</Button>
            </div>
            <p className="mt-3 md:mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-medium underline underline-offset-4">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
