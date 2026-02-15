"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

// Define types
type Project = {
  id: number;
  title: string;
  description: string;
  budget: string;
  posted: string;
  status: string;
  skills: string[];
  location: string;
};

type ApiProject = {
  id: number;
  title: string;
  description: string;
  budget?: number | null;
  status?: string | null;
  createdAt?: string;
  created_at?: string;
};

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Full Stack Web Application",
    description: "Looking for a full-stack developer to build a web application with React, Node.js, and PostgreSQL.",
    budget: "$3,000 - $5,000",
    posted: "2 days ago",
    status: "open",
    skills: ["React", "Node.js", "PostgreSQL", "Express"],
    location: "Remote",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Need a creative designer to create a modern UI/UX for a fitness mobile app.",
    budget: "$1,200 - $2,000",
    posted: "1 day ago",
    status: "open",
    skills: ["UI/UX", "Figma", "Prototyping", "User Research"],
    location: "Remote",
  },
];

function formatDate(dateValue?: string) {
  if (!dateValue) {
    return "Recently";
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString();
}

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { apiMode, isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        const { data } = await apiRequest<any>(`/projects?${params.toString()}`, {}, apiMode);
        const items = Array.isArray(data) ? data : data.items || [];
        const mapped = items.map((project: ApiProject) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          budget: project.budget ? `$${project.budget}` : "Negotiable",
          posted: formatDate(project.createdAt || project.created_at),
          status: project.status || "open",
          skills: [],
          location: "Remote",
        }));
        if (mapped.length) {
          setProjects(mapped);
        }
        setTotal(Array.isArray(data) ? mapped.length : data.total || mapped.length);
      } catch {
        setProjects(mockProjects);
        setTotal(mockProjects.length);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [apiMode, page, searchQuery]);

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    if (query) {
      setSearchQuery(query);
      setPage(1);
    }
  }, []);

  const filteredProjects = useMemo(() => projects, [projects]);
  const showNoResults = !loading && filteredProjects.length === 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-8 px-4 flex-grow">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('projects')}</h1>
            <p className="text-muted-foreground">Find the perfect project to showcase your skills</p>
          </div>
          {isAuthenticated && user?.role !== "freelancer" && (
            <Button asChild>
              <Link href="/projects/new">Create Project</Link>
            </Button>
          )}
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
                        placeholder="Search projects..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>All Budgets</option>
                      <option>Under $500</option>
                      <option>$500 - $1,000</option>
                      <option>$1,00 - $2,500</option>
                      <option>$2,500 - $5,000</option>
                      <option>Above $5,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>All Types</option>
                      <option>Fixed Price</option>
                      <option>Hourly</option>
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
                <h2 className="text-xl font-semibold">Available Projects</h2>
                <p className="text-sm text-muted-foreground">{filteredProjects.length} projects found</p>
              </div>

              {showNoResults ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any projects matching "{searchQuery}"
                  </p>
                  <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge variant="secondary">{project.budget}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{project.description}</p>

                        {project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                          <div className="flex items-center">
                            <MapPinIcon className="mr-1 h-4 w-4" />
                            {project.location}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 h-4 w-4" />
                            Posted {project.posted}
                          </div>
                          <div className="flex items-center">
                            <DollarSignIcon className="mr-1 h-4 w-4" />
                            {project.status}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Submit Proposal</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

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
