"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, MessageSquare, Phone, Mail, HelpCircle, Flag, CheckCircle, Clock, User, Tag, RadiationIcon, LogOutIcon, EyeIcon, ReplyIcon } from "lucide-react";
import { useAdmin } from "@/components/admin-provider";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { StalkerSidebar } from "@/components/stalker-sidebar";
import { useState } from "react";

export default function AdminSupportPage() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const { t } = useTranslation();

  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Mock data for support tickets
  const [tickets, setTickets] = useState([
    { 
      id: 1, 
      user: 'John Smith', 
      subject: 'Unable to submit project', 
      category: 'technical', 
      priority: 'high', 
      status: 'open', 
      date: '2024-12-18 14:32',
      message: 'I am unable to submit my project. Getting an error message.',
      agent: 'Not assigned',
      replies: 3
    },
    { 
      id: 2, 
      user: 'Maria Garcia', 
      subject: 'Payment not processed', 
      category: 'billing', 
      priority: 'medium', 
      status: 'in-progress', 
      date: '2024-12-18 13:45',
      message: 'My payment was deducted but the funds did not reach my account.',
      agent: 'David Wilson',
      replies: 5
    },
    { 
      id: 3, 
      user: 'David Chen', 
      subject: 'Account verification issue', 
      category: 'account', 
      priority: 'low', 
      status: 'closed', 
      date: '2024-12-18 12:20',
      message: 'Having trouble verifying my account via email.',
      agent: 'Sarah Johnson',
      replies: 2
    },
    { 
      id: 4, 
      user: 'Sarah Williams', 
      subject: 'Feature request', 
      category: 'feature', 
      priority: 'low', 
      status: 'open', 
      date: '2024-12-18 11:15',
      message: 'Would like to see a dark mode option for the platform.',
      agent: 'Not assigned',
      replies: 1
    },
    { 
      id: 5, 
      user: 'Michael Brown', 
      subject: 'Security concern', 
      category: 'security', 
      priority: 'high', 
      status: 'in-progress', 
      date: '2024-12-18 10:30',
      message: 'Received suspicious email claiming to be from the platform.',
      agent: 'Robert Davis',
      replies: 4
    },
  ]);

  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? {...ticket, status: newStatus} : ticket
    ));
    alert(`Ticket #${ticketId} status updated to ${newStatus}`);
  };

  const handleAssignAgent = (ticketId: number) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? {...ticket, agent: 'Current Agent'} : ticket
    ));
    alert(`Ticket #${ticketId} assigned to current agent`);
  };

  const handleReply = (ticketId: number) => {
    if (replyText.trim()) {
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? {...ticket, replies: ticket.replies + 1} : ticket
      ));
      setReplyText('');
      alert(`Reply sent to ticket #${ticketId}`);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'inbox') return ticket.status === 'open';
    if (activeTab === 'in-progress') return ticket.status === 'in-progress';
    if (activeTab === 'resolved') return ticket.status === 'closed';
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'technical': return 'bg-stalker-blue/20 text-stalker-blue';
      case 'billing': return 'bg-stalker-green/20 text-stalker-green';
      case 'account': return 'bg-stalker-yellow/20 text-stalker-yellow';
      case 'feature': return 'bg-stalker-purple/20 text-stalker-purple';
      case 'security': return 'bg-stalker-red/20 text-stalker-red';
      default: return 'bg-stalker-border/20 text-stalker-text';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-stalker-red text-stalker-dark';
      case 'medium': return 'bg-stalker-yellow text-stalker-dark';
      case 'low': return 'bg-stalker-green text-stalker-dark';
      default: return 'bg-stalker-border text-stalker-text';
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
                  SUPPORT CENTER
                </h1>
                <p className="text-stalker-muted mt-2 flex items-center gap-2">
                  <RadiationIcon className="h-4 w-4 text-stalker-yellow" />
                  Manage user support tickets and inquiries
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
                  activeTab === 'inbox'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('inbox')}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Inbox ({tickets.filter(t => t.status === 'open').length})
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'in-progress'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('in-progress')}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                In Progress ({tickets.filter(t => t.status === 'in-progress').length})
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'resolved'
                    ? 'text-stalker-green border-b-2 border-stalker-green'
                    : 'text-stalker-muted hover:text-stalker-text'
                }`}
                onClick={() => setActiveTab('resolved')}
              >
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Resolved ({tickets.filter(t => t.status === 'closed').length})
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tickets List */}
              <div className="lg:col-span-2">
                <Card className="bg-stalker-card border-stalker-border shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-stalker-red to-stalker-orange p-4">
                    <CardTitle className="text-stalker-dark flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Support Tickets</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative w-full sm:w-64">
                          <Input 
                            placeholder="Search tickets..." 
                            className="pl-10 w-full py-2 bg-stalker-dark text-stalker-text border-stalker-border"
                          />
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stalker-muted" />
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  <CardContent className="pt-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredTickets.map((ticket) => (
                        <Card 
                          key={ticket.id} 
                          className={`bg-stalker-darker border-stalker-border p-4 cursor-pointer hover:bg-stalker-darker/80 transition-colors ${
                            selectedTicket?.id === ticket.id ? 'ring-2 ring-stalker-green' : ''
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-stalker-green">{ticket.subject}</h3>
                                <Badge className={getCategoryColor(ticket.category)}>
                                  <Tag className="h-3 w-3 mr-1" />
                                  {ticket.category}
                                </Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-stalker-text">
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {ticket.user}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {ticket.date}
                                </span>
                                <span>
                                  Replies: {ticket.replies}
                                </span>
                              </div>
                              <p className="mt-2 text-stalker-muted line-clamp-2">{ticket.message}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge 
                                variant="default"
                                className={
                                  ticket.status === 'open' 
                                    ? 'bg-stalker-yellow text-stalker-dark' 
                                    : ticket.status === 'in-progress'
                                      ? 'bg-stalker-blue text-stalker-dark'
                                      : 'bg-stalker-green text-stalker-dark'
                                }
                              >
                                {ticket.status.replace('-', ' ')}
                              </Badge>
                              <div className="text-xs text-stalker-muted">
                                Agent: {ticket.agent}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Ticket Details Panel */}
              <div>
                {selectedTicket ? (
                  <Card className="bg-stalker-card border-stalker-border shadow-xl">
                    <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                      <CardTitle className="text-stalker-dark flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        <span>Ticket #{selectedTicket.id}</span>
                      </CardTitle>
                    </div>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-stalker-green">{selectedTicket.subject}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getCategoryColor(selectedTicket.category)}>
                              {selectedTicket.category}
                            </Badge>
                            <Badge className={getPriorityColor(selectedTicket.priority)}>
                              {selectedTicket.priority} priority
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex items-center gap-2 text-sm text-stalker-text">
                            <User className="h-4 w-4" />
                            <span>From: {selectedTicket.user}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stalker-text mt-1">
                            <Clock className="h-4 w-4" />
                            <span>Date: {selectedTicket.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stalker-text mt-1">
                            <Flag className="h-4 w-4" />
                            <span>Status: {selectedTicket.status}</span>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="font-medium text-stalker-text mb-2">Message:</h4>
                          <p className="text-stalker-text bg-stalker-darker p-3 rounded">
                            {selectedTicket.message}
                          </p>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="font-medium text-stalker-text mb-2">Agent:</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-stalker-text">{selectedTicket.agent}</span>
                            {selectedTicket.agent === 'Not assigned' && (
                              <Button 
                                onClick={() => handleAssignAgent(selectedTicket.id)}
                                variant="outline"
                                size="sm"
                                className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                              >
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="font-medium text-stalker-text mb-2">Reply:</h4>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            rows={4}
                            className="bg-stalker-darker border-stalker-border text-stalker-text"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button 
                              onClick={() => handleReply(selectedTicket.id)}
                              className="flex-1 bg-stalker-green text-stalker-dark hover:bg-stalker-green/90"
                            >
                              <ReplyIcon className="h-4 w-4 mr-2" />
                              Send Reply
                            </Button>
                            
                            {selectedTicket.status !== 'closed' && (
                              <Button 
                                onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                                variant="outline"
                                className="border-stalker-green text-stalker-green hover:bg-stalker-green/10"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Close
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="font-medium text-stalker-text mb-2">Actions:</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={
                                selectedTicket.status === 'open' 
                                  ? 'border-stalker-blue text-stalker-blue hover:bg-stalker-blue/10'
                                  : 'border-stalker-border text-stalker-text hover:bg-stalker-border'
                              }
                              onClick={() => handleStatusChange(selectedTicket.id, 'in-progress')}
                            >
                              Mark In Progress
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-stalker-yellow text-stalker-yellow hover:bg-stalker-yellow/10"
                              onClick={() => handleStatusChange(selectedTicket.id, 'open')}
                            >
                              Reopen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-stalker-card border-stalker-border shadow-xl">
                    <div className="bg-gradient-to-r from-stalker-blue to-stalker-purple p-4">
                      <CardTitle className="text-stalker-dark flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        <span>Select a Ticket</span>
                      </CardTitle>
                    </div>
                    <CardContent className="pt-6 text-center text-stalker-muted">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a ticket from the list to view details and respond</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}