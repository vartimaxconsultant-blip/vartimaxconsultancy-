import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Plane,
  FileText,
  Star,
  Award,
  ArrowRight,
  Globe,
  MapPin,
  Phone,
  Sparkles,
  ChevronRight,
  Building,
  GraduationCap,
  Briefcase,
  Compass,
  FileCheck2,
  Clock
} from 'lucide-react';
import { VISA_SERVICES } from '../data/servicesData';
import { TESTIMONIALS } from '../data/testimonialsData';
import { QuickAssessmentWidget } from '../components/QuickAssessmentWidget';
import { SEO_IMAGES } from '../data/seoImages';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenConsultation: () => void;
  onSelectService: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onSelectService
}) => {

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#051C3A] via-[#092E5E] to-[#0E3D7D] text-white pt-12 pb-20 px-4 sm:px-8 border-b border-[#0C356A]">
        {/* Ambient Dark Overlay with SEO-Grounding Visual */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity overflow-hidden">
          <img
            src={SEO_IMAGES.hero.src}
            alt={SEO_IMAGES.hero.alt}
            title={SEO_IMAGES.hero.title}
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter blur-[2px] scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#092E5E] via-[#092E5E]/85 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-black px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>90% VISA ACCEPTANCE RATE • ISLAMABAD'S PREMIER VISA DESK</span>
              </div>

              {/* H1 Primary SEO Title */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
                Airtight Visa Files.{' '}
                <span className="text-[#C5A059] block sm:inline">
                  90% Guaranteed Acceptance.
                </span>
              </h1>

              {/* Tagline & Subheading */}
              <p className="text-sm sm:text-base text-[#D1D5DB] max-w-2xl leading-relaxed">
                <strong className="text-white">VartiMax Consultant</strong> specializes in embassy-optimized visa file creation for Pakistani applicants. We eliminate refusal risks with verified GDS flight reservations, custom cover letters, day-by-day itineraries, and €30k insurance.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold px-7 py-4 rounded-xl text-sm shadow-xl hover:shadow-[#C5A059]/20 transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <FileCheck2 className="w-4 h-4 text-[#061F40]" />
                  <span>Book Free Embassy File Review</span>
                </button>

                <button
                  onClick={() => onNavigate('document-portal')}
                  className="bg-[#07244A] hover:bg-[#0B356D] text-white font-bold px-6 py-4 rounded-xl text-sm border border-[#15488A] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>Upload Documents to Portal</span>
                </button>
              </div>

              {/* Trust Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-[#E0E7FF] border-t border-[#0E3D7D] text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified GDS PNR Flights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>€30k Travel Insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Office in Gaga Downtown</span>
                </div>
              </div>
            </div>

            {/* Right Widget (5 Cols): Embedded Interactive Assessment */}
            <div className="lg:col-span-5">
              <QuickAssessmentWidget onOpenConsultation={onOpenConsultation} compact={true} />
            </div>
          </div>

          {/* 4 Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#0E3D7D]">
            {[
              { num: '90%', label: 'Visa Acceptance Rate', sub: 'Embassy-optimized files' },
              { num: '4,800+', label: 'Visas Approved', sub: 'Schengen, UK, USA, Canada' },
              { num: '5+ Years', label: 'Islamabad Heritage', sub: 'Office 78 Gaga Downtown' },
              { num: '350+', label: 'Global Universities', sub: 'Student admissions & CAS' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#07244A] p-4 rounded-xl border border-[#15488A] text-center space-y-0.5"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#C5A059] font-serif">
                  {stat.num}
                </div>
                <div className="text-xs font-bold text-white">{stat.label}</div>
                <div className="text-[11px] text-[#93C5FD]/80">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE PROPOSITION: THE VARTIMAX EMBASSY FILE ARCHITECTURE */}
      <section className="py-16 px-4 sm:px-8 bg-[#061F40] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>THE 90% VISA ACCEPTANCE FORMULA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why Embassies Approve VartiMax Visa Files
            </h2>
            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
              Visa rejections happen when files have contradictions between itineraries, bank statements, and tax declarations. We engineer every dossier to satisfy strict embassy guidelines in Islamabad:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Custom Embassy Cover Letter & Day-by-Day Itinerary',
                desc: 'Tailored legal narratives linking your professional roots in Pakistan, travel purpose, and exact hotel check-in/out schedules to eliminate return suspicion.'
              },
              {
                icon: Plane,
                title: 'Verifiable GDS Flight Reservations (Live PNR)',
                desc: 'Live airline ticket reservations booked through Amadeus/Sabre GDS with genuine PNR codes verified during embassy telephone audits.'
              },
              {
                icon: ShieldCheck,
                title: '€30,000 Schengen Travel Insurance & Hotel Bookings',
                desc: 'Embassy-compliant zero-deductible worldwide medical policies alongside verified free-cancellation hotel reservations.'
              },
              {
                icon: Building,
                title: 'Financial & FBR Tax Ledger Cross-Verification',
                desc: 'Deep audit of 6-month bank statement cashflows, account maintenance certificates, and NTN tax returns to prove genuine economic ties.'
              },
              {
                icon: GraduationCap,
                title: 'University Admission & Academic SOP Drafting',
                desc: 'Admissions in top-tier UK, German, Canadian, and Italian universities with comprehensive Statement of Purpose (SOP) formulation.'
              },
              {
                icon: Clock,
                title: 'Islamabad VFS / Gerry’s Appointment Support',
                desc: 'Fast-track appointment monitoring for Gerrys and VFS Islamabad biometric submissions with pre-interview coaching.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#07244A] hover:bg-[#0B356D] p-6 rounded-2xl border border-[#15488A] hover:border-[#C5A059]/50 transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#092E5E] text-[#C5A059] border border-[#1A4B8A] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 6 INTERACTIVE VISA SERVICES GRID WITH SEO OPTIMIZED IMAGERY */}
      <section className="py-16 px-4 sm:px-8 bg-[#092E5E] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40 mb-2">
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>GLOBAL VISA DESTINATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Our Specialized Visa Services
              </h2>
              <p className="text-xs sm:text-sm text-[#D1D5DB] mt-1">
                Select your destination to view embassy requirements, processing times, and acceptance rates.
              </p>
            </div>

            <button
              onClick={() => onNavigate('document-portal')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <span>View Full Document Requirements Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISA_SERVICES.map((svc) => (
              <div
                key={svc.slug}
                className="bg-[#07244A] rounded-2xl shadow-sm hover:shadow-2xl border border-[#15488A] hover:border-[#C5A059]/50 overflow-hidden flex flex-col justify-between transition-all group"
              >
                {/* SEO-Optimized Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-[#061F40]">
                  <img
                    src={svc.bannerImage}
                    alt={`${svc.title} - VartiMax Consultant Islamabad Embassy File Preparation`}
                    title={`${svc.title} in Islamabad`}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07244A] via-[#07244A]/30 to-transparent"></div>
                  
                  {/* Category & Acceptance Badges over Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#051C3A]/85 backdrop-blur-md text-[#E5E5E5] px-2.5 py-1 rounded-lg border border-white/10">
                      {svc.category.toUpperCase()} VISA
                    </span>
                    <span className="text-xs font-extrabold text-[#C5A059] bg-[#051C3A]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C5A059]/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      {svc.acceptanceRate}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-semibold text-[#C5A059] bg-[#051C3A]/85 backdrop-blur-md px-2 py-0.5 rounded border border-[#C5A059]/40">
                      {svc.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Service Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors leading-snug">
                      {svc.title}
                    </h3>

                    <p className="text-xs text-[#D1D5DB] line-clamp-2 leading-relaxed">
                      {svc.description}
                    </p>

                    {/* Highlights checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-[#123A6D]">
                      {(svc.highlights || svc.whyCrucial).slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#E0E7FF]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-5 mt-4 border-t border-[#123A6D] flex items-center justify-between">
                    <div className="text-[11px] text-[#93C5FD]/80 font-medium font-mono">
                      ⏱ {svc.processingTime}
                    </div>

                    <button
                      onClick={() => onSelectService(svc.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] group-hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                      <span>View Embassy Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISUAL EMBASSY DOSSIER & LOGISTICS FEATURE */}
      <section className="py-16 px-4 sm:px-8 bg-[#061F40] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#15488A] shadow-2xl group">
                <img
                  src={SEO_IMAGES.flightHotel.src}
                  alt={SEO_IMAGES.flightHotel.alt}
                  title={SEO_IMAGES.flightHotel.title}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061F40] via-[#061F40]/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-[#051C3A]/90 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C5A059] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      GDS Verified Live PNR Tickets & €30k Insurance
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      LIVE ON AMADEUS & SABRE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D1D5DB] mt-1">
                    Every ticket and hotel booking issued by VartiMax is live-queryable by embassy consular officers in Islamabad during routine telephone cross-checks.
                  </p>
                </div>
              </div>

              {/* 2 Sub Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#07244A] p-4 rounded-xl border border-[#15488A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Confirmed PNR</div>
                    <div className="text-[11px] text-[#93C5FD]/80">No dummy tickets used</div>
                  </div>
                </div>

                <div className="bg-[#07244A] p-4 rounded-xl border border-[#15488A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Zero Deductible</div>
                    <div className="text-[11px] text-[#93C5FD]/80">€30,000 Schengen valid</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>FORENSIC EMBASSY COMPLIANCE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-serif">
                We Build Legally Sound Dossiers That Withstand Consular Scrutiny
              </h2>

              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
                European, North American, and Australian embassies in Islamabad reject over 60% of standard applications due to unverified bookings, dummy flight tickets, or ambiguous economic roots in Pakistan.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Tailored Legal Cover Letters & Day-by-Day Route Plans',
                    sub: 'Specifying exact sightseeing objectives, domestic transit connections, and local accommodation check-ins.'
                  },
                  {
                    title: 'FBR Wealth Statements & Bank Velocity Alignment',
                    sub: 'Cross-auditing your 6-month bank statement with salary certificates or business receipts to verify legitimate source of funds.'
                  },
                  {
                    title: 'NADRA Kinship & Family Roots Legal Notarization',
                    sub: 'Validating FRC/MRC documents proving undeniable family and asset ties ensuring your guaranteed return to Pakistan.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#07244A] p-3.5 rounded-xl border border-[#15488A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-[#93C5FD]/80 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold px-6 py-3.5 rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4 text-[#061F40]" />
                  <span>Request File Audit for Your Destination</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-STEP STREAMLINED EMBASSY ROADMAP */}
      <section className="py-16 px-4 sm:px-8 bg-[#092E5E] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>TRANSPARENT 5-STEP JOURNEY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              How We Take You from Application to Visa Stamp
            </h2>
            <p className="text-xs sm:text-sm text-[#D1D5DB]">
              Clear, step-by-step guidance from our headquarters at Gaga Downtown Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Document Audit',
                desc: 'Initial screening of bank statements, employment proofs, and past travel records at our Islamabad desk.'
              },
              {
                step: '02',
                title: 'File Architecture',
                desc: 'Creation of embassy cover letter, verifiable GDS flight reservation, hotel vouchers, and €30k insurance.'
              },
              {
                step: '03',
                title: 'Form Submission',
                desc: 'Accurate online embassy portal filing (Schengen, DS-160, GCKey, EVisa) with zero errors.'
              },
              {
                step: '04',
                title: 'Biometric Appointment',
                desc: 'Appointment scheduling at VFS / Gerry’s Islamabad with full pre-submission file physical check.'
              },
              {
                step: '05',
                title: 'Visa Stamping',
                desc: 'Passport collection, visa sticker verification, and comprehensive pre-departure briefing.'
              }
            ].map((st, i) => (
              <div
                key={i}
                className="bg-[#07244A] p-5 rounded-2xl border border-[#15488A] relative space-y-2 hover:border-[#C5A059] transition-colors"
              >
                <div className="text-2xl font-black text-[#C5A059] font-mono">
                  {st.step}
                </div>
                <h3 className="text-sm font-bold text-white">{st.title}</h3>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & REVIEWS SECTION */}
      <section className="py-16 px-4 sm:px-8 bg-[#061F40] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40 mb-2">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                <span>4.9 / 5.0 GOOGLE REVIEWS RATING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                What Our Successful Clients Say
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#93C5FD]/80 font-medium">Over 4,800+ Visas Approved in Pakistan</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#C5A059]" />
                    ))}
                  </div>

                  <p className="text-xs text-[#D1D5DB] italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#123A6D]">
                  <div className="text-xs font-bold text-white">{t.clientName}</div>
                  <div className="text-[11px] text-[#C5A059] font-medium">{t.visaType}</div>
                  <div className="text-[10px] text-[#93C5FD]/70">{t.city} • {t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ISLAMABAD HEADQUARTERS MAP & CONSULTATION BANNER WITH LOCAL SEO PHOTOGRAPH */}
      <section className="py-16 px-4 sm:px-8 bg-[#092E5E] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full border border-[#C5A059]/40">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ISLAMABAD CONSULTANCY DESK</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Visit VartiMax at Gaga Downtown Islamabad
            </h2>

            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
              Prefer an in-person meeting? Our senior case officers are available Monday through Saturday at Office 78, Basement, Gaga Downtown, Islamabad. Bring your original passport and 6-month bank statement for on-spot eligibility scoring.
            </p>

            <div className="space-y-2 text-xs text-[#D1D5DB]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span className="font-bold text-white">+92 340 1207525</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#C5A059]" />
                <span>Office 78, Basement, Gaga Downtown, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>Mon – Sat: 10:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenConsultation}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
              >
                Book Office Appointment
              </button>
              <a
                href="https://wa.me/923401207525?text=Hello%20VartiMax%20Consultant,%20I%20want%20to%20visit%20your%20Islamabad%20office."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {/* SEO Building Photo + Google Map Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border border-[#15488A] relative group">
                <img
                  src={SEO_IMAGES.islamabadHq.src}
                  alt={SEO_IMAGES.islamabadHq.alt}
                  title={SEO_IMAGES.islamabadHq.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061F40]/90 via-[#061F40]/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-xs">
                  <span className="text-[10px] font-bold text-[#C5A059] block uppercase">Headquarters Landmark</span>
                  <span className="font-bold text-white text-xs">Gaga Downtown, Islamabad</span>
                </div>
              </div>

              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border border-[#15488A] relative">
                <iframe
                  title="VartiMax Islamabad Office Map"
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
        </div>
      </section>
    </div>
  );
};

