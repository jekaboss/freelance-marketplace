"use client";

import { useTranslation } from 'react-i18next';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    {
      title: t('company'),
      items: [
        { label: t('aboutUs'), href: "#" },
        { label: t('careers'), href: "#" },
        { label: t('blog'), href: "#" },
        { label: t('contact'), href: "#" },
      ],
    },
    {
      title: t('projects'),
      items: [
        { label: t('browseProjects'), href: "/projects" },
        { label: t('postProject'), href: "#" },
        { label: t('featuredProjects'), href: "#" },
      ],
    },
    {
      title: t('freelancers'),
      items: [
        { label: "Find Talent", href: "/freelancers" },
        { label: "Top Skills", href: "#" },
        { label: "How It Works", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t pt-12 md:pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-muted-foreground mb-6 sm:mb-4 max-w-md">
              Connecting businesses with top talent worldwide. Find the perfect freelancer for your project today.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mb-6 sm:mb-8">
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
          
          {links.map((linkGroup, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{linkGroup.title}</h3>
              <ul className="space-y-2">
                {linkGroup.items.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start sm:items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm">info@freelancemarket.com</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Business Ave<br />San Francisco, CA 94107</span>
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
