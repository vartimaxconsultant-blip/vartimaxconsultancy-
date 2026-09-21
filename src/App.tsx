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
import { EligibilityHubPage } from './pages/EligibilityHubPage';
import { QuickAssessmentWidget } from './components/QuickAssessmentWidget';

import { VISA_SERVICES } from './data/servicesData';
import { BLOG_POSTS } from './data/blogsData';
import { VisaCategory } from './types';

export function routeToPath(route: string): string {
  if (route === 'home' || !route) return '/';
  if (route === 'services') return '/services';
  if (route === 'blogs') return '/blogs';
  if (route === 'about') return '/about';
  if (route === 'contact') return '/contact';
  if (route === 'visa-tracker' || route === 'tracker') return '/visa-tracker';
  if (route === 'document-portal') return '/document-portal';
  if (route === 'assessment') return '/assessment';
  if (route === 'quiz') return '/quiz';
  if (route === 'ai-file-assistant') return '/ai-file-assistant';
  if (route === 'crm') return '/crm';
  if (route.startsWith('service-')) {
    const slug = route.replace('service-', '');
    return `/services/${slug}`;
  }
  if (route.startsWith('blog-')) {
    const slug = route.replace('blog-', '');
    return `/blogs/${slug}`;
  }
  return `/${route}`;
}

