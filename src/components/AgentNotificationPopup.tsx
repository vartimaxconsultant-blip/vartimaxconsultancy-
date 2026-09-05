import React, { useEffect, useState } from 'react';
import {
  BellRing,
  Phone,
  MessageCircle,
  FileText,
  X,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useAgentNotifications } from '../context/AgentNotificationContext';

export const AgentNotificationPopup: React.FC = () => {
  const {
    activePopup,
    dismissPopup,
    markAsContacted,
    setSelectedDetailNotif,
    soundEnabled,
    toggleSound
  } = useAgentNotifications();

  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown bar (30 seconds, but pauses on hover)
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!activePopup) return;
    setProgress(100);
    setCopied(false);

    const duration = 25000; // 25 seconds
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            dismissPopup();
            return 0;
          }
          return prev - step;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activePopup, isHovered, dismissPopup]);

  if (!activePopup) return null;

  const cleanPhone = activePopup.whatsapp.replace(/\D/g, '');
  const whatsAppGreeting = encodeURIComponent(
    `Assalam-o-Alaikum ${activePopup.clientName}!\n\nI am your assigned Visa Consultant from VartiMax Consultant (Office 78 Gaga Downtown Islamabad).\n\nWe received your inquiry regarding ${activePopup.targetCountry} (${activePopup.visaType || 'Visa'}). I am reviewing your profile right now. Are you available for a quick discussion regarding your embassy file requirements?`
  );

  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${whatsAppGreeting}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activePopup.whatsapp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDocUpload = activePopup.type === 'document_upload';

  return (
    <div
      className="fixed top-20 right-4 z-50 max-w-md w-full sm:w-[420px] transition-all animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#051C3A] text-white rounded-2xl shadow-2xl border-2 border-[#C5A059] overflow-hidden backdrop-blur-xl relative">
        {/* Glowing Ambient Top Bar */}
        <div className="bg-gradient-to-r from-[#C5A059] via-[#E6C687] to-[#C5A059] h-1.5 w-full"></div>

        {/* Progress Bar for Auto-dismiss */}
        <div className="bg-[#0B356D] h-1 w-full">
          <div
            className="bg-[#C5A059] h-full transition-all ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-3.5">
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-1 rounded-full text-xs font-black border border-[#C5A059]/50 animate-pulse">
              <BellRing className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                {isDocUpload ? '🚨 CLIENT DOCUMENTS UPLOADED' : '⚡ NEW CONSULTATION LEAD'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className="p-1 rounded text-[#93C5FD] hover:text-white hover:bg-white/10 transition-colors"
                title={soundEnabled ? 'Alert Sound is On' : 'Alert Sound is Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={dismissPopup}
                className="p-1 rounded text-[#93C5FD] hover:text-white hover:bg-white/10 transition-colors"
                title="Dismiss Popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <span>{activePopup.clientName}</span>
                {activePopup.contacted && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Contacted
                  </span>
                )}
              </h4>
              <span className="text-[11px] font-semibold text-[#93C5FD]">
                Just Now
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="bg-[#092E5E] text-[#93C5FD] text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-[#15488A]">
                🎯 {activePopup.targetCountry}
              </span>
              {activePopup.details?.referenceId && (
                <span className="bg-[#061F40] text-[#C5A059] font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-[#C5A059]/30">
                  {activePopup.details.referenceId}
                </span>
              )}
            </div>

            <p className="text-xs text-[#D1D5DB] pt-1 leading-relaxed">
              {activePopup.summary}
            </p>
          </div>

          {/* Contact Number Strip with Copy */}
          <div className="bg-[#07244A] border border-[#15488A] rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-white tracking-wide font-mono">
                {activePopup.whatsapp}
              </span>
            </div>
            <button
              onClick={handleCopyNumber}
              className="text-[11px] font-semibold text-[#93C5FD] hover:text-white flex items-center gap-1 bg-[#092E5E] px-2 py-1 rounded border border-[#15488A] hover:bg-[#0B356D] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons for Agent */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* WhatsApp Client Direct */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markAsContacted(activePopup.id)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Client</span>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => markAsContacted(activePopup.id)}
              className="bg-[#092E5E] hover:bg-[#0E3E7A] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#15488A] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Call Direct</span>
            </a>
          </div>

          {/* Secondary Actions: Open Dossier & Mark Contacted */}
          <div className="flex items-center justify-between pt-1 border-t border-[#123A6D] text-xs">
            <button
              onClick={() => {
                setSelectedDetailNotif(activePopup);
                dismissPopup();
              }}
              className="text-[#C5A059] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isDocUpload ? 'Inspect Uploaded Files' : 'View Full Profile'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => markAsContacted(activePopup.id)}
              className="text-[#93C5FD] hover:text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Contacted</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
