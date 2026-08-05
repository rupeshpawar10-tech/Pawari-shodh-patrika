import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CmsProvider, useCms } from './lib/CmsContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { AdminQuickBar } from './components/common/AdminQuickBar';

import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { CurrentIssueView } from './components/public/CurrentIssueView';
import { ArchiveView } from './components/public/ArchiveView';
import { ArticlesView } from './components/public/ArticlesView';
import { BooksBlogsView } from './components/public/BooksBlogsView';
import { ArticleDetailView } from './components/public/ArticleDetailView';
import { EditorialBoardView } from './components/public/EditorialBoardView';
import { AuthorGuidelinesView } from './components/public/AuthorGuidelinesView';
import { ManuscriptSubmissionView } from './components/public/ManuscriptSubmissionView';
import { ContactView } from './components/public/ContactView';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

const MainContent: React.FC = () => {
  const { activeView, activePdfUrl, activePdfTitle, closePdfViewer, settings } = useCms();
  const { currentUser, userProfile, loading } = useAuth();

  // Apply theme settings dynamically
  React.useEffect(() => {
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
  }, [settings.theme_preset, settings.primary_color, settings.secondary_color, settings.accent_color]);

  // If activeView is admin, render Admin portal
  if (activeView === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 text-amber-100 flex items-center justify-center font-serif text-sm">
          Loading Admin Security Credentials...
        </div>
      );
    }
    if (!currentUser && !userProfile) {
      return <AdminLogin />;
    }
    return <AdminLayout />;
  }

  // Public views
  const renderPublicView = () => {
    switch (activeView) {
      case 'home': return <HomeView />;
      case 'about': return <AboutView />;
      case 'current_issue': return <CurrentIssueView />;
      case 'archive': return <ArchiveView />;
      case 'articles': return <BooksBlogsView />;
      case 'books_blogs': return <BooksBlogsView />;
      case 'article_detail': return <ArticleDetailView />;
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
        {renderPublicView()}
      </main>
      <Footer />

      {/* Global Embedded PDF Modal */}
      {activePdfUrl && (
        <PdfViewerModal
          url={activePdfUrl}
          title={activePdfTitle || 'PDF Document'}
          onClose={closePdfViewer}
        />
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
