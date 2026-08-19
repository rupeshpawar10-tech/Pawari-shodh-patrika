import React, { useState } from 'react';
import { BookItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookOpen, 
  Maximize, 
  Minimize, 
  Download, 
  Share2, 
  List, 
  Bookmark, 
  Sun, 
  Moon, 
  Type, 
  Search,
  Check,
  FileText
} from 'lucide-react';

interface PawariBookReaderModalProps {
  book: BookItem;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'hi' | 'en';
}

interface ChapterData {
  title: string;
  pageNumber: number;
  contentHindi: string[];
  pawariVerses?: { pawari: string; hindi: string; context?: string }[];
  glossary?: { word: string; meaning: string }[];
}

export const PawariBookReaderModal: React.FC<PawariBookReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  lang = 'hi'
}) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(true);
  const [themeMode, setThemeMode] = useState<'sepia' | 'light' | 'dark'>('sepia');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([1]);
  const [searchInBook, setSearchInBook] = useState<string>('');

  // Structured Chapter and Reading data for this book
  const chapters: ChapterData[] = (book.table_of_contents_hindi || [
    'अध्याय 1: पवारी बोली का ऐतिहासिक एवं भौगोलिक परिचय',
    'अध्याय 2: पवारी का ध्वनिविज्ञान एवं पद-संरचना',
    'अध्याय 3: पवारी लोकगीत: प्रकार एवं सामाजिक चेतना',
    'अध्याय 4: पवारी लोककथाएं एवं मौखिक परंपराएं',
    'अध्याय 5: पवारी शब्दावली एवं अन्य बोलियों से संबंध'
  ]).map((tocTitle, idx) => {
    return {
      title: tocTitle,
      pageNumber: idx * 8 + 1,
      contentHindi: [
        `${tocTitle} के अंतर्गत पवारी अंचल (बैतूल, छिंदवाड़ा, सिवनी एवं वर्धा-नागपुर सीमावर्ती क्षेत्र) के प्रामाणिक संदर्भों का संकलन किया गया है।`,
        `माँ ताप्ती शोध संस्थान, मुलताई द्वारा संकलित यह ग्रंथ पवारी भाषा की प्राचीन जड़ों और परमार कालीन भाषाई संचरण को रेखांकित करता है।`,
        `पवारी बोली में प्रयुक्त व्याकरणिक नियम, कारक रचना, क्रियापद तथा विशिष्ट ध्वनि संचरणाएं मालवी, बुंदेली और मराठी के त्रिवेणी संगम का अद्भुत उदाहरण हैं।`
      ],
      pawariVerses: [
        {
          pawari: 'ताप्ती तीरे हमरो डेरो, पवारी बोली मीठी बात। पुरखा लोगों की यह बानी, नित गावे दिन रात॥',
          hindi: 'ताप्ती नदी के पावन तट पर हमारा निवास है और पवारी बोली अत्यंत मधुर है। यह हमारे पूर्वजों की पावन वाणी है जिसे हम रात-दिन गाते हैं।',
          context: 'मंगलाचरण एवं लोक स्तुति'
        },
        {
          pawari: 'गैया चरावे ग्वालिया भाई, बाजे बांसुरी की तान। सतपुड़ा की ऊंची घाटी, पवारी संस्कृति की शान॥',
          hindi: 'ग्वाले भाई गोवंश चराते हैं और मधुर बांसुरी बजाते हैं। सतपुड़ा की यह उच्च उपत्यकाएं पवारी लोकसंस्कृति का गौरव हैं।',
          context: 'लोकजीवन एवं प्रकृति वर्णन'
        }
      ],
      glossary: [
        { word: 'म्हारो / हमरो', meaning: 'हमारा (Our)' },
        { word: 'काजो / खातर', meaning: 'के लिए (For the purpose of)' },
        { word: 'पोरा / पोरी', meaning: 'लड़का / लड़की (Boy / Girl)' },
        { word: 'दादो / आजी', meaning: 'दादा / दादी (Grandparents)' }
      ]
    };
  });

  const totalPages = chapters.length * 8 + 4;

  const currentChapterIndex = Math.min(
    Math.max(0, Math.floor((currentPage - 1) / 8)),
    chapters.length - 1
  );
  const activeChapter = chapters[currentChapterIndex] || chapters[0];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleBookmark = (page: number) => {
    if (bookmarkedPages.includes(page)) {
      setBookmarkedPages(bookmarkedPages.filter(p => p !== page));
    } else {
      setBookmarkedPages([...bookmarkedPages, page]);
    }
  };

  const themeClasses = {
    sepia: 'bg-[#fbf7ee] text-[#2c2416] border-[#e8ddc8]',
    light: 'bg-white text-slate-900 border-slate-200',
    dark: 'bg-slate-950 text-amber-100 border-slate-800'
  };

  const fontClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose',
    xl: 'text-lg sm:text-xl leading-loose'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div 
        className={`w-full h-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-200 ${themeClasses[themeMode]}`}
      >
        {/* Top Control Header */}
        <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-2 shrink-0 bg-black/5 dark:bg-white/5">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              title="अनुक्रमणिका (Table of Contents)"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'अनुक्रमणिका' : 'Contents'}</span>
            </button>

            <div className="min-w-0">
              <h2 className="font-serif font-bold text-xs sm:text-sm truncate">
                {lang === 'hi' ? book.title_hindi : book.title_english}
              </h2>
              <p className="text-[10px] opacity-75 font-mono truncate">
                {book.authors} • {book.publisher} ({book.publication_year})
              </p>
            </div>
          </div>

          {/* Reader Action Tools */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Theme Toggle */}
            <div className="flex items-center bg-black/10 dark:bg-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setThemeMode('sepia')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] ${themeMode === 'sepia' ? 'bg-amber-200 text-amber-950 shadow-xs' : 'opacity-70'}`}
                title="Sepia"
              >
                📜
              </button>
              <button
                onClick={() => setThemeMode('light')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] ${themeMode === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'opacity-70'}`}
                title="Light"
              >
                ☀️
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] ${themeMode === 'dark' ? 'bg-slate-800 text-amber-200 shadow-xs' : 'opacity-70'}`}
                title="Dark"
              >
                🌙
              </button>
            </div>

            {/* Font size */}
            <div className="hidden md:flex items-center bg-black/10 dark:bg-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded-lg text-xs ${fontSize === 'sm' ? 'bg-amber-400 text-red-950 font-bold' : 'opacity-70'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded-lg text-xs ${fontSize === 'base' ? 'bg-amber-400 text-red-950 font-bold' : 'opacity-70'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded-lg text-xs ${fontSize === 'lg' ? 'bg-amber-400 text-red-950 font-bold' : 'opacity-70'}`}
              >
                A+
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-black/10 dark:bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setZoomLevel(z => Math.max(80, z - 10))}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(currentPage)}
              className={`p-2 rounded-xl border transition ${
                bookmarkedPages.includes(currentPage) 
                  ? 'bg-amber-500 text-red-950 border-amber-500 font-bold' 
                  : 'bg-black/10 dark:bg-white/10 border-transparent'
              }`}
              title={bookmarkedPages.includes(currentPage) ? 'पृष्ठ बुकमार्क हटाया गया' : 'यह पृष्ठ बुकमार्क करें'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-white transition cursor-pointer"
              title="बंद करें (Close Reader)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar TOC & Interactive Reader Stage */}
        <div className="flex-1 flex overflow-hidden">
          {/* TOC Sidebar */}
          {isTocOpen && (
            <div className="w-64 sm:w-72 border-r p-4 overflow-y-auto shrink-0 space-y-4 bg-black/5 dark:bg-white/5 animate-in slide-in-from-left duration-200">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {lang === 'hi' ? 'विषय सूची (अनुक्रमणिका)' : 'Table of Contents'}
                </h3>
                <p className="text-[10px] opacity-75 font-mono">
                  {chapters.length} {lang === 'hi' ? 'अध्याय उपलब्ध' : 'Chapters'}
                </p>
              </div>

              {/* Cover Card Mini */}
              <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-500/20">
                <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border shadow-xs bg-slate-900">
                  <SafeImage 
                    src={book.cover_image} 
                    alt={book.title_hindi} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0 text-xs">
                  <p className="font-bold font-serif truncate">{book.title_hindi}</p>
                  <p className="text-[10px] opacity-70 font-mono">ISBN: {book.isbn}</p>
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{book.pages} Pages</p>
                </div>
              </div>

              {/* Chapter Jump List */}
              <div className="space-y-1 text-xs">
                {chapters.map((ch, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => setCurrentPage(ch.pageNumber)}
                    className={`w-full text-left p-2.5 rounded-xl transition font-serif flex items-start space-x-2 cursor-pointer ${
                      currentChapterIndex === cIdx
                        ? 'bg-amber-500 text-red-950 font-bold shadow-xs'
                        : 'hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono text-[10px] shrink-0 opacity-75 pt-0.5">#{cIdx + 1}</span>
                    <span className="line-clamp-2 text-xs">{ch.title}</span>
                  </button>
                ))}
              </div>

              {/* Bookmarked Pages */}
              {bookmarkedPages.length > 0 && (
                <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2">
                  <h4 className="text-[11px] font-bold text-amber-800 dark:text-amber-400 flex items-center space-x-1">
                    <Bookmark className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'बुकमार्क किए गए पृष्ठ' : 'Bookmarked Pages'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {bookmarkedPages.map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                          currentPage === page ? 'bg-amber-400 text-red-950' : 'bg-black/10 dark:bg-white/10'
                        }`}
                      >
                        P. {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reading Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-3xl bg-white/40 dark:bg-black/40 border border-amber-900/10 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6 transition-transform duration-150"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs font-mono opacity-80">
                <span className="font-bold text-amber-800 dark:text-amber-400">
                  {book.title_hindi}
                </span>
                <span>
                  {lang === 'hi' ? `पृष्ठ संख्या: ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
              </div>

              {/* Page Content: Chapter Title */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  {lang === 'hi' ? `अध्याय ${currentChapterIndex + 1}` : `Chapter ${currentChapterIndex + 1}`}
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-red-950 dark:text-amber-200">
                  {activeChapter.title}
                </h1>
              </div>

              {/* Text Paragraphs */}
              <div className={`space-y-4 font-serif ${fontClasses[fontSize]}`}>
                {activeChapter.contentHindi.map((para, pIdx) => (
                  <p key={pIdx} className="text-justify leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Pawari Original Verses Callout */}
              {activeChapter.pawariVerses && activeChapter.pawariVerses.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'मूल पवारी पद एवं भावार्थ' : 'Pawari Verse & Meaning'}</span>
                  </div>

                  {activeChapter.pawariVerses.map((v, vIdx) => (
                    <div key={vIdx} className="space-y-2 border-t border-amber-500/20 pt-2.5 first:border-none first:pt-0">
                      <p className="font-serif font-bold text-red-950 dark:text-amber-200 text-sm sm:text-base italic">
                        "{v.pawari}"
                      </p>
                      <p className="text-xs sm:text-sm font-sans opacity-90">
                        <strong className="text-amber-800 dark:text-amber-400">{lang === 'hi' ? 'भावार्थ:' : 'Meaning:'}</strong> {v.hindi}
                      </p>
                      {v.context && (
                        <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                          {v.context}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Glossary Mini Table */}
              {activeChapter.glossary && activeChapter.glossary.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {lang === 'hi' ? 'विशेष पवारी शब्दावली संदर्भ' : 'Pawari Glossary in this Section'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeChapter.glossary.map((g, gIdx) => (
                      <div key={gIdx} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between border border-black/5">
                        <span className="font-bold font-serif">{g.word}</span>
                        <span className="opacity-80">{g.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Footer Annotation */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono opacity-70">
                <span>माँ ताप्ती शोध संस्थान मुलताई • ई-लाइब्रेरी संस्करण</span>
                <span>Page {currentPage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Page Navigation Bar */}
        <div className="px-4 sm:px-6 py-3 border-t flex items-center justify-between gap-3 shrink-0 bg-black/5 dark:bg-white/5">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-red-950 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पिछला पृष्ठ' : 'Previous'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold">
              {lang === 'hi' ? `पृष्ठ ${currentPage} / ${totalPages}` : `${currentPage} / ${totalPages}`}
            </span>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-24 sm:w-48 accent-amber-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-red-950 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
          >
            <span>{lang === 'hi' ? 'अगला पृष्ठ' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
