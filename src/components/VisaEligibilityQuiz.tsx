import React, { useState } from 'react';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Plane,
  Heart,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MessageCircle,
  FileCheck2,
  Check,
  BadgePercent,
  Clock,
  Wallet,
  Users
} from 'lucide-react';
import { VisaCategory } from '../types';

export interface VisaEligibilityQuizProps {
  onOpenConsultation?: (country?: string, category?: VisaCategory) => void;
  onNavigateToServices?: (slug: string) => void;
  compact?: boolean;
}

interface QuizAnswers {
  purpose: string;
  duration: string;
  occupation: string;
  finance: string;
}

interface VisaSuggestion {
  categoryTitle: string;
  visaSubcategory: string;
  visaCategory: VisaCategory;
  destinationRegion: string;
  countryRecommendation: string;
  matchScore: number;
  badge: string;
  serviceSlug?: string;
  summary: string;
  whySuitable: string[];
  keyDocuments: string[];
  refusalDefenseTip: string;
  alternativeRoute?: {
    title: string;
    description: string;
  };
}

export const VisaEligibilityQuiz: React.FC<VisaEligibilityQuizProps> = ({
  onOpenConsultation,
  onNavigateToServices,
  compact = false
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    purpose: '',
    duration: '',
    occupation: '',
    finance: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<VisaSuggestion | null>(null);

  const totalSteps = 4;

  const questions = [
    {
      step: 1,
      id: 'purpose',
      title: 'What is your primary travel objective?',
      subtitle: 'Select the main reason for your upcoming journey abroad.',
      options: [
        {
          id: 'tourism',
          icon: Plane,
          title: 'Tourism, Vacation & Sightseeing',
          desc: 'Exploring landmarks, holidays, or visiting friends and relatives overseas.'
        },
        {
          id: 'study',
          icon: GraduationCap,
          title: 'Higher Studies & University Admission',
          desc: 'Enrolling in a Bachelor’s, Master’s, PhD, or professional diploma course.'
        },
        {
          id: 'business',
          icon: Briefcase,
          title: 'Business Meetings & Commercial Deals',
          desc: 'Attending trade expos, corporate client conferences, or negotiating contracts.'
        },
        {
          id: 'skilled_work',
          icon: Compass,
          title: 'Career Relocation & Skilled Work',
          desc: 'Seeking overseas employment, job search opportunities, or skilled migration.'
        },
        {
          id: 'family',
          icon: Heart,
          title: 'Spousal Reunion & Family Settlement',
          desc: 'Joining an overseas spouse, parents, or immediate blood relatives permanently.'
        }
      ]
    },
    {
      step: 2,
      id: 'duration',
      title: 'How long do you plan to stay abroad?',
      subtitle: 'Embassy visas differ significantly based on short-stay vs. residency duration.',
      options: [
        {
          id: 'short_stay',
          icon: Calendar,
          title: 'Short Stay (under 30 to 90 Days)',
          desc: 'Return to Pakistan promptly after brief holiday, conference, or family visit.'
        },
        {
          id: 'medium_stay',
          icon: Clock,
          title: 'Medium Duration (3 to 6 Months)',
          desc: 'Extended family stay, seasonal internship, or multi-city European trip.'
        },
        {
          id: 'multi_year',
          icon: GraduationCap,
          title: 'Academic Term (1 to 4 Years)',
          desc: 'Full-time study course with post-study graduate work visa potential.'
        },
        {
          id: 'long_term',
          icon: Building,
          title: 'Long-Term Relocation / Indefinite',
          desc: 'Permanent residency, employment sponsorship, or settlement with family.'
        }
      ]
    },
    {
      step: 3,
      id: 'occupation',
      title: 'What is your current occupational profile in Pakistan?',
      subtitle: 'Embassies scrutinize domestic economic ties to verify strong intent to return.',
      options: [
        {
          id: 'salaried',
          icon: Briefcase,
          title: 'Corporate / Salaried Employee',
          desc: 'Receiving monthly bank payroll with employment letter, salary slips & leave NOC.'
        },
        {
          id: 'business_owner',
          icon: Building,
          title: 'Registered Business Owner / FBR Filer',
          desc: 'Operating a proprietary firm or partnership with active NTN and company bank account.'
        },
        {
          id: 'student_grad',
          icon: GraduationCap,
          title: 'Current Student or Recent Graduate',
          desc: 'Completed FA/FSc, Bachelor’s, or Master’s seeking foreign academic progression.'
        },
        {
          id: 'freelancer_tech',
          icon: Compass,
          title: 'Tech Specialist, Remote Pro or Healthcare',
          desc: 'Software engineer, doctor, nurse, or professional with verifiable credentials.'
        }
      ]
    },
    {
      step: 4,
      id: 'finance',
      title: 'How will your trip and living expenses be funded?',
      subtitle: 'Financial stability is the #1 deciding factor in visa adjudication.',
      options: [
        {
          id: 'strong_self',
          icon: Wallet,
          title: 'Strong Self-Funded Bank Statement',
          desc: 'PKR 2.5M - 5M+ maintained legitimately for 6+ months with consistent source of funds.'
        },
        {
          id: 'sponsor_family',
          icon: Users,
          title: 'Parents, Overseas Family or Spouse Sponsor',
          desc: 'First-degree blood relative covering tuition/travel with legal affidavit of support.'
        },
        {
          id: 'corporate_sponsor',
          icon: Building,
          title: 'Corporate / Employer Sponsored Trip',
          desc: 'Company or organizing committee paying all flight, hotel, and daily allowances.'
        },
        {
          id: 'moderate_savings',
          icon: Wallet,
          title: 'Moderate Budget (PKR 1.2M - 2.5M)',
          desc: 'Adequate for focused short-duration tourism with budget-friendly hotel vouchers.'
        }
      ]
    }
  ];

  const currentQ = questions[currentStep - 1];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      evaluateRecommendation();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({
      purpose: '',
      duration: '',
      occupation: '',
      finance: ''
    });
    setCurrentStep(1);
    setSuggestion(null);
  };

  const evaluateRecommendation = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const { purpose, duration, occupation, finance } = answers;

      let result: VisaSuggestion;

      // Logic Branch 1: Student / Education
      if (purpose === 'study' || duration === 'multi_year') {
        if (finance === 'sponsor_family' || finance === 'strong_self') {
          result = {
            categoryTitle: 'International Student Route (Study Permit)',
            visaSubcategory: 'UK Student Visa (Tier 4) / Canada Study Permit / Germany National Student Visa',
            visaCategory: 'study',
            destinationRegion: 'United Kingdom, Canada & Germany',
            countryRecommendation: 'UK & Germany (High Visa Acceptance for Pakistani Graduates)',
            matchScore: 95,
            badge: 'HIGHEST SUCCESS PATHWAY',
            serviceSlug: 'schengen-file-preparation',
            summary:
              'Your profile is an exceptional candidate for a direct academic visa. With dedicated university admission, verified tuition financial proof, and a credible Statement of Purpose (SOP), student routes carry above 90% approval rates at the Islamabad High Commissions.',
            whySuitable: [
              'Academic progression aligns cleanly with your current credentials without unexplained gap years.',
              'Financial structure supports international tuition and living maintenance via verified family or personal statements.',
              'Clear post-study career trajectory demonstrates purposeful academic intent.'
            ],
            keyDocuments: [
              'University Confirmation of Acceptance for Studies (CAS / LOA)',
              'Statement of Purpose (SOP) tailored to embassy visa guidelines',
              '28-day matured bank statement or German Blocked Account (Sperrkonto)',
              'IELTS / PTE Academic or English Medium Instruction certificate'
            ],
            refusalDefenseTip:
              'Embassies reject student applications if the SOP reads like generic AI text. VartiMax drafts university-specific legal SOPs that link your foreign degree to direct career opportunities in Pakistan.',
            alternativeRoute: {
              title: 'Alternative: Germany Chancenkarte (Opportunity Card)',
              description: 'If you already hold a recognized degree, you may qualify for Germany’s new points-based job seeker route without tuition fees.'
            }
          };
        } else {
          result = {
            categoryTitle: 'European Public University Pathway (Low Tuition)',
            visaSubcategory: 'Germany / Italy National Student Visa with Regional Scholarship',
            visaCategory: 'study',
            destinationRegion: 'Germany & Italy (Schengen Area)',
            countryRecommendation: 'Germany & Italy (Zero Tuition + DSU Regional Scholarships)',
            matchScore: 91,
            badge: 'BUDGET-FRIENDLY SCHOLARSHIP ROUTE',
            serviceSlug: 'schengen-file-preparation',
            summary:
              'To optimize budget efficiency, Germany and Italy offer tuition-free public universities and government grants (such as DSU). VartiMax assists in secure admission, legalized documents, and blocked account setup.',
            whySuitable: [
              'Zero or nominal university tuition fees drastically reduce foreign exchange burden.',
              'Eligibility for Schengen D-Type long-stay visa with full European travel freedom.'
            ],
            keyDocuments: [
              'HEC & MOFA attested academic transcripts and degrees',
              'University pre-enrollment summary (Universitaly or Uni-Assist)',
              'Blocked account (approx €11,904) or Family Financial Affidavit'
            ],
            refusalDefenseTip:
              'Appointments for Italy and Germany fill fast in Islamabad. VartiMax provides early intake tracking so you don’t miss university semester deadlines.'
          };
        }
      }
      // Logic Branch 2: Skilled Work & Migration
      else if (purpose === 'skilled_work' || duration === 'long_term') {
        if (occupation === 'freelancer_tech' || occupation === 'salaried') {
          result = {
            categoryTitle: 'Germany Opportunity Card (Chancenkarte) & Skilled Migration',
            visaSubcategory: 'Chancenkarte (Section 20a AufenthG) / Canada Express Entry',
            visaCategory: 'employment',
            destinationRegion: 'Germany (EU) & Canada',
            countryRecommendation: 'Germany Opportunity Card (Points-Based System)',
            matchScore: 93,
            badge: 'HOTTEST 2026 WORK PATHWAY',
            serviceSlug: 'schengen-file-preparation',
            summary:
              'Under Germany’s new immigration law, qualified Pakistani professionals can relocate for up to 1 year on the Opportunity Card without a prior job offer, provided they meet points for education, language, and work history.',
            whySuitable: [
              'Professional tech, healthcare, or corporate background scores strong qualification points.',
              'No prior German employer job offer required before departure.',
              'Permits 20 hours/week part-time work while securing a permanent contract.'
            ],
            keyDocuments: [
              'ZAB / Anabin foreign degree equivalence recognition certificate',
              'Proof of professional experience and English/German language test',
              'Blocked account living maintenance proof (€1,027/month)'
            ],
            refusalDefenseTip:
              'Points calculation must be 100% verified prior to Embassy Islamabad appointment. VartiMax handles your Anabin degree equivalence audit and file structuring.'
          };
        } else {
          result = {
            categoryTitle: 'Business Investor or Skilled Independent Route',
            visaSubcategory: 'Subclass 189/190 Australia or Canada Provincial Nominee (PNP)',
            visaCategory: 'employment',
            destinationRegion: 'Australia & Canada',
            countryRecommendation: 'Canada PNP & Australia Subclass 491/190',
            matchScore: 89,
            badge: 'PERMANENT SETTLEMENT ROUTE',
            summary:
              'For established business owners or senior managers, provincial nomination and state-sponsored skilled migration offer reliable pathways to permanent residence with dependent family inclusion.',
            whySuitable: [
              'Substantial commercial management experience and active business assets.',
              'High points for age, management seniority, and investment capability.'
            ],
            keyDocuments: [
              'Company registration documents (SECP / Chamber of Commerce)',
              '3 Years FBR Tax Returns & Audited Business Financial Statements',
              'WES / VETASSESS formal skills assessment'
            ],
            refusalDefenseTip:
              'Discrepancies between business tax returns and personal bank accounts cause scrutiny. VartiMax ensures complete financial reconciliation before submission.'
          };
        }
      }
      // Logic Branch 3: Business Meetings & Corporate Delegations
      else if (purpose === 'business' || finance === 'corporate_sponsor') {
        result = {
          categoryTitle: 'Short-Stay Business & Commercial Delegation Visa',
          visaSubcategory: 'Schengen Business Visa (Type C) / US B1 / UK Business Visitor',
          visaCategory: 'visit',
          destinationRegion: 'Schengen Area (Germany/France), UK or USA',
          countryRecommendation: 'Germany or France (Schengen Business Hub)',
          matchScore: 96,
          badge: 'FAST-TRACK HIGH APPROVAL',
          serviceSlug: 'dummy-flight-hotel-booking',
          summary:
            'Commercial and business visitor visas have among the highest approval rates when supported by an authentic overseas host invitation, Chamber of Commerce recommendation, and company sponsorship letter.',
          whySuitable: [
            'Corporate backing eliminates personal financial suspicion for the embassy.',
            'Short defined trip duration guarantees strong return ties to ongoing business operations in Pakistan.'
          ],
          keyDocuments: [
            'Official Signed Invitation Letter from overseas host company or trade expo',
            'Employer deputation letter covering all trip expenses + Leave Approval',
            'Chamber of Commerce Membership & FBR Active Taxpayer list proof',
            'Verifiable GDS roundtrip flight reservations with live PNR'
          ],
          refusalDefenseTip:
            'Embassies often telephone both the Pakistani company and the European host to cross-verify the meeting agenda. VartiMax coaches you on telephone audit protocols.'
        };
      }
      // Logic Branch 4: Family Settlement / Spouse
      else if (purpose === 'family') {
        result = {
          categoryTitle: 'Family Reunion & Spousal Settlement Route',
          visaSubcategory: 'UK Spouse / Dependent Settlement Visa / Schengen Family Reunion',
          visaCategory: 'visit',
          destinationRegion: 'United Kingdom, Europe & Canada',
          countryRecommendation: 'UK Family Route / Canada Spousal Sponsorship',
          matchScore: 92,
          badge: 'SETTLEMENT CATEGORY',
          summary:
            'Settlement routes allow Pakistani spouses and children to join sponsors overseas permanently, with clear legal provisions upon satisfying financial and accommodation thresholds.',
          whySuitable: [
            'Legitimate marital or parental relationship established via NADRA biometric records.',
            'Overseas sponsor meets required annual income threshold (e.g. UK Appendix FM).'
          ],
          keyDocuments: [
            'NADRA Computerized Marriage Registration Certificate (MRC) + FRC',
            'Overseas sponsor payslips, P60, and employment letter',
            'Sponsor accommodation inspection report and tenancy deed'
          ],
          refusalDefenseTip:
            'Genuine relationship proof (chat history, joint travel, wedding photos) must be curated chronologically to avoid sham marriage doubts.'
        };
      }
      // Logic Branch 5: Tourism & Holiday (Standard)
      else {
        if (finance === 'strong_self' && occupation === 'business_owner') {
          result = {
            categoryTitle: 'Schengen Multiple-Entry Tourist Visa (Type C)',
            visaSubcategory: 'Schengen Tourist Visa (France / Italy / Spain / Germany)',
            visaCategory: 'visit',
            destinationRegion: 'Schengen 29-Country European Zone',
            countryRecommendation: 'France or Italy (Highest Approval for Pakistani Business Filers)',
            matchScore: 94,
            badge: 'TOP TOURIST RECOMMENDATION',
            serviceSlug: 'schengen-file-preparation',
            summary:
              'With a healthy closing bank balance and active FBR business tax filings, your profile is primed for a European Schengen tourist visa. France and Italy offer generous visa issuance for Pakistani business travelers.',
            whySuitable: [
              'Business ownership and active FBR NTN establish airtight economic ties to Pakistan.',
              'Healthy 6-month bank balance comfortably fulfills embassy daily expense benchmarks (€70-€100/day).'
            ],
            keyDocuments: [
              'Embassy Cover Letter with day-by-day sightseeing itinerary',
              'Verifiable GDS round-trip flight reservation (Amadeus/Sabre live PNR)',
              'Confirmed hotel booking vouchers with zero-cancellation fees',
              '€30,000 Schengen Travel Medical Insurance policy'
            ],
            refusalDefenseTip:
              'Never submit fake flight tickets or photoshopped hotel vouchers. Embassies in Islamabad perform live PNR checks. VartiMax issues 100% genuine GDS reservations that stay active throughout processing.',
            alternativeRoute: {
              title: 'Alternative: UK Standard Visitor (6 Months)',
              description: 'If you prefer an English-speaking destination, the UK offers a streamlined 6-month visitor visa with rapid decision times.'
            }
          };
        } else if (finance === 'strong_self' && occupation === 'salaried') {
          result = {
            categoryTitle: 'UK Standard Visitor Visa (6 Months)',
            visaSubcategory: 'UK Visitor Visa / Schengen Tourist Visa',
            visaCategory: 'visit',
            destinationRegion: 'United Kingdom (London, Manchester, Scotland)',
            countryRecommendation: 'United Kingdom (Direct VFS Gerry’s Islamabad Processing)',
            matchScore: 92,
            badge: 'STREAMLINED EMPLOYEE PATHWAY',
            serviceSlug: 'schengen-file-preparation',
            summary:
              'Corporate salaried employees with verifiable monthly payroll bank deposits and employer leave approval enjoy consistent success with UK Visas & Immigration (UKVI).',
            whySuitable: [
              'Stable corporate salary direct deposits prove legitimate funds and employment roots.',
              'Official employer NOC letter confirms strict expected return date to work.'
            ],
            keyDocuments: [
              'Last 6 months salary slips stamped by HR & corresponding bank statement',
              'Employer NOC / Leave Grant letter confirming position and continuation',
              'NADRA Family Registration Certificate (FRC) demonstrating family ties'
            ],
            refusalDefenseTip:
              'Unexplained large cash deposits in your bank right before applying trigger immediate refusals. VartiMax audits your statement to ensure all funds have clear, provable origins.'
          };
        } else {
          result = {
            categoryTitle: 'Schengen Short-Stay Tourist Visa (Type C) with Optimized File',
            visaSubcategory: 'Spain / Greece / France Tourist Visa',
            visaCategory: 'visit',
            destinationRegion: 'Schengen European Union',
            countryRecommendation: 'Spain or France (Tourist-Friendly Quotas)',
            matchScore: 88,
            badge: 'PROFILE-OPTIMIZED FILING',
            serviceSlug: 'dummy-flight-hotel-booking',
            summary:
              'Your profile is viable for a memorable European holiday. By structuring a cohesive day-by-day travel plan and backing it with genuine GDS flight reservations and €30k insurance, your application satisfies key consular criteria.',
            whySuitable: [
              'Focused short-stay duration (10 to 14 days) aligns well with moderate budget limits.',
              'Pre-booked hotel vouchers eliminate accommodation ambiguity.'
            ],
            keyDocuments: [
              'Day-by-Day realistic travel plan with city-to-city train vouchers',
              '6-Month bank statement audited with Account Maintenance Certificate',
              'Embassy-compliant travel insurance covering medical repatriation'
            ],
            refusalDefenseTip:
              'Do not claim an overly long holiday (e.g. 45 days) on a modest bank statement. VartiMax crafts realistic 10-12 day itineraries that match your financial comfort zone perfectly.'
          };
        }
      }

      setSuggestion(result);
      setIsAnalyzing(false);
    }, 600);
  };

  const activeOptionId = answers[currentQ.id as keyof QuizAnswers];

  const handleWhatsAppInquiry = () => {
    if (!suggestion) return;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum VartiMax Team!\nI completed your Visa Eligibility Quiz.\n\nRecommended Category: ${suggestion.categoryTitle}\nRecommended Destination: ${suggestion.countryRecommendation}\nProfile Match Score: ${suggestion.matchScore}%\n\nI want to book an embassy file assessment at your Gaga Downtown Islamabad desk. Please guide me on required documents.`
    );
    window.open(`https://wa.me/923401207525?text=${text}`, '_blank');
  };

  return (
    <div
      id="visa-eligibility-quiz"
      className={`bg-gradient-to-br from-[#07244A] via-[#092E5E] to-[#0D3874] rounded-2xl border border-[#184B8E] shadow-2xl overflow-hidden ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-10'
      }`}
    >
      {/* Header Banner */}
      <div className="border-b border-[#144482] pb-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-black px-3 py-1 rounded-full border border-[#C5A059]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>INTERACTIVE VISA ELIGIBILITY QUIZ</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#93C5FD]">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Based on 2026 Embassy Guidelines</span>
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Find Your Most Suitable Visa Category
          </h2>
          <p className="text-xs sm:text-sm text-[#D1D5DB] mt-1">
            Answer 4 simple questions to receive an instant category recommendation, success match score, and required document checklist.
          </p>
        </div>

        {/* Progress Bar (Only during question steps) */}
        {!suggestion && !isAnalyzing && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#C5A059]">
                Step {currentStep} of {totalSteps}: {currentQ.title}
              </span>
              <span className="text-[#93C5FD]">
                {Math.round((currentStep / totalSteps) * 100)}% Completed
              </span>
            </div>
            <div className="w-full h-2 bg-[#051C3A] rounded-full overflow-hidden border border-[#144482]">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#E3C379] transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* STATE 1: LOADING / ANALYZING MICRO-STATE */}
      {isAnalyzing && (
        <div className="py-16 text-center space-y-5 animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0B356D] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shadow-xl">
            <Compass className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              Analyzing Your Profile Across 35+ Embassy Criteria...
            </h3>
            <p className="text-xs text-[#93C5FD] max-w-md mx-auto">
              Evaluating financial benchmarks, tie-strength algorithms, and Pakistani applicant approval statistics for 2026.
            </p>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE QUESTION STEP */}
      {!isAnalyzing && !suggestion && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#C5A059]">
              Question {currentStep}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.title}
            </h3>
            <p className="text-xs text-[#CBD5E1]">{currentQ.subtitle}</p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = activeOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group relative ${
                    isSelected
                      ? 'bg-[#0B356D] border-[#C5A059] text-white shadow-lg ring-1 ring-[#C5A059]'
                      : 'bg-[#07244A] hover:bg-[#0A2E5C] border-[#15488A] hover:border-[#C5A059]/50 text-[#E2E8F0]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#C5A059] text-[#042354]'
                        : 'bg-[#092E5E] text-[#C5A059] group-hover:bg-[#C5A059]/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="text-sm font-bold text-white group-hover:text-[#F3F4F6]">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] group-hover:text-[#CBD5E1] mt-0.5 leading-relaxed">
                      {opt.desc}
                    </div>
                  </div>

                  {/* Radio check icon */}
                  <div
                    className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#C5A059] bg-[#C5A059] text-[#042354]'
                        : 'border-[#1E4D8C] bg-transparent text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#144482] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-[#94A3B8]'
                  : 'bg-[#061F40] hover:bg-[#0B356D] text-white border border-[#15488A]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!activeOptionId}
              className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                !activeOptionId
                  ? 'opacity-50 cursor-not-allowed bg-[#4B5563] text-gray-300'
                  : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] hover:shadow-[#C5A059]/25 transform hover:-translate-y-0.5'
              }`}
            >
              <span>{currentStep === totalSteps ? 'Get Visa Recommendation' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: INTERACTIVE RECOMMENDATION RESULT */}
      {!isAnalyzing && suggestion && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Result Highlight Card */}
          <div className="bg-gradient-to-r from-[#0B356D] to-[#07244A] p-6 rounded-2xl border-2 border-[#C5A059]/80 shadow-2xl relative overflow-hidden">
            {/* Background Accent Emblem */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
              <Compass className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#C5A059] text-[#042354] px-3 py-1 rounded-full shadow-sm">
                  {suggestion.badge}
                </span>

                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>{suggestion.matchScore}% PROFILE MATCH</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#C5A059] font-bold block mb-1">
                  RECOMMENDED VISA CATEGORY
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif leading-tight">
                  {suggestion.categoryTitle}
                </h3>
                <p className="text-sm text-[#93C5FD] font-semibold mt-1">
                  {suggestion.visaSubcategory}
                </p>
              </div>

              {/* Destination Tag */}
              <div className="inline-flex items-center gap-2 bg-[#061F40]/80 px-3 py-1.5 rounded-lg border border-[#1C4D8C] text-xs text-[#E2E8F0]">
                <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Optimal Embassy Choice: <strong className="text-white">{suggestion.countryRecommendation}</strong></span>
              </div>

              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed border-t border-[#174682] pt-3">
                {suggestion.summary}
              </p>
            </div>
          </div>

          {/* 2-Column Strengths & Core Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Why This Visa Fits */}
            <div className="bg-[#07244A] p-5 rounded-xl border border-[#15488A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#C5A059] uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>Why Your Profile Matches</span>
              </div>
              <ul className="space-y-2 text-xs text-[#CBD5E1]">
                {suggestion.whySuitable.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Essential Embassy Documents */}
            <div className="bg-[#07244A] p-5 rounded-xl border border-[#15488A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#C5A059] uppercase tracking-wide">
                <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                <span>Key File Requirements</span>
              </div>
              <ul className="space-y-2 text-xs text-[#CBD5E1]">
                {suggestion.keyDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VartiMax Refusal Defense Tip */}
          <div className="bg-[#061F40] p-4 rounded-xl border border-[#C5A059]/40 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">
                VartiMax File Optimization Advisory (Islamabad Desk):
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {suggestion.refusalDefenseTip}
              </p>
            </div>
          </div>

          {/* Alternative Route if any */}
          {suggestion.alternativeRoute && (
            <div className="p-3.5 rounded-xl bg-[#0B2C5C]/50 border border-[#194C8A] text-xs text-[#94A3B8]">
              <strong className="text-white">{suggestion.alternativeRoute.title}: </strong>
              <span>{suggestion.alternativeRoute.description}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-3 border-t border-[#144482] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-[#061F40] hover:bg-[#0A2E5C] text-[#CBD5E1] hover:text-white border border-[#16498C] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp Quiz Result to Case Officer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation(
                      suggestion.countryRecommendation,
                      suggestion.visaCategory
                    );
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-black text-xs flex items-center gap-2 shadow-xl hover:shadow-[#C5A059]/30 transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Book Free File Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
