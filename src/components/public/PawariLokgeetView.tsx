import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariLokgeetItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { 
  Music, 
  Search, 
  User, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Volume2, 
  VolumeX,
  Play, 
  Pause,
  RotateCcw,
  ChevronLeft, 
  ChevronRight, 
  Link2, 
  Sparkles, 
  ArrowLeft, 
  BookOpen,
  Filter,
  Layers,
  Heart,
  Award,
  BookMarked
} from 'lucide-react';

export const PawariLokgeetView: React.FC = () => {
  const { 
    lang, 
    lokgeetList, 
    lokgeetCategories, 
    setActiveView 
  } = useCms();

  const approvedLokgeet = (lokgeetList || []).filter(l => l.status === 'approved' || l.status === 'published' || (!l.status && !l.id.startsWith('contrib_')));

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [collectorFilter, setCollectorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'category'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
  const ITEMS_PER_PAGE = 6;

  const [selectedItem, setSelectedItem] = useState<PawariLokgeetItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLyricsId, setCopiedLyricsId] = useState<string | null>(null);

  // Audio Speech Synthesis states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  const HINDI_LETTERS = [
    'all',
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'क', 'ख', 'ग', 'घ',
    'च', 'छ', 'ज', 'ट', 'ड', 'त', 'थ', 'द', 'न',
    'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'स', 'ह'
  ];

  // Stop speech when navigating
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [selectedItem]);

  // Sync from URL path on mount & popstate
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const pathname = decodeURIComponent(window.location.pathname.toLowerCase());
        if (pathname.startsWith('/lokgeet/')) {
          const slugOrId = pathname.replace('/lokgeet/', '').trim();
          if (slugOrId) {
            const found = approvedLokgeet.find(l => 
              l.id.toLowerCase() === slugOrId || 
              (l.slug && l.slug.toLowerCase() === slugOrId) ||
              l.id.toLowerCase() === `lokgeet-${slugOrId}`
            );
            if (found) {
              setSelectedItem(found);
              return;
            }
          }
        }
        setSelectedItem(null);
      } catch (e) {}
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [approvedLokgeet]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedLetter, collectorFilter, sortBy]);

  const handleSelectItem = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSelectedItem(item);
    const targetSlug = item.slug || item.id;
    const targetUrl = `/lokgeet/${targetSlug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: 'pawari_lokgeet', lokgeetSlugOrId: targetSlug }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    if (window.location.pathname.startsWith('/lokgeet/')) {
      window.history.pushState({ view: 'pawari_lokgeet' }, '', '/lokgeet');
    }
  };

  const handleCopyLink = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/lokgeet/${item.slug || item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(() => {
      prompt('कॉपी करने के लिए लिंक:', url);
    });
  };

  const handleCopyLyrics = (item: PawariLokgeetItem) => {
    const text = `${item.title_pawari}\n${item.title_hindi ? '(' + item.title_hindi + ')\n' : ''}\nश्रेणी: ${item.category}\n${item.singer_or_collector ? item.singer_or_collector + '\n' : ''}\n\n[बोल / Lyrics]\n${item.lyrics_pawari}\n\n${item.lyrics_hindi_meaning ? '[भावार्थ / Meaning]\n' + item.lyrics_hindi_meaning : ''}\n\n-- पँवारी लोकगीत संग्रह (कविता कोश / पँवारी शोध पत्रिका)`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLyricsId(item.id);
      setTimeout(() => setCopiedLyricsId(null), 2500);
    });
  };

  const handleWhatsAppShare = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/lokgeet/${item.slug || item.id}`;
    const text = encodeURIComponent(`🎵 *${item.title_pawari}*\n(${item.title_hindi || 'पँवारी लोकगीत'})\nश्रेणी: ${item.category}\n${item.singer_or_collector ? 'संपादक: ' + item.singer_or_collector + '\n' : ''}\nपढ़ें एवं सुनें:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleToggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में स्पीच फीचर समर्थित नहीं है।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\n\r]+/g, ' । ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Filter and sort items
  const filteredItems = approvedLokgeet.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title_hindi && item.title_hindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lyrics_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.lyrics_hindi_meaning && item.lyrics_hindi_meaning.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.singer_or_collector && item.singer_or_collector.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const matchesLetter = selectedLetter === 'all' || 
      item.title_pawari.trim().startsWith(selectedLetter) ||
      (item.title_hindi && item.title_hindi.trim().startsWith(selectedLetter));

    const matchesCollector = collectorFilter === 'all' || 
      (collectorFilter === 'gopinath' && (
        (item.singer_or_collector && item.singer_or_collector.includes('गोपीनाथ कालभोर')) ||
        (item.contributor_name && item.contributor_name.includes('गोपीनाथ कालभोर')) ||
        item.id.includes('gopinath')
      ));

    return matchesSearch && matchesCategory && matchesLetter && matchesCollector;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title_pawari.localeCompare(b.title_pawari, 'hi');
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category, 'hi');
    }
    // default
    return b.created_at.localeCompare(a.created_at);
  });

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const gopinathCount = approvedLokgeet.filter(l => 
    (l.singer_or_collector && l.singer_or_collector.includes('गोपीनाथ कालभोर')) ||
    (l.contributor_name && l.contributor_name.includes('गोपीनाथ कालभोर')) ||
    l.id.includes('gopinath')
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- BREADCRUMB / NAV CUE ----------------- */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <button onClick={() => setActiveView('home')} className="hover:text-red-900 transition">
          {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={handleBackToList} className="hover:text-red-900 transition">
          {lang === 'hi' ? 'पँवारी लोकसाहित्य' : 'Pawari Literature'}
        </button>
        {selectedItem && (
          <>
            <span>/</span>
            <span className="text-red-950 font-bold truncate max-w-[200px]">{selectedItem.title_pawari}</span>
          </>
        )}
      </div>

      {/* ----------------- DETAIL VIEW ----------------- */}
      {selectedItem ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* Top Back & Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center space-x-2 text-xs font-bold text-red-900 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'लोकगीत सूची पर वापस जाएं' : 'Back to Lokgeet Archive'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleWhatsAppShare(selectedItem, e)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'व्हाट्सएप शेयर' : 'Share'}</span>
              </button>
              <button
                onClick={(e) => handleCopyLink(selectedItem, e)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedItem.id ? (lang === 'hi' ? 'लिंक कॉपी हुआ' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* Song Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg tracking-wide">
                🎵 {selectedItem.category}
              </span>
              {selectedItem.singer_or_collector && (
                <span className="text-xs text-slate-700 font-medium flex items-center space-x-1 bg-amber-50/80 px-3 py-1 rounded-lg border border-amber-200/80">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>{selectedItem.singer_or_collector}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-red-950 tracking-tight">
              {selectedItem.title_pawari}
            </h1>
            {selectedItem.title_hindi && (
              <p className="text-base text-slate-600 font-serif font-medium">
                ({selectedItem.title_hindi})
              </p>
            )}
          </div>

          {/* Optional Image */}
          {selectedItem.image_url && (
            <div className="max-h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <SafeImage src={selectedItem.image_url} alt={selectedItem.title_pawari} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Text to Speech Voice Player Bar */}
          <div className="bg-gradient-to-r from-red-950 to-red-900 text-amber-100 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggleSpeech(`${selectedItem.title_pawari}। ${selectedItem.lyrics_pawari}। ${selectedItem.lyrics_hindi_meaning ? 'भावार्थ: ' + selectedItem.lyrics_hindi_meaning : ''}`)}
                className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-red-950 flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
                title={isPlayingAudio ? 'रोकें (Stop)' : 'गीत के बोल सुनें (Listen)'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-red-950" /> : <Play className="w-5 h-5 fill-red-950 ml-0.5" />}
              </button>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{isPlayingAudio ? 'ऑडियो वाचन जारी है...' : 'पँवारी लोकगीत बोल सुनें (Audio Narration)'}</span>
                </h4>
                <p className="text-[11px] text-amber-300/80">
                  {isPlayingAudio ? 'बोल का उच्चारण हो रहा है' : 'क्लिक करके देवनागरी पँवारी बोल का शुद्ध वाचन सुनें'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSpeechRate(r => r === 0.8 ? 1.0 : r === 1.0 ? 1.2 : 0.8)}
                className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-200 transition"
              >
                गति: {speechRate}x
              </button>
              {isPlayingAudio && (
                <button
                  onClick={() => { window.speechSynthesis.cancel(); setIsPlayingAudio(false); }}
                  className="p-2 bg-red-800/80 hover:bg-red-700 text-amber-200 rounded-xl transition"
                  title="रोकें"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Custom Audio File if provided */}
          {selectedItem.audio_url && (
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'पँवारी लोकगीत रिकॉर्डिंग:' : 'Folk Recording:'}</span>
              </div>
              <audio controls src={selectedItem.audio_url} className="w-full" />
            </div>
          )}

          {/* YouTube Video Link if provided */}
          {selectedItem.youtube_url && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                <span>{lang === 'hi' ? 'यूट्यूब पर वीडियो प्रसारण उपलब्ध' : 'YouTube Broadcast Available'}</span>
              </div>
              <a 
                href={selectedItem.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-red-900 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1 hover:bg-red-800 transition"
              >
                <span>{lang === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Lyrics Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2">
                <Music className="w-5 h-5 text-amber-700" />
                <span>{lang === 'hi' ? 'लोकगीत के सम्पूर्ण बोल (Lyrics)' : 'Complete Lyrics'}</span>
              </h2>

              <div className="flex items-center space-x-2">
                {/* Font Size Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700 space-x-1">
                  <button
                    onClick={() => setLyricsFontSize('sm')}
                    className={`px-2 py-1 rounded-lg ${lyricsFontSize === 'sm' ? 'bg-white shadow-xs text-red-950' : 'hover:text-black'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setLyricsFontSize('base')}
                    className={`px-2 py-1 rounded-lg ${lyricsFontSize === 'base' ? 'bg-white shadow-xs text-red-950' : 'hover:text-black'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setLyricsFontSize('lg')}
                    className={`px-2 py-1 rounded-lg ${lyricsFontSize === 'lg' ? 'bg-white shadow-xs text-red-950' : 'hover:text-black'}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setLyricsFontSize('xl')}
                    className={`px-2 py-1 rounded-lg ${lyricsFontSize === 'xl' ? 'bg-white shadow-xs text-red-950' : 'hover:text-black'}`}
                  >
                    A++
                  </button>
                </div>

                <button
                  onClick={() => handleCopyLyrics(selectedItem)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedLyricsId === selectedItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-700" />
                      <span>{lang === 'hi' ? 'बोल कॉपी करें' : 'Copy Lyrics'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-amber-50/40 border border-amber-200/70 p-6 sm:p-8 rounded-2xl shadow-inner">
              <pre className={`font-serif text-slate-900 whitespace-pre-wrap leading-relaxed ${
                lyricsFontSize === 'sm' ? 'text-sm' :
                lyricsFontSize === 'base' ? 'text-base' :
                lyricsFontSize === 'lg' ? 'text-lg' : 'text-xl sm:text-2xl'
              }`}>
                {selectedItem.lyrics_pawari}
              </pre>
            </div>
          </div>

          {/* Hindi Meaning / भावार्थ */}
          {selectedItem.lyrics_hindi_meaning && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'गीत का भावार्थ (हिंदी अर्थ एवं सांस्कृतिक संदर्भ):' : 'Meaning in Hindi:'}</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 font-serif leading-relaxed">
                {selectedItem.lyrics_hindi_meaning}
              </p>
            </div>
          )}

          {/* Prev / Next Navigation in Detail */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
            {(() => {
              const idx = approvedLokgeet.findIndex(l => l.id === selectedItem.id);
              const prev = idx > 0 ? approvedLokgeet[idx - 1] : null;
              const next = idx < approvedLokgeet.length - 1 ? approvedLokgeet[idx + 1] : null;

              return (
                <>
                  {prev ? (
                    <button
                      onClick={(e) => handleSelectItem(prev, e)}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center space-x-1.5 transition max-w-[48%] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="truncate">{lang === 'hi' ? 'पिछला गीत: ' : 'Prev: '}{prev.title_pawari}</span>
                    </button>
                  ) : <div />}

                  {next ? (
                    <button
                      onClick={(e) => handleSelectItem(next, e)}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center space-x-1.5 transition max-w-[48%] ml-auto cursor-pointer"
                    >
                      <span className="truncate">{lang === 'hi' ? 'अगला गीत: ' : 'Next: '}{next.title_pawari}</span>
                      <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>

        </div>
      ) : (
        /* ----------------- ARCHIVE LISTING VIEW ----------------- */
        <div className="space-y-6">
          
          {/* Header & Tribute Banner for Gopinath Kalbhor Compilation */}
          <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-amber-600/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase rounded-full tracking-wider">
                  {lang === 'hi' ? 'कविता कोश एवं वाचिक साहित्य संकलन' : 'Oral Folklore Archive'}
                </span>
                <span className="text-xs text-amber-200/80 font-mono bg-red-900/60 px-2.5 py-1 rounded-full">
                  {approvedLokgeet.length} {lang === 'hi' ? 'लोकगीत संकलित' : 'Songs'}
                </span>
              </div>

              {/* Gopinath Kalbhor Badge */}
              <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-300/30 px-3 py-1.5 rounded-xl text-xs text-amber-200">
                <BookMarked className="w-4 h-4 text-amber-400" />
                <span>संकलन: <strong>स्व. गोपीनाथ कालभोर</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                पँवारी लोकगीत संग्रह
              </h1>
              <p className="text-sm sm:text-base text-amber-200/90 max-w-3xl leading-relaxed font-serif">
                बैतूल, सतपुड़ा, ताप्ती अंचल और मध्य भारत की पावन लोक परंपरा में गाए जाने वाले देवी वंदना, पांढरी माता स्तुति, सोहर, बधावा, सगाई-विवाह, हल्दी, विदाई, धान रोपाई, भुजरिया, आखाटी, फाग एवं श्रमगीतों का प्रामाणिक संकलन (संकलनकर्ता: गोपीनाथ कालभोर)।
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => { setCollectorFilter(collectorFilter === 'gopinath' ? 'all' : 'gopinath'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  collectorFilter === 'gopinath' 
                    ? 'bg-amber-400 text-red-950 shadow-md' 
                    : 'bg-red-900/80 hover:bg-red-800 text-amber-100 border border-amber-500/30'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>गोपीनाथ कालभोर संकलन ({gopinathCount})</span>
              </button>

              <button
                onClick={() => { setSelectedCategory('all'); setCollectorFilter('all'); setSearchTerm(''); setSelectedLetter('all'); }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                सभी लोकगीत देखें ({approvedLokgeet.length})
              </button>
            </div>
          </div>

          {/* Browse Controls & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'लोकगीत शीर्षक, बोल, भावार्थ या श्रेणी खोजें...' : 'Search folk songs by title, lyrics or category...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-red-900 transition"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 hidden md:inline">{lang === 'hi' ? 'क्रम:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-900 cursor-pointer"
                >
                  <option value="default">{lang === 'hi' ? 'नवीनतम (Latest)' : 'Latest'}</option>
                  <option value="title">{lang === 'hi' ? 'शीर्षक (A-Z)' : 'Title (A-Z)'}</option>
                  <option value="category">{lang === 'hi' ? 'श्रेणी अनुसार' : 'By Category'}</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            {lokgeetCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-500 font-semibold shrink-0">
                  {lang === 'hi' ? 'श्रेणी:' : 'Category:'}
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-red-950 text-amber-100 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'hi' ? `सभी (${approvedLokgeet.length})` : `All (${approvedLokgeet.length})`}
                </button>
                {lokgeetCategories.map(cat => {
                  const count = approvedLokgeet.filter(l => l.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-red-950 text-amber-100 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* First Letter Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 font-semibold shrink-0 mr-1">
                {lang === 'hi' ? 'वर्ण:' : 'Letter:'}
              </span>
              {HINDI_LETTERS.map(letChar => (
                <button
                  key={letChar}
                  onClick={() => setSelectedLetter(letChar)}
                  className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                    selectedLetter === letChar
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {letChar === 'all' ? (lang === 'hi' ? 'सभी वर्ण' : 'All') : letChar}
                </button>
              ))}
            </div>

          </div>

          {/* Results Count & Reset Filter */}
          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
            <span>
              {lang === 'hi' ? 'प्रदर्शित लोकगीत:' : 'Showing folk songs:'} <strong className="text-slate-900 font-serif">{sortedItems.length}</strong> {collectorFilter === 'gopinath' ? '(गोपीनाथ कालभोर संकलन)' : ''}
            </span>
            {(selectedCategory !== 'all' || collectorFilter !== 'all' || selectedLetter !== 'all' || searchTerm) && (
              <button 
                onClick={() => { setSelectedCategory('all'); setCollectorFilter('all'); setSelectedLetter('all'); setSearchTerm(''); }} 
                className="text-red-900 font-semibold hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filter'}
              </button>
            )}
          </div>

          {/* Clean Listing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedItems.map(item => {
              const lyricsClean = item.lyrics_pawari.replace(/\n+/g, ' ').trim();
              const snippet = lyricsClean.slice(0, 110) + (lyricsClean.length > 110 ? '...' : '');

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleSelectItem(item, e)}
                  className="bg-white border border-slate-200 hover:border-red-900/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    {/* Category & Type */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold rounded-md border border-amber-200/70">
                        🎵 {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.created_at ? item.created_at.slice(0, 10) : '2026'}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-serif font-bold text-red-950 group-hover:text-red-900 transition-colors leading-snug">
                        {item.title_pawari}
                      </h3>
                      {item.title_hindi && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5 font-serif">
                          ({item.title_hindi})
                        </p>
                      )}
                    </div>

                    {/* Short Preview / Snippet */}
                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs font-serif text-slate-700 italic leading-relaxed line-clamp-2">
                      "{snippet}"
                    </div>

                    {/* Collector Info */}
                    {item.singer_or_collector && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">
                          {item.singer_or_collector}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={(e) => handleSelectItem(item, e)}
                      className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'पूरा देखें ➔' : 'View Full ➔'}</span>
                    </button>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleCopyLink(item, e)}
                        title="लिंक कॉपी करें"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => handleWhatsAppShare(item, e)}
                        title="व्हाट्सएप शेयर"
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {sortedItems.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
                <Music className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-bold text-slate-800 text-lg">
                  {lang === 'hi' ? 'कोई पवारी लोकगीत नहीं मिला' : 'No Folk Songs Found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {lang === 'hi'
                    ? 'कृपया अपनी खोज शब्द बदलें या सभी श्रेणियाँ देखने के लिए फ़िल्टर रीसेट करें।'
                    : 'Try adjusting your search query or resetting filters.'}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedLetter('all'); setCollectorFilter('all'); }}
                  className="px-4 py-2 bg-red-950 text-amber-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {lang === 'hi' ? 'सभी लोकगीत दिखाएं' : 'Show All Folk Songs'}
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 text-xs">
              <span className="text-slate-500">
                {lang === 'hi' ? 'प्रदर्शित:' : 'Showing:'} <strong className="font-serif text-slate-800">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</strong> - <strong className="font-serif text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, sortedItems.length)}</strong> ({sortedItems.length} {lang === 'hi' ? 'कुल' : 'total'})
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  {lang === 'hi' ? 'पिछला' : 'Prev'}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currentPage === pg
                        ? 'bg-red-950 text-amber-100 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  {lang === 'hi' ? 'अगला' : 'Next'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
