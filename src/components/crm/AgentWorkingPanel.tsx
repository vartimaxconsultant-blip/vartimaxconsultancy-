import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  History,
  Send,
  Calendar,
  CheckSquare,
  Sparkles,
  ClipboardList,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { AgentProfile, CRMLeadRecord, CRMLeadStatus, CRMActivityType, AgentDailyReport } from '../../types';

interface AgentWorkingPanelProps {
  currentAgent: AgentProfile;
  leads: CRMLeadRecord[];
  onRefresh: () => void;
  onOpenActivityModal: (lead: CRMLeadRecord) => void;
  onOpenDetailsModal: (lead: CRMLeadRecord) => void;
  openWhatsApp: (phone: string, clientName: string, country: string, isFollowUp?: boolean) => void;
}

export const AgentWorkingPanel: React.FC<AgentWorkingPanelProps> = ({
  currentAgent,
  leads,
  onRefresh,
  onOpenActivityModal,
  onOpenDetailsModal,
  openWhatsApp
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'cases' | 'daily_report'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'overdue' | 'docs' | 'in_progress' | 'approved'>('all');

  // Daily Report Form State
  const [dailySummary, setDailySummary] = useState('');
  const [callsCount, setCallsCount] = useState<number>(5);
  const [whatsAppCount, setWhatsAppCount] = useState<number>(12);
  const [docsReviewedCount, setDocsReviewedCount] = useState<number>(3);
  const [approvalsCount, setApprovalsCount] = useState<number>(0);
  const [challengesFaced, setChallengesFaced] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Past daily reports for this agent
  const [agentReports, setAgentReports] = useState<AgentDailyReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Fetch Agent's past daily reports
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch(`/api/crm/daily-reports?agentId=${currentAgent.id}`);
      if (res.ok) {
        const data = await res.json();
        setAgentReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load agent reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentAgent.id]);

  // Submit Daily Report
  const handleSubmitDailyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailySummary.trim()) {
      alert('Please enter your daily progress summary.');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const res = await fetch('/api/crm/daily-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: currentAgent.id,
          agentName: currentAgent.name,
          summary: dailySummary,
          callsCount,
          whatsAppCount,
          docsReviewedCount,
          approvalsCount,
          challengesFaced,
          tomorrowPlan
        })
      });

      const data = await res.json();
      if (res.ok) {
        setReportSuccessMsg('Daily progress report successfully submitted to Executive Director!');
        setDailySummary('');
        setChallengesFaced('');
        setTomorrowPlan('');
        fetchReports();
        setTimeout(() => setReportSuccessMsg(null), 4500);
      } else {
        alert(data.error || 'Failed to submit report');
      }
    } catch {
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Stalled leads for this agent
  const overdueLeads = leads.filter((l) => l.isOverdueFollowUp);
  const docsPendingLeads = leads.filter((l) => l.status === 'docs_pending');
  const inProgressLeads = leads.filter((l) => l.status === 'in_progress');
  const approvedLeads = leads.filter((l) => l.status === 'approved');

  // Filtered cases
  const filteredCases = leads.filter((lead) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.fullName.toLowerCase().includes(q) ||
        lead.whatsapp.includes(q) ||
        lead.targetCountry.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter === 'overdue') return lead.isOverdueFollowUp;
    if (statusFilter === 'docs') return lead.status === 'docs_pending';
    if (statusFilter === 'in_progress') return lead.status === 'in_progress';
    if (statusFilter === 'approved') return lead.status === 'approved';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* AGENT COCKPIT HEADER */}
      <div className="bg-gradient-to-r from-[#092E5E] via-[#0b3b78] to-[#092E5E] border border-[#C5A059]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C5A059] text-[#042354] flex items-center justify-center font-black text-xl shadow-lg border-2 border-[#F5CE6D]/40 shrink-0">
              {currentAgent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-wide">{currentAgent.name}</h2>
                <span className="bg-[#C5A059]/20 border border-[#C5A059]/60 text-[#F5CE6D] font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
                  {currentAgent.id}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Desk
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentAgent.designation} &bull; Islamabad Gaga Downtown Office &bull; {currentAgent.phone}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setActiveSubTab('daily_report')}
              className="flex-1 md:flex-none bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span>📝 Update Daily Progress</span>
            </button>
            <button
              onClick={onRefresh}
              className="bg-[#061C38] hover:bg-slate-800 text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs cursor-pointer transition-all"
              title="Refresh My Desk"
            >
              <RefreshCw className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>

        {/* AGENT KPI STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60">
          <div className="bg-[#061C38]/80 border border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">My Total Cases</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white">{leads.length}</span>
              <span className="text-[10px] text-[#C5A059] font-bold">Assigned</span>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveSubTab('cases');
              setStatusFilter('overdue');
            }}
            className="bg-[#061C38]/80 border border-red-500/30 hover:border-red-500 rounded-xl p-3 cursor-pointer transition-all bg-red-950/20"
          >
            <span className="text-[11px] text-red-300 font-semibold block uppercase flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              3-Day Follow-Up Due
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-red-400">{overdueLeads.length}</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold animate-pulse">
                Action Required
              </span>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveSubTab('cases');
              setStatusFilter('docs');
            }}
            className="bg-[#061C38]/80 border border-slate-700/80 hover:border-amber-500 rounded-xl p-3 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Docs Pending</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-400">{docsPendingLeads.length}</span>
              <span className="text-[10px] text-amber-300 font-bold">Awaiting Client</span>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveSubTab('cases');
              setStatusFilter('approved');
            }}
            className="bg-[#061C38]/80 border border-slate-700/80 hover:border-emerald-500 rounded-xl p-3 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Visas Approved</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-400">{approvedLeads.length}</span>
              <span className="text-[10px] text-emerald-400 font-bold">Successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVERDUE ALERT BANNER */}
      {overdueLeads.length > 0 && (
        <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-200">
                🚨 Follow-Up Warning: {overdueLeads.length} Client(s) have had no activity for over 3 days!
              </h4>
              <p className="text-xs text-red-300/80 mt-0.5">
                VartiMax policy requires a client touchpoint every 3 days. Send a WhatsApp or log an action to reset the timer.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveSubTab('tasks');
            }}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0 shadow cursor-pointer"
          >
            View Urgent Tasks ({overdueLeads.length})
          </button>
        </div>
      )}

      {/* WORKING PANEL TABS */}
      <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'tasks'
                ? 'bg-[#C5A059] text-[#042354] shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>📋 My Daily Tasks &amp; Action Queue</span>
            {overdueLeads.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {overdueLeads.length} Urgent
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('cases')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'cases'
                ? 'bg-[#C5A059] text-[#042354] shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>📂 My Assigned Client Cases</span>
            <span className="bg-[#042354]/20 text-[#042354] px-1.5 py-0.2 rounded text-[10px] font-bold">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('daily_report')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'daily_report'
                ? 'bg-[#C5A059] text-[#042354] shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>📊 Submit &amp; View Daily Progress Logs</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
              Daily
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: DAILY TASKS & ACTION QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#C5A059]" />
                <span>Today&apos;s Action Queue for {currentAgent.name}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Prioritized tasks: client follow-ups due, pending document collections, and case status updates.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F5CE6D] bg-[#061C38] px-3 py-1.5 rounded-lg border border-slate-700">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {leads.length === 0 ? (
            <div className="bg-[#092E5E] border border-slate-700 rounded-xl p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No Cases Assigned Yet</h4>
              <p className="text-xs mt-1">
                The Executive Director will assign leads to your desk or incoming inquiries will route via auto-assign.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => {
                const isOverdue = lead.isOverdueFollowUp;
                const isDocsPending = lead.status === 'docs_pending';
                const isEmbassyReady = lead.status === 'embassy_ready';

                return (
                  <div
                    key={lead.id}
                    className={`bg-[#092E5E] border rounded-xl p-4 transition-all shadow-md ${
                      isOverdue
                        ? 'border-red-500/60 bg-red-950/15'
                        : isDocsPending
                        ? 'border-amber-500/40'
                        : 'border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Client Info & Priority Badge */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-base font-bold text-white">{lead.fullName}</span>
                          <span className="text-xs text-[#F5CE6D] font-semibold">
                            {lead.targetCountry} &bull; {lead.visaType}
                          </span>
                          {isOverdue && (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/50 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              {lead.daysSinceLastActivity}d Without Contact &bull; 3-Day Rule Due
                            </span>
                          )}
                          {isDocsPending && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Waiting for Bank/NADRA Docs
                            </span>
                          )}
                          {isEmbassyReady && (
                            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Embassy Ready &bull; Appointment Slot Prep
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-slate-400">{lead.whatsapp}</span>
                          <span>&bull;</span>
                          <span>
                            Current Status:{' '}
                            <strong className="text-white capitalize">{lead.status.replace('_', ' ')}</strong>
                          </span>
                          <span>&bull;</span>
                          <span className="text-slate-400">
                            Last interaction: {new Date(lead.lastActivityAt).toLocaleDateString()}
                          </span>
                        </div>

                        {lead.activities.length > 0 && (
                          <div className="text-xs text-slate-400 italic bg-[#061C38] p-2 rounded-lg border border-slate-800 mt-1.5">
                            Last Note: &ldquo;{lead.activities[0].note}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Right: Direct Task Actions */}
                      <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 flex-wrap">
                        <button
                          onClick={() => openWhatsApp(lead.whatsapp, lead.fullName, lead.targetCountry, isOverdue)}
                          className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Client</span>
                        </button>

                        <button
                          onClick={() => onOpenActivityModal(lead)}
                          className="flex-1 lg:flex-none bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Log Progress &amp; Reset Timer</span>
                        </button>

                        <button
                          onClick={() => onOpenDetailsModal(lead)}
                          className="bg-[#061C38] hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                          title="View Case Timeline"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: MY ASSIGNED CLIENT CASES (FULL DESK) */}
      {/* ========================================================================= */}
      {activeSubTab === 'cases' && (
        <div className="bg-[#092E5E] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          {/* Controls & Search */}
          <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#08264e]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search client name, country, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#061C38] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#C5A059] text-[#042354]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({leads.length})
              </button>
              <button
                onClick={() => setStatusFilter('overdue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                  statusFilter === 'overdue'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-red-300 hover:bg-slate-700'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Overdue ({overdueLeads.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  statusFilter === 'docs'
                    ? 'bg-[#C5A059] text-[#042354]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Docs Pending ({docsPendingLeads.length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                }`}
              >
                Approved ({approvedLeads.length})
              </button>
            </div>
          </div>

          {/* Cases Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-[#061C38] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Client / Country</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Case Status</th>
                  <th className="py-3 px-4">3-Day Follow-Up Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No cases matching this criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{lead.fullName}</div>
                        <div className="text-[11px] text-[#F5CE6D]">
                          {lead.targetCountry} &bull; {lead.visaType}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{lead.whatsapp}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            lead.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : lead.status === 'docs_pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : lead.status === 'in_progress'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {lead.isOverdueFollowUp ? (
                          <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-red-400" />
                            {lead.daysSinceLastActivity}d Overdue
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            On Target ({lead.daysSinceLastActivity ?? 0}d ago)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openWhatsApp(lead.whatsapp, lead.fullName, lead.targetCountry, lead.isOverdueFollowUp)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenActivityModal(lead)}
                            className="bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                          >
                            Log Progress
                          </button>
                          <button
                            onClick={() => onOpenDetailsModal(lead)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="Timeline"
                          >
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: DAILY PROGRESS LOGGER & HISTORY */}
      {/* ========================================================================= */}
      {activeSubTab === 'daily_report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Daily Progress Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#092E5E] border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
              <div className="p-2.5 bg-[#C5A059]/20 text-[#C5A059] rounded-xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Today&apos;s Daily Progress Report</h3>
                <p className="text-xs text-slate-300">
                  Officer: <strong className="text-white">{currentAgent.name}</strong> ({currentAgent.id}) &bull; Reports go directly to the Executive Director.
                </p>
              </div>
            </div>

            {reportSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{reportSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitDailyReport} className="space-y-4 text-xs">
              {/* Counter Metrics */}
              <div>
                <label className="block font-semibold text-slate-300 mb-2">Today&apos;s Operational Volume</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#061C38] p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">Phone Calls</span>
                    <input
                      type="number"
                      min={0}
                      value={callsCount}
                      onChange={(e) => setCallsCount(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-black text-white focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#061C38] p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">WhatsApp Chats</span>
                    <input
                      type="number"
                      min={0}
                      value={whatsAppCount}
                      onChange={(e) => setWhatsAppCount(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-black text-white focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#061C38] p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">Docs Portfolios</span>
                    <input
                      type="number"
                      min={0}
                      value={docsReviewedCount}
                      onChange={(e) => setDocsReviewedCount(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-black text-white focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#061C38] p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">Visas Approved</span>
                    <input
                      type="number"
                      min={0}
                      value={approvalsCount}
                      onChange={(e) => setApprovalsCount(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-black text-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Today&apos;s Work Summary &amp; Milestones (روزانہ کام کی تفصیل) *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Conducted detailed consultation with 4 Schengen clients. Organized Meezan Bank statement maintenance for Ali Raza. Completed UK student visa SOP review and uploaded biometric confirmation slip..."
                  value={dailySummary}
                  onChange={(e) => setDailySummary(e.target.value)}
                  required
                  className="w-full bg-[#061C38] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                ></textarea>
              </div>

              {/* Roadblocks & Challenges */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Challenges or Delays Faced (e.g. NADRA, Embassy slots, Client documents)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client awaiting NADRA FRC issuance; Italian VFS slots filled for next week."
                  value={challengesFaced}
                  onChange={(e) => setChallengesFaced(e.target.value)}
                  className="w-full bg-[#061C38] border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Tomorrow's Action Plan */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Action Plan for Tomorrow (کل کا ٹارگٹ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Follow up with 3-day overdue clients, submit Canadian study portal, conduct office meeting."
                  value={tomorrowPlan}
                  onChange={(e) => setTomorrowPlan(e.target.value)}
                  className="w-full bg-[#061C38] border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="w-full bg-[#C5A059] hover:bg-[#d8b368] text-[#042354] py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingReport ? 'Submitting Report...' : 'Submit Daily Progress to Director'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Past Submitted Reports History (5 cols) */}
          <div className="lg:col-span-5 bg-[#092E5E] border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-700">
              <History className="w-4 h-4 text-[#C5A059]" />
              <span>My Past Progress Reports</span>
            </h4>

            <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1 flex-1">
              {loadingReports ? (
                <p className="text-center text-slate-400 py-6 text-xs">Loading past reports...</p>
              ) : agentReports.length === 0 ? (
                <div className="text-center text-slate-400 py-10 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>No daily reports logged yet.</p>
                  <p className="text-slate-500 mt-1">Submit your first progress update today using the form.</p>
                </div>
              ) : (
                agentReports.map((rep) => (
                  <div key={rep.id} className="bg-[#061C38] border border-slate-700 rounded-xl p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-[#F5CE6D]">{rep.date}</span>
                      <span className="font-mono text-[10px]">
                        {new Date(rep.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 bg-[#092E5E]/60 p-2 rounded-lg text-center text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Calls</span>
                        <strong className="text-white">{rep.callsCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Chats</span>
                        <strong className="text-white">{rep.whatsAppCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Docs</span>
                        <strong className="text-white">{rep.docsReviewedCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Visas</span>
                        <strong className="text-emerald-400">{rep.approvalsCount}</strong>
                      </div>
                    </div>

                    <p className="text-slate-200 text-xs">{rep.summary}</p>

                    {rep.challengesFaced && (
                      <div className="text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                        <strong>Roadblock:</strong> {rep.challengesFaced}
                      </div>
                    )}

                    {rep.tomorrowPlan && (
                      <div className="text-[11px] text-cyan-300 bg-cyan-500/10 p-1.5 rounded border border-cyan-500/20">
                        <strong>Tomorrow:</strong> {rep.tomorrowPlan}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
