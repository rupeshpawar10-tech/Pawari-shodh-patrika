import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { SharePaperModal } from '../common/SharePaperModal';
import { EditorialBoardDisplay } from '../common/EditorialBoardDisplay';
import { AcademicBreadcrumbs } from '../common/AcademicBreadcrumbs';
import { TopicClusterNav } from '../common/TopicClusterNav';
import { RelatedKnowledgeHub } from '../common/RelatedKnowledgeHub';
import { BookOpen, Download, Eye, Calendar, User, FileText, ArrowRight, Share2, Users } from 'lucide-react';

export const CurrentIssueView: React.FC = () => {
  const { 
    lang, 
    issues, 
    articles, 
    selectedIssueId,
    setSelectedIssueId,
    setSelectedArticleId, 
    setActiveView, 
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads 
  } = useCms();

  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);

  const selectedIssue = React.useMemo(() => {
    if (selectedIssueId) {
      const found = issues.find(i => 
        i.id === selectedIssueId || 
        String(i.issue_number) === selectedIssueId ||
        `vol-${i.volume}-iss-${i.issue_number}` === selectedIssueId ||
        `${i.volume}-${i.issue_number}` === selectedIssueId
      );
      if (found) return found;
    }
    return issues.find(i => i.status === 'current') || issues[0];
  }, [issues, selectedIssueId]);

  const allPublished = articles.filter(a => !a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase()));

  const issueArticles = selectedIssue 
    ? articles.filter(a => Number(a.volume) === Number(selectedIssue.volume) && Number(a.issue) === Number(selectedIssue.issue_number) && (!a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase())))
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
      
      {/* ----------------- BREADCRUMB NAVIGATION ----------------- */}
      <AcademicBreadcrumbs
        items={[
          { label: 'शोध आलेख', labelEn: 'Articles', view: 'articles' },
          { 
            label: selectedIssue ? `वर्तमान अंक: Vol. ${selectedIssue.volume} Iss. ${selectedIssue.issue_number}` : 'वर्तमान अंक', 
            labelEn: selectedIssue ? `Current Issue: Vol. ${selectedIssue.volume} Iss. ${selectedIssue.issue_number}` : 'Current Issue', 
            view: 'current_issue' 
          }
        ]}
      />

      {/* Issues selector dropdown if multiple issues available */}
      {issues.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 gloss-3d-card p-4 rounded-2xl text-xs">
          <div className="flex items-center space-x-2 text-stone-800">
            <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">{lang === 'hi' ? 'पत्रिका अंक चुनें:' : 'Select Journal Issue:'}</span>
          </div>
          <select
            value={selectedIssue.id}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="px-3.5 py-1.5 bg-white/95 border border-stone-300 rounded-xl font-serif font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 shadow-inner cursor-pointer text-xs"
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
      <div className="gloss-3d-card-dark text-amber-100 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 gloss-sheen">
        
        <div className="w-32 sm:w-52 aspect-3/4 mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl flex-shrink-0 bg-black">
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
          <div className="inline-block bg-amber-500 text-red-950 font-bold font-mono text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {selectedIssue.status === 'current' 
              ? (lang === 'hi' ? '★ मुख्य वर्तमान अंक (Current Issue)' : '★ Active Current Issue')
              : (lang === 'hi' ? `खंड ${selectedIssue.volume}, अंक ${selectedIssue.issue_number}` : `Volume ${selectedIssue.volume}, Issue ${selectedIssue.issue_number}`)
            }
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 drop-shadow-sm leading-tight">
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
            <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-500/25 text-xs sm:text-sm text-stone-200 leading-relaxed shadow-inner">
              <p className="font-semibold text-amber-300 mb-1">{lang === 'hi' ? 'संपादकीय नोट:' : 'Editorial Note:'}</p>
              <p>{lang === 'hi' ? selectedIssue.editorial_note_hindi : selectedIssue.editorial_note_english}</p>
            </div>
          )}
        </div>

      </div>

      {/* Table of Contents */}
      <div className="gloss-3d-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
            {lang === 'hi' ? 'अनुक्रमणिका एवं शोध पत्र सूची (Table of Contents)' : 'Table of Contents & Research Articles'}
          </h2>
          <span className="text-xs font-mono font-bold bg-amber-500/15 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full shadow-2xs">
            {displayArticles.length} {lang === 'hi' ? 'शोध पत्र' : 'Papers'}
          </span>
        </div>

        <div className="space-y-4">
          {displayArticles.map((art, idx) => (
            <div 
              key={art.id}
              onClick={() => handleArticleClick(art.id)}
              className="gloss-3d-card p-5 rounded-2xl transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="font-bold text-amber-900 bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                  <span className="bg-stone-200/80 text-stone-800 font-semibold px-2.5 py-0.5 rounded-md">
                    {art.category}
                  </span>
                  <span>Pages: {art.page_numbers || '01-15'}</span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-red-950 leading-snug">
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

                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  {art.authors.map(a => a.name).join(', ')}
                </p>

                <p className="text-xs text-stone-600 line-clamp-2 pt-1 leading-relaxed">
                  {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalArticle(art);
                  }}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-200" />
                  <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                </button>
                {art.pdf_url && art.pdf_url.trim() !== '' && art.pdf_url !== '#' && !art.pdf_url.includes('undefined') && (
                  <>
                    <button
                      onClick={(e) => handlePdfView(e, art)}
                      className="gloss-3d-btn-secondary px-3.5 py-2 text-stone-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-700" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                      className="gloss-3d-btn-primary px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
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

      {/* Editorial & Peer Review Oversight Section */}
      <div className="gloss-3d-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-900 px-3 py-0.5 rounded-full text-xs font-mono font-bold border border-amber-500/20 mb-2">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'अंक समीक्षा परिषद' : 'Issue Editorial Oversight'}</span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              {lang === 'hi' ? 'संपादकीय नेतृत्व एवं समीक्षा मंडल' : 'Editorial Leadership & Reviewers'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === 'hi'
                ? 'इस अंक के शोध पत्रों की समीक्षा एवं संपादन पवारी शोध पत्रिका के केंद्रीय संपादकीय मंडल द्वारा अनुमोदित है।'
                : 'Papers in this volume are peer-reviewed and vetted under the direction of the journal editorial board.'}
            </p>
          </div>

          <button
            onClick={() => {
              setActiveView('editorial_board');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="gloss-3d-btn-maroon inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0"
          >
            <span>{lang === 'hi' ? 'समस्त संपादकीय मंडल देखें' : 'View Full Editorial Board'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <EditorialBoardDisplay variant="compact" maxItems={4} onMemberClick={() => setActiveView('editorial_board')} />
      </div>

      {/* Share Modal */}
      <SharePaperModal
        article={shareModalArticle}
        isOpen={!!shareModalArticle}
        onClose={() => setShareModalArticle(null)}
        lang={lang}
      />

      {/* ----------------- INTERLINKED KNOWLEDGE CLUSTERS ----------------- */}
      <div className="space-y-6 pt-4 border-t border-stone-200/80">
        <RelatedKnowledgeHub contextType="issue" />
        <TopicClusterNav />
      </div>

    </div>
  );
};
