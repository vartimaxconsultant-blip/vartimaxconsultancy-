import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  Send,
  RefreshCw,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  Lock,
  LogOut,
  Sliders,
  ChevronRight,
  Sparkles,
  Award,
  Zap,
  Check,
  Building,
  UserCheck,
  History,
  AlertCircle,
  Trash2,
  ClipboardList,
  ArrowRightLeft,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { AgentProfile, CRMLeadRecord, CRMStats, CRMLeadStatus, CRMActivityType, AgentDailyReport } from '../types';
import { AgentWorkingPanel } from '../components/crm/AgentWorkingPanel';
import { DeleteAgentModal } from '../components/crm/DeleteAgentModal';
import { TransferLeadsModal } from '../components/crm/TransferLeadsModal';
import { SuspendAgentModal } from '../components/crm/SuspendAgentModal';
import { CrmLoginGate } from '../components/crm/CrmLoginGate';

interface CrmPortalPageProps {
  onOpenConsultation?: () => void;
}

export const CrmPortalPage: React.FC<CrmPortalPageProps> = () => {
  // Authentication & Current User State - Default to null if not stored so user chooses role
  const [currentAgent, setCurrentAgent] = useState<AgentProfile | null>(() => {
    const saved = localStorage.getItem('vartimax_crm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [leads, setLeads] = useState<CRMLeadRecord[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [followUpInterval, setFollowUpInterval] = useState(3);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Tabs for Admin/Owner vs Agent
  const [activeTab, setActiveTab] = useState<'leads' | 'stalled' | 'agents' | 'daily_reports' | 'activity' | 'settings'>('leads');
  const [agentFilter, setAgentFilter] = useState<'all' | 'overdue' | 'in_progress' | 'docs' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');

  // Daily Reports State (Owner View)
  const [dailyReports, setDailyReports] = useState<AgentDailyReport[]>([]);
  const [selectedReportAgentFilter, setSelectedReportAgentFilter] = useState<string>('ALL');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentDesignation, setNewAgentDesignation] = useState('Visa Consultant');
  const [newAgentPin, setNewAgentPin] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<'agent' | 'admin'>('agent');

  // Delete Agent Modal State
  const [agentToDelete, setAgentToDelete] = useState<AgentProfile | null>(null);
  const [isDeleteAgentModalOpen, setIsDeleteAgentModalOpen] = useState(false);

  // Transfer Leads Modal State
  const [agentForTransfer, setAgentForTransfer] = useState<AgentProfile | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Suspend Agent Modal State
  const [agentForSuspend, setAgentForSuspend] = useState<AgentProfile | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Lead Action Modals
  const [activeLeadForActivity, setActiveLeadForActivity] = useState<CRMLeadRecord | null>(null);
  const [activityType, setActivityType] = useState<CRMActivityType>('whatsapp');
  const [activityNote, setActivityNote] = useState('');
  const [newStatus, setNewStatus] = useState<CRMLeadStatus | ''>('');
  const [nextFollowUpDays, setNextFollowUpDays] = useState(3);

  const [activeLeadForDetails, setActiveLeadForDetails] = useState<CRMLeadRecord | null>(null);
  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
  const [selectedAssignAgentId, setSelectedAssignAgentId] = useState<string>('');

  const isAdmin = currentAgent?.role === 'admin';

  // Persist current session
  useEffect(() => {
    if (currentAgent) {
      localStorage.setItem('vartimax_crm_current_user', JSON.stringify(currentAgent));
    } else {
      localStorage.removeItem('vartimax_crm_current_user');
    }
  }, [currentAgent]);

  // Fetch CRM Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Agents
      const agentsRes = await fetch('/api/crm/agents');
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.agents || []);
      }

      // 2. Fetch Stats
      const statsRes = await fetch('/api/crm/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      // 3. Fetch Config
      const configRes = await fetch('/api/crm/config');
      if (configRes.ok) {
        const data = await configRes.json();
        setAutoAssignEnabled(data.config?.autoAssignEnabled ?? true);
        setFollowUpInterval(data.config?.followUpIntervalDays ?? 3);
      }

      // 4. Fetch Leads (Strict isolation: if agent, send their ID)
      const leadUrl = !isAdmin && currentAgent ? `/api/crm/leads?agentId=${currentAgent.id}` : '/api/crm/leads';
      const leadsRes = await fetch(leadUrl);
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      // 5. Fetch Daily Reports (if admin)
      if (isAdmin) {
        const reportsRes = await fetch('/api/crm/daily-reports');
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setDailyReports(data.reports || []);
        }
      }
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentAgent]);

  const handleAgentDeleted = (deletedId: string, reallocatedCount: number) => {
    setActionSuccess(`Agent ${deletedId} deleted. ${reallocatedCount} active lead(s) reallocated safely.`);
    fetchData();
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleLeadsTransferred = (count: number, targetName: string) => {
    setActionSuccess(`Successfully transferred ${count} active lead(s) to ${targetName}.`);
    fetchData();
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleAgentSuspensionChanged = (updatedAgent: AgentProfile, transferredCount?: number) => {
    if (updatedAgent.active) {
      setActionSuccess(`Consultant ${updatedAgent.name} (${updatedAgent.id}) reactivated. Portal access restored.`);
    } else {
      setActionSuccess(
        `Consultant ${updatedAgent.name} (${updatedAgent.id}) suspended. Portal access revoked.${
          transferredCount ? ` ${transferredCount} lead(s) transferred.` : ''
        }`
      );
    }
    fetchData();
    setTimeout(() => setActionSuccess(null), 4000);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Switch / Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/crm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId, pin: loginPin })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed');
        return;
      }
      setCurrentAgent(data.agent);
      setIsLoginModalOpen(false);
      setLoginId('');
      setLoginPin('');
      setActionSuccess(`Switched to ${data.agent.name} (${data.agent.role.toUpperCase()})`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      setLoginError('Connection error. Please try again.');
    }
  };

  // Quick switch profile for demonstration
  const handleQuickSwitch = (agent: AgentProfile) => {
    setCurrentAgent(agent);
    setActionSuccess(`Switched view to ${agent.name} [${agent.role === 'admin' ? 'Owner / Admin' : 'Agent'}]`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Toggle Auto Assign
  const handleToggleAutoAssign = async () => {
    const newVal = !autoAssignEnabled;
    setAutoAssignEnabled(newVal);
    try {
      await fetch('/api/crm/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoAssignEnabled: newVal })
      });
      setActionSuccess(`Auto-assignment ${newVal ? 'Enabled (Round-Robin)' : 'Disabled (Manual Mode)'}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      setAutoAssignEnabled(!newVal);
    }
  };

  // Create New Agent
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentPin) return;

    try {
      const res = await fetch('/api/crm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAgentName,
          email: newAgentEmail,
          phone: newAgentPhone,
          designation: newAgentDesignation,
          pin: newAgentPin,
          role: newAgentRole
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsNewAgentModalOpen(false);
        setNewAgentName('');
        setNewAgentEmail('');
        setNewAgentPhone('');
        setNewAgentPin('');
        setActionSuccess(`New Agent ID ${data.agent.id} created for ${data.agent.name}!`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchData();
      } else {
        alert(data.error || 'Failed to create agent');
      }
    } catch {
      alert('Error creating agent account');
    }
  };

  // Assign Lead to Agent
  const handleAssignLead = async (leadId: string, agentId: string) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });
      if (res.ok) {
        const data = await res.json();
        setActionSuccess(data.message || 'Lead assigned successfully.');
        setTimeout(() => setActionSuccess(null), 3000);
        setAssigningLeadId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Log Daily Progress / Activity
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForActivity || !activityNote.trim()) return;

    try {
      const res = await fetch(`/api/crm/leads/${activeLeadForActivity.id}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: currentAgent?.id,
          agentName: currentAgent?.name,
          type: activityType,
          note: activityNote,
          newStatus: newStatus || undefined,
          nextFollowUpDays
        })
      });

      if (res.ok) {
        setActionSuccess('Daily progress recorded & 3-day follow-up refreshed!');
        setTimeout(() => setActionSuccess(null), 3500);
        setActiveLeadForActivity(null);
        setActivityNote('');
        setNewStatus('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to record activity');
    }
  };

  // Owner Ping Agent for Stalled Lead
  const handlePingAgent = async (lead: CRMLeadRecord) => {
    try {
      const res = await fetch('/api/crm/followup-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          customMessage: `Owner Reminder: Lead ${lead.fullName} has had no progress for ${lead.daysSinceLastActivity || 3} days. Please update status immediately.`
        })
      });
      if (res.ok) {
        setActionSuccess(`Follow-up alert sent to ${lead.assignedAgentName}!`);
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch {
      alert('Failed to dispatch alert');
    }
  };

  // WhatsApp 1-Click Messaging Helper
  const openWhatsApp = (phone: string, clientName: string, country: string, isFollowUp: boolean) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const msg = isFollowUp
      ? `Assalam-o-Alaikum ${clientName},\nMain ${currentAgent?.name || 'VartiMax Consultant'} baat kar raha hoon VartiMax Islamabad office say.\nAap ki ${country} visa application ke hawale say 3-day file follow-up update darkar hai. Kindly batayein documents arrange ho gaye hain taake file proceed karein? Shukriya!\n\nOffice 78, Gaga Downtown, Islamabad\nHelpline: +92 340 1207525`
      : `Assalam-o-Alaikum ${clientName},\nThank you for reaching out to VartiMax Consultant Islamabad for your ${country} visa application.\nMain ${currentAgent?.name || 'aap ka Case Officer'} aap ki profile review kar raha hoon. Kindly apni availability batayein for detailed assessment.\n\nOffice 78, Basement, Gaga Downtown, Islamabad`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.fullName.toLowerCase().includes(q) ||
        l.whatsapp.includes(q) ||
        l.targetCountry.toLowerCase().includes(q) ||
        l.assignedAgentName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Agent dropdown filter (in admin view)
    if (isAdmin && selectedAgentFilter !== 'ALL') {
      if (l.assignedAgentId !== selectedAgentFilter) return false;
    }

    // Status filter
    if (agentFilter === 'overdue') return l.isOverdueFollowUp;
    if (agentFilter === 'in_progress') return l.status === 'in_progress' || l.status === 'contacted';
    if (agentFilter === 'docs') return l.status === 'docs_pending';
    if (agentFilter === 'approved') return l.status === 'approved';

    return true;
  });

  const stalledLeads = leads.filter((l) => l.isOverdueFollowUp);

  // If no user is logged in, show the dual Login Gate (Agent Desk or Director Command)
  if (!currentAgent) {
    return (
      <div className="min-h-screen bg-[#041E42] text-slate-100 font-sans">
        <CrmLoginGate
          onLoginSuccess={(agent) => {
            setCurrentAgent(agent);
            setActionSuccess(`Welcome, ${agent.name} (${agent.role.toUpperCase()})`);
            setTimeout(() => setActionSuccess(null), 3000);
            fetchData();
          }}
          availableAgents={agents}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061C38] text-slate-100 font-sans pb-20">
      {/* Top Banner & User Role Bar */}
      <div className="bg-[#092E5E] border-b border-[#C5A059]/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              {isAdmin ? <ShieldCheck className="w-6 h-6 text-[#C5A059]" /> : <Users className="w-6 h-6 text-[#C5A059]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {isAdmin ? 'VartiMax Owner & Admin Command Center' : 'VartiMax Consultant Agent Workspace'}
                </h1>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {isAdmin ? '👑 Owner Mode' : `👤 Agent: ${currentAgent?.name}`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{currentAgent?.name}</strong> ({currentAgent?.id}) &bull;{' '}
                {currentAgent?.designation}
              </p>
            </div>
          </div>

          {/* Quick Demo Role Switcher & PIN Login */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden lg:flex items-center gap-1.5 bg-[#061C38] px-2 py-1 rounded-lg border border-slate-700/60 text-xs">
              <span className="text-slate-400 font-medium mr-1 text-[11px]">Quick Switch:</span>
              <button
                onClick={() =>
                  handleQuickSwitch({
                    id: 'ADMIN-01',
                    name: 'Executive Director / Owner',
                    email: 'vartimaxconsultant@gmail.com',
                    phone: '+92 340 1207525',
                    designation: 'Managing Director & Principal Consultant',
                    role: 'admin',
                    pin: '7860',
                    active: true,
                    createdAt: ''
                  })
                }
                className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-[#C5A059] text-[#042354] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Owner View
              </button>

              {agents
                .filter((a) => a.role === 'agent')
                .slice(0, 3)
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleQuickSwitch(a)}
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all cursor-pointer ${
                      currentAgent?.id === a.id
                        ? 'bg-[#C5A059] text-[#042354] shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {a.name.split(' ')[0]} ({a.id})
                  </button>
                ))}
            </div>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Login PIN</span>
            </button>

            {/* Logout / Switch Role Button to return to Gate */}
            <button
              id="crm-header-logout-btn"
              onClick={() => {
                setCurrentAgent(null);
                localStorage.removeItem('vartimax_crm_current_user');
              }}
              className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Logout and switch to role access gateway"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Switch / Logout</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center sticky top-14 z-20 shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3-Day Follow-Up Alert for Active Agent */}
      {!isAdmin && stalledLeads.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-200">
                  ⚠️ Action Required: {stalledLeads.length} Lead(s) Exceeded 3-Day Follow-Up Target!
                </h3>
                <p className="text-xs text-red-300/80">
                  In accordance with VartiMax consulting policy, clients must receive regular updates every 3 days.
                  Kindly update your progress or contact the clients below.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAgentFilter('overdue')}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shrink-0 shadow cursor-pointer"
            >
              View Stalled Leads ({stalledLeads.length})
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-[#092E5E]/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white">{stats?.totalLeads ?? leads.length}</span>
              <span className="text-[11px] text-[#C5A059] font-semibold">Active Pool</span>
            </div>
          </div>

          <div className="bg-[#092E5E]/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Unassigned
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-400">
                {stats?.unassignedCount ?? leads.filter((l) => l.assignedAgentId === 'unassigned').length}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                Needs Lead
              </span>
            </div>
          </div>

          <div className="bg-[#092E5E]/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              In Progress
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-cyan-400">
                {stats?.inProgressCount ?? leads.filter((l) => l.status === 'in_progress').length}
              </span>
              <span className="text-[11px] text-cyan-300 font-semibold">Under Prep</span>
            </div>
          </div>

          <div className="bg-[#092E5E]/80 border border-red-500/30 rounded-xl p-3.5 shadow-sm bg-red-950/20">
            <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider block flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              &gt;3 Days Stalled
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-red-400">
                {stats?.overdueFollowUpCount ?? stalledLeads.length}
              </span>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold animate-pulse">
                Action Due
              </span>
            </div>
          </div>

          <div className="bg-[#092E5E]/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Visa Approved
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-400">
                {stats?.approvedCount ?? leads.filter((l) => l.status === 'approved').length}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Success</span>
            </div>
          </div>

          <div className="bg-[#092E5E]/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Agents
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#C5A059]">
                {agents.filter((a) => a.active && a.role === 'agent').length}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* ROLE SEPARATION: AGENT WORKING DESK vs OWNER COMMAND CENTER */}
        {!isAdmin && currentAgent ? (
          <AgentWorkingPanel
            currentAgent={currentAgent}
            leads={leads}
            onRefresh={fetchData}
            onOpenActivityModal={(lead) => {
              setActiveLeadForActivity(lead);
              setNewStatus(lead.status);
            }}
            onOpenDetailsModal={(lead) => setActiveLeadForDetails(lead)}
            openWhatsApp={openWhatsApp}
          />
        ) : (
          <>
            {/* OWNER VIEW: Navigation Tabs & Controls */}
            <div className="bg-[#092E5E] border border-slate-700/80 rounded-xl p-2 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'leads'
                      ? 'bg-[#C5A059] text-[#042354] shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Master Leads &amp; Delegation</span>
                  <span className="bg-[#042354]/20 text-[#042354] px-1.5 py-0.2 rounded text-[10px] font-black">
                    {leads.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('stalled')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'stalled'
                      ? 'bg-red-500 text-white shadow'
                      : 'text-red-300 hover:text-white hover:bg-red-500/10'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>3-Day Follow-Up Watchlist</span>
                  {stalledLeads.length > 0 && (
                    <span className="bg-white text-red-600 px-1.5 py-0.2 rounded text-[10px] font-black">
                      {stalledLeads.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('agents')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'agents'
                      ? 'bg-[#C5A059] text-[#042354] shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Staff &amp; Agent IDs</span>
                  <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                    {agents.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('daily_reports')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'daily_reports'
                      ? 'bg-[#C5A059] text-[#042354] shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Daily Staff Reports</span>
                  <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                    {dailyReports.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'activity'
                      ? 'bg-[#C5A059] text-[#042354] shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Live Activity Stream</span>
                </button>
              </div>

              {/* Auto-Assignment Toggle for Owner */}
              <div className="flex items-center gap-3 bg-[#061C38] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${autoAssignEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>Auto-Assign (Round-Robin):</span>
                </span>
                <button
                  onClick={handleToggleAutoAssign}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    autoAssignEnabled
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {autoAssignEnabled ? 'ACTIVE' : 'OFF (Manual)'}
                </button>
              </div>
            </div>

        {/* TAB 1: MASTER LEADS / AGENT LEADS TABLE */}
        {activeTab === 'leads' && (
          <div className="bg-[#092E5E] border border-slate-700/80 rounded-xl overflow-hidden shadow-lg">
            {/* Table Header Filter & Search */}
            <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#08264e]">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client, phone, country, or Ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Admin Agent Filter Dropdown */}
              {isAdmin && (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter Agent:</span>
                  <select
                    value={selectedAgentFilter}
                    onChange={(e) => setSelectedAgentFilter(e.target.value)}
                    className="bg-[#061C38] border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="ALL">All Agents &amp; Unassigned</option>
                    <option value="unassigned">⚠️ Unassigned Pool Only</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Leads List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#05172e] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Client / Contact</th>
                    <th className="py-3 px-4">Target Destination</th>
                    <th className="py-3 px-4">Assigned Agent</th>
                    <th className="py-3 px-4">Case Status</th>
                    <th className="py-3 px-4">3-Day Follow-Up Health</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        <p className="font-semibold text-sm">No visa inquiries match this filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const isOverdue = lead.isOverdueFollowUp;
                      return (
                        <tr
                          key={lead.id}
                          className={`hover:bg-[#0c3973]/40 transition-colors ${
                            isOverdue ? 'bg-red-950/15' : ''
                          }`}
                        >
                          {/* Client Info */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm">{lead.fullName}</div>
                            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                              <span>{lead.whatsapp}</span>
                              {lead.docReferenceId && (
                                <span className="bg-[#C5A059]/20 text-[#F5CE6D] px-1.5 py-0.2 rounded text-[10px] font-mono">
                                  {lead.docReferenceId}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Intake: {lead.intakeDate || 'Upcoming'}
                            </div>
                          </td>

                          {/* Country & Category */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#F5CE6D]">{lead.targetCountry}</div>
                            <span className="capitalize text-slate-400 text-[11px] inline-block mt-0.5">
                              {lead.visaType} visa
                            </span>
                          </td>

                          {/* Assigned Agent */}
                          <td className="py-3 px-4">
                            {lead.assignedAgentId === 'unassigned' ? (
                              <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
                                <span>Unassigned</span>
                              </div>
                            ) : (
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                  <span>{lead.assignedAgentName}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {lead.assignedAgentId}
                                </span>
                              </div>
                            )}

                            {/* Reassign Dropdown for Admin */}
                            {isAdmin && (
                              <div className="mt-1.5">
                                {assigningLeadId === lead.id ? (
                                  <div className="flex items-center gap-1">
                                    <select
                                      value={selectedAssignAgentId}
                                      onChange={(e) => setSelectedAssignAgentId(e.target.value)}
                                      className="bg-[#061C38] border border-[#C5A059] rounded px-1.5 py-1 text-[11px] text-white"
                                    >
                                      <option value="">Choose...</option>
                                      <option value="unassigned">Unassign</option>
                                      {agents
                                        .filter((a) => a.active && a.role === 'agent')
                                        .map((a) => (
                                          <option key={a.id} value={a.id}>
                                            {a.name} ({a.id})
                                          </option>
                                        ))}
                                    </select>
                                    <button
                                      onClick={() => {
                                        if (selectedAssignAgentId) {
                                          handleAssignLead(lead.id, selectedAssignAgentId);
                                        }
                                      }}
                                      className="bg-[#C5A059] text-[#042354] p-1 rounded font-bold hover:bg-[#d8b368] cursor-pointer"
                                      title="Confirm"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => setAssigningLeadId(null)}
                                      className="text-slate-400 hover:text-white p-1"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAssigningLeadId(lead.id);
                                      setSelectedAssignAgentId(lead.assignedAgentId);
                                    }}
                                    className="text-[10px] text-[#C5A059] hover:underline font-semibold cursor-pointer"
                                  >
                                    ⇄ Reassign
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                lead.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : lead.status === 'embassy_ready'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : lead.status === 'docs_pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : lead.status === 'in_progress'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {lead.status.replace('_', ' ')}
                            </span>
                            {lead.notes && (
                              <p className="text-[11px] text-slate-400 mt-1 max-w-xs truncate" title={lead.notes}>
                                {lead.notes}
                              </p>
                            )}
                          </td>

                          {/* 3-Day Follow-Up Health */}
                          <td className="py-3 px-4">
                            {lead.status === 'approved' || lead.status === 'rejected' ? (
                              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </span>
                            ) : isOverdue ? (
                              <div>
                                <span className="inline-flex items-center gap-1 bg-red-500/25 text-red-300 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>🚨 3-Day Follow-Up Due</span>
                                </span>
                                <div className="text-[10px] text-red-300 font-semibold mt-0.5">
                                  Inactive: {lead.daysSinceLastActivity ?? 3}+ days
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                                  <Clock className="w-3 h-3" />
                                  <span>Active &bull; {lead.daysSinceLastActivity ?? 0}d ago</span>
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  Next: {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1-Click WhatsApp Client */}
                              <button
                                onClick={() =>
                                  openWhatsApp(lead.whatsapp, lead.fullName, lead.targetCountry, isOverdue)
                                }
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              {/* Log Daily Progress (Agent / Admin) */}
                              <button
                                onClick={() => {
                                  setActiveLeadForActivity(lead);
                                  setNewStatus(lead.status);
                                }}
                                className="bg-[#C5A059] hover:bg-[#d4ad5a] text-[#042354] px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Log Progress & Reset 3-Day Timer"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Log Action</span>
                              </button>

                              {/* Owner Ping Agent if overdue */}
                              {isAdmin && isOverdue && (
                                <button
                                  onClick={() => handlePingAgent(lead)}
                                  className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Ping Agent for 3-Day Update"
                                >
                                  <Zap className="w-4 h-4" />
                                </button>
                              )}

                              {/* View Full Timeline History */}
                              <button
                                onClick={() => setActiveLeadForDetails(lead)}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="View History & Timeline"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: 3-DAY FOLLOW-UP WATCHLIST (STALLED LEADS) */}
        {activeTab === 'stalled' && (
          <div className="space-y-4">
            <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl">
                  <AlertTriangle className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    3-Day Follow-Up Stalled Watchlist ({stalledLeads.length} Cases)
                  </h2>
                  <p className="text-xs text-slate-300">
                    These clients have had no consultation note, call, or document review for 3 or more days. As Owner,
                    you can ping the assigned agent or step in directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stalledLeads.length === 0 ? (
                <div className="col-span-2 bg-[#092E5E] border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">Zero Stalled Leads!</h3>
                  <p className="text-xs mt-1">
                    All agents have performed client follow-ups within the 3-day window. Excellent operational health!
                  </p>
                </div>
              ) : (
                stalledLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#092E5E] border border-red-500/40 rounded-xl p-5 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white">{lead.fullName}</span>
                            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                              {lead.daysSinceLastActivity}+ DAYS INACTIVE
                            </span>
                          </div>
                          <p className="text-xs text-[#F5CE6D] font-medium mt-0.5">
                            {lead.targetCountry} &bull; {lead.visaType}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{lead.whatsapp}</span>
                      </div>

                      <div className="mt-4 bg-[#061C38] p-3 rounded-lg border border-slate-700/80 text-xs">
                        <div className="text-slate-400 text-[11px] flex items-center justify-between">
                          <span>
                            Assigned Agent: <strong className="text-white">{lead.assignedAgentName}</strong>
                          </span>
                          <span>Last Active: {new Date(lead.lastActivityAt).toLocaleDateString()}</span>
                        </div>
                        {lead.activities.length > 0 && (
                          <div className="mt-2 text-slate-300 italic">
                            &ldquo;{lead.activities[0].note}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openWhatsApp(lead.whatsapp, lead.fullName, lead.targetCountry, true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Client</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePingAgent(lead)}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>⚡ Ping Agent</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveLeadForActivity(lead);
                            setNewStatus(lead.status);
                          }}
                          className="bg-[#C5A059] hover:bg-[#d4ad5a] text-[#042354] text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Log Note</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STAFF & AGENT MANAGEMENT (ADMIN PANEL) */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#092E5E] border border-slate-700 p-4 rounded-xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#C5A059]" />
                  <span>Agent Accounts &amp; ID Registry</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Register new consultant IDs, set PIN credentials, and monitor individual workload and follow-up
                  compliance.
                </p>
              </div>

              <button
                onClick={() => setIsNewAgentModalOpen(true)}
                className="bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create New Agent ID</span>
              </button>
            </div>

            {/* Agent Roster Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-[#092E5E] border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{agent.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              agent.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {agent.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[#F5CE6D] font-medium mt-0.5">{agent.designation}</p>
                      </div>
                      <span className="font-mono text-xs bg-[#061C38] border border-slate-700 px-2 py-1 rounded font-bold text-slate-300">
                        {agent.id}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">WhatsApp Phone:</span>
                        <span className="font-mono text-white">{agent.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-200">{agent.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Portal Access:</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                            agent.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold'
                          }`}
                        >
                          {agent.active ? '● Active (آن ڈیوٹی)' : '⊘ Suspended / Leave (معطل)'}
                        </span>
                      </div>
                    </div>

                    {/* Performance Chips */}
                    <div className="grid grid-cols-3 gap-2 mt-4 bg-[#061C38] p-3 rounded-lg border border-slate-700 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Active Files</span>
                        <strong className="text-sm text-cyan-400">{agent.assignedLeadsCount ?? 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Approved</span>
                        <strong className="text-sm text-emerald-400">{agent.completedLeadsCount ?? 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">&gt;3d Stalled</span>
                        <strong
                          className={`text-sm ${
                            (agent.overdueCount ?? 0) > 0 ? 'text-red-400' : 'text-slate-400'
                          }`}
                        >
                          {agent.overdueCount ?? 0}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 space-y-2.5">
                    {/* Top subrow: Desk Login Link & WhatsApp */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleQuickSwitch(agent)}
                        className="text-xs text-[#C5A059] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        title="View portal as this agent"
                      >
                        <span>Workspace Desk ({agent.name.split(' ')[0]})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          window.open(`https://wa.me/${agent.phone.replace(/\D/g, '')}`, '_blank')
                        }
                        className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded hover:bg-slate-800 cursor-pointer"
                        title="Direct WhatsApp with Agent"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Executive Director Agent Management Row (Suspend, Transfer, Delete) */}
                    {agent.role !== 'admin' && agent.id !== 'ADMIN-01' ? (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {/* 1. Suspend / Reactivate Agent */}
                        <button
                          onClick={() => {
                            setAgentForSuspend(agent);
                            setIsSuspendModalOpen(true);
                          }}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            agent.active
                              ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                          }`}
                          title={agent.active ? 'Suspend agent / put on leave (block login)' : 'Reactivate consultant access'}
                        >
                          {agent.active ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                          <span>{agent.active ? 'Suspend' : 'Reactivate'}</span>
                        </button>

                        {/* 2. Transfer Leads */}
                        <button
                          onClick={() => {
                            setAgentForTransfer(agent);
                            setIsTransferModalOpen(true);
                          }}
                          className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title={`Transfer all active client files from ${agent.name} to another consultant`}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Transfer ({agent.assignedLeadsCount || 0})</span>
                        </button>

                        {/* 3. Delete Agent */}
                        <button
                          onClick={() => {
                            setAgentToDelete(agent);
                            setIsDeleteAgentModalOpen(true);
                          }}
                          className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title={`Permanently delete ${agent.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400/90 font-bold px-2 py-0.5 border border-amber-400/30 rounded bg-amber-500/10">
                          Master Executive Director
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: DAILY STAFF REPORTS (OWNER AUDIT) */}
        {activeTab === 'daily_reports' && (
          <div className="space-y-4">
            <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#C5A059]" />
                  <span>Agent Daily Progress Audit (اسٹاف کی روزانہ کارکردگی)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Full inspection of daily logs submitted by consultants: calls made, WhatsApp chats, client dossiers reviewed, and roadblocks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter by Agent:</span>
                <select
                  value={selectedReportAgentFilter}
                  onChange={(e) => setSelectedReportAgentFilter(e.target.value)}
                  className="bg-[#061C38] border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="ALL">All Consultants ({dailyReports.length} Reports)</option>
                  {agents
                    .filter((a) => a.role === 'agent')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.id})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Daily Reports Cards */}
            {dailyReports.length === 0 ? (
              <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                <ClipboardList className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Daily Progress Logs Submitted Yet</h3>
                <p className="text-xs mt-1">
                  When agents submit their daily progress reports from their working desk, they will appear here for audit.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyReports
                  .filter((rep) =>
                    selectedReportAgentFilter === 'ALL' ? true : rep.agentId === selectedReportAgentFilter
                  )
                  .map((report) => (
                    <div
                      key={report.id}
                      className="bg-[#092E5E] border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-700">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{report.agentName}</h4>
                              <span className="font-mono text-xs text-[#F5CE6D] font-bold bg-[#061C38] px-2 py-0.5 rounded border border-slate-800">
                                {report.agentId}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Report Date: <strong className="text-white">{report.date}</strong> &bull; Logged at{' '}
                              {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                            Verified Log
                          </span>
                        </div>

                        {/* Metric Cards */}
                        <div className="grid grid-cols-4 gap-2 my-3 bg-[#061C38] p-2.5 rounded-lg border border-slate-700 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Phone Calls</span>
                            <strong className="text-sm text-cyan-400">{report.callsCount}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">WhatsApp</span>
                            <strong className="text-sm text-emerald-400">{report.whatsAppCount}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Docs Verified</span>
                            <strong className="text-sm text-[#F5CE6D]">{report.docsReviewedCount}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Approved</span>
                            <strong className="text-sm text-emerald-400">{report.approvalsCount}</strong>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Today&apos;s Work Summary:</span>
                            <p className="text-slate-200 mt-0.5 bg-[#061C38]/60 p-2.5 rounded-lg border border-slate-800">
                              {report.summary}
                            </p>
                          </div>

                          {report.challengesFaced && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-amber-200 text-xs">
                              <strong className="text-amber-400 block text-[11px]">Roadblocks / Bottlenecks:</strong>
                              {report.challengesFaced}
                            </div>
                          )}

                          {report.tomorrowPlan && (
                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2 text-cyan-200 text-xs">
                              <strong className="text-cyan-400 block text-[11px]">Tomorrow&apos;s Target:</strong>
                              {report.tomorrowPlan}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            const ag = agents.find((a) => a.id === report.agentId);
                            if (ag?.phone) {
                              const msg = encodeURIComponent(
                                `Salam ${report.agentName}, Director here. Reviewed your daily report for ${report.date}. Great progress on the ${report.docsReviewedCount} docs and ${report.callsCount} calls.`
                              );
                              window.open(`https://wa.me/${ag.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                            }
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Send WhatsApp Feedback</span>
                        </button>

                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {report.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LIVE ACTIVITY AUDIT FEED */}
        {activeTab === 'activity' && (
          <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-5 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#C5A059]" />
              <span>Real-Time Consultant Activity Stream</span>
            </h2>

            <div className="space-y-3">
              {leads.flatMap((l) => l.activities).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No activities recorded yet.</p>
              ) : (
                leads
                  .flatMap((l) =>
                    l.activities.map((act) => ({
                      ...act,
                      clientName: l.fullName,
                      country: l.targetCountry
                    }))
                  )
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 30)
                  .map((act) => (
                    <div
                      key={act.id}
                      className="bg-[#061C38] border border-slate-700/80 p-3.5 rounded-lg flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#C5A059]/15 text-[#C5A059] shrink-0 mt-0.5">
                          {act.type === 'call' ? (
                            <Phone className="w-4 h-4" />
                          ) : act.type === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {act.agentName} &bull;{' '}
                            <span className="text-[#F5CE6D]">{act.clientName}</span> ({act.country})
                          </div>
                          <p className="text-slate-300 mt-1">{act.note}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                        {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PIN LOGIN / SWITCH USER */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#092E5E] border border-[#C5A059]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-bold text-white">Agent / Admin PIN Login</h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agent ID or Official Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. AGT-01 or ADMIN-01"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secret PIN Code</label>
                <input
                  type="password"
                  placeholder="e.g. 1001 or 7860"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  required
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {loginError && <p className="text-xs text-red-400 font-semibold">{loginError}</p>}

              <div className="bg-[#061C38] p-3 rounded-lg border border-slate-700 text-xs text-slate-400">
                <strong className="text-slate-300 block mb-1">Preset Testing Credentials:</strong>
                <div>&bull; Owner / Director: ID: <code className="text-amber-300">ADMIN-01</code> | PIN: <code className="text-amber-300">7860</code></div>
                <div>&bull; Bilal Khan (Agent 1): ID: <code className="text-emerald-300">AGT-01</code> | PIN: <code className="text-emerald-300">1001</code></div>
                <div>&bull; Maria Ahmed (Agent 2): ID: <code className="text-emerald-300">AGT-02</code> | PIN: <code className="text-emerald-300">1002</code></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-5 py-2 rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE NEW AGENT ID (ADMIN PANEL) */}
      {/* ========================================================================= */}
      {isNewAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#092E5E] border border-[#C5A059]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-bold text-white">Create New Consultant ID</h3>
              </div>
              <button
                onClick={() => setIsNewAgentModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Consultant Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hamza Rauf"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    required
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    placeholder="e.g. +92 300 9876543"
                    value={newAgentPhone}
                    onChange={(e) => setNewAgentPhone(e.target.value)}
                    required
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. hamza@vartimax.com"
                    value={newAgentEmail}
                    onChange={(e) => setNewAgentEmail(e.target.value)}
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Role / Access Level</label>
                  <select
                    value={newAgentRole}
                    onChange={(e) => setNewAgentRole(e.target.value as 'agent' | 'admin')}
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="agent">Standard Agent (Own Leads Only)</option>
                    <option value="admin">Administrator / Co-Owner (Full Access)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Specialty / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Schengen &amp; UK Study Consultant"
                  value={newAgentDesignation}
                  onChange={(e) => setNewAgentDesignation(e.target.value)}
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">4-Digit Access PIN *</label>
                <input
                  type="password"
                  placeholder="e.g. 2004"
                  value={newAgentPin}
                  onChange={(e) => setNewAgentPin(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsNewAgentModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-5 py-2 rounded-lg font-bold cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE AGENT CONFIRMATION & SAFEGUARD */}
      {/* ========================================================================= */}
      {agentToDelete && (
        <DeleteAgentModal
          agent={agentToDelete}
          availableAgents={agents}
          isOpen={isDeleteAgentModalOpen}
          onClose={() => {
            setIsDeleteAgentModalOpen(false);
            setAgentToDelete(null);
          }}
          onDeleted={handleAgentDeleted}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRANSFER LEADS TO ANOTHER AGENT */}
      {/* ========================================================================= */}
      {agentForTransfer && (
        <TransferLeadsModal
          fromAgent={agentForTransfer}
          availableAgents={agents}
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false);
            setAgentForTransfer(null);
          }}
          onTransferred={handleLeadsTransferred}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUSPEND / REACTIVATE AGENT (REVOKE/RESTORE PORTAL ACCESS) */}
      {/* ========================================================================= */}
      {agentForSuspend && (
        <SuspendAgentModal
          agent={agentForSuspend}
          availableAgents={agents}
          isOpen={isSuspendModalOpen}
          onClose={() => {
            setIsSuspendModalOpen(false);
            setAgentForSuspend(null);
          }}
          onSuspensionChanged={handleAgentSuspensionChanged}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LOG DAILY PROGRESS & RESET 3-DAY FOLLOW-UP */}
      {/* ========================================================================= */}
      {activeLeadForActivity && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#092E5E] border border-[#C5A059]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Log Daily Progress</h3>
                <p className="text-slate-300 text-xs">
                  Client: <strong className="text-[#F5CE6D]">{activeLeadForActivity.fullName}</strong> ({activeLeadForActivity.targetCountry})
                </p>
              </div>
              <button
                onClick={() => setActiveLeadForActivity(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Interaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: '💬 WhatsApp', desc: 'Message/Call' },
                    { id: 'call', label: '📞 Phone Call', desc: 'Direct Dial' },
                    { id: 'meeting', label: '🏢 Office Visit', desc: 'Islamabad' },
                    { id: 'docs_review', label: '📑 Docs Review', desc: 'Verified' },
                    { id: 'embassy_slot', label: '🏛️ Embassy Appt', desc: 'Booked' },
                    { id: 'note', label: '📝 Internal Note', desc: 'Progress' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivityType(item.id as CRMActivityType)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        activityType === item.id
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-white font-bold'
                          : 'bg-[#061C38] border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  What action did you take with this lead today? *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Called client on WhatsApp. They collected the 6-month bank maintenance letter from Meezan Bank F-7. Flight reservation drafted."
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  required
                  className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Update Case Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CRMLeadStatus)}
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="assigned">Assigned to Agent</option>
                    <option value="contacted">In Discussion / Contacted</option>
                    <option value="docs_pending">Documents Pending from Client</option>
                    <option value="in_progress">File in Creation</option>
                    <option value="embassy_ready">Embassy Ready (All Docs Complete)</option>
                    <option value="approved">🎉 Visa Approved (Final)</option>
                    <option value="rejected">Visa Refused</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Next Follow-Up Target</label>
                  <select
                    value={nextFollowUpDays}
                    onChange={(e) => setNextFollowUpDays(Number(e.target.value))}
                    className="w-full bg-[#061C38] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value={3}>3 Days (VartiMax Standard Rule)</option>
                    <option value={1}>1 Day (Urgent / Embassy Slot)</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>7 Days (Awaiting Embassy Decision)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveLeadForActivity(null)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-5 py-2 rounded-lg font-bold shadow cursor-pointer"
                >
                  Save Progress &amp; Reset 3-Day Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FULL DOSSIER & ACTIVITY TIMELINE HISTORY */}
      {/* ========================================================================= */}
      {activeLeadForDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#092E5E] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fadeIn text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold text-white">{activeLeadForDetails.fullName}</h3>
                <p className="text-slate-300 text-xs">
                  {activeLeadForDetails.targetCountry} &bull; Ref:{' '}
                  <span className="font-mono text-[#F5CE6D]">{activeLeadForDetails.docReferenceId || 'N/A'}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
              <div className="bg-[#061C38] p-3 rounded-lg border border-slate-700 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Client WhatsApp</span>
                  <span className="font-mono text-white font-bold">{activeLeadForDetails.whatsapp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Agent</span>
                  <span className="text-white font-bold">{activeLeadForDetails.assignedAgentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Status</span>
                  <span className="uppercase font-bold text-[#F5CE6D]">{activeLeadForDetails.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Last Update</span>
                  <span className="text-slate-300">
                    {new Date(activeLeadForDetails.lastActivityAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#C5A059]" />
                  <span>Timeline Audit History</span>
                </h4>

                <div className="space-y-2">
                  {activeLeadForDetails.activities.length === 0 ? (
                    <p className="text-slate-400 italic">No notes recorded yet.</p>
                  ) : (
                    activeLeadForDetails.activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#061C38] p-3 rounded-lg border border-slate-700/80 text-xs"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                          <strong className="text-[#F5CE6D]">{act.agentName}</strong>
                          <span className="font-mono">{new Date(act.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200">{act.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
              <button
                onClick={() =>
                  openWhatsApp(
                    activeLeadForDetails.whatsapp,
                    activeLeadForDetails.fullName,
                    activeLeadForDetails.targetCountry,
                    activeLeadForDetails.isOverdueFollowUp ?? false
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="px-4 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
