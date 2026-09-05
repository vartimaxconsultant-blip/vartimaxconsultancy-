import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation
} from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

export const ContactPage: React.FC = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Contact Info & Map Card */}
          <div className="space-y-6">
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-[#123A6D] pb-3">
                Headquarters &amp; Contact Details
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
                      (Accessible via Islamabad Expressway &amp; GT Road)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Phone &amp; WhatsApp Desk</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href="tel:+923401207525"
                        className="text-[#F3F4F6] font-bold hover:text-[#C5A059] text-sm"
                      >
                        +92 340 1207525
                      </a>
                      <a
                        href="https://wa.me/923401207525"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 px-2 py-0.5 rounded border border-emerald-500/40 transition-colors font-medium"
                      >
                        WhatsApp Us
                      </a>
                    </div>
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

          {/* Right: Contact Form Component */}
          <div>
            <ContactForm
              title="Send Direct Visa Inquiry"
              subtitle="Provide your Name, Email, Phone, and Visa Type. Our case desk in Gaga Downtown Islamabad will review your case immediately."
              defaultVisaType="visit"
              showGoogleFormLink={true}
              googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLSfTltmseyQZmSTnCKxz4JOkcxIZKeEqSJYbtE_jcSYX8rTuWQ/viewform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
