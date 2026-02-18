"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, FolderPlus, Tag, Wrench, Plus, Edit3, Trash2, RadiationIcon, LogOutIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminCategoriesPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Mock data for categories and skills
  const [categories, setCategories] = useState([
    { id: 1, name: 'Web Development', count: 24, status: 'active' },
    { id: 2, name: 'Mobile Development', count: 18, status: 'active' },
    { id: 3, name: 'UI/UX Design', count: 15, status: 'active' },
    { id: 4, name: 'Graphic Design', count: 12, status: 'active' },
    { id: 5, name: 'Writing & Translation', count: 22, status: 'active' },
    { id: 6, name: 'Video & Animation', count: 9, status: 'inactive' },
    { id: 7, name: 'Data Science', count: 14, status: 'active' },
    { id: 8, name: 'Business Consulting', count: 7, status: 'active' },
  ]);

  const [skills, setSkills] = useState([
    { id: 1, name: 'React', category: 'Web Development', status: 'active' },
    { id: 2, name: 'Node.js', category: 'Web Development', status: 'active' },
    { id: 3, name: 'UI Design', category: 'UI/UX Design', status: 'active' },
    { id: 4, name: 'UX Research', category: 'UI/UX Design', status: 'active' },
    { id: 5, name: 'Python', category: 'Data Science', status: 'active' },
    { id: 6, name: 'iOS Development', category: 'Mobile Development', status: 'active' },
    { id: 7, name: 'Android Development', category: 'Mobile Development', status: 'active' },
    { id: 8, name: 'Adobe Photoshop', category: 'Graphic Design', status: 'active' },
    { id: 9, name: 'Content Writing', category: 'Writing & Translation', status: 'active' },
    { id: 10, name: 'Project Management', category: 'Business Consulting', status: 'active' },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState({ name: '', category: '' });
  const [activeTab, setActiveTab] = useState('categories');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: categories.length + 1,
        name: newCategory.trim(),
        count: 0,
        status: 'active' as const
      };
      setCategories([...categories, newCat]);
      setNewCategory('');
      alert(`Category "${newCategory}" added successfully!`);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() && newSkill.category.trim()) {
      const newSk = {
        id: skills.length + 1,
        name: newSkill.name.trim(),
        category: newSkill.category.trim(),
        status: 'active' as const
      };
      setSkills([...skills, newSk]);
      setNewSkill({ name: '', category: '' });
      alert(`Skill "${newSkill.name}" added successfully!`);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      // Also remove related skills
      setSkills(skills.filter(skill => skill.category !== categories.find(c => c.id === id)?.name));
      alert('Category deleted successfully!');
    }
  };

  const handleDeleteSkill = (id: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      setSkills(skills.filter(skill => skill.id !== id));
      alert('Skill deleted successfully!');
    }
  };

  const handleToggleStatus = (type: 'category' | 'skill', id: number) => {
    if (type === 'category') {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' } : cat
      ));
    } else {
      setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, status: skill.status === 'active' ? 'inactive' : 'active' } : skill
      ));
    }
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated!`);
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
                  CATEGORIES & SKILLS
                </h1>
                <p className="text-stalker-muted mt-1 md:mt-2 flex items-center gap-2 text-sm">
                  <RadiationIcon className="h-3 w-3 md:h-4 md:w-4 text-stalker-yellow" />
                  Manage service categories and professional skills
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
                <FolderPlus className="h-4 w-4 inline mr-2" />
                Categories
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
                Skills
              </button>
            </div>
            
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <FolderPlus className="h-5 w-5" />
                        <span>Manage Categories</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="New category name..."
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="bg-stalker-darker border-stalker-border text-stalker-text w-64"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <Button 
                          onClick={handleAddCategory}
                          className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <Card key={category.id} className="bg-stalker-darker border-stalker-border p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-stalker-green flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                {category.name}
                              </h3>
                              <p className="text-sm text-stalker-muted mt-1">{category.count} services</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className={`border-stalker-border text-stalker-text hover:bg-stalker-border ${
                                  category.status === 'active' 
                                    ? 'text-stalker-green border-stalker-green' 
                                    : 'text-stalker-red border-stalker-red'
                                }`}
                                onClick={() => handleToggleStatus('category', category.id)}
                              >
                                {category.status}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => handleDeleteCategory(category.id)}
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
            
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        <span>Manage Skills</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Skill name..."
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text w-40"
                        />
                        <Input
                          placeholder="Category..."
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                          className="bg-stalker-darker border-stalker-border text-stalker-text w-40"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                        <Button 
                          onClick={handleAddSkill}
                          className="bg-stalker-cyan text-stalker-dark hover:bg-stalker-cyan/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stalker-border">
                          <tr>
                            <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">Skill Name</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Category</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skills.map((skill) => (
                            <tr key={skill.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{skill.name}</td>
                              <td className="py-3 px-4 text-stalker-text">{skill.category}</td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant="default"
                                  className={
                                    skill.status === 'active' 
                                      ? 'bg-stalker-green text-stalker-dark' 
                                      : 'bg-stalker-red text-stalker-dark'
                                  }
                                >
                                  {skill.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => handleToggleStatus('skill', skill.id)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                    onClick={() => handleDeleteSkill(skill.id)}
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
      </div>

      <Footer />
    </div>
  );
}