export function parseRouteFromLocation(): string {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim();
  const hash = window.location.hash.replace(/^#\/?/, '').trim();

  // 1. Prioritize clean pathname (Primary static/Vercel URL)
  if (pathname) {
    if (pathname.startsWith('services/')) {
      const slug = pathname.replace('services/', '');
      return `service-${slug}`;
    }
    if (pathname === 'services') return 'services';
    if (pathname.startsWith('blogs/')) {
      const slug = pathname.replace('blogs/', '');
      return `blog-${slug}`;
    }
    if (pathname === 'blogs') return 'blogs';
    if (pathname === 'visa-tracker' || pathname === 'tracker') return 'visa-tracker';
    if (pathname === 'document-portal') return 'document-portal';
    if (pathname === 'assessment' || pathname === 'eligibility' || pathname === 'eligibility-calculator') return 'assessment';
    if (pathname === 'quiz' || pathname === 'visa-quiz' || pathname === 'eligibility-quiz') return 'quiz';
    if (pathname === 'ai-file-assistant' || pathname === 'ai-builder') return 'ai-file-assistant';
    if (pathname === 'crm') return 'crm';
    if (pathname === 'about') return 'about';
    if (pathname === 'contact') return 'contact';
  }

  // 2. Legacy hash fallback with seamless migration to clean path
  if (hash) {
    let resolved = 'home';
    if (hash.startsWith('services/')) resolved = `service-${hash.replace('services/', '')}`;
    else if (hash.startsWith('service-')) resolved = hash;
    else if (hash.startsWith('blogs/')) resolved = `blog-${hash.replace('blogs/', '')}`;
    else if (hash.startsWith('blog-')) resolved = hash;
    else if (hash === 'services') resolved = 'services';
    else if (hash === 'blogs') resolved = 'blogs';
    else if (hash === 'about') resolved = 'about';
    else if (hash === 'contact') resolved = 'contact';
    else if (hash === 'visa-tracker' || hash === 'tracker') resolved = 'visa-tracker';
    else if (hash === 'document-portal') resolved = 'document-portal';
    else if (hash === 'assessment' || hash === 'eligibility' || hash === 'eligibility-calculator') resolved = 'assessment';
    else if (hash === 'quiz' || hash === 'visa-quiz' || hash === 'eligibility-quiz') resolved = 'quiz';
    else if (hash === 'ai-file-assistant' || hash === 'ai-builder') resolved = 'ai-file-assistant';
    else if (hash === 'crm') resolved = 'crm';

    const cleanPath = routeToPath(resolved);
    if (typeof window.history.replaceState === 'function') {
      window.history.replaceState({}, '', cleanPath);
    }
    return resolved;
  }

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

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Find active service detail if route starts with 'service-'
  const selectedServiceSlug = currentRoute.startsWith('service-')
    ? currentRoute.replace('service-', '')
    : null;

  const currentService = selectedServiceSlug
    ? VISA_SERVICES.find((s) => s.slug === selectedServiceSlug) ||
      (selectedServiceSlug === 'schengen-file-preparation'
        ? VISA_SERVICES.find((s) => s.slug === 'schengen-visit-visa-consultant-islamabad')
        : selectedServiceSlug === 'usa-visa-interview-coaching'
        ? VISA_SERVICES.find((s) => s.slug === 'usa-visit-b1-b2-student-f1-visa')
        : null)
    : null;

  // Find active blog post if route starts with 'blog-'
  const selectedBlogSlug = currentRoute.startsWith('blog-')
    ? currentRoute.replace('blog-', '')
    : null;

  const currentBlogPost = selectedBlogSlug
    ? BLOG_POSTS.find((b) => b.slug === selectedBlogSlug) ||
      BLOG_POSTS.find((b) => b.slug.includes(selectedBlogSlug) || selectedBlogSlug.includes(b.slug))
    : null;

  // Scroll to services section if route is 'services'
  useEffect(() => {
    if (currentRoute === 'services') {
      const timer = setTimeout(() => {
        const elem = document.getElementById('services-section');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentRoute]);

  // Dynamically update document title, canonical link, and OpenGraph URL for SEO
  useEffect(() => {
    const currentPath = routeToPath(currentRoute);
    const canonicalUrl = `https://vartimaxconsultancy.vercel.app${currentPath === '/' ? '' : currentPath}`;

    // Update canonical link element
    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.href = canonicalUrl;
    }

    // Update OG & Twitter URL meta tags
    const ogUrlTag = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.content = canonicalUrl;
    }
    const twitterUrlTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:url"]');
    if (twitterUrlTag) {
      twitterUrlTag.content = canonicalUrl;
    }

    if (currentService) {
      document.title = `${currentService.title} | VartiMax Consultant Islamabad`;
    } else if (currentBlogPost) {
      document.title = currentBlogPost.metaTitle || `${currentBlogPost.title} | VartiMax Consultant`;
    } else if (currentRoute === 'services') {
      document.title = 'Embassy File Preparation & Visa Services | VartiMax Consultant Islamabad';
    } else if (currentRoute === 'visa-tracker' || currentRoute === 'tracker') {
      document.title = 'Client Visa Progress Tracker & Embassy Milestone Portal | VartiMax Consultant';
    } else if (currentRoute === 'document-portal') {
      document.title = 'Secure Client Visa Document Upload Portal | VartiMax Consultant';
    } else if (currentRoute === 'blogs') {
      document.title = 'Visa Guides, Checklists & Refusal Solutions | VartiMax Islamabad';
    } else if (currentRoute === 'assessment' || currentRoute === 'quiz') {
      document.title = 'Interactive Visa Eligibility Quiz & Acceptance Calculator | VartiMax Consultant';
    } else if (currentRoute === 'crm') {
      document.title = 'CRM Staff Workspace & Agent Desks | VartiMax Consultant';
    } else if (currentRoute === 'about') {
      document.title = 'About VartiMax Consultant | Islamabad Premier Visa Advisory';
    } else if (currentRoute === 'contact') {
      document.title = 'Contact VartiMax Consultant | Islamabad Office & Helpline';
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
    if (route === 'services') {
      if (currentRoute === 'home' || currentRoute === 'services') {
        const elem = document.getElementById('services-section');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          if (window.location.pathname !== '/services') {
            window.history.pushState({}, '', '/services');
          }
          return;
        }
      }
    }

    setCurrentRoute(route);
    const targetPath = routeToPath(route);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
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
        {(currentRoute === 'home' || currentRoute === 'services') && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
            onSelectService={(slug) => handleNavigate(`service-${slug}`)}
          />
        )}

        {currentRoute.startsWith('service-') && currentService && (
          <ServiceDetailPage
            service={currentService}
            onOpenConsultation={() =>
              handleOpenConsultation(currentService.title, currentService.category)
            }
            onNavigateToPortal={() => handleNavigate('document-portal')}
          />
        )}

        {currentRoute.startsWith('service-') && !currentService && (
          <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Visa Service Not Found</h1>
            <p className="text-slate-300">The visa category or file preparation service you requested is not available.</p>
            <div className="flex justify-center gap-4">
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); handleNavigate('services'); }}
                className="bg-[#C5A059] text-[#061F40] font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Browse All Services
              </a>
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
                className="bg-[#07244A] border border-[#15488A] text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Return to Home
              </a>
            </div>
          </div>
        )}

        {currentRoute === 'blogs' && (
          <BlogsPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}

        {currentRoute.startsWith('blog-') && currentBlogPost && (
          <BlogDetailPage
            post={currentBlogPost}
            onNavigate={handleNavigate}
            onOpenConsultation={(country) => handleOpenConsultation(country)}
          />
        )}

        {currentRoute.startsWith('blog-') && !currentBlogPost && (
          <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Article Not Found</h1>
            <p className="text-slate-300">The visa guide or embassy advisory article you are looking for has moved or does not exist.</p>
            <div className="flex justify-center gap-4">
              <a
                href="/blogs"
                onClick={(e) => { e.preventDefault(); handleNavigate('blogs'); }}
                className="bg-[#C5A059] text-[#061F40] font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                View All Visa Guides
              </a>
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
                className="bg-[#07244A] border border-[#15488A] text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Return to Home
              </a>
            </div>
          </div>
        )}

        {(currentRoute === 'document-portal' || currentRoute === 'visa-tracker' || currentRoute === 'tracker') && (
          <DocumentPortalPage
            initialTab={currentRoute === 'document-portal' ? 'submit' : 'track'}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}

        {(currentRoute === 'assessment' || currentRoute === 'quiz') && (
          <EligibilityHubPage
            initialTab={currentRoute === 'quiz' ? 'quiz' : 'calculator'}
            onOpenConsultation={(country, category) => handleOpenConsultation(country, category)}
            onNavigateToServices={(slug) => handleNavigate(`service-${slug}`)}
          />
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

