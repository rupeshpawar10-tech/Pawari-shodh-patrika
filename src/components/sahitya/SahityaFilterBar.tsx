import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { useCms } from '../../lib/CmsContext';

export interface SahityaFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  
  categories?: { id: string; labelHindi: string; labelEnglish: string; count?: number }[];
  selectedCategory?: string;
  onCategoryChange?: (catId: string) => void;

  alphabetList?: string[];
  selectedLetter?: string;
  onLetterChange?: (letter: string) => void;

  totalResultsCount?: number;
  onResetFilters?: () => void;
  extraControls?: React.ReactNode;
}

export const SahityaFilterBar: React.FC<SahityaFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  categories,
  selectedCategory,
  onCategoryChange,
  alphabetList,
  selectedLetter,
  onLetterChange,
  totalResultsCount,
  onResetFilters,
  extraControls
}) => {
  const { lang } = useCms();
  const hasActiveFilters = Boolean(
    searchQuery || 
    (selectedCategory && selectedCategory !== 'all') || 
    (selectedLetter && selectedLetter !== 'all')
  );

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Search Input & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              searchPlaceholder || 
              (lang === 'hi' ? 'शब्द, शीर्षक, विषय या कीवर्ड खोजें...' : 'Search by word, title, topic or keyword...')
            }
            className="w-full pl-10 pr-9 py-2 bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {extraControls && (
          <div className="flex items-center gap-2 shrink-0">
            {extraControls}
          </div>
        )}
      </div>

      {/* Category Filter Chips (Wrapping cleanly) */}
      {categories && categories.length > 0 && onCategoryChange && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono text-stone-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-stone-400" />
            <span>{lang === 'hi' ? 'श्रेणी (Category):' : 'Filter by Category:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-stone-900 text-amber-300 font-semibold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200/60'
                  }`}
                >
                  <span>{lang === 'hi' ? cat.labelHindi : cat.labelEnglish}</span>
                  {cat.count !== undefined && (
                    <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-stone-800 text-amber-200' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Alphabet Index Filter (if provided, wrapping neatly in a dense grid/flex) */}
      {alphabetList && alphabetList.length > 0 && onLetterChange && (
        <div className="space-y-1.5 pt-1 border-t border-stone-100">
          <div className="text-[11px] font-mono text-stone-500 font-semibold uppercase tracking-wider">
            {lang === 'hi' ? 'वर्णाक्षर अनुसार (Alphabet Filter):' : 'Alphabet Filter:'}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {alphabetList.map((char) => {
              const isSelected = (selectedLetter || 'all') === char;
              return (
                <button
                  key={char}
                  type="button"
                  onClick={() => onLetterChange(char)}
                  className={`min-w-7 h-7 px-1.5 rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-red-900 text-amber-100 font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {char === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : char}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Results Summary & Reset Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="text-stone-600 font-medium">
            {lang === 'hi' ? 'सक्रिय फ़िल्टर:' : 'Active Filters:'}
            {totalResultsCount !== undefined && (
              <span className="font-semibold text-stone-900 ml-1">
                ({totalResultsCount} {lang === 'hi' ? 'परिणाम' : 'results'})
              </span>
            )}
          </div>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-red-900 hover:text-red-950 font-semibold cursor-pointer transition text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'hi' ? 'सभी फ़िल्टर हटाएं' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
