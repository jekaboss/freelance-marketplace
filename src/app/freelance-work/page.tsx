"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BriefcaseIcon, SearchIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  description: string;
  budget: string;
  posted: string;
  status: string;
  skills: string[];
  location: string;
  proposals: number;
};

type ServiceCategory = {
  name: string;
  translationKey: string;
  services: { name: string; translationKey: string }[];
};

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Full Stack Web Application",
    description: "Looking for a full-stack developer to build a web application with React, Node.js, and PostgreSQL.",
    budget: "$3,000 - $5,000",
    posted: "2 days ago",
    status: "open",
    skills: ["React", "Node.js", "PostgreSQL", "Express", "webDevelopment"],
    location: "Remote",
    proposals: 15,
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Need a creative designer to create a modern UI/UX for a fitness mobile app.",
    budget: "$1,200 - $2,000",
    posted: "1 day ago",
    status: "open",
    skills: ["UI/UX", "Figma", "Prototyping", "User Research", "designAndCreative"],
    location: "Remote",
    proposals: 8,
  },
  {
    id: 3,
    title: "3D Modeling for Product Visualization",
    description: "Need a skilled 3D artist to create realistic product models for our e-commerce store.",
    budget: "$800 - $1,500",
    posted: "3 hours ago",
    status: "open",
    skills: ["3D Modeling", "Blender", "threeDModeling"],
    location: "Remote",
    proposals: 5,
  },
  {
    id: 4,
    title: "Python Data Analysis Script",
    description: "Looking for a Python developer to create data analysis scripts with visualization.",
    budget: "$500 - $1,000",
    posted: "5 hours ago",
    status: "open",
    skills: ["Python", "Data Analysis", "pythonDevelopment", "dataAnalysis"],
    location: "Remote",
    proposals: 12,
  },
  {
    id: 5,
    title: "Social Media Marketing Campaign",
    description: "Need an experienced marketer to run Instagram and Facebook ad campaigns.",
    budget: "$1,000 - $2,500",
    posted: "1 day ago",
    status: "open",
    skills: ["Instagram", "Facebook Ads", "socialMediaMarketing"],
    location: "Remote",
    proposals: 20,
  },
  {
    id: 6,
    title: "Content Writing for Tech Blog",
    description: "Looking for a technical writer to create blog posts about AI and machine learning.",
    budget: "$300 - $600",
    posted: "2 days ago",
    status: "open",
    skills: ["Content Writing", "Technical Writing", "contentWriting"],
    location: "Remote",
    proposals: 18,
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    name: "Development & IT",
    translationKey: "programmingAndTech",
    services: [
      { name: "Web Development", translationKey: "webDevelopment" },
      { name: "Mobile Development", translationKey: "mobileDevelopment" },
      { name: "WordPress", translationKey: "wordpress" },
      { name: "Shopify", translationKey: "shopify" },
      { name: "React", translationKey: "reactDevelopment" },
      { name: "Python", translationKey: "pythonDevelopment" },
      { name: "Java", translationKey: "javaDevelopment" },
      { name: "PHP", translationKey: "phpDevelopment" },
      { name: "iOS", translationKey: "iosDevelopment" },
      { name: "Android", translationKey: "androidDevelopment" },
      { name: "Cross-Platform", translationKey: "crossPlatformDevelopment" },
      { name: "Database", translationKey: "databaseDevelopment" },
      { name: "API", translationKey: "apiDevelopment" },
      { name: "DevOps & Cloud", translationKey: "devopsAndCloud" },
      { name: "Cybersecurity", translationKey: "cybersecurity" },
      { name: "Blockchain & Crypto", translationKey: "blockchainAndCryptocurrency" },
      { name: "Game Dev", translationKey: "gameDevelopment" },
      { name: "AI & Machine Learning", translationKey: "aiAndMachineLearning" },
      { name: "ML Models", translationKey: "machineLearningDevelopment" },
      { name: "NLP", translationKey: "nlpDevelopment" },
      { name: "Computer Vision", translationKey: "computerVision" },
      { name: "Data Analysis", translationKey: "dataAnalysis" },
      { name: "Data Visualization", translationKey: "dataVisualization" },
      { name: "Statistical Analysis", translationKey: "statisticalAnalysis" },
      { name: "Data Science", translationKey: "dataScience" },
    ],
  },
  {
    name: "Design & Creative",
    translationKey: "designAndCreative",
    services: [
      { name: "Logo", translationKey: "logoDesign" },
      { name: "Brand Style", translationKey: "brandStyleGuides" },
      { name: "Illustration", translationKey: "illustration" },
      { name: "UI/UX", translationKey: "designAndCreative" },
      { name: "Web Design", translationKey: "webDesign" },
      { name: "App Design", translationKey: "appDesign" },
      { name: "2D Animation", translationKey: "animation2D" },
      { name: "3D Animation", translationKey: "animation3D" },
      { name: "3D Modeling", translationKey: "threeDModeling" },
      { name: "Video Editing", translationKey: "videoEditing" },
      { name: "Video Production", translationKey: "videoProduction" },
      { name: "Photography", translationKey: "photography" },
      { name: "Product Photo", translationKey: "productPhotography" },
      { name: "Photo Editing", translationKey: "photoEditing" },
      { name: "Presentations", translationKey: "presentationDesign" },
      { name: "Infographics", translationKey: "infographicDesign" },
      { name: "Print", translationKey: "printDesign" },
      { name: "Packaging", translationKey: "packagingDesign" },
      { name: "Social Media", translationKey: "socialMediaDesign" },
      { name: "Email", translationKey: "emailDesign" },
      { name: "Banner Ads", translationKey: "bannerAdsDesign" },
    ],
  },
  {
    name: "Writing & Translation",
    translationKey: "writingAndTranslation",
    services: [
      { name: "Content Writing", translationKey: "contentWriting" },
      { name: "Copywriting", translationKey: "copywriting" },
      { name: "Technical Writing", translationKey: "technicalWriting" },
      { name: "Creative Writing", translationKey: "creativeWriting" },
      { name: "Grant Writing", translationKey: "grantWriting" },
      { name: "Translation", translationKey: "translation" },
      { name: "Localization", translationKey: "localization" },
      { name: "Interpretation", translationKey: "interpretation" },
      { name: "Proofreading", translationKey: "proofreadingAndEditing" },
      { name: "Transcription", translationKey: "transcription" },
      { name: "Resume", translationKey: "resumeWriting" },
      { name: "Cover Letters", translationKey: "coverLetters" },
      { name: "LinkedIn", translationKey: "linkedinProfiles" },
      { name: "Blog", translationKey: "blogWriting" },
      { name: "Articles", translationKey: "articleWriting" },
      { name: "Press Releases", translationKey: "pressReleases" },
      { name: "Product Descriptions", translationKey: "productDescriptions" },
      { name: "Scriptwriting", translationKey: "scriptwriting" },
      { name: "Podcast", translationKey: "podcastWriting" },
      { name: "Speeches", translationKey: "speechWriting" },
    ],
  },
  {
    name: "Sales & Marketing",
    translationKey: "digitalMarketing",
    services: [
      { name: "Social Media Marketing", translationKey: "socialMediaMarketing" },
      { name: "SEO & SEM", translationKey: "seoAndSem" },
      { name: "Content Marketing", translationKey: "contentMarketing" },
      { name: "Email Marketing", translationKey: "emailMarketing" },
      { name: "Digital Marketing", translationKey: "digitalMarketing" },
      { name: "Facebook Ads", translationKey: "facebookAdvertising" },
      { name: "Instagram", translationKey: "instagramMarketing" },
      { name: "Twitter", translationKey: "twitterMarketing" },
      { name: "LinkedIn", translationKey: "linkedinMarketing" },
      { name: "TikTok", translationKey: "tiktokMarketing" },
      { name: "YouTube", translationKey: "youtubeMarketing" },
      { name: "Google Ads", translationKey: "googleAds" },
      { name: "Display Ads", translationKey: "displayAdvertising" },
      { name: "Influencer", translationKey: "influencerMarketing" },
      { name: "Affiliate", translationKey: "affiliateMarketing" },
      { name: "Lead Generation", translationKey: "leadGeneration" },
      { name: "Sales Funnels", translationKey: "salesFunnelSetup" },
      { name: "Marketing Strategy", translationKey: "marketingStrategy" },
      { name: "Market Research", translationKey: "marketResearch" },
      { name: "Competitor Analysis", translationKey: "competitorAnalysis" },
    ],
  },
  {
    name: "Business & Management",
    translationKey: "businessConsulting",
    services: [
      { name: "Virtual Assistant", translationKey: "virtualAssistant" },
      { name: "Data Entry", translationKey: "dataEntry" },
      { name: "Project Management", translationKey: "projectManagement" },
      { name: "Business Consulting", translationKey: "businessConsulting" },
      { name: "Business Strategy", translationKey: "businessStrategy" },
      { name: "Business Plans", translationKey: "businessPlans" },
      { name: "Financial Planning", translationKey: "financialPlanning" },
      { name: "Accounting", translationKey: "accounting" },
      { name: "Bookkeeping", translationKey: "bookkeeping" },
      { name: "Tax Consulting", translationKey: "taxConsulting" },
      { name: "HR Consulting", translationKey: "hrConsulting" },
      { name: "Recruiting", translationKey: "recruiting" },
      { name: "Career Counseling", translationKey: "careerCounseling" },
      { name: "Legal Consulting", translationKey: "legalConsulting" },
      { name: "Contract Law", translationKey: "contractLaw" },
      { name: "Corporate Law", translationKey: "corporateLaw" },
      { name: "Intellectual Property", translationKey: "intellectualProperty" },
      { name: "Engineering", translationKey: "engineeringAndArchitecture" },
      { name: "3D Modeling", translationKey: "threeDModeling" },
      { name: "CAD", translationKey: "cadDesign" },
    ],
  },
  {
    name: "Customer Service",
    translationKey: "customerService",
    services: [
      { name: "Customer Support", translationKey: "customerSupport" },
      { name: "Email Support", translationKey: "emailSupport" },
      { name: "Phone Support", translationKey: "phoneSupport" },
      { name: "Live Chat", translationKey: "liveChatSupport" },
      { name: "Technical Support", translationKey: "technicalSupport" },
      { name: "Community Management", translationKey: "communityManagement" },
      { name: "Order Processing", translationKey: "orderProcessing" },
      { name: "Returns & Refunds", translationKey: "returnsAndRefunds" },
    ],
  },
  {
    name: "Music & Audio",
    translationKey: "musicAndAudio",
    services: [
      { name: "Voice Over", translationKey: "voiceOver" },
      { name: "Music Production", translationKey: "musicProduction" },
      { name: "Audio Editing", translationKey: "audioEditing" },
      { name: "Mixing & Mastering", translationKey: "mixingAndMastering" },
      { name: "Podcast Production", translationKey: "podcastProduction" },
      { name: "Sound Design", translationKey: "soundDesign" },
      { name: "Audio Ads", translationKey: "audioAdsProduction" },
      { name: "Jingles", translationKey: "jinglesAndDrops" },
    ],
  },
  {
    name: "AI Services",
    translationKey: "aiAndMachineLearning",
    services: [
      { name: "AI Development", translationKey: "aiDevelopment" },
      { name: "Chatbots", translationKey: "chatbotDevelopment" },
      { name: "AI Integration", translationKey: "aiIntegration" },
      { name: "Prompt Engineering", translationKey: "promptEngineering" },
      { name: "AI Content", translationKey: "aiContentCreation" },
      { name: "AI Images", translationKey: "aiImageGeneration" },
      { name: "AI Video", translationKey: "aiVideoCreation" },
      { name: "Machine Learning", translationKey: "machineLearningDevelopment" },
      { name: "Deep Learning", translationKey: "deepLearning" },
      { name: "Neural Networks", translationKey: "neuralNetworks" },
    ],
  },
];

