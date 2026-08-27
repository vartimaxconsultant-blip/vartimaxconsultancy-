import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Globe,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileCheck2,
  Phone,
  Sparkles,
  MapPin
} from 'lucide-react';
import { VisaServiceDetail } from '../types';
import { DOCUMENT_REQUIREMENTS } from '../data/requirementsData';

interface ServiceDetailPageProps {
  service: VisaServiceDetail;
  onOpenConsultation: () => void;
  onNavigateToPortal: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onOpenConsultation,
  onNavigateToPortal
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const requirements = DOCUMENT_REQUIREMENTS[service.category] || [];

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6]">
      {/* Hero Banner with Rich Brand Styling */}
      <section className="bg-gradient-to-r from-[#061F40] via-[#092E5E] to-[#061F40] text-white py-14 px-4 sm:px-8 border-b border-[#15488A]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#C5A059] text-[#061F40] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#061F40]" />
              {service.acceptanceRate} ACCEPTANCE RATE
            </span>
            <span className="text-xs text-[#D1D5DB] font-medium">
              Embassy-Verified File Architecture • Islamabad Desk
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
            {service.title}
          </h1>

          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-3xl leading-relaxed">
            {service.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#15488A]">
            <div className="bg-[#07244A] p-3.5 rounded-xl border border-[#15488A]">
              <div className="flex items-center gap-1.5 text-[#C5A059] text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Processing Time</span>
              </div>
              <div className="text-sm font-bold text-white">{service.processingTime}</div>
            </div>

            <div className="bg-[#07244A] p-3.5 rounded-xl border border-[#15488A]">
              <div className="flex items-center gap-1.5 text-[#C5A059] text-xs font-semibold mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Stay Duration</span>
              </div>
              <div className="text-sm font-bold text-white">{service.stayDuration || '30 - 90 Days'}</div>
            </div>

            <div className="bg-[#07244A] p-3.5 rounded-xl border border-[#15488A]">
              <div className="flex items-center gap-1.5 text-[#C5A059] text-xs font-semibold mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Embassy Fee Est.</span>
              </div>
              <div className="text-sm font-bold text-white">{service.embassyFee || 'Standard Embassy Rate'}</div>
            </div>

            <div className="bg-[#07244A] p-3.5 rounded-xl border border-[#15488A]">
              <div className="flex items-center gap-1.5 text-[#C5A059] text-xs font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Submission Center</span>
              </div>
              <div className="text-sm font-bold text-white">Islamabad / Gerry's / VFS</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenConsultation}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl hover:shadow-[#C5A059]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#061F40]" />
              <span>Book Visa File Assessment</span>
            </button>
            <button
              onClick={onNavigateToPortal}
              className="bg-[#061F40] hover:bg-[#0B356D] text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-[#15488A] transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>Upload Documents to Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* Section 1: Countries & File Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Deliverables & Countries */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image & Countries Covered */}
            <div className="bg-[#07244A] rounded-2xl shadow-sm border border-[#15488A] overflow-hidden space-y-4">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#061F40]">
                <img
                  src={service.bannerImage}
                  alt={`${service.title} - VartiMax Consultant Islamabad Embassy File Preparation`}
                  title={`${service.title} Requirements & Processing from Pakistan`}
                  width={1200}
                  height={800}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07244A] via-[#07244A]/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#C5A059] bg-[#061F40]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C5A059]/40 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    {service.badge}
                  </span>
                  <span className="text-[11px] text-white/90 bg-[#061F40]/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-mono">
                    📍 Islamabad Processing Desk
                  </span>
                </div>
              </div>

              <div className="p-6 pt-2 space-y-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#C5A059]" />
                  <span>Destinations Covered Under This Service</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.countries.map((c, i) => (
                    <span
                      key={i}
                      className="bg-[#061F40] text-[#E0E7FF] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#15488A]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* What VartiMax Engineers For Your File */}
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>THE VARTIMAX FILE ADVANTAGE</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Complete End-to-End File Deliverables
              </h2>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Embassies in Islamabad scrutinize every application for credibility, financial viability, and return intentions. We prepare a flawless, cross-referenced dossier:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(service.highlights || service.whyCrucial).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061F40] border border-[#15488A]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-[#E0E7FF] leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Document Checklist for this Category */}
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-5">
              <div className="flex items-center justify-between border-b border-[#123A6D] pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Required Document Checklist
                  </h2>
                  <p className="text-xs text-[#D1D5DB] mt-0.5">
                    Official embassy checklist for Pakistani passport holders.
                  </p>
                </div>
                <button
                  onClick={onNavigateToPortal}
                  className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Upload Online
                </button>
              </div>

              <div className="space-y-3">
                {requirements.map((req, idx) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#061F40] border border-[#15488A] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="text-[#C5A059] font-mono">#{idx + 1}</span>
                        <span>{req.title}</span>
                      </h3>
                      {req.mandatory && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#D1D5DB]">{req.description}</p>
                    {req.tip && (
                      <p className="text-[11px] text-[#C5A059] font-medium pt-1">
                        💡 <strong>Embassy Tip:</strong> {req.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
              <h2 className="text-xl font-bold text-white">
                Frequently Asked Questions ({service.shortTitle})
              </h2>
              <p className="text-xs text-[#D1D5DB]">
                Key questions answered by our Islamabad senior consultants.
              </p>

              <div className="space-y-3 pt-2">
                {service.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="border border-[#15488A] rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-4 bg-[#061F40] hover:bg-[#0B356D] flex items-center justify-between gap-4 font-semibold text-xs text-white cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#93C5FD] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#93C5FD] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-[#051A36] text-xs text-[#D1D5DB] leading-relaxed border-t border-[#15488A] animate-in fade-in duration-150">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Consultation Box */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-[#07244A] p-6 rounded-2xl shadow-lg border border-[#15488A] space-y-5">
              <div className="text-center space-y-2 border-b border-[#123A6D] pb-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Start {service.shortTitle} File
                </h3>
                <p className="text-xs text-[#D1D5DB]">
                  Direct review by Islamabad Case Strategists
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-[#E0E7FF]">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free Initial Profile Evaluation</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verifiable Live PNR Flight Bookings</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-deductible Embassy Insurance</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Embassy Appointment Booking Support</span>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold py-3.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Free Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#061F40]" />
              </button>

              <a
                href={`https://wa.me/923401207525?text=${encodeURIComponent(
                  `Hello VartiMax Consultant, I want to apply for ${service.title}. Please guide me on file preparation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Consultant (+92 340 1207525)</span>
              </a>

              <div className="p-3 bg-[#061F40] border border-[#15488A] rounded-xl text-[11px] text-[#D1D5DB] text-center">
                📍 <strong>Visit Office:</strong> Office 78, Basement, Gaga Downtown, Islamabad.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
