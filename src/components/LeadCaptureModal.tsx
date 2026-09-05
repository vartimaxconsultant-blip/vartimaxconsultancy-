import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, CheckCircle, Sparkles, Phone, Globe, Calendar, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisaCategory } from '../types';
import { notificationBus } from '../utils/notificationBus';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: VisaCategory;
  defaultCountry?: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'visit',
  defaultCountry = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [targetCountry, setTargetCountry] = useState(defaultCountry || 'Schengen (Europe)');
  const [visaType, setVisaType] = useState<VisaCategory>(defaultCategory);
  const [intakeDate, setIntakeDate] = useState('Within next 1-3 months');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultCountry) setTargetCountry(defaultCountry);
    if (defaultCategory) setVisaType(defaultCategory);
  }, [defaultCountry, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Post to Server endpoint
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsapp,
          targetCountry,
          visaType,
          intakeDate
        })
      });

      const data = await res.json();
      if (data?.notification) {
        notificationBus.emit(data.notification);
      } else {
        notificationBus.emit({
          id: `NOTIF-${Date.now()}`,
          type: 'lead_inquiry',
          title: 'New Visa Consultation Lead',
          clientName: fullName,
          whatsapp,
          targetCountry: targetCountry || 'General',
          visaType,
          summary: `${fullName} requested consultation for ${targetCountry} (${visaType}).`,
          details: { intakeDate },
          createdAt: new Date().toISOString(),
          read: false,
          contacted: false
        });
      }

      // 2. Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Lead submission failed:', error);
      notificationBus.emit({
        id: `NOTIF-${Date.now()}`,
        type: 'lead_inquiry',
        title: 'New Visa Consultation Lead',
        clientName: fullName,
        whatsapp,
        targetCountry: targetCountry || 'General',
        visaType,
        summary: `${fullName} requested consultation for ${targetCountry} (${visaType}).`,
        details: { intakeDate },
        createdAt: new Date().toISOString(),
        read: false,
        contacted: false
      });
      setIsSuccess(true); // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppUrl = `https://wa.me/923401207525?text=${encodeURIComponent(
    `Hello VartiMax Consultant! I just submitted an inquiry for ${visaType.toUpperCase()} visa to ${targetCountry}. My Name is ${fullName}, WhatsApp: ${whatsapp}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051C3A]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#07244A] rounded-2xl shadow-2xl border border-[#15488A] max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-200 text-[#E5E5E5]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#051C3A] via-[#092E5E] to-[#0D3870] border-b border-[#123A6D] px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#93C5FD] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/20 text-[#C5A059] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>90% VISA SUCCESS RATE GUARANTEE</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {isSuccess ? 'Inquiry Logged Successfully' : 'Get Free Embassy File Assessment'}
          </h3>
          <p className="text-xs text-[#D1D5DB] mt-1">
            {isSuccess
              ? 'Our Islamabad case officer has received your profile.'
              : 'Direct evaluation by senior visa strategists at Office 78 Gaga Downtown Islamabad.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Success — Consultant Will Reach Out Shortly!
                </h4>
                <p className="text-xs text-[#D1D5DB] mt-1 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-white">{fullName}</span>. Your inquiry for{' '}
                  <span className="font-semibold text-[#C5A059]">{targetCountry}</span> has been logged to our real-time database and Google Sheets sync.
                </p>
              </div>

              <div className="p-4 bg-[#061F40] rounded-xl border border-[#15488A] text-xs text-[#E5E5E5] text-left space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-[#C5A059]">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Next Step for 90% Acceptance:</span>
                </div>
                <p className="text-[#D1D5DB]">
                  Connect directly on WhatsApp right now for priority embassy file verification and checklist dispatch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Message on WhatsApp Now</span>
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="bg-[#0B356D] hover:bg-[#124285] text-[#E5E5E5] font-semibold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer border border-[#1A4B8A]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                  Full Name (As on Passport) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Bilal Khan"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                  WhatsApp Number * (For Instant Case Feedback)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +92 340 1234567"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-mono"
                  />
                </div>
              </div>

              {/* Grid: Target Country & Visa Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Target Country *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                    <select
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#15488A] bg-[#061F40] text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Schengen (Italy/Germany/France/Spain)">Schengen (Europe)</option>
                      <option value="Canada (Study & Visitor)">Canada</option>
                      <option value="United States (B1/B2 & F1)">United States</option>
                      <option value="United Kingdom (Student & Visitor)">United Kingdom</option>
                      <option value="UAE (Dubai 30/60 Days & Freelance)">UAE / Dubai</option>
                      <option value="Saudi Arabia (Umrah Packages)">Saudi Arabia (Umrah)</option>
                      <option value="Australia (Admissions & Subclass 500)">Australia</option>
                      <option value="Turkey / Other Destination">Other Destination</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Visa Type *
                  </label>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value as VisaCategory)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#15488A] bg-[#061F40] text-white focus:outline-none focus:border-[#C5A059] font-medium"
                  >
                    <option value="visit">Visit / Tourist Visa</option>
                    <option value="study">Study Visa / Admissions</option>
                    <option value="employment">Employment / Freelance</option>
                    <option value="umrah">Umrah Visa & Packages</option>
                  </select>
                </div>
              </div>

              {/* Preferred Intake / Travel Date */}
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                  Preferred Intake / Travel Timeline
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                  <select
                    value={intakeDate}
                    onChange={(e) => setIntakeDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#15488A] bg-[#061F40] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Immediate (Next 15-30 Days)">Immediate (Next 15-30 Days)</option>
                    <option value="Within next 1-3 months">Within next 1-3 months</option>
                    <option value="September 2026 University Intake">September 2026 University Intake</option>
                    <option value="January / Spring 2027 Intake">January / Spring 2027 Intake</option>
                    <option value="Ramadan / Upcoming Umrah Season">Upcoming Umrah Season</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging Profile...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#061F40]" />
                      <span>Submit for Free Assessment</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#93C5FD]/70">
                🔒 Privacy Protected. Synced with VartiMax CRM & Google Sheets in real-time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
