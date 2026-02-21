"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon, BriefcaseIcon, UsersIcon, StarIcon, MessageCircleIcon, CheckCircleIcon, ArrowRightIcon, FileText, UserCheck, Wallet, CheckSquare, Rocket, TrendingUp, Shield, Search, Briefcase } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { AuthModal } from "@/components/auth-modal";

export default function Home() {
  const { t } = useTranslation();

  // Mock data for featured projects
  const featuredProjects = [
    {
      id: 1,
      title: t('webDevelopment'),
      description: "Build a modern web application with React and Node.js",
      budget: "$2,500 - $5,000",
      skills: ["React", "Node.js", "MongoDB"],
      posted: "2 hours ago",
    },
    {
      id: 2,
      title: t('appDesign'),
      description: "Design intuitive mobile app interfaces for iOS and Android",
      budget: "$1,000 - $2,000",
      skills: ["UI/UX", "Figma", "Prototyping"],
      posted: "5 hours ago",
    },
    {
      id: 3,
      title: "E-commerce Website",
      description: "Develop a fully functional e-commerce platform",
      budget: "$3,000 - $7,000",
      skills: ["Shopify", "CSS", "JavaScript"],
      posted: "1 day ago",
    },
    {
      id: 4,
      title: t('logoDesign'),
      description: "Create a professional logo and brand identity package",
      budget: "$500 - $1,500",
      skills: ["Graphic Design", "Branding", "Illustrator"],
      posted: "3 hours ago",
    },
    {
      id: 5,
      title: t('contentWriting'),
      description: "Write engaging articles about the latest tech trends",
      budget: "$25 - $50/hr",
      skills: ["Content Writing", "Research", "SEO"],
      posted: "6 hours ago",
    },
    {
      id: 6,
      title: t('socialMediaMarketing'),
      description: "Plan and execute a social media strategy for a startup",
      budget: "$2,000 - $4,000",
      skills: ["Social Media", "Marketing", "Analytics"],
      posted: "1 day ago",
    },
  ];

  const popularTags = [
    "Web Development", "Mobile Development", "UI/UX Design", 
    "Graphic Design", "Writing", "Video Editing", "Marketing", 
    "SEO", "Data Analysis", "Virtual Assistance", "Photography"
  ];

  const whyChooseUs = [
    {
      title: "Verified Professionals",
      description: "All freelancers are verified and rated by previous clients",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "Secure Payments",
      description: "Your payments are protected until project completion",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "24/7 Support",
      description: "Our team is always ready to help you with any issues",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "Flexible Hiring",
      description: "Hire for hourly or fixed-price projects as you need",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />
    }
  ];

  const advantages = [
    "Fast project completion",
    "Direct communication with freelancers",
    "Competitive pricing",
    "Quality guarantee",
    "Easy project management",
    "Flexible working arrangements"
  ];

  const whoIsItFor = [
    "Startups and small businesses",
    "Enterprises looking for specialized skills",
    "Individuals needing one-time projects",
    "Agencies expanding their team",
    "Entrepreneurs launching new products",
    "Companies scaling temporarily"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-3 sm:px-4 mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[140px] font-bold mb-3 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Best freelancers for your tasks
          </h1>
          
          <div className="max-w-xl mx-auto relative space-y-3">
            <div className="relative">
              <Input 
                placeholder="Search..." 
                className="py-3 sm:py-4 pl-10 sm:pl-12 pr-4 rounded-full shadow-md text-sm sm:text-base"
                id="search-input"
              />
              <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            
            <Button 
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base" 
              onClick={() => {
                const searchInput = document.getElementById('search-input') as HTMLInputElement;
                if (searchInput) {
                  const query = searchInput.value.trim();
                  if (query) {
                    window.location.href = `/projects?search=${encodeURIComponent(query)}`;
                  } else {
                    alert('Please enter a search query');
                  }
                }
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </section>
      
      {/* Recently Open Orders */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">{t('recentlyOpenedOrders')}</h2>
            <Button variant="link" className="text-base" asChild>
              <a href="/projects">{t('viewAll')} <ArrowRightIcon className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredProjects.slice(0, 3).map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    {project.budget}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.skills.slice(0, 3).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {project.posted}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Tags */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center">{t('popularOrderTags')}</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {popularTags.map((tag, index) => (
              <Button key={index} variant="outline" className="rounded-full px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm">
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{t('whyChooseUs')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 md:mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Freelance Market - Fast and Convenient */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">{t('freelanceMarket')}</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8">
              Find real professionals for any project. Simple interaction, secure payments and quality guarantee.
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-white text-primary hover:bg-gray-100 rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg">
                <a href="/start-cooperation">Start cooperation</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advantages of the Platform */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{t('advantagesOfPlatform')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500 mt-0.5 md:mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Who Is It For */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{t('whoIsItFor')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whoIsItFor.map((audience, index) => (
              <div key={index} className="bg-background p-5 md:p-6 rounded-xl shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{audience}</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Perfect for this category of clients, taking into account their specific needs and requirements.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why It's More Convenient to Work Through the Exchange */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{t('whyItMoreConvenient')}</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  1
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Your funds are protected until work completion is confirmed. We guarantee a refund if you are not satisfied with the result.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  2
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">Verified Professionals</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Each freelancer is verified and has reviews from previous clients. This ensures high-quality work execution.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  3
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">Convenient Communication</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    All negotiations and file transfers take place within the platform, ensuring safety and convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">How it works</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Publish a project</h3>
              <p className="text-muted-foreground text-sm">
                Publish a project for free to find a freelancer
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <UserCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Choose a freelancer</h3>
              <p className="text-muted-foreground text-sm">
                Choose a freelancer among those who responded
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Reserve funds</h3>
              <p className="text-muted-foreground text-sm">
                Reserve funds on the service, and the freelancer will start work
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
            
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <CheckSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Finish project</h3>
              <p className="text-muted-foreground text-sm">
                Check the result and complete the project
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Today */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Join us today</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients and freelancers who have already found each other on our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button asChild className="bg-white text-primary hover:bg-gray-100 rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg">
              <a href="/start-cooperation">{t('createProfile')}</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Freelancers Choose FreelancePro */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Why freelancers choose FreelancePro</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4 mx-auto w-fit">
                <Rocket className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Projects for beginners and pros</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Find projects that match your skill level
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4 mx-auto w-fit">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Honest rating</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Build your reputation with transparent reviews
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4 mx-auto w-fit">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Find permanent work</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Search for long-term employment opportunities
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4 mx-auto w-fit">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Secure cooperation</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Guaranteed payment with safe collaboration
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <AuthModal defaultTab="signup" buttonLabel="Become a freelancer" />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
