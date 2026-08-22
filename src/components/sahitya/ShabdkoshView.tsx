import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Tag, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem } from '../../types';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';
import { SahityaFooter } from './SahityaFooter';
import { SahityaShareBar } from './SahityaShareBar';
import { createSlug } from '../../lib/slugUtils';
import { SAMPLE_SHABDKOSH } from '../../data/pawariCulturalData';

export interface ShabdkoshViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenContributeModal?: () => void;
}

export const ShabdkoshView: React.FC<ShabdkoshViewProps> = ({
  onNavigateSection,
  onOpenContributeModal
}) => {
  const { lang, shabdkoshList, setSelectedShabdkoshId } = useCms();

  const allWords = useMemo(() => {
    const combined = [...(shabdkoshList || []), ...SAMPLE_SHABDKOSH];
    const map = new Map<string, PawariShabdkoshItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        if (item.status === 'approved' || item.status === 'published' || (!item.status && !item.id.startsWith('contrib_'))) {
          map.set(item.id, item);
        }
      }
    });
    return Array.from(map.values());
  }, [shabdkoshList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');

  const HINDI_LETTERS = [
    'all',
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं',
    'क', 'ख', 'ग', 'घ',
    'च', 'छ', 'ज', 'झ',
    'ट', 'ठ', 'ड', 'ढ',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व',
    'श', 'ष', 'स', 'ह',
    'क्ष', 'त्र', 'ज्ञ'
  ];

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    allWords.forEach(item => {
      const cat = item.category || 'सामान्य';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', labelHindi: 'सभी शब्द (All)', labelEnglish: 'All Categories', count: allWords.length },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        labelHindi: cat,
        labelEnglish: cat,
        count: counts[cat]
      }))
    ];
  }, [allWords]);

  // Filter items
  const filteredWords = useMemo(() => {
    return allWords.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.word_pawari?.toLowerCase().includes(q) ||
        item.meaning_hindi?.toLowerCase().includes(q) ||
        item.meaning_english?.toLowerCase().includes(q) ||
        item.example_pawari?.toLowerCase().includes(q) ||
        item.example_hindi?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      let matchesLetter = true;
      if (selectedLetter !== 'all' && item.word_pawari) {
        matchesLetter = item.word_pawari.trim().startsWith(selectedLetter);
      }

      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [allWords, searchQuery, selectedCategory, selectedLetter]);

  // Pronounce word
  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenWordPage = (item: PawariShabdkoshItem) => {
    const slug = item.slug || createSlug(item.word_pawari || item.id);
    setSelectedShabdkoshId(slug);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLetter('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी-हिंदी-अंग्रेजी शब्दकोश"
        titleEnglish="Pawari Lexicon & Dictionary"
        subtitleHindi="पवारी बोली की प्रामाणिक शब्दावली, व्याकरणिक पद, मानक हिंदी व अंग्रेजी अर्थ तथा प्रासंगिक प्रयोग।"
        subtitleEnglish="Searchable lexicon of Pawari dialect vocabulary with grammatical parts of speech, Hindi/English translations, and usage sentences."
        icon={BookOpen}
        badgeHindi="भाषावैज्ञानिक कोष"
        badgeEnglish="Linguistic Dictionary"
        itemCount={allWords.length}
        currentSection="shabdkosh"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Shared Filter Bar */}
      <SahityaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={lang === 'hi' ? 'पवारी शब्द, हिंदी अर्थ या अंग्रेजी में खोजें...' : 'Search by Pawari word, Hindi meaning, or English...'}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        alphabetList={HINDI_LETTERS}
        selectedLetter={selectedLetter}
        onLetterChange={setSelectedLetter}
        totalResultsCount={filteredWords.length}
        onResetFilters={handleResetFilters}
      />

      {/* Word Cards Grid */}
      {filteredWords.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई शब्द नहीं मिला"
          titleEnglish="No words match your search"
          descriptionHindi="आपके द्वारा खोजे गए शब्द या वर्णाक्षर के अनुसार कोई प्रविष्टि नहीं मिली। कृपया नया शब्द खोजें या फ़िल्टर हटाएं।"
          descriptionEnglish="No dictionary entries matched your query or alphabet filter. Try clearing filters or searching for another term."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((item) => {
            const wordSlug = item.slug || createSlug(item.word_pawari || item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenWordPage(item)}
                className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative cursor-pointer hover:bg-amber-50/20 shadow-2xs"
              >
                <div className="space-y-3">
                  {/* Top Word & Category Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 tracking-tight group-hover:text-amber-900 transition">
                          {item.word_pawari}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(e, item.word_pawari)}
                          title="उच्चारण सुनें"
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.part_of_speech && (
                        <span className="text-[11px] font-mono text-stone-500 font-semibold italic">
                          ({item.part_of_speech})
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200 shrink-0">
                      {item.category || 'सामान्य'}
                    </span>
                  </div>

                  {/* Meanings */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-stone-500 text-[11px] font-semibold block uppercase font-mono">
                        {lang === 'hi' ? 'हिंदी अर्थ:' : 'Hindi Meaning:'}
                      </span>
                      <p className="text-stone-900 font-medium leading-relaxed mt-0.5 font-serif">
                        {item.meaning_hindi}
                      </p>
                    </div>

                    {item.meaning_english && (
                      <div>
                        <span className="text-stone-500 text-[11px] font-semibold block uppercase font-mono">
                          {lang === 'hi' ? 'अंग्रेजी अर्थ:' : 'English Meaning:'}
                        </span>
                        <p className="text-stone-700 italic leading-relaxed mt-0.5">
                          {item.meaning_english}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Example Usages */}
                  {(item.example_pawari || item.example_hindi) && (
                    <div className="bg-amber-50/50 rounded-2xl p-3.5 border border-amber-200/60 space-y-1.5 text-xs">
                      <div className="text-[10px] font-mono font-bold text-amber-900 uppercase">
                        {lang === 'hi' ? 'प्रयोग एवं संदर्भ:' : 'Contextual Usage:'}
                      </div>
                      {item.example_pawari && (
                        <p className="text-stone-900 font-medium font-serif">
                          <span className="text-amber-800 font-bold mr-1">पवारी:</span>
                          "{item.example_pawari}"
                        </p>
                      )}
                      {item.example_hindi && (
                        <p className="text-stone-600 font-serif">
                          <span className="text-stone-400 mr-1">हिंदी:</span>
                          "{item.example_hindi}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action & Share Footer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-900 group-hover:text-amber-950 transition">
                      <span>{lang === 'hi' ? 'विस्तृत शब्द विवरण' : 'Detailed Word Page'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </span>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SahityaShareBar
                      title={`पवारी शब्द: ${item.word_pawari}`}
                      subtitle={`हिंदी अर्थ: ${item.meaning_hindi}`}
                      url={`/shabdkosh/${wordSlug}`}
                      category={item.category || 'शब्दावली'}
                      typeLabel="पवारी शब्दकोश"
                      lang={lang}
                      variant="card"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};

