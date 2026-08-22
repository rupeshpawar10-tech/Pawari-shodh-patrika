import React from 'react';
import { BookOpen, Sparkles, PlusCircle, Award, Heart, Share2 } from 'lucide-react';
import { useCms } from '../../lib/CmsContext';

export interface SahityaFooterProps {
  onContributeClick?: () => void;
}

export const SahityaFooter: React.FC<SahityaFooterProps> = ({ onContributeClick }) => {
  const { lang, editorialMembers } = useCms();

  const director = (editorialMembers || []).find(m => 
    (m.role && (m.role.toLowerCase().includes('director') || m.role.toLowerCase().includes('patron'))) ||
    (m.designation_hindi && (m.designation_hindi.includes('निदेशक') || m.designation_hindi.includes('संरक्षक')))
  ) || { name: 'डॉ. कैलाश पवार', affiliation: 'माँ ताप्ती पवारी शोध संस्थान, मुलताई' };

  return (
    <footer className="mt-12 pt-8 border-t border-stone-200">
      <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-red-950 text-stone-100 p-6 sm:p-8 border border-stone-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Col 1: Institute accreditation */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'माँ ताप्ती पवारी शोध संस्थान, मुलताई (बैतूल)' : 'Maa Tapti Pawari Research Institute'}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-serif font-bold text-amber-100">
              {lang === 'hi' ? 'पवारी भाषा, लोकसंस्कृति एवं साहित्य डिजिटल संरक्षण' : 'Pawari Language & Folklore Digital Archive'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              {lang === 'hi'
                ? 'पवारी बोली के प्रामाणिक शब्दकोश, पारम्परिक पाहलोड़ी (पहेलियाँ), लोकगीत, शोध ग्रंथ व समालोचना का संवर्धन एवं शोधकर्ताओं हेतु खुला डिजिटल मंच।'
                : 'Open digital archive devoted to the scientific preservation, documentation, and promotion of Pawari dialect, lexicography, and folklore.'}
            </p>
          </div>

          {/* Col 2: Contribution Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3">
            {onContributeClick && (
              <button
                type="button"
                onClick={onContributeClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-stone-950" />
                <span>{lang === 'hi' ? 'साहित्य / लोकगीत योगदान भेजें' : 'Submit Contribution'}</span>
              </button>
            )}
            <div className="text-[11px] text-stone-400 font-mono">
              {lang === 'hi'
                ? `शोध निदेशक: ${(director as any).name_hindi || (director as any).name || 'डॉ. कैलाश पवार'}`
                : `Director: ${(director as any).name_english || (director as any).name || 'Dr. Kailash Pawar'}`}
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'पीयर-रिव्यूड व प्रामाणिक पवारी लोक-धरोहर' : 'Peer-Reviewed Linguistic & Cultural Heritage'}</span>
          </div>
          <div className="text-[11px]">
            {lang === 'hi' ? 'सर्वाधिकार सुरक्षित © 2026 पवारी शोध संस्थान' : 'All Rights Reserved © 2026 Pawari Research Institute'}
          </div>
        </div>
      </div>
    </footer>
  );
};
