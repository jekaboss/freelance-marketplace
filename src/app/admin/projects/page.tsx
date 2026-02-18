"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, EyeIcon, RadiationIcon, LogOutIcon, BanIcon, CheckCircleIcon, TrashIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";
import { useToast } from "@/components/toast-provider";

type ApiProject = {
  id: number;
  title: string;
  description: string;
  budget?: number | null;
  status?: string | null;
  createdAt?: string;
  created_at?: string;
  client?: { id: number; email?: string; fullName?: string };
  client_id?: number;
};

type ProjectRow = {
  id: number;
  title: string;
  client: string;
  status: string;
  budget: string;
  posted: string;
  bids: number;
  skills: string[];
};

export default function AdminProjectsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const { token, apiMode } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"title" | "client" | "status">("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);
  const [editProject, setEditProject] = useState<ProjectRow | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.push('/admin/login');
    }
  }, [mounted, isAdmin, router]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortMap = { title: "title", client: "client", status: "status" } as const;
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy: sortMap[sortField],
          sortDir: sortDir.toUpperCase(),
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        const { data } = await apiRequest<any>(`/projects?${params.toString()}`, { token }, apiMode);
        const items = Array.isArray(data) ? data : data.items || [];
        const mapped = items.map((project: ApiProject) => ({
          id: project.id,
          title: project.title,
          client: project.client?.fullName || project.client?.email || (project.client_id ? `Client #${project.client_id}` : "Client"),
          status: project.status || "open",
          budget: project.budget ? `$${project.budget}` : "Negotiable",
          posted: project.createdAt || project.created_at || "-",
          bids: 0,
          skills: [],
        }));
        setProjects(mapped);
        setTotal(Array.isArray(data) ? mapped.length : data.total || mapped.length);
      } catch {
        setError(t("errorLoadFailed"));
        setProjects([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [token, apiMode, page, sortField, sortDir, searchQuery, t]);

  const filteredProjects = useMemo(() => projects, [projects]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagedProjects = filteredProjects;

  const handleStatusToggle = useCallback(async (project: ProjectRow) => {
    if (!token) {
      return;
    }
    const nextStatus = project.status === "open" ? "in_progress" : "open";
    try {
      await apiRequest(`/projects/${project.id}`, { method: "PATCH", token, body: { status: nextStatus } }, apiMode);
      setProjects((prev) => prev.map((item) => item.id === project.id ? { ...item, status: nextStatus } : item));
      showToast(t("success"), "success");
    } catch {
      alert(t("errorUpdateFailed"));
      showToast(t("errorUpdateFailed"), "error");
    }
  }, [token, apiMode, t, showToast]);

  const handleDelete = useCallback(async (id: number) => {
    if (!token) {
      return;
    }
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) {
      return;
    }
    try {
      await apiRequest(`/projects/${id}`, { method: "DELETE", token }, apiMode);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      showToast(t("success"), "success");
    } catch {
      alert(t("errorDeleteFailed"));
      showToast(t("errorDeleteFailed"), "error");
    }
  }, [token, apiMode, t, showToast]);

  const openEdit = useCallback((project: ProjectRow) => {
    setEditProject(project);
    setEditTitle(project.title);
    setEditBudget(project.budget.replace("$", ""));
    setEditStatus(project.status);
    setEditError(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!token || !editProject) {
      return;
    }
    setEditError(null);
    if (!editTitle.trim()) {
      setEditError(t("errorRequired"));
      return;
    }
    const budgetValue = editBudget ? Number(editBudget) : undefined;
    if (editBudget && Number.isNaN(budgetValue)) {
      setEditError(t("errorBudgetNumber"));
      return;
    }
    setSaving(true);
    try {
      await apiRequest(
        `/projects/${editProject.id}`,
        { method: "PATCH", token, body: { title: editTitle, budget: budgetValue, status: editStatus || "open" } },
        apiMode
      );
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editProject.id
            ? { ...project, title: editTitle, budget: budgetValue ? `$${budgetValue}` : "Negotiable", status: editStatus || "open" }
            : project
        )
      );
      showToast(t("success"), "success");
      setEditProject(null);
    } catch {
      setEditError(t("errorUpdateFailed"));
      showToast(t("errorUpdateFailed"), "error");
    } finally {
      setSaving(false);
    }
  }, [token, editProject, editTitle, editBudget, editStatus, apiMode, t, showToast]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex flex-1">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <StalkerSidebar />
        </div>
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <StalkerSidebar />
        </div>

        <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 relative z-10 flex justify-center w-full">
          <div className="w-full max-w-7xl">
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  PROJECT CONTROL
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  <span className="hidden sm:inline">Monitor and manage zone projects</span>
                </p>
              </div>
              <Button
                onClick={logoutAdmin}
                variant="outline"
                className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text text-sm"
              >
                <LogOutIcon className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Exit Zone</span>
              </Button>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-3 md:p-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 text-stalker-dark">
                <span className="text-lg md:text-xl">Projects List</span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <select
                    className="w-full sm:w-36 lg:w-44 p-2 border rounded-md bg-stalker-dark text-stalker-text border-stalker-border text-sm"
                    value={`${sortField}:${sortDir}`}
                    onChange={(e) => {
                      const [field, dir] = e.target.value.split(":") as ["title" | "client" | "status", "asc" | "desc"];
                      setSortField(field);
                      setSortDir(dir);
                      setPage(1);
                    }}
                  >
                    <option value="title:asc">Title A-Z</option>
                    <option value="title:desc">Title Z-A</option>
                    <option value="client:asc">Client A-Z</option>
                    <option value="client:desc">Client Z-A</option>
                    <option value="status:asc">Status A-Z</option>
                    <option value="status:desc">Status Z-A</option>
                  </select>
                  <div className="relative w-full sm:w-40 lg:w-64">
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-full py-1.5 md:py-2 bg-stalker-dark text-stalker-text border-stalker-border h-9"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                  </div>
                </div>
              </CardTitle>
            </div>
            <CardContent className="pt-4 md:pt-6">
              {loading && <p className="text-stalker-muted">Loading...</p>}
              {error && <p className="text-stalker-red">{error}</p>}
              <div className="overflow-x-auto rounded-lg border border-stalker-border -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full min-w-[550px] md:min-w-0">
                  <thead className="bg-stalker-border">
                    <tr>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 rounded-tl-lg text-stalker-green text-sm">ID</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm">Title</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm hidden sm:table-cell">Client</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm">Status</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm hidden md:table-cell">Budget</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm hidden lg:table-cell">Bids</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 rounded-tr-lg text-stalker-green text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProjects.map((project, index) => (
                      <tr key={project.id} className={`border-b border-stalker-border ${index % 2 === 0 ? 'bg-stalker-dark' : 'bg-stalker-darker'} hover:bg-stalker-card transition-colors`}>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm">{project.id}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 font-medium text-stalker-green text-sm">{project.title}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm hidden sm:table-cell truncate max-w-[100px]">{project.client}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <Badge
                            variant={project.status === 'open' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'}
                            className={`text-xs ${project.status === 'open' ? 'bg-stalker-green text-stalker-dark' : project.status === 'completed' ? 'bg-stalker-blue text-stalker-dark' : 'bg-stalker-border text-stalker-text'}`}
                          >
                            {project.status}
                          </Badge>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm hidden md:table-cell">{project.budget}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm hidden lg:table-cell">{project.bids}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <div className="flex space-x-1 md:space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 w-8 p-0">
                                  <EyeIcon className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-stalker-card border-stalker-border text-stalker-text max-w-[95vw] md:max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-stalker-green text-xl">Project Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-stalker-green">Project Information</h3>
                                    <p className="text-sm"><span className="text-stalker-muted">ID:</span> {project.id}</p>
                                    <p className="text-sm"><span className="text-stalker-muted">Title:</span> {project.title}</p>
                                    <p className="text-sm"><span className="text-stalker-muted">Client:</span> {project.client}</p>
                                    <p className="text-sm"><span className="text-stalker-muted">Status:</span> {project.status}</p>
                                    <p className="text-sm"><span className="text-stalker-muted">Posted:</span> {project.posted}</p>
                                    <p className="text-sm"><span className="text-stalker-muted">Budget:</span> {project.budget}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-stalker-green">Project Details</h3>
                                    <p className="text-sm"><span className="text-stalker-muted">Bids:</span> {project.bids}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-stalker-border">
                                  <Button variant="outline" className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10 text-sm" onClick={() => handleStatusToggle(project)}>
                                    {project.status === 'open' ? (
                                      <>
                                        <BanIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                        <span className="hidden sm:inline">Deactivate</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircleIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                        <span className="hidden sm:inline">Activate</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 px-2 text-xs" onClick={() => handleStatusToggle(project)}>
                              {project.status === 'open' ? (
                                <>
                                  <BanIcon className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Activate</span>
                                </>
                              )}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 px-2 text-xs" onClick={() => openEdit(project)}>
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-stalker-card border-stalker-border text-stalker-text max-w-[95vw] md:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-stalker-green text-xl">Edit Project</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {editError && <p className="text-sm text-stalker-red">{editError}</p>}
                                  <div className="space-y-2">
                                    <label className="text-sm">Title</label>
                                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm">Budget</label>
                                    <Input value={editBudget} onChange={(e) => setEditBudget(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm">Status</label>
                                    <select className="w-full p-2 border rounded-md" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                      <option value="open">Open</option>
                                      <option value="in_progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleSaveEdit} disabled={saving} className="text-sm">
                                      {saving ? "..." : "Save"}
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditProject(null)} className="text-sm">Cancel</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 w-8 p-0" onClick={() => handleDelete(project.id)}>
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-sm text-stalker-muted">
                <span className="text-xs sm:text-sm">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-xs sm:text-sm">Prev</Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-xs sm:text-sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

