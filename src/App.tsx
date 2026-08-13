import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CmsProvider, useCms } from './lib/CmsContext';
import { Article } from './types';
import { findArticle } from './lib/slugUtils';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdminQuickBar } from './components/common/AdminQuickBar';
import { HomeView } from './components/public/HomeView';
import { updateMetaTags } from './lib/seo';

// Lazy-loaded public views (HomeView is statically imported for instant LCP)
const AboutView = React.lazy(() => import('./components/public/AboutView').then(m => ({ default: m.AboutView })));
const CurrentIssueView = React.lazy(() => import('./components/public/CurrentIssueView').then(m => ({ default: m.CurrentIssueView })));
const ArchiveView = React.lazy(() => import('./components/public/ArchiveView').then(m => ({ default: m.ArchiveView })));
const ArticlesView = React.lazy(() => import('./components/public/ArticlesView').then(m => ({ default: m.ArticlesView })));
const BooksBlogsView = React.lazy(() => import('./components/public/BooksBlogsView').then(m => ({ default: m.BooksBlogsView })));
const ArticleDetailView = React.lazy(() => import('./components/public/ArticleDetailView').then(m => ({ default: m.ArticleDetailView })));
const EditorialBoardView = React.lazy(() => import('./components/public/EditorialBoardView').then(m => ({ default: m.EditorialBoardView })));
const AuthorGuidelinesView = React.lazy(() => import('./components/public/AuthorGuidelinesView').then(m => ({ default: m.AuthorGuidelinesView })));
const ManuscriptSubmissionView = React.lazy(() => import('./components/public/ManuscriptSubmissionView').then(m => ({ default: m.ManuscriptSubmissionView })));
const ContactView = React.lazy(() => import('./components/public/ContactView').then(m => ({ default: m.ContactView })));
const PawariLokgeetView = React.lazy(() => import('./components/public/PawariLokgeetView').then(m => ({ default: m.PawariLokgeetView })));
const NotFoundView = React.lazy(() => import('./components/common/NotFoundView').then(m => ({ default: m.NotFoundView })));

// Lazy-loaded global modals & admin components
const PdfViewerModal = React.lazy(() => import('./components/common/PdfViewerModal').then(m => ({ default: m.PdfViewerModal })));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const FullTextPublishingSuite = React.lazy(() => import('./components/admin/FullTextPublishingSuite').then(m => ({ default: m.FullTextPublishingSuite })));

const ViewLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-serif text-amber-950 font-semibold">लोड हो रहा है... / Loading...</p>
    </div>
  </div>
);

