import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  FileText,
  Search,
  Sparkles,
  Plane,
  BookOpen
} from 'lucide-react';
import { VISA_SERVICES } from '../data/servicesData';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenConsultation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all duration-200">
      {/* Top Information Bar with Logo Navy Color */}
      <div className="bg-[#042354] text-[#E0E7FF] text-xs border-b border-[#031A3E] py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left contact info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[#E0E7FF]">
            <a
              href="tel:+923401207525"
              className="flex items-center gap-1.5 hover:text-[#C5A059] transition-colors font-medium text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>+92 340 1207525</span>
            </a>
            <a
              href="mailto:vartimaxconsultant@gmail.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#C5A059] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>vartimaxconsultant@gmail.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1.5 text-[#BFDBFE]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Office 78, Basement, Gaga Downtown, Islamabad</span>
            </span>
          </div>

          {/* Right Trust Badge & Opening Hours */}
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1 bg-[#C5A059]/20 text-[#F5CE6D] px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              90% Visa Acceptance Rate
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[#BFDBFE]">
              <Clock className="w-3 h-3 text-[#C5A059]" />
              Mon - Sat: 10:00 AM - 7:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Exact Brand Logo in full authentic colors */}
        <button
          onClick={() => handleNav('home')}
          className="focus:outline-none flex items-center group cursor-pointer text-left"
          aria-label="VartiMax Consultant Home"
        >
          <Logo size="md" variant="full" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-7 text-[13px] xl:text-sm font-semibold text-[#042354] shrink-0">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav('home'); }}
            className={`whitespace-nowrap transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'home' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Home
          </a>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className={`whitespace-nowrap flex items-center gap-1 transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
                currentRoute.startsWith('service-') ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
              }`}
            >
              <span>Visa Services</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#042354]" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full -left-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 mb-1">
                  Embassy-Optimized Visas
                </div>
                {VISA_SERVICES.map((svc) => (
                  <a
                    key={svc.slug}
                    href={`#service-${svc.slug}`}
                    onClick={(e) => { e.preventDefault(); handleNav(`service-${svc.slug}`); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#042354] group-hover:text-[#C5A059]">
                        {svc.shortTitle}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        {svc.countries.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#C5A059]/15 text-[#9A7420] px-2 py-0.5 rounded border border-[#C5A059]/30">
                      {svc.acceptanceRate}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#document-portal"
            onClick={(e) => { e.preventDefault(); handleNav('document-portal'); }}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'document-portal' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Document Portal</span>
          </a>

          <a
            href="#eligibility-calculator"
            onClick={(e) => { e.preventDefault(); handleNav('assessment'); }}
            className={`whitespace-nowrap transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'assessment' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Eligibility Check
          </a>

          <a
            href="#ai-builder"
            onClick={(e) => { e.preventDefault(); handleNav('ai-file-assistant'); }}
            className={`whitespace-nowrap flex items-center gap-1 transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'ai-file-assistant' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>AI File Builder</span>
          </a>

          <a
            href="#blogs"
            onClick={(e) => { e.preventDefault(); handleNav('blogs'); }}
            className={`whitespace-nowrap flex items-center gap-1 transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'blogs' || currentRoute.startsWith('blog-') ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Guides &amp; Blog</span>
          </a>

          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); handleNav('about'); }}
            className={`whitespace-nowrap transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'about' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            About Us
          </a>

          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
            className={`whitespace-nowrap transition-colors hover:text-[#C5A059] cursor-pointer py-1 ${
              currentRoute === 'contact' ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNav('document-portal')}
            className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-[#042354] hover:text-[#C5A059] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Track Application</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] px-4 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-[#C5A059]/20 hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all cursor-pointer"
          >
            <Plane className="w-4 h-4 text-[#042354]" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#042354] hover:bg-slate-100 focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-2 font-medium text-[#042354] text-sm">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-semibold"
            >
              Home
            </a>

            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase">
              Our Visa Services
            </div>
            {VISA_SERVICES.map((svc) => (
              <a
                key={svc.slug}
                href={`#service-${svc.slug}`}
                onClick={(e) => { e.preventDefault(); handleNav(`service-${svc.slug}`); }}
                className="text-left px-5 py-1.5 text-xs text-[#042354] hover:text-[#C5A059] hover:bg-slate-50 flex items-center justify-between"
              >
                <span>{svc.shortTitle}</span>
                <span className="text-[10px] bg-[#C5A059]/15 text-[#9A7420] px-1.5 py-0.5 rounded font-semibold border border-[#C5A059]/30">
                  {svc.acceptanceRate}
                </span>
              </a>
            ))}

            <a
              href="#document-portal"
              onClick={(e) => { e.preventDefault(); handleNav('document-portal'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-[#9A7420] font-semibold"
            >
              <FileText className="w-4 h-4" />
              <span>Document Submission Portal</span>
            </a>

            <a
              href="#eligibility-calculator"
              onClick={(e) => { e.preventDefault(); handleNav('assessment'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Eligibility Calculator
            </a>

            <a
              href="#ai-builder"
              onClick={(e) => { e.preventDefault(); handleNav('ai-file-assistant'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>AI Embassy Cover Letter Generator</span>
            </a>

            <a
              href="#blogs"
              onClick={(e) => { e.preventDefault(); handleNav('blogs'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-[#042354] font-semibold"
            >
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>Visa Guides &amp; Knowledge Hub</span>
            </a>

            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); handleNav('about'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              About VartiMax
            </a>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Contact Us &amp; Office Map
            </a>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full text-center bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] py-2.5 rounded-lg text-sm font-bold shadow-md"
            >
              Book Free Visa Assessment
            </button>
            <a
              href="https://wa.me/923401207525?text=Hello%20VartiMax%20Consultant,%20I%20want%20to%20inquire%20about%20visa%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp (+92 340 1207525)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
