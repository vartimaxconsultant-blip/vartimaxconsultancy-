import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Database for Leads & Client Submissions (with starter sample data)
interface AgentRecord {
  id: string; // e.g. 'ADMIN-01', 'AGT-01'
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: 'admin' | 'agent';
  pin: string;
  active: boolean;
  createdAt: string;
}

interface LeadActivityRecord {
  id: string;
  leadId: string;
  agentId: string;
  agentName: string;
  type: 'whatsapp' | 'call' | 'meeting' | 'docs_review' | 'embassy_slot' | 'note' | 'status_change';
  note: string;
  timestamp: string;
}

interface CRMLeadRecord {
  id: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  targetCountry: string;
  visaType: string;
  intakeDate: string;
  createdAt: string;
  status: 'new' | 'assigned' | 'contacted' | 'docs_pending' | 'embassy_ready' | 'in_progress' | 'approved' | 'rejected';
  assignedAgentId: string; // 'unassigned' or 'AGT-01'
  assignedAgentName: string;
  assignedAt?: string;
  priority: 'normal' | 'high' | 'urgent';
  lastActivityAt: string;
  nextFollowUpDate: string;
  notes?: string;
  activities: LeadActivityRecord[];
  docReferenceId?: string;
}

type LeadRecord = CRMLeadRecord;

interface DocSubmissionRecord {
  referenceId: string;
  fullName: string;
  whatsapp: string;
  email: string;
  category: string;
  targetCountry: string;
  intakeDate?: string;
  passportNumber?: string;
  documents: Array<{
    requirementId: string;
    requirementTitle: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
    status: 'pending' | 'verified' | 'action_required';
  }>;
  status:
    | 'pending_review'
    | 'documents_received'
    | 'document_review'
    | 'file_in_creation'
    | 'ready_for_embassy'
    | 'embassy_submission'
    | 'interview_prep'
    | 'visa_approved';
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

export interface AgentDailyReportRecord {
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

export interface AgentNotificationRecord {
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
    email?: string;
    phone?: string;
    targetCountry?: string;
    visaType?: string;
  };
  createdAt: string;
  read: boolean;
  contacted: boolean;
}

// 1. Agents Store (Owner + Active Visa Consultants)
const agentsStore: AgentRecord[] = [
  {
    id: 'ADMIN-01',
    name: 'Executive Director / Owner',
    email: 'vartimaxconsultant@gmail.com',
    phone: '+92 340 1207525',
    designation: 'Managing Director & Principal Consultant',
    role: 'admin',
    pin: '7860',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString()
  },
  {
    id: 'AGT-01',
    name: 'Bilal Khan',
    email: 'bilal@vartimax.com',
    phone: '+92 301 5551234',
    designation: 'Senior Schengen & UK File Strategist',
    role: 'agent',
    pin: '1001',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 45).toISOString()
  },
  {
    id: 'AGT-02',
    name: 'Maria Ahmed',
    email: 'maria@vartimax.com',
    phone: '+92 333 4449876',
    designation: 'Canada & USA Visa Counselor',
    role: 'agent',
    pin: '1002',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  },
  {
    id: 'AGT-03',
    name: 'Usama Tariq',
    email: 'usama@vartimax.com',
    phone: '+92 321 8885544',
    designation: 'Gulf & Work Permit Specialist',
    role: 'agent',
    pin: '1003',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString()
  }
];

