import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Award, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  PlusCircle, 
  Sparkles, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink,
  Book,
  Heart,
  Share2,
  Check,
  CheckCircle2,
  Feather
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { SAMPLE_WRITERS } from '../../data/booksBlogsData';
import { PawariWriterItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFooter } from './SahityaFooter';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';

export interface WritersViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'writers' | 'reviews' | 'quiz') => void;
  onOpenWriterDetail?: (writer: PawariWriterItem) => void;
  onOpenContributeModal?: () => void;
}

export const WritersView: React.FC<WritersViewProps> = ({
  onNavigateSection,
  onOpenWriterDetail,
  onOpenContributeModal
}) => {
  const { 
    lang, 
    writers: cmsWriters, 
    books: cmsBooks = [], 
    blogs: cmsBlogs = [],
    setSelectedWriterId,
    setActiveView
  } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rawWriters = (cmsWriters && cmsWriters.length > 0) ? cmsWriters : SAMPLE_WRITERS;
  const approvedWriters = useMemo(() => {
    return rawWriters.filter(w => w.status === 'approved' || w.status === 'published' || !w.status);
  }, [rawWriters]);

  // Regions list
  const regions = [
    { id: 'all', labelHindi: 'सभी अंचल (All Regions)', labelEnglish: 'All Regions' },
    { id: 'betul', labelHindi: 'बैतूल - मुलताई', labelEnglish: 'Betul - Multai' },
    { id: 'chhindwara', labelHindi: 'छिंदवाड़ा - पांढुरना', labelEnglish: 'Chhindwara - Pandhurna' },
    { id: 'seoni', labelHindi: 'सिवनी - बरघाट', labelEnglish: 'Seoni - Barghat' },
    { id: 'balaghat', labelHindi: 'बालाघाट - कटंगी', labelEnglish: 'Balaghat - Katangi' },
    { id: 'nagpur', labelHindi: 'नागपुर - वरुड़ सीमा', labelEnglish: 'Nagpur - Warud' },
  ];

  // Specialization categories
  const categories = [
    { id: 'all', labelHindi: 'सभी विधाएं (All Genres)', labelEnglish: 'All Genres' },
    { id: 'linguistics', labelHindi: 'भाषाविज्ञान एवं शब्दकोश', labelEnglish: 'Linguistics & Lexicon' },
    { id: 'lokgeet', labelHindi: 'लोकगीत एवं संस्कार संगीत', labelEnglish: 'Folk Songs & Rituals' },
    { id: 'poetry', labelHindi: 'काव्य एवं महाकाव्य', labelEnglish: 'Poetry & Epics' },
    { id: 'theatre', labelHindi: 'लोकनाट्य (गम्मत)', labelEnglish: 'Folk Theatre (Gammat)' },
    { id: 'proverbs', labelHindi: 'पहेलियां एवं कहावतें', labelEnglish: 'Riddles & Proverbs' },
    { id: 'history', labelHindi: 'इतिहास एवं मानवविज्ञान', labelEnglish: 'History & Anthropology' },
    { id: 'children', labelHindi: 'बाल साहित्य', labelEnglish: 'Children Literature' },
    { id: 'spiritual', labelHindi: 'संत एवं आध्यात्मिक साहित्य', labelEnglish: 'Spiritual & Saint Lit' },
  ];

  // Filter logic
  const filteredWriters = useMemo(() => {
    return approvedWriters.filter((w) => {
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch = !search ||
        (w.name_hindi || '').toLowerCase().includes(search) ||
        (w.name_english || '').toLowerCase().includes(search) ||
        (w.designation_hindi || '').toLowerCase().includes(search) ||
        (w.location_hindi || '').toLowerCase().includes(search) ||
        (w.specialization_hindi || '').toLowerCase().includes(search) ||
        (w.bio_hindi || '').toLowerCase().includes(search) ||
        (w.published_books || []).some(b => b.toLowerCase().includes(search));

      // Region match
      let matchesRegion = true;
      if (selectedRegion === 'betul') {
        matchesRegion = (w.location_hindi || '').includes('बैतूल') || (w.location_hindi || '').includes('मुलताई') || (w.location_hindi || '').includes('भैंसदेही') || (w.location_hindi || '').includes('आमला');
      } else if (selectedRegion === 'chhindwara') {
        matchesRegion = (w.location_hindi || '').includes('छिंदवाड़ा') || (w.location_hindi || '').includes('पांढुरना') || (w.location_hindi || '').includes('सौंसर');
      } else if (selectedRegion === 'seoni') {
        matchesRegion = (w.location_hindi || '').includes('सिवनी') || (w.location_hindi || '').includes('बरघाट') || (w.location_hindi || '').includes('उगली');
      } else if (selectedRegion === 'balaghat') {
        matchesRegion = (w.location_hindi || '').includes('बालाघाट') || (w.location_hindi || '').includes('कटंगी') || (w.location_hindi || '').includes('वारासिवनी');
      } else if (selectedRegion === 'nagpur') {
        matchesRegion = (w.location_hindi || '').includes('नागपुर') || (w.location_hindi || '').includes('वरुड़') || (w.location_hindi || '').includes('सावनेर');
      }

      // Category match
      let matchesCategory = true;
      if (selectedCategory === 'linguistics') {
        matchesCategory = (w.specialization_hindi || '').includes('भाषाविज्ञान') || (w.specialization_hindi || '').includes('व्याकरण') || (w.specialization_hindi || '').includes('शब्दकोश');
      } else if (selectedCategory === 'lokgeet') {
        matchesCategory = (w.specialization_hindi || '').includes('लोकगीत') || (w.specialization_hindi || '').includes('संस्कार गीत') || (w.specialization_hindi || '').includes('गायन');
      } else if (selectedCategory === 'poetry') {
        matchesCategory = (w.specialization_hindi || '').includes('काव्य') || (w.specialization_hindi || '').includes('महाकाव्य') || (w.specialization_hindi || '').includes('दोहा') || (w.specialization_hindi || '').includes('कवि');
      } else if (selectedCategory === 'theatre') {
        matchesCategory = (w.specialization_hindi || '').includes('लोकनाट्य') || (w.specialization_hindi || '').includes('गम्मत') || (w.specialization_hindi || '').includes('स्वांग');
      } else if (selectedCategory === 'proverbs') {
        matchesCategory = (w.specialization_hindi || '').includes('पहेलियां') || (w.specialization_hindi || '').includes('पहेली') || (w.specialization_hindi || '').includes('कहावतें');
      } else if (selectedCategory === 'history') {
        matchesCategory = (w.specialization_hindi || '').includes('इतिहास') || (w.specialization_hindi || '').includes('मानवविज्ञान') || (w.specialization_hindi || '').includes('किले');
      } else if (selectedCategory === 'children') {
        matchesCategory = (w.specialization_hindi || '').includes('बाल') || (w.specialization_hindi || '').includes('बालगीत');
      } else if (selectedCategory === 'spiritual') {
        matchesCategory = (w.specialization_hindi || '').includes('भजन') || (w.specialization_hindi || '').includes('संत') || (w.specialization_hindi || '').includes('आध्यात्मिक');
      }

      return matchesSearch && matchesRegion && matchesCategory;
    });
  }, [approvedWriters, searchQuery, selectedRegion, selectedCategory]);

  const handleSelectWriter = (writer: PawariWriterItem) => {
    if (onOpenWriterDetail) {
      onOpenWriterDetail(writer);
    } else {
      if (setSelectedWriterId) {
        setSelectedWriterId(writer.slug || writer.id);
      }
      if (setActiveView) {
        setActiveView('writer_profile');
      }
      window.history.pushState({}, '', `/scholars/${writer.slug || writer.id}`);
    }
  };

  const handleShareWriter = (e: React.MouseEvent, writer: PawariWriterItem) => {
    e.stopPropagation();
    const url = `${window.location.origin}/scholars/${writer.slug || writer.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(writer.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Sahitya Header with Writers as active section */}
      <SahityaHeader
        titleHindi="पवारी लेखक एवं साहित्यकार संदर्भ"
        titleEnglish="Pawari Writers & Literary Scholars Directory"
        subtitleHindi="पवारी भाषा, लोकगीत, व्याकरण, महाकाव्य, पहेली, गम्मत लोकनाट्य एवं शोध साहित्य के मूर्धन्य सर्जकों का प्रामाणिक संदर्भ मंच"
        subtitleEnglish="Comprehensive directory of eminent authors, poets, linguists, folklorists, and researchers enriching Pawari language and culture."
        icon={UserCheck}
        badgeHindi="विद्वत एवं सर्जक संदर्भ"
        badgeEnglish="Scholars & Authors Directory"
        itemCount={approvedWriters.length}
        currentSection="writers"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'लेखक का नाम, स्थान, विधा या पुस्तक खोजें...' : 'Search by author, region, genre or book...'}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-mono text-stone-500">
              {filteredWriters.length} {lang === 'hi' ? 'साहित्यकार उपलब्ध' : 'Scholars listed'}
            </span>
            {onOpenContributeModal && (
              <button
                type="button"
                onClick={onOpenContributeModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-900 hover:bg-red-950 text-amber-100 text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'साहित्यकार जोड़ें' : 'Nominate Author'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
            {lang === 'hi' ? 'भौगोलिक अंचल / ज़िला चयन:' : 'Filter by Region / District:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  selectedRegion === reg.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <MapPin className="w-3 h-3 opacity-70" />
                <span>{lang === 'hi' ? reg.labelHindi : reg.labelEnglish}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Genre / Specialization Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
            {lang === 'hi' ? 'साहित्यिक विधा / विशेषज्ञता:' : 'Filter by Genre / Specialization:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-900 text-amber-100 font-semibold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {lang === 'hi' ? cat.labelHindi : cat.labelEnglish}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Writers Grid */}
      {filteredWriters.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई साहित्यकार प्रविष्टि नहीं मिली"
          titleEnglish="No Writers Found"
          messageHindi="आपकी खोज या चयनित फ़िल्टर के अनुसार कोई साहित्यकार नहीं मिला। कृपया फ़िल्टर रीसेट करें।"
          messageEnglish="No authors match your current search query or filter criteria. Try resetting filters."
          onReset={() => {
            setSearchQuery('');
            setSelectedRegion('all');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWriters.map((writer) => {
            const hasBooks = writer.published_books && writer.published_books.length > 0;
            const hasAwards = writer.awards_hindi && writer.awards_hindi.length > 0;

            return (
              <div
                key={writer.id}
                onClick={() => handleSelectWriter(writer)}
                className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Accent top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-900 via-amber-500 to-red-900 opacity-80 group-hover:opacity-100 transition" />

                {/* Author Card Top Header */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <SafeImage
                      src={writer.photo_url}
                      alt={writer.name_hindi || writer.name_english}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-amber-200/80 shadow-xs group-hover:scale-105 transition duration-300"
                      fallbackType="avatar"
                    />
                    {writer.is_featured && (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-stone-950 p-1 rounded-full shadow-xs text-[10px]" title="Featured Scholar">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-red-900 transition leading-snug line-clamp-1">
                        {writer.name_hindi || writer.name_english}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => handleShareWriter(e, writer)}
                        title="Share Author Profile"
                        className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition cursor-pointer shrink-0"
                      >
                        {copiedId === writer.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {writer.name_english && (
                      <div className="text-xs text-stone-500 font-sans line-clamp-1">
                        {writer.name_english}
                      </div>
                    )}

                    <div className="mt-1 text-xs text-amber-900 font-medium line-clamp-1">
                      {writer.designation_hindi || writer.designation_english}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                      <MapPin className="w-3 h-3 text-red-800 shrink-0" />
                      <span className="truncate">{writer.location_hindi || writer.location_english}</span>
                    </div>
                  </div>
                </div>

                {/* Specialization Tag */}
                {writer.specialization_hindi && (
                  <div className="mt-3.5 p-2 rounded-lg bg-stone-50 border border-stone-200/70 text-xs text-stone-700 flex items-start gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">
                      <strong className="font-semibold text-stone-900">{lang === 'hi' ? 'विशेषज्ञता:' : 'Specialization:'} </strong>
                      {writer.specialization_hindi}
                    </span>
                  </div>
                )}

                {/* Bio Excerpt */}
                <p className="mt-3 text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {writer.bio_hindi || writer.bio_english}
                </p>

                {/* Awards & Published Works Chips */}
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-1.5 text-[11px]">
                  {hasAwards && (
                    <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{writer.awards_hindi[0]}</span>
                    </div>
                  )}

                  {hasBooks && (
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <BookOpen className="w-3.5 h-3.5 text-red-900 shrink-0" />
                      <span className="truncate">
                        <strong className="font-semibold text-stone-800">{lang === 'hi' ? 'प्रमुख ग्रंथ:' : 'Key Work:'} </strong>
                        {writer.published_books[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer CTA */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-stone-500">
                    {(writer.published_books?.length || 0) + (writer.published_blogs?.length || 0)} {lang === 'hi' ? 'रचनाएं' : 'Works'}
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold text-red-900 group-hover:text-red-700 transition">
                    <span>{lang === 'hi' ? 'विस्तृत प्रोफ़ाइल व कृतियां' : 'View Profile & Works'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared Sahitya Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};
