import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
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
  Quote, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Globe,
  Share2,
  ChevronRight,
  Building,
  GraduationCap,
  Mail,
  MapPin,
  Send,
  Copy,
  Check,
  Sparkles,
  Inbox,
  Clock,
  Layers,
  Award,
  BookMarked,
  HelpCircle,
  Music,
  Book
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    lang, 
    settings, 
    articles, 
    issues, 
    editorialMembers, 
    setActiveView, 
    setSelectedArticleId,
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads,
    searchQuery: globalSearchQuery,
    setSearchQuery: setGlobalSearchQuery
  } = useCms();

  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');
  const [citationModalArticle, setCitationModalArticle] = useState<any | null>(null);
  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGlobalSearchQuery(searchQuery);
    setActiveView('articles');
  };

  // Identify current issue
  const currentIssue = issues.find(i => i.status === 'current') || issues[0];
  
  // Articles in the current issue (published)
  const currentIssueArticles = currentIssue 
    ? articles.filter(a => a.volume === currentIssue.volume && a.issue === currentIssue.issue_number && a.status === 'published')
    : articles.filter(a => a.status === 'published').slice(0, 3);

  // Top 3 featured papers for current issue block
  const featuredArticles = currentIssueArticles.length >= 3 
    ? currentIssueArticles.slice(0, 3) 
    : articles.filter(a => a.status === 'published').slice(0, 3);

  // Latest published articles for Section 5 (3-4 items)
  const publishedArticles = articles
    .filter(a => a.status === 'published')
    .slice(0, 4);

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
    const authors = art.authors ? art.authors.map((a: any) => a.name).join(', ') : 'Author';
    const year = art.year || '2026';
    const title = art.title_english || art.title_hindi;
    const journal = 'Pawari Shodh Patrika';
    const vol = art.volume || '1';
    const issue = art.issue || '1';
    const pages = art.page_numbers || '1-10';
    const doi = art.doi || '10.5281/zenodo.18490543';

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

  // Featured editorial leadership (top 4)
  const topEditors = (editorialMembers && editorialMembers.length > 0)
    ? editorialMembers.slice(0, 4)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-8 pt-2 sm:pt-4">

        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section className="relative text-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-amber-500/30 overflow-hidden bg-[var(--color-brand-primary,#420708)]">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-red-900/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Publisher Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-semibold tracking-wide">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </span>
            </div>

            {/* Main Journal Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-100 tracking-tight leading-tight">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-lg text-amber-200/90 font-serif max-w-3xl mx-auto leading-relaxed italic">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'शोध पत्र शीर्षक, लेखक या विषय से खोजें...' : 'Search research article by title, author, or keyword...'}
                  className="w-full pl-10 pr-24 py-3 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl border-2 border-amber-400 shadow-md focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'खोजें' : 'Search'}</span>
                </button>
              </div>
            </form>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={getUrlForView('current_issue')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('current_issue');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'hi' ? 'वर्तमान अंक पढ़ें' : 'Read Current Issue'}</span>
              </a>

              <a
                href={getUrlForView('submit_manuscript')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('submit_manuscript');
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 transition flex items-center space-x-2 backdrop-blur-xs"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'लेख भेजें' : 'Submit Article'}</span>
              </a>
            </div>

          </div>
        </section>

        {/* ==========================================
            2. TRUST / JOURNAL HIGHLIGHTS SECTION
            ========================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-700 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">{lang === 'hi' ? 'पियर-रिव्यूड' : 'Peer-Reviewed'}</strong>
            <span className="text-[10px] text-slate-500 block">Double-Blind</span>
          </div>

          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <Globe className="w-5 h-5 text-blue-700 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">{lang === 'hi' ? 'ओपन एक्सेस' : 'Open Access'}</strong>
            <span className="text-[10px] text-slate-500 block">Free Access</span>
          </div>

          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <BookOpen className="w-5 h-5 text-amber-800 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">{lang === 'hi' ? 'द्विभाषी' : 'Bilingual'}</strong>
            <span className="text-[10px] text-slate-500 block">Hindi / English</span>
          </div>

          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <Calendar className="w-5 h-5 text-red-900 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">{lang === 'hi' ? 'अर्द्धवार्षिक' : 'Half-Yearly'}</strong>
            <span className="text-[10px] text-slate-500 block">2 Issues / Year</span>
          </div>

          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <Award className="w-5 h-5 text-indigo-700 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">DOI Enabled</strong>
            <span className="text-[10px] text-slate-500 block">Zenodo Citable</span>
          </div>

          <div className="bg-white border border-amber-900/15 rounded-2xl p-4 shadow-xs text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-teal-700 mx-auto" />
            <strong className="block font-serif font-bold text-slate-900 text-xs">{lang === 'hi' ? 'निःशुल्क प्रकाशन' : 'No Pub. Fee'}</strong>
            <span className="text-[10px] text-slate-500 block">Zero APC</span>
          </div>
        </section>

        {/* ==========================================
            3. CURRENT ISSUE SECTION
            ========================================== */}
        {currentIssue && (
          <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                    {lang === 'hi' ? 'वर्तमान शोध अंक' : 'Current Issue'}
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Online ISSN: {settings.issn_online || 'Applied'}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">
                  {lang === 'hi' ? currentIssue.title_hindi : currentIssue.title_english}
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Volume {currentIssue.volume}, Issue {currentIssue.issue_number} ({currentIssue.month || currentIssue.year}) • Published on {currentIssue.published_date || currentIssue.year}
                </p>
              </div>

              <a
                href={getUrlForView('current_issue')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('current_issue');
                }}
                className="self-start sm:self-center px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs shrink-0"
              >
                <span>{lang === 'hi' ? 'पूरा अंक व सभी पत्र देखें' : 'View Full Issue'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 space-y-3">
                <div className="w-44 sm:w-full mx-auto relative aspect-3/4 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400/50 bg-red-950">
                  <SafeImage 
                    src={currentIssue.cover_image_url} 
                    alt="Current Journal Issue Cover" 
                    loading="eager"
                    fetchPriority="high"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <h3 className="text-xs font-serif font-bold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'प्रमुख शोध पत्र' : 'Featured Research Papers'}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{currentIssueArticles.length} Papers in Issue</span>
                </h3>

                <div className="space-y-3">
                  {featuredArticles.map((art) => (
                    <div 
                      key={art.id}
                      className="bg-slate-50 hover:bg-amber-50/60 p-4 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition space-y-2 group shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                        <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                          {art.category || 'Research Article'}
                        </span>
                        <span className="text-slate-500">pp. {art.page_numbers || '1-12'}</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-red-950 transition leading-snug">
                        <a 
                          href={getUrlForView('article_detail', art.slug || art.id)}
                          onClick={(e) => {
                            if (!e.metaKey && !e.ctrlKey) {
                              e.preventDefault();
                              handleArticleClick(art.slug || art.id);
                            }
                          }}
                          className="hover:underline"
                        >
                          {lang === 'hi' ? art.title_hindi : art.title_english}
                        </a>
                      </h4>

                      <p className="text-xs text-slate-700 font-medium">
                        <strong>Authors:</strong> {art.authors ? art.authors.map(a => a.name).join(', ') : 'Authors N/A'}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-200/60">
                        <a
                          href={getUrlForView('article_detail', art.slug || art.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            handleArticleClick(art.slug || art.id);
                          }}
                          className="font-bold text-red-900 hover:underline flex items-center space-x-1"
                        >
                          <span>{lang === 'hi' ? 'पढ़ें' : 'Read Article'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handlePdfView(e, art)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold rounded transition flex items-center space-x-1 text-xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            4. FEATURED ARTICLES SECTION
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'चयनित शोध पत्र' : 'Featured Articles'}</span>
            </h2>
            <a
              href={getUrlForView('articles')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('articles');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.slice(0, 4).map((art) => (
              <div 
                key={`feat-${art.id}`}
                className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200 transition space-y-2 flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                      {art.category || 'Research Article'}
                    </span>
                    <span className="text-slate-500">pp. {art.page_numbers || '1-10'}</span>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-950 transition leading-snug">
                    <a 
                      href={getUrlForView('article_detail', art.slug || art.id)}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleArticleClick(art.slug || art.id);
                        }
                      }}
                      className="hover:underline"
                    >
                      {lang === 'hi' ? art.title_hindi : art.title_english}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    {art.authors ? art.authors.map(a => a.name).join(', ') : 'Authors N/A'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <a
                    href={getUrlForView('article_detail', art.slug || art.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleArticleClick(art.slug || art.id);
                    }}
                    className="font-bold text-red-900 hover:underline flex items-center space-x-1"
                  >
                    <span>{lang === 'hi' ? 'पढ़ें' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={(e) => handlePdfView(e, art)}
                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold text-[11px] rounded transition"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            5. CALL FOR PAPERS SECTION
            ========================================== */}
        {settings.call_for_papers?.is_active !== false && (
          <section className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-amber-400/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
              <div className="inline-flex items-center space-x-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-md text-xs font-mono font-bold">
                <Inbox className="w-4 h-4 text-slate-950" />
                <span>{settings.call_for_papers?.title_badge_english || 'Call for Papers'}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                Target Issue: {settings.call_for_papers?.target_volume_issue || 'Vol. 2 Issue 2 (2026)'}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.heading_hindi || 'शोध पत्र सबमिशन हेतु आमंत्रण') 
                  : (settings.call_for_papers?.heading_english || 'Submit Research Manuscript')}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed max-w-3xl">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.description_hindi || 'पवारी भाषा, साहित्य, संस्कृति एवं क्षेत्रीय इतिहास पर मौलिक शोध पत्रों का आमंत्रण।') 
                  : (settings.call_for_papers?.description_english || 'Inviting original research papers and review articles in Pawari language, literature, and culture.')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/25">
                <span className="text-[10px] text-amber-300 block uppercase">Last Date</span>
                <strong className="text-amber-100 text-sm">{settings.call_for_papers?.deadline_date || '31st May'}</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/25">
                <span className="text-[10px] text-amber-300 block uppercase">Review</span>
                <strong className="text-amber-100 text-sm">Double-Blind</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/25">
                <span className="text-[10px] text-amber-300 block uppercase">Fee</span>
                <strong className="text-amber-100 text-sm">{lang === 'hi' ? 'निःशुल्क' : 'Zero APC'}</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/25">
                <span className="text-[10px] text-amber-300 block uppercase">Languages</span>
                <strong className="text-amber-100 text-sm">Hindi / English</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-400/20 flex flex-wrap gap-2">
              <a
                href={getUrlForView('submit_manuscript')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('submit_manuscript');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md flex items-center space-x-1.5 text-xs"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'hi' ? 'लेख भेजें (Submit Article)' : 'Submit Article'}</span>
              </a>
              <a
                href={getUrlForView('author_guidelines')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('author_guidelines');
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold rounded-xl transition border border-amber-400/30 text-xs"
              >
                {lang === 'hi' ? 'लेखक निर्देश' : 'Author Guidelines'}
              </a>
            </div>
          </section>
        )}

        {/* ==========================================
            6. ARCHIVE PREVIEW SECTION
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'पुरालेख पूर्वावलोकन (Archive Preview)' : 'Archive Preview'}</span>
            </h2>
            <a
              href={getUrlForView('archive')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('archive');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'सभी अंक देखें (All Archives)' : 'View All Archives'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {issues.filter(i => i.id !== currentIssue?.id).slice(0, 3).map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setActiveView('archive', null, issue.id)}
                className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-2 cursor-pointer group"
              >
                <div className="aspect-16/9 rounded-lg overflow-hidden bg-red-950 relative">
                  <SafeImage src={issue.cover_image_url} alt={issue.title_english} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-amber-200 font-bold">Vol. {issue.volume} Issue {issue.issue_number}</span>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-950 transition line-clamp-1">
                  {lang === 'hi' ? issue.title_hindi : issue.title_english}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {issue.month || issue.year}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            7. ABOUT / MISSION SNAPSHOT
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'पत्रिका परिचय एवं उद्देश्य' : 'About Pawari Shodh Patrika'}</span>
            </h2>
            <a
              href={getUrlForView('about')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('about');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'और पढ़ें' : 'Read More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            {lang === 'hi' 
              ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika) माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, म.प्र.) द्वारा प्रकाशित एक द्विभाषी (हिंदी एवं अंग्रेजी) एवं अर्द्धवार्षिक पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पवारी भाषा, साहित्य, संस्कृति और मध्य भारत के क्षेत्रीय इतिहास को वैश्विक अकादमिक मंच प्रदान करने हेतु समर्पित है।'
              : 'Pawari Shodh Patrika is a bilingual (Hindi & English), double-blind peer-reviewed academic journal published half-yearly by Maa Tapti Research Institute, Multai. It provides a dedicated scholarly platform for original research on the Pawari dialect, literature, regional history, and Central Indian folk heritage.'}
          </p>
        </section>

        {/* ==========================================
            4.5. PAWARI CULTURE, LITERATURE & HERITAGE HUB
            ========================================== */}
        <section className="bg-gradient-to-br from-[#420708] via-[#2a0506] to-[#1c0304] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-amber-100 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>पवारी भाषा, लोकसंस्कृति व साहित्य केंद्र</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 tracking-tight">
                {lang === 'hi' ? 'पवारी शब्दकोश, पहेली, लोकगीत, पुस्तकें व समीक्षा हब' : 'Pawari Shabdkosh, Paheli, Lokgeet, Books & Reviews Hub'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 font-serif mt-1 max-w-2xl">
                {lang === 'hi' 
                  ? 'माँ ताप्ती पवारी शोध संस्थान द्वारा संरक्षित पवारी भाषा के प्रामाणिक कोष, प्राचीन लोक पहेलियाँ, विवाह व फाग लोकगीत, ई-बुक्स, समीक्षाएँ व ऑनलाइन संस्कृति परीक्षा।'
                  : 'Authentic Pawari dictionary, ancient riddles, folk songs, digital books, literary reviews, and cultural e-quiz with certificates.'}
              </p>
            </div>

            <a
              href={getUrlForView('books_blogs')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('books_blogs');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5 shadow-md shrink-0 self-start md:self-center"
            >
              <span>{lang === 'hi' ? 'संपूर्ण साहित्य संग्रह देखें' : 'Explore Full Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Pawari Shabdkosh Card */}
            <a
              href={getUrlForView('pawari_shabdkosh')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('pawari_shabdkosh');
              }}
              className="bg-black/40 hover:bg-black/60 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                  📖 पवारी शब्दकोश (Shabdkosh)
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed font-sans">
                  १,०००+ प्रामाणिक पवारी शब्द, हिंदी-अंग्रेजी अनुवाद, व्याकरण, वर्ग श्रेणी व वाक्य प्रयोग।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-500/20">
                <span>शब्दकोश खोजें</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </a>

            {/* 2. Pawari Paheli Card */}
            <a
              href={getUrlForView('pawari_paheli')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('pawari_paheli');
              }}
              className="bg-black/40 hover:bg-black/60 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                  🧩 पवारी पहेलियाँ (Paheli)
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed font-sans">
                  पारंपरिक पवारी बुझौवल, लोक पहेलियाँ, उत्तर छिपाएँ-देखें विकल्प व सांस्कृतिक व्याख्या।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-500/20">
                <span>पहेलियां बुझाएं</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </a>

            {/* 3. Pawari Lokgeet Card */}
            <a
              href={getUrlForView('pawari_lokgeet')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('pawari_lokgeet');
              }}
              className="bg-black/40 hover:bg-black/60 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                  🎵 पवारी लोकगीत (Lokgeet)
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed font-sans">
                  विवाह गीत, फाग, दिवारी, बिरहा एवं पवारी लोकगाथाओं का संपूर्ण लिखित व ऑडियो संग्रह।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-500/20">
                <span>लोकगीत सुनें व पढ़ें</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </a>

            {/* 4. Pawari Books Card */}
            <a
              href={getUrlForView('books_blogs')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('books_blogs');
              }}
              className="bg-black/40 hover:bg-black/60 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                  📚 पवारी पुस्तकें व ई-बुक्स (Books)
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed font-sans">
                  डिजिटल ग्रंथ, शोध ग्रंथ, पवारी व्याकरण पुस्तकें व ई-बुक्स निःशुल्क पीडीएफ डाउनलोड।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-500/20">
                <span>पुस्तकें देखें व डाउनलोड करें</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </a>

            {/* 5. Pawari Samiksha & Reviews Card */}
            <a
              href={getUrlForView('books_blogs')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('books_blogs');
              }}
              className="bg-black/40 hover:bg-black/60 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition">
                  📑 पुस्तक समीक्षा व समालोचना (Reviews)
                </h3>
                <p className="text-xs text-amber-200/70 leading-relaxed font-sans">
                  पवारी साहित्य समीक्षाएँ, विद्वानों के आलेख, समीक्षात्मक टिप्पणी व शोध निबंध।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-500/20">
                <span>समीक्षाएं पढ़ें</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </a>

            {/* 6. Pawari Quiz Card */}
            <a
              href={getUrlForView('pawari_quiz')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('pawari_quiz');
              }}
              className="bg-gradient-to-br from-amber-600/30 via-amber-500/20 to-amber-900/30 hover:from-amber-600/40 border border-amber-400 p-4 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-200 group-hover:text-amber-100 transition">
                  🏆 संस्कृति ज्ञान ई-क्विज़ (Quiz & Certificate)
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed font-sans font-medium">
                  १० प्रश्नों की ऑनलाइन ज्ञान परीक्षा दें और नाम-सहित आकर्षक राष्ट्रीय ई-प्रमाण पत्र तुरंत डाउनलोड करें!
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-400/30">
                <span>क्विज़ में भाग लें (निःशुल्क)</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

          </div>
        </section>

        {/* ==========================================
            5. PUBLISHED PAPERS SECTION (Latest 3-4 Papers)
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'नवीनतम प्रकाशित शोध पत्र' : 'Latest Research Papers'}</span>
            </h2>
            <a
              href={getUrlForView('articles')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('articles');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'सभी प्रकाशित शोध पत्र देखें' : 'View All Published Papers'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.map((art) => (
              <div 
                key={`pub-${art.id}`}
                className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition space-y-2 flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                      {art.category || 'Research Article'}
                    </span>
                    <span className="text-slate-500">
                      Vol. {art.volume} Issue {art.issue} ({art.year})
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base group-hover:text-red-950 transition leading-snug">
                    <a 
                      href={getUrlForView('article_detail', art.slug || art.id)}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleArticleClick(art.slug || art.id);
                        }
                      }}
                      className="hover:underline"
                    >
                      {lang === 'hi' ? art.title_hindi : art.title_english}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    {art.authors ? art.authors.map(a => a.name).join(', ') : 'Authors N/A'}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <a
                    href={getUrlForView('article_detail', art.slug || art.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleArticleClick(art.slug || art.id);
                    }}
                    className="font-bold text-red-900 hover:underline flex items-center space-x-1"
                  >
                    <span>{lang === 'hi' ? 'पढ़ें' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>{art.views_count || 0} views</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Download className="w-3 h-3 text-slate-400" />
                      <span>{art.downloads_count || 0} downloads</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <a
              href={getUrlForView('articles')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('articles');
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-100 font-bold text-xs rounded-xl transition"
            >
              <span>{lang === 'hi' ? 'सभी प्रकाशित शोध पत्र देखें' : 'View All Published Research Papers'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ==========================================
            6. ABOUT THE JOURNAL SECTION (Compact Summary)
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'पत्रिका परिचय एवं उद्देश्य' : 'About Pawari Shodh Patrika'}</span>
            </h2>
            <a
              href={getUrlForView('about')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('about');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'और पढ़ें' : 'Read More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            {lang === 'hi' 
              ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika) माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, म.प्र.) द्वारा प्रकाशित एक द्विभाषी (हिंदी एवं अंग्रेजी) एवं अर्द्धवार्षिक पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पवारी भाषा, साहित्य, संस्कृति और मध्य भारत के क्षेत्रीय इतिहास को वैश्विक अकादमिक मंच प्रदान करने हेतु समर्पित है।'
              : 'Pawari Shodh Patrika is a bilingual (Hindi & English), double-blind peer-reviewed academic journal published half-yearly by Maa Tapti Research Institute, Multai. It provides a dedicated scholarly platform for original research on the Pawari dialect, literature, regional history, and Central Indian folk heritage.'}
          </p>

          <div className="pt-1 flex items-center justify-end">
            <a
              href={getUrlForView('about')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('about');
              }}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'विस्तृत विवरण एवं उद्देश्य पढ़ें' : 'Read Full Aims & Scope'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ==========================================
            7. CALL FOR PAPERS SECTION (Highlighted Card)
            ========================================== */}
        {settings.call_for_papers?.is_active !== false && (
          <section className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-amber-400/50 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
              <div className="inline-flex items-center space-x-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-md text-xs font-mono font-bold">
                <Inbox className="w-4 h-4 text-slate-950" />
                <span>
                  {settings.call_for_papers?.title_badge_english || 'Call for Papers'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                Target Issue: {settings.call_for_papers?.target_volume_issue || 'Vol. 2 Issue 2 (2026)'}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.heading_hindi || 'शोध पत्र सबमिशन हेतु आमंत्रण') 
                  : (settings.call_for_papers?.heading_english || 'Submit Research Manuscript for Upcoming Issue')}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed max-w-3xl">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.description_hindi || 'शोधकर्ताओं एवं विद्वानों से पवारी भाषा, साहित्य, संस्कृति, लोकगीत एवं क्षेत्रीय इतिहास पर मौलिक शोध पत्रों का आमंत्रण।') 
                  : (settings.call_for_papers?.description_english || 'Inviting original research papers, review articles, and field studies in Pawari language, culture, and Central Indian studies.')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/20">
                <span className="text-[10px] text-amber-300 block uppercase">Deadline</span>
                <strong className="text-amber-100 text-sm">{settings.call_for_papers?.deadline_date || '31st May'}</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/20">
                <span className="text-[10px] text-amber-300 block uppercase">Review</span>
                <strong className="text-amber-100 text-sm">Double-Blind Peer Review</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/20">
                <span className="text-[10px] text-amber-300 block uppercase">Processing Fee</span>
                <strong className="text-amber-100 text-sm">{lang === 'hi' ? 'शून्य शुल्क' : 'Zero APC'}</strong>
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl border border-amber-400/20">
                <span className="text-[10px] text-amber-300 block uppercase">Languages</span>
                <strong className="text-amber-100 text-sm">Hindi / English / Pawari</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-amber-400/20">
              <div className="flex flex-wrap gap-2">
                <a
                  href={getUrlForView('submit_manuscript')}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('submit_manuscript');
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md flex items-center space-x-1.5 text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'लेख भेजें' : 'Submit Article'}</span>
                </a>

                <a
                  href={getUrlForView('author_guidelines')}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('author_guidelines');
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold rounded-xl transition border border-amber-400/30 text-xs"
                >
                  {lang === 'hi' ? 'लेखक निर्देश देखें' : 'Author Guidelines'}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            8. INDEXING AND DATABASE SECTION (Badge Row/Grid)
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <BookMarked className="w-6 h-6 text-amber-800" />
              <span>{lang === 'hi' ? 'इंडेक्सिंग एवं अकादमिक डेटाबेस' : 'Indexing & Academic Databases'}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Indexed in leading international academic repositories and research databases.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-center">
            <div className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-1">
              <GraduationCap className="w-6 h-6 text-red-900 mx-auto" />
              <strong className="block font-serif font-bold text-slate-900 text-xs">Google Scholar</strong>
              <span className="text-[10px] text-slate-500 block">Indexed Publications</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-1">
              <Award className="w-6 h-6 text-blue-700 mx-auto" />
              <strong className="block font-serif font-bold text-slate-900 text-xs">Zenodo DOI</strong>
              <span className="text-[10px] text-slate-500 block">Citable Identifiers</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-1">
              <Globe className="w-6 h-6 text-emerald-700 mx-auto" />
              <strong className="block font-serif font-bold text-slate-900 text-xs">ResearchGate</strong>
              <span className="text-[10px] text-slate-500 block">Academic Network</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-1">
              <BookOpen className="w-6 h-6 text-amber-800 mx-auto" />
              <strong className="block font-serif font-bold text-slate-900 text-xs">Academia.edu</strong>
              <span className="text-[10px] text-slate-500 block">Scholarly Repository</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition space-y-1 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-6 h-6 text-teal-700 mx-auto" />
              <strong className="block font-serif font-bold text-slate-900 text-xs">Open Access</strong>
              <span className="text-[10px] text-slate-500 block">100% Free Access</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            9. EDITORIAL LEADERSHIP SECTION (Compact Cards)
            ========================================== */}
        {topEditors.length > 0 && (
          <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-6 h-6 text-red-900" />
                <span>{lang === 'hi' ? 'संपादकीय नेतृत्व' : 'Editorial Leadership'}</span>
              </h2>
              <a
                href={getUrlForView('editorial_board')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('editorial_board');
                }}
                className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
              >
                <span>{lang === 'hi' ? 'समस्त संपादकीय मंडल देखें' : 'View Full Board'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topEditors.map((editor) => (
                <div 
                  key={editor.id}
                  className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200 transition space-y-3 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs bg-red-950 shrink-0">
                    <SafeImage
                      src={editor.photo_url}
                      alt={editor.name_english || editor.name_hindi}
                      className="w-full h-full object-cover"
                      showFallbackIconOnFail={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {editor.role}
                    </span>
                    <h3 className="font-serif font-bold text-slate-900 text-sm mt-1">
                      {lang === 'hi' ? editor.name_hindi : editor.name_english}
                    </h3>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {lang === 'hi' ? editor.designation_hindi : editor.designation_english}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {lang === 'hi' ? editor.affiliation_hindi : editor.affiliation_english}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================
            10. FOOTER-READY TRANSITION / PUBLISHER BLOCK
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'प्रकाशक एवं संस्थागत संपर्क' : 'Publisher & Secretariat'}</span>
            </h2>
            <a
              href={getUrlForView('contact')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('contact');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'संपर्क पृष्ठ' : 'Visit Contact Page'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block">Publishing Institution</strong>
              <p className="text-slate-700 font-medium">
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </p>
              <p className="text-slate-500">Research & Publication Department</p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-red-900" />
                <span>Postal Address</span>
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <Mail className="w-4 h-4 text-red-900" />
                <span>Editorial Contact</span>
              </strong>
              <p className="text-slate-700 font-mono">{settings.contact_email}</p>
              {settings.contact_phone && (
                <p className="text-slate-600 font-mono">{settings.contact_phone}</p>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Citation Modal */}
      {citationModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-amber-400/40">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Quote className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-slate-900 text-base">Cite Research Article</h3>
              </div>
              <button 
                onClick={() => setCitationModalArticle(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
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
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedFormat === 'apa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'apa' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors ? citationModalArticle.authors.map((a: any) => a.name).join(', ') : ''} ({citationModalArticle.year || '2026'}). {citationModalArticle.title_english || citationModalArticle.title_hindi}. Pawari Shodh Patrika, {citationModalArticle.volume}({citationModalArticle.issue}), {citationModalArticle.page_numbers || '1-10'}.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">MLA (9th Edition)</span>
                  <button
                    onClick={() => copyCitation(citationModalArticle, 'mla')}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedFormat === 'mla' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'mla' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors ? citationModalArticle.authors.map((a: any) => a.name).join(', ') : ''}. "{citationModalArticle.title_english || citationModalArticle.title_hindi}." Pawari Shodh Patrika, vol. {citationModalArticle.volume}, no. {citationModalArticle.issue}, {citationModalArticle.year || '2026'}, pp. {citationModalArticle.page_numbers || '1-10'}.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCitation(citationModalArticle, 'bibtex')}
                  className="flex-1 py-2 bg-slate-900 text-amber-100 font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BibTeX</span>
                </button>
                <button
                  onClick={() => copyCitation(citationModalArticle, 'ris')}
                  className="flex-1 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border hover:bg-slate-200 transition flex items-center justify-center space-x-1 cursor-pointer"
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
