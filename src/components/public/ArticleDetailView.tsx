import React, { useState, useEffect } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getCanonicalUrl, getUrlForView } from '../../lib/router';
import { updateMetaTags } from '../../lib/seo';
import { findArticle } from '../../lib/slugUtils';
import { SharePaperModal } from '../common/SharePaperModal';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  Mail, 
  Building, 
  FileText,
  Quote,
  ShieldCheck,
  ExternalLink,
  Printer,
  Award,
  Calendar,
  Hash
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { 
    lang, 
    articles, 
    selectedArticleId, 
    setActiveView, 
    incrementArticleDownloads,
    loadingData,
    settings
  } = useCms();

  const article = selectedArticleId 
    ? findArticle(articles, selectedArticleId) 
    : (articles[0] || null);

  const hasValidPdf = Boolean(
    article?.pdf_url && 
    article.pdf_url.trim() !== '' && 
    article.pdf_url !== '#' && 
    !article.pdf_url.includes('undefined')
  );

  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!article) return;
    updateMetaTags('article_detail', settings, article, lang);
  }, [article, settings, lang]);

  if (loadingData && selectedArticleId && !article) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 text-center text-slate-600 font-serif space-y-4 bg-white rounded-3xl border border-amber-900/10 shadow-md">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-amber-950">
          {lang === 'hi' ? 'शोध पत्र लोड हो रहा है, कृपया प्रतीक्षा करें...' : 'Loading research paper, please wait...'}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto my-16 p-8 sm:p-12 text-center font-serif space-y-6 bg-white rounded-3xl border border-amber-900/15 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-900 flex items-center justify-center mx-auto text-2xl font-bold">
          📄
        </div>
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'hi' ? 'शोध पत्र नहीं मिला (Article Not Found)' : 'Research Paper Not Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {lang === 'hi' 
              ? 'आपने जिस शोध पत्र (Article) का अनुरोध किया है, वह या तो स्थानांतरित कर दिया गया है, उसका लिंक अमान्य है, या यह डेटाबेस में उपलब्ध नहीं है।' 
              : 'The requested research paper could not be found. It may have been removed or the URL link is invalid.'}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => setActiveView('archive')} 
            className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl shadow transition"
          >
            {lang === 'hi' ? 'पुरालेख (Archives) देखें' : 'Browse Archives'}
          </button>
          <button 
            onClick={() => setActiveView('current_issue')} 
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
          >
            {lang === 'hi' ? 'वर्तमान अंक पढ़ें' : 'View Current Issue'}
          </button>
          <button 
            onClick={() => setActiveView('home')} 
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
          >
            {lang === 'hi' ? 'होम पेज पर जाएं' : 'Return Home'}
          </button>
        </div>
      </div>
    );
  }

  const authorsText = article.authors.map(a => a.name || (a as any).name_hindi || (a as any).name_english || '').filter(Boolean).join(', ');
  const journalTitle = 'Pawari Shodh Patrika';
  const doiText = article.doi || `10.5281/zenodo.psp.${article.year}.${article.id}`;

  const articleCanonicalUrl = getCanonicalUrl(getUrlForView('article_detail', article.slug || article.id));

  // Citations
  const citations = {
    apa: article.citation_text || `${authorsText}. (${article.year}). ${article.title_english || article.title_hindi}. ${journalTitle}, ${article.volume}(${article.issue}), ${article.page_numbers || '01-15'}. https://doi.org/${doiText}`,
    mla: `${authorsText}. "${article.title_english || article.title_hindi}." ${journalTitle}, vol. ${article.volume}, no. ${article.issue}, ${article.year}, pp. ${article.page_numbers || '01-15'}.`,
    chicago: `${authorsText}. "${article.title_english || article.title_hindi}." ${journalTitle} ${article.volume}, no. ${article.issue} (${article.year}): ${article.page_numbers || '01-15'}.`
  };

  const handleCopyCitation = (type: keyof typeof citations) => {
    navigator.clipboard.writeText(citations[type]);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(articleCanonicalUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-8 py-4 sm:py-8 space-y-6 animate-in fade-in duration-200 print:p-0 print:m-0 print:max-w-none">
      
      {/* ----------------- BREADCRUMB NAVIGATION ----------------- */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 print:hidden">
        <button onClick={() => setActiveView('home')} className="hover:text-red-950 transition">
          {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('articles')} className="hover:text-red-950 transition">
          {lang === 'hi' ? 'शोध आलेख' : 'Research Articles'}
        </button>
        <span>/</span>
        <span className="text-red-950 font-bold truncate max-w-[220px]">{article.title_hindi}</span>
      </div>

      {/* Top Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => setActiveView('articles')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-950 hover:text-red-800 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2.5 rounded-xl border border-amber-500/30 shadow-2xs transition min-h-[44px] touch-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'शोध पत्र सूची पर वापस जाएं' : 'Back to Articles Index'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct PDF Download Action (Shown only if PDF exists) */}
          {hasValidPdf && (
            <a
              href={article.pdf_url}
              download={`${article.title_english || 'article'}.pdf`}
              onClick={() => {
                if (article.id) incrementArticleDownloads(article.id);
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-red-950 hover:bg-red-900 active:bg-red-950 text-amber-200 font-bold text-xs rounded-xl shadow-xs hover:shadow transition border border-amber-500/30 touch-active group"
            >
              <Download className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
              <span>{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</span>
            </a>
          )}

          {/* Copy Article URL */}
          <button
            onClick={handleCopyUrl}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-3.5 py-2.5 rounded-xl border border-slate-300 transition shadow-2xs min-h-[44px] touch-active"
            title="Copy Direct Article Link"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700" />}
            <span>{copiedUrl ? (lang === 'hi' ? 'URL कॉपी हो गया!' : 'Link Copied!') : (lang === 'hi' ? 'URL कॉपी करें' : 'Copy URL')}</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 px-3.5 py-2.5 rounded-xl shadow-2xs transition min-h-[44px] touch-active"
          >
            <Share2 className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'शेयर करें' : 'Share Paper'}</span>
          </button>

          {/* Print Action */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl border border-slate-300 transition"
            title="Print Page"
          >
            <Printer className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Journal Article Metadata Container */}
      <article className="bg-white border border-amber-900/15 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Top Badges & Metadata Bar */}
        <header className="border-b-2 border-red-950/20 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-950 text-amber-300 font-bold px-3 py-1 rounded-md text-xs tracking-wide">
                {article.article_type || 'ORIGINAL RESEARCH ARTICLE (मूल शोध पत्र)'}
              </span>
              <span className="bg-amber-500/20 text-red-950 font-bold px-3 py-1 rounded-md text-xs border border-amber-500/40">
                Vol. {article.volume}, Issue {article.issue} ({article.year})
              </span>
              {article.category && (
                <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-md text-xs border border-slate-200">
                  {article.category}
                </span>
              )}
              <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-xs border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Open Access (CC BY-NC 4.0)</span>
              </span>
            </div>

            {doiText && (
              <div className="text-slate-600 font-mono text-xs flex items-center space-x-1.5">
                <span className="font-bold text-slate-500">DOI:</span>
                <a 
                  href={`https://doi.org/${doiText}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-900 font-bold hover:underline flex items-center space-x-1 bg-red-50 px-2.5 py-1 rounded border border-red-200"
                >
                  <span>{doiText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

          </div>

          {/* Running Title if present */}
          {article.short_title && (
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Short Title: {article.short_title}
            </p>
          )}

          {/* Paper Title Hierarchy: H1 Hindi Title, H2 English Title */}
          <div className="space-y-3 pt-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-950 leading-tight tracking-tight">
              {article.title_hindi}
            </h1>
            {article.title_english && (
              <h2 className="text-lg sm:text-2xl font-serif text-slate-800 italic leading-snug border-l-4 border-amber-500 pl-3.5">
                {article.title_english}
              </h2>
            )}
          </div>

          {/* Detailed Academic Publication Specs Strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              Journal: <strong className="text-slate-900">Pawari Shodh Patrika</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-amber-700" />
              Pages: <strong className="text-slate-900">{article.page_numbers || '01-15'}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Language: <strong className="text-slate-900">{article.language || 'Hindi / Pawari'}</strong>
            </span>
          </div>

        </header>

        {/* Authors & Affiliations Section */}
        <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-900/10 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <h3 className="text-xs font-serif font-bold text-red-950 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'लेखक मंडल एवं सम्बद्ध संस्थान (Authors & Affiliations)' : 'Authors & Affiliations'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.authors.map((auth, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-amber-800 font-mono font-normal text-xs bg-amber-100 px-1.5 py-0.5 rounded">
                      [{idx + 1}]
                    </span>
                    <span>{auth.name}</span>
                  </div>
                  {auth.is_corresponding && (
                    <span className="bg-amber-500 text-red-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-600/30">
                      {lang === 'hi' ? 'मुख्य शोधकर्ता' : 'Corresponding Author'}
                    </span>
                  )}
                </div>

                {auth.affiliation && (
                  <p className="text-xs text-slate-700 flex items-start space-x-1.5 leading-normal">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{auth.affiliation}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  {auth.email && (
                    <a href={`mailto:${auth.email}`} className="text-red-900 hover:underline font-mono flex items-center space-x-1 text-[11px]">
                      <Mail className="w-3 h-3 text-red-700 shrink-0" />
                      <span>{auth.email}</span>
                    </a>
                  )}

                  {auth.orcid && (
                    <a 
                      href={auth.orcid.startsWith('http') ? auth.orcid : `https://orcid.org/${auth.orcid}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-mono flex items-center space-x-1 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <span className="font-bold text-[10px] text-emerald-800">iD</span>
                      <span>{auth.orcid}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Dates Timeline Bar */}
        {(article.date_received || article.date_revised || article.date_accepted || article.date_published) && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs font-mono text-slate-600 flex flex-wrap items-center justify-around gap-3">
            {article.date_received && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span><strong className="text-slate-800">Received:</strong> {article.date_received}</span>
              </div>
            )}
            {article.date_revised && (
              <div className="flex items-center gap-1">
                <span><strong className="text-slate-800">Revised:</strong> {article.date_revised}</span>
              </div>
            )}
            {article.date_accepted && (
              <div className="flex items-center gap-1">
                <span><strong className="text-slate-800">Accepted:</strong> {article.date_accepted}</span>
              </div>
            )}
            {article.date_published && (
              <div className="flex items-center gap-1">
                <span><strong className="text-red-950">Published:</strong> {article.date_published}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 print:hidden">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Cute & Professional Download PDF Button if PDF exists */}
            {hasValidPdf && (
              <a
                href={article.pdf_url}
                download={`${article.title_english || 'article'}.pdf`}
                onClick={() => {
                  if (article.id) incrementArticleDownloads(article.id);
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs rounded-xl shadow-xs transition border border-amber-500/30"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'PDF डाउनलोड करें (Download PDF)' : 'Download Full PDF'}</span>
              </a>
            )}

            {/* Direct Copy URL button */}
            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-red-950 font-bold text-xs rounded-xl border border-amber-500/30 transition shadow-2xs"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'URL कॉपी हो गया!' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'hi' ? 'URL कॉपी करें' : 'Copy Article Link'}</span>
                </>
              )}
            </button>

            {/* Share Paper Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-2xs transition"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'hi' ? 'शेयर करें' : 'Share Paper'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
            <span>Views: <strong>{article.views_count || 0}</strong></span>
            <span>•</span>
            <span>Downloads: <strong>{article.downloads_count || 0}</strong></span>
          </div>

        </div>

        {/* ----------------- BILINGUAL ABSTRACT & KEYWORDS SECTION ----------------- */}
        <section className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 p-6 sm:p-8 rounded-2xl border-2 border-amber-900/20 shadow-2xs space-y-6">
          <h2 className="text-xl font-serif font-extrabold text-red-950 border-b border-amber-900/20 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" />
            <span>{lang === 'hi' ? 'शोध सार (Bilingual Abstracts)' : 'Bilingual Abstracts'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {article.abstract_hindi && (
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-slate-900 border-b border-amber-200 pb-1 text-xs uppercase tracking-wider">
                  शोध सार (हिंदी)
                </h3>
                <p className="text-slate-800 leading-relaxed font-sans text-justify">
                  {article.abstract_hindi}
                </p>
              </div>
            )}

            {article.abstract_english && (
              <div className={`space-y-2 ${article.abstract_hindi ? 'border-t md:border-t-0 md:border-l border-amber-200 pt-4 md:pt-0 md:pl-6' : ''}`}>
                <h3 className="font-serif font-bold text-slate-900 border-b border-amber-200 pb-1 text-xs uppercase tracking-wider">
                  Abstract (English)
                </h3>
                <p className="text-slate-800 leading-relaxed font-sans text-justify italic">
                  {article.abstract_english}
                </p>
              </div>
            )}
          </div>

          {/* Keywords / Index Terms */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="pt-4 border-t border-amber-900/10">
              <h4 className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-2.5">
                {lang === 'hi' ? 'बीज शब्द (Keywords / Index Terms)' : 'Index Terms & Keywords'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw, idx) => (
                  <span key={idx} className="text-xs font-serif bg-white text-slate-900 border border-amber-900/20 px-3 py-1 rounded-md shadow-2xs font-medium">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ----------------- HOW TO CITE SECTION ----------------- */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 print:hidden">
          <h2 className="text-sm font-serif font-bold text-red-950 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5">
              <Quote className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? 'इस शोध पत्र को उद्धृत करें (How to Cite)' : 'How to Cite This Article'}</span>
            </span>
          </h2>

          <div className="space-y-3">
            {/* APA */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-600">APA 7th Edition</span>
                <button
                  onClick={() => handleCopyCitation('apa')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-[11px] font-bold rounded flex items-center space-x-1 transition"
                >
                  {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'apa' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed">
                {citations.apa}
              </p>
            </div>

            {/* MLA */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-600">MLA 9th Edition</span>
                <button
                  onClick={() => handleCopyCitation('mla')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-[11px] font-bold rounded flex items-center space-x-1 transition"
                >
                  {copiedCitation === 'mla' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'mla' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed">
                {citations.mla}
              </p>
            </div>
          </div>
        </section>

        {/* ----------------- EDITORIAL & PEER REVIEW VERIFICATION ----------------- */}
        <section className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3 font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  {lang === 'hi' ? 'संपादकीय एवं पीर-रिव्यू प्रमाणीकरण' : 'Editorial Oversight & Peer-Review Verification'}
                </h4>
                <p className="text-[11px] text-stone-600">
                  {lang === 'hi' 
                    ? 'यह शोध पत्र पवारी शोध पत्रिका के संपादकीय मंडल द्वारा डबल-ब्लाइंड समीक्षा उपरांत स्वीकृत किया गया है।' 
                    : 'This paper has undergone double-blind peer-review governed by the journal editorial council.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveView('editorial_board');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-red-950 hover:text-red-800 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/30 transition shrink-0 cursor-pointer"
            >
              {lang === 'hi' ? 'संपादकीय मंडल देखें ➔' : 'View Editorial Board ➔'}
            </button>
          </div>
        </section>

      </article>

      {/* ----------------- RELATED ARTICLES SECTION ----------------- */}
      {(() => {
        const relatedArticles = articles
          .filter(a => a.id !== article.id && (a.category === article.category || a.issue === article.issue))
          .slice(0, 3);
        
        if (relatedArticles.length === 0) return null;

        return (
          <section className="bg-white border border-amber-900/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 print:hidden">
            <h2 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-amber-900/10 pb-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{lang === 'hi' ? 'संबंधित शोध आलेख (Related Research Articles)' : 'Related Research Articles'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setActiveView('article_detail', rel.slug || rel.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-amber-50/40 hover:bg-amber-50 border border-amber-900/10 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono bg-red-950 text-amber-100 px-2 py-0.5 rounded font-bold">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-slate-900 group-hover:text-red-900 line-clamp-2 leading-snug">
                      {rel.title_hindi}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 font-sans">
                      {rel.abstract_hindi || rel.abstract_english}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs font-mono text-amber-900 font-bold">
                    <span>Vol. {rel.volume}, {rel.year}</span>
                    <span className="group-hover:translate-x-1 transition-transform">पूरा देखें ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Share Modal */}
      <SharePaperModal
        article={article}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
      />

    </div>
  );
};
