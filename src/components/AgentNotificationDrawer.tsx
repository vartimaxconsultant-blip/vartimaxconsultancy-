import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Radio,
  Zap
} from 'lucide-react';
import { useAgentNotifications } from '../context/AgentNotificationContext';
import { AgentNotification } from '../types';
import { Users } from 'lucide-react';

interface AgentNotificationDrawerProps {
  onNavigate?: (route: string) => void;
}

export const AgentNotificationDrawer: React.FC<AgentNotificationDrawerProps> = ({ onNavigate }) => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    notifications,
    unreadCount,
    markAsContacted,
    markAsRead,
    markAllRead,
    setSelectedDetailNotif,
    soundEnabled,
    toggleSound,
    desktopAlertsEnabled,
    requestDesktopAlerts,
    simulateTestInquiry
  } = useAgentNotifications();

  const [filter, setFilter] = useState<'all' | 'uncontacted' | 'documents' | 'leads'>('all');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isDrawerOpen) return null;

  const filtered = notifications.filter((item) => {
    if (filter === 'uncontacted') return !item.contacted;
    if (filter === 'documents') return item.type === 'document_upload';
    if (filter === 'leads') return item.type === 'lead_inquiry' || item.type === 'contact_query';
    return true;
  });

  const handleSimulate = async () => {
    setIsSimulating(true);
    await simulateTestInquiry();
    setTimeout(() => setIsSimulating(false), 800);
  };

  const handleEnableDesktop = async () => {
    await requestDesktopAlerts();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#051C3A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#07244A] border-l border-[#15488A] shadow-2xl flex flex-col text-[#E5E5E5] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#051C3A] to-[#092E5E] border-b border-[#123A6D] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
                  <BellRing className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>Agent Live Inquiries</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] text-[#93C5FD] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Real-time Reception Desk</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#93C5FD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Controls Bar: Sound, Desktop Alert, Test button */}
            <div className="flex items-center justify-between bg-[#061F40] p-2 rounded-xl border border-[#15488A] text-xs">
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Toggle notification chime sound"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'Sound On' : 'Sound Muted'}</span>
              </button>

              {!desktopAlertsEnabled && (
                <button
                  onClick={handleEnableDesktop}
                  className="text-[11px] text-[#93C5FD] hover:text-white underline cursor-pointer"
                >
                  Enable Desktop Alerts
                </button>
              )}

              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex items-center gap-1 bg-[#092E5E] hover:bg-[#124285] text-white px-2.5 py-1.5 rounded-lg font-bold border border-[#15488A] transition-colors cursor-pointer disabled:opacity-50"
                title="Simulate incoming client submission to test popup and sound"
              >
                <Zap className="w-3 h-3 text-[#C5A059]" />
                <span>{isSimulating ? 'Testing...' : 'Test Alert'}</span>
              </button>
            </div>

            {/* Launch CRM Workspace Link */}
            {onNavigate && (
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onNavigate('crm');
                }}
                className="w-full bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/50 text-[#F5CE6D] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span>Open CRM Command Center (Agent &amp; Owner View)</span>
                <ExternalLink className="w-3 h-3 text-[#C5A059]" />
              </button>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-1 border-b border-[#123A6D] pt-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-transparent text-[#93C5FD] hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('uncontacted')}
                className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  filter === 'uncontacted'
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-transparent text-[#93C5FD] hover:text-white'
                }`}
              >
                Pending ({notifications.filter((n) => !n.contacted).length})
              </button>
              <button
                onClick={() => setFilter('documents')}
                className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  filter === 'documents'
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-transparent text-[#93C5FD] hover:text-white'
                }`}
              >
                Docs ({notifications.filter((n) => n.type === 'document_upload').length})
              </button>
              <button
                onClick={() => setFilter('leads')}
                className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  filter === 'leads'
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-transparent text-[#93C5FD] hover:text-white'
                }`}
              >
                Leads ({notifications.filter((n) => n.type !== 'document_upload').length})
              </button>
            </div>
          </div>

          {/* List of Inquiries */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[#93C5FD]/60 space-y-2">
                <Bell className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">No inquiries matching this filter.</p>
                <button
                  onClick={handleSimulate}
                  className="mt-2 text-xs text-[#C5A059] underline hover:text-white"
                >
                  Generate a test lead inquiry now
                </button>
              </div>
            ) : (
              filtered.map((item) => {
                const cleanPhone = item.whatsapp.replace(/\D/g, '');
                const isDocs = item.type === 'document_upload';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      setSelectedDetailNotif(item);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                      !item.read
                        ? 'bg-[#082D5C] border-[#C5A059]/60 shadow-md'
                        : 'bg-[#061F40] border-[#15488A] opacity-90 hover:opacity-100'
                    }`}
                  >
                    {!item.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></div>
                    )}

                    <div className="flex items-start justify-between gap-2 pr-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isDocs
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {isDocs ? '📄 Dossier Upload' : '💬 Consultation Request'}
                          </span>
                          {item.contacted && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              ✓ Contacted
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {item.clientName}
                        </h4>
                      </div>

                      <span className="text-[10px] text-[#93C5FD]/70 shrink-0 mt-0.5">
                        {new Date(item.createdAt).toLocaleTimeString('en-PK', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-[#D1D5DB] leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#123A6D]/80">
                      <div className="flex items-center gap-2 text-[11px] text-[#93C5FD]">
                        <span className="font-mono font-bold text-white">
                          {item.whatsapp}
                        </span>
                        <span>•</span>
                        <span>{item.targetCountry}</span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markAsContacted(item.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                          title="WhatsApp Client"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${cleanPhone}`}
                          onClick={() => markAsContacted(item.id)}
                          className="p-1.5 bg-[#092E5E] hover:bg-[#124285] text-white rounded-lg border border-[#15488A] transition-colors"
                          title="Call Client"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#051C3A] border-t border-[#123A6D] flex items-center justify-between text-xs">
            <button
              onClick={markAllRead}
              className="text-[#93C5FD] hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
            <span className="text-[11px] text-[#93C5FD]/60">
              VartiMax Consultant Islamabad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
