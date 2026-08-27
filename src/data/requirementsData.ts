import { DocumentRequirement, VisaCategory } from '../types';

export const DOCUMENT_REQUIREMENTS: Record<VisaCategory, DocumentRequirement[]> = {
  visit: [
    {
      id: 'vis-1',
      category: 'visit',
      title: 'Valid Passport Copy',
      description: 'Valid for minimum 1 year from intended travel date. Include all previous passports, visas, and entry/exit stamps to demonstrate travel history.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG', 'PNG'],
      maxSizeMB: 10,
      tip: 'Scan in color with all 4 corners visible and high clarity.'
    },
    {
      id: 'vis-2',
      category: 'visit',
      title: 'Smart CNIC Copy (Front & Back)',
      description: 'NADRA Smart National Identity Card (Urdu/English) high-resolution color scan of both front and reverse sides.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG', 'PNG'],
      maxSizeMB: 10,
      tip: 'Ensure CNIC is valid and not expired.'
    },
    {
      id: 'vis-3',
      category: 'visit',
      title: 'Biometric Photographs (35mm x 45mm)',
      description: 'Recent photographs taken within the last 3 months with 70-80% face coverage, plain white background, neutral expression, and no glasses.',
      mandatory: true,
      acceptedFormats: ['JPEG', 'PNG'],
      maxSizeMB: 5,
      tip: 'Standard Schengen/Embassy specifications with matte or semi-gloss finish.'
    },
    {
      id: 'vis-4',
      category: 'visit',
      title: '6-Month Bank Statements & Maintenance Certificate',
      description: 'Original stamped & signed 6-month personal & business bank statements showing steady transaction history, plus official Account Maintenance Certificate.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'Avoid sudden unexplained large lump-sum deposits just before applying.'
    },
    {
      id: 'vis-5',
      category: 'visit',
      title: 'Tax & Business Proof (NTN, FBR Returns & Chamber)',
      description: 'NTN Certificate, FBR Income Tax Returns (Wealth Statements) for past 2-3 years, and Chamber of Commerce / SECP Business Registration.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'For salaried individuals: Last 3-4 salary slips + Employment Letter / NOC.'
    },
    {
      id: 'vis-6',
      category: 'visit',
      title: 'NADRA Family Registration Certificate (FRC / MRC)',
      description: 'Family Registration Certificate (FRC with Parents/Siblings or Spouse/Children) issued by NADRA to prove strong roots and home ties to Pakistan.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Crucial for overcoming Section 214(b) / Schengen home-tie scrutiny.'
    },
    {
      id: 'vis-7',
      category: 'visit',
      title: 'Travel Logistics & Embassy File Architecture',
      description: 'Verified Flight Reservation (Dummy/Live PNR), Confirmed Hotel Bookings, €30,000 Schengen Travel Insurance, Day-by-day Itinerary, and Tailored Cover Letter.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'VartiMax Consultant creates the complete embassy-compliant logistics file for you.'
    }
  ],
  study: [
    {
      id: 'stu-1',
      category: 'study',
      title: 'Attested Academic Documents & Transcripts',
      description: 'Matric / O-Levels, Inter / FSc / A-Levels, Bachelor / Master Degrees and detailed mark sheets attested by IBCC and HEC Pakistan.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'Include clear scans of front and rear attestation stamps.'
    },
    {
      id: 'stu-2',
      category: 'study',
      title: 'English Language Proficiency Proof',
      description: 'Official IELTS Academic / PTE Academic / TOEFL iBT / Duolingo scorecard or Medium of Instruction (MOI) Certificate where applicable.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 5,
      tip: 'Minimum recommended: IELTS 6.0-6.5 overall for undergraduate & postgraduate.'
    },
    {
      id: 'stu-3',
      category: 'study',
      title: 'Valid Passport & CNIC',
      description: 'Original Passport with at least 18-24 months validity for long-term student visa processing + NADRA Smart CNIC copy.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Must have at least 4 blank visa pages.'
    },
    {
      id: 'stu-4',
      category: 'study',
      title: 'Statement of Purpose (SOP) / Personal Statement',
      description: 'Comprehensive academic SOP explaining course rationale, choice of destination/university, career trajectory in Pakistan, and return intent.',
      mandatory: true,
      acceptedFormats: ['PDF', 'DOCX'],
      maxSizeMB: 5,
      tip: 'VartiMax Consultant offers professional SOP structuring and review.'
    },
    {
      id: 'stu-5',
      category: 'study',
      title: 'Letters of Recommendation (2 Academic/Professional LORs)',
      description: 'Two signed and stamped reference letters on official institution/company letterhead from university professors or direct supervisors.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 5,
      tip: 'Must include referee contact email and official phone number.'
    },
    {
      id: 'stu-6',
      category: 'study',
      title: 'Financial Sponsorship & Asset Valuation Proof',
      description: 'Sponsor 6-month bank statement, Affidavit of Financial Support on stamp paper, FBR Tax returns of sponsor, and Chartered Accountant Property Valuation.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'Must comfortably cover 1 year tuition fees + living expenses.'
    },
    {
      id: 'stu-7',
      category: 'study',
      title: 'University Offer Letter / CAS / I-20 Form',
      description: 'Official unconditional/conditional admission letter from accredited international university, CAS (UK), I-20 (USA), or LOA (Canada).',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'VartiMax assists with direct admissions and scholarship applications.'
    }
  ],
  employment: [
    {
      id: 'emp-1',
      category: 'employment',
      title: 'Original Valid Passport & CNIC',
      description: 'Machine-readable passport valid for at least 2 years with smart CNIC and previous overseas work permits if any.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Ensure signature matches across all contract documents.'
    },
    {
      id: 'emp-2',
      category: 'employment',
      title: 'Signed Overseas Job Offer Letter / Employment Contract',
      description: 'Official employment contract/agreement issued and stamped by the hiring overseas company detailing salary, designation, and benefits.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'Attestation by relevant foreign ministry/chamber required for certain Gulf countries.'
    },
    {
      id: 'emp-3',
      category: 'employment',
      title: 'Attested Educational & Experience Certificates',
      description: 'Prior experience letters, diplomas, trade test certifications, and degrees verified by MOFA and relevant professional councils (e.g. PEC/PMDC).',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'Certificates must match the exact designation on the work permit.'
    },
    {
      id: 'emp-4',
      category: 'employment',
      title: 'Medical Fitness Certificate (GAMCA / Authorized Clinic)',
      description: 'Complete medical fitness report from GCC Approved Medical Centers Association (GAMCA) or embassy-certified panel physicians.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Includes chest X-Ray, blood screening, and general physical assessment.'
    },
    {
      id: 'emp-5',
      category: 'employment',
      title: 'Police Character Clearance Certificate',
      description: 'Character certificate issued by the District Police Officer / ICT Police Khidmat Markaz with MOFA attestation.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 5,
      tip: 'Must be issued within the last 6 months.'
    },
    {
      id: 'emp-6',
      category: 'employment',
      title: 'Passport-Sized Biometric Photographs',
      description: '4-6 copies of white background photographs adhering to destination country labour department specs.',
      mandatory: true,
      acceptedFormats: ['JPEG', 'PNG'],
      maxSizeMB: 5,
      tip: 'Recent high-resolution studio prints.'
    }
  ],
  umrah: [
    {
      id: 'umr-1',
      category: 'umrah',
      title: 'Original Passport (Min. 6 Months Validity)',
      description: 'Valid passport with at least 6 months remaining before planned departure to the Kingdom of Saudi Arabia.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Ensure at least two opposite blank pages for visa printing.'
    },
    {
      id: 'umr-2',
      category: 'umrah',
      title: 'Passport Size Photograph (White Background)',
      description: 'Clear front-facing digital photograph with plain white background, standard 2x2 inch or 35x45mm format.',
      mandatory: true,
      acceptedFormats: ['JPEG', 'PNG'],
      maxSizeMB: 5,
      tip: 'Both ears visible and no colored glasses.'
    },
    {
      id: 'umr-3',
      category: 'umrah',
      title: 'Smart CNIC Copy',
      description: 'Valid NADRA Smart National Identity Card front and back scan. For children under 18: NADRA B-Form copy.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'B-Form must be verified and readable.'
    },
    {
      id: 'umr-4',
      category: 'umrah',
      title: 'NADRA FRC / Proof of Kinship (For Families/Mahram)',
      description: 'NADRA Family Registration Certificate (FRC) or Marriage Registration Certificate (MRC) for pilgrims traveling as a family.',
      mandatory: true,
      acceptedFormats: ['PDF', 'JPEG'],
      maxSizeMB: 10,
      tip: 'Required for joint visa filing and family hotel bookings in Makkah & Madinah.'
    },
    {
      id: 'umr-5',
      category: 'umrah',
      title: 'Confirmed Hotel Voucher & Transport Logistics',
      description: 'Ministry of Hajj & Umrah (Nusuk platform) approved hotel booking voucher in Makkah/Madinah and private or sharing transport arrangements.',
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSizeMB: 10,
      tip: 'VartiMax provides direct 3-star, 4-star, and 5-star customized packages with 24/7 on-ground assistance.'
    }
  ]
};
