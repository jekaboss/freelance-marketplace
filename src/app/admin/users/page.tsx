"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, EditIcon, TrashIcon, EyeIcon, RadiationIcon, BanIcon, CheckCircleIcon, LogOutIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiRequest, getApiBase, getProvidersForMode } from "@/lib/api-client";
import { useToast } from "@/components/toast-provider";

type ApiUser = {
  id: number;
  email: string;
  fullName?: string;
  full_name?: string;
  role: string;
  avatarUrl?: string;
  avatar_url?: string;
  portfolioUrls?: string[];
  portfolio_urls?: string[];
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isBlocked?: boolean;
  joined?: string;
  avatar?: string | null;
  portfolio?: string[];
  projectsPosted?: number;
  totalSpent?: string;
  projectsCompleted?: number;
  earnings?: string;
  skills?: string[];
  lastSeen?: string | null;
  isOnline?: boolean;
};

function getUserStatus(user: UserRow): { color: string; bgColor: string; text: string; icon: string } {
  if (user.isOnline) {
    return { color: 'text-stalker-green', bgColor: 'bg-stalker-green', text: 'Online', icon: '🟢' };
  }
  if (!user.lastSeen) {
    return { color: 'text-stalker-muted', bgColor: 'bg-stalker-muted', text: 'Unknown', icon: '⚪' };
  }
  const lastSeenDate = new Date(user.lastSeen);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
  if (diffMinutes < 5) {
    return { color: 'text-stalker-yellow', bgColor: 'bg-stalker-yellow', text: 'Recently', icon: '🟡' };
  } else if (diffMinutes < 60) {
    return { color: 'text-stalker-orange', bgColor: 'bg-stalker-orange', text: 'Away', icon: '🟠' };
  } else {
    return { color: 'text-stalker-red', bgColor: 'bg-stalker-red', text: 'Offline', icon: '🔴' };
  }
}

// Демо-дані
const demoUsers: UserRow[] = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "freelancer", status: "Active", avatar: null, portfolio: [], lastSeen: null, isOnline: true, projectsCompleted: 15, earnings: "$4,500" },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", role: "client", status: "Active", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 30*60000).toISOString(), isOnline: false, projectsPosted: 8, totalSpent: "$12,000" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com", role: "freelancer", status: "Active", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 2*3600000).toISOString(), isOnline: false, projectsCompleted: 23, earnings: "$8,200" },
  { id: 4, name: "David Chen", email: "david@example.com", role: "client", status: "Blocked", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 24*3600000).toISOString(), isOnline: false, projectsPosted: 3, totalSpent: "$2,500" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "freelancer", status: "Active", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 5*60000).toISOString(), isOnline: true, projectsCompleted: 42, earnings: "$15,800" },
  { id: 6, name: "Michael Brown", email: "michael@example.com", role: "client", status: "Active", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 3600000).toISOString(), isOnline: false, projectsPosted: 12, totalSpent: "$25,000" },
  { id: 7, name: "Sarah Davis", email: "sarah@example.com", role: "freelancer", status: "Active", avatar: null, portfolio: [], lastSeen: null, isOnline: true, projectsCompleted: 31, earnings: "$11,400" },
  { id: 8, name: "James Miller", email: "james@example.com", role: "client", status: "Active", avatar: null, portfolio: [], lastSeen: new Date(Date.now() - 48*3600000).toISOString(), isOnline: false, projectsPosted: 5, totalSpent: "$8,900" },
];

