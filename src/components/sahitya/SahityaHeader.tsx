import React from 'react';
import { LucideIcon, ArrowLeft, Sparkles, BookOpen, Layers, Share2, PlusCircle } from 'lucide-react';
import { useCms } from '../../lib/CmsContext';

export interface SahityaHeaderProps {
  titleHindi: string;
  titleEnglish: string;
  subtitleHindi: string;
  subtitleEnglish: string;
  icon: LucideIcon;
  badgeHindi?: string;
  badgeEnglish?: string;
  itemCount?: number;
  currentSection: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'writers' | 'reviews' | 'quiz';
  onSectionChange: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'writers' | 'reviews' | 'quiz') => void;
  onContributeClick?: () => void;
}

export const SahityaHeader: React.FC<SahityaHeaderProps> = ({
  titleHindi,
  titleEnglish,
  subtitleHindi,
  subtitleEnglish,
  icon: Icon,
  badgeHindi,
  badgeEnglish,
  itemCount,
  currentSection,
  onSectionChange,
  onContributeClick
}) => {
  const { lang } = useCms();

  const sections: { id: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'writers' | 'reviews' | 'quiz'; labelHindi: string; labelEnglish: string; icon: string }[] = [
    { id: 'hub', labelHindi: 'साहित्य केंद्र (Hub)', labelEnglish: 'Sahitya Hub', icon: '🏛️' },
    { id: 'writers', labelHindi: 'लेखक एवं साहित्यकार', labelEnglish: 'Writers & Scholars', icon: '✍️' },
    { id: 'shabdkosh', labelHindi: 'पवारी शब्दकोश', labelEnglish: 'Dictionary', icon: '📖' },
    { id: 'paheli', labelHindi: 'पवारी पहेलियाँ', labelEnglish: 'Riddles', icon: '🧩' },
    { id: 'lokgeet', labelHindi: 'लोकगीत संग्रह', labelEnglish: 'Folk Songs', icon: '🎵' },
    { id: 'books', labelHindi: 'ग्रंथ व ई-पुस्तकें', labelEnglish: 'Books Library', icon: '📚' },
    { id: 'reviews', labelHindi: 'समीक्षा एवं समालोचना', labelEnglish: 'Reviews', icon: '📝' },
    { id: 'quiz', labelHindi: 'संस्कृति क्विज़ व प्रमाण-पत्र', labelEnglish: 'Quiz & Cert', icon: '🏆' },
  ];

  return (
    <header className="space-y-4">
      {/* Top Meta Bar & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-200 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-stone-500 font-medium flex-wrap">
          <button 
            type="button"
            onClick={() => onSectionChange('hub')}
            className="hover:text-red-900 transition flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'hi' ? 'माँ ताप्ती पवारी शोध' : 'Maa Tapti Pawari'}</span>
          </button>
          <span>/</span>
          <button 
            type="button"
            onClick={() => onSectionChange('hub')}
            className="hover:text-red-900 transition cursor-pointer"
          >
            <span>{lang === 'hi' ? 'पवारी साहित्य केंद्र' : 'Pawari Sahitya Hub'}</span>
          </button>
          {currentSection !== 'hub' && (
            <>
              <span>/</span>
              <span className="text-stone-900 font-semibold">
                {lang === 'hi' ? titleHindi : titleEnglish}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {onContributeClick && (
            <button
              type="button"
              onClick={onContributeClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-900 hover:bg-red-950 text-amber-100 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '+ सामग्री जोड़ें' : '+ Contribute'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Page Title Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-red-950 text-stone-100 p-6 sm:p-8 border border-stone-800 shadow-md">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 bottom-4 text-stone-800/40 pointer-events-none select-none">
          <Icon className="w-32 h-32 opacity-20" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {lang === 'hi' ? (badgeHindi || 'पवारी डिजिटल आर्काइव') : (badgeEnglish || 'Pawari Digital Archive')}
            </span>
            {itemCount !== undefined && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-800/80 text-stone-300 border border-stone-700 text-xs font-mono font-medium">
                {itemCount} {lang === 'hi' ? 'प्रविष्टियाँ' : 'Entries'}
              </span>
            )}
          </div>

          <div className="flex items-start gap-4 pt-1">
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0 hidden sm:flex items-center justify-center shadow-inner">
              <Icon className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-tight">
                {lang === 'hi' ? titleHindi : titleEnglish}
              </h1>
              <p className="text-stone-300 text-sm sm:text-base mt-1.5 leading-relaxed">
                {lang === 'hi' ? subtitleHindi : subtitleEnglish}
              </p>
            </div>
          </div>
        </div>

        {/* Universal Sahitya Sub-Navigation (Wrapping cleanly, zero horizontal scroll) */}
        <div className="relative z-10 mt-6 pt-5 border-t border-stone-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300/80 font-bold mb-2.5">
            {lang === 'hi' ? 'साहित्य प्रभाग चयन (Sahitya Ecosystem):' : 'Explore Sahitya Categories:'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sections.map((sec) => {
              const isActive = currentSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => onSectionChange(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs ring-2 ring-amber-300/60'
                      : 'bg-stone-800/80 hover:bg-stone-750 text-stone-200 border border-stone-700/80 hover:border-amber-400/40'
                  }`}
                >
                  <span className="text-sm leading-none">{sec.icon}</span>
                  <span>{lang === 'hi' ? sec.labelHindi : sec.labelEnglish}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