const AuthorArticleEditorView: React.FC<{
  selectedArticleId: string | null;
  articles: Article[];
  saveArticle: (art: Article) => Promise<void>;
  deleteArticle: (artId: string) => Promise<void>;
  setActiveView: (view: any) => void;
  setSelectedArticleId: (id: string | null) => void;
  lang: 'hi' | 'en';
}> = ({
  selectedArticleId,
  articles,
  saveArticle,
  deleteArticle,
  setActiveView,
  setSelectedArticleId,
  lang,
}) => {
  const foundArticle = findArticle(articles, selectedArticleId);
  const targetArticle = React.useMemo(() => {
    if (foundArticle) return foundArticle;
    const articleId = selectedArticleId && selectedArticleId !== 'new' ? selectedArticleId : 'art_' + Date.now();
    return {
      id: articleId,
      slug: `article-${Date.now()}`,
      title_hindi: 'नवीन शोध पत्र (New Article)',
      title_english: 'New Research Paper',
      authors: [{ id: 'aut_1', name_hindi: 'शोधकर्ता / Author', email: '', affiliation: '' }],
      abstract_hindi: '',
      abstract_english: '',
      keywords: ['पावारी भाषा', 'लोक साहित्य'],
      category: 'Research Paper',
      volume: 1,
      issue: 1,
      year: 2026,
      language: 'Hindi',
      status: 'draft',
      submitted_date: new Date().toISOString().split('T')[0],
      sections: [
        { id: 'sec_abstract', section_type: 'abstract', section_title: 'Abstract / सार', content_html: '<p>यहाँ सार दर्ज करें...</p>', sort_order: 1 },
        { id: 'sec_keywords', section_type: 'keywords', section_title: 'Keywords / कुंजी शब्द', content_html: '<p>कुंजी शब्द: पावारी भाषा, लोक साहित्य...</p>', sort_order: 2 },
        { id: 'sec_intro', section_type: 'introduction', section_title: '1. Introduction (प्रस्तावना)', content_html: '<p>प्रस्तावना का मुख्य पाठ यहाँ दर्ज करें...</p>', sort_order: 3 },
        { id: 'sec_literature', section_type: 'literature_review', section_title: '2. Literature Review (साहित्य अवलोकन)', content_html: '<p>साहित्य अवलोकन का विवरण...</p>', sort_order: 4 },
        { id: 'sec_methodology', section_type: 'methodology', section_title: '3. Research Methodology (अनुसंधान कार्यप्रणाली)', content_html: '<p>शोध कार्यप्रणाली विवरण...</p>', sort_order: 5 },
        { id: 'sec_results', section_type: 'results', section_title: '4. Results (परिणाम)', content_html: '<p>परिणाम विवरण...</p>', sort_order: 6 },
        { id: 'sec_discussion', section_type: 'discussion', section_title: '5. Discussion (विश्लेषण व विवेचना)', content_html: '<p>विवेचना विवरण...</p>', sort_order: 7 },
        { id: 'sec_conclusion', section_type: 'conclusion', section_title: '6. Conclusion (निष्कर्ष)', content_html: '<p>निष्कर्ष पाठ...</p>', sort_order: 8 },
        { id: 'sec_references', section_type: 'references', section_title: '7. References (संदर्भ ग्रंथ सूची)', content_html: '<p>1. पवार, राजेश (2024). पावारी भाषा व संस्कृति. भोपाल: साहित्य अकादमी.</p>', sort_order: 9 }
      ]
    } as unknown as Article;
  }, [foundArticle, selectedArticleId]);

  return (
    <React.Suspense fallback={<ViewLoader />}>
      <div className="min-h-screen bg-slate-100 p-2 sm:p-6">
        <FullTextPublishingSuite
          article={targetArticle}
          onSave={async (updatedArt) => {
            await saveArticle(updatedArt);
            if (selectedArticleId === 'new' || selectedArticleId !== updatedArt.id) {
              setSelectedArticleId(updatedArt.id);
            }
          }}
          onDelete={async (artId) => {
            await deleteArticle(artId);
            setActiveView('admin');
          }}
          onClose={() => {
            setActiveView('admin');
          }}
          lang={lang}
        />
      </div>
    </React.Suspense>
  );
};

