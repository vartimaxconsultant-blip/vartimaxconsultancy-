import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DocumentPortalPage } from './pages/DocumentPortalPage';
import { AiFileBuilderPage } from './pages/AiFileBuilderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { QuickAssessmentWidget } from './components/QuickAssessmentWidget';

import { VISA_SERVICES } from './data/servicesData';
import { VisaCategory } from './types';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [googleSheetsModalOpen, setGoogleSheetsModalOpen] = useState(false);
  const [leadDefaultCountry, setLeadDefaultCountry] = useState('');
  const [leadDefaultCategory, setLeadDefaultCategory] = useState<VisaCategory>('visit');

  // Smart Lead Capture Popup Trigger: 7 Seconds OR 40% Scroll
  useEffect(() => {
    const hasTriggered = sessionStorage.getItem('vartimax_lead_modal_shown');
    if (hasTriggered) return;

    // 1. Timer trigger: 7 seconds
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('vartimax_lead_modal_shown')) {
        setLeadModalOpen(true);
        sessionStorage.setItem('vartimax_lead_modal_shown', 'true');
      }
    }, 7000);

    // 2. Scroll trigger: 40%
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolledRatio = window.scrollY / scrollHeight;
        if (scrolledRatio >= 0.4 && !sessionStorage.getItem('vartimax_lead_modal_shown')) {
          setLeadModalOpen(true);
          sessionStorage.setItem('vartimax_lead_modal_shown', 'true');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (country?: string, category?: VisaCategory) => {
    if (country) setLeadDefaultCountry(country);
    if (category) setLeadDefaultCategory(category);
    setLeadModalOpen(true);
  };

  // Find active service detail if route starts with 'service-'
  const selectedServiceSlug = currentRoute.startsWith('service-')
    ? currentRoute.replace('service-', '')
    : null;

  const currentService = selectedServiceSlug
    ? VISA_SERVICES.find((s) => s.slug === selectedServiceSlug)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#092E5E] text-[#F3F4F6] font-sans antialiased selection:bg-[#C5A059] selection:text-[#092E5E]">
      {/* Navigation Header */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Main Page View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
            onSelectService={(slug) => handleNavigate(`service-${slug}`)}
          />
        )}

        {currentService && (
          <ServiceDetailPage
            service={currentService}
            onOpenConsultation={() =>
              handleOpenConsultation(currentService.title, currentService.category)
            }
            onNavigateToPortal={() => handleNavigate('document-portal')}
          />
        )}

        {currentRoute === 'document-portal' && (
          <DocumentPortalPage
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}

        {currentRoute === 'assessment' && (
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8">
            <QuickAssessmentWidget
              onOpenConsultation={() => handleOpenConsultation()}
              compact={false}
            />
          </div>
        )}

        {currentRoute === 'ai-file-assistant' && <AiFileBuilderPage />}

        {currentRoute === 'about' && (
          <AboutPage
            onOpenConsultation={() => handleOpenConsultation()}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGoogleSheetsModal={() => setGoogleSheetsModalOpen(true)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Floating 24/7 WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Smart Lead Capture Pop-up */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultCountry={leadDefaultCountry}
        defaultCategory={leadDefaultCategory}
      />

      {/* Google Sheets & Drive Webhook Integration Code Modal */}
      <GoogleSheetsIntegrationModal
        isOpen={googleSheetsModalOpen}
        onClose={() => setGoogleSheetsModalOpen(false)}
      />
    </div>
  );
}

export default App;
