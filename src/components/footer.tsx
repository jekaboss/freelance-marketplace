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
    <footer className="bg-background border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting businesses with top talent worldwide. Find the perfect freelancer for your project today.
            </p>
            <div className="flex space-x-4 mb-8">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
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
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                info@freelancemarket.com
              </li>
              <li className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <span>123 Business Ave<br />San Francisco, CA 94107</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FreelanceMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
