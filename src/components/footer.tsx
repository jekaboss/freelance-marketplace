"use client";

import { useTranslation } from 'react-i18next';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t pt-12 md:pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Logo size="lg" className="mb-4" />
            <p className="text-muted-foreground mb-6 max-w-md">
              Connecting businesses with top talent worldwide. Find the perfect freelancer for your project today.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2">
              <li>
                <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Freelance Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Freelancer Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Profile Verification
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Safe
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Business Safe
                </a>
              </li>
              <li>
                <a href="/freelancers" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  All Freelancers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Remote Work
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Freelancer Reviews
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Client Reviews
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('aboutUs')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t('aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t('blog')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 md:mt-12 pt-6 md:pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FreelanceMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