export default function FreelanceWorkPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Development & IT");

  const filteredProjects = useMemo(() => {
    let filtered = mockProjects;
    
    if (selectedService) {
      filtered = filtered.filter(project => 
        project.skills.some(skill => 
          skill.toLowerCase().includes(selectedService.toLowerCase()) ||
          skill === selectedService
        ) ||
        project.title.toLowerCase().includes(selectedService.toLowerCase()) ||
        project.description.toLowerCase().includes(selectedService.toLowerCase())
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [selectedService, searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-10 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2" suppressHydrationWarning>{t('freelanceWorkOnline')}</h1>
            <p className="text-muted-foreground text-sm md:text-base" suppressHydrationWarning>{t('remoteServices')}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with Services */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 justify-center">
                    <BriefcaseIcon className="h-5 w-5" />
                    {t('servicesList')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {serviceCategories.map((category) => (
                    <div key={category.translationKey}>
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors text-left font-medium"
                      >
                        <span>{t(category.translationKey)}</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedCategory === category.name && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.services.map((service) => (
                            <button
                              key={service.translationKey}
                              onClick={() => {
                                setSelectedService(service.translationKey);
                              }}
                              className={`block w-full text-left p-2 rounded-md text-sm transition-colors ${
                                selectedService === service.translationKey
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              {t(service.translationKey)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {selectedService && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedService("");
                      }}
                      className="w-full mt-2"
                    >
                      Clear Filter
                    </Button>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Main Content - Projects List */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="relative max-w-xl">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Available Projects</h2>
                <p className="text-sm text-muted-foreground">{filteredProjects.length} projects found</p>
              </div>

              {filteredProjects.length === 0 ? (
                <Card className="max-w-md mx-auto">
                  <CardContent className="py-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn&apos;t find any projects matching your search
                    </p>
                    <Button onClick={() => { setSearchQuery(''); setSelectedService(''); }}>Clear Filters</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge variant="secondary" className="sm:flex-shrink-0">{project.budget}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>

                        {project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <MapPinIcon className="mr-1 h-3.5 w-3.5" />
                            {project.location}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 h-3.5 w-3.5" />
                            Posted {project.posted}
                          </div>
                          <div className="flex items-center">
                            <DollarSignIcon className="mr-1 h-3.5 w-3.5" />
                            {project.status}
                          </div>
                          <div className="flex items-center">
                            <BriefcaseIcon className="mr-1 h-3.5 w-3.5" />
                            {project.proposals} {t('proposals')}
                          </div>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button className="w-full sm:w-auto">Submit Proposal</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
