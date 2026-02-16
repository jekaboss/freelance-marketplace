"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, StarIcon, AwardIcon, MessageCircleIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/components/auth-provider";

type Freelancer = {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  description: string;
  skills: string[];
  location: string;
};

type ApiFreelancer = {
  id: number;
  title: string;
  bio?: string | null;
  skills?: string[] | null;
  hourlyRate?: number | null;
  hourly_rate?: number | null;
  location?: string | null;
  user?: { id: number; fullName?: string; full_name?: string } | null;
  user_id?: number;
};

const mockFreelancers: Freelancer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior Full Stack Developer",
    rating: 4.9,
    reviews: 128,
    hourlyRate: "$60/hr",
    description: "Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. 5+ years in the industry.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    location: "Remote",
  },
  {
    id: 2,
    name: "Maria Garcia",
    title: "UI/UX Designer & Product Designer",
    rating: 4.8,
    reviews: 96,
    hourlyRate: "$50/hr",
    description: "Creative designer specializing in user-centered design. I create intuitive and engaging digital experiences.",
    skills: ["UI/UX", "Figma", "Prototyping", "User Research", "Adobe XD"],
    location: "Remote",
  },
];

function toRate(value?: number | null) {
  if (!value) {
    return "Negotiable";
  }
  return `$${value}/hr`;
}

export default function FreelancersPage() {
  const { t } = useTranslation();
  const { apiMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>(mockFreelancers);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    const loadFreelancers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        const { data } = await apiRequest<any>(`/freelancers?${params.toString()}`, {}, apiMode);
        const items = Array.isArray(data) ? data : data.items || [];
        const mapped = items.map((freelancer: ApiFreelancer) => {
          const displayName = freelancer.user?.fullName || freelancer.user?.full_name || (freelancer.user_id ? `User #${freelancer.user_id}` : "Freelancer");
          return {
            id: freelancer.id,
            name: displayName,
            title: freelancer.title,
            rating: 4.8,
            reviews: 0,
            hourlyRate: toRate(freelancer.hourlyRate ?? freelancer.hourly_rate),
            description: freelancer.bio || "",
            skills: freelancer.skills || [],
            location: freelancer.location || "Remote",
          };
        });
        if (mapped.length) {
          setFreelancers(mapped);
        }
        setTotal(Array.isArray(data) ? mapped.length : data.total || mapped.length);
      } catch {
        setFreelancers(mockFreelancers);
        setTotal(mockFreelancers.length);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [apiMode, page, searchQuery]);

  const filteredFreelancers = useMemo(() => freelancers, [freelancers]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-6 md:py-8 px-4 flex-grow">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{t('freelancers')}</h1>
          <p className="text-muted-foreground text-sm md:text-base">Discover talented professionals for your project</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Input
                        placeholder="Search freelancers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Locations</option>
                      <option>North America</option>
                      <option>Europe</option>
                      <option>Asia</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Rates</option>
                      <option>$10 - $25/hr</option>
                      <option>$25 - $50/hr</option>
                      <option>$50 - $100/hr</option>
                      <option>$100+/hr</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Levels</option>
                      <option>Entry Level</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Freelancers List */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-semibold">Available Freelancers</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="md:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{filteredFreelancers.length} freelancers found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 md:w-16 md:h-16 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base md:text-lg truncate">{freelancer.name}</CardTitle>
                          <p className="text-sm text-muted-foreground truncate">{freelancer.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 md:mb-4 text-sm line-clamp-2">{freelancer.description}</p>

                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                        {freelancer.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{freelancer.skills.length - 3} more</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StarIcon className="fill-yellow-400 text-yellow-400 mr-1 h-3.5 w-3.5 md:h-4 md:w-4" />
                          <span className="text-sm font-medium">{freelancer.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({freelancer.reviews})</span>
                        </div>
                        <span className="text-sm font-semibold">{freelancer.hourlyRate}</span>
                      </div>

                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <MapPinIcon className="mr-1 h-3.5 w-3.5" />
                        {freelancer.location}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-sm">
                        <MessageCircleIcon className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                        Contact
                      </Button>
                      <Button className="flex-1 text-sm">
                        <AwardIcon className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                        Hire
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                    {page}
                  </Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
