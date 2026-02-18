"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, Folder, Wrench, Tags, Plus, Edit3, Trash2, RadiationIcon, LogOutIcon, Check, X, Settings, EyeIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

interface CategoryOrSkill {
  id: number;
  name: string;
  description: string;
  type: 'category' | 'skill';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  parentCategory?: number;
  usageCount: number;
}

export default function AdminCategorySkillsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const [items, setItems] = useState<CategoryOrSkill[]>([
    { 
      id: 1, 
      name: 'Web Development', 
      description: 'Websites, web applications, and CMS development', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-18',
      usageCount: 1245
    },
    { 
      id: 2, 
      name: 'Mobile Development', 
      description: 'iOS, Android, and cross-platform mobile apps', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-02-20',
      updatedAt: '2024-12-18',
      usageCount: 876
    },
    { 
      id: 3, 
      name: 'Design', 
      description: 'UI/UX, graphic design, and branding', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-01-22',
      updatedAt: '2024-12-15',
      usageCount: 923
    },
    { 
      id: 4, 
      name: 'Writing & Translation', 
      description: 'Content writing, copywriting, and translation services', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-03-10',
      updatedAt: '2024-12-10',
      usageCount: 765
    },
    { 
      id: 5, 
      name: 'Data Science', 
      description: 'Data analysis, machine learning, and AI services', 
      type: 'category', 
      status: 'active',
      createdAt: '2024-05-05',
      updatedAt: '2024-12-01',
      usageCount: 420
    },
    { 
      id: 6, 
      name: 'React', 
      description: 'Library for building user interfaces', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-01-18',
      updatedAt: '2024-12-18',
      usageCount: 2100
    },
    { 
      id: 7, 
      name: 'Node.js', 
      description: 'Backend JavaScript runtime environment', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-01-20',
      updatedAt: '2024-12-18',
      usageCount: 1890
    },
    { 
      id: 8, 
      name: 'UI/UX Design', 
      description: 'User interface and user experience design', 
      type: 'skill', 
      status: 'active',
      createdAt: '2024-02-25',
      updatedAt: '2024-12-15',
      usageCount: 1540
    },
    { 
      id: 9, 
      name: 'DevOps', 
      description: 'Infrastructure automation and deployment', 
      type: 'skill', 
      status: 'inactive',
      createdAt: '2024-04-12',
      updatedAt: '2024-11-20',
      usageCount: 320
    },
    { 
      id: 10, 
      name: 'Marketing', 
      description: 'Digital marketing and advertising campaigns', 
      type: 'category', 
      status: 'inactive',
      createdAt: '2024-06-15',
      updatedAt: '2024-11-05',
      usageCount: 540
    },
  ]);

  const [activeTab, setActiveTab] = useState<'categories' | 'skills'>('categories');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    type: 'category' as const,
    status: 'active' as const
  });

  const [editingItem, setEditingItem] = useState<CategoryOrSkill | null>(null);

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.description.trim()) {
      const item: CategoryOrSkill = {
        id: items.length + 1,
        name: newItem.name,
        description: newItem.description,
        type: newItem.type,
        status: newItem.status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setItems([...items, item]);
      setNewItem({ 
        name: '', 
        description: '', 
        type: 'category', 
        status: 'active' 
      });
      alert(`New ${newItem.type} "${newItem.name}" added successfully!`);
    }
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      alert(`"${editingItem.name}" updated successfully!`);
    }
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
      alert(`Item #${id} deleted successfully!`);
    }
  };

  const handleToggleStatus = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? {...item, status: item.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString().split('T')[0]} : item
    ));
  };

  const filteredItems = activeTab === 'categories' 
    ? items.filter(item => item.type === 'category') 
    : items.filter(item => item.type === 'skill');

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'category': return <Folder className="h-4 w-4" />;
      case 'skill': return <Wrench className="h-4 w-4" />;
      default: return <Tags className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'category': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'skill': return 'bg-stalker-green/20 text-stalker-green';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-stalker-green/20 text-stalker-dark';
      case 'inactive': return 'bg-stalker-border/20 text-stalker-text';
      default: return 'bg-stalker-border/20 text-stalker-text';
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
        <div className="flex-1 py-6 md:py-8 lg:py-12 px-3 md:px-4 relative z-10 flex justify-center w-full">
          <div className="w-full max-w-7xl">
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stalker-green to-stalker-yellow">
                  CATEGORIES & SKILLS MANAGEMENT
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Organize and manage service categories and professional skills
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
                  activeTab === 'categories'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('categories')}
              >
                <Folder className="h-4 w-4 inline mr-2" />
                Service Categories ({items.filter(i => i.type === 'category').length})
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
                Professional Skills ({items.filter(i => i.type === 'skill').length})
              </button>
            </div>
            
            {/* Categories/Skills Tab */}
            <div>
              <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
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
                      
                      <select 
                        className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                      >
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </CardTitle>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="bg-stalker-darker border-stalker-border lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-stalker-green flex items-center gap-2">
                          {activeTab === 'categories' ? <Folder className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                          <span>{editingItem ? `Edit ${editingItem.type}` : `Add New ${activeTab === 'categories' ? 'Category' : 'Skill'}`}</span>
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
                              value={editingItem ? editingItem.name : newItem.name}
                              onChange={(e) => 
                                editingItem 
                                  ? setEditingItem({...editingItem, name: e.target.value}) 
                                  : setNewItem({...newItem, name: e.target.value})
                              }
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-stalker-green mb-2">Description</label>
                            <Textarea
                              placeholder={`Enter description for this ${activeTab === 'categories' ? 'category' : 'skill'}...`}
                              value={editingItem ? editingItem.description : newItem.description}
                              onChange={(e) => 
                                editingItem 
                                  ? setEditingItem({...editingItem, description: e.target.value}) 
                                  : setNewItem({...newItem, description: e.target.value})
                              }
                              rows={4}
                              className="bg-stalker-darker border-stalker-border text-stalker-text"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
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
                                disabled={!!editingItem}
                              >
                                <option value="category">{activeTab === 'categories' ? 'Category' : 'Category'}</option>
                                <option value="skill">{activeTab === 'skills' ? 'Skill' : 'Skill'}</option>
                              </select>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={editingItem ? handleUpdateItem : handleAddItem}
                            className={`w-full ${
                              editingItem 
                                ? 'bg-stalker-green text-stalker-dark hover:bg-stalker-green/90' 
                                : 'bg-stalker-blue text-stalker-dark hover:bg-stalker-blue/90'
                            }`}
                          >
                            {editingItem ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {editingItem ? 'Update Item' : `Add ${activeTab === 'categories' ? 'Category' : 'Skill'}`}
                          </Button>
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
                          
                          <div className="flex justify-between items-center">
                            <span className="text-stalker-text">Total Usage</span>
                            <Badge className="bg-stalker-cyan/20 text-stalker-dark">
                              {filteredItems.reduce((sum, item) => sum + item.usageCount, 0).toLocaleString()}
                            </Badge>
                          </div>
                          
                          <div className="pt-4">
                            <h4 className="text-stalker-green font-medium mb-2">Top {activeTab === 'categories' ? 'Categories' : 'Skills'}</h4>
                            <ul className="space-y-2">
                              {filteredItems
                                .filter(item => item.status === 'active')
                                .sort((a, b) => b.usageCount - a.usageCount)
                                .slice(0, 3)
                                .map((item) => (
                                  <li key={item.id} className="flex justify-between text-sm">
                                    <span className="text-stalker-text">{item.name}</span>
                                    <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                      {item.usageCount} uses
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
                          <th className="text-left py-3 px-4 text-stalker-green">Usage</th>
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
                              <Badge className={getTypeColor(item.type)}>
                                {getTypeIcon(item.type)}
                                <span className="ml-1 capitalize">{item.type}</span>
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                className={getStatusColor(item.status)}
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-stalker-text">{item.usageCount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-stalker-text">{item.createdAt}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                  onClick={() => alert(`Viewing details for: ${item.name}`)}
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
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={
                                    item.status === 'active' 
                                      ? 'border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10' 
                                      : 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                  }
                                  onClick={() => handleToggleStatus(item.id)}
                                >
                                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                  onClick={() => handleDeleteItem(item.id)}
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
      </div>

      <Footer />
    </div>
  );
}