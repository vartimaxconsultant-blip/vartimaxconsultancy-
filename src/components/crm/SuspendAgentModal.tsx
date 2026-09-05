import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, UserX, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { AgentProfile } from '../../types';

interface SuspendAgentModalProps {
  agent: AgentProfile;
  availableAgents: AgentProfile[];
  isOpen: boolean;
  onClose: () => void;
  onSuspensionChanged: (updatedAgent: AgentProfile, transferredCount?: number) => void;
}

export const SuspendAgentModal: React.FC<SuspendAgentModalProps> = ({
  agent,
  availableAgents,
  isOpen,
  onClose,
  onSuspensionChanged
}) => {
  const isCurrentlyActive = agent.active;
  const [reason, setReason] = useState(
    isCurrentlyActive ? 'Agent on leave / Left employment' : 'Reactivating consultant back on duty'
  );
  const [shouldTransferLeads, setShouldTransferLeads] = useState(isCurrentlyActive && (agent.assignedLeadsCount || 0) > 0);
  const [targetAgentId, setTargetAgentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const eligibleTargets = availableAgents.filter(
    (a) => a.id.toUpperCase() !== agent.id.toUpperCase() && a.active && a.role === 'agent'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/crm/agents/${agent.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suspend: isCurrentlyActive, // if active, we suspend (suspend = true)
          reason,
          transferToAgentId: shouldTransferLeads ? targetAgentId : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update suspension status.');
        setIsSubmitting(false);
        return;
      }

      onSuspensionChanged(data.agent, data.transferredCount);
      onClose();
    } catch {
      setError('Connection failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#092E5E] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn text-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${isCurrentlyActive ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isCurrentlyActive ? <UserX className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isCurrentlyActive ? 'Suspend Agent Access (معطل / چھٹی)' : 'Reactivate Agent (بحال کریں)'}
            </h3>
            <p className="text-xs text-slate-300">
              {isCurrentlyActive ? 'Revoke Portal Access (Leave or Job Resignation)' : 'Restore Active Consultant Privileges'}
            </p>
          </div>
        </div>

        {/* Agent Details Card */}
        <div className="bg-[#061C38] border border-slate-700 rounded-xl p-3.5 mb-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Consultant Name:</span>
            <strong className="text-white">{agent.name} ({agent.id})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Status:</span>
            <span className={agent.active ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {agent.active ? 'Active & Authorized' : 'Suspended / On Leave'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Active Files:</span>
            <span className="font-bold text-amber-400">{agent.assignedLeadsCount || 0} client dossiers</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isCurrentlyActive ? 'Reason for Suspension / Leave' : 'Reactivation Note'}
            </label>
            <input
              id="suspend-reason-input"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Left organization, Medical leave, or End of contract"
              required
              className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {isCurrentlyActive && (agent.assignedLeadsCount || 0) > 0 && (
            <div className="bg-[#041B3B] border border-slate-700 rounded-xl p-3.5 space-y-3 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shouldTransferLeads}
                  onChange={(e) => setShouldTransferLeads(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C5A059] focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold text-slate-200">
                  Transfer {agent.assignedLeadsCount} active cases to another agent now?
                </span>
              </label>

              {shouldTransferLeads && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Select Target Agent to take over:
                  </label>
                  <select
                    value={targetAgentId}
                    onChange={(e) => setTargetAgentId(e.target.value)}
                    required={shouldTransferLeads}
                    className="w-full bg-[#061C38] border border-slate-700 focus:border-[#C5A059] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="">-- Choose Active Consultant --</option>
                    {eligibleTargets.map((agt) => (
                      <option key={agt.id} value={agt.id}>
                        {agt.name} ({agt.id}) &bull; Active: {agt.assignedLeadsCount || 0} cases
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {isCurrentlyActive && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-[11px] text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                Once suspended, this agent <strong>CANNOT log in</strong> with their PIN. Their session is blocked immediately.
              </span>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-red-500/20 border border-red-500 rounded-lg text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-suspend-agent-btn"
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                isCurrentlyActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>
                {isSubmitting
                  ? 'Updating...'
                  : isCurrentlyActive
                  ? 'Confirm Suspend Agent'
                  : 'Confirm Reactivate Agent'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
