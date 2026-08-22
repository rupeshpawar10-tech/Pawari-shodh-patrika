import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { DEFAULT_PAWARI_MEMBER_AVATAR } from '../../data/seedData';
import { SharePaperModal } from '../common/SharePaperModal';
import { Article } from '../../types';
import { EditorialBoardDisplay } from '../common/EditorialBoardDisplay';
import { 
  AcademicSectionHeader, 
  TrustBadgeMatrix, 
  AcademicArticleCard, 
  AcademicIndexingBanner 
} from '../common/AcademicUi';
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
  
  // Articles in the current issue (published) with strict deduplication
  const publishedArticles = useMemo(() => {
    const map = new Map<string, Article>();
    articles.forEach(a => {
      if (a && a.id && (!a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase()))) {
        if (!map.has(a.id)) {
          map.set(a.id, a);
        }
      }
    });
    return Array.from(map.values());
  }, [articles]);

  const currentIssueArticles = useMemo(() => {
    if (!currentIssue) return publishedArticles.slice(0, 3);
    const map = new Map<string, Article>();
    articles.forEach(a => {
      if (a && a.id && Number(a.volume) === Number(currentIssue.volume) && Number(a.issue) === Number(currentIssue.issue_number) && (!a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase()))) {
        if (!map.has(a.id)) {
          map.set(a.id, a);
        }
      }
    });
    const res = Array.from(map.values());
    return res.length > 0 ? res : publishedArticles.slice(0, 3);
  }, [articles, currentIssue, publishedArticles]);

  const displayCurrentIssueArticles = useMemo(() => {
    return currentIssueArticles.length > 0 ? currentIssueArticles : publishedArticles.slice(0, 4);
  }, [currentIssueArticles, publishedArticles]);

  // Top 3 featured papers for current issue block
  const featuredArticles = useMemo(() => {
    return displayCurrentIssueArticles.slice(0, 3);
  }, [displayCurrentIssueArticles]);

  const handleArticleClick = (artId: string) => {
    const art = articles.find(a => a.id === artId);
    incrementArticleViews(artId);
    setActiveView('article_detail', art?.slug || artId);
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
    ? [...editorialMembers].sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 4)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8 pt-2 sm:pt-4">

        {/* ==========================================
            1. HERO SECTION (3D Glossy Academic Marquee)
            ========================================== */}
        <section className="relative text-stone-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/30 overflow-hidden bg-gradient-to-br from-[#2a0506] via-[#3a080a] to-[#1c0304] gloss-sheen gloss-3d-card-dark">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-red-900/25 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Publisher Badge */}
            <div className="inline-flex items-center space-x-2 bg-stone-900/80 text-amber-300 px-4 py-1.5 rounded-full border border-amber-400/35 text-xs font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </span>
            </div>

            {/* Main Journal Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight drop-shadow-sm">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-lg text-stone-300 font-serif max-w-3xl mx-auto leading-relaxed italic">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'शोध पत्र शीर्षक, लेखक या विषय से खोजें...' : 'Search research article by title, author, or keyword...'}
                  className="w-full pl-10 pr-24 py-3 bg-white text-stone-900 placeholder-stone-400 text-base sm:text-sm rounded-xl border border-stone-200 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium min-h-[48px]"
                />
                <button
                  type="submit"
                  className="gloss-3d-btn-primary absolute right-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer min-h-[38px]"
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
                className="gloss-3d-btn-primary px-5 py-3 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2 min-h-[44px] touch-active cursor-pointer"
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
                className="px-5 py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-stone-100 font-bold text-xs sm:text-sm rounded-xl border border-stone-400/35 transition flex items-center space-x-2 backdrop-blur-xs min-h-[44px] touch-active cursor-pointer shadow-md"
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
        <TrustBadgeMatrix lang={lang} />

        {/* ==========================================
            3. CURRENT ISSUE SECTION
            ========================================== */}
        {currentIssue && (
          <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
            <AcademicSectionHeader
              title={lang === 'hi' ? (currentIssue.title_hindi || 'वर्तमान शोध अंक') : (currentIssue.title_english || 'Current Issue')}
              subtitle={`Volume ${currentIssue.volume}, Issue ${currentIssue.issue_number} (${currentIssue.month || currentIssue.year}) • Published on ${currentIssue.published_date || currentIssue.year}`}
              badge={lang === 'hi' ? 'वर्तमान शोध अंक' : 'Current Issue'}
              badgeVariant="maroon"
              actionLabel={lang === 'hi' ? 'पूरा अंक व सभी पत्र देखें' : 'View Full Issue'}
              actionHref={getUrlForView('current_issue')}
              onAction={() => setActiveView('current_issue')}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Cover Column */}
              <div className="md:col-span-4 space-y-3">
                <div className="w-48 sm:w-full mx-auto relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/35 bg-stone-950 group">
                  <SafeImage 
                    src={currentIssue.cover_image_url} 
                    alt="Current Journal Issue Cover" 
                    loading="eager"
                    fetchPriority="high"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent p-3.5 text-center">
                    <span className="text-[11px] font-mono text-amber-300 font-bold block">
                      Vol. {currentIssue.volume} No. {currentIssue.issue_number} ({currentIssue.year})
                    </span>
                  </div>
                </div>
              </div>

              {/* Papers in Current Issue */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                  <h3 className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider">
                    {lang === 'hi' ? 'प्रमुख शोध पत्र' : 'Featured Research Papers'}
                  </h3>
                  <span className="text-stone-500 text-[11px] font-mono font-bold">
                    {currentIssueArticles.length} Papers in Issue
                  </span>
                </div>

                <div className="space-y-3.5">
                  {featuredArticles.map((art) => (
                    <AcademicArticleCard
                      key={art.id}
                      article={art}
                      lang={lang}
                      onArticleClick={handleArticleClick}
                      onPdfView={handlePdfView}
                      onPdfDownload={handlePdfDownload}
                      onCiteClick={(article) => setCitationModalArticle(article)}
                      onShareClick={(article) => setShareModalArticle(article)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            4. FEATURED ARTICLES SECTION
            ========================================== */}
        <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
          <AcademicSectionHeader
            title={lang === 'hi' ? 'चयनित शोध पत्र' : 'Featured Articles'}
            subtitle={lang === 'hi' ? 'उच्च प्रभाव एवं सहकर्मी समीक्षित शोध निबंध' : 'Peer-reviewed scholarly contributions of enduring significance'}
            badge={lang === 'hi' ? 'चयनित' : 'Featured'}
            badgeVariant="gold"
            actionLabel={lang === 'hi' ? 'सभी देखें' : 'View All'}
            actionHref={getUrlForView('articles')}
            onAction={() => setActiveView('articles')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.slice(0, 4).map((art) => (
              <AcademicArticleCard
                key={`feat-${art.id}`}
                article={art}
                lang={lang}
                onArticleClick={handleArticleClick}
                onPdfView={handlePdfView}
                onPdfDownload={handlePdfDownload}
                onCiteClick={(article) => setCitationModalArticle(article)}
                onShareClick={(article) => setShareModalArticle(article)}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            5. CALL FOR PAPERS SECTION
            ========================================== */}
        {settings.call_for_papers?.is_active !== false && (
          <section className="gloss-3d-card-dark text-stone-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-5 gloss-sheen">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700/50 pb-3">
              <div className="inline-flex items-center space-x-2 bg-amber-500 text-stone-950 px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-xs">
                <Inbox className="w-4 h-4 text-stone-950" />
                <span>{settings.call_for_papers?.title_badge_english || 'Call for Papers'}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                Target Issue: {settings.call_for_papers?.target_volume_issue || 'Vol. 2 Issue 2 (2026)'}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.heading_hindi || 'शोध पत्र सबमिशन हेतु आमंत्रण') 
                  : (settings.call_for_papers?.heading_english || 'Submit Research Manuscript')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed max-w-3xl">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.description_hindi || 'पवारी भाषा, साहित्य, संस्कृति एवं क्षेत्रीय इतिहास पर मौलिक शोध पत्रों का आमंत्रण।') 
                  : (settings.call_for_papers?.description_english || 'Inviting original research papers and review articles in Pawari language, literature, and culture.')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-stone-900/70 rounded-xl border border-stone-750 backdrop-blur-xs">
                <span className="text-[10px] text-amber-300 block uppercase font-sans font-bold">Submission Deadline</span>
                <strong className="text-stone-100 text-sm">{settings.call_for_papers?.deadline_date || '31st May'}</strong>
              </div>
              <div className="p-3 bg-stone-900/70 rounded-xl border border-stone-750 backdrop-blur-xs">
                <span className="text-[10px] text-amber-300 block uppercase font-sans font-bold">Peer Review</span>
                <strong className="text-stone-100 text-sm">Double-Blind</strong>
              </div>
              <div className="p-3 bg-stone-900/70 rounded-xl border border-stone-750 backdrop-blur-xs">
                <span className="text-[10px] text-amber-300 block uppercase font-sans font-bold">Publication Fee</span>
                <strong className="text-stone-100 text-sm">{lang === 'hi' ? 'निःशुल्क (Zero APC)' : 'Zero APC'}</strong>
              </div>
              <div className="p-3 bg-stone-900/70 rounded-xl border border-stone-750 backdrop-blur-xs">
                <span className="text-[10px] text-amber-300 block uppercase font-sans font-bold">Medium</span>
                <strong className="text-stone-100 text-sm">Hindi / English</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-700/50 flex flex-wrap gap-3">
              <a
                href={getUrlForView('submit_manuscript')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('submit_manuscript');
                }}
                className="gloss-3d-btn-primary px-5 py-2.5 font-bold rounded-xl transition flex items-center space-x-1.5 text-xs cursor-pointer"
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
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-stone-100 font-bold rounded-xl transition border border-stone-400/35 text-xs cursor-pointer shadow-sm"
              >
                {lang === 'hi' ? 'लेखक निर्देश' : 'Author Guidelines'}
              </a>
            </div>
          </section>
        )}

        {/* ==========================================
            6. PAWARI CULTURE, LITERATURE & HERITAGE HUB
            ========================================== */}
        <section className="gloss-3d-card-dark border border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-stone-50 space-y-6 relative overflow-hidden gloss-sheen">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-700/60 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? 'पवारी भाषा, लोकसंस्कृति व साहित्य केंद्र' : 'Pawari Language, Folklore & Literature Hub'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                {lang === 'hi' ? 'पवारी शब्दकोश, पहेली, लोकगीत, पुस्तकें व समीक्षा हब' : 'Pawari Shabdkosh, Paheli, Lokgeet, Books & Reviews Hub'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-serif mt-1 max-w-2xl">
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
              className="gloss-3d-btn-primary px-4 py-2 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5 shrink-0 self-start md:self-center cursor-pointer"
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
              className="bg-stone-900/70 hover:bg-stone-900/95 border border-stone-700/70 hover:border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition">
                  📖 पवारी शब्दकोश (Shabdkosh)
                </h3>
                <p className="text-xs text-stone-300/80 leading-relaxed font-sans">
                  १,०००+ प्रामाणिक पवारी शब्द, हिंदी-अंग्रेजी अनुवाद, व्याकरण, वर्ग श्रेणी व वाक्य प्रयोग।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-stone-800">
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
              className="bg-stone-900/70 hover:bg-stone-900/95 border border-stone-700/70 hover:border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition">
                  🧩 पवारी पहेलियाँ (Paheli)
                </h3>
                <p className="text-xs text-stone-300/80 leading-relaxed font-sans">
                  पारंपरिक पवारी बुझौवल, लोक पहेलियाँ, उत्तर छिपाएँ-देखें विकल्प व सांस्कृतिक व्याख्या।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-stone-800">
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
              className="bg-stone-900/70 hover:bg-stone-900/95 border border-stone-700/70 hover:border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition">
                  🎵 पवारी लोकगीत (Lokgeet)
                </h3>
                <p className="text-xs text-stone-300/80 leading-relaxed font-sans">
                  विवाह गीत, फाग, दिवारी, बिरहा एवं पवारी लोकगाथाओं का संपूर्ण लिखित व ऑडियो संग्रह।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-stone-800">
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
              className="bg-stone-900/70 hover:bg-stone-900/95 border border-stone-700/70 hover:border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition">
                  📚 पवारी पुस्तकें व ई-बुक्स (Books)
                </h3>
                <p className="text-xs text-stone-300/80 leading-relaxed font-sans">
                  डिजिटल ग्रंथ, शोध ग्रंथ, पवारी व्याकरण पुस्तकें व ई-बुक्स निःशुल्क पीडीएफ डाउनलोड।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-stone-800">
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
              className="bg-stone-900/70 hover:bg-stone-900/95 border border-stone-700/70 hover:border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition">
                  📑 पुस्तक समीक्षा व समालोचना (Reviews)
                </h3>
                <p className="text-xs text-stone-300/80 leading-relaxed font-sans">
                  पवारी साहित्य समीक्षाएँ, विद्वानों के आलेख, समीक्षात्मक टिप्पणी व शोध निबंध।
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-stone-800">
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
              className="bg-gradient-to-br from-amber-600/35 via-amber-500/25 to-amber-950/40 hover:from-amber-600/50 border-2 border-amber-400/60 p-5 rounded-2xl transition duration-200 group flex flex-col justify-between space-y-3 cursor-pointer shadow-xl backdrop-blur-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-amber-200 group-hover:text-amber-100 transition">
                  🏆 संस्कृति ज्ञान ई-क्विज़ (Quiz & Certificate)
                </h3>
                <p className="text-xs text-stone-200 leading-relaxed font-sans font-medium">
                  १० प्रश्नों की ऑनलाइन ज्ञान परीक्षा दें और नाम-सहित आकर्षक राष्ट्रीय ई-प्रमाण पत्र तुरंत डाउनलोड करें!
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 group-hover:underline pt-2 border-t border-amber-400/40">
                <span>क्विज़ में भाग लें (निःशुल्क)</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

          </div>
        </section>

        {/* ==========================================
            7. LATEST PUBLISHED PAPERS SECTION
            ========================================== */}
        <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
          <AcademicSectionHeader
            title={lang === 'hi' ? 'नवीनतम प्रकाशित शोध पत्र' : 'Latest Published Papers'}
            subtitle={lang === 'hi' ? 'नवीनतम शोध, क्षेत्रीय अध्ययन एवं समीक्षात्मक आलेख' : 'Newly published papers with open access availability and citation metadata'}
            badge={lang === 'hi' ? 'नवीनतम' : 'Recent'}
            badgeVariant="teal"
            actionLabel={lang === 'hi' ? 'सभी प्रकाशित शोध पत्र देखें' : 'View All Published Papers'}
            actionHref={getUrlForView('articles')}
            onAction={() => setActiveView('articles')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.map((art) => (
              <AcademicArticleCard
                key={`pub-${art.id}`}
                article={art}
                lang={lang}
                onArticleClick={handleArticleClick}
                onPdfView={handlePdfView}
                onPdfDownload={handlePdfDownload}
                onCiteClick={(article) => setCitationModalArticle(article)}
                onShareClick={(article) => setShareModalArticle(article)}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            8. ARCHIVE PREVIEW SECTION
            ========================================== */}
        <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
          <AcademicSectionHeader
            title={lang === 'hi' ? 'पुरालेख पूर्वावलोकन (Archive Preview)' : 'Archive Preview'}
            subtitle={lang === 'hi' ? 'पूर्व प्रकाशित अंकों का संरचित संग्रह' : 'Preserved repository of previously published journal volumes and issues'}
            badge={lang === 'hi' ? 'पुरालेख' : 'Archives'}
            actionLabel={lang === 'hi' ? 'सभी अंक देखें' : 'View All Archives'}
            actionHref={getUrlForView('archive')}
            onAction={() => setActiveView('archive')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {issues.filter(i => i.id !== currentIssue?.id).slice(0, 3).map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setActiveView('archive', null, issue.id)}
                className="gloss-3d-card p-4 rounded-2xl transition duration-200 space-y-3 cursor-pointer group"
              >
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-stone-900 relative shadow-inner">
                  <SafeImage src={issue.cover_image_url} alt={issue.title_english} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-amber-300 font-bold">Vol. {issue.volume} Issue {issue.issue_number}</span>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-red-950 transition line-clamp-1">
                  {lang === 'hi' ? issue.title_hindi : issue.title_english}
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">
                  {issue.month || issue.year}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            9. INDEXING AND DATABASE SECTION
            ========================================== */}
        <AcademicIndexingBanner lang={lang} />

        {/* ==========================================
            10. ABOUT / MISSION SNAPSHOT
            ========================================== */}
        <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
          <AcademicSectionHeader
            title={lang === 'hi' ? 'पत्रिका परिचय एवं उद्देश्य' : 'About Pawari Shodh Patrika'}
            subtitle={lang === 'hi' ? 'अकादमिक निष्ठा एवं शोध मानक' : 'Academic standards and regional research focus'}
            badge={lang === 'hi' ? 'परिचय' : 'About'}
            actionLabel={lang === 'hi' ? 'और पढ़ें' : 'Read More'}
            actionHref={getUrlForView('about')}
            onAction={() => setActiveView('about')}
          />

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
            {lang === 'hi' 
              ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika) माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, म.प्र.) द्वारा प्रकाशित एक द्विभाषी (हिंदी एवं अंग्रेजी) एवं अर्द्धवार्षिक पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पवारी भाषा, साहित्य, संस्कृति और मध्य भारत के क्षेत्रीय इतिहास को वैश्विक अकादमिक मंच प्रदान करने हेतु समर्पित है।'
              : 'Pawari Shodh Patrika is a bilingual (Hindi & English), double-blind peer-reviewed academic journal published half-yearly by Maa Tapti Research Institute, Multai. It provides a dedicated scholarly platform for original research on the Pawari dialect, literature, regional history, and Central Indian folk heritage.'}
          </p>
        </section>

        {/* ==========================================
            11. EDITORIAL LEADERSHIP SECTION
            ========================================== */}
        {topEditors.length > 0 && (
          <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
            <AcademicSectionHeader
              title={lang === 'hi' ? 'संपादकीय नेतृत्व' : 'Editorial Leadership'}
              subtitle={lang === 'hi' ? 'शोध परिषद एवं मार्गदर्शक मंडल' : 'Distinguished advisory and editorial council'}
              badge={lang === 'hi' ? 'संपादकीय' : 'Editorial'}
              actionLabel={lang === 'hi' ? 'समस्त संपादकीय मंडल देखें' : 'View Full Board'}
              actionHref={getUrlForView('editorial_board')}
              onAction={() => setActiveView('editorial_board')}
            />

            <EditorialBoardDisplay 
              variant="compact" 
              maxItems={4} 
              onMemberClick={() => setActiveView('editorial_board')} 
            />
          </section>
        )}

        {/* ==========================================
            12. PUBLISHER BLOCK
            ========================================== */}
        <section className="gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
          <AcademicSectionHeader
            title={lang === 'hi' ? 'प्रकाशक एवं संस्थागत संपर्क' : 'Publisher & Secretariat'}
            subtitle={lang === 'hi' ? 'माँ ताप्ती शोध संस्थान, मुलताई (बैतूल)' : 'Maa Tapti Research Institute, Multai (Betul)'}
            badge={lang === 'hi' ? 'प्रकाशक' : 'Publisher'}
            actionLabel={lang === 'hi' ? 'संपर्क पृष्ठ' : 'Contact Page'}
            actionHref={getUrlForView('contact')}
            onAction={() => setActiveView('contact')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <strong className="text-stone-900 font-serif text-sm font-bold block">Publishing Institution</strong>
              <p className="text-stone-700 font-medium">
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </p>
              <p className="text-stone-500">Research & Publication Department</p>
            </div>

            <div className="space-y-1">
              <strong className="text-stone-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-red-900" />
                <span>Postal Address</span>
              </strong>
              <p className="text-stone-700 leading-relaxed">
                {lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-stone-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <Mail className="w-4 h-4 text-red-900" />
                <span>Editorial Contact</span>
              </strong>
              <p className="text-stone-700 font-mono">{settings.contact_email}</p>
              {settings.contact_phone && (
                <p className="text-stone-600 font-mono">{settings.contact_phone}</p>
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
