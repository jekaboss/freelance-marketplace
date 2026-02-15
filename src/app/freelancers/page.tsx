"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, StarIcon, AwardIcon, MessageCircleIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from "react";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-8 px-4 flex-grow">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t('freelancers')}</h1>
          <p className="text-muted-foreground">Discover talented professionals for your project</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
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
                    <select className="w-full p-2 border rounded-md">
                      <option>All Locations</option>
                      <option>North America</option>
                      <option>Europe</option>
                      <option>Asia</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>All Rates</option>
                      <option>$10 - $25/hr</option>
                      <option>$25 - $50/hr</option>
                      <option>$50 - $100/hr</option>
                      <option>$100+/hr</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>All Levels</option>
                      <option>Entry Level</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Available Freelancers</h2>
                <p className="text-sm text-muted-foreground">{filteredFreelancers.length} freelancers found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div>
                          <CardTitle>{freelancer.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{freelancer.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {freelancer.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="outline">+{freelancer.skills.length - 3} more</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StarIcon className="fill-yellow-400 text-yellow-400 mr-1 h-4 w-4" />
                          <span className="text-sm font-medium">{freelancer.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({freelancer.reviews} reviews)</span>
                        </div>
                        <span className="text-sm font-semibold">{freelancer.hourlyRate}</span>
                      </div>

                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <MapPinIcon className="mr-1 h-4 w-4" />
                        {freelancer.location}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <MessageCircleIcon className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <Button className="flex-1">
                        <AwardIcon className="mr-2 h-4 w-4" />
                        Hire
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-8">
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
