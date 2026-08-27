import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  MapPin,
  Phone,
  Building
} from 'lucide-react';
import { SEO_IMAGES } from '../data/seoImages';

interface AboutPageProps {
  onOpenConsultation: () => void;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenConsultation,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6]">
      {/* Hero */}
      <section className="bg-[#061F40] text-white py-16 px-4 sm:px-8 border-b border-[#123A6D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-luminosity">
          <img
            src={SEO_IMAGES.hero.src}
            alt={SEO_IMAGES.hero.alt}
            title={SEO_IMAGES.hero.title}
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter blur-[3px]"
          />
        </div>
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full border border-[#C5A059]/40">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>ESTABLISHED IN ISLAMABAD, PAKISTAN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About VartiMax Consultant
          </h1>
          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-2xl mx-auto leading-relaxed">
            "Your Global Journey, Our Expertise." We are dedicated to providing ethical, embassy-grade file preparation that achieves an unprecedented <strong className="text-white">90% Visa Acceptance Rate</strong> for Pakistani applicants.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 space-y-16">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: '90%', label: 'Visa Acceptance Rate', sub: 'Industry-leading benchmark' },
            { metric: '5+ Years', label: 'Consultancy Heritage', sub: 'Islamabad headquarters' },
            { metric: '4,800+', label: 'Successful Visas', sub: 'Schengen, Canada, USA, UK' },
            { metric: '350+', label: 'University Partners', sub: 'Global Admissions & CAS' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] text-center space-y-1"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#C5A059]">{item.metric}</div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[11px] text-[#93C5FD]">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* The VartiMax Philosophy with Headquarter Image */}
        <div className="bg-[#07244A] rounded-2xl shadow-sm border border-[#15488A] overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#061F40]">
            <img
              src={SEO_IMAGES.islamabadHq.src}
              alt={SEO_IMAGES.islamabadHq.alt}
              title={SEO_IMAGES.islamabadHq.title}
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07244A] via-[#07244A]/40 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <span className="text-xs font-bold text-[#C5A059] bg-[#061F40]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C5A059]/40 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#C5A059]" />
                Headquarters: Office 78, Basement, Gaga Downtown, Islamabad
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
              <Award className="w-3.5 h-3.5" />
              <span>OUR MISSION & COMMITMENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why 90% of Pakistani Applicants Choose VartiMax
            </h2>
            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
              Visa refusal rates for Pakistani passport holders are at historic highs primarily due to poorly drafted cover letters, weak justification of socio-economic roots, and unverified reservations. At <strong className="text-white">VartiMax Consultant</strong>, we treat every visa application as a legal and evidentiary brief.
            </p>
            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
              From our headquarters at <strong className="text-white">Office 78, Basement, Gaga Downtown, Islamabad</strong>, our case officers conduct forensic audits of your bank statements, tax returns, and employer certificates before engineering custom Day-by-Day travel itineraries and embassy forms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                '100% Genuine, Verifiable GDS Flight Reservations (Live PNR)',
                'Embassy-Standard Day-by-Day Travel Itineraries',
                'Custom Cover Letters & Academic SOP Drafting',
                'Zero-Deductible €30,000 Schengen Travel Insurance',
                'Direct Submission at VFS Global / Gerry’s Islamabad Support',
                'Complete Transparent Guidance with No Hidden Charges'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#E0E7FF]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visit Our Islamabad Office */}
        <div className="bg-[#07244A] border border-[#15488A] text-white p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full border border-[#C5A059]/40">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ISLAMABAD OFFICE WALK-IN HOURS</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Office 78, Basement, Gaga Downtown, Islamabad
            </h3>
            <p className="text-xs text-[#D1D5DB] max-w-lg">
              Visit our office for an in-person case evaluation with our senior visa strategists. Open Monday to Saturday, 10:00 AM to 7:00 PM.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold px-6 py-3.5 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
            >
              Book In-Person Appointment
            </button>
            <a
              href="https://wa.me/923401207525?text=Hello%20VartiMax,%20I%20would%20like%20to%20visit%20your%20Islamabad%20office."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
