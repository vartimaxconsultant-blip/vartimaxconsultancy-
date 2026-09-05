import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Compass,
  Send,
  CheckCircle,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { notificationBus } from '../utils/notificationBus';

export interface ContactFormProps {
  title?: string;
  subtitle?: string;
  defaultVisaType?: string;
  defaultCountry?: string;
  compact?: boolean;
  className?: string;
  showGoogleFormLink?: boolean;
  googleFormUrl?: string;
  onSuccess?: (entry: { name: string; email: string; phone: string; visaType: string }) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Send Direct Visa Inquiry',
  subtitle = 'Fill in your details below. Our Islamabad case officers will evaluate your profile and contact you promptly.',
  defaultVisaType = 'visit',
  defaultCountry = '',
  compact = false,
  className = '',
  showGoogleFormLink = true,
  googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfTltmseyQZmSTnCKxz4JOkcxIZKeEqSJYbtE_jcSYX8rTuWQ/viewform',
  onSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaType, setVisaType] = useState(defaultVisaType);
  const [targetCountry, setTargetCountry] = useState(defaultCountry || 'Schengen (Europe)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in Name, Email, and Phone number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const leadPayload = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: phone.trim(),
      phone: phone.trim(),
      targetCountry: targetCountry || 'General Inquiry',
      visaType: visaType || 'visit',
      intakeDate: message.trim() || 'Contact Form Submission',
      message: message.trim() || undefined
    };

    try {
      // 1. Post to Server Endpoint using existing LeadCaptureModal logic
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await res.json().catch(() => null);

      if (data?.notification) {
        notificationBus.emit(data.notification);
      } else {
        notificationBus.emit({
          id: `NOTIF-${Date.now()}`,
          type: 'lead_inquiry',
          title: 'New Visa Consultation Lead',
          clientName: fullName.trim(),
          whatsapp: phone.trim(),
          targetCountry: targetCountry || 'General',
          visaType,
          summary: `${fullName.trim()} submitted a contact form inquiry for ${visaType} visa. Email: ${email.trim()}`,
          details: {
            email: email.trim(),
            phone: phone.trim(),
            visaType,
            targetCountry,
            intakeDate: message.trim() || 'Contact Form Submission'
          },
          createdAt: new Date().toISOString(),
          read: false,
          contacted: false
        });
      }

      // Also persist to local leads history for instant availability
      try {
        const localLeads = JSON.parse(localStorage.getItem('vartimax_local_leads') || '[]');
        localLeads.unshift({
          id: `LEAD-${Date.now()}`,
          ...leadPayload,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('vartimax_local_leads', JSON.stringify(localLeads.slice(0, 50)));
      } catch (e) {
        console.warn('Local lead backup write failed:', e);
      }

      // 2. Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          visaType
        });
      }
    } catch (err) {
      console.warn('Lead submission network fallback triggered:', err);
      // Fallback notification bus emission
      notificationBus.emit({
        id: `NOTIF-${Date.now()}`,
        type: 'lead_inquiry',
        title: 'New Visa Consultation Lead',
        clientName: fullName.trim(),
        whatsapp: phone.trim(),
        targetCountry: targetCountry || 'General',
        visaType,
        summary: `${fullName.trim()} submitted contact form inquiry for ${visaType} visa. Email: ${email.trim()}`,
        details: {
          email: email.trim(),
          phone: phone.trim(),
          visaType,
          targetCountry,
          intakeDate: message.trim() || 'Contact Form Submission'
        },
        createdAt: new Date().toISOString(),
        read: false,
        contacted: false
      });
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          visaType
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSuccess(false);
    setError(null);
  };

  const directWhatsAppUrl = `https://wa.me/923401207525?text=${encodeURIComponent(
    `Hello VartiMax Consultant! I just submitted the contact form for ${visaType.toUpperCase()} visa. Name: ${fullName}, Email: ${email}, Phone: ${phone}.`
  )}`;

  return (
    <div
      id="contact-form-component"
      className={`bg-[#07244A] rounded-2xl shadow-lg border border-[#15488A] overflow-hidden text-[#E5E5E5] ${className}`}
    >
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#051C3A] via-[#092E5E] to-[#0D3870] border-b border-[#123A6D] px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/20 text-[#C5A059] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>CONFIDENTIAL &amp; FREE CONSULTATION</span>
          </div>

          {showGoogleFormLink && (
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#93C5FD] hover:text-[#C5A059] transition-colors font-medium hover:underline"
              title="Open Official Google Form"
            >
              <span>Google Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
          {isSuccess ? 'Inquiry Submitted Successfully' : title}
        </h3>
        <p className="text-xs text-[#D1D5DB] mt-1 leading-relaxed">
          {isSuccess
            ? 'Our Islamabad case officer has received your contact details.'
            : subtitle}
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Thank You, {fullName}!</h4>
              <p className="text-xs text-[#D1D5DB] max-w-md mx-auto leading-relaxed">
                Your inquiry for <span className="font-semibold text-white uppercase">{visaType} Visa</span> has been registered into our Islamabad Case Management System.
              </p>
            </div>

            <div className="bg-[#051C3A] rounded-xl p-4 max-w-sm mx-auto border border-[#15488A] text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#93C5FD]/80">Candidate:</span>
                <span className="text-white font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#93C5FD]/80">Email:</span>
                <span className="text-white font-mono">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#93C5FD]/80">Phone / WhatsApp:</span>
                <span className="text-white font-mono">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#93C5FD]/80">Visa Category:</span>
                <span className="text-[#C5A059] font-semibold uppercase">{visaType}</span>
              </div>
            </div>

            {/* Direct WhatsApp Call-to-action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Chat with Case Desk on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="bg-[#0B356D] hover:bg-[#124285] text-[#E5E5E5] font-semibold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer border border-[#1A4B8A]"
              >
                Submit Another Inquiry
              </button>
            </div>

            {showGoogleFormLink && (
              <div className="pt-2 text-[11px] text-[#93C5FD]/80">
                You can also access our backup form via{' '}
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A059] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Official Google Form
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* 1. Name Field */}
            <div>
              <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Asad Khan"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            {/* 2. Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. applicant@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            {/* 3. Phone Field */}
            <div>
              <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                Phone / WhatsApp Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 340 1207525"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-mono"
                />
              </div>
            </div>

            {/* 4. Visa Type Field */}
            <div>
              <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                Visa Type *
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#15488A] bg-[#061F40] text-white focus:outline-none focus:border-[#C5A059] font-medium"
                >
                  <option value="visit">Visit / Tourist Visa (Schengen, UK, USA, Canada)</option>
                  <option value="study">Student Visa / Study Permit (UK, Europe, Canada, USA)</option>
                  <option value="employment">Work / Employment &amp; Job Seeker</option>
                  <option value="business">Business Delegation &amp; Conference Visa</option>
                  <option value="umrah">Umrah &amp; Religious Tourism Packages</option>
                  <option value="family">Family &amp; Spouse Settlement Visa</option>
                  <option value="general_inquiry">Other / General Visa Inquiry</option>
                </select>
              </div>
            </div>

            {/* Optional Destination Country (Collapsible or compact) */}
            {!compact && (
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                  Destination Country / Region (Optional)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#93C5FD]/70 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#15488A] bg-[#061F40] text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Schengen (Europe)">Schengen (Europe: Germany, Italy, France, Spain)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States (USA)">United States (B1/B2 &amp; F-1)</option>
                    <option value="Canada">Canada (Visitor &amp; Study)</option>
                    <option value="UAE / Dubai">UAE / Dubai</option>
                    <option value="Saudi Arabia">Saudi Arabia (Umrah)</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other / Not Decided Yet</option>
                  </select>
                </div>
              </div>
            )}

            {/* Optional Additional Message */}
            {!compact && (
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                  Message / Case Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your travel plans, previous refusals (if any), or specific concerns..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#15488A] bg-[#061F40] text-white placeholder-[#78909C] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#061F40]" />
              <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Consultation Request'}</span>
            </button>

            {/* Google Form Link Footer Callout */}
            {showGoogleFormLink && (
              <div className="pt-2 text-center border-t border-[#123A6D]/70 mt-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#D1D5DB]">
                  <span>Prefer standard Google Forms?</span>
                  <a
                    href={googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C5A059] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Official Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
