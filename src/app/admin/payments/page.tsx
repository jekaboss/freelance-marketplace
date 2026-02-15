"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, DollarSign, CreditCard, TrendingDown, TrendingUp, Calendar, Filter, RadiationIcon, LogOutIcon, EyeIcon, CheckIcon, XIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminPaymentsPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    router.push('/admin/login');
    return null;
  }

  // Mock data for transactions
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      user: 'John Smith', 
      amount: 2500, 
      currency: 'USD', 
      type: 'payment', 
      status: 'completed', 
      date: '2024-12-18 14:32',
      projectId: 'P-1001',
      fee: 150
    },
    { 
      id: 2, 
      user: 'Maria Garcia', 
      amount: 1800, 
      currency: 'USD', 
      type: 'withdrawal', 
      status: 'pending', 
      date: '2024-12-18 13:45',
      projectId: 'P-1002',
      fee: 0
    },
    { 
      id: 3, 
      user: 'David Chen', 
      amount: 3200, 
      currency: 'USD', 
      type: 'payment', 
      status: 'refunded', 
      date: '2024-12-18 12:20',
      projectId: 'P-1003',
      fee: 192
    },
    { 
      id: 4, 
      user: 'Sarah Williams', 
      amount: 1500, 
      currency: 'USD', 
      type: 'payment', 
      status: 'completed', 
      date: '2024-12-18 11:15',
      projectId: 'P-1004',
      fee: 90
    },
    { 
      id: 5, 
      user: 'Michael Brown', 
      amount: 4500, 
      currency: 'USD', 
      type: 'withdrawal', 
      status: 'completed', 
      date: '2024-12-18 10:30',
      projectId: 'P-1005',
      fee: 0
    },
    { 
      id: 6, 
      user: 'Elena Petrova', 
      amount: 2100, 
      currency: 'USD', 
      type: 'payment', 
      status: 'disputed', 
      date: '2024-12-18 09:45',
      projectId: 'P-1006',
      fee: 126
    },
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });

  const handleRefund = (id: number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? {...t, status: 'refunded'} : t
    ));
    alert(`Transaction #${id} refunded successfully!`);
  };

  const handleApprove = (id: number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? {...t, status: 'completed'} : t
    ));
    alert(`Transaction #${id} approved successfully!`);
  };

  const handleDispute = (id: number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? {...t, status: 'disputed'} : t
    ));
    alert(`Transaction #${id} disputed successfully!`);
  };

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filters.status === 'all' || transaction.status === filters.status) &&
      (filters.type === 'all' || transaction.type === filters.type)
    );
  });

  const totalPayments = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.fee, 0);

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
                  PAYMENT MANAGEMENT
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Monitor and manage platform transactions
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
          
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-green">
                    ${totalPayments.toLocaleString()}
                  </div>
                  <div className="text-stalker-muted mt-1">Total Payments</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-blue">
                    ${totalWithdrawals.toLocaleString()}
                  </div>
                  <div className="text-stalker-muted mt-1">Total Withdrawals</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-yellow">
                    ${totalFees.toLocaleString()}
                  </div>
                  <div className="text-stalker-muted mt-1">Total Fees</div>
                </CardContent>
              </Card>
              
              <Card className="bg-stalker-card border-stalker-border shadow-xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-stalker-purple">
                    {transactions.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-stalker-muted mt-1">Pending Actions</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-stalker-dark">
                  <span className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Transaction Records
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Input 
                        placeholder="Search transactions..." 
                        className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                      />
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        value={filters.status} 
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="refunded">Refunded</option>
                        <option value="disputed">Disputed</option>
                      </select>
                      
                      <select 
                        value={filters.type} 
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                        className="bg-stalker-darker text-stalker-text border-stalker-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stalker-green"
                      >
                        <option value="all">All Types</option>
                        <option value="payment">Payment</option>
                        <option value="withdrawal">Withdrawal</option>
                      </select>
                    </div>
                  </div>
                </CardTitle>
              </div>
              
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stalker-border">
                      <tr>
                        <th className="text-left py-3 px-4 rounded-tl-lg text-stalker-green">ID</th>
                        <th className="text-left py-3 px-4 text-stalker-green">User</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Amount</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Type</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Status</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Date</th>
                        <th className="text-left py-3 px-4 text-stalker-green">Project</th>
                        <th className="text-left py-3 px-4 rounded-tr-lg text-stalker-green">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-stalker-border hover:bg-stalker-darker">
                          <td className="py-3 px-4 font-medium text-stalker-green">#{transaction.id}</td>
                          <td className="py-3 px-4 text-stalker-text">{transaction.user}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-stalker-green" />
                              <span className={transaction.type === 'payment' ? 'text-stalker-green' : 'text-stalker-blue'}>
                                {transaction.amount.toLocaleString()} {transaction.currency}
                              </span>
                            </div>
                            {transaction.fee > 0 && (
                              <div className="text-xs text-stalker-muted">
                                Fee: ${transaction.fee} ({Math.round((transaction.fee / transaction.amount) * 100)}%)
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="secondary"
                              className={
                                transaction.type === 'payment' 
                                  ? 'bg-stalker-green/20 text-stalker-green' 
                                  : 'bg-stalker-blue/20 text-stalker-blue'
                              }
                            >
                              {transaction.type === 'payment' ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="default"
                              className={
                                transaction.status === 'completed' 
                                  ? 'bg-stalker-green text-stalker-dark' 
                                  : transaction.status === 'pending'
                                    ? 'bg-stalker-yellow text-stalker-dark'
                                    : transaction.status === 'refunded'
                                      ? 'bg-stalker-border text-stalker-text'
                                      : 'bg-stalker-red text-stalker-dark'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-stalker-text">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-stalker-muted" />
                              {transaction.date}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stalker-text">{transaction.projectId}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-stalker-border text-stalker-text hover:bg-stalker-border"
                                onClick={() => alert(`Viewing transaction details for #${transaction.id}`)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              
                              {transaction.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                                    onClick={() => handleApprove(transaction.id)}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-stalker-red text-stalker-red hover:bg-stalker-red/10"
                                    onClick={() => handleDispute(transaction.id)}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              {transaction.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                                  onClick={() => handleRefund(transaction.id)}
                                >
                                  Refund
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="text-stalker-muted">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-stalker-border text-stalker-text hover:bg-stalker-border">
                      Previous
                    </Button>
                    <Button className="bg-stalker-green text-stalker-dark hover:bg-stalker-green/90">
                      Next
                    </Button>
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