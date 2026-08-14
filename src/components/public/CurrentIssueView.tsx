import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { SharePaperModal } from '../common/SharePaperModal';
import { BookOpen, Download, Eye, Calendar, User, FileText, ArrowRight, Share2 } from 'lucide-react';

export const CurrentIssueView: React.FC = () => {
  const { 
    lang, 
    issues, 
    articles, 
    setSelectedArticleId, 
    setActiveView, 
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads 
  } = useCms();

  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(() => {
    const active = issues.find(i => i.status === 'current');
    return active ? active.id : (issues[0]?.id || '');
  });

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || issues.find(i => i.status === 'current') || issues[0];

  const allPublished = articles.filter(a => a.status?.toLowerCase() === 'published' || a.status?.toLowerCase() === 'accepted');

  const issueArticles = selectedIssue 
    ? articles.filter(a => Number(a.volume) === Number(selectedIssue.volume) && Number(a.issue) === Number(selectedIssue.issue_number) && (a.status?.toLowerCase() === 'published' || a.status?.toLowerCase() === 'accepted'))
    : allPublished;

  const displayArticles = issueArticles.length > 0 ? issueArticles : allPublished;

  const handleArticleClick = (artId: string) => {
    const art = articles.find(a => a.id === artId || a.slug === artId);
    const targetId = art?.id || artId;
    incrementArticleViews(targetId);
    setActiveView('article_detail', art?.slug || targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfView = (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    incrementArticleViews(art.id);
    openPdfViewer(art.pdf_url || '', lang === 'hi' ? art.title_hindi : art.title_english);
  };

  const handlePdfDownload = (e: React.MouseEvent, artId: string, pdfUrl: string, title?: string) => {
    e.stopPropagation();
    incrementArticleDownloads(artId);
    downloadPdf(pdfUrl, title || 'article.pdf');
  };

  if (!selectedIssue) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-serif">
        <p>No journal issue published yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Issues selector dropdown if multiple issues available */}
      {issues.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/80 border border-amber-900/10 p-3.5 rounded-xl text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">{lang === 'hi' ? 'पत्रिका अंक चुनें:' : 'Select Journal Issue:'}</span>
          </div>
          <select
            value={selectedIssue.id}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-amber-900/20 rounded-lg font-serif font-bold text-slate-900 focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer text-xs"
          >
            {issues.map(iss => (
              <option key={iss.id} value={iss.id}>
                {iss.status === 'current' ? '★ ' : ''}Vol {iss.volume} Issue {iss.issue_number} ({iss.year}) - {lang === 'hi' ? iss.title_hindi : iss.title_english}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Issue Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-10 shadow-lg border border-amber-500/30 flex flex-col md:flex-row items-center gap-8">
        
        <div className="w-28 sm:w-52 aspect-3/4 mx-auto md:mx-0 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-xl flex-shrink-0 bg-black">
          <SafeImage 
            src={selectedIssue.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'} 
            alt="Current Journal Issue Cover"
            loading="eager"
            fetchPriority="high"
            width={208}
            height={277}
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="inline-block bg-amber-500 text-red-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            {selectedIssue.status === 'current' 
              ? (lang === 'hi' ? '★ मुख्य वर्तमान अंक (Current Issue)' : '★ Active Current Issue')
              : (lang === 'hi' ? `खंड ${selectedIssue.volume}, अंक ${selectedIssue.issue_number}` : `Volume ${selectedIssue.volume}, Issue ${selectedIssue.issue_number}`)
            }
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            {lang === 'hi' ? selectedIssue.title_hindi : selectedIssue.title_english}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-amber-300">
            <span>Volume {selectedIssue.volume}</span>
            <span>•</span>
            <span>Issue {selectedIssue.issue_number}</span>
            <span>•</span>
            <span>{selectedIssue.year}</span>
            <span>•</span>
            <span>Published: {selectedIssue.publication_date}</span>
          </div>

          {(selectedIssue.editorial_note_hindi || selectedIssue.editorial_note_english) && (
            <div className="bg-black/30 p-4 rounded-xl border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <p className="font-semibold text-amber-300 mb-1">{lang === 'hi' ? 'संपादकीय नोट:' : 'Editorial Note:'}</p>
              <p>{lang === 'hi' ? selectedIssue.editorial_note_hindi : selectedIssue.editorial_note_english}</p>
            </div>
          )}
        </div>

      </div>

      {/* Table of Contents */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
          <h2 className="text-xl font-serif font-bold text-red-950">
            {lang === 'hi' ? 'अनुक्रमणिका एवं शोध पत्र सूची (Table of Contents)' : 'Table of Contents & Research Articles'}
          </h2>
          <span className="text-xs font-mono font-semibold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            {displayArticles.length} {lang === 'hi' ? 'शोध पत्र' : 'Papers'}
          </span>
        </div>

        <div className="space-y-4">
          {displayArticles.map((art, idx) => (
            <div 
              key={art.id}
              onClick={() => handleArticleClick(art.id)}
              className="bg-slate-50/70 hover:bg-amber-50/60 p-5 rounded-xl border border-slate-200/80 hover:border-amber-400/50 shadow-2xs transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <span className="bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                  <span>Pages: {art.page_numbers || '01-15'}</span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
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

                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {art.authors.map(a => a.name).join(', ')}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                  {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalArticle(art);
                  }}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <Share2 className="w-4 h-4 text-emerald-200" />
                  <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                </button>
                {art.pdf_url && art.pdf_url.trim() !== '' && art.pdf_url !== '#' && !art.pdf_url.includes('undefined') && (
                  <>
                    <button
                      onClick={(e) => handlePdfView(e, art)}
                      className="px-3 py-2 bg-slate-100 hover:bg-red-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded-lg transition flex items-center space-x-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
