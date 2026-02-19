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
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { EyeIcon, EyeOffIcon, Phone, CheckCircle2 } from "lucide-react";

// Mock verification code - last 4 digits of incoming number (+13162)
const MOCK_VERIFICATION_CODE = "3162";
const MOCK_PHONE_NUMBER = "+380960034147";
const MIN_PASSWORD_LENGTH = 6;

export default function ClientSignupPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // Step 1: Phone verification
  const [phoneNumber, setPhoneNumber] = useState(MOCK_PHONE_NUMBER);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Step 2: Account credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 3: Personal info
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0 && codeSent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, codeSent]);

  const handleSendCode = () => {
    setCodeSent(true);
    setCountdown(60);
    showToast(t("codeSent"), "success");
  };

  const handleVerifyCode = () => {
    if (verificationCode === MOCK_VERIFICATION_CODE) {
      setIsPhoneVerified(true);
      showToast(t("success"), "success");
    } else {
      setError(t("invalidVerificationCode"));
      showToast(t("invalidVerificationCode"), "error");
    }
  };

  const handleSignup = async () => {
    setError(null);

    // Validation
    if (!termsAccepted) {
      setError(t("termsNotAccepted"));
      showToast(t("termsNotAccepted"), "error");
      return;
    }

    if (password !== confirmPassword) {
      setError(t("errorPasswordMismatch"));
      showToast(t("errorPasswordMismatch"), "error");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      const message = t("errorPasswordTooShort", {
        min: MIN_PASSWORD_LENGTH,
        defaultValue: "Password must be at least {{min}} characters",
      });
      setError(message);
      showToast(message, "error");
      return;
    }

    if (!username || !password || !email || !firstName || !lastName) {
      setError(t("errorRequired"));
      showToast(t("errorRequired"), "error");
      return;
    }

    setLoading(true);
    const ok = await register({
      email,
      password,
      fullName: `${firstName} ${lastName}`.trim(),
      role: "client",
    });
    setLoading(false);

    if (!ok) {
      setError(t("errorRegistrationFailed"));
      showToast(t("errorRegistrationFailed"), "error");
      return;
    }

    showToast(t("registrationSuccess"), "success");

    setTimeout(() => {
      router.push("/projects/new");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-6 md:py-8 px-4 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader className="space-y-1 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl">{t('clientRegistration')}</CardTitle>
            <CardDescription className="text-sm">{t('signupDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Phone Verification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isPhoneVerified ? 'bg-green-100 text-green-600' : 'bg-primary text-primary-foreground'}`}>
                  {isPhoneVerified ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <Label className="text-base font-medium">{t('phoneVerification')}</Label>
              </div>

              {!isPhoneVerified ? (
                <div className="space-y-3 pl-10">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone-number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-10 md:h-11"
                      disabled={codeSent}
                    />
                  </div>

                  {!codeSent ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 md:h-11"
                      onClick={handleSendCode}
                    >
                      {t('resendCode')}
                    </Button>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md text-sm text-blue-700 dark:text-blue-300">
                        {t('phoneVerificationText')}<strong>{phoneNumber}</strong>{t('phoneVerificationText2')}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verification-code">{t('verificationCode')}</Label>
                        <Input
                          id="verification-code"
                          value={verificationCode}
                          onChange={(e) => {
                            setVerificationCode(e.target.value);
                            setError(null);
                          }}
                          placeholder="____"
                          className="h-10 md:h-11 text-center tracking-widest text-lg"
                          maxLength={4}
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full h-10 md:h-11"
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length !== 4}
                      >
                        {t('verificationCode')}
                      </Button>
                      {countdown > 0 && (
                        <p className="text-center text-sm text-gray-500">
                          {t('resendCode')} через {countdown}с
                        </p>
                      )}
                      {countdown === 0 && (
                        <Button
                          type="button"
                          variant="link"
                          className="w-full"
                          onClick={handleSendCode}
                        >
                          {t('resendCode')}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="pl-10 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">{t('success')}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Step 2: Account Credentials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isPhoneVerified ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-400'}`}>
                  2
                </div>
                <Label className="text-base font-medium">{t('accountCredentials')}</Label>
              </div>

              <div className="space-y-4 pl-10">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('username')}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('username')}
                    className="h-10 md:h-11"
                    disabled={!isPhoneVerified}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                      aria-label="Toggle password visibility"
                      disabled={!isPhoneVerified}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('confirmPasswordLabel')}</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                      aria-label="Toggle confirm password visibility"
                      disabled={!isPhoneVerified}
                    >
                      {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 3: Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isPhoneVerified ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-400'}`}>
                  3
                </div>
                <Label className="text-base font-medium">{t('personalInfo')}</Label>
              </div>

              <div className="space-y-4 pl-10">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-10 md:h-11"
                    disabled={!isPhoneVerified}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">{t('firstName')}</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('firstNamePlaceholder')}
                      className="h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">{t('lastName')}</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('lastNamePlaceholder')}
                      className="h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">{t('country')}</Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t('selectCountry')}
                      className="h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('city')}</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('selectCity')}
                      className="h-10 md:h-11"
                      disabled={!isPhoneVerified}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="space-y-2 pl-10">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  disabled={!isPhoneVerified}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                  {t('termsAcceptance')}{' '}
                  <Link href="/terms" className="text-primary hover:underline">{t('termsOfService')}</Link>{' '}
                  та{' '}
                  <Link href="/privacy" className="text-primary hover:underline">{t('privacyPolicy')}</Link>
                  {t('termsConsent')}
                </Label>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button
              className="w-full h-10 md:h-11"
              onClick={handleSignup}
              disabled={loading || !isPhoneVerified}
            >
              {loading ? t('loading') : t('completeRegistration')}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-3 md:my-4" />
            <p className="text-center text-sm">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-medium underline underline-offset-4">
                {t('login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
