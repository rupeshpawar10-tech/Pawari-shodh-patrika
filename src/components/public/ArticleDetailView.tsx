import React, { useState, useEffect } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getEmbeddablePdfUrl, downloadPdf } from '../../lib/pdfUtils';
import { PdfCanvasViewer } from '../common/PdfCanvasViewer';
import { SharePaperModal } from '../common/SharePaperModal';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  Mail, 
  Building, 
  FileText,
  Quote,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { 
    lang, 
    articles, 
    selectedArticleId, 
    setActiveView, 
    openPdfViewer, 
    incrementArticleDownloads,
    loadingData
  } = useCms();

  const [activeTab, setActiveTab] = useState<'abstract' | 'pdf' | 'citation'>('abstract');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [displayPdfUrl, setDisplayPdfUrl] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const article = selectedArticleId 
    ? articles.find(a => a.id === selectedArticleId) 
    : articles[0];

  useEffect(() => {
    if (article?.pdf_url) {
      const { displayUrl, cleanup } = getEmbeddablePdfUrl(article.pdf_url);
      setDisplayPdfUrl(displayUrl);
      return () => cleanup();
    } else {
      setDisplayPdfUrl('');
    }
  }, [article?.pdf_url]);

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
      <div className="max-w-4xl mx-auto my-12 p-12 text-center text-slate-600 font-serif space-y-4 bg-white rounded-3xl border border-amber-900/10 shadow-md">
        <h3 className="text-lg font-bold text-red-950">{lang === 'hi' ? 'शोध पत्र नहीं मिला' : 'Research Paper Not Found'}</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {lang === 'hi' ? 'यह शोध पत्र हटा दिया गया है या शेयर लिंक अमान्य है।' : 'This research paper may have been removed or the shared link is invalid.'}
        </p>
        <button 
          onClick={() => setActiveView('articles')} 
          className="mt-2 px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl shadow transition"
        >
          {lang === 'hi' ? 'सभी शोध पत्र देखें' : 'View All Research Papers'}
        </button>
      </div>
    );
  }

  const authorsText = article.authors.map(a => a.name).join(', ');
  const journalTitle = 'Pawari Shodh Patrika';
  const doiText = article.doi || `10.5281/zenodo.psp.${article.year}.${article.id}`;

  // Citations
  const citations = {
    apa: `${authorsText}. (${article.year}). ${article.title_english}. ${journalTitle}, ${article.volume}(${article.issue}), ${article.page_numbers || '1-15'}. https://doi.org/${doiText}`,
    mla: `${authorsText}. "${article.title_english}." ${journalTitle}, vol. ${article.volume}, no. ${article.issue}, ${article.year}, pp. ${article.page_numbers || '1-15'}.`,
    chicago: `${authorsText}. "${article.title_english}." ${journalTitle} ${article.volume}, no. ${article.issue} (${article.year}): ${article.page_numbers || '1-15'}.`
  };

  const handleCopyCitation = (type: keyof typeof citations) => {
    navigator.clipboard.writeText(citations[type]);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleDownload = () => {
    if (article.id && article.pdf_url) {
      incrementArticleDownloads(article.id);
      downloadPdf(article.pdf_url, `${article.title_english || 'article'}.pdf`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-8 py-3 sm:py-8 space-y-4 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => setActiveView('articles')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-900 hover:text-red-700 bg-amber-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-amber-500/30 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{lang === 'hi' ? 'शोध पत्र सूची पर वापस जाएं' : 'Back to Articles Index'}</span>
        </button>
      </div>

      {/* Main Article Header Card */}
      <div className="bg-white border border-amber-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-10 shadow-sm space-y-4 sm:space-y-6">
        
        {/* Metadata badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-amber-900/10 pb-3 sm:pb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-amber-500 text-red-950 font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs">
              Volume {article.volume}, Issue {article.issue} ({article.year})
            </span>
            <span className="bg-red-100 text-red-950 font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs">
              {article.category}
            </span>
            <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs">
              Language: {article.language}
            </span>
          </div>

          <div className="text-slate-500 font-semibold text-[11px] sm:text-xs flex items-center space-x-1">
            <span>DOI:</span>
            <a 
              href={`https://doi.org/${doiText}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 hover:underline flex items-center space-x-1"
            >
              <span>{doiText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Article Titles */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-lg sm:text-3xl font-serif font-bold text-slate-900 leading-snug">
            {article.title_hindi}
          </h1>
          <h2 className="text-sm sm:text-xl font-serif text-slate-700 italic leading-snug">
            {article.title_english}
          </h2>
        </div>

        {/* Authors Info */}
        <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-900/10 space-y-3">
          <h3 className="text-xs font-serif font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'hi' ? 'लेखक एवं शोधकर्ता (Authors & Affiliations)' : 'Authors & Affiliations'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {article.authors.map((auth, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                <div className="flex items-center space-x-2 font-serif font-bold text-slate-900">
                  <span>{auth.name}</span>
                  {auth.is_corresponding && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {lang === 'hi' ? 'मुख्य शोधकर्ता' : 'Corresponding Author'}
                    </span>
                  )}
                </div>
                {auth.affiliation && (
                  <p className="text-xs text-slate-600 flex items-start space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{auth.affiliation}</span>
                  </p>
                )}
                {auth.email && (
                  <p className="text-xs text-red-900 font-mono flex items-center space-x-1.5 pt-0.5">
                    <Mail className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                    <a href={`mailto:${auth.email}`} className="hover:underline">{auth.email}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openPdfViewer(article.pdf_url || '', lang === 'hi' ? article.title_hindi : article.title_english)}
              className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'PDF देखें (View Embedded PDF)' : 'View Embedded PDF'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'hi' ? 'शेयर करें (WhatsApp/Social)' : 'Share Paper'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
            <span>Views: <strong>{article.views_count || 0}</strong></span>
            <span>•</span>
            <span>Downloads: <strong>{article.downloads_count || 0}</strong></span>
          </div>

        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-6 shadow-xs space-y-6">
        
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('abstract')}
            className={`px-5 py-3 text-xs font-bold font-serif transition border-b-2 ${
              activeTab === 'abstract'
                ? 'border-red-900 text-red-950 bg-amber-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? 'शोध सार (Bilingual Abstracts)' : 'Bilingual Abstracts'}
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-5 py-3 text-xs font-bold font-serif transition border-b-2 ${
              activeTab === 'pdf'
                ? 'border-red-900 text-red-950 bg-amber-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? 'एम्बेडेड PDF दर्शक (PDF Reader)' : 'PDF Reader'}
          </button>

          <button
            onClick={() => setActiveTab('citation')}
            className={`px-5 py-3 text-xs font-bold font-serif transition border-b-2 ${
              activeTab === 'citation'
                ? 'border-red-900 text-red-950 bg-amber-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? 'साइटेशन / उद्धरण (Cite Article)' : 'Cite Article'}
          </button>
        </div>

        {/* Tab 1: Abstracts */}
        {activeTab === 'abstract' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Hindi Abstract */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-red-950 text-base border-b border-amber-900/10 pb-1">
                शोध सार (हिंदी)
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-sans bg-amber-50/30 p-4 rounded-xl border border-amber-900/10">
                {article.abstract_hindi}
              </p>
            </div>

            {/* English Abstract */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-red-950 text-base border-b border-amber-900/10 pb-1">
                Abstract (English)
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-sans bg-amber-50/30 p-4 rounded-xl border border-amber-900/10">
                {article.abstract_english}
              </p>
            </div>

            {/* Keywords */}
            <div className="pt-2">
              <h4 className="text-xs font-serif font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'hi' ? 'बीज शब्द (Keywords)' : 'Index Keywords'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw, i) => (
                  <span key={i} className="text-xs font-mono font-semibold bg-red-900/10 text-red-950 border border-red-900/20 px-3 py-1 rounded-full">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: PDF Reader Embedded */}
        {activeTab === 'pdf' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <PdfCanvasViewer 
              url={article.pdf_url || ''} 
              title={lang === 'hi' ? article.title_hindi : article.title_english} 
              onDownload={handleDownload}
              className="h-[680px]" 
            />
          </div>
        )}

        {/* Tab 3: Citation Generator */}
        {activeTab === 'citation' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-slate-600">
              {lang === 'hi' ? 'अपने शोध या ग्रंथसूची में जोड़ने के लिए पसंदीदा फॉर्मेट कॉपी करें:' : 'Copy reference citation format for your manuscript bibliography:'}
            </p>

            {/* APA */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">APA 7th Edition</span>
                <button
                  onClick={() => handleCopyCitation('apa')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'apa' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.apa}
              </p>
            </div>

            {/* MLA */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">MLA 9th Edition</span>
                <button
                  onClick={() => handleCopyCitation('mla')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'mla' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'mla' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.mla}
              </p>
            </div>

            {/* Chicago */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">Chicago 17th Edition</span>
                <button
                  onClick={() => handleCopyCitation('chicago')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'chicago' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'chicago' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.chicago}
              </p>
            </div>

          </div>
        )}

      </div>

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
