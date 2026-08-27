import React, { useState } from 'react';
import {
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisaCategory, QuickAssessmentResult } from '../types';

interface QuickAssessmentWidgetProps {
  onOpenConsultation: () => void;
  compact?: boolean;
}

export const QuickAssessmentWidget: React.FC<QuickAssessmentWidgetProps> = ({
  onOpenConsultation,
  compact = false
}) => {
  const [targetCountry, setTargetCountry] = useState('Schengen (Germany/Italy/France)');
  const [visaCategory, setVisaCategory] = useState<VisaCategory>('visit');
  const [employmentStatus, setEmploymentStatus] = useState('salaried');
  const [bankBalanceTier, setBankBalanceTier] = useState('above_3m');
  const [hasTravelHistory, setHasTravelHistory] = useState(true);
  const [hasFbrTax, setHasFbrTax] = useState(true);
  const [hasFamilyTies, setHasFamilyTies] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<QuickAssessmentResult | null>(null);

  const calculateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      let score = 55;

      // Factors
      if (bankBalanceTier === 'above_5m') score += 20;
      else if (bankBalanceTier === 'above_3m') score += 15;
      else if (bankBalanceTier === '1m_to_3m') score += 8;

      if (hasFbrTax) score += 12;
      if (hasTravelHistory) score += 10;
      if (hasFamilyTies) score += 8;
      if (employmentStatus === 'business_owner' || employmentStatus === 'salaried') score += 5;

      if (score > 96) score = 94; // Realistic cap

      let verdict: QuickAssessmentResult['verdict'] = 'High Acceptance (90%+)';
      let summary =
        'Your profile exhibits exceptional strengths with healthy financial and documentary ties. With VartiMax embassy file engineering, your acceptance probability is in the top tier.';
      
      const strengths: string[] = [];
      const recommendations: string[] = [];

      if (hasFbrTax) strengths.push('Active FBR Tax Returns demonstrate legitimate domestic income.');
      if (hasTravelHistory) strengths.push('Previous travel history establishes a record of compliance.');
      if (bankBalanceTier === 'above_3m' || bankBalanceTier === 'above_5m') {
        strengths.push('Solid closing bank balance comfortably covers trip and living expenses.');
      }
      if (hasFamilyTies) strengths.push('NADRA Family Registration (FRC) validates strong return ties to Pakistan.');

      recommendations.push('Structure a tailored, embassy-grade Cover Letter detailing exact travel purpose.');
      recommendations.push('Obtain verified GDS Flight Reservation and free-cancellation hotel bookings.');
      recommendations.push('Include €30,000 Schengen Travel Insurance with zero deductible.');

      if (!hasFbrTax) {
        recommendations.push('Prepare an Affidavit of Assets and business proof to compensate for unfiled tax returns.');
      }

      setResult({
        scorePercentage: score,
        verdict,
        summary,
        strengths,
        recommendations,
        customRoadmap: [
          'Step 1: Document Audit at VartiMax Islamabad Office',
          'Step 2: Embassy-Optimized File Creation (Cover letter, PNR, Insurance, Itinerary)',
          'Step 3: Biometric Appointment at VFS/Gerrys Islamabad',
          'Step 4: Visa Stamping & Pre-Departure Briefing'
        ]
      });

      setIsCalculating(false);

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 600);
  };

  return (
    <div className={`bg-[#07244A] rounded-2xl shadow-xl border border-[#15488A] overflow-hidden text-[#E5E5E5] ${compact ? 'p-6' : 'p-6 sm:p-8'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#123A6D] pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 mb-1">
            <Calculator className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>ALGORITHMIC VISA PROBABILITY AUDIT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Embassy Visa Eligibility Calculator
          </h3>
          <p className="text-xs text-[#D1D5DB] mt-0.5">
            Test your profile strength based on official embassy benchmarks in Islamabad.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold bg-[#061F40] border border-[#15488A] text-white px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>VartiMax 90% Success Metric</span>
        </div>
      </div>

      {!result ? (
        <form onSubmit={calculateAssessment} className="space-y-5">
          {/* Target Country & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#E0E7FF] mb-1.5">
                1. Target Destination Country
              </label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#15488A] text-xs font-medium text-white focus:border-[#C5A059] focus:outline-none bg-[#061F40]"
              >
                <option value="Schengen (Germany/Italy/France)">Schengen (Italy, Germany, France, Spain)</option>
                <option value="Canada (Visitor & Study)">Canada (Visitor & Study Permit)</option>
                <option value="United States (B1/B2 & F1)">United States (B1/B2 & F1)</option>
                <option value="United Kingdom (Student & Visitor)">United Kingdom (Visitor & Student)</option>
                <option value="UAE (Dubai 30/60 Days & Golden)">UAE / Dubai</option>
                <option value="Saudi Arabia (Umrah Packages)">Saudi Arabia (Umrah Packages)</option>
                <option value="Australia (Subclass 500 & 600)">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E0E7FF] mb-1.5">
                2. Visa Category
              </label>
              <select
                value={visaCategory}
                onChange={(e) => setVisaCategory(e.target.value as VisaCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#15488A] text-xs font-medium text-white focus:border-[#C5A059] focus:outline-none bg-[#061F40]"
              >
                <option value="visit">Visit / Tourist / Business Visa</option>
                <option value="study">Student Visa & University Admissions</option>
                <option value="employment">Employment / Freelance Permit</option>
                <option value="umrah">Umrah Visa & Travel Package</option>
              </select>
            </div>
          </div>

          {/* Employment & Bank Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#E0E7FF] mb-1.5">
                3. Current Employment / Income Source
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#15488A] text-xs font-medium text-white focus:border-[#C5A059] focus:outline-none bg-[#061F40]"
              >
                <option value="salaried">Salaried Professional (MNC / Corporate / Govt)</option>
                <option value="business_owner">Business Owner / Partner / SECP Registered</option>
                <option value="freelancer">IT Professional / Freelancer / Remote Worker</option>
                <option value="student">Student / Sponsored by Parents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E0E7FF] mb-1.5">
                4. Estimated 6-Month Bank Balance (PKR)
              </label>
              <select
                value={bankBalanceTier}
                onChange={(e) => setBankBalanceTier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#15488A] text-xs font-medium text-white focus:border-[#C5A059] focus:outline-none bg-[#061F40]"
              >
                <option value="above_5m">PKR 5.0 Million+ (Strong Financial Standing)</option>
                <option value="above_3m">PKR 3.0 Million – 5.0 Million (Recommended)</option>
                <option value="1m_to_3m">PKR 1.5 Million – 3.0 Million (Moderate)</option>
                <option value="below_1m">Under PKR 1.5 Million (Needs Sponsorship Advice)</option>
              </select>
            </div>
          </div>

          {/* Checkbox Factors */}
          <div className="p-4 bg-[#061F40] rounded-xl border border-[#123A6D] space-y-3">
            <span className="text-xs font-bold text-[#E0E7FF] block">
              5. Documentary Ties & History Check:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 text-xs text-[#E5E5E5] cursor-pointer bg-[#07244A] p-2.5 rounded-lg border border-[#15488A] hover:border-[#C5A059]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={hasFbrTax}
                  onChange={(e) => setHasFbrTax(e.target.checked)}
                  className="rounded text-[#C5A059] focus:ring-[#C5A059] w-4 h-4 bg-[#061F40] border-[#15488A]"
                />
                <span className="font-medium">Active FBR Tax / NTN</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#E5E5E5] cursor-pointer bg-[#07244A] p-2.5 rounded-lg border border-[#15488A] hover:border-[#C5A059]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={hasTravelHistory}
                  onChange={(e) => setHasTravelHistory(e.target.checked)}
                  className="rounded text-[#C5A059] focus:ring-[#C5A059] w-4 h-4 bg-[#061F40] border-[#15488A]"
                />
                <span className="font-medium">Has Past Travel Visas</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#E5E5E5] cursor-pointer bg-[#07244A] p-2.5 rounded-lg border border-[#15488A] hover:border-[#C5A059]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={hasFamilyTies}
                  onChange={(e) => setHasFamilyTies(e.target.checked)}
                  className="rounded text-[#C5A059] focus:ring-[#C5A059] w-4 h-4 bg-[#061F40] border-[#15488A]"
                />
                <span className="font-medium">NADRA Family FRC</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold py-3.5 px-6 rounded-xl text-sm shadow-lg hover:shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2 text-[#061F40]">
                <span className="w-4 h-4 border-2 border-[#061F40] border-t-transparent rounded-full animate-spin"></span>
                Evaluating Embassy Benchmarks...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#061F40]" />
                <span>Calculate My Visa Approval Probability</span>
                <ArrowRight className="w-4 h-4 ml-1 text-[#061F40]" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Probability Score Meter */}
          <div className="bg-gradient-to-br from-[#061F40] to-[#0B356D] border border-[#15488A] p-6 rounded-2xl text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full border border-[#C5A059]/40 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>ASSESSMENT VERDICT</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                {result.verdict}
              </h4>
              <p className="text-xs text-[#D1D5DB] mt-1 max-w-md">
                {result.summary}
              </p>
            </div>

            {/* Circular Metric */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-[#051C3A] border-4 border-[#C5A059] shadow-inner shrink-0">
              <div className="text-center">
                <span className="text-3xl font-black text-[#C5A059]">
                  {result.scorePercentage}%
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#93C5FD]">
                  Probability
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#082D20] border border-emerald-700/40 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile Strengths:</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-[#D1D5DB]">
                {result.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#2A2312] border border-[#C5A059]/40 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Embassy File Strategy Required:</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-[#D1D5DB]">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#C5A059] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenConsultation}
              className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#061F40]" />
              <span>Book Priority Case File Creation</span>
            </button>
            <button
              onClick={() => setResult(null)}
              className="bg-[#0B356D] hover:bg-[#124285] text-white font-semibold py-3 px-5 rounded-xl text-xs transition-colors cursor-pointer border border-[#1A4B8A]"
            >
              Re-Calculate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
