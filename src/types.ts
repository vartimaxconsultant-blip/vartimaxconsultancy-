export type VisaCategory = 'visit' | 'study' | 'employment' | 'umrah';

export interface DocumentRequirement {
  id: string;
  title: string;
  category: VisaCategory;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[]; // e.g. ['PDF', 'JPEG', 'PNG']
  maxSizeMB: number;
  tip?: string;
  cites?: string;
}

export interface UploadedFileDoc {
  requirementId: string;
  requirementTitle: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  previewUrl?: string;
  status: 'pending' | 'verified' | 'action_required';
  adminFeedback?: string;
}

export type VisaApplicationStatus =
  | 'pending_review'
  | 'documents_received'
  | 'document_review'
  | 'file_in_creation'
  | 'ready_for_embassy'
  | 'embassy_submission'
  | 'interview_prep'
  | 'visa_approved';

export interface StageStepInfo {
  stepKey: 'document_review' | 'file_creation' | 'embassy_submission' | 'interview_prep' | 'visa_decision';
  title: string;
  shortDesc: string;
  status: 'completed' | 'current' | 'upcoming';
  dateCompleted?: string;
  actionRequired?: string;
}

export interface ClientApplication {
  referenceId: string; // e.g. VMX-ISB-78219
  fullName: string;
  whatsapp: string;
  email: string;
  category: VisaCategory;
  targetCountry: string;
  intakeDate?: string;
  passportNumber?: string;
  documents: UploadedFileDoc[];
  status: VisaApplicationStatus;
  notes?: string;
  appointmentDate?: string;
  embassyCenter?: string;
  interviewDate?: string;
  assignedConsultant?: {
    name: string;
    phone: string;
    designation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadCaptureData {
  id?: string;
  fullName: string;
  whatsapp: string;
  targetCountry: string;
  visaType: VisaCategory;
  intakeDate: string;
  createdAt?: string;
  syncedToSheets?: boolean;
}

export interface VisaServiceDetail {
  slug: string;
  title: string;
  shortTitle: string;
  category: VisaCategory;
  countries: string[];
  bannerImage: string;
  badge: string;
  acceptanceRate: string;
  processingTime: string;
  stayDuration?: string;
  embassyFee?: string;
  heroHeadline: string;
  heroSubheadline: string;
  description: string;
  whyCrucial: string[];
  highlights?: string[];
  embassyFileChecklist: string[];
  faqs: { question: string; answer: string }[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  city: string;
  countryApplied: string;
  visaType: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface QuickAssessmentInput {
  targetCountry: string;
  visaCategory: VisaCategory;
  employmentStatus: 'salaried' | 'business_owner' | 'student' | 'freelancer' | 'unemployed';
  bankBalancePKR: number;
  bankStatementMonths: number;
  hasPastTravelHistory: boolean;
  hasFbrTaxReturns: boolean;
  hasFamilyInPakistan: boolean;
  englishProficiencyScore?: string;
}

export interface QuickAssessmentResult {
  scorePercentage: number;
  verdict: 'High Acceptance (90%+)' | 'Moderate - Needs File Structuring' | 'Requires Stronger Financials';
  summary: string;
  strengths: string[];
  recommendations: string[];
  customRoadmap: string[];
}

export interface BlogArticleSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  calloutBox?: {
    type: 'tip' | 'warning' | 'info';
    text: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: 'Schengen Visa' | 'Canada Visa' | 'USA Visa' | 'UK Study' | 'Umrah & Saudi' | 'Refusal Solutions';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  tags: string[];
  featuredImage: {
    src: string;
    alt: string;
    title: string;
  };
  keyTakeaways: string[];
  tableOfContents: string[];
  sections: BlogArticleSection[];
  faqs: { question: string; answer: string }[];
  targetCountry: string;
  relatedServiceSlug?: string;
}

export interface AgentNotification {
  id: string;
  type: 'lead_inquiry' | 'document_upload' | 'contact_query' | 'ai_file_request' | 'followup_reminder';
  title: string;
  clientName: string;
  whatsapp: string;
  email?: string;
  targetCountry: string;
  visaType?: string;
  summary: string;
  details?: {
    referenceId?: string;
    intakeDate?: string;
    passportNumber?: string;
    documentsCount?: number;
    documentsList?: string[];
    message?: string;
    agentId?: string;
    leadId?: string;
    daysInactive?: number;
  };
  createdAt: string;
  read: boolean;
  contacted: boolean;
}

export type CRMLeadStatus = 
  | 'new'
  | 'assigned'
  | 'contacted'
  | 'docs_pending'
  | 'embassy_ready'
  | 'in_progress'
  | 'approved'
  | 'rejected';

export type CRMActivityType =
  | 'whatsapp'
  | 'call'
  | 'meeting'
  | 'docs_review'
  | 'embassy_slot'
  | 'note'
  | 'status_change';

export interface LeadActivity {
  id: string;
  leadId: string;
  agentId: string;
  agentName: string;
  type: CRMActivityType;
  note: string;
  timestamp: string;
}

export interface CRMLeadRecord {
  id: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  targetCountry: string;
  visaType: string;
  intakeDate?: string;
  createdAt: string;
  status: CRMLeadStatus;
  assignedAgentId: string; // 'unassigned' or agent ID like 'AGT-01'
  assignedAgentName: string;
  assignedAt?: string;
  priority: 'normal' | 'high' | 'urgent';
  lastActivityAt: string;
  nextFollowUpDate: string;
  isOverdueFollowUp?: boolean;
  daysSinceLastActivity?: number;
  notes?: string;
  activities: LeadActivity[];
  docReferenceId?: string;
}

export interface AgentProfile {
  id: string; // e.g. 'AGT-01', 'ADMIN-01'
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: 'admin' | 'agent';
  pin: string;
  active: boolean;
  createdAt: string;
  assignedLeadsCount?: number;
  completedLeadsCount?: number;
  overdueCount?: number;
}

export interface CRMConfig {
  autoAssignEnabled: boolean;
  followUpIntervalDays: number;
}

export interface CRMStats {
  totalLeads: number;
  unassignedCount: number;
  assignedCount: number;
  inProgressCount: number;
  approvedCount: number;
  overdueFollowUpCount: number;
  totalAgents: number;
  activeAgents: number;
  activitiesToday: number;
}

export interface AgentDailyReport {
  id: string;
  agentId: string;
  agentName: string;
  date: string;
  summary: string;
  callsCount: number;
  whatsAppCount: number;
  docsReviewedCount: number;
  approvalsCount: number;
  challengesFaced?: string;
  tomorrowPlan?: string;
  submittedAt: string;
}

