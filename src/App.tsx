import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';
import { AgentNotificationProvider } from './context/AgentNotificationContext';
import { AgentNotificationPopup } from './components/AgentNotificationPopup';
import { AgentNotificationDrawer } from './components/AgentNotificationDrawer';
import { AgentQueryDetailModal } from './components/AgentQueryDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DocumentPortalPage } from './pages/DocumentPortalPage';
import { AiFileBuilderPage } from './pages/AiFileBuilderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CrmPortalPage } from './pages/CrmPortalPage';
import { QuickAssessmentWidget } from './components/QuickAssessmentWidget';

import { VISA_SERVICES } from './data/servicesData';
import { BLOG_POSTS } from './data/blogsData';
import { VisaCategory } from './types';

function parseRouteFromLocation(): string {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const path = window.location.pathname.replace(/^\//, '').trim();

  // Check hash first (standard SPA client routing)
  if (hash) {
    if (hash.startsWith('services/')) return `service-${hash.replace('services/', '')}`;
    if (hash.startsWith('service-')) return hash;
    if (hash.startsWith('blogs/')) return `blog-${hash.replace('blogs/', '')}`;
    if (hash.startsWith('blog-')) return hash;
    if (hash === 'visa-tracker' || hash === 'tracker') return 'visa-tracker';
    if (hash === 'document-portal') return 'document-portal';
    if (hash === 'assessment') return 'assessment';
    if (hash === 'ai-file-assistant') return 'ai-file-assistant';
    if (hash === 'crm') return 'crm';
    if (hash === 'about') return 'about';
    if (hash === 'contact') return 'contact';
    if (hash === 'blogs') return 'blogs';
    if (hash === 'home' || hash === '') return 'home';
  }

  // Check pathname
  if (path.startsWith('services/')) {
    return `service-${path.replace('services/', '')}`;
  }
  if (path.startsWith('blogs/')) {
    return `blog-${path.replace('blogs/', '')}`;
  }
  if (path === 'visa-tracker' || path === 'tracker') return 'visa-tracker';
  if (path === 'document-portal') return 'document-portal';
  if (path === 'assessment') return 'assessment';
  if (path === 'ai-file-assistant') return 'ai-file-assistant';
  if (path === 'crm') return 'crm';
  if (path === 'about') return 'about';
  if (path === 'contact') return 'contact';
  if (path === 'blogs') return 'blogs';

  return 'home';
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => parseRouteFromLocation());
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [googleSheetsModalOpen, setGoogleSheetsModalOpen] = useState(false);
  const [leadDefaultCountry, setLeadDefaultCountry] = useState('');
  const [leadDefaultCategory, setLeadDefaultCategory] = useState<VisaCategory>('visit');

  // Synchronize route state with browser history (back/forward & direct links)
  useEffect(() => {
    const handleUrlChange = () => {
      const detectedRoute = parseRouteFromLocation();
      setCurrentRoute(detectedRoute);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Find active service detail if route starts with 'service-'
  const selectedServiceSlug = currentRoute.startsWith('service-')
    ? currentRoute.replace('service-', '')
    : null;

  const currentService = selectedServiceSlug
    ? VISA_SERVICES.find((s) => s.slug === selectedServiceSlug)
    : null;

  // Find active blog post if route starts with 'blog-'
  const selectedBlogSlug = currentRoute.startsWith('blog-')
    ? currentRoute.replace('blog-', '')
    : null;

  const currentBlogPost = selectedBlogSlug
    ? BLOG_POSTS.find((b) => b.slug === selectedBlogSlug)
    : null;

  // Dynamically update document title and meta description for SEO
  useEffect(() => {
    if (currentService) {
      document.title = `${currentService.title} | VartiMax Consultant Islamabad`;
    } else if (currentBlogPost) {
      document.title = currentBlogPost.metaTitle || `${currentBlogPost.title} | VartiMax Consultant`;
    } else if (currentRoute === 'visa-tracker' || currentRoute === 'tracker') {
      document.title = 'Client Visa Progress Tracker & Embassy Milestone Portal | VartiMax Consultant';
    } else if (currentRoute === 'document-portal') {
      document.title = 'Secure Client Visa Document Upload Portal | VartiMax Consultant';
    } else if (currentRoute === 'blogs') {
      document.title = 'Visa Guides, Checklists & Refusal Solutions | VartiMax Islamabad';
    } else if (currentRoute === 'assessment') {
      document.title = 'Calculate Visa Acceptance Score | VartiMax Consultant';
    } else if (currentRoute === 'crm') {
      document.title = 'CRM Staff Workspace & Agent Desks | VartiMax Consultant';
    } else {
      document.title = 'VartiMax Consultant | Visa File Preparation & International Admissions Islamabad';
    }
  }, [currentRoute, currentService, currentBlogPost]);

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
    let targetHash = route;
    if (route.startsWith('service-')) {
      targetHash = `services/${route.replace('service-', '')}`;
    } else if (route.startsWith('blog-')) {
      targetHash = `blogs/${route.replace('blog-', '')}`;
    }
    if (window.location.hash.replace(/^#/, '') !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (country?: string, category?: VisaCategory) => {
    if (country) setLeadDefaultCountry(country);
    if (category) setLeadDefaultCategory(category);
    setLeadModalOpen(true);
  };

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

        {currentRoute === 'blogs' && (
          <BlogsPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}

        {currentBlogPost && (
          <BlogDetailPage
            post={currentBlogPost}
            onNavigate={handleNavigate}
            onOpenConsultation={(country) => handleOpenConsultation(country)}
          />
        )}

        {(currentRoute === 'document-portal' || currentRoute === 'visa-tracker' || currentRoute === 'tracker') && (
          <DocumentPortalPage
            initialTab={currentRoute === 'document-portal' ? 'submit' : 'track'}
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

        {currentRoute === 'crm' && (
          <CrmPortalPage onOpenConsultation={() => handleOpenConsultation()} />
        )}
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

      {/* Agent Live Notification Floating Alert Toast */}
      <AgentNotificationPopup />

      {/* Agent Live Inquiries & Dossier Inbox Drawer */}
      <AgentNotificationDrawer onNavigate={handleNavigate} />

      {/* Agent Query / Dossier Detail & Outreach Modal */}
      <AgentQueryDetailModal />
    </div>
  );
}

export function App() {
  return (
    <AgentNotificationProvider>
      <AppContent />
    </AgentNotificationProvider>
  );
}

export default App;

