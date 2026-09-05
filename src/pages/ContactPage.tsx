import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { notificationBus } from '../utils/notificationBus';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState('Schengen (Europe)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsapp,
          targetCountry,
          visaType: 'general_inquiry',
          intakeDate: message || 'Contact Page Message'
        })
      });

      const data = await res.json();
      if (data?.notification) {
        notificationBus.emit(data.notification);
      } else {
        notificationBus.emit({
          id: `NOTIF-${Date.now()}`,
          type: 'contact_query',
          title: 'Direct Website Contact Query',
          clientName: fullName,
          whatsapp,
          targetCountry,
          visaType: 'General Inquiry',
          summary: `${fullName} sent a direct message from the Islamabad Contact page: "${message || 'Inquiry regarding visa guidance'}"`,
          details: { intakeDate: message },
          createdAt: new Date().toISOString(),
          read: false,
          contacted: false
        });
      }

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      notificationBus.emit({
        id: `NOTIF-${Date.now()}`,
        type: 'contact_query',
        title: 'Direct Website Contact Query',
        clientName: fullName,
        whatsapp,
        targetCountry,
        visaType: 'General Inquiry',
        summary: `${fullName} sent a direct message from the Islamabad Contact page.`,
        details: { intakeDate: message },
        createdAt: new Date().toISOString(),
        read: false,
        contacted: false
      });
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C5A059]/40">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>ISLAMABAD HEADQUARTERS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Contact VartiMax Consultant
          </h1>
          <p className="text-xs sm:text-sm text-[#D1D5DB]">
            Visit our office in Gaga Downtown Islamabad or connect with our senior visa case officers for an immediate evaluation.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Contact Info & Map Card */}
          <div className="space-y-6">
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-[#123A6D] pb-3">
                Headquarters & Contact Details
              </h3>

              <div className="space-y-4 text-xs text-[#E0E7FF]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 border border-[#C5A059]/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Office Location</span>
                    <p className="text-[#D1D5DB] mt-0.5 leading-relaxed">
                      Office 78, Basement, Gaga Downtown, Islamabad, Pakistan
                    </p>
                    <span className="text-[11px] text-[#C5A059] font-medium block mt-1">
                      (Accessible via Islamabad Expressway & GT Road)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Phone & WhatsApp Desk</span>
                    <a
                      href="tel:+923401207525"
                      className="text-[#F3F4F6] font-bold hover:text-[#C5A059] text-sm block mt-0.5"
                    >
                      +92 340 1207525
                    </a>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      24/7 Dedicated WhatsApp Support Available
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Official Email</span>
                    <a
                      href="mailto:vartimaxconsultant@gmail.com"
                      className="text-[#93C5FD] hover:text-[#C5A059] block mt-0.5"
                    >
                      vartimaxconsultant@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Working Hours</span>
                    <p className="text-[#D1D5DB] mt-0.5">
                      Monday – Saturday: 10:00 AM – 7:00 PM
                    </p>
                    <span className="text-[11px] text-[#93C5FD]/70">Sunday: By Prior Appointment Only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame Card */}
            <div className="bg-[#07244A] text-white p-6 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Navigation className="w-4 h-4 text-[#C5A059]" />
                  <span>Google Maps Landmark: Gaga Downtown</span>
                </div>
                <span className="text-[11px] text-[#C5A059] font-mono">Islamabad</span>
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-[#061F40] relative border border-[#15488A]">
                <iframe
                  title="VartiMax Consultant Islamabad Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106263.38541999933!2d72.9694723!3d33.6844202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b6!2sIslamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A]">
            <h3 className="text-lg font-bold text-white border-b border-[#123A6D] pb-3 mb-4">
              Send Direct Inquiry to Case Desk
            </h3>

            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-[#D1D5DB] max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-white">{fullName}</span>. A case officer will review your inquiry and contact you via WhatsApp (+92 340 1207525).
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-[#C5A059] text-[#061F40] text-xs font-extrabold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#D4AF37] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asad Mehmood"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +92 340 1207525"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="applicant@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Target Destination
                  </label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white"
                  >
                    <option value="Schengen (Europe)">Schengen (Europe)</option>
                    <option value="Canada (Study & Visitor)">Canada</option>
                    <option value="United States (B1/B2 & F1)">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="UAE / Dubai">UAE / Dubai</option>
                    <option value="Saudi Arabia (Umrah)">Saudi Arabia (Umrah)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Your Message / Specific Inquiry
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your current status, travel history, or any specific visa questions..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#061F40]" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
