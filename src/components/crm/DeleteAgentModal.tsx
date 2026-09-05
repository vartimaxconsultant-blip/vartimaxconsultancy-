import React, { useState } from 'react';
import { Trash2, AlertTriangle, UserX, ShieldAlert } from 'lucide-react';
import { AgentProfile } from '../../types';

interface DeleteAgentModalProps {
  agent: AgentProfile;
  availableAgents?: AgentProfile[];
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (deletedId: string, reallocatedCount: number) => void;
}

export const DeleteAgentModal: React.FC<DeleteAgentModalProps> = ({
  agent,
  availableAgents = [],
  isOpen,
  onClose,
  onDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetAgentId, setTargetAgentId] = useState('unassigned');

  if (!isOpen) return null;

  const eligibleTargets = availableAgents.filter(
    (a) => a.id.toUpperCase() !== agent.id.toUpperCase() && a.active && a.role === 'agent'
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm/agents/${agent.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferToAgentId: targetAgentId })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete agent.');
        setIsDeleting(false);
        return;
      }
      onDeleted(agent.id, data.reallocatedCount || data.unassignedLeadsCount || 0);
      onClose();
    } catch {
      setError('Connection error while attempting to delete agent.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#092E5E] border border-red-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn text-slate-100">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Consultant Account</h3>
            <p className="text-xs text-red-300">Staff De-provisioning &amp; Handover</p>
          </div>
        </div>

        <div className="bg-[#061C38] border border-slate-700 rounded-xl p-3.5 mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Agent Name:</span>
            <strong className="text-white">{agent.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Agent ID:</span>
            <span className="font-mono text-[#F5CE6D] font-bold">{agent.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Designation:</span>
            <span className="text-slate-300">{agent.designation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Active Assigned Cases:</span>
            <span className="text-amber-400 font-bold">{agent.assignedLeadsCount ?? 0} files</span>
          </div>
        </div>

        {/* Lead Handover Choice */}
        {(agent.assignedLeadsCount || 0) > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              What should happen to {agent.name}&apos;s active files?
            </label>
            <select
              value={targetAgentId}
              onChange={(e) => setTargetAgentId(e.target.value)}
              className="w-full bg-[#041B3B] border border-slate-700 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="unassigned">Move all {agent.assignedLeadsCount} files to Unassigned Pool</option>
              {eligibleTargets.map((agt) => (
                <option key={agt.id} value={agt.id}>
                  Transfer all files to {agt.name} ({agt.id})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-xs text-red-200 mb-4 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Permanent Deletion Warning:</p>
            <p className="text-[11px] text-red-300/90 mt-0.5">
              Deleting will remove this agent ID and revoke credentials. Any active client cases will be securely protected and reallocated.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-500/20 border border-red-500 rounded-lg text-xs text-red-200 mb-4 font-semibold">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Confirm Delete Agent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
