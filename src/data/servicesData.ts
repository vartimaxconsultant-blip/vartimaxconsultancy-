import { VisaServiceDetail } from '../types';
import schengenImg from '../assets/images/schengen_europe_travel_1787827664576.jpg';
import canadaImg from '../assets/images/canada_study_travel_1787827684406.jpg';
import usaVisaImg from '../assets/images/usa_b1b2_f1_visa_1787827747598.jpg';
import ukVisaImg from '../assets/images/uk_study_tourist_visa_1787827727925.jpg';
import flightHotelImg from '../assets/images/flight_hotel_gds_1787827784002.jpg';

export const VISA_SERVICES: VisaServiceDetail[] = [
  {
    slug: 'schengen-visit-visa-consultant-islamabad',
    title: 'Schengen Visit & Tourist Visa Consultancy in Islamabad',
    shortTitle: 'Schengen Visit Visa',
    category: 'visit',
    countries: ['Italy', 'Germany', 'France', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Sweden'],
    bannerImage: schengenImg,
    badge: '90% Schengen Acceptance',
    acceptanceRate: '90%',
    processingTime: '15 - 25 Working Days',
    heroHeadline: 'Guaranteed Embassy-Grade File Creation for Schengen Visas in Islamabad',
    heroSubheadline: 'Navigate complex European embassy requirements with tailored cover letters, verified live PNR flight reservations, €30,000 travel insurance, and airtight financial structuring.',
    description: 'Applying for a Schengen visa from Pakistan requires precise file engineering to eliminate the common refusal grounds under Article 32 (lack of ties to home country, unclear travel purpose, or inadequate financial documentation). At VartiMax Consultant, our senior visa strategists audit your profile, compile an impeccable day-by-day itinerary, structure tax/bank statements, and generate compelling cover letters to maximize approval chances at German, Italian, French, and Spanish embassies in Islamabad.',
    whyCrucial: [
      'Embassy-Approved Cover Letter highlighting professional roots and clear travel intent',
      'Verified GDS Flight Reservation & Free-Cancellation Hotel Bookings',
      '€30,000 Schengen Compliant Medical Travel Insurance covering all 29 member states',
      'Financial File Alignment (FBR Wealth Statements, NTN, 6-Month Bank Ledger audit)',
      'Family Ties & Ties to Pakistan documentation (NADRA FRC/MRC translation and notarization)'
    ],
    embassyFileChecklist: [
      'Original Passport (min 2 blank pages, 1 year validity)',
      'Smart CNIC and NADRA Family Registration Certificate (FRC)',
      '6-Month Bank Statement with minimum recommended closing balance of PKR 2.5M+',
      'FBR Income Tax Returns for last 2-3 Assessment Years',
      'Employment Letter / NOC / Business Chamber Certificate',
      'Confirmed Day-by-Day European Travel Itinerary',
      '€30k Schengen Travel Health Insurance policy'
    ],
    faqs: [
      {
        question: 'What is the minimum bank balance required for a Schengen visit visa from Pakistan?',
        answer: 'While European embassies do not specify a single fixed number, a steady closing balance of PKR 2,500,000 to PKR 4,000,000 for a 10 to 14-day trip is highly recommended. More critical than the closing balance is healthy transaction velocity over the last 6 months without sudden unjustified deposits.'
      },
      {
        question: 'How does VartiMax Consultant help with past Schengen visa refusals?',
        answer: 'Our senior case officers dissect your refusal letter (identifying specific checkboxes such as Article 32(1)(a)(ii) or justification for stay). We re-engineer your file, draft a legal appeal/re-application letter addressing each specific concern, and bolster documentary proof before resubmission.'
      },
      {
        question: 'Can I apply for Schengen visa through VFS Global / Gerrys in Islamabad?',
        answer: 'Yes. Most Schengen states (France, Italy, Spain, Netherlands, Switzerland) operate through Gerrys / VFS Global or TLScontact in Islamabad. VartiMax handles appointment booking, file compilation, and appointment preparation.'
      }
    ]
  },
  {
    slug: 'canada-student-visa-consultancy',
    title: 'Canada Student Visa & Visitor Visa Consultancy Islamabad',
    shortTitle: 'Canada Study & Visit',
    category: 'study',
    countries: ['Canada'],
    bannerImage: canadaImg,
    badge: 'SDS & Non-SDS Specialist',
    acceptanceRate: '92%',
    processingTime: '4 - 8 Weeks',
    heroHeadline: 'Direct Canadian Study Permits & Visitor Visa File Preparation',
    heroSubheadline: 'Secure Canadian university admissions, GIC financial verification, airtight SOPs, and visitor visas with Islamabad’s most trusted visa architects.',
    description: 'Canadian immigration (IRCC) evaluates study and visitor visa applicants under stringent dual-intent and financial sufficiency benchmarks. VartiMax Consultant crafts bespoke Statements of Purpose (SOP) that clearly outline academic progression, financial sponsorship, and genuine intention to respect temporary resident status, while positioning students for post-graduation work permits (PGWP).',
    whyCrucial: [
      'Comprehensive 4-page Academic & Career Statement of Purpose (SOP)',
      'Designated Learning Institution (DLI) Admission & Provincial Attestation Letter (PAL) guidance',
      'Guaranteed Investment Certificate (GIC) & Tuition Fee Receipt Structuring',
      'Sponsor Affidavit of Support, CA Property Valuation & FBR Tax Documentation',
      'Dual Intent Clarity ensuring IRCC compliance'
    ],
    embassyFileChecklist: [
      'DLI Letter of Acceptance (LOA) & PAL if applicable',
      'IELTS Academic / PTE Academic test results',
      'HEC & IBCC attested academic transcripts and certificates',
      'Evidence of tuition fee payment and GIC / Proof of Funds (CAD 20,635+)',
      'NADRA FRC and Police Character Certificate',
      'Upfront Medical Exam confirmation from IOM Islamabad'
    ],
    faqs: [
      {
        question: 'What is the difference between SDS and Non-SDS study stream for Pakistan?',
        answer: 'The Student Direct Stream (SDS) offers faster processing for applicants with IELTS 6.0 in all bands, upfront 1-year tuition payment, and CAD 20,635 GIC. Non-SDS allows wider English test options and alternative financial proofs.'
      },
      {
        question: 'Can my spouse accompany me on a Canada Study Visa?',
        answer: 'Yes! Spouses of students enrolled in master’s or doctoral degree programs are eligible to apply for an Open Work Permit (SOWP). VartiMax prepares joint or subsequent spouse files.'
      }
    ]
  },
  {
    slug: 'usa-visit-b1-b2-student-f1-visa',
    title: 'USA B1/B2 Visitor & F1 Student Visa Guidance in Islamabad',
    shortTitle: 'USA B1/B2 & F1',
    category: 'visit',
    countries: ['United States'],
    bannerImage: usaVisaImg,
    badge: 'DS-160 & Mock Interview',
    acceptanceRate: '88%',
    processingTime: 'Embassy Queue Dependent',
    heroHeadline: 'Ace Your US Embassy Islamabad Interview with Expert Mock Coaching',
    heroSubheadline: 'Flawless DS-160 form filling, SEVIS I-20 management, and 1-on-1 consular interview preparation tailored for Pakistani applicants.',
    description: 'The US Embassy in Islamabad refuses the majority of applicants under INA Section 214(b) due to inconsistent DS-160 answers or inadequate verbal communication during the 2-minute consular interview. VartiMax Consultant provides end-to-end DS-160 submission and conducts intensive mock interview simulations with actual consular question patterns.',
    whyCrucial: [
      'Meticulous DS-160 form completion matching employment and income records',
      '1-on-1 US Consular Mock Interview Sessions (Confidence & Question Strategy)',
      'Financial ties, family assets, and career trajectory documentation',
      'F1 Student I-20 Form, SEVIS I-901 fee payment, and university defense',
      'Emergency US Visa Appointment booking guidance'
    ],
    embassyFileChecklist: [
      'DS-160 Confirmation Page with Barcode',
      'Valid Pakistani Passport + previous US visas if applicable',
      'US Visa Appointment Confirmation Letter (Islamabad or Karachi)',
      'Proof of Income (Salary slips, Tax returns, Bank statements)',
      'For F1 Students: Form I-20, SEVIS receipt, GRE/SAT/IELTS scorecard'
    ],
    faqs: [
      {
        question: 'What is Section 214(b) and how can VartiMax help me overcome it?',
        answer: 'Under US immigration law, every applicant is presumed to be an intending immigrant until proven otherwise. We build rock-solid evidence of your non-immigrant intent, highlighting ongoing employment, real estate assets, family obligations, and strategic future milestones in Pakistan.'
      },
      {
        question: 'How can I get an earlier US visa appointment in Islamabad?',
        answer: 'We assist with continuous appointment monitoring and emergency request submissions for urgent medical, business, or academic start dates.'
      }
    ]
  },
  {
    slug: 'uae-visit-residence-golden-visa',
    title: 'UAE Visit, Freelance, Residence & Golden Visa Consultancy',
    shortTitle: 'UAE & Gulf Visas',
    category: 'employment',
    countries: ['United Arab Emirates', 'Dubai', 'Saudi Arabia', 'Qatar', 'Oman'],
    bannerImage: flightHotelImg,
    badge: 'Express 24-48hr Approval',
    acceptanceRate: '98%',
    processingTime: '24 - 72 Hours',
    heroHeadline: 'Fast-Track Dubai & UAE Visit, Partner, and Residence Visas',
    heroSubheadline: 'Single/Multiple Entry 30/60 Days Tourist Visas, 2-Year Freelance & Employment Visas, and 10-Year UAE Golden Visa facilitation.',
    description: 'Whether you need an express 30-day or 60-day tourist e-visa for Dubai, or are looking to relocate with a 2-year UAE partner/freelance visa or 10-year Golden Visa, VartiMax Consultant delivers seamless online approvals with direct immigration portal integration.',
    whyCrucial: [
      'Express 24-48 hour e-visa issuance directly to your WhatsApp and email',
      'No security deposit hurdles for family and business travelers',
      'Comprehensive Emirates ID, Medical Fitness, and MOFA degree attestation support',
      '10-Year Golden Visa qualification review for real estate investors and skilled executives'
    ],
    embassyFileChecklist: [
      'Color copy of Passport first page (valid min 6 months)',
      'White background passport size photo',
      'Smart CNIC front & back copy',
      'Return confirmed flight booking'
    ],
    faqs: [
      {
        question: 'Can a 30 or 60-day Dubai tourist visa be extended inside the UAE?',
        answer: 'Yes, UAE visit visas can be extended inside the country without exiting through immigration airport-to-airport change or in-country status change. VartiMax coordinates this seamlessly.'
      }
    ]
  },
  {
    slug: 'worldwide-student-admissions',
    title: 'Worldwide University Admissions & Global Study Visa Consultancy',
    shortTitle: 'Global Admissions',
    category: 'study',
    countries: ['United Kingdom', 'Australia', 'Germany', 'Italy', 'USA', 'Canada', 'Malaysia', 'Turkey', 'Hungary', 'Cyprus'],
    bannerImage: ukVisaImg,
    badge: 'Direct University Partner',
    acceptanceRate: '95%',
    processingTime: '2 - 6 Weeks',
    heroHeadline: 'Study in Top Global Universities with Scholarships & Visa Assurance',
    heroSubheadline: 'Guaranteed admission placement, English waiver assistance, scholarship applications, and complete embassy visa file preparation from Islamabad.',
    description: 'Studying abroad is an investment in your future. VartiMax Consultant partners with over 350+ accredited universities across the UK, Europe (Germany tuition-free & Italy DSU scholarships), Australia, and North America. We guide Pakistani students through course selection, scholarship hunting, SOP structuring, CAS/I-20 issuance, and visa filing.',
    whyCrucial: [
      'Free Initial Career Counseling & Profile Assessment in our Islamabad Office',
      'Direct admissions to UK (Russell Group), Australia (Go8), and European public universities',
      'Assistance with Italian DSU Regional Scholarships and Hungarian Stipendium Hungaricum',
      'IELTS/PTE preparation guidance and English Medium of Instruction (MOI) waivers',
      'Complete pre-departure briefings and student accommodation arrangements'
    ],
    embassyFileChecklist: [
      'All educational certificates and transcripts (Matric to Masters)',
      'HEC & IBCC attestation copies',
      'English test scorecard (IELTS/PTE/TOEFL) or MOI letter',
      'Academic CV and Statement of Purpose',
      'Two academic recommendation letters'
    ],
    faqs: [
      {
        question: 'Can I study in Germany or Italy for free with scholarships from Pakistan?',
        answer: 'Yes! Public universities in Germany offer tuition-free education (with semester fees only ~€300), requiring a blocked account (~€11,208/year). In Italy, government regional scholarships (such as DSU/EDISU) can provide up to €7,000/year stipend + free tuition + subsidized accommodation. VartiMax specializes in these European pathways.'
      }
    ]
  },
  {
    slug: 'umrah-visa-packages',
    title: 'Customized & Group Umrah Visa Packages from Islamabad / Rawalpindi',
    shortTitle: 'Umrah Visa Packages',
    category: 'umrah',
    countries: ['Saudi Arabia', 'Makkah', 'Madinah'],
    bannerImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    badge: 'Nusuk Approved Provider',
    acceptanceRate: '99%',
    processingTime: '24 - 48 Hours',
    heroHeadline: 'Perform Your Sacred Umrah with Peace of Mind & Personalized Service',
    heroSubheadline: 'Direct Saudi electronic tourist & Umrah visas, 3★/4★/5★ Makkah & Madinah clock tower hotels, direct PIA/Saudia flights, and VIP luxury transport.',
    description: 'VartiMax Consultant offers personalized and family Umrah solutions designed for spiritual comfort. We facilitate instant electronic Umrah visa processing through official Saudi Ministry channels, coordinate hotel bookings within walking distance of the Haram in Makkah and Masjid an-Nabawi in Madinah, and arrange dedicated VIP private GMC transport.',
    whyCrucial: [
      'Instant e-Umrah & Saudi 1-Year Multiple Entry Tourist Visa issuance',
      'Prime Hotel Options (Fairmont Clock Tower, Swissotel, Pullman Zamzam, Oberoi Madinah)',
      'Direct flights from Islamabad International Airport (ISB) to Jeddah / Madinah',
      'Family package deals with Mahram/Kinship FRC coordination and wheelchair assistance',
      '24/7 dedicated Urdu/English helpline during your stay in Saudi Arabia'
    ],
    embassyFileChecklist: [
      'Original Passport valid minimum 6 months',
      'White background digital photograph',
      'Smart CNIC copy & NADRA FRC for families',
      'Confirmed flight and hotel accommodation voucher'
    ],
    faqs: [
      {
        question: 'Can women travel for Umrah without a Mahram under recent Saudi regulations?',
        answer: 'Yes! Under recent Saudi Ministry updates, women of any age can obtain a tourist/Umrah visa and perform Umrah independently or in groups without a male Mahram.'
      },
      {
        question: 'Can I visit other Saudi cities like Riyadh, Al-Ula, and Dammam on an Umrah visa?',
        answer: 'Yes! With the 1-Year Multiple Entry Saudi Tourist Visa provided by VartiMax, you can freely travel anywhere in Saudi Arabia, perform Umrah multiple times, and attend events.'
      }
    ]
  }
];
