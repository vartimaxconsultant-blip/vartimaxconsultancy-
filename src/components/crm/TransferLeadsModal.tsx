import React, { useState } from 'react';
import { ArrowRightLeft, Users, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AgentProfile } from '../../types';

interface TransferLeadsModalProps {
  fromAgent: AgentProfile;
  availableAgents: AgentProfile[];
  isOpen: boolean;
  onClose: () => void;
  onTransferred: (count: number, targetName: string) => void;
}

export const TransferLeadsModal: React.FC<TransferLeadsModalProps> = ({
  fromAgent,
  availableAgents,
  isOpen,
  onClose,
  onTransferred
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [reason, setReason] = useState('Agent Leave / Reallocation by Director');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter out the source agent and suspended agents from target choices
  const eligibleTargets = availableAgents.filter(
    (a) => a.id.toUpperCase() !== fromAgent.id.toUpperCase() && a.active && a.role === 'agent'
  );

  const activeCasesCount = fromAgent.assignedLeadsCount ?? 0;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetId) {
      setError('Please select a destination agent or Unassigned Pool.');
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const res = await fetch(`/api/crm/agents/${fromAgent.id}/transfer-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toAgentId: selectedTargetId,
          reason
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to transfer leads.');
        setIsTransferring(false);
        return;
      }

      onTransferred(data.transferredCount, data.targetAgentName);
      onClose();
    } catch {
      setError('Network communication failed during transfer.');
      setIsTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#092E5E] border border-[#C5A059]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn text-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#042354] border border-[#C5A059]/40 rounded-xl text-[#F5CE6D]">
            <ArrowRightLeft className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Transfer Client Dossiers</h3>
            <p className="text-xs text-slate-300">Executive Reallocation &amp; Handover</p>
          </div>
        </div>

        {/* Source Agent Summary */}
        <div className="bg-[#061C38] border border-slate-700 rounded-xl p-3.5 mb-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Current Agent (From):</span>
            <span className="font-bold text-white">{fromAgent.name} ({fromAgent.id})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Active Dossiers:</span>
            <span className="font-bold text-amber-400">{activeCasesCount} files to transfer</span>
          </div>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Destination Agent (منتقل کریں) <span className="text-red-400">*</span>
            </label>
            <select
              id="transfer-target-agent-select"
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              required
              className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="">-- Choose Active Consultant --</option>
              {eligibleTargets.map((agt) => (
                <option key={agt.id} value={agt.id}>
                  {agt.name} ({agt.id}) &bull; Active: {agt.assignedLeadsCount || 0} cases
                </option>
              ))}
              <option value="unassigned">-- Move to Unassigned Pool (عام پول) --</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reason for Transfer (وجہ)
            </label>
            <input
              id="transfer-reason-input"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Agent on leave, resigned, or workload rebalancing"
              className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="bg-[#042354]/60 border border-[#C5A059]/30 rounded-xl p-3 text-[11px] text-[#BFDBFE]">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                All transferred leads will have their 3-day follow-up SLA reset and an audit entry recorded stating transfer from {fromAgent.name}.
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-500/20 border border-red-500 rounded-lg text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isTransferring}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-transfer-leads-btn"
              type="submit"
              disabled={isTransferring}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isTransferring ? 'Transferring Dossiers...' : 'Transfer All Leads Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
