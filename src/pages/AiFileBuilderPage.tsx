import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiFileBuilderPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'cover_letter' | 'risk_audit'>('cover_letter');

  // Cover letter form state
  const [applicantName, setApplicantName] = useState('');
  const [targetCountry, setTargetCountry] = useState('Italy (Schengen)');
  const [purpose, setPurpose] = useState('Tourism, visiting historical monuments in Rome, Florence, and Venice');
  const [tripDuration, setTripDuration] = useState('11 Days (May 15 - May 26, 2026)');
  const [sponsorOrJob, setSponsorOrJob] = useState('Senior Project Manager at Systems Limited, 6-Month Bank Ledger PKR 4.2M, FBR Active Taxfiler');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Risk audit form state
  const [auditCountry, setAuditCountry] = useState('Germany');
  const [auditVisaType, setAuditVisaType] = useState('Visit Visa');
  const [auditEmployment, setAuditEmployment] = useState('Salaried Corporate Executive');
  const [auditBankBalance, setAuditBankBalance] = useState('3,800,000');
  const [auditTravelHistory, setAuditTravelHistory] = useState(true);
  const [auditTaxReturns, setAuditTaxReturns] = useState(true);
  const [auditNotes, setAuditNotes] = useState('Applying with spouse, own real estate in Islamabad');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Handle cover letter submission
  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          targetCountry,
          purpose,
          tripDuration,
          sponsorOrJob
        })
      });

      const data = await res.json();
      if (data.success && data.coverLetter) {
        setGeneratedLetter(data.coverLetter);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle risk audit
  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);

    try {
      const res = await fetch('/api/gemini/evaluate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: auditCountry,
          visaType: auditVisaType,
          employment: auditEmployment,
          bankBalancePKR: auditBankBalance,
          travelHistory: auditTravelHistory,
          taxReturns: auditTaxReturns,
          notes: auditNotes
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setAuditResult(data.evaluation);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6] py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C5A059]/40">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>GEMINI-POWERED EMBASSY FILE INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            AI Visa File Builder & Risk Strategist
          </h1>
          <p className="text-xs text-[#D1D5DB]">
            Generate embassy-standard Cover Letters, University SOPs, and deep refusal risk audits modeled after VartiMax Consultant's 90% acceptance benchmarks.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center">
          <div className="bg-[#07244A] p-1.5 rounded-xl flex items-center gap-1 border border-[#15488A] text-xs font-bold">
            <button
              onClick={() => setActiveTool('cover_letter')}
              className={`px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTool === 'cover_letter'
                  ? 'bg-[#C5A059] text-[#061F40] shadow-md font-extrabold'
                  : 'text-[#D1D5DB] hover:text-white hover:bg-[#061F40]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. AI Embassy Cover Letter Generator</span>
            </button>
            <button
              onClick={() => setActiveTool('risk_audit')}
              className={`px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTool === 'risk_audit'
                  ? 'bg-[#C5A059] text-[#061F40] shadow-md font-extrabold'
                  : 'text-[#D1D5DB] hover:text-white hover:bg-[#061F40]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>2. Deep Embassy Risk Evaluation</span>
            </button>
          </div>
        </div>

        {/* TOOL 1: COVER LETTER GENERATOR */}
        {activeTool === 'cover_letter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Applicant File Parameters</span>
              </h3>

              <form onSubmit={handleGenerateCoverLetter} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Kamran Tariq"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Target Embassy / Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    placeholder="e.g. Embassy of Italy, Islamabad"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Purpose of Visit & Travel Dates
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Tourism, attending academic conference, etc."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Trip Duration & Dates
                  </label>
                  <input
                    type="text"
                    value={tripDuration}
                    onChange={(e) => setTripDuration(e.target.value)}
                    placeholder="e.g. 10 Days (June 10 - June 20, 2026)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                    Employment & Financial Backing Proof
                  </label>
                  <textarea
                    rows={2}
                    value={sponsorOrJob}
                    onChange={(e) => setSponsorOrJob(e.target.value)}
                    placeholder="Designation, company name, bank balance, tax returns"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span>Writing Embassy-Grade Cover Letter...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#061F40]" />
                      <span>Generate Professional Cover Letter</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Output Preview */}
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#123A6D] pb-3 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Embassy-Standard Output</span>
                  </h3>

                  {generatedLetter && (
                    <button
                      onClick={() => copyToClipboard(generatedLetter)}
                      className="flex items-center gap-1 text-xs bg-[#061F40] hover:bg-[#0B356D] text-white border border-[#15488A] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
                      <span>{copiedLetter ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  )}
                </div>

                {generatedLetter ? (
                  <div className="bg-[#051C3A] p-4 rounded-xl text-xs text-[#E0E7FF] whitespace-pre-wrap font-serif leading-relaxed max-h-[420px] overflow-y-auto border border-[#15488A]">
                    {generatedLetter}
                  </div>
                ) : (
                  <div className="text-center py-16 text-[#93C5FD]/70 text-xs space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-[#93C5FD]/50" />
                    <p>Fill in applicant details and click generate to create an embassy-compliant cover letter.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#123A6D] text-[11px] text-[#D1D5DB]">
                ⭐ <strong>Tip:</strong> Bring this cover letter to our Islamabad office for final cross-referencing with your flight PNR and hotel vouchers.
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: DEEP RISK AUDIT */}
        {activeTool === 'risk_audit' && (
          <div className="space-y-6">
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] space-y-6">
              <form onSubmit={handleRunAudit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                      Target Country
                    </label>
                    <input
                      type="text"
                      value={auditCountry}
                      onChange={(e) => setAuditCountry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                      Visa Category
                    </label>
                    <select
                      value={auditVisaType}
                      onChange={(e) => setAuditVisaType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white"
                    >
                      <option value="Visit Visa">Visit / Tourist Visa</option>
                      <option value="Study Visa">Student Visa</option>
                      <option value="Employment Visa">Work / Freelance Visa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                      Bank Balance (PKR)
                    </label>
                    <input
                      type="text"
                      value={auditBankBalance}
                      onChange={(e) => setAuditBankBalance(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                      Employment / Profession
                    </label>
                    <input
                      type="text"
                      value={auditEmployment}
                      onChange={(e) => setAuditEmployment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                      Family / Assets / Property Ties in Pakistan
                    </label>
                    <input
                      type="text"
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-[#78909C]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#E0E7FF] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditTravelHistory}
                      onChange={(e) => setAuditTravelHistory(e.target.checked)}
                      className="rounded text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span>Has Prior International Travel</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#E0E7FF] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditTaxReturns}
                      onChange={(e) => setAuditTaxReturns(e.target.checked)}
                      className="rounded text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span>FBR Tax Filer (2-3 Years Returns)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold py-3 px-6 rounded-xl text-xs shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#061F40]" />
                  <span>{isAuditing ? 'Auditing Against Refusal Vectors...' : 'Run Gemini Embassy Audit'}</span>
                </button>
              </form>
            </div>

            {auditResult && (
              <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#15488A] space-y-6 animate-in fade-in duration-200">
                <div className="bg-gradient-to-r from-[#061F40] to-[#0B356D] border border-[#15488A] p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                      EMBASSY VERDICT
                    </span>
                    <h4 className="text-xl font-bold">{auditResult.verdict}</h4>
                    <p className="text-xs text-[#D1D5DB] mt-1 max-w-lg">
                      {auditResult.consultantRecommendation}
                    </p>
                  </div>
                  <div className="text-3xl font-black text-[#C5A059] bg-[#051C3A] px-5 py-3 rounded-xl border border-[#C5A059]/40">
                    {auditResult.acceptanceProbability}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#082D20] rounded-xl border border-emerald-700/40 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400">
                      ✓ Profile Strongholds:
                    </h5>
                    <ul className="text-xs text-emerald-300 space-y-1">
                      {auditResult.strengths?.map((s: string, idx: number) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#3B151E] rounded-xl border border-red-700/40 space-y-2">
                    <h5 className="text-xs font-bold text-red-400">
                      ⚠️ Scrutiny & Vulnerability Vectors:
                    </h5>
                    <ul className="text-xs text-red-300 space-y-1">
                      {auditResult.vulnerabilities?.map((v: string, idx: number) => (
                        <li key={idx}>• {v}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
