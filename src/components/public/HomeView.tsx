import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadPdf, downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { SharePaperModal } from '../common/SharePaperModal';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  ArrowRight, 
  Calendar, 
  User, 
  Bell, 
  Award, 
  BarChart2, 
  Quote, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles,
  Copy,
  Check,
  Send,
  ShieldCheck,
  FileCheck,
  Globe,
  Clock,
  TrendingUp,
  Inbox,
  HelpCircle,
  Share2,
  ChevronRight,
  Bookmark,
  CheckCircle,
  FileSpreadsheet,
  Building,
  GraduationCap
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    lang, 
    settings, 
    articles, 
    issues, 
    announcements, 
    pages, 
    editorialMembers, 
    setActiveView, 
    setSelectedArticleId,
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads
  } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [citationModalArticle, setCitationModalArticle] = useState<any | null>(null);
  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeArticleTab, setActiveArticleTab] = useState<'current' | 'recent' | 'trending'>('current');

  // Find current issue
  const currentIssue = issues.find(i => i.status === 'current') || issues[0];
  
  // Current issue articles
  const currentArticles = currentIssue 
    ? articles.filter(a => a.volume === currentIssue.volume && a.issue === currentIssue.issue_number && a.status === 'published')
    : articles.slice(0, 4);

  // Featured/Recent articles
  const publishedArticles = articles.filter(a => a.status === 'published');

  const trendingArticles = [...publishedArticles]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 6);

  const handleArticleClick = (artId: string) => {
    setSelectedArticleId(artId);
    incrementArticleViews(artId);
    setActiveView('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfDownload = (e: React.MouseEvent, artId: string, pdfUrl: string, title?: string) => {
    e.stopPropagation();
    incrementArticleDownloads(artId);
    downloadPdf(pdfUrl, title || 'article.pdf');
  };

  const handlePdfView = (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    incrementArticleViews(art.id);
    openPdfViewer(art.pdf_url || '', lang === 'hi' ? art.title_hindi : art.title_english);
  };

  const copyCitation = (art: any, format: 'apa' | 'mla' | 'bibtex' | 'ris') => {
    const authors = art.authors.map((a: any) => a.name).join(', ');
    const year = art.year || '2026';
    const title = art.title_english || art.title_hindi;
    const journal = 'Pawari Shodh Patrika';
    const vol = art.volume || '1';
    const issue = art.issue || '1';
    const pages = art.page_numbers || '1-10';
    const doi = art.doi || '10.5281/zenodo.123456';

    let text = '';
    if (format === 'apa') {
      text = `${authors} (${year}). ${title}. ${journal}, ${vol}(${issue}), ${pages}. https://doi.org/${doi}`;
    } else if (format === 'mla') {
      text = `${authors}. "${title}." ${journal}, vol. ${vol}, no. ${issue}, ${year}, pp. ${pages}.`;
    } else if (format === 'bibtex') {
      text = `@article{psp${art.id},\n  author = {${authors}},\n  title = {${title}},\n  journal = {${journal}},\n  volume = {${vol}},\n  number = {${issue}},\n  pages = {${pages}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
    } else if (format === 'ris') {
      text = `TY  - JOUR\nAU  - ${authors}\nTI  - ${title}\nJO  - ${journal}\nVL  - ${vol}\nIS  - ${issue}\nSP  - ${pages}\nPY  - ${year}\nDO  - ${doi}\nER  -`;
    }

    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const activeAnnouncements = announcements.filter(a => a.is_active);

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-4 sm:space-y-8 pt-2 sm:pt-4">
        
        {/* 2. Main Academic Hero Section */}
        <div 
          className="relative text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 shadow-xl sm:shadow-2xl border border-amber-500/30 overflow-hidden"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-red-900/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 sm:space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-amber-500/20 text-amber-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-400/40 text-[11px] sm:text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>
                {lang === 'hi' 
                  ? 'अंतर्राष्ट्रीय बहुविषयी शोध पत्रिका (International Refereed Journal)' 
                  : 'An International Peer-Reviewed Refereed Multidisciplinary Journal'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-100 tracking-tight leading-tight">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-lg text-amber-200/90 font-serif max-w-3xl mx-auto leading-relaxed italic">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>

            {/* Scholarly Search Bar */}
            <div className="pt-1 sm:pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveView('articles');
                    }
                  }}
                  placeholder={lang === 'hi' ? 'शोध पत्र शीर्षक, लेखक नाम या कीवर्ड से खोजें...' : 'Search title, author, topic or keyword...'}
                  className="w-full pl-9 sm:pl-12 pr-20 sm:pr-28 py-2.5 sm:py-3.5 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-lg sm:rounded-xl border-2 border-amber-400 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <button
                  onClick={() => setActiveView('articles')}
                  className="absolute right-1.5 px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-md sm:rounded-lg transition shadow-xs flex items-center space-x-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'खोजें' : 'Search'}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Badges & CTAs */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveView('submit_manuscript')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{lang === 'hi' ? 'पांडुलिपि सबमिट करें' : 'Submit Manuscript'}</span>
              </button>

              <button
                onClick={() => setActiveView('current_issue')}
                className="px-3.5 sm:px-5 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-amber-100 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-amber-400/40 transition flex items-center space-x-1.5 backdrop-blur-xs"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'वर्तमान अंक' : 'Current Issue'}</span>
              </button>

              <button
                onClick={() => setActiveView('author_guidelines')}
                className="px-3.5 sm:px-5 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-amber-100 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-amber-400/40 transition flex items-center space-x-1.5 backdrop-blur-xs"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'दिशा-निर्देश' : 'Guidelines'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* 3. Live Announcement Ticker */}
        {activeAnnouncements.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 shadow-2xs">
            <div className="flex items-center space-x-2 bg-red-950 text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-xl flex-shrink-0 border border-amber-500/30">
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{lang === 'hi' ? 'ताजा सूचना' : 'Call for Papers / Notice'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
                {lang === 'hi' ? activeAnnouncements[0].title_hindi : activeAnnouncements[0].title_english} — {' '}
                <span className="text-slate-700 font-normal">
                  {lang === 'hi' ? activeAnnouncements[0].content_hindi : activeAnnouncements[0].content_english}
                </span>
              </p>
            </div>
            <button 
              onClick={() => setActiveView('author_guidelines')} 
              className="text-xs font-bold text-red-900 hover:text-red-700 hover:underline flex-shrink-0 flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'पूर्ण विवरण देखें' : 'View Submission Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 4. Journal Performance Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-red-950 flex items-center justify-center flex-shrink-0 font-bold">
              <Clock className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-mono uppercase">First Decision</p>
              <p className="text-lg font-serif font-bold text-slate-900">12 Days</p>
              <p className="text-[10px] text-slate-400">Fast-track peer review</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center flex-shrink-0 font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-mono uppercase">Acceptance Rate</p>
              <p className="text-lg font-serif font-bold text-slate-900">28.4%</p>
              <p className="text-[10px] text-slate-400">Rigorous peer selection</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center flex-shrink-0 font-bold">
              <Globe className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-mono uppercase">Frequency</p>
              <p className="text-lg font-serif font-bold text-slate-900">Quarterly</p>
              <p className="text-[10px] text-slate-400">4 Issues per annum</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-mono uppercase">Access Model</p>
              <p className="text-lg font-serif font-bold text-slate-900">Gold Open Access</p>
              <p className="text-[10px] text-slate-400">Zero subscription fees</p>
            </div>
          </div>
        </div>

        {/* 5. Main Content Area (70%) + Right Sidebar (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (8 cols = ~67%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Current Issue Section */}
            {currentIssue && (
              <div className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase font-bold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                      {lang === 'hi' ? 'वर्तमान अंक' : 'Current Issue'}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">
                      {lang === 'hi' ? currentIssue.title_hindi : currentIssue.title_english}
                    </h2>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Volume {currentIssue.volume}, Issue {currentIssue.issue_number} ({currentIssue.year}) • ISSN {settings.issn_online}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('current_issue')}
                    className="self-start sm:self-center px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>{lang === 'hi' ? 'पूरा अंक देखें' : 'View Full Issue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Issue Cover Card */}
                  <div className="md:col-span-4 space-y-3 text-center">
                    <div className="w-36 sm:w-full mx-auto relative aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg border-2 border-amber-400/50 bg-red-950 group">
                      <SafeImage 
                        src={currentIssue.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'} 
                        alt="Issue Cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-amber-100 text-left">
                        <span className="text-[10px] font-mono uppercase bg-amber-500 text-red-950 px-2 py-0.5 rounded font-bold self-start mb-1">
                          Refereed Issue
                        </span>
                        <span className="text-sm font-serif font-bold">Vol. {currentIssue.volume}, No. {currentIssue.issue_number}</span>
                        <span className="text-xs text-amber-200">{currentIssue.year}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('current_issue')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition"
                    >
                      {lang === 'hi' ? 'विषय-सूची (Table of Contents)' : 'Table of Contents'}
                    </button>
                  </div>

                  {/* Articles List */}
                  <div className="md:col-span-8 space-y-3">
                    <h3 className="text-xs font-serif font-bold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                      <span>{lang === 'hi' ? 'इस अंक के प्रमुख शोध पत्र' : 'Articles in this Issue'}</span>
                      <span className="text-slate-400 text-[10px] font-mono">{currentArticles.length} Papers</span>
                    </h3>

                    <div className="space-y-3">
                      {currentArticles.map((art) => (
                        <div 
                          key={art.id}
                          onClick={() => handleArticleClick(art.id)}
                          className="bg-slate-50 hover:bg-amber-50/60 p-4 rounded-xl border border-slate-200 hover:border-amber-400/60 cursor-pointer transition space-y-2 group"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                            <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                              {art.category}
                            </span>
                            <span className="text-slate-500">
                              pp. {art.page_numbers || '1-12'} • DOI: {art.doi || '10.5281/zenodo'}
                            </span>
                          </div>

                          <h4 className="text-sm font-serif font-bold text-slate-900 group-hover:text-red-950 transition leading-snug">
                            {lang === 'hi' ? art.title_hindi : art.title_english}
                          </h4>

                          <p className="text-xs text-slate-600 font-medium">
                            {art.authors.map(a => a.name).join(', ')}
                          </p>

                          <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/60">
                            <span className="text-[11px] text-slate-500 font-mono">
                              Views: {art.views_count || 0}
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShareModalArticle(art);
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-semibold rounded border border-emerald-300/80 transition flex items-center space-x-1"
                              >
                                <Share2 className="w-3 h-3 text-emerald-700" />
                                <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCitationModalArticle(art);
                                }}
                                className="px-2 py-1 bg-white hover:bg-amber-100 text-slate-800 text-[11px] font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                              >
                                <Quote className="w-3 h-3 text-amber-700" />
                                <span>Cite</span>
                              </button>
                              <button
                                onClick={(e) => handlePdfView(e, art)}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3 text-slate-600" />
                                <span>PDF</span>
                              </button>
                              <button
                                onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-[11px] font-bold rounded transition flex items-center space-x-1"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Research Repository Section with Tabs */}
            <div className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest font-mono">
                    {lang === 'hi' ? 'अकादमिक संग्रह' : 'Academic Repository'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {lang === 'hi' ? 'प्रकाशित शोध पत्र' : 'Featured Research Papers'}
                  </h2>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold font-mono">
                  <button
                    onClick={() => setActiveArticleTab('current')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeArticleTab === 'current'
                        ? 'bg-amber-500 text-red-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'वर्तमान अंक' : 'Current Issue'}
                  </button>
                  <button
                    onClick={() => setActiveArticleTab('recent')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeArticleTab === 'recent'
                        ? 'bg-amber-500 text-red-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'नवीनतम शोध पत्र' : 'Recent Papers'}
                  </button>
                  <button
                    onClick={() => setActiveArticleTab('trending')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeArticleTab === 'trending'
                        ? 'bg-amber-500 text-red-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Viewed'}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activeArticleTab === 'trending' ? trendingArticles : publishedArticles.slice(0, 6)).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleArticleClick(art.id)}
                    className="bg-slate-50 hover:bg-amber-50/60 p-5 rounded-2xl border border-slate-200 hover:border-amber-400/60 shadow-2xs hover:shadow-md cursor-pointer transition space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                          Vol {art.volume} No {art.issue} ({art.year})
                        </span>
                        <div className="flex items-center space-x-1 text-slate-500 font-mono text-[11px]">
                          <span>DOI:</span>
                          <a
                            href={`https://doi.org/${art.doi || '10.5281/zenodo'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-amber-700 hover:underline flex items-center space-x-0.5"
                          >
                            <span>{art.doi || '10.5281/zenodo'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-slate-900 group-hover:text-red-950 text-base leading-snug">
                        {lang === 'hi' ? art.title_hindi : art.title_english}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {art.authors[0]?.name} {art.authors.length > 1 ? 'et al.' : ''}
                      </span>

                      <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareModalArticle(art);
                          }}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-sans font-semibold rounded border border-emerald-300/80 transition flex items-center space-x-1"
                        >
                          <Share2 className="w-3 h-3 text-emerald-700" />
                          <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCitationModalArticle(art);
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-amber-100 text-slate-800 font-sans font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                        >
                          <Quote className="w-3 h-3 text-amber-700" />
                          <span>Cite</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{art.views_count || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>{art.downloads_count || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveView('articles')}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-100 font-bold text-xs rounded-xl transition inline-flex items-center space-x-2 shadow-xs"
                >
                  <span>{lang === 'hi' ? 'सभी शोध पत्र संग्रह देखें' : 'Explore Complete Article Repository'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Aims, Scope & Publication Ethics Banner */}
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-500/30 space-y-4">
              <div className="flex items-center space-x-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>{lang === 'hi' ? 'उद्देश्य एवं शोध दायरा' : 'Journal Aim, Scope & Publication Ethics'}</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-amber-100">
                {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
              </h3>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {lang === 'hi'
                  ? 'यह अंतर्राष्ट्रीय शोध पत्रिका पवारी भाषा, लोकसंस्कृति, साहित्य, इतिहास, समाजशास्त्र एवं मध्य भारतीय जनजातीय अध्ययन पर मूल शोध पत्रों, समीक्षा लेखों तथा शोध टिप्पणियों को प्रकाशित करती है। सभी पांडुलिपियों का मूल्यांकन डबल-ब्लाइंड पीर रिव्यु प्रक्रिया द्वारा किया जाता है।'
                  : 'This international journal publishes original research articles, review papers, and critical monographs in Pawari linguistics, Central Indian folklore, cultural anthropology, literature, and social sciences. Adhering strictly to COPE (Committee on Publication Ethics) guidelines.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
                <button
                  onClick={() => setActiveView('about')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition"
                >
                  {lang === 'hi' ? 'पूरा दायरा देखें' : 'Read Full Scope'}
                </button>
                <button
                  onClick={() => setActiveView('author_guidelines')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-100 rounded-xl border border-amber-400/40 transition"
                >
                  {lang === 'hi' ? 'प्रकाशन नीति' : 'Publication Ethics'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column (4 cols = ~33%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Submit Manuscript CTA Box */}
            {(settings.call_for_papers?.is_active !== false) && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-red-950 rounded-3xl p-6 shadow-md space-y-4 border border-amber-400">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase bg-red-950 text-amber-300 px-2.5 py-1 rounded-md">
                    {lang === 'hi' 
                      ? (settings.call_for_papers?.title_badge_hindi || 'शोध पत्र आमंत्रण 2026') 
                      : (settings.call_for_papers?.title_badge_english || 'Call for Papers 2026')}
                  </span>
                  <Inbox className="w-5 h-5 text-red-950" />
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-red-950 leading-snug">
                    {lang === 'hi' 
                      ? (settings.call_for_papers?.heading_hindi || 'शोध पत्र सबमिशन हेतु आमंत्रण') 
                      : (settings.call_for_papers?.heading_english || 'Submit Manuscript for Next Issue')}
                  </h3>
                  <p className="text-xs text-red-950/80 font-medium mt-1 leading-relaxed">
                    {lang === 'hi' 
                      ? (settings.call_for_papers?.description_hindi || 'त्वरित 14-दिवसीय डबल ब्लाइंड पीर-रिव्यू प्रक्रिया। शून्य लेख प्रसंस्करण शुल्क (APC) विकल्प उपलब्ध।') 
                      : (settings.call_for_papers?.description_english || 'Fast-Track 14-day double blind peer review process. Zero Article Processing Charge (APC) option available.')}
                  </p>
                </div>

                <div className="bg-red-950/10 p-3 rounded-xl border border-red-950/20 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>{lang === 'hi' ? 'अंतिम तिथि (Deadline):' : 'Submission Deadline:'}</span>
                    <strong className="text-red-950">
                      {settings.call_for_papers?.deadline_date || '15th September'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'hi' ? 'लक्ष्य अंक (Target Issue):' : 'Target Publication:'}</span>
                    <strong className="text-red-950">
                      {settings.call_for_papers?.target_volume_issue || 'Vol. 4 Issue 2'}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('submit_manuscript')}
                  className="w-full py-3 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'सबमिट पांडुलिपि (Online Submit)' : 'Submit Online Now'}</span>
                </button>
              </div>
            )}

            {/* Author Downloads Box */}
            <div className="bg-white border border-amber-900/15 rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-serif font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-red-900" />
                <span>{lang === 'hi' ? 'लेखक संसाधन एवं टेम्पलेट' : 'Author Downloads'}</span>
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 text-slate-800 text-left font-semibold transition flex items-center justify-between cursor-pointer group"
                >
                  <span className="group-hover:text-amber-900">Manuscript Template (.DOCX)</span>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-700" />
                </button>

                <button
                  onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 text-slate-800 text-left font-semibold transition flex items-center justify-between cursor-pointer group"
                >
                  <span className="group-hover:text-amber-900">Copyright Transfer Form (.PDF/.DOC)</span>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-700" />
                </button>

                <button
                  onClick={() => setActiveView('author_guidelines')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 text-slate-800 text-left font-semibold transition flex items-center justify-between cursor-pointer group"
                >
                  <span className="group-hover:text-amber-900">Plagiarism Policy Guidelines</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-700" />
                </button>
              </div>
            </div>

            {/* Indexing Badges Card */}
            <div className="bg-white border border-amber-900/15 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-serif font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'इंडेक्सिंग एवं डेटाबेस' : 'Indexing & Databases'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-center text-[11px] font-mono font-bold">
                <div className="p-2.5 bg-amber-50/50 hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-amber-950 transition shadow-2xs">
                  Google Scholar
                </div>
                <div className="p-2.5 bg-amber-50/50 hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-amber-950 transition shadow-2xs">
                  Zenodo
                </div>
                <div className="p-2.5 bg-amber-50/50 hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-amber-950 transition shadow-2xs">
                  ResearchGate
                </div>
                <div className="p-2.5 bg-amber-50/50 hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-amber-950 transition shadow-2xs">
                  Academia.edu
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  Crossref DOI
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  Open Access
                </div>
              </div>
            </div>

            {/* Editorial Board Spotlight Teaser */}
            <div className="bg-white border border-amber-900/15 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-serif font-bold text-slate-800 uppercase tracking-wider">
                  {lang === 'hi' ? 'संपादकीय नेतृत्व' : 'Editorial Leadership'}
                </h3>
                <button
                  onClick={() => setActiveView('editorial_board')}
                  className="text-[11px] font-bold text-red-900 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {editorialMembers.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center space-x-3 text-xs">
                    <SafeImage 
                      src={m.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} 
                      alt={m.name_english} 
                      className="w-10 h-10 rounded-full object-cover border border-amber-400"
                      fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    />
                    <div>
                      <p className="font-serif font-bold text-slate-900">{m.name_english}</p>
                      <p className="text-[10px] text-red-900 font-semibold">{m.role}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{m.affiliation_english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 6. Citation Modal */}
      {citationModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-amber-400/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Quote className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-slate-900 text-base">Cite Article Format</h3>
              </div>
              <button 
                onClick={() => setCitationModalArticle(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-mono">Article Title:</p>
              <p className="text-sm font-serif font-bold text-slate-900 mt-0.5">
                {lang === 'hi' ? citationModalArticle.title_hindi : citationModalArticle.title_english}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">APA (7th Edition)</span>
                  <button
                    onClick={() => copyCitation(citationModalArticle, 'apa')}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1"
                  >
                    {copiedFormat === 'apa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'apa' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors.map((a: any) => a.name).join(', ')} ({citationModalArticle.year || '2026'}). {citationModalArticle.title_english || citationModalArticle.title_hindi}. Pawari Shodh Patrika, {citationModalArticle.volume}({citationModalArticle.issue}), {citationModalArticle.page_numbers || '1-10'}. https://doi.org/{citationModalArticle.doi || '10.5281/zenodo'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">MLA (9th Edition)</span>
                  <button
                    onClick={() => copyCitation(citationModalArticle, 'mla')}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1"
                  >
                    {copiedFormat === 'mla' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'mla' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors.map((a: any) => a.name).join(', ')}. "{citationModalArticle.title_english || citationModalArticle.title_hindi}." Pawari Shodh Patrika, vol. {citationModalArticle.volume}, no. {citationModalArticle.issue}, {citationModalArticle.year || '2026'}, pp. {citationModalArticle.page_numbers || '1-10'}.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCitation(citationModalArticle, 'bibtex')}
                  className="flex-1 py-2 bg-slate-900 text-amber-100 font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BibTeX</span>
                </button>
                <button
                  onClick={() => copyCitation(citationModalArticle, 'ris')}
                  className="flex-1 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border hover:bg-slate-200 transition flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download RIS</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Share Modal */}
      <SharePaperModal
        article={shareModalArticle}
        isOpen={!!shareModalArticle}
        onClose={() => setShareModalArticle(null)}
        lang={lang}
      />

    </div>
  );
};
