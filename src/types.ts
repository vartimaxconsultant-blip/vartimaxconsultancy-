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
  status: 'pending_review' | 'documents_received' | 'file_in_creation' | 'ready_for_embassy' | 'visa_approved';
  notes?: string;
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
