import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Plane,
  Tag
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogsData';
import { BlogPost } from '../types';

interface BlogsPageProps {
  onNavigate: (route: string) => void;
  onOpenConsultation: () => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Schengen Visa',
    'Canada Visa',
    'USA Visa',
    'UK Study',
    'Umrah & Saudi',
    'Refusal Solutions'
  ];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.targetCountry.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-[#092E5E] text-[#F3F4F6] pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative py-14 sm:py-18 px-4 sm:px-8 bg-gradient-to-b from-[#061F40] via-[#07244A] to-[#092E5E] border-b border-[#0C356A]">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>VartiMax Visa Knowledge Hub & Embassy Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Pakistan's Premier Visa & Immigration <span className="text-[#C5A059]">Intelligence Hub</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-2xl mx-auto leading-relaxed">
            In-depth embassy file checklists, bank statement formulas, interview strategies, and policy updates curated by senior visa consultants in Islamabad.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Schengen, Canada SDS, US B1/B2, Bank Balance, Cover Letter..."
                className="w-full bg-white text-[#042354] pl-12 pr-4 py-3.5 rounded-xl shadow-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C5A059] text-[#042354] shadow-md shadow-[#C5A059]/20'
                    : 'bg-[#07244A] text-[#93C5FD] border border-[#15488A] hover:border-[#C5A059]/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE BANNER (If viewing All and no search) */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
          <div
            onClick={() => onNavigate(`blog-${featuredPost.slug}`)}
            className="bg-[#07244A] border-2 border-[#C5A059]/40 rounded-2xl overflow-hidden shadow-2xl hover:border-[#C5A059] transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={featuredPost.featuredImage.src}
                alt={featuredPost.featuredImage.alt}
                title={featuredPost.featuredImage.title}
                width={1200}
                height={800}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#C5A059] text-[#042354] font-black text-xs px-3 py-1 rounded-full shadow-lg">
                FEATURED EMBASSY GUIDE
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#93C5FD]">
                  <span className="font-bold text-[#C5A059] bg-[#C5A059]/15 px-2.5 py-0.5 rounded border border-[#C5A059]/30">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    {featuredPost.publishedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#C5A059] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Key takeaways bullet pills */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-bold uppercase text-[#C5A059] tracking-wider">
                    Core Insights:
                  </div>
                  {featuredPost.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#D1D5DB]">
                      <span className="text-[#C5A059] font-bold">✓</span>
                      <span className="line-clamp-1">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#123A6D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#042354] border border-[#C5A059] overflow-hidden">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{featuredPost.author.name}</div>
                    <div className="text-[10px] text-[#93C5FD]/80">{featuredPost.author.role}</div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. ARTICLES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 space-y-8">
        <div className="flex items-center justify-between border-b border-[#0C356A] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {selectedCategory === 'All'
                ? searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Visa Guides & Expert Insights'
                : `${selectedCategory} Guides`}
            </h2>
            <p className="text-xs text-[#93C5FD]/80 pt-1">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} with Pakistan embassy-specific verification
            </p>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#07244A] rounded-2xl border border-[#15488A] space-y-4 p-8">
            <BookOpen className="w-12 h-12 text-[#C5A059] mx-auto opacity-75" />
            <h3 className="text-lg font-bold text-white">No articles matched your search</h3>
            <p className="text-xs text-[#D1D5DB] max-w-md mx-auto">
              Try searching for common terms like "Schengen", "Canada", "US Interview", or "Bank Balance".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#C5A059] text-[#042354] font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onNavigate(`blog-${post.slug}`)}
                className="bg-[#07244A] rounded-2xl overflow-hidden border border-[#15488A] hover:border-[#C5A059] transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage.src}
                      alt={post.featuredImage.alt}
                      title={post.featuredImage.title}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#042354]/90 backdrop-blur-sm text-[#C5A059] border border-[#C5A059]/40 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-[#93C5FD]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        {post.publishedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#D1D5DB] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#061F40] text-[#93C5FD] px-2 py-0.5 rounded border border-[#123A6D]"
                        >
                          <Tag className="w-2.5 h-2.5 text-[#C5A059]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#123A6D] flex items-center justify-between bg-[#061F40]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#042354] border border-[#C5A059] overflow-hidden">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-white truncate max-w-[120px]">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. BOTTOM ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
        <div className="bg-gradient-to-r from-[#061F40] via-[#07244A] to-[#042354] rounded-2xl p-8 sm:p-12 border-2 border-[#C5A059]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#C5A059] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ISLAMABAD EMBASSY FILE VERIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Need Personalized File Structuring for Your Application?
            </h2>
            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
              Don't risk an Annex II refusal or 214(b) rejection. Book a one-on-one session with our senior case officers at Gaga Downtown, Islamabad or connect via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#042354] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Plane className="w-4 h-4 text-[#042354]" />
              <span>Book Free Visa Consultation</span>
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="bg-[#092E5E] hover:bg-[#0B356D] text-white border border-[#15488A] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Check Eligibility Score (60 Secs)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
