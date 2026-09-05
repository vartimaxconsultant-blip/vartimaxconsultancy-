import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  UserCheck,
  Phone,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Plane,
  Briefcase,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ClientApplication, VisaApplicationStatus, StageStepInfo } from '../types';
import { findClientApplicationLocally, saveClientApplicationLocally } from '../data/mockSubmissions';

interface VisaProgressTrackerProps {
  initialReferenceId?: string;
  onOpenConsultation?: () => void;
  onSwitchToSubmit?: () => void;
}

export const VisaProgressTracker: React.FC<VisaProgressTrackerProps> = ({
  initialReferenceId = 'VMX-ISB-61044',
  onOpenConsultation,
  onSwitchToSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState(initialReferenceId);
  const [application, setApplication] = useState<ClientApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Quick preset sample dockets for clients or evaluators
  const samplePresets = [
    {
      ref: 'VMX-ISB-61044',
      name: 'Hamza Tariq',
      country: 'USA (B1/B2)',
      stage: 'Interview Prep',
      badgeColor: 'bg-purple-950/60 text-purple-300 border-purple-500/40'
    },
    {
      ref: 'VMX-ISB-78219',
      name: 'Ali Raza Qureshi',
      country: 'Italy (Schengen)',
      stage: 'Embassy Submission',
      badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-500/40'
    },
    {
      ref: 'VMX-ISB-99342',
      name: 'Sana Mehmood',
      country: 'UK (Study Permit)',
      stage: 'Document Review',
      badgeColor: 'bg-blue-950/60 text-blue-300 border-blue-500/40'
    },
    {
      ref: 'VMX-ISB-82410',
      name: 'Dr. Zainab Farooq',
      country: 'Canada (Visitor)',
      stage: 'Visa Approved',
      badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
    }
  ];

  const fetchApplication = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);

    // 1. Immediately look up locally (benchmarks or user's local submissions)
    const localMatch = findClientApplicationLocally(trimmed);
    if (localMatch) {
      setApplication(localMatch);
      setError(null);
    }

    try {
      const res = await fetch(`/api/submissions/lookup?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.application) {
            setApplication(data.application);
            saveClientApplicationLocally(data.application);
            setError(null);
            return;
          }
        }
      }

      // If response was not 200 or not json:
      if (localMatch) {
        setApplication(localMatch);
        setError(null);
      } else {
        setError(`No active application found matching "${trimmed}". Please verify your reference ID or select one of the verified sample dockets below.`);
        setApplication(null);
      }
    } catch (err) {
      console.warn('Network lookup unavailable, resolving via local benchmark repository:', err);
      if (localMatch) {
        setApplication(localMatch);
        setError(null);
      } else {
        // Fallback check in case query was phone number
        const fallback = findClientApplicationLocally(trimmed);
        if (fallback) {
          setApplication(fallback);
          setError(null);
        } else {
          setError(`No active application found matching "${trimmed}". You can test the live tracker using any of the verified sample dockets below (e.g. VMX-ISB-61044).`);
          setApplication(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialReferenceId) {
      fetchApplication(initialReferenceId);
    }
  }, [initialReferenceId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplication(searchQuery);
  };

  const handleSelectPreset = (ref: string) => {
    setSearchQuery(ref);
    fetchApplication(ref);
  };

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Determine stage progression steps based on status
  const getStageSteps = (status: VisaApplicationStatus): StageStepInfo[] => {
    // Stage order:
    // 1: document_review (or pending_review / documents_received)
    // 2: file_creation
    // 3: embassy_submission (or ready_for_embassy)
    // 4: interview_prep
    // 5: visa_decision (visa_approved)

    const stageRank: Record<string, number> = {
      pending_review: 1,
      documents_received: 1,
      document_review: 1,
      file_in_creation: 2,
      ready_for_embassy: 3,
      embassy_submission: 3,
      interview_prep: 4,
      visa_approved: 5
    };

    const currentRank = stageRank[status] || 1;

    const getStatusForStep = (stepNumber: number): 'completed' | 'current' | 'upcoming' => {
      if (currentRank > stepNumber) return 'completed';
      if (currentRank === stepNumber) return 'current';
      return 'upcoming';
    };

    return [
      {
        stepKey: 'document_review',
        title: 'Document Review',
        shortDesc: '6-Month Bank Statement, FBR Tax Returns & Ties Audit',
        status: getStatusForStep(1),
        actionRequired: currentRank === 1 ? 'Case Officer reviewing financial sustainability and authentic bank stamps.' : undefined
      },
      {
        stepKey: 'file_creation',
        title: 'File Preparation',
        shortDesc: 'Embassy Cover Letter, SOP, Travel Itinerary & €30k Insurance',
        status: getStatusForStep(2),
        actionRequired: currentRank === 2 ? 'Legal drafting team tailoring your statement of ties and travel reservations.' : undefined
      },
      {
        stepKey: 'embassy_submission',
        title: 'Embassy Submission',
        shortDesc: "VFS / Gerry's Biometric Appointment & Dossier Lodgment",
        status: getStatusForStep(3),
        actionRequired: currentRank === 3 ? 'Biometric appointment booked. Attend center with original passport.' : undefined
      },
      {
        stepKey: 'interview_prep',
        title: 'Interview Prep',
        shortDesc: 'Embassy Consular Q&A Drill & Officer Vetting',
        status: getStatusForStep(4),
        actionRequired: currentRank === 4 ? '1-on-1 mock interview with Senior Consultant to master consular questions.' : undefined
      },
      {
        stepKey: 'visa_decision',
        title: 'Visa Decision',
        shortDesc: 'Passport Stamping & Final Collection',
        status: getStatusForStep(5),
        actionRequired: currentRank === 5 ? 'Visa approved! Collect stamped passport at VartiMax Islamabad office.' : undefined
      }
    ];
  };

  const getStatusBadge = (status: VisaApplicationStatus) => {
    switch (status) {
      case 'visa_approved':
        return {
          label: 'Visa Approved & Stamped',
          badgeClass: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/50 shadow-emerald-900/30'
        };
      case 'interview_prep':
        return {
          label: 'Interview Prep in Progress',
          badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-500/50 shadow-purple-900/30'
        };
      case 'embassy_submission':
      case 'ready_for_embassy':
        return {
          label: 'Embassy Submission & Biometrics',
          badgeClass: 'bg-amber-950/70 text-[#C5A059] border-[#C5A059]/50 shadow-amber-900/30'
        };
      case 'file_in_creation':
        return {
          label: 'Embassy File in Creation',
          badgeClass: 'bg-blue-950/70 text-blue-300 border-blue-500/50 shadow-blue-900/30'
        };
      case 'document_review':
      case 'documents_received':
      case 'pending_review':
      default:
        return {
          label: 'Document Review & Intake Audit',
          badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-500/50 shadow-sky-900/30'
        };
    }
  };

  return (
    <div id="visa-progress-tracker" className="w-full space-y-8">
      {/* Search Header Banner */}
      <div className="bg-[#07244A] border border-[#15488A] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 text-[#C5A059] text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-[#C5A059]/30">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>CLIENT SELF-SERVICE UTILITY</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Visa Progress Tracker
          </h2>

          <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-xl mx-auto leading-relaxed">
            Track the exact embassy-grade milestones of your file from initial document review to embassy appointment and consular interview prep.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#93C5FD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Ref ID (e.g. VMX-ISB-61044) or WhatsApp"
                className="w-full pl-10 pr-4 py-3 bg-[#061F40] border border-[#15488A] rounded-xl text-white placeholder-[#94A3B8] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Quick Chips */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-[#93C5FD] block uppercase tracking-wider">
              Quick Client Demos (Click to inspect live progression stages):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.ref}
                  onClick={() => handleSelectPreset(preset.ref)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    application?.referenceId === preset.ref
                      ? 'bg-[#C5A059] text-[#042354] border-[#C5A059] font-bold shadow'
                      : `${preset.badgeColor} hover:brightness-125`
                  }`}
                >
                  <span className="font-mono font-bold">{preset.ref}</span>
                  <span className="opacity-80">({preset.country} • {preset.stage})</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/60 text-rose-200 rounded-xl text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Application Dashboard View */}
      {application && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Main Dossier Summary Card */}
          <div className="bg-[#07244A] border border-[#15488A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Top row: Client metadata & Status badge */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#15488A] pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-[#93C5FD] uppercase tracking-wider">
                    Official Embassy Docket
                  </span>
                  <span className="text-slate-400">•</span>
                  <button
                    onClick={() => copyRef(application.referenceId)}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#C5A059] bg-[#061F40] px-2.5 py-0.5 rounded border border-[#15488A] hover:border-[#C5A059] transition-colors cursor-pointer"
                    title="Click to copy Reference ID"
                  >
                    <span>{application.referenceId}</span>
                    {copiedRef ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </button>
                  {copiedRef && (
                    <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  {application.fullName}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#D1D5DB]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-semibold text-white">{application.targetCountry}</span>
                  </span>
                  <span>•</span>
                  <span>Category: <strong className="text-white capitalize">{application.category} Visa</strong></span>
                  {application.passportNumber && (
                    <>
                      <span>•</span>
                      <span>Passport: <strong className="text-white font-mono">{application.passportNumber}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge & Intake */}
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border shadow-sm ${getStatusBadge(application.status).badgeClass}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {getStatusBadge(application.status).label}
                </span>

                <span className="text-[11px] text-[#94A3B8]">
                  Intake: <strong className="text-white">{application.intakeDate || 'Regular 2026'}</strong> • Last Updated: <strong className="text-white">{new Date(application.updatedAt).toLocaleDateString('en-GB')}</strong>
                </span>
              </div>
            </div>

            {/* Visual 5-Stage Stepper Progression */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#93C5FD]">
                  Embassy Lifecycle Progression:
                </span>
                <span className="text-[11px] text-slate-300">
                  {application.status === 'visa_approved'
                    ? '100% Completed'
                    : application.status === 'interview_prep'
                    ? 'Stage 4 of 5 (80% Completed)'
                    : application.status === 'embassy_submission' || application.status === 'ready_for_embassy'
                    ? 'Stage 3 of 5 (60% Completed)'
                    : application.status === 'file_in_creation'
                    ? 'Stage 2 of 5 (40% Completed)'
                    : 'Stage 1 of 5 (20% Completed)'}
                </span>
              </div>

              {/* Responsive Progress Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {getStageSteps(application.status).map((step, idx) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div
                      key={step.stepKey}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        isCompleted
                          ? 'bg-[#082D20] border-emerald-600/50 text-emerald-200'
                          : isCurrent
                          ? 'bg-[#061F40] border-[#C5A059] ring-1 ring-[#C5A059]/60 shadow-lg text-white'
                          : 'bg-[#061F40]/50 border-[#15488A]/40 text-slate-400 opacity-60'
                      }`}
                    >
                      {/* Step Number & Status Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-900/80 text-emerald-300'
                            : isCurrent
                            ? 'bg-[#C5A059] text-[#042354]'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          STAGE 0{idx + 1}
                        </span>

                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A059]" />
                          </span>
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>

                      {/* Step Title */}
                      <div className="text-xs font-bold leading-tight mb-1">
                        {step.title}
                      </div>

                      {/* Short Description */}
                      <div className="text-[11px] opacity-80 line-clamp-2 leading-snug">
                        {step.shortDesc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Spotlight Box: Critical Details & Direct Guidance */}
            <div className="bg-[#061F40] border border-[#15488A] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-wider">Current Phase Directives & Action Items</span>
              </div>

              {/* Specific details based on status */}
              {application.status === 'interview_prep' && (
                <div className="space-y-3">
                  <div className="bg-purple-950/40 border border-purple-800/40 p-4 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-purple-200 font-bold text-sm">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>Consular Interview Scheduled: {application.interviewDate || 'June 24, 2026 at 08:00 AM'}</span>
                    </div>
                    <div className="text-slate-300">
                      <strong>Location:</strong> {application.embassyCenter || 'U.S. Embassy Islamabad, Diplomatic Enclave, Ramna 5'}
                    </div>
                    <p className="text-[#D1D5DB] leading-relaxed">
                      Your DS-160 and fee challan are locked. You are scheduled for mock interview drills focusing on ties to Pakistan, funding source explanations, and intent to return.
                    </p>
                  </div>

                  {/* Interview Preparation Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#07244A] rounded-lg border border-[#15488A] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>DS-160 Confirmation Barcode Printed</span>
                    </div>
                    <div className="p-3 bg-[#07244A] rounded-lg border border-[#15488A] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Interview Appointment Letter Printed</span>
                    </div>
                    <div className="p-3 bg-[#07244A] rounded-lg border border-[#15488A] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Original HBL/FBR Tax Return File Set</span>
                    </div>
                    <div className="p-3 bg-[#07244A] rounded-lg border border-[#15488A] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Mock Consular Session #2 (June 22)</span>
                    </div>
                  </div>
                </div>
              )}

              {application.status === 'embassy_submission' && (
                <div className="space-y-3">
                  <div className="bg-amber-950/40 border border-[#C5A059]/40 p-4 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#F5CE6D] font-bold text-sm">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>Biometric Appointment: {application.appointmentDate || 'June 12, 2026 at 09:30 AM'}</span>
                    </div>
                    <div className="text-slate-300">
                      <strong>Submission Center:</strong> {application.embassyCenter || "Gerry's Visa Drop-Off Centre, Islamabad"}
                    </div>
                    <p className="text-[#D1D5DB] leading-relaxed">
                      Your complete embassy dossier is sealed with travel insurance and flight/hotel reservations. Please carry the original attested documents and fee slip provided by VartiMax.
                    </p>
                  </div>
                </div>
              )}

              {application.status === 'document_review' && (
                <div className="bg-blue-950/40 border border-blue-800/40 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-200 font-bold text-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Active Financial & Ties Verification</span>
                  </div>
                  <p className="text-[#D1D5DB] leading-relaxed">
                    Senior case officers in Islamabad are auditing your 6-month bank statements, verifying maintenance certificate wording, and ensuring home-country tie documentation meets stringent embassy standards.
                  </p>
                </div>
              )}

              {application.status === 'visa_approved' && (
                <div className="bg-emerald-950/50 border border-emerald-600/50 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Official Approval Notice: Passport Stamped!</span>
                  </div>
                  <p className="text-emerald-100 leading-relaxed">
                    Congratulations! The embassy has granted your visa. Your stamped passport is ready for secure collection at VartiMax Office 78 Gaga Downtown Islamabad.
                  </p>
                </div>
              )}

              {/* Case Officer Remarks */}
              {application.notes && (
                <div className="p-3.5 rounded-lg bg-[#07244A] border border-[#15488A] text-xs">
                  <span className="font-bold text-[#C5A059] block mb-1">
                    Islamabad Headquarters Case Officer Notes:
                  </span>
                  <p className="italic text-[#E0E7FF]">{application.notes}</p>
                </div>
              )}
            </div>

            {/* Bottom Grid: Assigned Consultant & Document Docket */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              {/* Col 1: Assigned Case Consultant */}
              <div className="bg-[#061F40] p-5 rounded-xl border border-[#15488A] space-y-4">
                <span className="text-[11px] font-bold text-[#93C5FD] block uppercase tracking-wider">
                  Assigned Case Officer
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center font-bold text-base">
                    <UserCheck className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {application.assignedConsultant?.name || 'Bilal Khan'}
                    </h4>
                    <p className="text-[11px] text-[#D1D5DB]">
                      {application.assignedConsultant?.designation || 'Senior Embassy File Strategist'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <a
                    href={`https://wa.me/923401207525?text=${encodeURIComponent(
                      `Hello ${application.assignedConsultant?.name || 'VartiMax Consultant'}, I am checking on my application docket ${application.referenceId} for ${application.fullName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Case Officer</span>
                  </a>

                  <a
                    href="tel:+923401207525"
                    className="w-full bg-[#07244A] hover:bg-[#0c3261] text-white border border-[#15488A] font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Call Helpline: +92 340 1207525</span>
                  </a>
                </div>
              </div>

              {/* Col 2 & 3: Uploaded Documents Verification Status */}
              <div className="lg:col-span-2 bg-[#061F40] p-5 rounded-xl border border-[#15488A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#93C5FD] block uppercase tracking-wider">
                    Submitted Files Audit Checklist ({application.documents.length} Documents)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Embassy Certified</span>
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {application.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#07244A] border border-[#15488A] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {doc.status === 'verified' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="font-semibold text-white block truncate">
                            {doc.requirementTitle}
                          </span>
                          <span className="font-mono text-[11px] text-[#93C5FD] block truncate">
                            {doc.fileName}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${
                        doc.status === 'verified'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                          : 'bg-amber-950/60 text-[#C5A059] border-[#C5A059]/40'
                      }`}>
                        {doc.status === 'verified' ? 'Verified' : 'Reviewing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Support Footer */}
      <div className="bg-[#07244A]/80 border border-[#15488A] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <HelpCircle className="w-5 h-5 text-[#C5A059] shrink-0 hidden sm:block" />
          <div>
            <span className="font-bold text-white block">Need to update your documents or submit another visa file?</span>
            <span className="text-[#D1D5DB]">
              Visit our Islamabad office at Gaga Downtown or submit fresh papers via our intake portal.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToSubmit && (
            <button
              onClick={onSwitchToSubmit}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Submit New Documents
            </button>
          )}
          <a
            href="https://wa.me/923401207525"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/40 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors"
          >
            WhatsApp Helpline
          </a>
        </div>
      </div>
    </div>
  );
};
