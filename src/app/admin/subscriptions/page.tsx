"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, CreditCard, Calendar, Users, DollarSign, Package, Shield, Clock, Check, X, RadiationIcon, LogOutIcon, EyeIcon, Edit3, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

// Define interfaces for type safety
interface Subscription {
  id: number;
  user: string;
  plan: string;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'past_due';
  autoRenew: boolean;
  paymentMethod: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  status: 'active' | 'inactive';
}

export default function AdminSubscriptionsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  // Mock data for subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { 
      id: 1, 
      user: 'John Smith', 
      plan: 'Premium', 
      amount: 29.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      startDate: '2024-01-15', 
      endDate: '2024-12-31',
      status: 'active',
      autoRenew: true,
      paymentMethod: 'Visa ending in 1234'
    },
    { 
      id: 2, 
      user: 'Maria Garcia', 
      plan: 'Professional', 
      amount: 49.99, 
      currency: 'USD', 
      billingCycle: 'yearly', 
      startDate: '2024-03-22', 
      endDate: '2025-03-21',
      status: 'active',
      autoRenew: true,
      paymentMethod: 'Mastercard ending in 5678'
    },
    { 
      id: 3, 
      user: 'David Chen', 
      plan: 'Basic', 
      amount: 9.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      startDate: '2024-02-10', 
      endDate: '2024-03-09',
      status: 'expired',
      autoRenew: false,
      paymentMethod: 'PayPal'
    },
    { 
      id: 4, 
      user: 'Sarah Williams', 
      plan: 'Premium', 
      amount: 29.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      startDate: '2024-05-18', 
      endDate: '2024-06-17',
      status: 'cancelled',
      autoRenew: false,
      paymentMethod: 'Visa ending in 9012'
    },
    { 
      id: 5, 
      user: 'Michael Brown', 
      plan: 'Professional', 
      amount: 49.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      startDate: '2024-04-05', 
      endDate: '2024-05-04',
      status: 'past_due',
      autoRenew: true,
      paymentMethod: 'American Express ending in 3456'
    },
  ]);

  // Mock data for subscription plans
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    { 
      id: 1, 
      name: 'Basic', 
      price: 9.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      features: ['Up to 3 active projects', 'Standard support', 'Basic analytics'], 
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Premium', 
      price: 29.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom branding'], 
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Professional', 
      price: 49.99, 
      currency: 'USD', 
      billingCycle: 'monthly', 
      features: ['Everything in Premium', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'], 
      status: 'active' 
    },
  ]);

  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans'>('subscriptions');
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ''
  });

  const handleCancelSubscription = (id: number) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? {...sub, status: 'cancelled'} : sub
    ));
    alert(`Subscription #${id} cancelled successfully!`);
  };

  const handleRenewSubscription = (id: number) => {
    const updatedSubs = subscriptions.map(sub => {
      if (sub.id === id) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (sub.billingCycle === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        return {
          ...sub,
          status: 'active' as const,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          autoRenew: true
        };
      }
      return sub;
    });
    setSubscriptions(updatedSubs);
    alert(`Subscription #${id} renewed successfully!`);
  };

  const handleAddPlan = () => {
    if (newPlan.name.trim() && newPlan.price > 0) {
      const plan: SubscriptionPlan = {
        id: plans.length + 1,
        name: newPlan.name,
        price: newPlan.price,
        currency: newPlan.currency,
        billingCycle: newPlan.billingCycle,
        features: newPlan.features.split(',').map(f => f.trim()),
        status: 'active'
      };
      setPlans([...plans, plan]);
      setNewPlan({ name: '', price: 0, currency: 'USD', billingCycle: 'monthly', features: '' });
      alert('New plan added successfully!');
    }
  };

  const handleUpdatePlanStatus = (id: number) => {
    setPlans(plans.map(plan => 
      plan.id === id ? {...plan, status: plan.status === 'active' ? 'inactive' : 'active'} : plan
    ));
    alert(`Plan status updated successfully!`);
  };

  const filteredSubscriptions = subscriptions;

  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredSubsCount = subscriptions.filter(s => s.status === 'expired').length;
  const cancelledSubsCount = subscriptions.filter(s => s.status === 'cancelled').length;

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
                  SUBSCRIPTION MANAGEMENT
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Manage user subscriptions and membership plans
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
                  activeTab === 'subscriptions'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('subscriptions')}
              >
                <CreditCard className="h-4 w-4 inline mr-2" />
                Subscriptions
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'plans'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('plans')}
              >
                <Package className="h-4 w-4 inline mr-2" />
                Membership Plans
              </button>
            </div>
            
            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-stalker-card border-stalker-border shadow-xl">
                    <CardContent className="p-5">
                      <div className="text-3xl font-bold text-stalker-green">
                        {activeSubsCount}
                      </div>
                      <div className="text-stalker-muted mt-1">Active Subscriptions</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-stalker-card border-stalker-border shadow-xl">
                    <CardContent className="p-5">
                      <div className="text-3xl font-bold text-stalker-yellow">
                        {expiredSubsCount}
                      </div>
                      <div className="text-stalker-muted mt-1">Expired Subscriptions</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-stalker-card border-stalker-border shadow-xl">
                    <CardContent className="p-5">
                      <div className="text-3xl font-bold text-stalker-red">
                        {cancelledSubsCount}
                      </div>
                      <div className="text-stalker-muted mt-1">Cancelled Subscriptions</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span>User Subscriptions</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search subscriptions..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-stalker-border">
                          <tr>
                            <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">User</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Plan</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Amount</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Billing Cycle</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Start Date</th>
                            <th className="text-left py-3 px-4 text-stalker-green">End Date</th>
                            <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                            <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSubscriptions.map((subscription) => (
                            <tr key={subscription.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                              <td className="py-3 px-4 font-medium text-stalker-green">{subscription.user}</td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="bg-stalker-border text-stalker-text">
                                  {subscription.plan}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-stalker-green" />
                                  <span>{subscription.amount} {subscription.currency}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-stalker-text capitalize">{subscription.billingCycle}</td>
                              <td className="py-3 px-4 text-stalker-text">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-stalker-muted" />
                                  {subscription.startDate}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-stalker-text">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-stalker-muted" />
                                  {subscription.endDate}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant="default"
                                  className={
                                    subscription.status === 'active' 
                                      ? 'bg-stalker-green text-stalker-dark' 
                                      : subscription.status === 'expired'
                                        ? 'bg-stalker-yellow text-stalker-dark'
                                        : subscription.status === 'cancelled'
                                          ? 'bg-stalker-border text-stalker-text'
                                          : 'bg-stalker-red text-stalker-dark'
                                  }
                                >
                                  {subscription.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                    onClick={() => alert(`Viewing subscription details for ${subscription.user}`)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                  
                                  {subscription.status === 'active' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                      onClick={() => handleCancelSubscription(subscription.id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                  
                                  {(subscription.status === 'expired' || subscription.status === 'cancelled') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                      onClick={() => handleRenewSubscription(subscription.id)}
                                    >
                                      Renew
                                    </Button>
                                  )}
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
            
            {/* Membership Plans Tab */}
            {activeTab === 'plans' && (
              <div>
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      <span>Add New Membership Plan</span>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Plan Name</label>
                          <Input
                            placeholder="Enter plan name..."
                            value={newPlan.name}
                            onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Price</label>
                          <Input
                            type="number"
                            placeholder="Enter price..."
                            value={newPlan.price}
                            onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value) || 0})}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Currency</label>
                          <select
                            value={newPlan.currency}
                            onChange={(e) => setNewPlan({...newPlan, currency: e.target.value})}
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stalker-green mb-2">Billing Cycle</label>
                          <select
                            value={newPlan.billingCycle}
                            onChange={(e) => setNewPlan({...newPlan, billingCycle: e.target.value})}
                            className="w-full bg-stalker-darker border-stalker-border text-stalker-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-stalker-green mb-2">Features (comma separated)</label>
                          <Input
                            placeholder="e.g., Unlimited projects, Priority support..."
                            value={newPlan.features}
                            onChange={(e) => setNewPlan({...newPlan, features: e.target.value})}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            onClick={handleAddPlan}
                            className="w-full bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Add Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-cyan to-stalker-teal p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <span>Membership Plans</span>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {plans.map((plan) => (
                        <Card key={plan.id} className="bg-stalker-darker border-stalker-border">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-stalker-green">{plan.name}</CardTitle>
                              <Badge 
                                variant="default"
                                className={
                                  plan.status === 'active' 
                                    ? 'bg-stalker-green text-stalker-dark' 
                                    : 'bg-stalker-border text-stalker-text'
                                }
                              >
                                {plan.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <div className="text-2xl font-bold text-stalker-green">
                                <DollarSign className="h-5 w-5 inline mr-1" />
                                {plan.price} <span className="text-sm font-normal text-stalker-text">/ {plan.billingCycle}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium text-stalker-text mb-2">Features:</h4>
                              <ul className="space-y-1">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-stalker-text">
                                    <Check className="h-4 w-4 text-stalker-green" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => alert(`Editing plan ${plan.name}`)}
                              >
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  plan.status === 'active' 
                                    ? 'border-stalker-red text-stalker-red hover:bg-stalker-red/10' 
                                    : 'border-stalker-green text-stalker-green hover:bg-stalker-green/10'
                                }
                                onClick={() => handleUpdatePlanStatus(plan.id)}
                              >
                                {plan.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
