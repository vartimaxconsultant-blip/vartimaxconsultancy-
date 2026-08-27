import React from 'react';
import { Logo } from './Logo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Table,
  Lock
} from 'lucide-react';
import { VISA_SERVICES } from '../data/servicesData';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenGoogleSheetsModal: () => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenGoogleSheetsModal,
  onOpenConsultation
}) => {
  const handleNav = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#051C3A] text-[#C7D2FE] border-t border-[#0C356A]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#061F40] via-[#092E5E] to-[#061F40] border-b border-[#0E3D7D] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full text-xs font-bold border border-[#C5A059]/40 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              90% VISA SUCCESS RATE GUARANTEED FILE PREPARATION
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Start Your Global Journey with VartiMax?
            </h3>
            <p className="text-[#E0E7FF]/80 text-sm mt-1 max-w-xl">
              Get your profile professionally evaluated by senior embassy file strategists in Islamabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-[#C5A059]/20 transition-all text-sm cursor-pointer"
            >
              Book Free Assessment
            </button>
            <a
              href="https://wa.me/923401207525?text=Hello%20VartiMax%20Consultant,%20I%20want%20to%20inquire%20about%20visa%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center gap-2 shadow-lg"
            >
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-xl inline-block shadow-md">
            <Logo size="md" variant="full" />
          </div>
          <p className="text-xs text-[#93C5FD]/80 leading-relaxed">
            VartiMax Consultant is Islamabad's premier visa, immigration, and global admissions consultancy. We engineer airtight, embassy-compliant visa files that eliminate refusal risks.
          </p>
          <div className="pt-2 space-y-1.5 text-xs text-[#C7D2FE]">
            <div className="flex items-center gap-2 text-[#C5A059] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Cover Letters & Day-by-Day Itineraries</span>
            </div>
            <div className="flex items-center gap-2 text-[#C5A059] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>GDS Flight Reservations & €30k Insurance</span>
            </div>
            <div className="flex items-center gap-2 text-[#C5A059] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>FBR Tax, Bank Statement & SOP Structuring</span>
            </div>
          </div>
        </div>

        {/* Col 2: Services SEO links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
            Embassy Visa Services
          </h4>
          <ul className="space-y-2.5 text-xs text-[#93C5FD]/80">
            {VISA_SERVICES.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#service-${s.slug}`}
                  onClick={(e) => { e.preventDefault(); handleNav(`service-${s.slug}`); }}
                  className="hover:text-[#C5A059] transition-colors text-left flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {s.title.split(' in ')[0]}
                  </span>
                  <span className="text-[10px] text-[#93C5FD]/60 font-mono">
                    {s.acceptanceRate}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="#document-portal"
                onClick={(e) => { e.preventDefault(); handleNav('document-portal'); }}
                className="text-[#C5A059] font-semibold hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Upload Documents to Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Portals & Tools */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
            Client Hub & Systems
          </h4>
          <ul className="space-y-2.5 text-xs text-[#93C5FD]/80">
            <li>
              <a
                href="#blogs"
                onClick={(e) => { e.preventDefault(); handleNav('blogs'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left font-semibold text-white flex items-center gap-1.5"
              >
                <span>Visa Guides &amp; Knowledge Hub</span>
                <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] px-1.5 py-0.5 rounded border border-[#C5A059]/40">SEO Hub</span>
              </a>
            </li>
            <li>
              <a
                href="#document-portal"
                onClick={(e) => { e.preventDefault(); handleNav('document-portal'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left block"
              >
                Client Document Submission Portal
              </a>
            </li>
            <li>
              <a
                href="#eligibility-calculator"
                onClick={(e) => { e.preventDefault(); handleNav('assessment'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left block"
              >
                Visa Success Probability Calculator
              </a>
            </li>
            <li>
              <a
                href="#ai-builder"
                onClick={(e) => { e.preventDefault(); handleNav('ai-file-assistant'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left block"
              >
                AI Embassy Cover Letter Generator
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); handleNav('about'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left block"
              >
                About Our 5+ Year Track Record
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                className="hover:text-[#C5A059] transition-colors cursor-pointer text-left block"
              >
                Islamabad Office Directions &amp; Timings
              </a>
            </li>
            <li className="pt-2">
              <button
                onClick={onOpenGoogleSheetsModal}
                className="inline-flex items-center gap-1.5 bg-[#07244A] hover:bg-[#0B356D] text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Google Sheets Sync Integration</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Official Islamabad Address */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
            Islamabad Headquarters
          </h4>
          <div className="space-y-3 text-xs text-[#C7D2FE]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>Office 78, Basement, Gaga Downtown, Islamabad, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href="tel:+923401207525" className="hover:text-[#C5A059] font-semibold text-white">
                +92 340 1207525
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href="mailto:vartimaxconsultant@gmail.com" className="hover:text-[#C5A059]">
                vartimaxconsultant@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Monday – Saturday: 10:00 AM – 7:00 PM</span>
            </div>
            <div className="p-3 bg-[#07244A] rounded-lg border border-[#15488A] text-[11px] text-[#93C5FD]/80">
              <span className="text-[#C5A059] font-bold block mb-0.5">Walk-in Consultations:</span>
              Free initial case screening available at our Gaga Downtown Islamabad office.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0C356A] py-6 px-4 sm:px-8 text-center text-xs text-[#93C5FD]/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} VartiMax Consultant. All Rights Reserved. "Your Global Journey, Our Expertise."</p>
          <div className="flex items-center gap-4 text-[#93C5FD]/80">
            <span>Islamabad / Rawalpindi, Pakistan</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              SSL 256-bit Encrypted Portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