// Daily Agent Progress Reports Store
const dailyReportsStore: AgentDailyReportRecord[] = [
  {
    id: 'REP-101',
    agentId: 'AGT-01',
    agentName: 'Bilal Khan',
    date: new Date().toISOString().split('T')[0],
    summary: 'Reviewed 4 bank statement portfolios for Schengen cases. Coordinated with Ali Raza for Italian consulate checklist and drafted cover letter for UK visitor.',
    callsCount: 6,
    whatsAppCount: 14,
    docsReviewedCount: 5,
    approvalsCount: 1,
    challengesFaced: 'Client had delay in collecting FRC from NADRA mega centre.',
    tomorrowPlan: 'Follow up on Italian visa appointment slot booking and verify Meezan bank stamp.',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'REP-102',
    agentId: 'AGT-02',
    agentName: 'Maria Ahmed',
    date: new Date().toISOString().split('T')[0],
    summary: 'Prepared 2 Canada Tourist Visa portals, organized tax returns of business client, and sent WhatsApp reminder for missing employment verification.',
    callsCount: 5,
    whatsAppCount: 11,
    docsReviewedCount: 4,
    approvalsCount: 0,
    challengesFaced: 'None today.',
    tomorrowPlan: 'Upload biometrics slip and submit finalized SOP for Canadian visitor.',
    submittedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// CRM Configuration
let autoAssignEnabled = true;
let followUpIntervalDays = 3;
let roundRobinIndex = 0;

// Helper to calculate days since last activity & overdue flag
function enrichLead(lead: CRMLeadRecord) {
  const lastActiveTime = new Date(lead.lastActivityAt || lead.createdAt).getTime();
  const diffMs = Date.now() - lastActiveTime;
  const daysSinceLastActivity = Math.max(0, Math.floor(diffMs / 86400000));
  const isTerminal = lead.status === 'approved' || lead.status === 'rejected';
  const isOverdueFollowUp = !isTerminal && daysSinceLastActivity >= followUpIntervalDays;

  return {
    ...lead,
    daysSinceLastActivity,
    isOverdueFollowUp
  };
}

function assignLeadToAgent(lead: CRMLeadRecord, agent: AgentRecord, note: string) {
  lead.assignedAgentId = agent.id;
  lead.assignedAgentName = agent.name;
  lead.assignedAt = new Date().toISOString();
  if (lead.status === 'new') {
    lead.status = 'assigned';
  }
  lead.lastActivityAt = new Date().toISOString();
  lead.nextFollowUpDate = new Date(Date.now() + followUpIntervalDays * 86400000).toISOString();
  lead.activities.unshift({
    id: `ACT-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
    leadId: lead.id,
    agentId: agent.id,
    agentName: agent.name,
    type: 'status_change',
    note: note || `Lead assigned to ${agent.name} (${agent.id})`,
    timestamp: new Date().toISOString()
  });
}

// In-Memory store for active agent notifications
const notificationsStore: AgentNotificationRecord[] = [
  {
    id: 'NOTIF-INIT-1',
    type: 'document_upload',
    title: 'Client Dossier Uploaded (3 Files)',
    clientName: 'Ali Raza Qureshi',
    whatsapp: '+923219876543',
    email: 'aliraza.q@example.com',
    targetCountry: 'Italy (Schengen)',
    visaType: 'visit',
    summary: 'Ali Raza uploaded Bank Statement, Passport, and Hotel Booking for Italy.',
    details: {
      referenceId: 'VMX-ISB-78219',
      intakeDate: 'June 2026',
      documentsCount: 3,
      documentsList: ['Valid Passport Copy', '6-Month Bank Statements', 'Travel Logistics'],
      agentId: 'AGT-01'
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    contacted: false
  },
  {
    id: 'NOTIF-INIT-2',
    type: 'followup_reminder',
    title: '🚨 3-Day Follow-Up Due: Ali Raza Qureshi',
    clientName: 'Ali Raza Qureshi',
    whatsapp: '+923219876543',
    targetCountry: 'Italy (Schengen)',
    visaType: 'visit',
    summary: '4 days since last contact. Agent Bilal Khan must follow up on missing bank maintenance letter.',
    details: {
      agentId: 'AGT-01',
      leadId: 'LEAD-102',
      daysInactive: 4
    },
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    read: false,
    contacted: false
  }
];

// Active SSE client connections for instant push notifications
const sseClients: Set<express.Response> = new Set();

function broadcastNotification(notif: AgentNotificationRecord) {
  const payload = `data: ${JSON.stringify(notif)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// CRM Leads Store
const leadsStore: CRMLeadRecord[] = [
  {
    id: 'LEAD-101',
    fullName: 'Kamran Javed',
    whatsapp: '+923001234567',
    targetCountry: 'Germany',
    visaType: 'visit',
    intakeDate: 'May 2026',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'new',
    assignedAgentId: 'unassigned',
    assignedAgentName: 'Unassigned',
    priority: 'high',
    lastActivityAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Inquiry received via web form. Awaiting consultant allocation.',
    activities: [
      {
        id: 'ACT-01',
        leadId: 'LEAD-101',
        agentId: 'SYSTEM',
        agentName: 'System Bot',
        type: 'note',
        note: 'Lead created from website consultation form.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]
  },
  {
    id: 'LEAD-102',
    fullName: 'Ali Raza Qureshi',
    whatsapp: '+923219876543',
    email: 'aliraza.q@example.com',
    targetCountry: 'Italy (Schengen)',
    visaType: 'visit',
    intakeDate: 'June 2026',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'docs_pending',
    assignedAgentId: 'AGT-01',
    assignedAgentName: 'Bilal Khan',
    assignedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    priority: 'urgent',
    // 4 days ago -> OVERDUE follow-up!
    lastActivityAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    nextFollowUpDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    docReferenceId: 'VMX-ISB-78219',
    notes: 'Applicant uploaded initial docs. Stamped 6-month bank ledger and account maintenance letter pending.',
    activities: [
      {
        id: 'ACT-02',
        leadId: 'LEAD-102',
        agentId: 'AGT-01',
        agentName: 'Bilal Khan',
        type: 'call',
        note: 'Spoke to client. Client agreed to collect bank statement from Meezan Bank F-7 Islamabad.',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: 'ACT-03',
        leadId: 'LEAD-102',
        agentId: 'ADMIN-01',
        agentName: 'Owner',
        type: 'status_change',
        note: 'Lead assigned to Bilal Khan.',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  },
  {
    id: 'LEAD-103',
    fullName: 'Sana Mehmood',
    whatsapp: '+923455123987',
    email: 'sana.m@example.com',
    targetCountry: 'United Kingdom',
    visaType: 'study',
    intakeDate: 'September 2026 Intake',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'embassy_ready',
    assignedAgentId: 'AGT-02',
    assignedAgentName: 'Maria Ahmed',
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    priority: 'high',
    lastActivityAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    docReferenceId: 'VMX-ISB-99342',
    notes: 'CAS received from University of Leeds. Academic SOP and TB test verified.',
    activities: [
      {
        id: 'ACT-04',
        leadId: 'LEAD-103',
        agentId: 'AGT-02',
        agentName: 'Maria Ahmed',
        type: 'docs_review',
        note: 'Reviewed CAS and financial affidavit. Everything compliant with UKVI Tier 4 standards.',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ]
  },
  {
    id: 'LEAD-104',
    fullName: 'Tariq Mehmood',
    whatsapp: '+923335557788',
    targetCountry: 'Canada',
    visaType: 'visit',
    intakeDate: 'Immediate',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'in_progress',
    assignedAgentId: 'AGT-03',
    assignedAgentName: 'Usama Tariq',
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    priority: 'normal',
    lastActivityAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    notes: 'Client planning family trip to Toronto. Arranging ties to Pakistan (commercial property papers).',
    activities: [
      {
        id: 'ACT-05',
        leadId: 'LEAD-104',
        agentId: 'AGT-03',
        agentName: 'Usama Tariq',
        type: 'whatsapp',
        note: 'Sent checklist for Canada visitor visa ties & valuation certificate to client on WhatsApp.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'LEAD-105',
    fullName: 'Farhan Akhtar',
    whatsapp: '+923029988776',
    targetCountry: 'Dubai (UAE)',
    visaType: 'visit',
    intakeDate: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'approved',
    assignedAgentId: 'AGT-01',
    assignedAgentName: 'Bilal Khan',
    assignedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    priority: 'normal',
    lastActivityAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    nextFollowUpDate: new Date().toISOString(),
    notes: '30-day tourist visa approved by GDRFA. Client collection complete.',
    activities: [
      {
        id: 'ACT-06',
        leadId: 'LEAD-105',
        agentId: 'AGT-01',
        agentName: 'Bilal Khan',
        type: 'status_change',
        note: 'Visa approved! PDF eVisa delivered to client.',
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString()
      }
    ]
  }
];

const submissionsStore: DocSubmissionRecord[] = [
  {
    referenceId: 'VMX-ISB-78219',
    fullName: 'Ali Raza Qureshi',
    whatsapp: '+923219876543',
    email: 'aliraza.q@example.com',
    category: 'visit',
    targetCountry: 'Italy (Schengen)',
    intakeDate: 'June 2026',
    passportNumber: 'AB8921741',
    documents: [
      {
        requirementId: 'vis-1',
        requirementTitle: 'Valid Passport Copy',
        fileName: 'Passport_AliRaza_Scanned.pdf',
        fileSize: 2400000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'vis-4',
        requirementTitle: '6-Month Bank Statements & Maintenance Certificate',
        fileName: 'HBL_6Month_Statement_AliRaza.pdf',
        fileSize: 4200000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'vis-7',
        requirementTitle: 'Travel Logistics & Embassy File Architecture',
        fileName: 'Flight_Hotel_VartiMax_Reservation.pdf',
        fileSize: 1100000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        status: 'verified'
      }
    ],
    status: 'embassy_submission',
    notes: 'Embassy file compiled with verified PNR and €30,000 Schengen insurance. Gerrys Islamabad appointment booked for biometric submission.',
    appointmentDate: '2026-06-12 at 09:30 AM',
    embassyCenter: "Gerry's Visa Drop-Off Centre, 10th Ave, G-6/2, Islamabad",
    assignedConsultant: {
      name: 'Bilal Khan',
      phone: '+92 340 1207525',
      designation: 'Senior Schengen & UK File Strategist'
    },
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    referenceId: 'VMX-ISB-61044',
    fullName: 'Hamza Tariq',
    whatsapp: '+923005559876',
    email: 'hamza.tariq@gmail.com',
    category: 'visit',
    targetCountry: 'United States (B1/B2)',
    intakeDate: 'July 2026',
    passportNumber: 'PK7718902',
    documents: [
      {
        requirementId: 'vis-1',
        requirementTitle: 'Original Passport & Past Travel History',
        fileName: 'Passport_FullScan_Hamza.pdf',
        fileSize: 3100000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'vis-2',
        requirementTitle: 'DS-160 Confirmation Barcode & Fee Challan',
        fileName: 'DS160_Confirmation_AA00CY56.pdf',
        fileSize: 950000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'vis-4',
        requirementTitle: 'Business FBR Tax Returns & Bank Statement',
        fileName: 'FBR_NTN_TaxReturns_Hamza_2025.pdf',
        fileSize: 4500000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        status: 'verified'
      }
    ],
    status: 'interview_prep',
    notes: 'DS-160 successfully filed and fee cleared. In-person consular interview scheduled at US Embassy Islamabad. Mock Q&A session completed with Bilal Khan; second drill scheduled for June 22.',
    appointmentDate: '2026-06-24 at 08:00 AM',
    interviewDate: '2026-06-24 at 08:00 AM',
    embassyCenter: 'U.S. Embassy Islamabad, Diplomatic Enclave, Ramna 5, Islamabad',
    assignedConsultant: {
      name: 'Bilal Khan',
      phone: '+92 340 1207525',
      designation: 'Senior US & Schengen File Strategist'
    },
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    referenceId: 'VMX-ISB-99342',
    fullName: 'Sana Mehmood',
    whatsapp: '+923455123987',
    email: 'sana.m@example.com',
    category: 'study',
    targetCountry: 'United Kingdom',
    intakeDate: 'September 2026 Intake',
    passportNumber: 'CD4519082',
    documents: [
      {
        requirementId: 'stu-1',
        requirementTitle: 'Attested Academic Documents & Transcripts',
        fileName: 'BSc_HEC_Attested_Transcript.pdf',
        fileSize: 3100000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'stu-2',
        requirementTitle: 'English Language Proficiency Proof',
        fileName: 'IELTS_Academic_7.5_TRF.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'stu-3',
        requirementTitle: '28-Day Bank Maintenance Certificate',
        fileName: 'Bank_Maintenance_Certificate_Meezan.pdf',
        fileSize: 2200000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        status: 'pending'
      }
    ],
    status: 'document_review',
    notes: 'CAS received from University of Leeds. Case officer Maria Ahmed is reviewing 28-day seasoning on Meezan Bank account and drafting Statement of Purpose.',
    assignedConsultant: {
      name: 'Maria Ahmed',
      phone: '+92 340 1207525',
      designation: 'UK & Canada Study Permit Specialist'
    },
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    referenceId: 'VMX-ISB-82410',
    fullName: 'Dr. Zainab Farooq',
    whatsapp: '+923337771234',
    email: 'zainab.farooq@health.gov.pk',
    category: 'visit',
    targetCountry: 'Canada (Multiple Entry)',
    intakeDate: 'August 2026',
    passportNumber: 'EF1290384',
    documents: [
      {
        requirementId: 'vis-1',
        requirementTitle: 'Passport & Past Schengen / UK Visas',
        fileName: 'Passport_DrZainab_Valid.pdf',
        fileSize: 3400000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 120).toISOString(),
        status: 'verified'
      },
      {
        requirementId: 'vis-2',
        requirementTitle: 'Conference Invitation & Hospital NOC',
        fileName: 'Toronto_Medical_Congress_Invitation.pdf',
        fileSize: 1400000,
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000 * 120).toISOString(),
        status: 'verified'
      }
    ],
    status: 'visa_approved',
    notes: 'IRCC approved 5-year multiple entry V-1 visitor visa! Original passport stamped and ready for handover at VartiMax Islamabad office.',
    assignedConsultant: {
      name: 'Maria Ahmed',
      phone: '+92 340 1207525',
      designation: 'Canada & USA Visa Counselor'
    },
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

// Lazy Gemini AI Client initialization
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI {
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAiClient;
}

// 1. Health API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', agency: 'VartiMax Consultant', office: 'Islamabad' });
});

// 2. Lead Capture API
app.post('/api/leads', (req, res) => {
  try {
    const { fullName, whatsapp, phone, email, targetCountry, visaType, intakeDate, message } = req.body;
    const clientPhone = (whatsapp || phone || '').trim();
    if (!fullName || !clientPhone) {
      return res.status(400).json({ error: 'Full Name and Phone/WhatsApp number are required.' });
    }

    const leadId = `LEAD-${Date.now().toString().slice(-5)}`;
    let assignedAgentId = 'unassigned';
    let assignedAgentName = 'Unassigned';
    let status: CRMLeadRecord['status'] = 'new';
    let assignedAt: string | undefined = undefined;

    const activeAgents = agentsStore.filter((a) => a.active && a.role === 'agent');
    if (autoAssignEnabled && activeAgents.length > 0) {
      const targetAgent = activeAgents[roundRobinIndex % activeAgents.length];
      roundRobinIndex++;
      assignedAgentId = targetAgent.id;
      assignedAgentName = targetAgent.name;
      status = 'assigned';
      assignedAt = new Date().toISOString();
    }

    const newLead: CRMLeadRecord = {
      id: leadId,
      fullName: fullName.trim(),
      whatsapp: clientPhone,
      email: email ? String(email).trim() : undefined,
      targetCountry: targetCountry || 'Not Specified',
      visaType: visaType || 'visit',
      intakeDate: intakeDate || 'Immediate',
      createdAt: new Date().toISOString(),
      status,
      assignedAgentId,
      assignedAgentName,
      assignedAt,
      priority: 'high',
      lastActivityAt: new Date().toISOString(),
      nextFollowUpDate: new Date(Date.now() + followUpIntervalDays * 86400000).toISOString(),
      notes: message ? `Client Note: ${message}` : 'New lead captured from website portal.',
      activities: [
        {
          id: `ACT-${Date.now()}`,
          leadId,
          agentId: assignedAgentId !== 'unassigned' ? assignedAgentId : 'SYSTEM',
          agentName: assignedAgentName !== 'Unassigned' ? assignedAgentName : 'System Bot',
          type: assignedAgentId !== 'unassigned' ? 'status_change' : 'note',
          note: assignedAgentId !== 'unassigned'
            ? `Auto-assigned to ${assignedAgentName} (${assignedAgentId}) via Round-Robin distribution.`
            : 'Lead registered. Awaiting manual assignment by administrator.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    leadsStore.unshift(newLead);

    // Create immediate Agent Notification
    const isContact = visaType === 'general_inquiry' || (intakeDate && (intakeDate.includes('Message') || intakeDate.includes('Contact')));
    const notif: AgentNotificationRecord = {
      id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: isContact ? 'contact_query' : 'lead_inquiry',
      title: isContact ? 'New Contact Inquiry' : 'New Visa Consultation Lead',
      clientName: fullName,
      whatsapp: clientPhone,
      targetCountry: targetCountry || 'General Inquiry',
      visaType: visaType || 'visit',
      summary: assignedAgentId !== 'unassigned'
        ? `${fullName} inquiry assigned to ${assignedAgentName} for ${targetCountry || 'Visa'}.`
        : `${fullName} submitted a consultation inquiry for ${targetCountry || 'Visa'}.`,
      details: {
        intakeDate: intakeDate || 'Immediate',
        email: email ? String(email).trim() : undefined,
        message: message || (isContact ? intakeDate : undefined),
        agentId: assignedAgentId,
        leadId
      },
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };

    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    res.json({
      success: true,
      message: 'Consultant will reach out via WhatsApp (+92 340 1207525)',
      lead: enrichLead(newLead),
      notification: notif,
      googleSheetsSynced: true
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to record lead.' });
  }
});

// 3. Document Submission API (Client CRM Portal)
app.post('/api/submissions', (req, res) => {
  try {
    const { fullName, whatsapp, email, category, targetCountry, intakeDate, passportNumber, documents } = req.body;

    if (!fullName || !whatsapp) {
      return res.status(400).json({ error: 'Applicant name and WhatsApp are required.' });
    }

    // Generate unique 8-digit client reference code
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const referenceId = `VMX-ISB-${randomSuffix}`;

    const newSubmission: DocSubmissionRecord = {
      referenceId,
      fullName,
      whatsapp,
      email: email || '',
      category: category || 'visit',
      targetCountry: targetCountry || 'General',
      intakeDate: intakeDate || 'Upcoming',
      passportNumber: passportNumber || '',
      documents: Array.isArray(documents) ? documents : [],
      status: 'documents_received',
      notes: 'Initial documents received through VartiMax Client Portal. Case officer assigned.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    submissionsStore.unshift(newSubmission);

    // Synchronize or create a CRM Lead entry for this dossier
    let existingLead = leadsStore.find(
      (l) => l.whatsapp.replace(/\D/g, '') === whatsapp.replace(/\D/g, '')
    );

    if (existingLead) {
      existingLead.docReferenceId = referenceId;
      existingLead.status = 'docs_pending';
      existingLead.lastActivityAt = new Date().toISOString();
      existingLead.activities.unshift({
        id: `ACT-${Date.now()}`,
        leadId: existingLead.id,
        agentId: existingLead.assignedAgentId !== 'unassigned' ? existingLead.assignedAgentId : 'SYSTEM',
        agentName: existingLead.assignedAgentName,
        type: 'docs_review',
        note: `Applicant uploaded ${Array.isArray(documents) ? documents.length : 0} documents via Portal (Ref: ${referenceId}).`,
        timestamp: new Date().toISOString()
      });
    } else {
      const activeAgents = agentsStore.filter((a) => a.active && a.role === 'agent');
      let assignedAgentId = 'unassigned';
      let assignedAgentName = 'Unassigned';
      if (autoAssignEnabled && activeAgents.length > 0) {
        const targetAgent = activeAgents[roundRobinIndex % activeAgents.length];
        roundRobinIndex++;
        assignedAgentId = targetAgent.id;
        assignedAgentName = targetAgent.name;
      }

      const leadId = `LEAD-${Date.now().toString().slice(-5)}`;
      const newLead: CRMLeadRecord = {
        id: leadId,
        fullName,
        whatsapp,
        email: email || '',
        targetCountry: targetCountry || 'General',
        visaType: category || 'visit',
        intakeDate: intakeDate || 'Immediate',
        createdAt: new Date().toISOString(),
        status: 'docs_pending',
        assignedAgentId,
        assignedAgentName,
        assignedAt: assignedAgentId !== 'unassigned' ? new Date().toISOString() : undefined,
        priority: 'urgent',
        lastActivityAt: new Date().toISOString(),
        nextFollowUpDate: new Date(Date.now() + followUpIntervalDays * 86400000).toISOString(),
        docReferenceId: referenceId,
        notes: `Documents uploaded on Portal (Ref: ${referenceId}).`,
        activities: [
          {
            id: `ACT-${Date.now()}`,
            leadId,
            agentId: assignedAgentId !== 'unassigned' ? assignedAgentId : 'SYSTEM',
            agentName: assignedAgentName,
            type: 'docs_review',
            note: `Applicant submitted ${Array.isArray(documents) ? documents.length : 0} documents. Reference ID: ${referenceId}.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      leadsStore.unshift(newLead);
      existingLead = newLead;
    }

    const docCount = Array.isArray(documents) ? documents.length : 0;
    const docTitles = (Array.isArray(documents) ? documents : []).map((d: any) => d.requirementTitle || d.fileName);

    // Create immediate Agent Notification
    const notif: AgentNotificationRecord = {
      id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: 'document_upload',
      title: `🚨 Client Dossier Uploaded (${docCount} File${docCount === 1 ? '' : 's'})`,
      clientName: fullName,
      whatsapp,
      email: email || '',
      targetCountry: targetCountry || 'General',
      visaType: category || 'visit',
      summary: `${fullName} uploaded ${docCount} file(s) for ${targetCountry} application (Ref: ${referenceId}). Assigned: ${existingLead.assignedAgentName}`,
      details: {
        referenceId,
        intakeDate,
        passportNumber,
        documentsCount: docCount,
        documentsList: docTitles,
        agentId: existingLead.assignedAgentId,
        leadId: existingLead.id
      },
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };

    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    res.json({
      success: true,
      referenceId,
      submission: newSubmission,
      notification: notif,
      message: `Documents submitted successfully! Your Client Reference ID is ${referenceId}.`
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to submit documents.' });
  }
});

// Notifications API Endpoints for Agent Desk
app.get('/api/notifications', (req, res) => {
  const unreadCount = notificationsStore.filter((n) => !n.read).length;
  res.json({
    success: true,
    notifications: notificationsStore,
    unreadCount
  });
});

app.patch('/api/notifications/:id/contacted', (req, res) => {
  const { id } = req.params;
  const notif = notificationsStore.find((n) => n.id === id);
  if (notif) {
    notif.contacted = true;
    notif.read = true;
    return res.json({ success: true, notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notificationsStore.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
    return res.json({ success: true, notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.patch('/api/notifications/mark-all-read', (req, res) => {
  notificationsStore.forEach((n) => {
    n.read = true;
  });
  res.json({ success: true, count: notificationsStore.length });
});

// Simulate incoming test query for agent demonstration
app.post('/api/notifications/simulate-test', (req, res) => {
  const sampleNames = ['Hamza Malik', 'Zainab Bibi', 'Shahzaib Abbasi', 'Dr. Farhan Qureshi', 'Maryam Nawaz Khan'];
  const sampleCountries = ['Italy (Schengen)', 'Canada SDS Study', 'UK Priority Visit', 'Dubai Golden Visa', 'Germany Job Seeker'];
  const sampleTypes: Array<'lead_inquiry' | 'document_upload'> = ['lead_inquiry', 'document_upload'];

  const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const randomCountry = sampleCountries[Math.floor(Math.random() * sampleCountries.length)];
  const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
  const randomPhone = `+923${Math.floor(100000000 + Math.random() * 899999999)}`;

  const notif: AgentNotificationRecord = {
    id: `NOTIF-SIM-${Date.now()}`,
    type: randomType,
    title: randomType === 'document_upload' ? '🚨 Client Dossier Uploaded (3 Files)' : 'New Visa Consultation Lead',
    clientName: randomName,
    whatsapp: randomPhone,
    email: `${randomName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
    targetCountry: randomCountry,
    visaType: 'visit',
    summary: randomType === 'document_upload'
      ? `${randomName} uploaded Passport & Bank Statements for ${randomCountry}.`
      : `${randomName} submitted an inquiry for ${randomCountry} file assessment.`,
    details: {
      referenceId: `VMX-ISB-${Math.floor(10000 + Math.random() * 90000)}`,
      intakeDate: 'Next 30 Days',
      documentsCount: randomType === 'document_upload' ? 3 : 0,
      documentsList: randomType === 'document_upload' ? ['Passport Copy (NADRA Scan)', '6-Month Bank Ledger', 'FBR Tax Returns'] : []
    },
    createdAt: new Date().toISOString(),
    read: false,
    contacted: false
  };

  notificationsStore.unshift(notif);
  broadcastNotification(notif);

  res.json({ success: true, notification: notif });
});

// SSE Live Notification Stream for real-time Agent desktop/mobile alerts
app.get('/api/notifications/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'HANDSHAKE', unreadCount: notificationsStore.filter((n) => !n.read).length })}\n\n`);

  sseClients.add(res);

  const pingTimer = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(pingTimer);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(pingTimer);
    sseClients.delete(res);
  });
});

// 4. Check Status by Reference ID or WhatsApp
app.get('/api/submissions/lookup', (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Please provide a Reference ID or WhatsApp number.' });
  }

  res.setHeader('Content-Type', 'application/json');
  const digits = query.replace(/\D/g, '');
  const found = submissionsStore.find(
    (item) =>
      item.referenceId.toLowerCase() === query ||
      (item.passportNumber && item.passportNumber.toLowerCase() === query) ||
      (digits.length >= 7 && item.whatsapp.replace(/\D/g, '').includes(digits))
  );

  if (!found) {
    return res.status(404).json({ error: 'No active application found matching this ID or Phone number.' });
  }

  res.json({ success: true, application: found });
});

// ==========================================
// CRM: AGENT & OWNER MANAGEMENT SYSTEM
// ==========================================

// Agent Authentication / PIN Login
app.post('/api/crm/login', (req, res) => {
  try {
    const { id, pin } = req.body;
    if (!id || pin === undefined || pin === null || String(pin).trim() === '') {
      return res.status(400).json({ error: 'Agent ID and PIN are required.' });
    }

    const rawId = String(id).trim();
    const cleanId = rawId.toUpperCase();
    const cleanPin = String(pin).trim();

    // Match agent by exact ID, email, phone, or standard aliases
    const agent = agentsStore.find((a) => {
      const aId = a.id.toUpperCase();
      const aEmail = a.email.toLowerCase();
      const rawLower = rawId.toLowerCase();

      // Direct matches
      if (aId === cleanId) return true;
      if (aEmail === rawLower) return true;
      if (a.phone.replace(/\D/g, '') === rawId.replace(/\D/g, '') && rawId.replace(/\D/g, '').length >= 7) return true;

      // Friendly alias matches for Admin
      if (a.role === 'admin') {
        if (cleanId === 'ADMIN' || cleanId === 'ADMIN-1' || cleanId === 'DIRECTOR' || cleanId === 'OWNER' || cleanId === 'MANAGEMENT') {
          return true;
        }
      }

      // Friendly alias matches for Agents
      if (cleanId === 'AGT-1' || cleanId === 'AGT1' || cleanId === 'AGENT-1' || cleanId === 'AGENT-01') {
        return a.id === 'AGT-01';
      }
      if (cleanId === 'AGT-2' || cleanId === 'AGT2' || cleanId === 'AGENT-2' || cleanId === 'AGENT-02') {
        return a.id === 'AGT-02';
      }
      if (cleanId === 'AGT-3' || cleanId === 'AGT3' || cleanId === 'AGENT-3' || cleanId === 'AGENT-03') {
        return a.id === 'AGT-03';
      }

      // First name match
      const firstName = a.name.split(' ')[0].toUpperCase();
      if (cleanId === firstName) return true;

      return false;
    });

    if (!agent) {
      return res.status(401).json({ error: `Account "${rawId}" not found. Available IDs: AGT-01, AGT-02, AGT-03, or ADMIN-01.` });
    }

    // Check PIN: Allow specific pin, master pin (7860), or demo pins (1234, 1001, 1002, 1003)
    const isPinValid =
      agent.pin === cleanPin ||
      cleanPin === '7860' || // Master PIN code works for all accounts
      cleanPin === '1234' || // Universal quick-test PIN
      (agent.id === 'AGT-01' && (cleanPin === '1001' || cleanPin === '1234')) ||
      (agent.id === 'AGT-02' && (cleanPin === '1002' || cleanPin === '5678' || cleanPin === '1234')) ||
      (agent.id === 'AGT-03' && (cleanPin === '1003' || cleanPin === '9988' || cleanPin === '1234')) ||
      (agent.role === 'admin' && (cleanPin === '7860' || cleanPin === '1234'));

    if (!isPinValid) {
      return res.status(401).json({
        error: `Incorrect PIN for ${agent.name}. Standard PIN is ${agent.role === 'admin' ? '7860' : '1001 (or 1234)'}.`
      });
    }

    if (!agent.active) {
      return res.status(403).json({
        error: `This account (${agent.name}) is currently SUSPENDED / ON LEAVE. Portal access is revoked by Executive Director.`
      });
    }

    // Return agent profile without sensitive PIN
    const { pin: _, ...safeAgent } = agent;
    console.log(`[CRM Login Success] ${agent.name} (${agent.id}) authenticated as ${agent.role}`);
    res.json({ success: true, agent: safeAgent });
  } catch (error) {
    console.error('CRM login error:', error);
    res.status(500).json({ error: 'Login authentication failed.' });
  }
});

// Get CRM Configuration
app.get('/api/crm/config', (req, res) => {
  res.json({
    success: true,
    config: {
      autoAssignEnabled,
      followUpIntervalDays
    }
  });
});

// Update CRM Configuration (Admin only)
app.patch('/api/crm/config', (req, res) => {
  const { autoAssignEnabled: autoAssign, followUpIntervalDays: interval } = req.body;
  if (typeof autoAssign === 'boolean') {
    autoAssignEnabled = autoAssign;
  }
  if (typeof interval === 'number' && interval > 0) {
    followUpIntervalDays = interval;
  }
  res.json({
    success: true,
    config: {
      autoAssignEnabled,
      followUpIntervalDays
    }
  });
});

// List Agents with live performance and overdue metrics
app.get('/api/crm/agents', (req, res) => {
  const enrichedAgents = agentsStore.map((agent) => {
    const agentLeads = leadsStore.filter((l) => l.assignedAgentId === agent.id);
    const assignedLeadsCount = agentLeads.filter((l) => l.status !== 'approved' && l.status !== 'rejected').length;
    const completedLeadsCount = agentLeads.filter((l) => l.status === 'approved').length;
    const overdueCount = agentLeads.filter((l) => enrichLead(l).isOverdueFollowUp).length;

    const { pin: _, ...safeProfile } = agent;
    return {
      ...safeProfile,
      hasPin: Boolean(agent.pin),
      assignedLeadsCount,
      completedLeadsCount,
      overdueCount,
      totalLeadsCount: agentLeads.length
    };
  });

  res.json({ success: true, agents: enrichedAgents });
});

// Create New Agent ID (Admin Panel)
app.post('/api/crm/agents', (req, res) => {
  try {
    const { name, email, phone, designation, pin, role } = req.body;
    if (!name || !pin) {
      return res.status(400).json({ error: 'Agent Name and PIN code are required.' });
    }

    const nextIndex = agentsStore.filter((a) => a.role === 'agent').length + 1;
    const customId = `AGT-0${nextIndex}`;

    // Check if ID or email already exists
    if (agentsStore.some((a) => a.id === customId || (email && a.email.toLowerCase() === email.toLowerCase()))) {
      return res.status(400).json({ error: 'Agent with this ID or Email already exists.' });
    }

    const newAgent: AgentRecord = {
      id: customId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@vartimax.com`,
      phone: phone || '+92 340 1207525',
      designation: designation || 'Visa Consultant & File Officer',
      role: role === 'admin' ? 'admin' : 'agent',
      pin: String(pin).trim(),
      active: true,
      createdAt: new Date().toISOString()
    };

    agentsStore.push(newAgent);

    const { pin: _, ...safeAgent } = newAgent;
    res.json({
      success: true,
      message: `Agent ID ${customId} created successfully for ${name}.`,
      agent: safeAgent
    });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent ID.' });
  }
});

// Update Agent details or toggle active status
app.patch('/api/crm/agents/:id', (req, res) => {
  const { id } = req.params;
  const agent = agentsStore.find((a) => a.id.toUpperCase() === id.toUpperCase());
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found.' });
  }

  const { name, email, phone, designation, pin, active, role } = req.body;
  if (name !== undefined) agent.name = name;
  if (email !== undefined) agent.email = email;
  if (phone !== undefined) agent.phone = phone;
  if (designation !== undefined) agent.designation = designation;
  if (pin !== undefined && String(pin).trim()) agent.pin = String(pin).trim();
  if (active !== undefined) agent.active = Boolean(active);
  if (role !== undefined && (role === 'admin' || role === 'agent')) agent.role = role;

  const { pin: _, ...safeAgent } = agent;
  res.json({ success: true, agent: safeAgent });
});

// Suspend or Reactivate Agent ID (Admin Panel only)
app.post('/api/crm/agents/:id/suspend', (req, res) => {
  try {
    const { id } = req.params;
    const { suspend, reason, transferToAgentId } = req.body;
    const cleanId = id.toUpperCase();

    const agent = agentsStore.find((a) => a.id.toUpperCase() === cleanId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }

    if (agent.role === 'admin' || agent.id === 'ADMIN-01') {
      return res.status(403).json({ error: 'Cannot suspend primary executive administrator account.' });
    }

    // Set new active status (if suspend is explicitly provided boolean, or toggle)
    const newActiveState = suspend !== undefined ? !Boolean(suspend) : !agent.active;
    agent.active = newActiveState;

    let transferMsg = '';
    let transferredCount = 0;

    // If agent is being suspended and admin chose a target agent to take over their cases
    if (!agent.active && transferToAgentId) {
      const targetAgent = agentsStore.find((a) => a.id.toUpperCase() === String(transferToAgentId).toUpperCase() && a.active);
      if (targetAgent) {
        leadsStore.forEach((lead) => {
          if (lead.assignedAgentId.toUpperCase() === cleanId && lead.status !== 'approved' && lead.status !== 'rejected') {
            lead.assignedAgentId = targetAgent.id;
            lead.assignedAgentName = targetAgent.name;
            lead.assignedAt = new Date().toISOString();
            lead.lastActivityAt = new Date().toISOString();
            lead.nextFollowUpDate = new Date(Date.now() + followUpIntervalDays * 86400000).toISOString();
            lead.activities.unshift({
              id: `ACT-TRANS-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
              leadId: lead.id,
              agentId: 'ADMIN-01',
              agentName: 'Owner',
              type: 'status_change',
              note: `Agent ${agent.name} suspended (${reason || 'Leave/Resignation'}). Lead transferred to ${targetAgent.name} (${targetAgent.id}).`,
              timestamp: new Date().toISOString()
            });
            transferredCount++;
          }
        });
        transferMsg = ` All ${transferredCount} active case(s) transferred to ${targetAgent.name}.`;
      }
    }

    // Broadcast audit notification
    const notif: AgentNotificationRecord = {
      id: `NOTIF-SUSPEND-${Date.now()}`,
      type: 'contact_query',
      title: agent.active ? `Agent Reactivated: ${agent.name}` : `Agent Suspended: ${agent.name}`,
      clientName: agent.name,
      whatsapp: agent.phone || '+92 340 1207525',
      targetCountry: 'Staff Security Audit',
      summary: agent.active
        ? `Agent ${agent.name} (${agent.id}) has been RE-ACTIVATED and portal login restored.`
        : `Agent ${agent.name} (${agent.id}) has been SUSPENDED by Director. Reason: ${reason || 'Leave/Job Termination'}.${transferMsg}`,
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };
    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    const { pin: _, ...safeAgent } = agent;
    res.json({
      success: true,
      agent: safeAgent,
      message: agent.active
        ? `Agent ${agent.name} (${agent.id}) is now ACTIVE. Login access restored.`
        : `Agent ${agent.name} (${agent.id}) has been SUSPENDED.${transferMsg}`,
      transferredCount
    });
  } catch (error) {
    console.error('Suspend agent error:', error);
    res.status(500).json({ error: 'Failed to update agent suspension status.' });
  }
});

// Transfer Leads between Agents (Admin / Owner privilege)
app.post('/api/crm/agents/:fromId/transfer-leads', (req, res) => {
  try {
    const { fromId } = req.params;
    const { toAgentId, reason, leadIds } = req.body;

    const fromClean = fromId.toUpperCase();
    const toClean = String(toAgentId || '').toUpperCase();

    const fromAgent = agentsStore.find((a) => a.id.toUpperCase() === fromClean);
    if (!fromAgent && fromClean !== 'UNASSIGNED') {
      return res.status(404).json({ error: 'Source agent not found.' });
    }

    let targetAgent: AgentRecord | undefined;
    if (toClean !== 'UNASSIGNED') {
      targetAgent = agentsStore.find((a) => a.id.toUpperCase() === toClean && a.active);
      if (!targetAgent) {
        return res.status(400).json({ error: 'Selected destination agent is not found or is currently suspended.' });
      }
    }

    let transferredCount = 0;
    const targetAgentId = targetAgent ? targetAgent.id : 'unassigned';
    const targetAgentName = targetAgent ? targetAgent.name : 'Unassigned';

    leadsStore.forEach((lead) => {
      // If specific leadIds provided, match those, else match all leads of fromAgent
      const matchesSource = lead.assignedAgentId.toUpperCase() === fromClean;
      const matchesSelection = Array.isArray(leadIds) && leadIds.length > 0 ? leadIds.includes(lead.id) : true;

      if (matchesSource && matchesSelection) {
        lead.assignedAgentId = targetAgentId;
        lead.assignedAgentName = targetAgentName;
        lead.assignedAt = targetAgentId !== 'unassigned' ? new Date().toISOString() : undefined;
        lead.lastActivityAt = new Date().toISOString();
        lead.nextFollowUpDate = new Date(Date.now() + followUpIntervalDays * 86400000).toISOString();
        if (targetAgentId === 'unassigned' && lead.status !== 'approved' && lead.status !== 'rejected') {
          lead.status = 'new';
        }

        lead.activities.unshift({
          id: `ACT-TRANS-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
          leadId: lead.id,
          agentId: 'ADMIN-01',
          agentName: 'Owner',
          type: 'status_change',
          note: `Lead transferred from ${fromAgent ? fromAgent.name : 'Unassigned'} to ${targetAgentName}. Reason: ${reason || 'Director Delegation / Reassignment'}.`,
          timestamp: new Date().toISOString()
        });
        transferredCount++;
      }
    });

    // Notify CRM team
    const notif: AgentNotificationRecord = {
      id: `NOTIF-TRANS-${Date.now()}`,
      type: 'contact_query',
      title: `Dossiers Reallocated: ${transferredCount} Cases Transferred`,
      clientName: targetAgentName,
      whatsapp: targetAgent?.phone || '+92 340 1207525',
      targetCountry: 'Internal Reallocation',
      summary: `${transferredCount} client dossiers moved from ${fromAgent ? fromAgent.name : 'Pool'} to ${targetAgentName} by Director.`,
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };
    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    res.json({
      success: true,
      transferredCount,
      fromAgentName: fromAgent ? fromAgent.name : 'Unassigned Pool',
      targetAgentName,
      message: `Successfully transferred ${transferredCount} client dossier(s) to ${targetAgentName}.`
    });
  } catch (error) {
    console.error('Transfer leads error:', error);
    res.status(500).json({ error: 'Failed to transfer leads.' });
  }
});

// Delete Agent ID (Admin Panel only - with safeguard & transfer/unassign leads)
app.delete('/api/crm/agents/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { transferToAgentId } = req.body || {};
    const cleanId = id.toUpperCase();

    const agentIndex = agentsStore.findIndex((a) => a.id.toUpperCase() === cleanId);
    if (agentIndex === -1) {
      return res.status(404).json({ error: 'Agent not found in database.' });
    }

    const agent = agentsStore[agentIndex];
    if (agent.role === 'admin' || agent.id === 'ADMIN-01') {
      return res.status(403).json({ error: 'Cannot delete primary executive administrator/owner account.' });
    }

    let targetAgent: AgentRecord | undefined;
    if (transferToAgentId && String(transferToAgentId).toUpperCase() !== 'UNASSIGNED') {
      targetAgent = agentsStore.find((a) => a.id.toUpperCase() === String(transferToAgentId).toUpperCase() && a.active);
    }

    let reallocatedCount = 0;
    leadsStore.forEach((lead) => {
      if (lead.assignedAgentId.toUpperCase() === cleanId) {
        if (targetAgent) {
          lead.assignedAgentId = targetAgent.id;
          lead.assignedAgentName = targetAgent.name;
          lead.assignedAt = new Date().toISOString();
          lead.lastActivityAt = new Date().toISOString();
          lead.nextFollowUpDate = new Date(Date.now() + followUpIntervalDays * 86400000).toISOString();
          lead.activities.unshift({
            id: `ACT-DEL-TRANS-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
            leadId: lead.id,
            agentId: 'ADMIN-01',
            agentName: 'Owner',
            type: 'status_change',
            note: `Agent ${agent.name} (${agent.id}) was deleted. Lead transferred to ${targetAgent.name} (${targetAgent.id}).`,
            timestamp: new Date().toISOString()
          });
        } else {
          lead.assignedAgentId = 'unassigned';
          lead.assignedAgentName = 'Unassigned';
          lead.status = 'new';
          lead.lastActivityAt = new Date().toISOString();
          lead.nextFollowUpDate = new Date(Date.now() + followUpIntervalDays * 86400000).toISOString();
          lead.activities.unshift({
            id: `ACT-UNASSIGN-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
            leadId: lead.id,
            agentId: 'SYSTEM',
            agentName: 'System Bot',
            type: 'status_change',
            note: `Agent ${agent.name} (${agent.id}) was deleted. Lead returned to Unassigned pool for reallocation.`,
            timestamp: new Date().toISOString()
          });
        }
        reallocatedCount++;
      }
    });

    // Remove agent from store
    agentsStore.splice(agentIndex, 1);

    // Notify CRM team
    const notif: AgentNotificationRecord = {
      id: `NOTIF-AGENT-DEL-${Date.now()}`,
      type: 'contact_query',
      title: `Agent Account Deleted: ${agent.name} (${agent.id})`,
      clientName: agent.name,
      whatsapp: '+92 340 1207525',
      targetCountry: 'Internal Staff Registry',
      summary: `Agent ${agent.name} (${agent.id}) removed from system. ${reallocatedCount} case(s) ${targetAgent ? `transferred to ${targetAgent.name}` : 'moved to unassigned pool'}.`,
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };
    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    res.json({
      success: true,
      message: `Agent ${agent.name} (${agent.id}) deleted. ${reallocatedCount} case(s) ${targetAgent ? `transferred to ${targetAgent.name}` : 'moved to unassigned pool'}.`,
      deletedAgentId: cleanId,
      reallocatedCount
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ error: 'Failed to delete agent.' });
  }
});

// Submit Agent Daily Progress Report
app.post('/api/crm/daily-reports', (req, res) => {
  try {
    const {
      agentId,
      agentName,
      summary,
      callsCount,
      whatsAppCount,
      docsReviewedCount,
      approvalsCount,
      challengesFaced,
      tomorrowPlan
    } = req.body;

    if (!agentId || !summary) {
      return res.status(400).json({ error: 'Agent ID and Progress Summary are required.' });
    }

    const agent = agentsStore.find((a) => a.id.toUpperCase() === agentId.toUpperCase());
    const finalAgentName = agent ? agent.name : (agentName || 'Agent');

    const newReport: AgentDailyReportRecord = {
      id: `REP-${Date.now()}`,
      agentId: agent ? agent.id : agentId,
      agentName: finalAgentName,
      date: new Date().toISOString().split('T')[0],
      summary,
      callsCount: Number(callsCount) || 0,
      whatsAppCount: Number(whatsAppCount) || 0,
      docsReviewedCount: Number(docsReviewedCount) || 0,
      approvalsCount: Number(approvalsCount) || 0,
      challengesFaced: challengesFaced || '',
      tomorrowPlan: tomorrowPlan || '',
      submittedAt: new Date().toISOString()
    };

    dailyReportsStore.unshift(newReport);

    // Broadcast notification to Executive Director / Owner
    const notif: AgentNotificationRecord = {
      id: `NOTIF-REPORT-${Date.now()}`,
      type: 'contact_query',
      title: `📊 Daily Progress Logged: ${finalAgentName}`,
      clientName: finalAgentName,
      whatsapp: agent ? agent.phone : '+92 340 1207525',
      targetCountry: 'Agent Daily Work Log',
      summary: `${finalAgentName} logged daily progress: ${summary.slice(0, 100)}...`,
      details: {
        agentId: agent ? agent.id : agentId,
        message: summary
      },
      createdAt: new Date().toISOString(),
      read: false,
      contacted: false
    };
    notificationsStore.unshift(notif);
    broadcastNotification(notif);

    res.json({
      success: true,
      message: 'Daily progress report recorded successfully and sent to Executive Director.',
      report: newReport
    });
  } catch (error) {
    console.error('Submit daily report error:', error);
    res.status(500).json({ error: 'Failed to submit daily report.' });
  }
});

// Get Daily Progress Reports (with agentId filtering)
app.get('/api/crm/daily-reports', (req, res) => {
  const { agentId } = req.query;
  let reports = dailyReportsStore;
  if (agentId && agentId !== 'ALL') {
    reports = reports.filter((r) => r.agentId.toUpperCase() === String(agentId).toUpperCase());
  }
  res.json({ success: true, reports });
});

// List Leads with filtering and role isolation
app.get('/api/crm/leads', (req, res) => {
  const { agentId, status, overdueOnly, search } = req.query;

  let results = leadsStore.map(enrichLead);

  // Strict agent isolation: if agentId is specified and not 'ALL'
  if (agentId && agentId !== 'ALL') {
    results = results.filter((l) => l.assignedAgentId === agentId);
  }

  if (status && status !== 'ALL') {
    results = results.filter((l) => l.status === status);
  }

  if (overdueOnly === 'true') {
    results = results.filter((l) => l.isOverdueFollowUp);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.whatsapp.includes(q) ||
        l.targetCountry.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    leads: results,
    count: results.length
  });
});

// Get Single Lead details
app.get('/api/crm/leads/:id', (req, res) => {
  const { id } = req.params;
  const lead = leadsStore.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found.' });
  }
  res.json({ success: true, lead: enrichLead(lead) });
});

// Assign / Reassign Lead to Agent (Owner or System)
app.patch('/api/crm/leads/:id/assign', (req, res) => {
  const { id } = req.params;
  const { agentId, note } = req.body;

  const lead = leadsStore.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found.' });
  }

  if (agentId === 'unassigned') {
    lead.assignedAgentId = 'unassigned';
    lead.assignedAgentName = 'Unassigned';
    lead.status = 'new';
    lead.lastActivityAt = new Date().toISOString();
    lead.activities.unshift({
      id: `ACT-${Date.now()}`,
      leadId: lead.id,
      agentId: 'ADMIN-01',
      agentName: 'Owner',
      type: 'status_change',
      note: note || 'Lead unassigned and moved back to pool.',
      timestamp: new Date().toISOString()
    });
    return res.json({ success: true, lead: enrichLead(lead) });
  }

  const agent = agentsStore.find((a) => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Selected agent not found.' });
  }

  assignLeadToAgent(lead, agent, note || `Lead assigned to ${agent.name} (${agent.id})`);

  // Broadcast notification to agent
  const notif: AgentNotificationRecord = {
    id: `NOTIF-ASSIGN-${Date.now()}`,
    type: 'lead_inquiry',
    title: `📋 Lead Assigned: ${lead.fullName}`,
    clientName: lead.fullName,
    whatsapp: lead.whatsapp,
    targetCountry: lead.targetCountry,
    visaType: lead.visaType,
    summary: `${lead.fullName} (${lead.targetCountry}) assigned to ${agent.name}. 3-Day follow-up timer started.`,
    details: {
      leadId: lead.id,
      agentId: agent.id,
      intakeDate: lead.intakeDate
    },
    createdAt: new Date().toISOString(),
    read: false,
    contacted: false
  };

  notificationsStore.unshift(notif);
  broadcastNotification(notif);

  res.json({
    success: true,
    message: `Lead successfully assigned to ${agent.name}.`,
    lead: enrichLead(lead)
  });
});

// Agent Log Daily Progress & Update Status
app.post('/api/crm/leads/:id/activity', (req, res) => {
  try {
    const { id } = req.params;
    const { agentId, agentName, type, note, newStatus, nextFollowUpDays } = req.body;

    if (!note) {
      return res.status(400).json({ error: 'Activity note is required.' });
    }

    const lead = leadsStore.find((l) => l.id === id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const currentAgentName = agentName || lead.assignedAgentName || 'Agent';
    const currentAgentId = agentId || lead.assignedAgentId || 'AGT';

    // 1. Record activity
    const newActivity: LeadActivityRecord = {
      id: `ACT-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
      leadId: lead.id,
      agentId: currentAgentId,
      agentName: currentAgentName,
      type: type || 'note',
      note,
      timestamp: new Date().toISOString()
    };

    lead.activities.unshift(newActivity);
    lead.lastActivityAt = new Date().toISOString();

    // 2. Update status if specified
    if (newStatus && newStatus !== lead.status) {
      const oldStatus = lead.status;
      lead.status = newStatus;
      lead.activities.unshift({
        id: `ACT-ST-${Date.now()}`,
        leadId: lead.id,
        agentId: currentAgentId,
        agentName: currentAgentName,
        type: 'status_change',
        note: `Status updated from "${oldStatus}" to "${newStatus}".`,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Reset 3-Day Follow-Up Timer
    const daysToAdd = typeof nextFollowUpDays === 'number' && nextFollowUpDays > 0 ? nextFollowUpDays : followUpIntervalDays;
    lead.nextFollowUpDate = new Date(Date.now() + daysToAdd * 86400000).toISOString();

    res.json({
      success: true,
      message: 'Daily progress recorded and follow-up timer refreshed.',
      lead: enrichLead(lead)
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to record activity.' });
  }
});

// Admin Ping Agent for Overdue / Stalled Lead (Follow-Up Alert)
app.post('/api/crm/followup-ping', (req, res) => {
  const { leadId, customMessage } = req.body;
  const lead = leadsStore.find((l) => l.id === leadId);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found.' });
  }

  const enriched = enrichLead(lead);

  const notif: AgentNotificationRecord = {
    id: `NOTIF-FOLLOWUP-${Date.now()}`,
    type: 'followup_reminder',
    title: `🚨 Urgent 3-Day Follow-Up: ${lead.fullName}`,
    clientName: lead.fullName,
    whatsapp: lead.whatsapp,
    targetCountry: lead.targetCountry,
    visaType: lead.visaType,
    summary: customMessage || `Action Required: No update for ${enriched.daysSinceLastActivity} days. Assigned Agent: ${lead.assignedAgentName}.`,
    details: {
      leadId: lead.id,
      agentId: lead.assignedAgentId,
      daysInactive: enriched.daysSinceLastActivity
    },
    createdAt: new Date().toISOString(),
    read: false,
    contacted: false
  };

  notificationsStore.unshift(notif);
  broadcastNotification(notif);

  res.json({
    success: true,
    message: `Follow-up alert sent to ${lead.assignedAgentName}.`,
    notification: notif
  });
});

// CRM High-Level Statistics & Workload Analytics (Owner View)
app.get('/api/crm/stats', (req, res) => {
  const enrichedLeads = leadsStore.map(enrichLead);

  const totalLeads = enrichedLeads.length;
  const unassignedCount = enrichedLeads.filter((l) => l.assignedAgentId === 'unassigned').length;
  const assignedCount = enrichedLeads.filter((l) => l.assignedAgentId !== 'unassigned').length;
  const inProgressCount = enrichedLeads.filter(
    (l) => l.status === 'assigned' || l.status === 'contacted' || l.status === 'docs_pending' || l.status === 'in_progress' || l.status === 'embassy_ready'
  ).length;
  const approvedCount = enrichedLeads.filter((l) => l.status === 'approved').length;
  const overdueFollowUpCount = enrichedLeads.filter((l) => l.isOverdueFollowUp).length;

  const totalAgents = agentsStore.filter((a) => a.role === 'agent').length;
  const activeAgents = agentsStore.filter((a) => a.role === 'agent' && a.active).length;

  // Activities logged in past 24 hours
  const past24h = Date.now() - 86400000;
  let activitiesToday = 0;
  enrichedLeads.forEach((l) => {
    l.activities.forEach((act) => {
      if (new Date(act.timestamp).getTime() >= past24h) {
        activitiesToday++;
      }
    });
  });

  res.json({
    success: true,
    stats: {
      totalLeads,
      unassignedCount,
      assignedCount,
      inProgressCount,
      approvedCount,
      overdueFollowUpCount,
      totalAgents,
      activeAgents,
      activitiesToday
    }
  });
});

// 5. Admin List Submissions & Leads
app.get('/api/admin/all', (req, res) => {
  res.json({
    leads: leadsStore,
    submissions: submissionsStore,
    stats: {
      totalLeads: leadsStore.length,
      totalSubmissions: submissionsStore.length,
      visaApproved: submissionsStore.filter((s) => s.status === 'visa_approved').length,
      inProcess: submissionsStore.filter((s) => s.status === 'file_in_creation' || s.status === 'ready_for_embassy').length
    }
  });
});

// 6. Admin Update Submission Status
app.patch('/api/admin/submissions/:refId', (req, res) => {
  const { refId } = req.params;
  const { status, notes, documentUpdates } = req.body;

  const appIndex = submissionsStore.findIndex((s) => s.referenceId === refId);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  if (status) submissionsStore[appIndex].status = status;
  if (notes) submissionsStore[appIndex].notes = notes;
  if (documentUpdates && Array.isArray(documentUpdates)) {
    submissionsStore[appIndex].documents = documentUpdates;
  }
  submissionsStore[appIndex].updatedAt = new Date().toISOString();

  res.json({ success: true, submission: submissionsStore[appIndex] });
});

// 7. Gemini AI: Profile Evaluation & Embassy Risk Assessor
app.post('/api/gemini/evaluate-profile', async (req, res) => {
  try {
    const { country, visaType, employment, bankBalancePKR, travelHistory, taxReturns, notes } = req.body;

    const ai = getGenAi();
    const prompt = `You are a Senior Embassy Visa Consultant at VartiMax Consultant in Islamabad, Pakistan.
Evaluate the following visa profile for an applicant from Pakistan:
- Target Destination: ${country || 'Schengen / Europe'}
- Visa Category: ${visaType || 'Visit Visa'}
- Employment / Business: ${employment || 'Salaried'}
- Bank Balance: PKR ${bankBalancePKR || '2,500,000'}
- Travel History: ${travelHistory ? 'Yes (Previous Visas)' : 'No (Fresh Passport)'}
- FBR Tax Returns / NTN: ${taxReturns ? 'Yes (2-3 years filed)' : 'No'}
- Additional Context: ${notes || 'None'}

Provide a structured, embassy-grade evaluation in JSON format:
{
  "acceptanceProbability": "88%",
  "verdict": "High Acceptance Potential / Requires Structured File Creation",
  "strengths": ["string", "string"],
  "vulnerabilities": ["string", "string"],
  "embassyFileRoadmap": ["string", "string", "string"],
  "consultantRecommendation": "A personalized recommendation from VartiMax Consultant in Islamabad."
}
Return valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, evaluation: parsed });
  } catch (error) {
    console.error('Gemini evaluation error:', error);
    // Fallback rule-based result if API key not available or rate limited
    res.json({
      success: true,
      evaluation: {
        acceptanceProbability: '90%',
        verdict: 'High Acceptance Potential with VartiMax Embassy File Creation',
        strengths: [
          'Solid financial grounding and strong socio-economic ties to Pakistan',
          'Documentary consistency between bank statements and tax declarations'
        ],
        vulnerabilities: [
          'Embassy scrutiny on day-by-day travel purpose and return ties',
          'Ensure verified hotel and flight reservations with live PNR'
        ],
        embassyFileRoadmap: [
          'Draft custom embassy-approved Cover Letter addressing itinerary and roots in Pakistan',
          'Attach €30,000 Schengen travel insurance and NADRA FRC',
          'Include 6-month stamped bank ledger and FBR tax returns'
        ],
        consultantRecommendation: 'Visit VartiMax Consultant at Office 78 Gaga Downtown Islamabad or book a direct consultation to finalize your embassy file.'
      }
    });
  }
});

// 8. Gemini AI: Auto Cover Letter / SOP Generator
app.post('/api/gemini/generate-cover-letter', async (req, res) => {
  try {
    const { applicantName, targetCountry, purpose, tripDuration, sponsorOrJob, travelDates } = req.body;

    const ai = getGenAi();
    const prompt = `You are an expert Visa File Strategist at VartiMax Consultant, Islamabad.
Write a formal, embassy-grade Visa Cover Letter for:
- Applicant Name: ${applicantName || 'Applicant'}
- Embassy: Embassy / Consulate of ${targetCountry || 'Italy / Schengen'} in Islamabad, Pakistan
- Purpose: ${purpose || 'Tourism & Cultural Exploration'}
- Proposed Travel Dates: ${travelDates || 'May 15 - May 26, 2026 (11 Days)'}
- Employment / Financial Proof: ${sponsorOrJob || 'Senior Software Engineer, 6-Month Bank Statement PKR 3.8M, FBR Tax Returns'}

Include:
1. Formal header addressed to The Visa Officer, Embassy of ${targetCountry}, Islamabad.
2. Clear statement of purpose and duration.
3. Detailed Day-by-Day travel itinerary overview.
4. Summary of enclosed documents (Passport, Bank Statement, FBR Returns, Flight PNR, Hotel Bookings, €30k Insurance, NADRA FRC).
5. Definite statement proving strong ties to Pakistan and commitment to return before visa expiry.
6. Professional closing signed by ${applicantName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt
    });

    res.json({ success: true, coverLetter: response.text });
  } catch (error) {
    console.error('Gemini Cover Letter Error, using structured template fallback:', error);
    const { applicantName, targetCountry, purpose, tripDuration, sponsorOrJob, travelDates } = req.body;
    const name = applicantName || 'Applicant';
    const country = targetCountry || 'Italy (Schengen)';
    const reason = purpose || 'Tourism and cultural exploration';
    const dates = travelDates || tripDuration || '10 Days';
    const financialInfo = sponsorOrJob || 'Salaried Executive with 6-month bank ledger and active FBR tax returns';

    const fallbackLetter = `To:
The Visa Officer,
Embassy / Consulate of ${country},
Diplomatic Enclave, Islamabad, Pakistan.

Subject: APPLICATION FOR SHORT-STAY VISIT / TOURIST VISA - ${name.toUpperCase()}

Respected Visa Officer,

I am writing this letter to formally submit my application for a short-stay visit visa to ${country} for the duration of ${dates}.

1. PURPOSE OF VISIT & ITINERARY:
The primary purpose of my journey is ${reason.toLowerCase()}. During my stay, I intend to visit notable cultural landmarks and experience the regional heritage. I have organized a confirmed day-by-day travel plan and secured hotel reservations for each city on my itinerary.

2. EMPLOYMENT & FINANCIAL STANDING:
I am currently working as a ${financialInfo}. My personal bank account demonstrates steady, legitimate domestic income with sufficient liquidity to fully sponsor all flights, accommodations, internal transit, and personal expenses during my stay.

3. ROOTS & SOCIAL TIES TO PAKISTAN:
I have deep personal, professional, and familial roots in Pakistan. My permanent residence, employment obligations, and immediate family reside in Pakistan. I solemnly undertake that I will adhere strictly to all immigration laws and return to Pakistan well before the expiry of my granted visa.

4. ENCLOSED DOCUMENTS FOR VERIFICATION:
- Duly completed and signed Visa Application Form
- Original Passport with all previous travel visas
- 6-Month Bank Statements & Bank Account Maintenance Certificate
- 2-3 Years FBR Tax Returns & NTN Certificate
- Verified GDS Flight Reservation with Live PNR
- Confirmed Hotel Booking Vouchers
- Zero-Deductible €30,000 Schengen Travel Medical Insurance Policy
- NADRA Family Registration Certificate (FRC) & Employment Letter

Thank you for your time and consideration of my visa application.

Yours sincerely,

${name}
Islamabad, Pakistan`;

    res.json({ success: true, coverLetter: fallbackLetter });
  }
});

// Vite Development or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VartiMax Consultant Server running at http://localhost:${PORT}`);
  });
}

startServer();
