import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { EditorialBoardDisplay } from '../common/EditorialBoardDisplay';
import { 
  Award, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Users,
  BookOpen
} from 'lucide-react';

export const EditorialBoardView: React.FC = () => {
  const { lang, editorialMembers } = useCms();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ----------------- EDITORIAL HEADER BANNER (Glossy 3D) ----------------- */}
      <div className="gloss-3d-card-dark text-amber-100 rounded-3xl p-6 sm:p-10 space-y-6 gloss-sheen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-400/30 text-xs font-bold font-mono shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'अकादमिक विद्वत परिषद' : 'Academic Leadership & Editorial Council'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight drop-shadow-sm">
              {lang === 'hi' ? 'संपादकीय मंडल एवं समीक्षा परिषद' : 'Editorial Board & Reviewers Committee'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पवारी शोध पत्रिका का कुशल मार्गदर्शन एवं डबल-ब्लाइंड समीक्षा प्रक्रिया अंतर्राष्ट्रीय तथा राष्ट्रीय स्तर के प्रतिष्ठित प्रोफेसरों, भाषावैज्ञानिकों एवं अकादमिक विद्वानों द्वारा संचालित की जाती है।'
                : 'Pawari Shodh Patrika is guided by distinguished linguists, folklorists, and academic scholars adhering strictly to rigorous double-blind peer review protocols.'}
            </p>
          </div>

          <div className="bg-stone-900/80 p-4 sm:p-5 rounded-2xl border border-amber-500/30 text-xs font-mono text-amber-200 space-y-2 flex-shrink-0 w-full md:w-auto shadow-inner">
            <div className="flex justify-between space-x-6">
              <span>Review Standard:</span>
              <strong className="text-amber-400 font-bold">Double Blind</strong>
            </div>
            <div className="flex justify-between space-x-6">
              <span>COPE Compliance:</span>
              <strong className="text-emerald-400 font-bold">Adhered & Verified</strong>
            </div>
            <div className="flex justify-between space-x-6">
              <span>Active Scholars:</span>
              <strong className="text-amber-300 font-bold">{editorialMembers.length} Members</strong>
            </div>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="pt-4 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-amber-500/20 text-stone-200">
            <span className="text-amber-300 block text-[10px] uppercase">Review Protocol</span>
            <span className="font-bold text-white">Double-Blind Peer Review</span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-amber-500/20 text-stone-200">
            <span className="text-amber-300 block text-[10px] uppercase">Publication Ethics</span>
            <span className="font-bold text-emerald-300">COPE Guidelines</span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-amber-500/20 text-stone-200">
            <span className="text-amber-300 block text-[10px] uppercase">Open Access</span>
            <span className="font-bold text-white">CC BY-NC 4.0</span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-amber-500/20 text-stone-200">
            <span className="text-amber-300 block text-[10px] uppercase">Central DB Sync</span>
            <span className="font-bold text-amber-300">100% Live Verified</span>
          </div>
        </div>
      </div>

      {/* ----------------- UNIFIED EDITORIAL BOARD DISPLAY ----------------- */}
      <EditorialBoardDisplay variant="full" showSearch={true} showCategories={true} />

    </div>
  );
};
