"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchIcon, FileText, Image, Globe, Users, AlertTriangle, Info, CheckCircle, Clock, RadiationIcon, LogOutIcon, Edit3, Trash2, Send, Check, X, Settings, EyeIcon, Plus, Star, MessageSquare, Upload, Download } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: 'blog' | 'testimonial' | 'faq' | 'static-page' | 'banner' | 'promotion';
  status: 'published' | 'draft' | 'archived';
  author: string;
  date: string;
  category: string;
  views: number;
  likes: number;
}

export default function AdminContentControlPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  const [items, setItems] = useState<ContentItem[]>([
    { 
      id: 1, 
      title: 'How to Build a Successful Freelance Career', 
      content: 'In this comprehensive guide, we explore key strategies for establishing and growing your freelance business...', 
      type: 'blog', 
      status: 'published',
      author: 'Alex Johnson',
      date: '2024-12-18',
      category: 'Career Advice',
      views: 1245,
      likes: 42
    },
    { 
      id: 2, 
      title: 'Client Testimonial: Project Success Story', 
      content: 'Working with this freelancer was an exceptional experience. The project was delivered ahead of schedule...', 
      type: 'testimonial', 
      status: 'published',
      author: 'Maria Garcia',
      date: '2024-12-17',
      category: 'Success Stories',
      views: 876,
      likes: 28
    },
    { 
      id: 3, 
      title: 'Frequently Asked Questions', 
      content: 'Find answers to common questions about our platform, payment process, and project management...', 
      type: 'faq', 
      status: 'published',
      author: 'Admin Team',
      date: '2024-12-16',
      category: 'Support',
      views: 2450,
      likes: 15
    },
    { 
      id: 4, 
      title: 'About Our Platform', 
      content: 'Learn more about our mission to connect talented professionals with businesses worldwide...', 
      type: 'static-page', 
      status: 'published',
      author: 'Admin Team',
      date: '2024-12-15',
      category: 'Company',
      views: 3200,
      likes: 8
    },
    { 
      id: 5, 
      title: 'Special Offer: 20% Off Premium Memberships', 
      content: 'Limited time offer for new subscribers to our premium service tier...', 
      type: 'banner', 
      status: 'draft',
      author: 'Marketing Team',
      date: '2024-12-14',
      category: 'Promotions',
      views: 0,
      likes: 0
    },
    { 
      id: 6, 
      title: 'New Feature: Enhanced Project Collaboration Tools', 
      content: 'We\'re excited to announce the launch of our new project collaboration features...', 
      type: 'promotion', 
      status: 'published',
      author: 'Product Team',
      date: '2024-12-13',
      category: 'Updates',
      views: 1890,
      likes: 35
    },
  ]);

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content');
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    type: 'blog' as const,
    status: 'draft' as const,
    category: '',
    author: ''
  });

  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const handleAddItem = () => {
    if (newItem.title.trim() && newItem.content.trim()) {
      const item: ContentItem = {
        id: items.length + 1,
        title: newItem.title,
        content: newItem.content,
        type: newItem.type,
        status: newItem.status,
        author: newItem.author || 'Admin Team',
        date: new Date().toISOString().split('T')[0],
        category: newItem.category,
        views: 0,
        likes: 0
      };
      setItems([...items, item]);
      setNewItem({ 
        title: '', 
        content: '', 
        type: 'blog', 
        status: 'draft', 
        category: '', 
        author: '' 
      });
      alert(`New ${newItem.type} "${newItem.title}" added successfully!`);
    }
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      alert(`"${editingItem.title}" updated successfully!`);
    }
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setItems(items.filter(item => item.id !== id));
      alert('Content deleted successfully!');
    }
  };

  const handleToggleStatus = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? {...item, status: item.status === 'published' ? 'archived' : 'published'} : item
    ));
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'testimonial': return <Star className="h-4 w-4" />;
      case 'faq': return <MessageSquare className="h-4 w-4" />;
      case 'static-page': return <FileText className="h-4 w-4" />;
      case 'banner': return <Globe className="h-4 w-4" />;
      case 'promotion': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'blog': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'testimonial': return 'bg-stalker-yellow/20 text-stalker-yellow';
      case 'faq': return 'bg-stalker-purple/20 text-stalker-purple';
      case 'static-page': return 'bg-stalker-green/20 text-stalker-green';
      case 'banner': return 'bg-stalker-orange/20 text-stalker-dark';
      case 'promotion': return 'bg-stalker-cyan/20 text-stalker-dark';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'bg-stalker-green/20 text-stalker-dark';
      case 'draft': return 'bg-stalker-yellow/20 text-stalker-dark';
      case 'archived': return 'bg-stalker-border/20 text-stalker-text';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const filteredItems = items;

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
        <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 relative z-10 flex justify-center w-full">
          <div className="w-full max-w-7xl">
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  CONTENT CONTROL
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Manage platform content and media assets
                </p>
              </div>
              <Button
                onClick={logoutAdmin}
                variant="outline"
                className="flex items-center gap-2 bg-stalker-dark border-stalker-border hover:bg-stalker-darker text-stalker-text text-sm"
              >
                <LogOutIcon className="h-3 w-3 md:h-4 md:w-4" />
                Exit Zone
              </Button>
            </div>
          
            {/* Tab Navigation */}
            <div className="flex border-b border-stalker-border mb-8">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'content'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Content ({items.length})
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'media'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('media')}
              >
                <Image className="h-4 w-4 inline mr-2" />
                Media Assets
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'settings'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Content Settings
              </button>
            </div>
            
            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>Content Library</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search content..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                        
                        <select 
                          className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option>All Types</option>
                          <option>Blog Posts</option>
                          <option>Testimonials</option>
                          <option>FAQ</option>
                          <option>Static Pages</option>
                          <option>Banners</option>
                          <option>Promotions</option>
                        </select>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stalker-border">
                          <tr>
                            <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Title</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Type</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Author</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Views</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Engagement</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item) => (
                            <tr key={item.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{item.title}</td>
                              <td className="py-3 px-4">
                                <Badge className={getTypeColor(item.type)}>
                                  {getTypeIcon(item.type)}
                                  <span className="ml-1 capitalize">{item.type}</span>
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">{item.author}</td>
                              <td className="py-3 px-4">
                                <Badge 
                                  className={getStatusColor(item.status)}
                                >
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">{item.views.toLocaleString()}</td>
                              <td className="py-3 px-4 text-stalker-text">
                                {item.likes ? 
                                  `${Math.round((item.likes / item.views) * 100)}% (${item.likes})` : 
                                  'N/A'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Viewing content details: ${item.title}`)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                    onClick={() => setEditingItem(item)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  
                                  {item.status === 'draft' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10"
                                        onClick={() => handleToggleStatus(item.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        Publish
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                        onClick={() => handleDeleteItem(item.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </>
                                  )}
                                  
                                  {item.status === 'published' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                                      onClick={() => handleToggleStatus(item.id)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Archive
                                    </Button>
                                  )}
                                  
                                  {item.status === 'archived' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                      onClick={() => handleToggleStatus(item.id)}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Restore
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {filteredItems.length === 0 && (
                      <div className="text-center py-10 text-stalker-muted">
                        No content found
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Add/Edit Content Form */}
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>{editingItem ? 'Edit Content' : 'Create New Content'}</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Title</label>
                          <Input
                            placeholder="Enter content title..."
                            value={editingItem ? editingItem.title : newItem.title}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, title: e.target.value}) 
                                : setNewItem({...newItem, title: e.target.value})
                            }
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Type</label>
                          <select
                            value={editingItem ? editingItem.type : newItem.type}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, type: e.target.value as any}) 
                                : setNewItem({...newItem, type: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="blog">Blog Post</option>
                            <option value="testimonial">Testimonial</option>
                            <option value="faq">FAQ</option>
                            <option value="static-page">Static Page</option>
                            <option value="banner">Banner</option>
                            <option value="promotion">Promotion</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Category</label>
                          <Input
                            placeholder="Enter category..."
                            value={editingItem ? editingItem.category : newItem.category}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, category: e.target.value}) 
                                : setNewItem({...newItem, category: e.target.value})
                            }
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Status</label>
                          <select
                            value={editingItem ? editingItem.status : newItem.status}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, status: e.target.value as any}) 
                                : setNewItem({...newItem, status: e.target.value as any})
                            }
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Content</label>
                          <Textarea
                            placeholder="Enter content here..."
                            value={editingItem ? editingItem.content : newItem.content}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, content: e.target.value}) 
                                : setNewItem({...newItem, content: e.target.value})
                            }
                            rows={8}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Author</label>
                          <Input
                            placeholder="Enter author name..."
                            value={editingItem ? editingItem.author : newItem.author}
                            onChange={(e) => 
                              editingItem 
                                ? setEditingItem({...editingItem, author: e.target.value}) 
                                : setNewItem({...newItem, author: e.target.value})
                            }
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div className="pt-4">
                          {editingItem ? (
                            <div className="flex gap-3">
                              <Button 
                                onClick={handleUpdateItem}
                                className="flex-1 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Update Content
                              </Button>
                              <Button 
                                onClick={() => setEditingItem(null)}
                                variant="outline"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={handleAddItem}
                              className="w-full bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create Content
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Media Assets Tab */}
            {activeTab === 'media' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        <span>Media Assets</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search media..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                        
                        <select 
                          className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                        >
                          <option>All Types</option>
                          <option>Images</option>
                          <option>Documents</option>
                          <option>Videos</option>
                          <option>Audio</option>
                        </select>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, index) => (
                        <Card key={index} className="bg-stalker-darker border-stalker-border overflow-hidden">
                          <div className="bg-stalker-border h-40 flex items-center justify-center">
                            <Image className="h-12 w-12 text-stalker-green/50" />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-stalker-green mb-2">media-item-{index + 1}.jpg</h3>
                            <div className="flex justify-between items-center text-sm text-stalker-text">
                              <span>Image</span>
                              <span>2.4 MB</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => alert('Downloading asset')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                onClick={() => alert('Deleting asset')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <Button 
                        variant="outline"
                        className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Asset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Content Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-purple to-stalker-pink p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Content Settings</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Content Policies</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Auto-Approval for Verified Users</h4>
                              <p className="text-sm text-stalker-muted">Automatically approve content from verified users</p>
                            </div>
                            <Switch 
                              checked={false}
                              onCheckedChange={() => alert('Auto-approval setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Enable Comments</h4>
                              <p className="text-sm text-stalker-muted">Allow users to comment on content pieces</p>
                            </div>
                            <Switch 
                              checked={true}
                              onCheckedChange={() => alert('Comments setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-stalker-text">Content Rating System</h4>
                              <p className="text-sm text-stalker-muted">Allow users to rate content items</p>
                            </div>
                            <Switch 
                              checked={true}
                              onCheckedChange={() => alert('Rating system setting toggled')}
                              className="data-[state=checked]:bg-stalker-green data-[state=unchecked]:bg-stalker-border"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Content Categories</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['Project Updates', 'Payment Alerts', 'Account Notifications', 'Promotional', 'System Alerts'].map((category, index) => (
                            <Badge key={index} variant="secondary" className="bg-stalker-border text-stalker-text">
                              {category}
                              <button 
                                className="ml-2 text-stalker-red hover:text-stalker-red/80"
                                onClick={() => alert(`Removing category: ${category}`)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          
                          <div className="relative">
                            <Input 
                              placeholder="Add new category..." 
                              className="bg-stalker-darker border-stalker-border text-stalker-text pl-10 py-1"
                            />
                            <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-stalker-green mb-4">Content Templates</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-stalker-green mb-2">Welcome Email Template</label>
                            <Textarea
                              placeholder="Enter welcome email template..."
                              defaultValue="Dear {username}, welcome to our platform! We're excited to have you join our community of professionals..."
                              rows={4}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Project Notification Template</label>
                            <Textarea
                              placeholder="Enter project notification template..."
                              defaultValue="Hi {username}, you have a new {notification_type} for project '{project_title}'. Please check your dashboard for details."
                              rows={4}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-8 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90">
                      Save Content Settings
                    </Button>
                  </CardContent>
                </Card>
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