const MainContent: React.FC = () => {
  const { 
    lang, 
    activeView, 
    selectedArticleId, 
    articles, 
    issues,
    isNotFound, 
    activePdfUrl, 
    activePdfTitle, 
    closePdfViewer, 
    settings,
    loadingData,
    saveArticle,
    deleteArticle,
    setActiveView,
    setSelectedArticleId
  } = useCms();
  const { currentUser, userProfile, loading } = useAuth();

  // Find currently selected article if viewing article_detail
  const currentArticle = React.useMemo(() => {
    if (activeView !== 'article_detail' || !selectedArticleId) return null;
    return findArticle(articles, selectedArticleId);
  }, [activeView, selectedArticleId, articles]);

  // Check if requested issue exists if viewing an issue path
  const isInvalidIssue = React.useMemo(() => {
    if (activeView !== 'archive') return false;
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const issueId = searchParams.get('issue') || (pathname.startsWith('/issue/') ? pathname.replace('/issue/', '').trim() : null);
    if (!issueId) return false;
    const exists = issues.some(i => 
      i.id === issueId || 
      String(i.issue_number) === issueId || 
      `vol-${i.volume}-iss-${i.issue_number}` === issueId ||
      `${i.volume}-${i.issue_number}` === issueId
    );
    return !exists && !loadingData;
  }, [activeView, issues, loadingData]);

  const isInvalidArticle = React.useMemo(() => {
    if (activeView !== 'article_detail' || !selectedArticleId) return false;
    if (!currentArticle) return !loadingData;
    // Hide non-published articles from public visitors
    if (!currentUser && currentArticle.status !== 'published') {
      return true;
    }
    return false;
  }, [activeView, selectedArticleId, currentArticle, loadingData, currentUser]);

  const pageIs404 = isNotFound || isInvalidArticle || isInvalidIssue;

  // Apply theme settings dynamically & update meta tags
  React.useEffect(() => {
    updateMetaTags(activeView, settings, currentArticle, lang, pageIs404);

    const preset = settings.theme_preset || 'maroon_gold';
    document.documentElement.className = `theme-${preset}`;
    if (preset === 'custom') {
      if (settings.primary_color) document.documentElement.style.setProperty('--color-brand-primary', settings.primary_color);
      if (settings.secondary_color) document.documentElement.style.setProperty('--color-brand-secondary', settings.secondary_color);
      if (settings.accent_color) document.documentElement.style.setProperty('--color-brand-accent', settings.accent_color);
    } else {
      document.documentElement.style.removeProperty('--color-brand-primary');
      document.documentElement.style.removeProperty('--color-brand-secondary');
      document.documentElement.style.removeProperty('--color-brand-accent');
    }
  }, [lang, activeView, selectedArticleId, currentArticle, settings, articles, pageIs404]);

  // If activeView is author_article_editor, render Full-Text Publishing Suite
  if (activeView === 'author_article_editor') {
    return (
      <AuthorArticleEditorView
        selectedArticleId={selectedArticleId}
        articles={articles}
        saveArticle={saveArticle}
        deleteArticle={deleteArticle}
        setActiveView={setActiveView}
        setSelectedArticleId={setSelectedArticleId}
        lang={lang}
      />
    );
  }

  // If activeView is admin, render Admin portal
  if (activeView === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 text-amber-100 flex items-center justify-center font-serif text-sm">
          Loading Admin Security Credentials...
        </div>
      );
    }
    return (
      <React.Suspense fallback={<ViewLoader />}>
        {!currentUser && !userProfile ? <AdminLogin /> : <AdminLayout />}
      </React.Suspense>
    );
  }

  // Public views
  const renderPublicView = () => {
    if (pageIs404) {
      return <NotFoundView />;
    }

    switch (activeView) {
      case 'home': return <HomeView />;
      case 'about': return <AboutView />;
      case 'current_issue': return <CurrentIssueView />;
      case 'archive': return <ArchiveView />;
      case 'articles': return <ArticlesView />;
      case 'books_blogs': return <BooksBlogsView />;
      case 'pawari_writers': return <BooksBlogsView initialTab="writers" />;
      case 'pawari_shabdkosh': return <BooksBlogsView initialTab="shabdkosh" />;
      case 'pawari_paheli': return <BooksBlogsView initialTab="paheli" />;
      case 'pawari_lokgeet': return <PawariLokgeetView />;
      case 'pawari_quiz': return <BooksBlogsView initialTab="quiz" />;
      case 'article_detail': 
        if (!currentArticle) return <NotFoundView />;
        return <ArticleDetailView />;
      case 'editorial_board': return <EditorialBoardView />;
      case 'author_guidelines': return <AuthorGuidelinesView />;
      case 'submit_manuscript': return <ManuscriptSubmissionView />;
      case 'contact': return <ContactView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-red-950">
      <AdminQuickBar />
      <Header />
      <main className="flex-1 pb-16">
        <React.Suspense fallback={<ViewLoader />}>
          {renderPublicView()}
        </React.Suspense>
      </main>
      <Footer />

      {/* Global Embedded PDF Modal */}
      {activePdfUrl && (
        <React.Suspense fallback={null}>
          <PdfViewerModal
            url={activePdfUrl}
            title={activePdfTitle || 'PDF Document'}
            onClose={closePdfViewer}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CmsProvider>
        <MainContent />
      </CmsProvider>
    </AuthProvider>
  );
}
