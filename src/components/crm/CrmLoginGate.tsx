import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { AgentProfile } from '../../types';

interface CrmLoginGateProps {
  onLoginSuccess: (agent: AgentProfile) => void;
  availableAgents?: AgentProfile[];
}

export const CrmLoginGate: React.FC<CrmLoginGateProps> = ({ onLoginSuccess, availableAgents = [] }) => {
  const [selectedRole, setSelectedRole] = useState<'agent' | 'admin'>('agent');
  
  // Agent Login State
  const [agentId, setAgentId] = useState('AGT-01');
  const [agentPin, setAgentPin] = useState('1234');
  const [agentError, setAgentError] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  // Admin Login State
  const [adminId, setAdminId] = useState('ADMIN-01');
  const [adminPin, setAdminPin] = useState('7860');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Quick select helper
  const handleSelectQuickAgent = (id: string, pin: string) => {
    setAgentId(id);
    setAgentPin(pin);
    setAgentError('');
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
      setAgentError('Connection failed. Please ensure the server is running.');
      setAgentLoading(false);
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
      setAdminError('Server communication error.');
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-gradient-to-b from-[#031733] via-[#061C38] to-[#041226] text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#F5CE6D] text-xs font-bold uppercase tracking-wider mb-3">
            <Building className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>VartiMax Operations &amp; Staff Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Consultant &amp; Executive Access Portal
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Please choose your role to sign in. Caseworkers access assigned dossiers; Directors hold full executive oversight, agent delegation, and suspension rights.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#092E5E]/80 p-1.5 rounded-2xl border border-slate-700 flex gap-2 shadow-xl">
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
            className={`bg-[#092E5E]/90 border rounded-2xl p-6 sm:p-7 shadow-2xl transition-all relative ${
              selectedRole === 'agent'
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[#C5A059]/10'
                : 'border-slate-700/80 opacity-75 hover:opacity-100'
            }`}
          >
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

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Login to view your exclusively assigned clients, execute 3-day follow-ups, and submit daily work progress reports to the Director.
            </p>

            <form onSubmit={handleAgentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agent ID or Email (ایجنٹ آئی ڈی)
                </label>
                <input
                  id="agent-login-id-input"
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="e.g. AGT-01"
                  required
                  className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4-Digit Security PIN (سیکورٹی پن)
                </label>
                <input
                  id="agent-login-pin-input"
                  type="password"
                  value={agentPin}
                  onChange={(e) => setAgentPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
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
                  <span>Verifying PIN...</span>
                ) : (
                  <>
                    <span>Enter Agent Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for Testing */}
            <div className="mt-5 pt-4 border-t border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick 1-Click Agent Presets:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectQuickAgent('AGT-01', '1234')}
                  className="p-1.5 bg-[#061C38] hover:bg-[#0c2b54] border border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-white truncate">Bilal Khan</div>
                  <div className="text-[10px] text-[#F5CE6D] font-mono">AGT-01 (1234)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectQuickAgent('AGT-02', '5678')}
                  className="p-1.5 bg-[#061C38] hover:bg-[#0c2b54] border border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-white truncate">Maria Ahmed</div>
                  <div className="text-[10px] text-[#F5CE6D] font-mono">AGT-02 (5678)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectQuickAgent('AGT-03', '9988')}
                  className="p-1.5 bg-[#061C38] hover:bg-[#0c2b54] border border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-white truncate">Usama Tariq</div>
                  <div className="text-[10px] text-[#F5CE6D] font-mono">AGT-03 (9988)</div>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Executive Director / Owner Portal */}
          <div
            className={`bg-[#092E5E]/90 border rounded-2xl p-6 sm:p-7 shadow-2xl transition-all relative ${
              selectedRole === 'admin'
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-[#C5A059]/10'
                : 'border-slate-700/80 opacity-75 hover:opacity-100'
            }`}
          >
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

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Full administrative authority to create, suspend, or delete agents, transfer client dossiers, audit staff daily reports, and control auto-allocation.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Executive Admin ID
                </label>
                <input
                  id="admin-login-id-input"
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="ADMIN-01"
                  required
                  className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Master Security PIN Code
                </label>
                <input
                  id="admin-login-pin-input"
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Master PIN"
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

            {/* Quick Demo Logins for Testing */}
            <div className="mt-5 pt-4 border-t border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Executive Owner Quick Preset:
              </span>
              <button
                type="button"
                onClick={() => {
                  setAdminId('ADMIN-01');
                  setAdminPin('7860');
                  setAdminError('');
                }}
                className="w-full p-2 bg-[#061C38] hover:bg-[#0c2b54] border border-[#C5A059]/40 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white">Mr. VartiMax (Director)</div>
                  <div className="text-[10px] text-slate-400">ADMIN-01 &bull; PIN: 7860</div>
                </div>
                <span className="text-[10px] bg-[#C5A059]/20 text-[#F5CE6D] px-2 py-0.5 rounded font-bold">
                  MASTER KEY
                </span>
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
