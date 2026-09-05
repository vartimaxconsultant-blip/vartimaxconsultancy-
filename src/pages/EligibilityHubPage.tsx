import React, { useState } from 'react';
import { Sparkles, Calculator, ShieldCheck, ArrowRight, FileCheck2, HelpCircle } from 'lucide-react';
import { VisaEligibilityQuiz } from '../components/VisaEligibilityQuiz';
import { QuickAssessmentWidget } from '../components/QuickAssessmentWidget';
import { VisaCategory } from '../types';

interface EligibilityHubPageProps {
  initialTab?: 'quiz' | 'calculator';
  onOpenConsultation: (country?: string, category?: VisaCategory) => void;
  onNavigateToServices?: (slug: string) => void;
}

export const EligibilityHubPage: React.FC<EligibilityHubPageProps> = ({
  initialTab = 'quiz',
  onOpenConsultation,
  onNavigateToServices
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'calculator'>(initialTab);

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6] py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Top Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-black px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>2026 EMBASSY ELIGIBILITY &amp; ADJUDICATION ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            Visa Eligibility &amp; Category Assessment
          </h1>
          <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
            Eliminate rejection risks before submitting to the embassy. Use our interactive tools to determine your optimal visa category and calculate your statistical approval score.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-[#061F40] border border-[#184B8E] shadow-xl mt-4">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-[#C5A059] text-[#042354] shadow-md font-extrabold'
                  : 'text-[#93C5FD] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Interactive Visa Eligibility Quiz</span>
              <span className="text-[10px] bg-[#042354] text-[#C5A059] px-1.5 py-0.5 rounded font-black hidden sm:inline">
                NEW
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#C5A059] text-[#042354] shadow-md font-extrabold'
                  : 'text-[#93C5FD] hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Acceptance Score Calculator</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Visa Eligibility Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <VisaEligibilityQuiz
              onOpenConsultation={(country, category) => onOpenConsultation(country, category)}
              onNavigateToServices={onNavigateToServices}
              compact={false}
            />

            {/* Help Callout */}
            <div className="bg-[#07244A] p-6 rounded-2xl border border-[#15488A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#092E5E] text-[#C5A059] border border-[#1A4B8A] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Already know your visa category?
                  </h4>
                  <p className="text-xs text-[#93C5FD]">
                    Switch to the Acceptance Score Calculator to compute your specific bank and tie scores.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('calculator')}
                className="px-4 py-2 rounded-xl bg-[#0B356D] hover:bg-[#0E3D7D] text-white border border-[#1A4B8A] text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <span>Switch to Score Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Acceptance Score Calculator */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <QuickAssessmentWidget
              onOpenConsultation={() => onOpenConsultation()}
              compact={false}
            />

            {/* Back to Quiz Callout */}
            <div className="bg-[#07244A] p-6 rounded-2xl border border-[#15488A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#092E5E] text-[#C5A059] border border-[#1A4B8A] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Need help choosing the right destination?
                  </h4>
                  <p className="text-xs text-[#93C5FD]">
                    Take the 4-question Visa Eligibility Quiz to find your best matching route.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <span>Take Visa Eligibility Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
