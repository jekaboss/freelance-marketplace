"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from 'react-i18next';
import { CameraIcon, CalendarIcon, MapPinIcon, DollarSignIcon, StarIcon, ExternalLinkIcon } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { apiRequest, getApiBase, getProvidersForMode } from "@/lib/api-client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApiUser = {
  id: number;
  email: string;
  fullName?: string;
  full_name?: string;
  role: "client" | "freelancer" | "admin";
};

type ApiProject = {
  id: number;
  title: string;
  description: string;
  budget?: number | null;
  status?: string | null;
  createdAt?: string;
  created_at?: string;
  link?: string | null;
  imageUrl?: string | null;
};

type ApiFreelancer = {
  id: number;
  user_id?: number;
  title: string;
  bio?: string | null;
  skills?: string[] | null;
  hourly_rate?: number | null;
  hourlyRate?: number | null;
  location?: string | null;
};

// Функції для роботи з localStorage в демо-режимі
const getDemoAvatar = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('demo-admin-avatar');
};

const setDemoAvatar = (url: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('demo-admin-avatar', url);
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { token, apiMode, isAuthenticated, updateUserAvatar, isHydrated, user: authUser } = useAuth();
  const { showToast } = useToast();

  const [user, setUser] = useState<ApiUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [freelancerProfile, setFreelancerProfile] = useState<ApiFreelancer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [freelancerTitle, setFreelancerTitle] = useState("");
  const [freelancerBio, setFreelancerBio] = useState("");
  const [freelancerSkills, setFreelancerSkills] = useState("");
  const [freelancerRate, setFreelancerRate] = useState("");
  const [freelancerLocation, setFreelancerLocation] = useState("");
  const [freelancerError, setFreelancerError] = useState<string | null>(null);

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Перевірка чи це демо-режим (адмін)
  const isDemoMode = token?.startsWith('admin-token-');

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.fullName || user.full_name || user.email;
  }, [user]);

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Демо-дані для адміна
  const demoProjects: ApiProject[] = [
    { id: 1, title: "E-commerce Website", description: "Full-stack e-commerce platform", budget: 5000, status: "completed", createdAt: "2024-01-15" },
    { id: 2, title: "Mobile App UI", description: "iOS and Android app design", budget: 3000, status: "in_progress", createdAt: "2024-02-20" },
  ];

  useEffect(() => {
    // Демо-режим для адміна
    if (isDemoMode) {
      setUser({ id: 0, email: 'admin@localhost', role: 'admin', fullName: 'Administrator' });
      setProfileName('Administrator');
      setProfileEmail('admin@localhost');
      setProjects(demoProjects);
      // Завантажуємо збережену аватарку з localStorage
      const savedAvatar = getDemoAvatar();
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
        updateUserAvatar(savedAvatar);
      }
      setLoadingUser(false);
      return;
    }

    const loadProfile = async () => {
      if (!token) return;
      setLoadingUser(true);
      setError(null);
      try {
        const { data } = await apiRequest<ApiUser>("/auth/me", { token }, apiMode);
        setUser(data);
        setProfileName(data.fullName || data.full_name || "");
        setProfileEmail(data.email);
        
        const avatar = (data as any).avatarUrl || (data as any).avatar_url || null;
        if (avatar) {
          const providers = getProvidersForMode(apiMode);
          const apiBase = getApiBase(providers[0]);
          const baseRoot = apiBase.replace(/\/api$/, "");
          const fullAvatarUrl = `${baseRoot}${avatar}`;
          setAvatarPreview(fullAvatarUrl);
          updateUserAvatar(fullAvatarUrl);
        }

        const id = data.id;
        const projectsResponse = await apiRequest<any>(`/projects?clientId=${id}&client_id=${id}`, { token }, apiMode);
        const projectItems = Array.isArray(projectsResponse.data) ? projectsResponse.data : projectsResponse.data.items || [];
        setProjects(projectItems);

        if (data.role === "freelancer") {
          const freelancersResponse = await apiRequest<any>(`/freelancers?userId=${id}&user_id=${id}`, { token }, apiMode);
          const freelancerItems = Array.isArray(freelancersResponse.data) ? freelancersResponse.data : freelancersResponse.data.items || [];
          const profile = freelancerItems[0] || null;
          setFreelancerProfile(profile);
          if (profile) {
            setFreelancerTitle(profile.title || "");
            setFreelancerBio(profile.bio || "");
            setFreelancerSkills((profile.skills || []).join(", "));
            setFreelancerRate(String(profile.hourlyRate ?? profile.hourly_rate ?? ""));
            setFreelancerLocation(profile.location || "");
          }
        }
      } catch {
        setError(t("errorLoadFailed"));
      } finally {
        setLoadingUser(false);
      }
    };

    loadProfile();
  }, [token, apiMode, isDemoMode, updateUserAvatar, t]);

  const handleProfileSave = async () => {
    if (isDemoMode) {
      showToast("Demo mode - profile saved locally", "success");
      setUser(prev => prev ? { ...prev, fullName: profileName, email: profileEmail } : prev);
      return;
    }
    if (!token || !user) return;
    setProfileError(null);
    if (!profileName.trim()) { setProfileError(t("errorRequired")); return; }
    if (!profileEmail.trim() || !profileEmail.includes("@")) { setProfileError(t("errorInvalidEmail")); return; }
    try {
      await apiRequest(`/users/${user.id}`, { method: "PATCH", token, body: { fullName: profileName, full_name: profileName, email: profileEmail } }, apiMode);
      setUser(prev => prev ? { ...prev, fullName: profileName, email: profileEmail } : prev);
      showToast(t("success"), "success");
    } catch {
      setProfileError(t("errorUpdateFailed"));
      showToast(t("errorUpdateFailed"), "error");
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Створюємо URL для прев'ю
    const objectUrl = URL.createObjectURL(file);
    
    if (isDemoMode) {
      // Зберігаємо в localStorage для демо-режиму
      setDemoAvatar(objectUrl);
      setAvatarPreview(objectUrl);
      updateUserAvatar(objectUrl);
      showToast("Avatar uploaded (demo mode)", "success");
      return;
    }
    
    if (!token || !user) return;
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      const providers = getProvidersForMode(apiMode);
      const apiBase = getApiBase(providers[0]);
      const res = await fetch(`${apiBase}/users/${user.id}/avatar`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) {
        const data = await res.json();
        const url = data?.url ? `${apiBase.replace(/\/api$/, "")}${data.url}` : objectUrl;
        setAvatarPreview(url);
        updateUserAvatar(url);
        showToast(t("success"), "success");
      }
    } catch { showToast(t("errorUpdateFailed"), "error"); }
  };

  const handleAvatarDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsAvatarDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.getElementById("avatar-upload") as HTMLInputElement;
      if (input) { input.files = dataTransfer.files; handleAvatarChange({ target: { files: dataTransfer.files } } as any); }
    }
  };

  const handleProjectSubmit = async () => {
    if (isDemoMode) {
      const newProject: ApiProject = { id: Date.now(), title: projectTitle, description: projectDescription, budget: projectBudget ? Number(projectBudget) : null, status: "open", createdAt: new Date().toISOString() };
      setProjects(prev => [newProject, ...prev]);
      setProjectTitle(""); setProjectDescription(""); setProjectBudget(""); setEditingProjectId(null);
      showToast("Demo: Project created", "success");
      return;
    }
    if (!token || !user) return;
    if (!projectTitle || !projectDescription) { setProjectError(t("errorRequired")); return; }
    const budgetNumber = projectBudget ? Number(projectBudget) : undefined;
    setProjectError(null);
    try {
      if (editingProjectId) {
        const { data } = await apiRequest<ApiProject>(`/projects/${editingProjectId}`, { method: "PATCH", token, body: { title: projectTitle, description: projectDescription, budget: budgetNumber } }, apiMode);
        setProjects(prev => prev.map(p => p.id === editingProjectId ? data : p));
      } else {
        const { data } = await apiRequest<ApiProject>("/projects", { method: "POST", token, body: { clientId: user.id, client_id: user.id, title: projectTitle, description: projectDescription, budget: budgetNumber } }, apiMode);
        setProjects(prev => [data, ...prev]);
      }
      setProjectTitle(""); setProjectDescription(""); setProjectBudget(""); setEditingProjectId(null);
    } catch { setProjectError(t("errorSaveFailed")); }
  };

  const handleEditProject = (project: ApiProject) => { setEditingProjectId(project.id); setProjectTitle(project.title); setProjectDescription(project.description); setProjectBudget(project.budget ? String(project.budget) : ""); };

  const handleFreelancerSubmit = async () => {
    if (isDemoMode) { showToast("Demo mode", "success"); return; }
    if (!token || !user) return;
    if (!freelancerTitle) { setFreelancerError(t("errorRequired")); return; }
    const rateValue = freelancerRate ? Number(freelancerRate) : undefined;
    setFreelancerError(null);
    const payload = { userId: user.id, user_id: user.id, title: freelancerTitle, bio: freelancerBio, skills: freelancerSkills.split(",").map(s => s.trim()).filter(Boolean), hourlyRate: rateValue, location: freelancerLocation };
    try {
      if (freelancerProfile) {
        const { data } = await apiRequest<ApiFreelancer>(`/freelancers/${freelancerProfile.id}`, { method: "PATCH", token, body: payload }, apiMode);
        setFreelancerProfile(data);
      } else {
        const { data } = await apiRequest<ApiFreelancer>("/freelancers", { method: "POST", token, body: payload }, apiMode);
        setFreelancerProfile(data);
      }
      showToast(t("success"), "success");
    } catch { setFreelancerError(t("errorSaveFailed")); }
  };

  if (!isHydrated) return (<div className="min-h-screen bg-background flex flex-col"><Header /><div className="container py-12 px-4 flex-grow flex items-center justify-center"><p>Loading...</p></div><Footer /></div>);
  if (!isAuthenticated) return (<div className="min-h-screen bg-background flex flex-col"><Header /><div className="container py-12 px-4 flex-grow flex items-center justify-center"><Card className="w-full max-w-md"><CardHeader><CardTitle>Please sign in</CardTitle></CardHeader><CardContent><p className="text-muted-foreground mb-4">You need an account to view your profile.</p><Button asChild className="w-full"><Link href="/login">Go to Login</Link></Button></CardContent></Card></div><Footer /></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <div className="container py-8 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
                <div className={`relative ${isAvatarDragging ? "ring-2 ring-blue-400" : ""}`} onDragOver={e => { e.preventDefault(); setIsAvatarDragging(true); }} onDragLeave={() => setIsAvatarDragging(false)} onDrop={handleAvatarDrop}>
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white dark:border-gray-800">
                    <AvatarImage src={avatarPreview || "/placeholder-avatar.svg"} alt="Profile" className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">{displayName ? displayName.split(" ").map(p => p[0]).join("").slice(0, 2) : "U"}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-background flex items-center justify-center border cursor-pointer"><CameraIcon className="h-4 w-4" /></Label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="mt-4 sm:mt-0 sm:flex-1">
                  <h1 className="text-2xl font-bold">{displayName || "Your Name"}</h1>
                  <div className="flex items-center mt-1 space-x-4">
                    <Badge variant="secondary">{user?.role || "user"}</Badge>
                    <div className="flex items-center text-muted-foreground"><MapPinIcon className="h-4 w-4 mr-1" />{freelancerLocation || "Remote"}</div>
                  </div>
                  <p className="text-muted-foreground mt-4">{freelancerBio || "Complete your profile to get better matches."}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pt-8 border-t">
                <div className="text-center"><div className="text-2xl font-bold text-primary">{projects.length}</div><p className="text-sm text-muted-foreground">Projects Posted</p></div>
                <div className="text-center"><div className="flex items-center justify-center"><StarIcon className="h-5 w-5 text-yellow-500 fill-current" /><span className="text-2xl font-bold text-primary ml-1">4.8</span></div><p className="text-sm text-muted-foreground">Rating</p></div>
              </div>
            </div>
          </Card>

          {loadingUser && <p className="text-muted-foreground mt-4">Loading profile...</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className={`grid w-full ${user?.role === "freelancer" ? "grid-cols-3" : "grid-cols-2"}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              {user?.role === "freelancer" && <TabsTrigger value="settings">Settings</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card className="bg-card/50 backdrop-blur-sm shadow-xl"><CardHeader><CardTitle>About Me</CardTitle></CardHeader><CardContent><div className="space-y-4"><div><Label className="text-sm font-medium">Full Name</Label><p className="text-muted-foreground">{displayName}</p></div><div><Label className="text-sm font-medium">Email</Label><p className="text-muted-foreground">{user?.email}</p></div><div><Label className="text-sm font-medium">Role</Label><p className="text-muted-foreground">{user?.role}</p></div></div></CardContent></Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-6">
              {user?.role !== "freelancer" && (<Card className="bg-card/50 backdrop-blur-sm shadow-xl"><CardHeader><CardTitle>{editingProjectId ? "Edit Project" : "Create Project"}</CardTitle></CardHeader><CardContent className="space-y-4">{projectError && <p className="text-sm text-red-500">{projectError}</p>}<div className="space-y-2"><Label htmlFor="project-title">Title</Label><Input id="project-title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="project-description">Description</Label><textarea id="project-description" className="w-full p-2 border rounded-md min-h-[100px]" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="project-budget">Budget</Label><Input id="project-budget" value={projectBudget} onChange={e => setProjectBudget(e.target.value)} /></div><div className="flex gap-2"><Button onClick={handleProjectSubmit}>{editingProjectId ? "Save Changes" : "Create Project"}</Button>{editingProjectId && <Button variant="outline" onClick={() => setEditingProjectId(null)}>Cancel</Button>}</div></CardContent></Card>)}
              <Card className="bg-card/50 backdrop-blur-sm shadow-xl"><CardHeader><CardTitle>My Projects</CardTitle></CardHeader><CardContent>{projects.length === 0 ? <p className="text-muted-foreground text-center py-8">No projects yet.</p> : <div className="space-y-6">{projects.map(project => (<Card key={project.id} className="hover:shadow-md transition-shadow"><CardHeader><div className="flex justify-between items-start"><CardTitle className="text-lg">{project.title}</CardTitle><Badge variant={project.status === 'completed' ? 'default' : project.status === 'in_progress' ? 'secondary' : 'outline'}>{project.status || "open"}</Badge></div></CardHeader><CardContent><p className="text-muted-foreground mb-4 whitespace-pre-wrap">{project.description}</p><div className="flex items-center text-sm text-muted-foreground mb-2"><DollarSignIcon className="mr-2 h-4 w-4" />{project.budget ? `$${project.budget}` : "Negotiable"}</div><div className="flex items-center text-sm text-muted-foreground"><CalendarIcon className="mr-1 h-4 w-4" />{formatDate(project.createdAt || project.created_at)}</div>{user?.role !== "freelancer" && <div className="mt-4"><Button variant="outline" onClick={() => handleEditProject(project)}>Edit Project</Button></div>}</CardContent></Card>))}</div>}</CardContent></Card>
            </TabsContent>

            {user?.role === "freelancer" && (<TabsContent value="settings" className="space-y-6 mt-6">
              <Card className="bg-card/50 backdrop-blur-sm shadow-xl"><CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader><CardContent><form className="space-y-6" onSubmit={e => { e.preventDefault(); handleProfileSave(); }}>{profileError && <p className="text-sm text-red-500">{profileError}</p>}<div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={profileName} onChange={e => setProfileName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} /></div><Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button></form></CardContent></Card>
              <Card className="bg-card/50 backdrop-blur-sm shadow-xl"><CardHeader><CardTitle>Freelancer Profile</CardTitle></CardHeader><CardContent className="space-y-4">{freelancerError && <p className="text-sm text-red-500">{freelancerError}</p>}<div className="space-y-2"><Label htmlFor="freelancer-title">Title</Label><Input id="freelancer-title" value={freelancerTitle} onChange={e => setFreelancerTitle(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="freelancer-bio">Bio</Label><textarea id="freelancer-bio" className="w-full p-2 border rounded-md min-h-[100px]" value={freelancerBio} onChange={e => setFreelancerBio(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="freelancer-skills">Skills (comma separated)</Label><Input id="freelancer-skills" value={freelancerSkills} onChange={e => setFreelancerSkills(e.target.value)} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="freelancer-rate">Hourly Rate</Label><Input id="freelancer-rate" value={freelancerRate} onChange={e => setFreelancerRate(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="freelancer-location">Location</Label><Input id="freelancer-location" value={freelancerLocation} onChange={e => setFreelancerLocation(e.target.value)} /></div></div><Button onClick={handleFreelancerSubmit}>{freelancerProfile ? "Update Profile" : "Create Profile"}</Button></CardContent></Card>
            </TabsContent>)}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
