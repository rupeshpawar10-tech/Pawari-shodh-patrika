import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Music, 
  Award, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Book, 
  UserCheck, 
  Layers, 
  Globe, 
  BookmarkCheck, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFooter } from './SahityaFooter';

export interface SahityaHubViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenContributeModal?: () => void;
}

export const SahityaHubView: React.FC<SahityaHubViewProps> = ({
  onNavigateSection,
  onOpenContributeModal
}) => {
  const { 
    lang, 
    shabdkoshList, 
    paheliList, 
    lokgeetList, 
    books: cmsBooks, 
    blogs: cmsBlogs, 
    quizQuestions 
  } = useCms();

  const approvedShabdkoshCount = (shabdkoshList || []).filter(s => s.status === 'approved' || s.status === 'published' || (!s.status && !s.id.startsWith('contrib_'))).length || 120;
  const approvedPaheliCount = (paheliList || []).filter(p => p.status === 'approved' || p.status === 'published' || (!p.status && !p.id.startsWith('contrib_'))).length || 35;
  const approvedLokgeetCount = (lokgeetList || []).filter(l => l.status === 'approved' || l.status === 'published' || (!l.status && !l.id.startsWith('contrib_'))).length || 24;
  const booksCount = (cmsBooks || []).filter(b => b.status === 'approved' || b.status === 'published' || (!b.status && !b.id.startsWith('contrib_'))).length || 18;
  const reviewsCount = (cmsBlogs || []).filter(b => b.category?.includes('समीक्षा') || b.title?.includes('समीक्षा') || b.status === 'approved' || (!b.status && !b.id.startsWith('contrib_'))).length || 12;
  const quizCount = (quizQuestions || []).length || 12;

  const totalEntries = approvedShabdkoshCount + approvedPaheliCount + approvedLokgeetCount + booksCount + reviewsCount;

  const resourceCards = [
    {
      id: 'shabdkosh' as const,
      icon: BookOpen,
      iconBg: 'bg-amber-500/15 text-amber-800 border-amber-300',
      titleHindi: 'पवारी शब्दकोश (Linguistic Lexicon)',
      titleEnglish: 'Pawari Dictionary',
      countLabel: `${approvedShabdkoshCount}+ शब्द`,
      badgeHindi: 'कोष ग्रंथ',
      descriptionHindi: 'पवारी-हिंदी-अंग्रेजी प्रामाणिक शब्दकोश, व्याकरणिक वर्ग, उच्चारण एवं दैनिक जीवन व कृषि के उदाहरण।',
      descriptionEnglish: 'Searchable dictionary with grammatical categories, Hindi/English meanings, and contextual usage examples.',
      ctaHindi: 'शब्द खोजें व पढ़ें →',
      ctaEnglish: 'Explore Dictionary →'
    },
    {
      id: 'paheli' as const,
      icon: HelpCircle,
      iconBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-300',
      titleHindi: 'पारम्परिक पाहलोड़ी (पहेलियाँ)',
      titleEnglish: 'Folklore Riddles (Paheli)',
      countLabel: `${approvedPaheliCount} पहेलियाँ`,
      badgeHindi: 'मौखिक साहित्य',
      descriptionHindi: 'लोकजीवन, कृषि, प्रकृति एवं संस्कृति से जुड़ी पारम्परिक पहेलियाँ व उनका सांस्कृतिक भावार्थ।',
      descriptionEnglish: 'Traditional cultural riddles and folklore brainteasers with interactive reveal and explanations.',
      ctaHindi: 'पहेलियाँ बुझें →',
      ctaEnglish: 'Solve Riddles →'
    },
    {
      id: 'lokgeet' as const,
      icon: Music,
      iconBg: 'bg-rose-500/15 text-rose-800 border-rose-300',
      titleHindi: 'पवारी लोकगीत संग्रह (Folk Songs)',
      titleEnglish: 'Folk Songs Archive',
      countLabel: `${approvedLokgeetCount} लोकगीत`,
      badgeHindi: 'पारम्परिक गायन',
      descriptionHindi: 'विवाह (बन्ना-बन्नी), भांवर, हल्दी, फाग, दिवारी, बिरहा एवं लोकगाथाओं के बोल, अर्थ व ऑडियो।',
      descriptionEnglish: 'Authentic folk song lyrics across wedding rituals, seasonal festivals, and storytelling with audio player.',
      ctaHindi: 'गीत सुनें व पढ़ें →',
      ctaEnglish: 'Browse Folk Songs →'
    },
    {
      id: 'books' as const,
      icon: Book,
      iconBg: 'bg-blue-500/15 text-blue-800 border-blue-300',
      titleHindi: 'शोध ग्रंथ व ई-पुस्तकें (Library)',
      titleEnglish: 'Books & E-Books Library',
      countLabel: `${booksCount} प्रकाशित ग्रंथ`,
      badgeHindi: 'संदर्भ साहित्य',
      descriptionHindi: 'माँ ताप्ती पवारी शोध संस्थान व विद्वानों द्वारा रचित शोध ग्रंथ, संदर्भ पुस्तकें एवं डाउनलोड करने योग्य ई-बुक्स।',
      descriptionEnglish: 'Curated peer-reviewed books, monographs, and research literature with PDF reader & download access.',
      ctaHindi: 'डिजिटल लाइब्रेरी देखें →',
      ctaEnglish: 'Open Library →'
    },
    {
      id: 'reviews' as const,
      icon: FileText,
      iconBg: 'bg-purple-500/15 text-purple-800 border-purple-300',
      titleHindi: 'समीक्षा एवं समालोचना (Reviews)',
      titleEnglish: 'Literature Reviews & Critique',
      countLabel: `${reviewsCount} आलेख व समीक्षाएं`,
      badgeHindi: 'समालोचना',
      descriptionHindi: 'पवारी पुस्तकों, भाषावैज्ञानिक शोध निबंधों एवं साहित्यिक कृतियों की निष्पक्ष संपादकीय समीक्षाएं।',
      descriptionEnglish: 'In-depth critical essays, book reviews, and academic commentaries by eminent scholars.',
      ctaHindi: 'समीक्षाएं पढ़ें →',
      ctaEnglish: 'Read Reviews →'
    },
    {
      id: 'quiz' as const,
      icon: Award,
      iconBg: 'bg-amber-500/15 text-amber-800 border-amber-300',
      titleHindi: 'संस्कृति ज्ञान परीक्षा व प्रमाण-पत्र',
      titleEnglish: 'Culture Quiz & Certificate',
      countLabel: 'प्रमाण-पत्र सहित',
      badgeHindi: 'ऑनलाइन टेस्ट',
      descriptionHindi: 'पवारी शब्दावली, मुहावरे, लोकसाहित्य व संस्कृति ज्ञान का ऑनलाइन टेस्ट दें और अधिकृत ई-प्रमाण-पत्र प्राप्त करें।',
      descriptionEnglish: 'Test your cultural and linguistic knowledge with structured MCQs and earn verified e-certificates.',
      ctaHindi: 'क्विज़ प्रारंभ करें →',
      ctaEnglish: 'Take Quiz →'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी साहित्य एवं लोकसंस्कृति केंद्र"
        titleEnglish="Pawari Sahitya & Cultural Knowledge Hub"
        subtitleHindi="पवारी भाषा, लोकसाहित्य, शब्दावली, लोकगीत, शोध ग्रंथ एवं समालोचना का एकीकृत डिजिटल आर्काइव"
        subtitleEnglish="Unified digital archive for Pawari dialect lexicography, folklore riddles, folk songs, published books, and cultural knowledge."
        icon={Layers}
        badgeHindi="एकीकृत ज्ञान मंच"
        badgeEnglish="Integrated Heritage Portal"
        itemCount={totalEntries}
        currentSection="hub"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {resourceCards.map((res) => {
          const Icon = res.icon;
          return (
            <button
              key={res.id}
              type="button"
              onClick={() => onNavigateSection(res.id)}
              className="p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 group-hover:text-red-900 group-hover:bg-amber-50 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                  {res.countLabel.split(' ')[0]}
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-xs font-bold text-stone-900 group-hover:text-red-950 line-clamp-1">
                  {lang === 'hi' ? res.titleHindi.split('(')[0] : res.titleEnglish}
                </div>
                <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                  {lang === 'hi' ? res.badgeHindi : res.badgeHindi}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 6 Knowledge Pillars Grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {lang === 'hi' ? 'साहित्य प्रभाग एवं मुख्य संसाधन' : 'Sahitya Pillars & Core Resources'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === 'hi' ? 'किसी भी प्रभाग पर क्लिक कर उसका संपूर्ण विवरण व डिजिटल सामग्री देखें' : 'Select a resource pillar to explore its curated digital collections'}
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
            6 Core Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigateSection(card.id)}
                className="bg-white border border-stone-200/90 rounded-2xl p-6 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-200 via-amber-400/40 to-stone-200 group-hover:from-amber-500 group-hover:to-red-900 transition-all" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl border ${card.iconBg} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                      {card.countLabel}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-amber-700 font-bold uppercase tracking-wider">
                      {lang === 'hi' ? card.badgeHindi : card.badgeHindi}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-red-950 transition-colors mt-0.5">
                      {lang === 'hi' ? card.titleHindi : card.titleEnglish}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {lang === 'hi' ? card.descriptionHindi : card.descriptionEnglish}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-900 group-hover:text-red-950">
                  <span>{lang === 'hi' ? card.ctaHindi : card.ctaEnglish}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scholarly Significance & Institute Notice */}
      <section className="bg-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-900 shrink-0 mt-1">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              {lang === 'hi' ? 'पवारी साहित्य एवं शोध संवर्धन संकल्प' : 'Our Commitment to Linguistic Documentation'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'माँ ताप्ती पवारी शोध संस्थान, मुलताई (बैतूल) मध्य भारत के सतपुड़ा अंचल की प्राचीन एवं समृद्ध पवारी बोली के समस्त साहित्यिक रूपों—कोष, पाहलोड़ी, मंगल गीत, आलेख व ग्रन्थों—को डिजिटल माध्यम से सुरक्षित एवं विश्वव्यापी शोधार्थियों तक सुलभ बनाने हेतु निरंतर कार्य कर रहा है।'
                : 'Maa Tapti Pawari Research Institute, Multai is dedicated to documenting, archiving, and disseminating the linguistic and folklore heritage of the Satpura region through peer-reviewed academic rigor.'}
            </p>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};
