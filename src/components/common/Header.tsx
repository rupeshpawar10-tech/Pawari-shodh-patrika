import React, { useState, useEffect } from 'react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { getUrlForView } from '../../lib/router';
import { SafeImage } from './SafeImage';
import { 
  BookOpen, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  FileText,
  Search,
  Award,
  Folder
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, activeView, setActiveView, settings, setSelectedArticleId } = useCms();
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(true);

  // Auto-hide header on scroll down, show on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (mobileMenuOpen) {
            setIsVisible(true);
          } else if (currentScrollY <= 40) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY + 6 && currentScrollY > 70) {
            // Scrolling DOWN -> Hide Header
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY - 6) {
            // Scrolling UP -> Show Header
            setIsVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const navs = settings.navigation_labels;

  const mainNav: { key: PublicPageView; label: string }[] = [
    { key: 'home', label: lang === 'hi' ? navs.home_hindi : navs.home_english },
    { key: 'about', label: lang === 'hi' ? navs.about_hindi : navs.about_english },
    { key: 'current_issue', label: lang === 'hi' ? navs.current_issue_hindi : navs.current_issue_english },
    { key: 'archive', label: lang === 'hi' ? navs.archive_hindi : navs.archive_english },
    { key: 'books_blogs', label: lang === 'hi' ? '📚 पवारी साहित्य' : '📚 Pawari Literature' },
    { key: 'editorial_board', label: lang === 'hi' ? navs.editorial_board_hindi : navs.editorial_board_english },
    { key: 'author_guidelines', label: lang === 'hi' ? navs.author_guidelines_hindi : navs.author_guidelines_english },
    { key: 'contact', label: lang === 'hi' ? navs.contact_hindi : navs.contact_english },
  ];

  const handleNavClick = (key: PublicPageView) => {
    if (key !== 'article_detail') {
      setSelectedArticleId(null);
    }
    setActiveView(key);
    setMobileMenuOpen(false);
    setIsVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`bg-white border-b border-amber-900/15 shadow-xs sticky top-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
      }`}
    >
      
      {/* Main Journal Branding Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo + Full Journal Title */}
        <a 
          href={getUrlForView('home')}
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              handleNavClick('home');
            }
          }}
          className="flex items-center space-x-2 sm:space-x-3.5 cursor-pointer group select-none min-w-0 flex-1"
        >
          {/* Emblem / Seal Logo */}
          <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-900 via-red-950 to-amber-900 border border-amber-500/50 p-0.5 flex items-center justify-center shadow-2xs flex-shrink-0 group-hover:scale-105 transition duration-200 overflow-hidden">
            {settings.logo_url ? (
              <SafeImage 
                src={settings.logo_url} 
                alt="Journal Seal Logo" 
                loading="eager"
                fetchPriority="high"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-full" 
              />
            ) : (
              <div className="w-full h-full rounded-full border border-amber-300/40 flex flex-col items-center justify-center bg-red-950 text-amber-300 p-0.5">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
            )}
          </div>

          {/* Titles - Responsive Font & Leading */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xs sm:text-2xl md:text-3xl font-serif font-bold text-red-950 tracking-tight leading-tight whitespace-normal">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>
            <p className="text-[9px] sm:text-xs md:text-sm text-slate-700 font-serif font-medium leading-tight mt-0.5 truncate sm:whitespace-normal">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>
          </div>
        </a>

        {/* Right Controls: Language Switcher + CMS + Mobile Menu Toggle Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-300 shadow-2xs">
            <button
              onClick={() => setLang('hi')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium rounded-full transition min-h-[32px] sm:min-h-[36px] flex items-center justify-center ${
                lang === 'hi'
                  ? 'bg-red-950 text-amber-300 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium rounded-full transition min-h-[32px] sm:min-h-[36px] flex items-center justify-center ${
                lang === 'en'
                  ? 'bg-red-950 text-amber-300 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* User Account / CMS Portal Button */}
          {currentUser || userProfile ? (
            <div className="flex items-center space-x-1 sm:space-x-1.5 bg-amber-50 text-amber-950 px-1.5 sm:px-2 py-1 rounded-lg border border-amber-300 text-xs shadow-2xs">
              <span className="font-bold text-slate-800 text-[11px] max-w-[120px] truncate hidden md:inline">
                {userProfile?.display_name || userProfile?.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={() => handleNavClick('admin')}
                className="bg-red-950 hover:bg-red-900 active:bg-red-800 text-amber-300 font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition flex items-center space-x-1 min-h-[32px] sm:min-h-[36px]"
                title="Go to CMS Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{userProfile?.role === 'super_admin' ? 'Super Admin' : 'CMS'}</span>
                <span className="sm:hidden">CMS</span>
              </button>
              <button 
                onClick={() => logout()}
                title="Sign Out / Logout"
                className="text-slate-600 hover:text-red-700 p-1 sm:p-1.5 rounded-lg hover:bg-red-100 transition min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-red-950 font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs transition shadow-2xs min-h-[34px] sm:min-h-[38px]"
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'साइन-इन / लॉगिन' : 'Sign In / CMS'}</span>
              <span className="sm:hidden">{lang === 'hi' ? 'लॉगिन' : 'CMS'}</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-800 hover:text-red-950 rounded-xl bg-slate-100 active:bg-slate-200 border border-slate-300 flex-shrink-0 min-h-[36px] min-w-[36px] sm:min-h-[42px] sm:min-w-[42px] flex items-center justify-center shadow-2xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-900" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

        </div>

      </div>

      {/* Navigation Bar */}
      <div 
        className="text-amber-100 border-t border-amber-900/10 transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-brand-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          
          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center justify-between overflow-x-visible py-0">
            {mainNav.map((item) => {
              const isActive = activeView === item.key;
              const href = getUrlForView(item.key);
              return (
                <a
                  key={item.key}
                  href={href}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      handleNavClick(item.key);
                    }
                  }}
                  className={`px-3 py-2 text-xs font-medium tracking-wide transition relative whitespace-nowrap ${
                    isActive
                      ? 'text-amber-300 bg-red-900/90 font-bold border-b-2 border-amber-400'
                      : 'text-amber-100/90 hover:text-amber-200 hover:bg-red-900/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

        </div>

        {/* Mobile Backdrop & Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop for easy tap-to-close */}
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Drawer Menu */}
            <div className="relative z-40 lg:hidden bg-red-950 border-t-2 border-amber-500/40 px-3 py-2 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
              {mainNav.map((item) => {
                const isActive = activeView === item.key;
                const href = getUrlForView(item.key);
                return (
                  <a
                    key={item.key}
                    href={href}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        handleNavClick(item.key);
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-between transition min-h-[42px] touch-active ${
                      isActive
                        ? 'bg-amber-400 text-red-950 font-bold shadow-md'
                        : 'text-amber-100 hover:bg-red-900/80 active:bg-red-900'
                    }`}
                  >
                    <span className="font-serif">{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-950' : 'text-amber-400/80'}`} />
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>

    </header>
  );
};
