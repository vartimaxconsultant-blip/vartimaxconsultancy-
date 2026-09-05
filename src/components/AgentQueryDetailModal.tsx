import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  User,
  Mail,
  Send
} from 'lucide-react';
import { useAgentNotifications } from '../context/AgentNotificationContext';
import { AgentNotification } from '../types';

export const AgentQueryDetailModal: React.FC = () => {
  const { selectedDetailNotif, setSelectedDetailNotif, markAsContacted } = useAgentNotifications();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);

  if (!selectedDetailNotif) return null;

  const notif = selectedDetailNotif;
  const cleanPhone = notif.whatsapp.replace(/\D/g, '');

  const quickTemplates = [
    {
      title: 'Consultation & File Audit Invite (Office 78 Islamabad)',
      text: `Assalam-o-Alaikum ${notif.clientName}! This is Senior Visa Strategist from VartiMax Consultant Islamabad. We received your file for ${notif.targetCountry}. Please visit our office at Office 78, Basement, Gaga Downtown, Islamabad tomorrow between 11 AM - 5 PM with your original passport and 6-month bank statement for final file architecture.`
    },
    {
      title: 'Urgent Document Verification Follow-up',
      text: `Assalam-o-Alaikum ${notif.clientName}! We have logged your ${notif.targetCountry} inquiry. To ensure a 90% embassy approval benchmark, we need to inspect your 6-month stamped bank ledger, FBR tax returns, and NADRA FRC. Are you available for a 5-minute WhatsApp call?`
    },
    {
      title: 'Document Dossier Receipt Acknowledgment',
      text: `Assalam-o-Alaikum ${notif.clientName}! Your uploaded documents (Ref: ${notif.details?.referenceId || 'VMX-ISB'}) are received at VartiMax Islamabad Desk. Our case officer has commenced verification and hotel/flight PNR bookings.`
    }
  ];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(notif.whatsapp);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyTemplate = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(index);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const openWhatsAppWithText = (messageText: string) => {
    markAsContacted(notif.id);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C3A]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#07244A] rounded-2xl shadow-2xl border border-[#15488A] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#E5E5E5] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#051C3A] via-[#092E5E] to-[#0D3870] border-b border-[#123A6D] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                  AGENT DOSSIER & INQUIRY VIEWER
                </span>
                {notif.details?.referenceId && (
                  <span className="bg-[#051C3A] text-white font-mono text-[11px] px-2 py-0.5 rounded border border-[#15488A]">
                    {notif.details.referenceId}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {notif.clientName}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedDetailNotif(null)}
            className="p-1.5 rounded-lg text-[#93C5FD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#061F40] p-4 rounded-xl border border-[#15488A]">
            <div className="space-y-1">
              <span className="text-[11px] text-[#93C5FD] font-semibold block">Target Destination</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#C5A059]" />
                {notif.targetCountry}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#93C5FD] font-semibold block">Visa Category</span>
              <span className="text-sm font-bold text-[#C5A059] capitalize">
                {notif.visaType || 'General Visa'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#93C5FD] font-semibold block">WhatsApp / Phone</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-white">{notif.whatsapp}</span>
                <button
                  onClick={handleCopyPhone}
                  className="text-[11px] text-[#93C5FD] hover:text-white p-1 rounded hover:bg-[#0B356D]"
                  title="Copy Phone"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#93C5FD] font-semibold block">Inquiry Received</span>
              <span className="text-xs text-[#D1D5DB] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#93C5FD]" />
                {new Date(notif.createdAt).toLocaleString('en-PK', {
                  timeZone: 'Asia/Karachi',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>

            {notif.details?.intakeDate && (
              <div className="space-y-1 sm:col-span-2 border-t border-[#123A6D] pt-2">
                <span className="text-[11px] text-[#93C5FD] font-semibold block">Preferred Intake / Travel Timeline</span>
                <span className="text-xs text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  {notif.details.intakeDate}
                </span>
              </div>
            )}
          </div>

          {/* Uploaded Documents Section (if any) */}
          {notif.details?.documentsList && notif.details.documentsList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Uploaded Documents ({notif.details.documentsList.length})</span>
              </h4>
              <div className="space-y-2">
                {notif.details.documentsList.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-[#051C3A] border border-[#15488A] p-3 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-white">{doc}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      Ready for Review
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick WhatsApp Contact Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>1-Click Pre-Filled WhatsApp Outreach Templates</span>
            </h4>
            <div className="space-y-2.5">
              {quickTemplates.map((template, idx) => (
                <div
                  key={idx}
                  className="bg-[#061F40] border border-[#15488A] p-3.5 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C5A059]">{template.title}</span>
                    <button
                      onClick={() => handleCopyTemplate(template.text, idx)}
                      className="text-[11px] text-[#93C5FD] hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedTemplate === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed bg-[#051C3A] p-2.5 rounded-lg border border-[#123A6D]">
                    "{template.text}"
                  </p>
                  <button
                    onClick={() => openWhatsAppWithText(template.text)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send this Message to Client on WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#051C3A] border-t border-[#123A6D] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {notif.contacted ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Marked as Contacted by Agent</span>
              </span>
            ) : (
              <button
                onClick={() => markAsContacted(notif.id)}
                className="bg-[#092E5E] hover:bg-[#124285] text-white font-semibold py-2 px-3 rounded-lg text-xs border border-[#15488A] flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark as Contacted</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => markAsContacted(notif.id)}
              className="flex-1 sm:flex-none bg-[#0B356D] hover:bg-[#15488A] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#1A4B8A]"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Call Client</span>
            </a>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markAsContacted(notif.id)}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
