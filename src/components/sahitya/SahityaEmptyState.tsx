import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { useCms } from '../../lib/CmsContext';

export interface SahityaEmptyStateProps {
  titleHindi?: string;
  titleEnglish?: string;
  descriptionHindi?: string;
  descriptionEnglish?: string;
  onResetFilters?: () => void;
}

export const SahityaEmptyState: React.FC<SahityaEmptyStateProps> = ({
  titleHindi,
  titleEnglish,
  descriptionHindi,
  descriptionEnglish,
  onResetFilters
}) => {
  const { lang } = useCms();

  return (
    <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-stone-200/80 text-stone-600 flex items-center justify-center mx-auto shadow-inner">
        <SearchX className="w-6 h-6 text-stone-500" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
          {lang === 'hi' 
            ? (titleHindi || 'कोई प्रविष्टि नहीं मिली') 
            : (titleEnglish || 'No entries found')}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {lang === 'hi' 
            ? (descriptionHindi || 'आपके खोज या चयनित फ़िल्टर के अनुसार कोई सामग्री उपलब्ध नहीं है। कृपया भिन्न कीवर्ड या फ़िल्टर आज़माएँ।') 
            : (descriptionEnglish || 'No matching items were found for your current search or category filter. Try clearing filters or using different keywords.')}
        </p>
      </div>

      {onResetFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-100 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
