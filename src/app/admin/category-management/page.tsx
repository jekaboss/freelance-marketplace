"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, Folder, Wrench, Tags, Plus, Edit3, Trash2, RadiationIcon, LogOutIcon, Check } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
  type: 'category' | 'skill';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  parentCategory?: number;
}

export default function AdminCategoryManagementPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const [categories, setCategories] = useState<Category[]>([
    { 
      id: 1, 
      name: 'Web Development', 
      description: 'Websites, web applications, and CMS development', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-18'
    },
    { 
      id: 2, 
      name: 'Mobile Development', 
      description: 'iOS, Android, and cross-platform mobile apps', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-02-20',
      updatedAt: '2024-12-18'
    },
    { 
      id: 3, 
      name: 'Design', 
      description: 'UI/UX, graphic design, and branding', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-01-22',
      updatedAt: '2024-12-15'
    },
    { 
      id: 4, 
      name: 'Writing & Translation', 
      description: 'Content writing, copywriting, and translation services', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-03-10',
      updatedAt: '2024-12-10'
    },
    { 
      id: 5, 
      name: 'Data Science', 
      description: 'Data analysis, machine learning, and AI services', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-05-05',
      updatedAt: '2024-12-01'
    },
    { 
      id: 6, 
      name: 'React', 
      description: 'Library for building user interfaces', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-01-18',
      updatedAt: '2024-12-18'
    },
    { 
      id: 7, 
      name: 'Node.js', 
      description: 'Backend JavaScript runtime environment', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-01-20',
      updatedAt: '2024-12-18'
    },
    { 
      id: 8, 
      name: 'UI/UX Design', 
      description: 'User interface and user experience design', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-02-25',
      updatedAt: '2024-12-15'
    },
  ]);

  const [activeTab, setActiveTab] = useState<'categories' | 'skills'>('categories');
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    type: 'category' as const,
    status: 'active' as const
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: Category = {
        id: categories.length + 1,
        name: newCategory.name,
        description: newCategory.description,
        type: newCategory.type,
        status: newCategory.status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', type: 'category', status: 'active' });
      alert(`New ${newCategory.type} "${newCategory.name}" added successfully!`);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      alert(`"${editingCategory.name}" updated successfully!`);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      alert('Item deleted successfully!');
    }
  };

  const handleToggleStatus = (id: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? {...cat, status: cat.status === 'active' ? 'inactive' : 'active'} : cat
    ));
  };

  const filteredItems = activeTab === 'categories' 
    ? categories.filter(cat => cat.type === 'category') 
    : categories.filter(cat => cat.type === 'skill');

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
                  CATEGORY & SKILL MANAGEMENT
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Organize and manage service categories and professional skills
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
                  activeTab === 'categories'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('categories')}
              >
                <Folder className="h-4 w-4 inline mr-2" />
                Service Categories ({categories.filter(c => c.type === 'category').length})
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'skills'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('skills')}
              >
                <Wrench className="h-4 w-4 inline mr-2" />
                Professional Skills ({categories.filter(c => c.type === 'skill').length})
              </button>
            </div>
            
            {/* Categories/Skills Tab */}
            <div>
              <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                  <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      {activeTab === 'categories' ? <Folder className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                      <span>{activeTab === 'categories' ? 'Service Categories' : 'Professional Skills'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <Input 
                          placeholder={`Search ${activeTab}...`} 
                          className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                      </div>
                    </div>
                  </CardTitle>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-stalker-darker border-stalker-border lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-stalker-green flex items-center gap-2">
                          {activeTab === 'categories' ? <Folder className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                          <span>{editingCategory ? `Edit ${editingCategory.type}` : `Add New ${activeTab === 'categories' ? 'Category' : 'Skill'}`}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-stalker-green mb-2">
                              {activeTab === 'categories' ? 'Category' : 'Skill'} Name
                            </label>
                            <Input
                              placeholder={`Enter ${activeTab === 'categories' ? 'category' : 'skill'} name...`}
                              value={editingCategory ? editingCategory.name : newCategory.name}
                              onChange={(e) => 
                                editingCategory 
                                  ? setEditingCategory({...editingCategory, name: e.target.value}) 
                                  : setNewCategory({...newCategory, name: e.target.value})
                              }
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Description</label>
                            <Textarea
                              placeholder={`Enter description for this ${activeTab === 'categories' ? 'category' : 'skill'}...`}
                              value={editingCategory ? editingCategory.description : newCategory.description}
                              onChange={(e) => 
                                editingCategory 
                                  ? setEditingCategory({...editingCategory, description: e.target.value}) 
                                  : setNewCategory({...newCategory, description: e.target.value})
                              }
                              rows={3}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stalker-green mb-2">Status</label>
                              <select
                                value={editingCategory ? editingCategory.status : newCategory.status}
                                onChange={(e) => 
                                  editingCategory 
                                    ? setEditingCategory({...editingCategory, status: e.target.value as any}) 
                                    : setNewCategory({...newCategory, status: e.target.value as any})
                                }
                                className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-stalker-green mb-2">Type</label>
                              <select
                                value={editingCategory ? editingCategory.type : newCategory.type}
                                onChange={(e) => 
                                  editingCategory 
                                    ? setEditingCategory({...editingCategory, type: e.target.value as any}) 
                                    : setNewCategory({...newCategory, type: e.target.value as any})
                                }
                                className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                                disabled={!!editingCategory}
                              >
                                <option value="category">{activeTab === 'categories' ? 'Category' : 'Category'}</option>
                                <option value="skill">{activeTab === 'skills' ? 'Skill' : 'Skill'}</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            {editingCategory ? (
                              <div className="flex gap-3">
                                <Button 
                                  onClick={handleUpdateCategory}
                                  className="flex-1 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Update {editingCategory.type === 'category' ? 'Category' : 'Skill'}
                                </Button>
                                <Button 
                                  onClick={() => setEditingCategory(null)}
                                  variant="outline"
                                  className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                onClick={handleAddCategory}
                                className="w-full bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add {activeTab === 'categories' ? 'Category' : 'Skill'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-stalker-darker border-stalker-border">
                      <CardHeader>
                        <CardTitle className="text-stalker-green">Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-stalker-text">{activeTab === 'categories' ? 'Categories' : 'Skills'} Count</span>
                            <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                              {filteredItems.length}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-stalker-text">Active Items</span>
                            <Badge className="bg-stalker-green/20 text-stalker-dark">
                              {filteredItems.filter(item => item.status === 'active').length}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-stalker-text">Inactive Items</span>
                            <Badge className="bg-stalker-border/20 text-stalker-text">
                              {filteredItems.filter(item => item.status === 'inactive').length}
                            </Badge>
                          </div>
                          
                          <div className="pt-4">
                            <h4 className="text-stalker-green font-medium mb-2">Top Categories</h4>
                            <ul className="space-y-2">
                              {filteredItems
                                .filter(item => item.status === 'active')
                                .sort((a, b) => b.id - a.id)
                                .slice(0, 3)
                                .map((item) => (
                                  <li key={item.id} className="flex justify-between text-sm">
                                    <span className="text-stalker-text">{item.name}</span>
                                    <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                      {item.type}
                                    </Badge>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-stalker-border">
                        <tr>
                          <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Name</th>
                          <th className="text-left py-3 px-4 text-stalker-green">Description</th>
                          <th className="text-left py-3 px-4 text-stalker-green">Type</th>
                          <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                          <th className="text-left py-3 px-4 text-stalker-green">Created</th>
                          <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                            <td className="py-3 px-4 font-medium text-stalker-green">{item.name}</td>
                            <td className="py-3 px-4 text-stalker-text line-clamp-2">{item.description}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="bg-stalker-border/50 text-stalker-text">
                                {item.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                className={
                                  item.status === 'active' 
                                    ? 'bg-stalker-green/20 text-stalker-dark' 
                                    : 'bg-stalker-border/20 text-stalker-text'
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-stalker-text">{item.createdAt}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                  onClick={() => setEditingCategory(item)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                                  onClick={() => handleToggleStatus(item.id)}
                                >
                                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                  onClick={() => handleDeleteCategory(item.id)}
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
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-10 text-stalker-muted">
                      No {activeTab} found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}