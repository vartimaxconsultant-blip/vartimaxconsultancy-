import heroVisaDeskImg from '../assets/images/hero_visa_consulting_1787827643643.jpg';
import schengenImg from '../assets/images/schengen_europe_travel_1787827664576.jpg';
import canadaImg from '../assets/images/canada_study_travel_1787827684406.jpg';
import islamabadHqImg from '../assets/images/islamabad_downtown_hq_1787827702072.jpg';
import ukVisaImg from '../assets/images/uk_study_tourist_visa_1787827727925.jpg';
import usaVisaImg from '../assets/images/usa_b1b2_f1_visa_1787827747598.jpg';
import australiaVisaImg from '../assets/images/australia_subclass_visa_1787827768250.jpg';
import flightHotelImg from '../assets/images/flight_hotel_gds_1787827784002.jpg';

export interface SeoImageItem {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  width?: number;
  height?: number;
  keywordFocus: string;
}

export const SEO_IMAGES = {
  hero: {
    src: heroVisaDeskImg,
    alt: 'VartiMax Consultant Islamabad Embassy Visa File Preparation and Passport Advisory Desk',
    title: 'VartiMax Consultant - 90% Visa Acceptance File Preparation Desk Islamabad',
    caption: 'Airtight embassy file architecture prepared with 90% acceptance benchmarks at VartiMax Consultant Islamabad.',
    width: 1920,
    height: 1080,
    keywordFocus: 'Embassy Visa File Preparation Islamabad'
  },
  schengen: {
    src: schengenImg,
    alt: 'Schengen European Tourist and Visit Visa Consultancy Services in Islamabad Pakistan',
    title: 'Schengen Visa Consultant Islamabad - Italy, Germany, France, Spain & Switzerland Visas',
    caption: 'European Schengen tourist and business visa file preparation with verifiable GDS flight reservations.',
    width: 1200,
    height: 900,
    keywordFocus: 'Schengen Visa Consultant Islamabad'
  },
  canada: {
    src: canadaImg,
    alt: 'Canada Student Visa and Temporary Resident Visitor Visa Consultants in Islamabad Pakistan',
    title: 'Canada Study Permit and Visitor Visa Consultancy - SDS and Non-SDS Specialist Islamabad',
    caption: 'Canadian university admissions, Statement of Purpose (SOP) formulation, and GIC financial verification.',
    width: 1200,
    height: 900,
    keywordFocus: 'Canada Student Visa Consultants Islamabad'
  },
  uk: {
    src: ukVisaImg,
    alt: 'UK Standard Visitor Visa and Tier 4 Student Visa Advisory Office in Islamabad Pakistan',
    title: 'UK Visa Consultants Islamabad - University Admissions, CAS Support & Tourist Visa',
    caption: 'UK standard tourist visa and university admissions with tailored financial justifications.',
    width: 1200,
    height: 900,
    keywordFocus: 'UK Visa Consultant Islamabad'
  },
  usa: {
    src: usaVisaImg,
    alt: 'USA B1 B2 Tourist Visa DS160 and F1 Student Visa Consular Interview Preparation Islamabad',
    title: 'US Embassy Islamabad Visa Consultants - DS-160 Filing and Consular Mock Interviews',
    caption: 'Expert DS-160 filing, SEVIS I-20 documentation, and 1-on-1 consular interview preparation in Islamabad.',
    width: 1200,
    height: 900,
    keywordFocus: 'USA Visa Consultant Islamabad DS-160'
  },
  australia: {
    src: australiaVisaImg,
    alt: 'Australia Subclass 500 Student Visa and Subclass 600 Visitor Visa Guidance in Islamabad',
    title: 'Australia Visa Consultants Islamabad - GTE GS Assessment and Study Visa',
    caption: 'Genuine Student (GS) statement drafting, COE verification, and Australian Subclass 600 visitor filing.',
    width: 1200,
    height: 900,
    keywordFocus: 'Australia Visa Consultant Islamabad'
  },
  flightHotel: {
    src: flightHotelImg,
    alt: 'Verified Live PNR Flight Reservations and Embassy Compliant Travel Insurance in Pakistan',
    title: 'GDS Verifiable Flight Bookings & €30,000 Schengen Medical Travel Insurance Islamabad',
    caption: 'Live Amadeus/Sabre PNR airline reservations and zero-deductible Schengen travel medical insurance.',
    width: 1200,
    height: 900,
    keywordFocus: 'Verifiable Flight Reservation for Visa Islamabad'
  },
  islamabadHq: {
    src: islamabadHqImg,
    alt: 'VartiMax Consultant Office 78 Basement Gaga Downtown Islamabad Headquarters Pakistan',
    title: 'VartiMax Consultant Head Office - Gaga Downtown Islamabad',
    caption: 'Headquarters of VartiMax Consultant at Gaga Downtown, Islamabad, Pakistan.',
    width: 1920,
    height: 1080,
    keywordFocus: 'VartiMax Consultant Gaga Downtown Islamabad'
  }
};
