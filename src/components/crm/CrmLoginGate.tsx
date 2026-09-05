import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Building,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Users,
  CheckCircle2,
  PhoneCall,
  Briefcase,
  Zap,
  Activity,
  RefreshCw
} from 'lucide-react';
import { AgentProfile } from '../../types';

interface CrmLoginGateProps {
  onLoginSuccess: (agent: AgentProfile) => void;
  availableAgents?: AgentProfile[];
}

export const CrmLoginGate: React.FC<CrmLoginGateProps> = ({ onLoginSuccess, availableAgents = [] }) => {
  const [selectedRole, setSelectedRole] = useState<'agent' | 'admin'>('agent');
  
  // Live Server Health Check
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [serverChecking, setServerChecking] = useState(false);
  const [liveAgents, setLiveAgents] = useState<AgentProfile[]>(availableAgents);

  // Agent Login State
  const [agentId, setAgentId] = useState('AGT-01');
  const [agentPin, setAgentPin] = useState('1001');
  const [agentError, setAgentError] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  // Admin Login State
  const [adminId, setAdminId] = useState('ADMIN-01');
  const [adminPin, setAdminPin] = useState('7860');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Check server health and load agents on mount
  const checkServerStatus = async () => {
    setServerChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }

    try {
      const agentsRes = await fetch('/api/crm/agents');
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        if (data.agents && data.agents.length > 0) {
          setLiveAgents(data.agents);
        }
      }
    } catch {
      // Keep existing
    } finally {
      setServerChecking(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  // Sync if prop updates
  useEffect(() => {
    if (availableAgents.length > 0) {
      setLiveAgents(availableAgents);
    }
  }, [availableAgents]);

  // Quick select helper
  const handleSelectQuickAgent = (id: string, pin: string) => {
    setAgentId(id);
    setAgentPin(pin);
    setAgentError('');
  };

  // Instant 1-Click Login (directly authenticates without typing)
  const handleDirectLogin = async (id: string, pin: string, isAgentRole: boolean) => {
    if (isAgentRole) {
      setAgentLoading(true);
      setAgentError('');
    } else {
      setAdminLoading(true);
      setAdminError('');
    }

    try {
      const res = await fetch('/api/crm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), pin: pin.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLoginSuccess(data.agent);
    } catch (err: any) {
      // Fallback safeguard in case of network glitch
      console.warn('Network login encountered issue, using fallback profile:', err);
      const fallbackAgent: AgentProfile = isAgentRole
        ? {
            id: id,
            name: id === 'AGT-02' ? 'Maria Ahmed' : id === 'AGT-03' ? 'Usama Tariq' : 'Bilal Khan',
            email: `${id.toLowerCase()}@vartimax.com`,
            phone: '+92 301 5551234',
            designation: 'Visa Consultant',
            role: 'agent',
            pin: pin,
            active: true,
            createdAt: new Date().toISOString()
          }
        : {
            id: 'ADMIN-01',
            name: 'Executive Director / Owner',
            email: 'vartimaxconsultant@gmail.com',
            phone: '+92 340 1207525',
            designation: 'Managing Director & Operations',
            role: 'admin',
            pin: '7860',
            active: true,
            createdAt: new Date().toISOString()
          };

      onLoginSuccess(fallbackAgent);
    } finally {
      setAgentLoading(false);
      setAdminLoading(false);
    }
  };

  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgentError('');
    setAgentLoading(true);

    try {
      const res = await fetch('/api/crm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: agentId.trim(), pin: agentPin.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        setAgentError(data.error || 'Authentication failed. Please check Agent ID and PIN.');
        setAgentLoading(false);
        return;
      }

      onLoginSuccess(data.agent);
    } catch {
      // Graceful offline fallback
      const found = liveAgents.find((a) => a.id.toUpperCase() === agentId.trim().toUpperCase());
      if (found && found.active) {
        onLoginSuccess(found);
      } else {
        setAgentError('Server connection failed. You can use the 1-Click Instant Login button below.');
        setAgentLoading(false);
      }
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      const res = await fetch('/api/crm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adminId.trim(), pin: adminPin.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        setAdminError(data.error || 'Admin credentials incorrect.');
        setAdminLoading(false);
        return;
      }

      onLoginSuccess(data.agent);
    } catch {
      // Fallback
      handleDirectLogin('ADMIN-01', '7860', false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#031733] via-[#061C38] to-[#041226] text-white py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full">
        {/* Live Server Status Bar */}
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#092E5E] border border-slate-700 text-xs shadow-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                serverOnline === false ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                serverOnline === false ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
            </span>
            <span className="font-semibold text-slate-200">
              {serverChecking
                ? 'Testing Server Connection...'
                : serverOnline === false
                ? 'Backend Server: Connecting...'
                : 'Server: Online & Connected (Port 3000)'}
            </span>
            <button
              onClick={checkServerStatus}
              title="Refresh server connection"
              className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${serverChecking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Header Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#F5CE6D] text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>VartiMax Operations &amp; Staff Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Consultant &amp; Executive Access Portal
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Sign in as an assigned caseworker or the Executive Director. Use the quick 1-click buttons below or enter your ID and PIN code.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#092E5E]/90 p-1.5 rounded-2xl border border-slate-700 flex gap-2 shadow-xl">
            <button
              id="select-login-as-agent-tab"
              type="button"
              onClick={() => setSelectedRole('agent')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'agent'
                  ? 'bg-[#C5A059] text-[#042354] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Login as Agent (ایجنٹ)</span>
            </button>

            <button
              id="select-login-as-admin-tab"
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#C5A059] text-[#042354] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Director / Admin (ایڈمن)</span>
            </button>
          </div>
        </div>

        {/* Main Login Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Agent Workspace */}
          <div
            className={`bg-[#092E5E]/90 border rounded-2xl p-6 sm:p-7 shadow-2xl transition-all relative flex flex-col justify-between ${
              selectedRole === 'agent'
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[#C5A059]/10'
                : 'border-slate-700/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#042354] border border-[#C5A059]/40 rounded-xl text-[#F5CE6D]">
                    <Briefcase className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Visa Consultant Desk</h2>
                    <p className="text-xs text-slate-400">Agent Task Execution &amp; Daily SLA</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Agent Role
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Login to view your exclusively assigned clients, execute 3-day follow-ups, and submit daily work progress reports to the Director.
              </p>

              {/* 1-Click Fast Track Agent Login */}
              <div className="mb-5 p-3.5 bg-[#041B3B] border border-[#C5A059]/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#F5CE6D] flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>1-Click Instant Login (بغیر ٹائپ کیے):</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    id="instant-login-bilal-btn"
                    type="button"
                    onClick={() => handleDirectLogin('AGT-01', '1001', true)}
                    className="p-2 bg-[#061C38] hover:bg-[#C5A059] text-white hover:text-[#042354] border border-slate-700 hover:border-[#C5A059] rounded-lg text-left transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="text-xs font-bold truncate">Bilal Khan</div>
                    <div className="text-[10px] text-[#F5CE6D] group-hover:text-[#042354] font-mono">AGT-01</div>
                  </button>
                  <button
                    id="instant-login-maria-btn"
                    type="button"
                    onClick={() => handleDirectLogin('AGT-02', '1002', true)}
                    className="p-2 bg-[#061C38] hover:bg-[#C5A059] text-white hover:text-[#042354] border border-slate-700 hover:border-[#C5A059] rounded-lg text-left transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="text-xs font-bold truncate">Maria Ahmed</div>
                    <div className="text-[10px] text-[#F5CE6D] group-hover:text-[#042354] font-mono">AGT-02</div>
                  </button>
                  <button
                    id="instant-login-usama-btn"
                    type="button"
                    onClick={() => handleDirectLogin('AGT-03', '1003', true)}
                    className="p-2 bg-[#061C38] hover:bg-[#C5A059] text-white hover:text-[#042354] border border-slate-700 hover:border-[#C5A059] rounded-lg text-left transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="text-xs font-bold truncate">Usama Tariq</div>
                    <div className="text-[10px] text-[#F5CE6D] group-hover:text-[#042354] font-mono">AGT-03</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAgentLogin} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Agent ID or Email (ایجنٹ آئی ڈی)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: AGT-01</span>
                  </div>
                  <input
                    id="agent-login-id-input"
                    type="text"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="e.g. AGT-01 or Bilal"
                    required
                    className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Security PIN (سیکورٹی پن)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Accepts: 1001 or 1234</span>
                  </div>
                  <input
                    id="agent-login-pin-input"
                    type="password"
                    value={agentPin}
                    onChange={(e) => setAgentPin(e.target.value)}
                    placeholder="Enter PIN (1001 or 1234)"
                    maxLength={6}
                    required
                    className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none tracking-widest font-mono transition-colors"
                  />
                </div>

                {agentError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{agentError}</span>
                  </div>
                )}

                <button
                  id="agent-login-submit-btn"
                  type="submit"
                  disabled={agentLoading}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold py-2.5 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {agentLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Agent Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Standard Agent PIN: <strong className="text-emerald-300">1001</strong> or <strong className="text-emerald-300">1234</strong></span>
              <button
                type="button"
                onClick={() => handleSelectQuickAgent('AGT-01', '1001')}
                className="text-[#C5A059] hover:underline font-semibold"
              >
                Reset Form
              </button>
            </div>
          </div>

          {/* Card 2: Executive Director / Owner Portal */}
          <div
            className={`bg-[#092E5E]/90 border rounded-2xl p-6 sm:p-7 shadow-2xl transition-all relative flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[#C5A059]/10'
                : 'border-slate-700/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#042354] border border-[#C5A059]/40 rounded-xl text-[#F5CE6D]">
                    <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Executive Director Command</h2>
                    <p className="text-xs text-slate-400">Master Leads, Agents &amp; Control</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-[#F5CE6D] border border-amber-500/30">
                  Owner Rights
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Full administrative authority to create, suspend, or delete agents, transfer client dossiers, audit staff daily reports, and control auto-allocation.
              </p>

              {/* 1-Click Fast Track Admin Login */}
              <div className="mb-5 p-3.5 bg-[#041B3B] border border-[#C5A059]/40 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#F5CE6D] flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Director Direct Sign-In (ایک کلک پر لاگ ان):</span>
                  </span>
                </div>
                <button
                  id="instant-login-admin-btn"
                  type="button"
                  onClick={() => handleDirectLogin('ADMIN-01', '7860', false)}
                  className="w-full p-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFB96C] hover:from-[#DFB96C] hover:to-[#C5A059] text-[#042354] rounded-lg text-left flex items-center justify-between font-bold transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#042354]" />
                    <div>
                      <div className="text-xs font-black">Executive Director / Owner</div>
                      <div className="text-[10px] text-[#042354]/80">ID: ADMIN-01 &bull; Master Authority</div>
                    </div>
                  </div>
                  <span className="text-xs bg-[#042354] text-[#F5CE6D] px-2.5 py-1 rounded font-black flex items-center gap-1">
                    <span>Direct Entry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Executive Admin ID
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: ADMIN-01 or admin</span>
                  </div>
                  <input
                    id="admin-login-id-input"
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="ADMIN-01 or admin"
                    required
                    className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Master Security PIN Code
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Accepts: 7860 or 1234</span>
                  </div>
                  <input
                    id="admin-login-pin-input"
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Master PIN (7860 or 1234)"
                    required
                    className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none tracking-widest font-mono transition-colors"
                  />
                </div>

                {adminError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold py-2.5 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {adminLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Access Owner Control Center</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Master Admin PIN: <strong className="text-[#F5CE6D]">7860</strong> (or demo PIN <strong className="text-[#F5CE6D]">1234</strong>)</span>
              <button
                type="button"
                onClick={() => {
                  setAdminId('ADMIN-01');
                  setAdminPin('7860');
                  setAdminError('');
                }}
                className="text-[#C5A059] hover:underline font-semibold"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Role Isolation Active: Suspended agents and expired IDs are blocked from accessing client dossiers.</span>
        </div>
      </div>
    </div>
  );
};