export default function AdminUsersPage() {
  const { logoutAdmin } = useAdmin();
  const { token, apiMode, isHydrated: authHydrated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"name" | "email" | "role">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);

  const baseRoot = useMemo(() => {
    const providers = getProvidersForMode(apiMode);
    const apiBase = getApiBase(providers[0]);
    return apiBase.replace(/\/api$/, "");
  }, [apiMode]);

  const isDemoMode = token?.startsWith('admin-token-');

  useEffect(() => {
    if (!authHydrated) return;
    
    if (isDemoMode) {
      setUsers(demoUsers);
      setTotal(demoUsers.length);
      setLoading(false);
      return;
    }
    
    if (!token) return;
    
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortMap = { name: "fullName", email: "email", role: "role" } as const;
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy: sortMap[sortField],
          sortDir: sortDir.toUpperCase(),
        });
        if (searchQuery) params.set("search", searchQuery);
        
        const { data } = await apiRequest<any>(`/users?${params.toString()}`, { token }, apiMode);
        const items = Array.isArray(data) ? data : data.items || [];
        
        const mapped = items.map((user: ApiUser) => ({
          id: user.id,
          name: user.fullName || user.full_name || user.email,
          email: user.email,
          role: user.role,
          status: "Active",
          joined: "-",
          avatar: user.avatarUrl || user.avatar_url || null,
          portfolio: user.portfolioUrls || user.portfolio_urls || [],
          lastSeen: null,
          isOnline: false,
        }));
        setUsers(mapped);
        setTotal(Array.isArray(data) ? mapped.length : data.total || mapped.length);
      } catch (err) {
        setError(t("errorLoadFailed"));
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, apiMode, page, sortField, sortDir, searchQuery, t, authHydrated, isDemoMode]);

  const filteredUsers = useMemo(() => users, [users]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagedUsers = filteredUsers;

  const handleDelete = async (id: number) => {
    if (!token || isDemoMode) return;
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE", token }, apiMode);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      showToast(t("success"), "success");
    } catch {
      showToast(t("errorDeleteFailed"), "error");
    }
  };

  const handleDeleteAvatar = async (userId: number) => {
    if (!token || isDemoMode) return;
    try {
      await apiRequest(`/users/${userId}/avatar`, { method: "DELETE", token }, apiMode);
      setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, avatar: null } : user));
      showToast(t("success"), "success");
    } catch {
      showToast(t("errorDeleteFailed"), "error");
    }
  };

  const handleDeletePortfolio = async (userId: number, url: string) => {
    if (!token || isDemoMode) return;
    try {
      await apiRequest(`/users/${userId}/portfolio?url=${encodeURIComponent(url)}`, { method: "DELETE", token }, apiMode);
      setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, portfolio: (user.portfolio || []).filter((item) => item !== url) } : user));
      showToast(t("success"), "success");
    } catch {
      showToast(t("errorDeleteFailed"), "error");
    }
  };

  const handleToggleBlock = async (userId: number, currentlyBlocked: boolean) => {
    if (!token && !isDemoMode) return;
    
    const confirmed = window.confirm(currentlyBlocked ? "Розблокувати користувача?" : "Заблокувати користувача?");
    if (!confirmed) return;
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isBlocked: !currentlyBlocked, status: currentlyBlocked ? 'Active' : 'Blocked' }
        : user
    ));
    showToast(currentlyBlocked ? "Користувача розблоковано" : "Користувача заблоковано", "success");
  };

  return (
    <>
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">USER CONTROL</h1>
            <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
              <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" /><span className="hidden sm:inline">Monitor and manage zone users</span>
            </p>
          </div>
          <Button onClick={logoutAdmin} variant="outline" className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text text-sm">
            <LogOutIcon className="h-3 w-3 md:h-4 md:w-4" /><span className="hidden sm:inline">Exit Zone</span>
          </Button>
        </div>
      </div>
      <Card className="bg-stalker-card border-stalker-border shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 pb-4">
          <CardTitle className="text-lg md:text-xl text-stalker-green">Users List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select className="w-full sm:w-36 lg:w-44 p-2 border rounded-md bg-stalker-darker text-stalker-text border-stalker-border text-sm"
              value={`${sortField}:${sortDir}`}
              onChange={(e) => { const [field, dir] = e.target.value.split(":") as ["name" | "email" | "role", "asc" | "desc"]; setSortField(field); setSortDir(dir); setPage(1); }}>
              <option value="name:asc">Name A-Z</option><option value="name:desc">Name Z-A</option>
              <option value="email:asc">Email A-Z</option><option value="email:desc">Email Z-A</option>
              <option value="role:asc">Role A-Z</option><option value="role:desc">Role Z-A</option>
            </select>
            <div className="relative w-full sm:w-48 lg:w-64">
              <Input placeholder="Search..." className="pl-10 w-full bg-stalker-darker text-stalker-text border-stalker-border h-9"
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!authHydrated ? <p className="text-stalker-muted">Loading...</p> : 
           loading ? <p className="text-stalker-muted">Loading...</p> : 
           error ? <p className="text-stalker-red">{error}</p> : 
           pagedUsers.length === 0 ? <p className="text-stalker-muted">No users found</p> : (
            <div className="overflow-x-auto rounded-lg border border-stalker-border -mx-4 px-4 md:mx-0 md:px-0">
              <table className="w-full min-w-[600px] md:min-w-0">
                <thead className="bg-stalker-border">
                  <tr>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 rounded-tl-lg text-stalker-green text-sm">ID</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm">Name</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm hidden sm:table-cell">Email</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm">Role</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm hidden md:table-cell">Online</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-stalker-green text-sm">Status</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 rounded-tr-lg text-stalker-green text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b border-stalker-border ${index % 2 === 0 ? 'bg-stalker-dark' : 'bg-stalker-darker'} hover:bg-stalker-card transition-colors`}>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm">{user.id}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 font-medium text-stalker-green text-sm">{user.name}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-stalker-text text-sm hidden sm:table-cell truncate max-w-[120px] md:max-w-none">{user.email}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <Badge variant={user.role === 'freelancer' ? 'default' : 'secondary'} className={`text-xs ${user.role === 'freelancer' ? 'bg-stalker-blue text-stalker-dark' : 'bg-stalker-yellow text-stalker-dark'}`}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 hidden md:table-cell">
                        {(() => { const status = getUserStatus(user); return (<div className="flex items-center gap-1 md:gap-2"><span className={`inline-flex items-center justify-center w-2 h-2 md:w-3 md:h-3 rounded-full ${status.bgColor} ${user.isOnline ? 'animate-pulse' : ''}`}></span><span className={`text-xs font-medium ${status.color}`}>{status.text}</span></div>); })()}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <Badge variant={user.status === 'Active' ? 'default' : 'outline'} className={`text-xs ${user.status === 'Active' ? 'bg-stalker-green text-stalker-dark' : 'bg-stalker-border text-stalker-text'}`}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <div className="flex space-x-1 md:space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 w-8 p-0">
                                <EyeIcon className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-stalker-card border-stalker-border text-stalker-text max-w-[95vw] md:max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader><DialogTitle className="text-stalker-green text-xl">User Details</DialogTitle></DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                <div className="space-y-2"><h3 className="font-semibold text-stalker-green">Personal Information</h3><p><span className="text-stalker-muted">ID:</span> {user.id}</p><p><span className="text-stalker-muted">Name:</span> {user.name}</p><p><span className="text-stalker-muted">Email:</span> {user.email}</p><p><span className="text-stalker-muted">Role:</span> {user.role}</p><p><span className="text-stalker-muted">Status:</span> {user.status}</p></div>
                                <div className="space-y-2"><h3 className="font-semibold text-stalker-green">Activity Details</h3>{user.role === 'client' ? (<><p><span className="text-stalker-muted">Projects Posted:</span> {user.projectsPosted || 0}</p><p><span className="text-stalker-muted">Total Spent:</span> {user.totalSpent || '$0'}</p></>) : (<><p><span className="text-stalker-muted">Projects Completed:</span> {user.projectsCompleted || 0}</p><p><span className="text-stalker-muted">Earnings:</span> {user.earnings || '$0'}</p></>)}</div>
                              </div>
                              <div className="border-t border-stalker-border pt-4">
                                <h3 className="font-semibold text-stalker-green mb-3">Media</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3"><p className="text-stalker-muted">Avatar</p>{user.avatar ? (<div className="flex items-center gap-3"><img src={user.avatar.startsWith("http") ? user.avatar : `${baseRoot}${user.avatar}`} alt={`${user.name} avatar`} className="h-12 w-12 md:h-16 md:w-16 rounded-full border border-stalker-border object-cover" /><Button variant="outline" size="sm" className="border-stalker-red text-stalker-red hover:bg-stalker-red/10" onClick={() => handleDeleteAvatar(user.id)}><TrashIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" /></Button></div>) : (<p className="text-stalker-muted text-sm">No avatar</p>)}</div>
                                  <div className="space-y-3"><p className="text-stalker-muted">Portfolio</p>{(user.portfolio || []).length > 0 ? (<div className="space-y-2 max-h-24 overflow-y-auto">{(user.portfolio || []).map((item) => { const href = item.startsWith("http") ? item : `${baseRoot}${item}`; return (<div key={item} className="flex items-center justify-between gap-2"><a href={href} target="_blank" rel="noreferrer" className="text-stalker-green underline truncate text-sm">{item.split("/").pop()}</a><Button variant="outline" size="sm" className="border-stalker-red text-stalker-red hover:bg-stalker-red/10 p-1 h-6 w-6" onClick={() => handleDeletePortfolio(user.id, item)}><TrashIcon className="h-3 w-3" /></Button></div>); })}</div>) : (<p className="text-stalker-muted text-sm">No portfolio</p>)}</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-stalker-border">
                                <Button variant="outline" className="border-stalker-border text-stalker-text hover:bg-stalker-border text-sm" onClick={() => alert(`Editing user: ${user.name}`)}><EditIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />Edit</Button>
                                <Button variant="outline" className="border-stalker-red text-stalker-red hover:bg-stalker-red/10 text-sm" onClick={() => handleDelete(user.id)}><TrashIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />Delete</Button>
                                <Button variant="outline" className={user.status === 'Active' ? "border-stalker-red text-stalker-red hover:bg-stalker-red/10" : "border-stalker-green text-stalker-green hover:bg-stalker-green/10"} onClick={() => handleToggleBlock(user.id, user.status === 'Blocked')}>
                                  {user.status === 'Active' ? (<><BanIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />Block</>) : (<><CheckCircleIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />Unblock</>)}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${user.status === 'Active' ? "border-stalker-red text-stalker-red hover:bg-stalker-red/10" : "border-stalker-green text-stalker-green hover:bg-stalker-green/10"}`} onClick={() => handleToggleBlock(user.id, user.status === 'Blocked')} title={user.status === 'Active' ? 'Block user' : 'Unblock user'}>
                            {user.status === 'Active' ? <BanIcon className="h-3 w-3" /> : <CheckCircleIcon className="h-3 w-3" />}
                          </Button>
                          <Button variant="outline" size="sm" className="border-stalker-border text-stalker-text hover:bg-stalker-border h-8 w-8 p-0" onClick={() => handleDelete(user.id)}><TrashIcon className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-sm text-stalker-muted">
            <span className="text-xs sm:text-sm">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-xs sm:text-sm">Prev</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-xs sm:text-sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
