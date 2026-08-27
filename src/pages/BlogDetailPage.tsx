import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Plane,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Phone,
  FileText
} from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogsData';

interface BlogDetailPageProps {
  post: BlogPost;
  onNavigate: (route: string) => void;
  onOpenConsultation: (country?: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  post,
  onNavigate,
  onOpenConsultation
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-[#092E5E] text-[#F3F4F6] pb-20">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="bg-[#061F40] border-b border-[#0C356A] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <button
            onClick={() => onNavigate('blogs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Visa Guides & Knowledge Hub</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#93C5FD]">
            <span className="bg-[#C5A059] text-[#042354] font-extrabold px-3 py-1 rounded-full text-xs">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              {post.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              {post.readTime}
            </span>
            <span>•</span>
            <span className="text-[#D1D5DB]">Target: {post.targetCountry}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-5xl">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-4xl leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Card & Share Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#0F3669]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#042354] border-2 border-[#C5A059] overflow-hidden">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{post.author.name}</div>
                <div className="text-[11px] text-[#C5A059] font-medium">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#07244A] hover:bg-[#0B356D] text-white border border-[#15488A] px-3.5 py-2 rounded-lg transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Share Guide</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenConsultation(post.targetCountry)}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] px-4 py-2 rounded-lg shadow transition-all cursor-pointer"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Evaluate My File</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BODY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Article Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#15488A] h-72 sm:h-96 relative">
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              title={post.featuredImage.title}
              width={1200}
              height={800}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061F40]/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-xs text-white/90 font-medium italic">
              {post.featuredImage.title}
            </div>
          </div>

          {/* Key Takeaways Highlight Box */}
          <div className="bg-[#07244A] border-2 border-[#C5A059] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#042354] flex items-center justify-center font-black text-sm">
                ★
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Key Strategic Takeaways (Executive Summary)
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {post.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D1D5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span className="leading-snug">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-[#061F40] border border-[#123A6D] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Table of Contents
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {post.tableOfContents.map((toc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#93C5FD]">
                  <span className="text-[#C5A059] font-bold">{idx + 1}.</span>
                  <span className="hover:text-white transition-colors">{toc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Sections */}
          <div className="space-y-10 text-sm leading-relaxed text-[#D1D5DB]">
            {post.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight border-b border-[#0F3669] pb-2">
                  {section.heading}
                </h2>

                {section.subheading && (
                  <h3 className="text-base font-bold text-[#C5A059]">
                    {section.subheading}
                  </h3>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm leading-relaxed text-[#D1D5DB]">
                    {p}
                  </p>
                ))}

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pl-2 pt-1">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#D1D5DB]">
                        <span className="text-[#C5A059] font-bold text-sm leading-none">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.calloutBox && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                      section.calloutBox.type === 'warning'
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                        : section.calloutBox.type === 'tip'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-[#0B356D]/50 border-[#15488A] text-[#BFDBFE]'
                    }`}
                  >
                    {section.calloutBox.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : section.calloutBox.type === 'tip' ? (
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="font-bold block mb-0.5">
                        {section.calloutBox.type === 'warning'
                          ? 'Critical Warning for Pakistani Applicants:'
                          : section.calloutBox.type === 'tip'
                          ? 'VartiMax Pro Tip:'
                          : 'Official Embassy Protocol:'}
                      </strong>
                      <span>{section.calloutBox.text}</span>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="pt-6 border-t border-[#0C356A] space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Frequently Asked Questions ({post.targetCountry})
              </h2>

              <div className="space-y-3">
                {post.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="bg-[#07244A] border border-[#15488A] rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(openFaqIdx === fIdx ? null : fIdx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#C5A059] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {openFaqIdx === fIdx ? (
                        <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#93C5FD] shrink-0" />
                      )}
                    </button>
                    {openFaqIdx === fIdx && (
                      <div className="px-4 pb-4 text-xs text-[#D1D5DB] leading-relaxed border-t border-[#10386B] pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Card */}
          <div className="bg-[#07244A] border border-[#15488A] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-[#042354] border-2 border-[#C5A059] overflow-hidden shrink-0">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                Article Author & Case Officer
              </div>
              <div className="text-base font-bold text-white">{post.author.name}</div>
              <div className="text-xs text-[#93C5FD]/80">{post.author.role} at VartiMax Consultant Islamabad</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed pt-1">
                Specializes in complex embassy file documentation, financial solvency justification, and visa refusal remonstrations for Pakistani professionals and families.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Conversion Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Consultation Card */}
            <div className="bg-[#07244A] border-2 border-[#C5A059] rounded-2xl p-6 shadow-2xl space-y-5 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full border border-[#C5A059]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>90% VISA APPROVAL RATE</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  Applying for {post.targetCountry}?
                </h3>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  Have your bank statement, ties to Pakistan, and cover letter audited by senior consultants before embassy submission.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenConsultation(post.targetCountry)}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plane className="w-4 h-4 text-[#042354]" />
                  <span>Book Free Consultation</span>
                </button>

                <button
                  onClick={() => onNavigate('assessment')}
                  className="w-full bg-[#061F40] hover:bg-[#0C356A] text-white border border-[#15488A] font-bold py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Calculate Visa Score</span>
                </button>

                <a
                  href={`https://wa.me/923401207525?text=Hello%20VartiMax,%20I%20read%20your%20article%20on%20${encodeURIComponent(post.title)}%20and%20need%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="pt-3 border-t border-[#123A6D] text-[11px] text-[#93C5FD]/80 flex items-center justify-center gap-2">
                <span>📍 Gaga Downtown, Islamabad</span>
              </div>
            </div>

            {/* Quick Link to Dedicated Visa Service (if available) */}
            {post.relatedServiceSlug && (
              <div
                onClick={() => onNavigate(`service-${post.relatedServiceSlug}`)}
                className="bg-[#061F40] border border-[#15488A] hover:border-[#C5A059] rounded-2xl p-5 space-y-2 cursor-pointer transition-all group"
              >
                <div className="text-[11px] font-bold uppercase text-[#C5A059]">
                  Related Service Page
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors flex items-center justify-between">
                  <span>Explore Full {post.targetCountry} Visa Package</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </div>
                <p className="text-xs text-[#93C5FD]/80">
                  View complete checklists, embassy fees, processing times, and file creation steps.
                </p>
              </div>
            )}

            {/* AI Generator Promo */}
            <div
              onClick={() => onNavigate('ai-file-assistant')}
              className="bg-gradient-to-br from-[#061F40] to-[#0B356D] border border-[#15488A] rounded-2xl p-5 space-y-3 cursor-pointer hover:border-[#C5A059] transition-all"
            >
              <div className="flex items-center gap-2 text-[#C5A059]">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Free AI Tool</span>
              </div>
              <div className="text-sm font-bold text-white">
                Generate Embassy Cover Letter in 60 Seconds
              </div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Powered by Gemini AI trained on Islamabad embassy acceptance standards.
              </p>
              <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1">
                <span>Try AI Cover Letter Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 border-t border-[#0C356A] mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Related Embassy Guides & Advice
            </h2>
            <button
              onClick={() => onNavigate('blogs')}
              className="text-xs font-bold text-[#C5A059] hover:text-white transition-colors cursor-pointer"
            >
              View All Guides →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <div
                key={rPost.id}
                onClick={() => onNavigate(`blog-${rPost.slug}`)}
                className="bg-[#07244A] rounded-2xl overflow-hidden border border-[#15488A] hover:border-[#C5A059] transition-all shadow cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={rPost.featuredImage.src}
                      alt={rPost.featuredImage.alt}
                      title={rPost.featuredImage.title}
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-[#042354]/90 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {rPost.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2">
                      {rPost.title}
                    </h3>
                    <p className="text-xs text-[#D1D5DB] line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-[#123A6D] flex items-center justify-between text-xs text-[#93C5FD]">
                  <span>{rPost.readTime}</span>
                  <span className="font-bold text-[#C5A059] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
