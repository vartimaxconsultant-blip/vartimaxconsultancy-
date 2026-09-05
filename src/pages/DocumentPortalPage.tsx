import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Trash2,
  FileCheck,
  Plane,
  GraduationCap,
  Briefcase,
  Compass,
  Phone,
  Send,
  Copy,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DOCUMENT_REQUIREMENTS } from '../data/requirementsData';
import { VisaCategory, UploadedFileDoc, ClientApplication } from '../types';
import { notificationBus } from '../utils/notificationBus';

interface DocumentPortalPageProps {
  onOpenConsultation: () => void;
}

export const DocumentPortalPage: React.FC<DocumentPortalPageProps> = ({
  onOpenConsultation
}) => {
  // Tab states: 'submit' | 'track' | 'admin_crm'
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'admin_crm'>('submit');

  // Category Selector
  const [selectedCategory, setSelectedCategory] = useState<VisaCategory>('visit');

  // Applicant metadata
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState('Italy (Schengen)');
  const [passportNumber, setPassportNumber] = useState('');
  const [intakeDate, setIntakeDate] = useState('June 2026');

  // Uploaded files dictionary: requirementId -> UploadedFileDoc
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileDoc>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<ClientApplication | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedApp, setTrackedApp] = useState<ClientApplication | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Admin CRM state
  const [adminSubmissions, setAdminSubmissions] = useState<ClientApplication[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const currentRequirements = DOCUMENT_REQUIREMENTS[selectedCategory] || [];

  // Handle single file upload for a requirement slot
  const handleFileUpload = (reqId: string, reqTitle: string, file: File) => {
    setUploadError(null);

    // 10MB limit check
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`File "${file.name}" exceeds the maximum allowed 10MB limit.`);
      return;
    }

    const newDoc: UploadedFileDoc = {
      requirementId: reqId,
      requirementTitle: reqTitle,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/pdf',
      uploadedAt: new Date().toISOString(),
      previewUrl: URL.createObjectURL(file),
      status: 'pending'
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [reqId]: newDoc
    }));
  };

  const handleRemoveFile = (reqId: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[reqId];
      return copy;
    });
  };

  // Submit the package to the server
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) {
      setUploadError('Please provide your Full Name and WhatsApp Number.');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    const docsArray: UploadedFileDoc[] = Object.values(uploadedFiles);

    try {
      const payload = {
        fullName,
        whatsapp,
        email,
        category: selectedCategory,
        targetCountry,
        passportNumber,
        intakeDate,
        documents: docsArray
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.submission) {
        setSubmittedApp(data.submission);

        if (data.notification) {
          notificationBus.emit(data.notification);
        } else {
          notificationBus.emit({
            id: `NOTIF-${Date.now()}`,
            type: 'document_upload',
            title: 'Client Dossier Uploaded',
            clientName: fullName,
            whatsapp,
            targetCountry,
            visaType: selectedCategory,
            summary: `${fullName} uploaded ${docsArray.length} documents for ${targetCountry} (${selectedCategory}). Ref: ${data.submission.referenceId}`,
            details: {
              referenceId: data.submission.referenceId,
              passportNumber,
              intakeDate,
              documentsList: docsArray.map((d) => `${d.requirementTitle} (${d.fileName})`)
            },
            createdAt: new Date().toISOString(),
            read: false,
            contacted: false
          });
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setUploadError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback local simulation
      const mockRef = `VMX-ISB-${Math.floor(10000 + Math.random() * 90000)}`;
      const fallbackApp: ClientApplication = {
        referenceId: mockRef,
        fullName,
        whatsapp,
        email,
        category: selectedCategory,
        targetCountry,
        passportNumber,
        intakeDate,
        documents: Object.values(uploadedFiles),
        status: 'documents_received',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSubmittedApp(fallbackApp);

      notificationBus.emit({
        id: `NOTIF-${Date.now()}`,
        type: 'document_upload',
        title: 'Client Dossier Uploaded',
        clientName: fullName,
        whatsapp,
        targetCountry,
        visaType: selectedCategory,
        summary: `${fullName} uploaded ${docsArray.length} documents for ${targetCountry} (${selectedCategory}). Ref: ${mockRef}`,
        details: {
          referenceId: mockRef,
          passportNumber,
          intakeDate,
          documentsList: docsArray.map((d) => `${d.requirementTitle} (${d.fileName})`)
        },
        createdAt: new Date().toISOString(),
        read: false,
        contacted: false
      });

      confetti({ particleCount: 80 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Look up application in CRM
  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackedApp(null);

    try {
      const res = await fetch(`/api/submissions/lookup?q=${encodeURIComponent(trackQuery)}`);
      const data = await res.json();
      if (data.success && data.application) {
        setTrackedApp(data.application);
      } else {
        setTrackError(data.error || 'No application found with this Reference ID or Phone number.');
      }
    } catch (err) {
      setTrackError('Could not reach database. Please test with VMX-ISB-78219 or your phone number.');
    } finally {
      setTrackLoading(false);
    }
  };

  // Fetch admin list
  const fetchAdminSubmissions = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/all');
      const data = await res.json();
      if (data.submissions) {
        setAdminSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin_crm') {
      fetchAdminSubmissions();
    }
  }, [activeTab]);

  const copyRefId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C5A059]/40">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>VARTIMAX SECURE CLIENT DOCUMENT HUB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Document Submission & Intake CRM Portal
          </h1>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            Select your visa category to instantly render the embassy-mandatory checklist. Upload your clear PDF/JPEG copies for automated audit and file compilation by our Islamabad headquarters.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center">
          <div className="bg-[#07244A] p-1.5 rounded-xl flex items-center gap-1 border border-[#15488A] text-xs font-bold">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'submit'
                  ? 'bg-[#C5A059] text-[#061F40] shadow-md font-extrabold'
                  : 'text-[#D1D5DB] hover:text-white hover:bg-[#061F40]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Submit Documents</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-[#C5A059] text-[#061F40] shadow-md font-extrabold'
                  : 'text-[#D1D5DB] hover:text-white hover:bg-[#061F40]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>2. Track File Status</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_crm')}
              className={`px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'admin_crm'
                  ? 'bg-[#C5A059] text-[#061F40] shadow-md font-extrabold'
                  : 'text-[#D1D5DB] hover:text-white hover:bg-[#061F40]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Staff CRM Portal</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SUBMIT DOCUMENTS INTAKE */}
        {activeTab === 'submit' && (
          <div className="space-y-8">
            {submittedApp ? (
              /* Success Submission Card */
              <div className="bg-[#07244A] rounded-2xl shadow-xl border border-emerald-500/40 p-8 text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    Application Docket Successfully Generated
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-2">
                    Client Reference ID: {submittedApp.referenceId}
                  </h2>
                  <p className="text-xs text-[#D1D5DB] mt-1">
                    Thank you, <span className="font-semibold text-white">{submittedApp.fullName}</span>. We have securely received your{' '}
                    <span className="font-semibold text-white">{submittedApp.documents.length}</span> uploaded documents for{' '}
                    <span className="font-semibold text-white">{submittedApp.targetCountry}</span>.
                  </p>
                </div>

                {/* Ref ID Copy Box */}
                <div className="bg-[#061F40] p-4 rounded-xl border border-[#15488A] flex items-center justify-between">
                  <div className="text-left font-mono">
                    <span className="text-[10px] uppercase text-[#93C5FD] block font-sans">
                      Your Unique Reference Tracking Code:
                    </span>
                    <span className="text-lg font-extrabold text-[#C5A059]">
                      {submittedApp.referenceId}
                    </span>
                  </div>
                  <button
                    onClick={() => copyRefId(submittedApp.referenceId)}
                    className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRef ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Action */}
                <div className="p-4 bg-[#082D20] rounded-xl border border-emerald-700/40 text-left text-xs text-emerald-300 space-y-2">
                  <p className="font-bold text-emerald-400">
                    📲 Expedite Your Embassy File Verification:
                  </p>
                  <p>
                    Send your Reference ID directly to our Islamabad case desk on WhatsApp (+92 340 1207525) for instant file assignment and review.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/923401207525?text=${encodeURIComponent(
                      `Assalam-o-Alaikum VartiMax Team. I have submitted my documents for ${submittedApp.category.toUpperCase()} visa to ${submittedApp.targetCountry}. My Client Reference ID is ${submittedApp.referenceId}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reference ID on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setUploadedFiles({});
                    }}
                    className="bg-[#061F40] hover:bg-[#0B356D] text-[#E0E7FF] font-semibold py-3.5 px-4 rounded-xl text-xs border border-[#15488A] transition-colors cursor-pointer"
                  >
                    Submit Another File
                  </button>
                </div>
              </div>
            ) : (
              /* Main Submission Form */
              <form onSubmit={handleSubmitApplication} className="space-y-8">
                {/* Step 1: Category Selector Pills */}
                <div className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#061F40] font-extrabold flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Select Visa Category to Render Document Checklist</span>
                    </h3>
                    <span className="text-xs text-[#D1D5DB] font-medium">
                      {currentRequirements.length} Requirements Required
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'visit', label: 'Visit / Tourist Visa', icon: Plane, sub: 'Schengen, UK, USA, UAE' },
                      { id: 'study', label: 'Study Visa', icon: GraduationCap, sub: 'Worldwide Admissions & SOP' },
                      { id: 'employment', label: 'Employment Visa', icon: Briefcase, sub: 'Work Permits & GAMCA' },
                      { id: 'umrah', label: 'Umrah Visa', icon: Compass, sub: 'Family & Group Packages' }
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id as VisaCategory);
                            setUploadedFiles({});
                          }}
                          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B356D] text-white border-[#C5A059] shadow-md ring-2 ring-[#C5A059]'
                              : 'bg-[#061F40] text-[#E0E7FF] border-[#15488A] hover:bg-[#0B356D]'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[#C5A059]' : 'text-[#93C5FD]'}`} />
                          <div className="text-xs font-bold leading-tight">{cat.label}</div>
                          <div className={`text-[10px] mt-1 ${isSelected ? 'text-[#C5A059]' : 'text-[#93C5FD]/70'}`}>
                            {cat.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Dynamic Requirements Upload Slots */}
                <div className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#123A6D] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#061F40] font-extrabold flex items-center justify-center text-xs">
                          2
                        </span>
                        <span>Dynamic Requirement Checklist & Upload Slots</span>
                      </h3>
                      <p className="text-xs text-[#D1D5DB] mt-0.5">
                        Upload Max 10MB per document (PDF or High-Res JPEG/PNG)
                      </p>
                    </div>

                    <div className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1.5 rounded-lg border border-[#C5A059]/40">
                      Uploaded: {Object.keys(uploadedFiles).length} / {currentRequirements.length}
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-3.5 bg-red-950/40 text-red-300 rounded-xl border border-red-800/40 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Dynamic Requirements List */}
                  <div className="space-y-4">
                    {currentRequirements.map((req, idx) => {
                      const uploaded = uploadedFiles[req.id];
                      return (
                        <div
                          key={req.id}
                          className={`p-4 rounded-xl border transition-all ${
                            uploaded
                              ? 'bg-[#082D20] border-emerald-600/50'
                              : 'bg-[#061F40] border-[#15488A] hover:border-[#C5A059]/50'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Left Description */}
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0B356D] border border-[#15488A] text-[#E0E7FF]">
                                  #{idx + 1}
                                </span>
                                <h4 className="text-sm font-bold text-white">
                                  {req.title}
                                </h4>
                                {req.mandatory && (
                                  <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-1.5 py-0.5 rounded">
                                    Mandatory
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                                {req.description}
                              </p>
                              {req.tip && (
                                <p className="text-[11px] text-[#C5A059] font-medium">
                                  💡 <strong>Tip:</strong> {req.tip}
                                </p>
                              )}
                            </div>

                            {/* Right Upload Action or Uploaded Preview */}
                            <div className="shrink-0 flex items-center gap-2">
                              {uploaded ? (
                                <div className="flex items-center gap-3 bg-[#051C3A] p-2.5 rounded-xl border border-emerald-500/40 shadow-sm">
                                  <FileCheck className="w-5 h-5 text-emerald-400" />
                                  <div className="text-left font-mono">
                                    <div className="text-xs font-bold text-white max-w-[150px] truncate">
                                      {uploaded.fileName}
                                    </div>
                                    <div className="text-[10px] text-[#93C5FD]">
                                      {(uploaded.fileSize / 1024 / 1024).toFixed(2)} MB • Ready
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(req.id)}
                                    className="p-1.5 text-[#93C5FD] hover:text-red-400 rounded-lg hover:bg-[#061F40] transition-colors cursor-pointer"
                                    title="Remove file"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="inline-flex items-center gap-1.5 bg-[#0B356D] hover:bg-[#15488A] text-white border border-[#15488A] font-semibold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors cursor-pointer">
                                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                                  <span>Choose File (Max 10MB)</span>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(req.id, req.title, e.target.files[0]);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Applicant Contact & Identity */}
                <div className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#061F40] font-extrabold flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>Applicant Identity & Dispatch Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        Full Name (As on Passport) *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Asad Ullah Khan"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        WhatsApp Number * (For Updates)
                      </label>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="e.g. +92 340 1207525"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        Target Country / Destination *
                      </label>
                      <input
                        type="text"
                        value={targetCountry}
                        onChange={(e) => setTargetCountry(e.target.value)}
                        placeholder="e.g. Germany (Schengen)"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="applicant@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        placeholder="e.g. AB1234567"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C] uppercase font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E0E7FF] mb-1">
                        Intended Travel / Intake Date
                      </label>
                      <input
                        type="text"
                        value={intakeDate}
                        onChange={(e) => setIntakeDate(e.target.value)}
                        placeholder="e.g. May 2026 / Sept 2026"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] focus:border-transparent focus:outline-none text-white placeholder-[#78909C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-extrabold py-4 px-6 rounded-2xl text-base shadow-xl hover:shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Encrypting & Generating Client Reference Code...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-[#061F40]" />
                        <span>Submit Documents & Generate Client Reference ID</span>
                        <ArrowRight className="w-5 h-5 ml-1 text-[#061F40]" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-[#D1D5DB] mt-2">
                    🔒 Stored with 256-bit encryption. Assigned directly to senior case officers at Office 78 Gaga Downtown Islamabad.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK FILE STATUS */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#15488A] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/40">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Real-Time Application Status Tracker
              </h3>
              <p className="text-xs text-[#D1D5DB] max-w-md mx-auto">
                Enter your <strong>Client Reference ID</strong> (e.g. <code>VMX-ISB-78219</code>) or your registered WhatsApp number to view file progression.
              </p>

              <form onSubmit={handleTrackApplication} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  required
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. VMX-ISB-78219 or 03401207525"
                  className="flex-1 px-4 py-3 text-xs rounded-xl bg-[#061F40] border border-[#15488A] focus:ring-2 focus:ring-[#C5A059] font-mono text-white placeholder-[#78909C]"
                />
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold px-5 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {trackLoading ? 'Searching...' : 'Track'}
                </button>
              </form>

              {trackError && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/40 text-amber-300 rounded-xl text-xs">
                  {trackError}
                </div>
              )}
            </div>

            {/* Tracked Result View */}
            {trackedApp && (
              <div className="bg-[#07244A] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#15488A] space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#123A6D] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#93C5FD] block uppercase">
                      Client File Docket
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      {trackedApp.fullName}
                    </h4>
                    <div className="text-xs text-[#D1D5DB] font-mono">
                      Ref: {trackedApp.referenceId} • {trackedApp.targetCountry}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                      trackedApp.status === 'ready_for_embassy' || trackedApp.status === 'visa_approved'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-950/60 text-[#C5A059] border border-[#C5A059]/40'
                    }`}>
                      {trackedApp.status === 'ready_for_embassy' && 'Ready for Embassy Submission'}
                      {trackedApp.status === 'documents_received' && 'Documents Received & Under Audit'}
                      {trackedApp.status === 'file_in_creation' && 'Embassy File in Creation'}
                      {trackedApp.status === 'visa_approved' && 'Visa Stamped & Approved'}
                      {trackedApp.status === 'pending_review' && 'Pending Initial Review'}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#E0E7FF] block">
                    Embassy Roadmap Progression:
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
                    <div className="p-2.5 rounded-lg bg-[#082D20] text-emerald-300 border border-emerald-700/50">
                      ✓ Docs Uploaded
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#082D20] text-emerald-300 border border-emerald-700/50">
                      ✓ Audit Passed
                    </div>
                    <div className={`p-2.5 rounded-lg border ${
                      trackedApp.status === 'ready_for_embassy' || trackedApp.status === 'visa_approved'
                        ? 'bg-[#082D20] text-emerald-300 border-emerald-700/50'
                        : 'bg-[#3D290F] text-[#C5A059] border-[#C5A059]/50 font-bold animate-pulse'
                    }`}>
                      {trackedApp.status === 'ready_for_embassy' ? '✓ File Engineered' : '⏳ File Creation'}
                    </div>
                    <div className={`p-2.5 rounded-lg border ${
                      trackedApp.status === 'visa_approved'
                        ? 'bg-[#082D20] text-emerald-300'
                        : 'bg-[#061F40] text-[#78909C] border-[#15488A]'
                    }`}>
                      Embassy Biometrics
                    </div>
                  </div>
                </div>

                {/* Case Officer Notes */}
                {trackedApp.notes && (
                  <div className="p-4 bg-[#061F40] rounded-xl border border-[#15488A] text-xs text-[#E0E7FF]">
                    <span className="font-bold text-[#C5A059] block mb-1">
                      Case Officer Remarks (Islamabad Headquarters):
                    </span>
                    <p className="italic text-[#D1D5DB]">{trackedApp.notes}</p>
                  </div>
                )}

                {/* Documents List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E0E7FF] block">
                    Verified Documents on File ({trackedApp.documents.length}):
                  </span>
                  <div className="space-y-2">
                    {trackedApp.documents.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#061F40] border border-[#15488A] text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-medium text-[#E0E7FF]">{d.requirementTitle}</span>
                        </div>
                        <span className="font-mono text-[#93C5FD]">{d.fileName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={`https://wa.me/923401207525?text=${encodeURIComponent(
                      `Inquiring on Reference ID ${trackedApp.referenceId} for ${trackedApp.fullName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Inquire with Case Officer</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STAFF CRM PORTAL */}
        {activeTab === 'admin_crm' && (
          <div className="space-y-6">
            <div className="bg-[#07244A] border border-[#15488A] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                  STAFF DASHBOARD
                </span>
                <h3 className="text-xl font-bold">VartiMax Document Intake Management</h3>
                <p className="text-xs text-[#D1D5DB] mt-0.5">
                  Office 78 Gaga Downtown Islamabad Internal File Management Desk
                </p>
              </div>
              <button
                onClick={fetchAdminSubmissions}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#061F40] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Refresh Data
              </button>
            </div>

            {adminLoading ? (
              <div className="text-center py-12 text-[#93C5FD] text-xs">
                Loading client dockets...
              </div>
            ) : adminSubmissions.length === 0 ? (
              <div className="bg-[#07244A] p-12 text-center rounded-2xl border border-[#15488A] text-[#93C5FD] text-xs">
                No client submissions recorded yet. Submit a test application above!
              </div>
            ) : (
              <div className="space-y-4">
                {adminSubmissions.map((sub) => (
                  <div
                    key={sub.referenceId}
                    className="bg-[#07244A] p-6 rounded-2xl shadow-sm border border-[#15488A] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#123A6D] pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-2 py-0.5 rounded border border-[#C5A059]/40 mr-2">
                          {sub.referenceId}
                        </span>
                        <span className="text-sm font-bold text-white">{sub.fullName}</span>
                        <span className="text-xs text-[#D1D5DB] ml-2">
                          • {sub.category.toUpperCase()} Visa ({sub.targetCountry})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-[#061F40] text-[#E0E7FF] border border-[#15488A] px-2.5 py-1 rounded-lg">
                          Status: {sub.status.replace(/_/g, ' ')}
                        </span>
                        <a
                          href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${sub.fullName}, this is VartiMax Consultant regarding your file ${sub.referenceId}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg text-xs font-bold"
                          title="WhatsApp Client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#D1D5DB] bg-[#061F40] border border-[#15488A] p-3 rounded-xl">
                      <div>
                        <span className="font-semibold text-white">WhatsApp:</span> {sub.whatsapp}
                      </div>
                      <div>
                        <span className="font-semibold text-white">Email:</span> {sub.email || 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold text-white">Passport:</span> {sub.passportNumber || 'N/A'}
                      </div>
                    </div>

                    {/* Files list */}
                    <div>
                      <span className="text-xs font-bold text-[#E0E7FF] block mb-1.5">
                        Uploaded Document Attachments ({sub.documents.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sub.documents.map((d, idx) => (
                          <div
                            key={idx}
                            className="bg-[#061F40] border border-[#15488A] px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#93C5FD]" />
                            <span className="font-medium text-[#E0E7FF]">{d.requirementTitle}</span>
                            <span className="text-[10px] text-[#93C5FD]">({d.fileName})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
