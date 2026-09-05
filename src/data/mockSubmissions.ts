import { ClientApplication } from '../types';

export const BENCHMARK_APPLICATIONS: ClientApplication[] = [
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
    notes:
      'DS-160 successfully filed and fee cleared. In-person consular interview scheduled at US Embassy Islamabad. Mock Q&A session completed with Bilal Khan; second drill scheduled for June 22.',
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
    notes:
      'Embassy file compiled with verified PNR and €30,000 Schengen insurance. Gerrys Islamabad appointment booked for biometric submission.',
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
    notes:
      'CAS received from University of Leeds. Case officer Maria Ahmed is reviewing 28-day seasoning on Meezan Bank account and drafting Statement of Purpose.',
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
    notes:
      'IRCC approved 5-year multiple entry V-1 visitor visa! Original passport stamped and ready for handover at VartiMax Islamabad office.',
    assignedConsultant: {
      name: 'Maria Ahmed',
      phone: '+92 340 1207525',
      designation: 'Canada & USA Visa Counselor'
    },
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'vartimax_client_submissions';

/**
 * Get all available client applications (benchmark presets + user submissions stored locally)
 */
export function getAllClientApplications(): ClientApplication[] {
  const localList: ClientApplication[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localList.push(...parsed);
      }
    }
  } catch (e) {
    console.warn('Could not parse local client submissions:', e);
  }

  // Combine benchmark presets with any locally saved submissions (local submissions first)
  const combined = [...localList];
  for (const preset of BENCHMARK_APPLICATIONS) {
    if (!combined.some((item) => item.referenceId.toLowerCase() === preset.referenceId.toLowerCase())) {
      combined.push(preset);
    }
  }

  return combined;
}

/**
 * Find application by Reference ID, Phone, or Passport Number locally
 */
export function findClientApplicationLocally(query: string): ClientApplication | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  const all = getAllClientApplications();
  const digitsOnly = clean.replace(/\D/g, '');

  return (
    all.find((app) => {
      if (app.referenceId.toLowerCase() === clean) return true;
      if (app.passportNumber && app.passportNumber.toLowerCase() === clean) return true;
      if (digitsOnly.length >= 7 && app.whatsapp.replace(/\D/g, '').includes(digitsOnly)) return true;
      return false;
    }) || null
  );
}

/**
 * Save or update an application into the client local store
 */
export function saveClientApplicationLocally(app: ClientApplication): void {
  try {
    const current = getAllClientApplications().filter(
      (item) => item.referenceId.toLowerCase() !== app.referenceId.toLowerCase()
    );
    current.unshift(app);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Could not save client application locally:', e);
  }
}
