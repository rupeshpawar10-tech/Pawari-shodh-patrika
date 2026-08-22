import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem } from '../../types';
import { findShabdkosh, createSlug } from '../../lib/slugUtils';
import { SahityaShareBar } from './SahityaShareBar';
import { SAMPLE_SHABDKOSH } from '../../data/pawariCulturalData';

export interface ShabdkoshDetailViewProps {
  slugOrId: string;
  onBack?: () => void;
  onNavigateSection?: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
}

export const ShabdkoshDetailView: React.FC<ShabdkoshDetailViewProps> = ({
  slugOrId,
  onBack,
  onNavigateSection
}) => {
  const { lang, shabdkoshList, setSelectedShabdkoshId, setActiveView } = useCms();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Combine database with local sample vocabulary to ensure no item is missing
  const allWords = useMemo(() => {
    const combined = [...(shabdkoshList || []), ...SAMPLE_SHABDKOSH];
    const map = new Map<string, PawariShabdkoshItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [shabdkoshList]);

  // Resolve current word
  const word = useMemo(() => {
    return findShabdkosh(allWords, slugOrId) || allWords[0] || null;
  }, [allWords, slugOrId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slugOrId]);

  // Prev / Next Word
  const currentIndex = allWords.findIndex(w => w.id === word?.id || w.slug === word?.slug);
  const prevWord = currentIndex > 0 ? allWords[currentIndex - 1] : null;
  const nextWord = currentIndex >= 0 && currentIndex < allWords.length - 1 ? allWords[currentIndex + 1] : null;

  // Related Words in same Category
  const relatedWords = useMemo(() => {
    if (!word) return [];
    const cat = word.category || '';
    return allWords
      .filter(w => w.id !== word.id && (w.category === cat || w.category?.includes(cat)))
      .slice(0, 4);
  }, [allWords, word]);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectWord = (targetWord: PawariShabdkoshItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const targetSlug = targetWord.slug || createSlug(targetWord.word_pawari || targetWord.id);
    setSelectedShabdkoshId(targetSlug);
  };

  const handleBackToList = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedShabdkoshId(null);
    }
  };

  if (!word) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">शब्द उपलब्ध नहीं है</h2>
        <p className="text-stone-600 text-sm">यह शब्द शब्दकोश में नहीं मिला या हटाया गया है।</p>
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 text-white font-bold text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सम्पूर्ण पवारी शब्दकोश पर लौटें</span>
        </button>
      </div>
    );
  }

  const wordPawari = word.word_pawari || 'पवारी शब्द';
  const pronunciation = word.pronunciation_hindi || word.word_pawari;
  const meaningHindi = word.meaning_hindi || '';
  const meaningEnglish = word.meaning_english || '';
  const examplePawari = word.example_pawari || '';
  const exampleHindi = word.example_hindi || '';
  const category = word.category || 'सामान्य शब्दावली';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- TOP NAVIGATION BAR & BREADCRUMBS ---------------- */}
      <nav aria-label="Breadcrumb" className="bg-white border border-amber-900/15 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-800" />
            <span>{lang === 'hi' ? '← सम्पूर्ण पवारी शब्दकोश' : '← Back to Dictionary'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) onNavigateSection('hub');
              else setActiveView('books_blogs');
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>{lang === 'hi' ? 'साहित्य हब' : 'Literature Hub'}</span>
          </button>
        </div>

        {/* Prev / Next Word Controls */}
        <div className="flex items-center gap-2">
          {prevWord && (
            <button
              type="button"
              onClick={() => handleSelectWord(prevWord)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title={prevWord.word_pawari}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{prevWord.word_pawari}</span>
            </button>
          )}

          {nextWord && (
            <button
              type="button"
              onClick={() => handleSelectWord(nextWord)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title={nextWord.word_pawari}
            >
              <span className="hidden sm:inline">{nextWord.word_pawari}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* ---------------- MAIN SHABDKOSH WORD CARD ---------------- */}
      <header className="bg-gradient-to-b from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-800/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
        
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900 text-white text-xs font-bold tracking-wide shadow-2xs">
            <Tag className="w-3.5 h-3.5 text-amber-300" />
            <span>{category}</span>
          </span>
        </div>

        {/* Word Display & Pronunciation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-950 font-serif tracking-tight">
              {wordPawari}
            </h1>
            {pronunciation && pronunciation !== wordPawari && (
              <p className="text-base sm:text-lg text-amber-900/80 font-mono">
                [ {pronunciation} ]
              </p>
            )}
          </div>

          {/* Audio Pronunciation Button */}
          <button
            type="button"
            onClick={() => handleSpeak(wordPawari)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition cursor-pointer shadow-sm ${
              isPlayingAudio
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <Volume2 className="w-5 h-5 text-amber-800" />
            <span>{lang === 'hi' ? 'उच्चारण सुनें (Listen)' : 'Pronounce'}</span>
          </button>
        </div>

        {/* Hindi & English Meaning Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-900/10">
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
              {lang === 'hi' ? 'हिंदी अर्थ (Hindi Meaning)' : 'Hindi Meaning'}
            </span>
            <p className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
              {meaningHindi || 'अर्थ संकलित किया जा रहा है'}
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
              {lang === 'hi' ? 'अंग्रेजी अर्थ (English Meaning)' : 'English Meaning'}
            </span>
            <p className="text-lg sm:text-xl font-medium text-stone-800">
              {meaningEnglish || 'Meaning in English'}
            </p>
          </div>
        </div>

      </header>

      {/* ---------------- SOCIAL SHARING BAR ---------------- */}
      <SahityaShareBar
        title={`पवारी शब्द: ${wordPawari}`}
        subtitle={`हिंदी अर्थ: ${meaningHindi} (${category})`}
        url={`/shabdkosh/${word.slug || word.id}`}
        category={category}
        typeLabel="पवारी शब्दकोश"
        lang={lang}
        variant="full"
      />

      {/* ---------------- SENTENCE USAGE (वाक्य प्रयोग) ---------------- */}
      {(examplePawari || exampleHindi) && (
        <section className="bg-white border-2 border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-serif">
                {lang === 'hi' ? 'पवारी वाक्य प्रयोग एवं अनुवाद' : 'Sentence Example & Translation'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'दैनिक लोक-व्यवहार में शब्द का स्वाभाविक प्रयोग' : 'Natural linguistic usage in daily conversation'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {examplePawari && (
              <div className="bg-amber-50/70 border-l-4 border-amber-700 p-4 sm:p-5 rounded-r-2xl">
                <span className="text-[11px] font-mono font-bold text-amber-900 uppercase">
                  {lang === 'hi' ? 'पवारी वाक्य:' : 'Pawari Sentence:'}
                </span>
                <p className="text-lg sm:text-xl font-serif text-stone-900 pt-1 font-semibold">
                  "{examplePawari}"
                </p>
              </div>
            )}

            {exampleHindi && (
              <div className="bg-stone-50 border-l-4 border-stone-500 p-4 sm:p-5 rounded-r-2xl">
                <span className="text-[11px] font-mono font-bold text-stone-600 uppercase">
                  {lang === 'hi' ? 'हिंदी अनुवाद:' : 'Hindi Translation:'}
                </span>
                <p className="text-base sm:text-lg font-serif text-stone-800 pt-1">
                  "{exampleHindi}"
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------- RELATED WORDS ---------------- */}
      {relatedWords.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                {lang === 'hi' ? `इसी वर्ग के अन्य शब्द (${category})` : 'Related Words'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedWords.map(rel => (
              <div
                key={rel.id}
                onClick={() => handleSelectWord(rel)}
                className="group bg-white hover:bg-amber-50/40 border border-stone-200 hover:border-amber-400 rounded-2xl p-4 transition shadow-2xs hover:shadow-sm cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-950 font-serif">
                    {rel.word_pawari}
                  </h3>
                  <p className="text-xs text-stone-600 font-serif">
                    {rel.meaning_hindi}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BOTTOM ACTIONS ---------------- */}
      <footer className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>{lang === 'hi' ? 'सम्पूर्ण शब्दकोश पर लौटें' : 'Back to Shabdkosh'}</span>
        </button>
      </footer>

    </article>
  );
};
