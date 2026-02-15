"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, EditIcon, TrashIcon, EyeIcon, RadiationIcon, LogOutIcon, BanIcon, CheckCircleIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";
import { useToast } from "@/components/toast-provider";

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

type FreelancerRow = {
  id: number;
  userId?: number;
  name: string;
  profession: string;
  rating: number;
  completedProjects: number;
  location: string;
  hourlyRate: string;
  status: string;
  skills: string[];
};

export default function AdminFreelancersPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const { token, apiMode } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [freelancers, setFreelancers] = useState<FreelancerRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"name" | "profession" | "status">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);
  const [editFreelancer, setEditFreelancer] = useState<FreelancerRow | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  useEffect(() => {
    const loadFreelancers = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortMap = { name: "id", profession: "title", status: "id" } as const;
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy: sortMap[sortField],
          sortDir: sortDir.toUpperCase(),
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        const { data } = await apiRequest<any>(`/freelancers?${params.toString()}`, { token }, apiMode);
        const items = Array.isArray(data) ? data : data.items || [];
        const mapped = items.map((freelancer: ApiFreelancer) => ({
          id: freelancer.id,
          userId: freelancer.user_id,
          name: freelancer.user?.fullName || freelancer.user?.full_name || (freelancer.user_id ? `User #${freelancer.user_id}` : "Freelancer"),
          profession: freelancer.title,
          rating: 4.8,
          completedProjects: 0,
          location: freelancer.location || "Remote",
          hourlyRate: freelancer.hourlyRate || freelancer.hourly_rate ? `$${freelancer.hourlyRate ?? freelancer.hourly_rate}/hr` : "Negotiable",
          status: "Active",
          skills: freelancer.skills || [],
        }));
        setFreelancers(mapped);
        setTotal(Array.isArray(data) ? mapped.length : data.total || mapped.length);
      } catch {
        setError(t("errorLoadFailed"));
        setFreelancers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [token, apiMode, page, sortField, sortDir, searchQuery]);

  const filteredFreelancers = useMemo(() => freelancers, [freelancers]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagedFreelancers = filteredFreelancers;

  const handleDelete = async (id: number) => {
    if (!token) {
      return;
    }
    const confirmed = window.confirm("Delete this freelancer profile?");
    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/freelancers/${id}`, { method: "DELETE", token }, apiMode);
      setFreelancers((prev) => prev.filter((freelancer) => freelancer.id !== id));
      showToast(t("success"), "success");
    } catch {
      alert(t("errorDeleteFailed"));
      showToast(t("errorDeleteFailed"), "error");
    }
  };

  const openEdit = (freelancer: FreelancerRow) => {
    setEditFreelancer(freelancer);
    setEditTitle(freelancer.profession);
    setEditRate(freelancer.hourlyRate.replace("$", "").replace("/hr", ""));
    setEditLocation(freelancer.location);
    setEditSkills(freelancer.skills.join(", "));
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!token || !editFreelancer) {
      return;
    }
    if (!editFreelancer.userId) {
      setEditError(t("errorRequired"));
      return;
    }
    setEditError(null);
    if (!editTitle.trim()) {
      setEditError(t("errorRequired"));
      return;
    }
    const rateValue = editRate ? Number(editRate) : undefined;
    if (editRate && Number.isNaN(rateValue)) {
      setEditError(t("errorHourlyRateNumber"));
      return;
    }
    setSaving(true);
    try {
      await apiRequest(
        `/freelancers/${editFreelancer.id}`,
        { method: "PATCH", token, body: {
          userId: editFreelancer.userId,
          user_id: editFreelancer.userId,
          title: editTitle,
          bio: "",
          skills: editSkills.split(",").map((item) => item.trim()).filter(Boolean),
          hourlyRate: rateValue,
          hourly_rate: rateValue,
          location: editLocation,
        } },
        apiMode
      );
      setFreelancers((prev) =>
        prev.map((item) =>
          item.id === editFreelancer.id
            ? {
                ...item,
                profession: editTitle,
                hourlyRate: rateValue ? `$${rateValue}/hr` : "Negotiable",
                location: editLocation,
                skills: editSkills.split(",").map((s) => s.trim()).filter(Boolean),
              }
            : item
        )
      );
      showToast(t("success"), "success");
      setEditFreelancer(null);
    } catch {
      setEditError(t("errorUpdateFailed"));
      showToast(t("errorUpdateFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <Header />

      <div className="flex flex-1">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <StalkerSidebar />
        </div>

        <div className="flex-1 container py-12 px-4 relative z-10">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  FREELANCER CONTROL
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Monitor and manage zone freelancers
                </p>
              </div>
              <Button
                onClick={logoutAdmin}
                variant="outline"
                className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text"
              >
                <LogOutIcon className="h-4 w-4" />
                Exit Zone
              </Button>
            </div>
          </div>

          <Card className="bg-stalker-card border-stalker-border shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl text-stalker-green">Freelancers List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  className="w-full sm:w-44 p-2 border rounded-md bg-stalker-darker text-stalker-text border-stalker-border"
                  value={`${sortField}:${sortDir}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split(":") as ["name" | "profession" | "status", "asc" | "desc"];
                    setSortField(field);
                    setSortDir(dir);
                    setPage(1);
                  }}
                >
                  <option value="name:asc">Name A-Z</option>
                  <option value="name:desc">Name Z-A</option>
                  <option value="profession:asc">Profession A-Z</option>
                  <option value="profession:desc">Profession Z-A</option>
                  <option value="status:asc">Status A-Z</option>
                  <option value="status:desc">Status Z-A</option>
                </select>
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search freelancers..."
                    className="pl-10 w-full bg-stalker-darker text-stalker-text border-stalker-border"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-stalker-muted">Loading...</p>}
              {error && <p className="text-stalker-red">{error}</p>}
              <div className="overflow-x-auto rounded-lg border border-stalker-border">
                <table className="w-full">
                  <thead className="bg-stalker-border">
                    <tr>
                      <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">ID</th>
                      <th className="text-left py-3 px-4 text-stalker-green">Name</th>
                      <th className="text-left py-3 px-4 text-stalker-green">Profession</th>
                      <th className="text-left py-3 px-4 text-stalker-green">Rating</th>
                      <th className="text-left py-3 px-4 text-stalker-green">Completed Projects</th>
                      <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                      <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedFreelancers.map((freelancer, index) => (
                      <tr key={freelancer.id} className={`border-b border-stalker-border ${index % 2 === 0 ? 'bg-stalker-dark' : 'bg-stalker-darker'} hover:bg-stalker-card transition-colors`}>
                        <td className="py-3 px-4 text-stalker-text">{freelancer.id}</td>
                        <td className="py-3 px-4 font-medium text-stalker-green">{freelancer.name}</td>
                        <td className="py-3 px-4 text-stalker-text">{freelancer.profession}</td>
                        <td className="py-3 px-4 text-stalker-text">{freelancer.rating}</td>
                        <td className="py-3 px-4 text-stalker-text">{freelancer.completedProjects}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={freelancer.status === 'Active' ? 'default' : 'outline'}
                            className={freelancer.status === 'Active' ? 'bg-stalker-green text-stalker-dark' : 'bg-stalker-border text-stalker-text'}
                          >
                            {freelancer.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border">
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-stalker-card border-stalker-border text-stalker-text max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-stalker-green text-2xl">Freelancer Profile</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-stalker-green">Personal Information</h3>
                                    <p><span className="text-stalker-muted">ID:</span> {freelancer.id}</p>
                                    <p><span className="text-stalker-muted">Name:</span> {freelancer.name}</p>
                                    <p><span className="text-stalker-muted">Profession:</span> {freelancer.profession}</p>
                                    <p><span className="text-stalker-muted">Location:</span> {freelancer.location}</p>
                                    <p><span className="text-stalker-muted">Hourly Rate:</span> {freelancer.hourlyRate}</p>
                                    <p><span className="text-stalker-muted">Status:</span> {freelancer.status}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-stalker-green">Professional Details</h3>
                                    <p><span className="text-stalker-muted">Rating:</span> {freelancer.rating}</p>
                                    <p><span className="text-stalker-muted">Completed Projects:</span> {freelancer.completedProjects}</p>
                                    <div className="pt-2">
                                      <h4 className="font-medium text-stalker-green">Skills</h4>
                                      <div className="flex flex-wrap gap-2 pt-2">
                                        {freelancer.skills.map((skill, index) => (
                                          <span key={index} className="bg-stalker-border text-stalker-text px-2 py-1 rounded text-sm">{skill}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4 border-t border-stalker-border">
                                  <Button variant="outline" className="border-stalker-border text-stalker-text hover:bg-stalker-border" onClick={() => alert(`Editing freelancer: ${freelancer.name}`)}>
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" className="border-stalker-red text-stalker-red hover:bg-stalker-red/10" onClick={() => handleDelete(freelancer.id)}>
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border" onClick={() => openEdit(freelancer)}>
                                  <EditIcon className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-stalker-card border-stalker-border text-stalker-text max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-stalker-green text-2xl">Edit Freelancer</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {editError && <p className="text-sm text-stalker-red">{editError}</p>}
                                  <div className="space-y-2">
                                    <label className="text-sm">Title</label>
                                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm">Hourly Rate</label>
                                    <Input value={editRate} onChange={(e) => setEditRate(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm">Location</label>
                                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm">Skills</label>
                                    <Input value={editSkills} onChange={(e) => setEditSkills(e.target.value)} />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleSaveEdit} disabled={saving}>
                                      {saving ? "..." : "Save"}
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditFreelancer(null)}>Cancel</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border" onClick={() => handleDelete(freelancer.id)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${freelancer.status === 'Active'
                                ? 'border-stalker-red text-stalker-red hover:bg-stalker-red/10'
                                : 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                              } transition-colors duration-200`}
                              onClick={() => alert(`Toggling freelancer status: ${freelancer.name}`)}
                            >
                              {freelancer.status === 'Active' ? (
                                <>
                                  <BanIcon className="h-4 w-4 mr-2" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between pt-4 text-sm text-stalker-muted">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
