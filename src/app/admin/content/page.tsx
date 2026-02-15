"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, FileText, Image, Globe, Star, Users, Upload, Edit3, Trash2, RadiationIcon, LogOutIcon, Plus } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminContentPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Mock data for content management
  const [banners, setBanners] = useState([
    { 
      id: 1, 
      title: 'Special Offer', 
      content: 'Get 20% off on all premium services', 
      type: 'banner', 
      status: 'active',
      priority: 1
    },
    { 
      id: 2, 
      title: 'New Features', 
      content: 'Check out our latest features and improvements', 
      type: 'announcement', 
      status: 'active',
      priority: 2
    },
    { 
      id: 3, 
      title: 'Maintenance Notice', 
      content: 'Scheduled maintenance on Sunday at 2 AM', 
      type: 'notice', 
      status: 'inactive',
      priority: 3
    },
  ]);

  const [testimonials, setTestimonials] = useState([
    { 
      id: 1, 
      author: 'John Smith', 
      content: 'Great service! Completed my project ahead of schedule.', 
      rating: 5,
      verified: true,
      status: 'published'
    },
    { 
      id: 2, 
      author: 'Maria Garcia', 
      content: 'Professional team with excellent communication skills.', 
      rating: 5,
      verified: true,
      status: 'published'
    },
    { 
      id: 3, 
      author: 'David Chen', 
      content: 'Good experience overall, will work with them again.', 
      rating: 4,
      verified: false,
      status: 'pending'
    },
  ]);

  const [pages, setPages] = useState([
    { 
      id: 1, 
      title: 'About Us', 
      slug: 'about',
      content: 'Learn more about our company and mission.',
      status: 'published'
    },
    { 
      id: 2, 
      title: 'Privacy Policy', 
      slug: 'privacy-policy',
      content: 'Our privacy policy and terms of service.',
      status: 'published'
    },
    { 
      id: 3, 
      title: 'FAQ', 
      slug: 'faq',
      content: 'Frequently asked questions and answers.',
      status: 'draft'
    },
  ]);

  const [newBanner, setNewBanner] = useState({
    title: '',
    content: '',
    type: 'banner',
    priority: 1
  });

  const [newTestimonial, setNewTestimonial] = useState({
    author: '',
    content: '',
    rating: 5,
    verified: false
  });

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('banners');

  const handleAddBanner = () => {
    if (newBanner.title.trim() && newBanner.content.trim()) {
      const banner = {
        id: banners.length + 1,
        title: newBanner.title,
        content: newBanner.content,
        type: newBanner.type,
        status: 'active',
        priority: newBanner.priority
      };
      setBanners([...banners, banner]);
      setNewBanner({ title: '', content: '', type: 'banner', priority: 1 });
      alert('Banner created successfully!');
    }
  };

  const handleAddTestimonial = () => {
    if (newTestimonial.author.trim() && newTestimonial.content.trim()) {
      const testimonial = {
        id: testimonials.length + 1,
        author: newTestimonial.author,
        content: newTestimonial.content,
        rating: newTestimonial.rating,
        verified: newTestimonial.verified,
        status: 'pending'
      };
      setTestimonials([...testimonials, testimonial]);
      setNewTestimonial({ author: '', content: '', rating: 5, verified: false });
      alert('Testimonial submitted successfully!');
    }
  };

  const handleAddPage = () => {
    if (newPage.title.trim() && newPage.slug.trim() && newPage.content.trim()) {
      const page = {
        id: pages.length + 1,
        title: newPage.title,
        slug: newPage.slug,
        content: newPage.content,
        status: 'draft'
      };
      setPages([...pages, page]);
      setNewPage({ title: '', slug: '', content: '' });
      alert('Page created successfully!');
    }
  };

  const handleUpdateStatus = (type: 'banner' | 'testimonial' | 'page', id: number, newStatus: string) => {
    if (type === 'banner') {
      setBanners(banners.map(b => b.id === id ? {...b, status: newStatus} : b));
    } else if (type === 'testimonial') {
      setTestimonials(testimonials.map(t => t.id === id ? {...t, status: newStatus} : t));
    } else {
      setPages(pages.map(p => p.id === id ? {...p, status: newStatus} : p));
    }
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated!`);
  };

  const handleDelete = (type: 'banner' | 'testimonial' | 'page', id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'banner') {
        setBanners(banners.filter(b => b.id !== id));
      } else if (type === 'testimonial') {
        setTestimonials(testimonials.filter(t => t.id !== id));
      } else {
        setPages(pages.filter(p => p.id !== id));
      }
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-stalker-dark text-stalker-text flex flex-col">
      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <StalkerSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 container py-12 px-4 relative z-10">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  CONTENT MANAGEMENT
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Manage platform content and promotional materials
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
          
            {/* Tab Navigation */}
            <div className="flex border-b border-stalker-border mb-8">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'banners'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('banners')}
              >
                <Globe className="h-4 w-4 inline mr-2" />
                Banners & Announcements
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'testimonials'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('testimonials')}
              >
                <Star className="h-4 w-4 inline mr-2" />
                Testimonials
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'pages'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('pages')}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Static Pages
              </button>
            </div>
            
            {/* Banners & Announcements Tab */}
            {activeTab === 'banners' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>Manage Banners & Announcements</span>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-stalker-green mb-2">Title</label>
                        <Input
                          placeholder="Banner title..."
                          value={newBanner.title}
                          onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text"
                        />
                      </div>
                      <div>
                        <label className="block text-stalker-green mb-2">Type</label>
                        <select
                          value={newBanner.type}
                          onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
                          className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option value="banner">Banner</option>
                          <option value="announcement">Announcement</option>
                          <option value="notice">Notice</option>
                          <option value="promotional">Promotional</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-stalker-green mb-2">Content</label>
                      <Textarea
                        placeholder="Banner content..."
                        value={newBanner.content}
                        onChange={(e) => setNewBanner({...newBanner, content: e.target.value})}
                        rows={3}
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddBanner}
                        className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Banner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-stalker-green mb-4">Current Banners</h3>
                    <div className="space-y-4">
                      {banners.map((banner) => (
                        <Card key={banner.id} className="bg-stalker-darker border-stalker-border p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-stalker-green flex items-center gap-2">
                                {banner.title}
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text capitalize">
                                  {banner.type}
                                </Badge>
                                <Badge variant="secondary" className="bg-stalker-blue text-stalker-dark">
                                  Priority: {banner.priority}
                                </Badge>
                              </h4>
                              <p className="text-stalker-text mt-2">{banner.content}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  banner.status === 'active' 
                                    ? 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                    : 'border-stalker-border text-stalker-text hover:bg-stalker-border'
                                }
                                onClick={() => handleUpdateStatus('banner', banner.id, banner.status === 'active' ? 'inactive' : 'active')}
                              >
                                {banner.status}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => handleDelete('banner', banner.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        <span>Add New Testimonial</span>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-stalker-green mb-2">Author Name</label>
                        <Input
                          placeholder="Author name..."
                          value={newTestimonial.author}
                          onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text"
                        />
                      </div>
                      <div>
                        <label className="block text-stalker-green mb-2">Rating</label>
                        <select
                          value={newTestimonial.rating}
                          onChange={(e) => setNewTestimonial({...newTestimonial, rating: Number(e.target.value)})}
                          className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-stalker-green mb-2">Content</label>
                      <Textarea
                        placeholder="Testimonial content..."
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                        rows={3}
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={newTestimonial.verified}
                        onChange={(e) => setNewTestimonial({...newTestimonial, verified: e.target.checked})}
                        className="h-4 w-4 text-stalker-green bg-stalker-darker border-stalker-border rounded focus:ring-stalker-green focus:ring-offset-stalker-darker"
                      />
                      <label htmlFor="verified" className="text-stalker-text">Verified Customer</label>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddTestimonial}
                        className="bg-stalker-cyan text-stalker-dark hover:bg-stalker-cyan/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Testimonial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-stalker-green mb-4">Current Testimonials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="bg-stalker-darker border-stalker-border p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-stalker-green">{testimonial.author}</h4>
                                {testimonial.verified && (
                                  <Badge variant="secondary" className="bg-stalker-blue text-stalker-dark text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-stalker-yellow fill-stalker-yellow' : 'text-stalker-muted'}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-stalker-text">{testimonial.content}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  testimonial.status === 'published' 
                                    ? 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                    : 'border-stalker-border text-stalker-text hover:bg-stalker-border'
                                }
                                onClick={() => handleUpdateStatus('testimonial', testimonial.id, testimonial.status === 'published' ? 'pending' : 'published')}
                              >
                                {testimonial.status}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => handleDelete('testimonial', testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Static Pages Tab */}
            {activeTab === 'pages' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>Create New Page</span>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-stalker-green mb-2">Page Title</label>
                        <Input
                          placeholder="Page title..."
                          value={newPage.title}
                          onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text"
                        />
                      </div>
                      <div>
                        <label className="block text-stalker-green mb-2">URL Slug</label>
                        <Input
                          placeholder="Page slug..."
                          value={newPage.slug}
                          onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-stalker-green mb-2">Content</label>
                      <Textarea
                        placeholder="Page content..."
                        value={newPage.content}
                        onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                        rows={6}
                        className="bg-stalker-darker border-stalker-border text-stalker-text"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddPage}
                        className="bg-stalker-red text-stalker-dark hover:bg-stalker-red/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-stalker-green mb-4">Current Pages</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stalker-border">
                          <tr>
                            <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Title</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Slug</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pages.map((page) => (
                            <tr key={page.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{page.title}</td>
                              <td className="py-3 px-4 text-stalker-text">/{page.slug}</td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant="default"
                                  className={
                                    page.status === 'published' 
                                      ? 'bg-stalker-green text-stalker-dark' 
                                      : 'bg-stalker-border text-stalker-text'
                                  }
                                >
                                  {page.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Editing page #${page.id}`)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                      page.status === 'published' 
                                        ? 'border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10'
                                        : 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                    }
                                    onClick={() => handleUpdateStatus('page', page.id, page.status === 'published' ? 'draft' : 'published')}
                                  >
                                    {page.status === 'published' ? 'Unpublish' : 'Publish'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                    onClick={() => handleDelete('page', page.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}