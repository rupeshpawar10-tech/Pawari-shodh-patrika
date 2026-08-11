import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem, PawariPaheliItem, PawariLokgeetItem, QuizQuestion, QuizCertificate } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  HelpCircle, 
  Music, 
  Award, 
  PlusCircle, 
  Search, 
  Eye, 
  EyeOff, 
  Lightbulb, 
  CheckCircle2, 
  X, 
  Upload, 
  Download, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  Camera, 
  User, 
  Send,
  Volume2,
  FileCheck2,
  Check,
  AlertCircle,
  Copy,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Link2,
  ExternalLink,
  Play
} from 'lucide-react';

interface PawariCulturalSectionProps {
  initialTab?: 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

export const PawariCulturalSection: React.FC<PawariCulturalSectionProps> = ({ initialTab = 'shabdkosh' }) => {
  const { shabdkoshList, paheliList, lokgeetList, quizQuestions, submitPublicContribution, uploadFileToStorage } = useCms();
  const [activeTab, setActiveTab] = useState<'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

  // Filter approved items only for public display (Pending contributions require CMS approval)
  const approvedShabdkosh = shabdkoshList.filter(s => s.status === 'approved' || (!s.status && !s.id.startsWith('contrib_')));
  const approvedPaheli = paheliList.filter(p => p.status === 'approved' || (!p.status && !p.id.startsWith('contrib_')));
  const approvedLokgeet = lokgeetList.filter(l => l.status === 'approved' || (!l.status && !l.id.startsWith('contrib_')));

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [shabdkoshCategory, setShabdkoshCategory] = useState('all');
  const [shabdkoshLetter, setShabdkoshLetter] = useState('all');
  const [paheliCategory, setPaheliCategory] = useState('all');
  const [revealedPaheli, setRevealedPaheli] = useState<Record<string, boolean>>({});
  const [copiedPaheliId, setCopiedPaheliId] = useState<string | null>(null);

  // Lokgeet specific state & URL navigation
  const [lokgeetCategory, setLokgeetCategory] = useState('all');
  const [lokgeetSort, setLokgeetSort] = useState<'default' | 'title' | 'category'>('default');
  const [lokgeetPage, setLokgeetPage] = useState<number>(1);
  const LOKGEET_PER_PAGE = 6;
  const [selectedLokgeet, setSelectedLokgeet] = useState<PawariLokgeetItem | null>(null);
  const [copiedLokgeetId, setCopiedLokgeetId] = useState<string | null>(null);
  const [copiedLyricsId, setCopiedLyricsId] = useState<string | null>(null);

  // Reset page when search or category or sort changes
  React.useEffect(() => {
    setLokgeetPage(1);
  }, [searchTerm, lokgeetCategory, lokgeetSort]);

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

  // Sync Lokgeet from URL on mount & popstate
  React.useEffect(() => {
    const syncLokgeetFromUrl = () => {
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
              setSelectedLokgeet(found);
              setActiveTab('lokgeet');
              return;
            }
          }
        } else if (pathname === '/lokgeet' || pathname === '/pawari-lokgeet') {
          setActiveTab('lokgeet');
        }
      } catch (e) {}
    };

    syncLokgeetFromUrl();
    window.addEventListener('popstate', syncLokgeetFromUrl);
    return () => window.removeEventListener('popstate', syncLokgeetFromUrl);
  }, [approvedLokgeet]);

  const handleOpenLokgeet = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSelectedLokgeet(item);
    setActiveTab('lokgeet');
    const targetId = item.slug || item.id;
    const targetUrl = `/lokgeet/${targetId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: 'pawari_lokgeet', lokgeetSlugOrId: targetId }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseLokgeet = () => {
    setSelectedLokgeet(null);
    if (window.location.pathname.startsWith('/lokgeet/')) {
      window.history.pushState({ view: 'pawari_lokgeet' }, '', '/lokgeet');
    }
  };

  const handleCopyLokgeetLink = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/lokgeet/${item.slug || item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directUrl).then(() => {
        setCopiedLokgeetId(item.id);
        setTimeout(() => setCopiedLokgeetId(null), 2500);
      });
    } else {
      prompt('लोकगीत का डायरेक्ट लिंक कॉपी करें:', directUrl);
    }
  };

  const handleCopyLyrics = (item: PawariLokgeetItem) => {
    const fullText = `🎵 *${item.title_pawari}* ${item.title_hindi ? `(${item.title_hindi})` : ''}\nश्रेणी: ${item.category}\n\n*लोकगीत के बोल:*\n${item.lyrics_pawari}\n\n${item.lyrics_hindi_meaning ? `*भावार्थ:*\n${item.lyrics_hindi_meaning}\n\n` : ''}📖 पवारी भाषा एवं संस्कृति शोध पत्रिका: ${window.location.origin}/lokgeet/${item.slug || item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopiedLyricsId(item.id);
        setTimeout(() => setCopiedLyricsId(null), 2500);
      });
    } else {
      prompt('लोकगीत के बोल:', fullText);
    }
  };

  const handleShareLokgeetWhatsApp = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/lokgeet/${item.slug || item.id}`;
    const shareText = `🎵 *${item.title_pawari}* ${item.title_hindi ? `(${item.title_hindi})` : ''}\n\n"${item.lyrics_pawari.slice(0, 150)}..."\n\n📖 पूरा लोकगीत पढ़ें एवं भावार्थ देखें:\n${directUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Parse letter from URL on load if present
  React.useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const letterParam = searchParams.get('letter') || searchParams.get('a');
      if (letterParam) {
        setShabdkoshLetter(letterParam);
        setActiveTab('shabdkosh');
      } else if (window.location.hash && window.location.hash.includes('letter=')) {
        const parts = window.location.hash.split('letter=');
        if (parts[1]) {
          setShabdkoshLetter(decodeURIComponent(parts[1]));
          setActiveTab('shabdkosh');
        }
      }
    } catch (e) {}
  }, []);

  const handleSharePaheli = async (item: PawariPaheliItem) => {
    const isAnswerRevealed = !!revealedPaheli[item.id];
    let shareText = `🧩 *पवारी पहेली (पवारी बुझौवल)* 🧩\n\n"${item.riddle_pawari}"`;
    if (item.hint_hindi) {
      shareText += `\n\n💡 *संकेत:* ${item.hint_hindi}`;
    }
    if (isAnswerRevealed) {
      shareText += `\n\n✅ *उत्तर:* ${item.answer_hindi}`;
      if (item.answer_pawari) shareText += ` (${item.answer_pawari})`;
    } else {
      shareText += `\n\n🤔 *उत्तर बुझिए पवारी शोध पत्रिका पोर्टल पर!*`;
    }
    shareText += `\n\n📖 *पवारी भाषा एवं संस्कृति शोध पत्रिका*: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'पवारी पहेली',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedPaheliId(item.id);
      setTimeout(() => setCopiedPaheliId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppSharePaheli = (item: PawariPaheliItem) => {
    const isAnswerRevealed = !!revealedPaheli[item.id];
    let shareText = `🧩 *पवारी पहेली (पवारी बुझौवल)* 🧩\n\n"${item.riddle_pawari}"`;
    if (item.hint_hindi) {
      shareText += `\n\n💡 *संकेत:* ${item.hint_hindi}`;
    }
    if (isAnswerRevealed) {
      shareText += `\n\n✅ *उत्तर:* ${item.answer_hindi}`;
      if (item.answer_pawari) shareText += ` (${item.answer_pawari})`;
    } else {
      shareText += `\n\n🤔 *उत्तर बुझिए पवारी शोध पत्रिका पोर्टल पर!*`;
    }
    shareText += `\n\n📖 *पवारी भाषा एवं संस्कृति शोध पत्रिका*: ${window.location.origin}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Public Contribution Modal state
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [contribType, setContribType] = useState<'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' | 'review'>('shabdkosh');
  const [contribFormData, setContribFormData] = useState<any>({
    contributor_name: '',
    word_pawari: '',
    meaning_hindi: '',
    pronunciation_hindi: '',
    example_pawari: '',
    riddle_pawari: '',
    answer_hindi: '',
    hint_hindi: '',
    title_pawari: '',
    title_hindi: '',
    title_english: '',
    lyrics_pawari: '',
    content_hindi: '',
    synopsis_hindi: '',
    reviewedBookDetails: '',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    image_url: ''
  });
  const [contribSuccess, setContribSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Quiz Engine state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [certificateData, setCertificateData] = useState<QuizCertificate | null>(null);
  const [copiedQuizLink, setCopiedQuizLink] = useState(false);

  const handleCopyQuizLink = () => {
    const quizUrl = `${window.location.origin}/quiz`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(quizUrl).then(() => {
        setCopiedQuizLink(true);
        setTimeout(() => setCopiedQuizLink(false), 2500);
      });
    } else {
      prompt('पवारी ई-क्विज़ का डायरेक्ट लिंक शेयर करें:', quizUrl);
    }
  };

  const handleShareQuizWhatsApp = () => {
    const quizUrl = `${window.location.origin}/quiz`;
    const shareText = `🏆 *पवारी भोयरी लोक संस्कृति एवं साहित्य ई-क्विज़ 2026* 🏆\n\nअपनी पवारी बोली, लोकगीत, शब्दकोश एवं पहेली ज्ञान की परीक्षा दें और ई-प्रमाण-पत्र प्राप्त करें!\n\n(विशेष: यह क्विज़ निष्पक्षता हेतु बिना किसी संकेत / Hint के है)\n\n👉 *क्विज़ में भाग लेने के लिए नीचे दिए गए डायरेक्ट लिंक पर क्लिक करें:*\n${quizUrl}\n\n🚩 *माँ ताप्ती पवारी शोध संस्थान*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Shabdkosh Filtering
  const filteredShabdkosh = approvedShabdkosh.filter(item => {
    const matchesSearch = item.word_pawari.toLowerCase().includes(searchTerm.toLowerCase()) || item.meaning_hindi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = shabdkoshCategory === 'all' || item.category === shabdkoshCategory;
    const matchesLetter = shabdkoshLetter === 'all' || 
                          item.word_pawari.trim().startsWith(shabdkoshLetter) ||
                          item.word_pawari.trim().toLowerCase().startsWith(shabdkoshLetter.toLowerCase());
    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Paheli Filtering
  const filteredPaheli = approvedPaheli.filter(item => {
    const matchesSearch = item.riddle_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.explanation_hindi && item.explanation_hindi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = paheliCategory === 'all' || item.category === paheliCategory;
    return matchesSearch && matchesCategory;
  });

  // Unique Lokgeet categories
  const lokgeetCategories = Array.from(new Set(approvedLokgeet.map(l => l.category).filter(Boolean)));

  // Lokgeet Filtering
  const filteredLokgeet = approvedLokgeet.filter(item => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.title_pawari.toLowerCase().includes(q) ||
      (item.title_hindi && item.title_hindi.toLowerCase().includes(q)) ||
      item.lyrics_pawari.toLowerCase().includes(q) ||
      (item.singer_or_collector && item.singer_or_collector.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    const matchesCategory = lokgeetCategory === 'all' || item.category === lokgeetCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedLokgeet = React.useMemo(() => {
    return [...filteredLokgeet].sort((a, b) => {
      if (lokgeetSort === 'title') {
        return a.title_pawari.localeCompare(b.title_pawari, 'hi');
      }
      if (lokgeetSort === 'category') {
        return (a.category || '').localeCompare(b.category || '', 'hi');
      }
      return 0;
    });
  }, [filteredLokgeet, lokgeetSort]);

  const totalLokgeetPages = Math.ceil(sortedLokgeet.length / LOKGEET_PER_PAGE) || 1;
  const paginatedLokgeet = React.useMemo(() => {
    return sortedLokgeet.slice(
      (lokgeetPage - 1) * LOKGEET_PER_PAGE,
      lokgeetPage * LOKGEET_PER_PAGE
    );
  }, [sortedLokgeet, lokgeetPage, LOKGEET_PER_PAGE]);

  const togglePaheliAnswer = (id: string) => {
    setRevealedPaheli(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContribSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetType: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' = 'shabdkosh';
    let payload: any = { ...contribFormData };

    if (contribType === 'shabdkosh') {
      targetType = 'shabdkosh';
    } else if (contribType === 'paheli') {
      targetType = 'paheli';
    } else if (contribType === 'lokgeet') {
      targetType = 'lokgeet';
    } else if (contribType === 'blogs') {
      targetType = 'blogs';
      payload = {
        title_hindi: contribFormData.title_hindi || contribFormData.title_pawari,
        title_english: contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari,
        author: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        published_date: new Date().toLocaleDateString('hi-IN'),
        category: contribFormData.category || 'लोकसंस्कृति',
        read_time: '5 मिनट',
        excerpt_hindi: contribFormData.content_hindi ? contribFormData.content_hindi.slice(0, 150) + '...' : '',
        excerpt_english: '',
        content_hindi: contribFormData.content_hindi || '',
        content_english: '',
        tags: ['पवारी', 'पाठक_योगदान', 'संस्कृति'],
        likes_count: 0,
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
      };
    } else if (contribType === 'review') {
      targetType = 'blogs';
      payload = {
        title_hindi: `पुस्तक समीक्षा: ${contribFormData.title_hindi || contribFormData.title_pawari}`,
        title_english: `Book Review: ${contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari}`,
        author: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        published_date: new Date().toLocaleDateString('hi-IN'),
        category: 'पुस्तक समीक्षा',
        read_time: '7 मिनट',
        excerpt_hindi: `समीक्षित पुस्तक विवरण: ${contribFormData.reviewedBookDetails || ''}`,
        excerpt_english: '',
        content_hindi: contribFormData.content_hindi || '',
        content_english: '',
        tags: ['पुस्तक_समीक्षा', 'साहित्य', 'पवारी_शोध'],
        likes_count: 0,
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
      };
    } else if (contribType === 'books') {
      targetType = 'books';
      payload = {
        title_hindi: contribFormData.title_hindi || contribFormData.title_pawari,
        title_english: contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari,
        authors: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        publisher: 'माँ ताप्ती शोध संस्थान (प्रस्तावित)',
        publish_year: new Date().getFullYear().toString(),
        isbn: 'PUB-' + Math.floor(100000 + Math.random() * 900000),
        pages: 120,
        category: contribFormData.category || 'भाषाविज्ञान एवं लोकसाहित्य',
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        synopsis_hindi: contribFormData.synopsis_hindi || contribFormData.content_hindi || '',
        synopsis_english: '',
        price: 'Open Access / निःशुल्क'
      };
    }

    await submitPublicContribution(targetType, payload);
    setContribSuccess(true);
    setTimeout(() => {
      setContribSuccess(false);
      setIsContribModalOpen(false);
      setContribFormData({
        contributor_name: '',
        word_pawari: '',
        meaning_hindi: '',
        pronunciation_hindi: '',
        example_pawari: '',
        riddle_pawari: '',
        answer_hindi: '',
        hint_hindi: '',
        title_pawari: '',
        title_hindi: '',
        title_english: '',
        lyrics_pawari: '',
        content_hindi: '',
        synopsis_hindi: '',
        reviewedBookDetails: '',
        category: 'भाषाविज्ञान एवं लोकसाहित्य',
        image_url: ''
      });
    }, 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'contrib' | 'quiz') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'public_uploads');
      if (target === 'contrib') {
        setContribFormData((prev: any) => ({ ...prev, image_url: res.url }));
      } else {
        setUserPhoto(res.url);
      }
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  // Quiz logic - select 10 questions for active quiz
  const [activeQuizQuestions, setActiveQuizQuestions] = React.useState<QuizQuestion[]>([]);

  React.useEffect(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
      setActiveQuizQuestions(shuffled.slice(0, 10));
    }
  }, [quizQuestions]);

  const handleSelectOption = (optIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
  };

  const handleNextQuiz = () => {
    if (currentQIndex < activeQuizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrevQuiz = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    if (!userName.trim()) {
      alert('कृपया प्रमाण-पत्र हेतु अपना शुभ नाम दर्ज करें।');
      return;
    }

    let score = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option_index) {
        score += 1;
      }
    });

    const totalQ = activeQuizQuestions.length || 10;
    const percentage = Math.round((score / totalQ) * 100);
    const certNo = 'PCH-' + Math.floor(100000 + Math.random() * 900000);

    const cert: QuizCertificate = {
      id: certNo,
      user_name: userName.trim(),
      user_photo_url: userPhoto,
      quiz_score: score,
      total_questions: totalQ,
      percentage,
      issued_date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificate_no: certNo
    };

    setCertificateData(cert);
    setIsQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    if (quizQuestions && quizQuestions.length > 0) {
      const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
      setActiveQuizQuestions(shuffled.slice(0, 10));
    }
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setCertificateData(null);
  };

  const handleShareWhatsApp = () => {
    if (!certificateData) return;
    const shareText = `🚩 मैंने "माँ ताप्ती पवारी शोध संस्थान" पवारी भोयरी संस्कृति क्विज़ 2026 में ${certificateData.percentage}% अंक प्राप्त कर ई-प्रमाण-पत्र प्राप्त किया है!\n\nनाम: ${certificateData.user_name}\nप्रमाण-पत्र क्रमांक: ${certificateData.certificate_no}\n\nआप भी अपनी पवारी भाषा एवं संस्कृति का परीक्षण करें: https://pawarishodh.org`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      {activeTab === 'lokgeet' ? (
        <div className="bg-slate-900/90 text-amber-100 rounded-2xl p-5 sm:p-6 border border-amber-900/30 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>मौखिक लोकसाहित्य अभिलेखागार</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 font-serif tracking-tight">
                पवारी लोकगीत संग्रह
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed font-sans">
                बैतूल, छिंदवाड़ा एवं ताप्ती अंचल के पारम्परिक पवारी विवाह, भक्ति, पूजा व ऋतु लोकगीतों का प्रामाणिक डिजिटल संग्रह।
              </p>
            </div>

            <button
              onClick={() => {
                setContribType('lokgeet');
                setIsContribModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0 self-start md:self-center"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>लोकगीत योगदान करें</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-amber-950 to-red-900 border border-amber-500/30 p-8 text-amber-100 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>पवारी भोयरी लोक संस्कृति एवं साहित्य डिजिटल कोश</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-amber-200 font-serif leading-tight mb-3">
              पवारी भोयरी शब्दकोश, पहेली, लोकगीत एवं क्विज़
            </h1>
            <p className="text-amber-100/80 text-base leading-relaxed mb-6">
              बैतूल, छिंदवाड़ा एवं ताप्ती अंचल की समृद्ध पवारी बोली के शब्दों, पारंपरिक बुझौवलों (पहेलियों), विवाह व भक्ति लोकगीतों का अनुशीलन करें। अपनी संस्कृति ज्ञान की परीक्षा दें एवं आकर्षक ई-प्रमाण-पत्र प्राप्त करें।
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setContribType('shabdkosh');
                  setIsContribModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-lg shadow-amber-900/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>पाठक योगदान: नया शब्द / पहेली / लोकगीत जोड़ें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 bg-slate-900/80 p-2 rounded-2xl border border-amber-900/40 shadow-lg">
        <button
          onClick={() => setActiveTab('shabdkosh')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'shabdkosh'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. पवारी शब्दकोश ({approvedShabdkosh.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paheli')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'paheli'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>2. पवारी पहेली ({approvedPaheli.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lokgeet')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'lokgeet'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>3. पवारी लोकगीत ({approvedLokgeet.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. क्विज़ एवं प्रमाण-पत्र</span>
        </button>
      </div>

      {/* SEARCH BAR FOR LISTINGS */}
      {activeTab !== 'quiz' && activeTab !== 'lokgeet' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-amber-900/30">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              <input
                type="text"
                placeholder={
                  activeTab === 'shabdkosh' ? 'शब्द या अर्थ खोजें...' :
                  activeTab === 'paheli' ? 'पहेली या उत्तर खोजें...' : 'लोकगीत शीर्षक या बोल खोजें...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-amber-900/40 rounded-xl text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            {/* Compact Alphabet Selector Dropdown for Shabdkosh */}
            {activeTab === 'shabdkosh' && (
              <select
                value={shabdkoshLetter}
                onChange={(e) => setShabdkoshLetter(e.target.value)}
                className="w-full sm:w-auto bg-slate-950 border border-amber-900/40 text-amber-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">वर्ण (अ-ज्ञ): सभी</option>
                {HINDI_LETTERS.filter(l => l !== 'all').map(letChar => (
                  <option key={letChar} value={letChar} className="bg-slate-900 text-amber-100">
                    ' {letChar} ' वर्ण के शब्द
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeTab === 'shabdkosh' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'दैनिक शब्द', 'रिश्ते-नाते', 'खान-पान', 'कृषि एवं लोक जीवन', 'संस्कृति एवं परम्परा'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setShabdkoshCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    shabdkoshCategory === cat 
                      ? 'bg-amber-500 text-amber-950 font-bold' 
                      : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'सभी शब्द' : cat}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'paheli' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'चिहनन की काहयनी (पहलोड़ी)', 'घरेलू सामान', 'खान-पान', 'कृषि/खेती', 'प्रकृति', 'पशु-पक्षी एवं जीव', 'शरीर के अंग', 'संस्कृति एवं परम्परा'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setPaheliCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    paheliCategory === cat 
                      ? 'bg-amber-500 text-amber-950 font-bold' 
                      : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'सभी पहेलियाँ' : cat}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setContribType(activeTab as any);
              setIsContribModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>अपना {activeTab === 'shabdkosh' ? 'शब्द' : activeTab === 'paheli' ? 'पहेली' : 'लोकगीत'} जमा करें</span>
          </button>
        </div>
      )}

      {/* 1. SHABDKOSH VIEW */}
      {activeTab === 'shabdkosh' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShabdkosh.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
            >
              {item.image_url ? (
                <div className="h-48 overflow-hidden relative bg-slate-950">
                  <SafeImage 
                    src={item.image_url} 
                    alt={item.word_pawari} 
                    loading="lazy"
                    decoding="async"
                    width={380}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-br from-amber-950/60 to-slate-900 flex items-center justify-center relative border-b border-amber-900/20">
                  <BookOpen className="w-10 h-10 text-amber-600/40" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-2xl font-black text-amber-200 font-serif tracking-wide">
                      {item.word_pawari}
                    </h3>
                  </div>

                  {item.pronunciation_hindi && (
                    <p className="text-xs text-amber-400/80 mb-3 italic">
                      उच्चारण: [{item.pronunciation_hindi}]
                    </p>
                  )}

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-900/30 mb-3 space-y-1">
                    <p className="text-sm font-semibold text-amber-100">
                      <span className="text-amber-500 font-normal text-xs mr-1">हिंदी अर्थ:</span>
                      {item.meaning_hindi}
                    </p>
                    {item.meaning_english && (
                      <p className="text-xs text-slate-400">
                        <span className="text-slate-500 mr-1">English:</span> {item.meaning_english}
                      </p>
                    )}
                  </div>

                  {item.example_pawari && (
                    <div className="text-xs text-amber-200/80 space-y-1 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/20">
                      <p className="italic">
                        <span className="font-semibold text-amber-400 not-italic">वाक्य प्रयोग:</span> "{item.example_pawari}"
                      </p>
                      {item.example_hindi && (
                        <p className="text-amber-400/60 not-italic">
                          ({item.example_hindi})
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                  <span>प्रस्तुति: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                  <span className="text-amber-500/80">पवारी संस्कृति कोश</span>
                </div>
              </div>
            </div>
          ))}

          {filteredShabdkosh.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
              <BookOpen className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
              <p className="text-amber-200/70 font-medium">कोई शब्द नहीं मिला।</p>
            </div>
          )}
        </div>
      )}

      {/* 2. PAHELI VIEW */}
      {activeTab === 'paheli' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPaheli.map((item) => {
            const isRevealed = revealedPaheli[item.id];
            return (
              <div 
                key={item.id}
                className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-amber-900/20 pb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                      {item.category}
                    </span>
                    <span className="text-xs text-amber-400/60 italic">पवारी बुझौवल</span>
                  </div>

                  <div className="flex gap-4 items-start">
                    {item.image_url && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-amber-900/40 bg-slate-950">
                        <SafeImage 
                          src={item.image_url} 
                          alt="पहेली चित्र" 
                          loading="lazy"
                          decoding="async"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-100 font-serif leading-relaxed mb-3">
                        "{item.riddle_pawari}"
                      </h3>

                      {item.hint_hindi && (
                        <p className="text-xs text-amber-300/80 flex items-center gap-1.5 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/30">
                          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>संकेत: {item.hint_hindi}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Interactive Answer Reveal & Share Controls */}
                  <div className="mt-5 pt-3 border-t border-amber-900/30 space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => togglePaheliAnswer(item.id)}
                        className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-950 hover:bg-slate-950/80 rounded-xl border border-amber-900/40 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                      >
                        <span>उत्तर बुझो / उत्तर देखें (Reveal)</span>
                        {isRevealed ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => handleWhatsAppSharePaheli(item)}
                        title="व्हाट्सएप पर शेयर करें"
                        className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleSharePaheli(item)}
                        title="पहेली शेयर / कॉपी करें"
                        className="px-3 py-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedPaheliId === item.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">कॉपी हुआ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-amber-400" />
                            <span>शेयर</span>
                          </>
                        )}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 bg-gradient-to-r from-amber-950/60 to-slate-950 rounded-xl border border-amber-700/40 space-y-1 animate-fadeIn">
                        <p className="text-base font-bold text-amber-200">
                          उत्तर: {item.answer_hindi}
                        </p>
                        {item.answer_pawari && (
                          <p className="text-xs text-amber-300">
                            (पवारी: {item.answer_pawari})
                          </p>
                        )}
                        {item.explanation_hindi && (
                          <p className="text-xs text-slate-300 mt-2 border-t border-amber-800/30 pt-2">
                            {item.explanation_hindi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                  <span>संग्रहकर्ता: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                  <button
                    onClick={() => handleSharePaheli(item)}
                    className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>शेयर करें</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPaheli.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
              <p className="text-amber-200/70 font-medium">कोई पहेली नहीं मिली।</p>
            </div>
          )}
        </div>
      )}

      {/* 3. LOKGEET VIEW */}
      {activeTab === 'lokgeet' && (
        <div className="space-y-6">
          {/* DETAILED LOKGEET MODAL / FULL VIEW */}
          {selectedLokgeet ? (
            <div className="bg-slate-900/95 border-2 border-amber-600/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-amber-100 animate-fadeIn relative">
              {/* Top Navigation & URL Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-900/40">
                <button
                  onClick={handleCloseLokgeet}
                  className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900 text-amber-200 hover:text-white rounded-xl text-xs md:text-sm font-semibold border border-amber-700/50 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>वापस लोकगीत सूची पर जाएं</span>
                </button>

                <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-amber-900/50 text-xs text-amber-400/80">
                  <Link2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-mono text-[11px] truncate max-w-[200px] sm:max-w-[320px]">
                    /lokgeet/{selectedLokgeet.slug || selectedLokgeet.id}
                  </span>
                  <button
                    onClick={(e) => handleCopyLokgeetLink(selectedLokgeet, e)}
                    className="ml-1 text-amber-300 hover:text-amber-100 flex items-center gap-1 cursor-pointer bg-amber-900/40 hover:bg-amber-800 px-2 py-0.5 rounded text-[11px] border border-amber-700/40 transition-colors"
                  >
                    {copiedLokgeetId === selectedLokgeet.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">कॉपी हुआ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>लिंक</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Song Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/60 shadow">
                    🎵 {selectedLokgeet.category}
                  </span>
                  {selectedLokgeet.singer_or_collector && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-950 text-amber-200/90 border border-amber-900/50 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-amber-400" />
                      <span>गवैया / संग्रहकर्ता: {selectedLokgeet.singer_or_collector}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-4xl font-bold text-amber-100 font-serif leading-tight">
                  {selectedLokgeet.title_pawari}
                </h2>
                {selectedLokgeet.title_hindi && (
                  <p className="text-sm md:text-base text-amber-400/90 font-medium">
                    ({selectedLokgeet.title_hindi})
                  </p>
                )}
              </div>

              {/* Optional Image / YouTube / Audio Media */}
              {selectedLokgeet.image_url && (
                <div className="max-h-72 rounded-2xl overflow-hidden relative border border-amber-900/40 bg-slate-950">
                  <SafeImage
                    src={selectedLokgeet.image_url}
                    alt={selectedLokgeet.title_pawari}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedLokgeet.audio_url && (
                <div className="p-4 bg-amber-950/40 border border-amber-800/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>पवारी ऑडियो लोकगीत सुनें:</span>
                  </div>
                  <audio controls src={selectedLokgeet.audio_url} className="w-full rounded-xl focus:outline-none" />
                </div>
              )}

              {selectedLokgeet.youtube_url && (
                <div className="p-4 bg-slate-950/80 border border-amber-900/50 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <Play className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>यूट्यूब पर वीडियो/ऑडियो प्रसारण उपलब्ध है</span>
                  </div>
                  <a
                    href={selectedLokgeet.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>यूट्यूब पर देखें</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Complete Lyrics Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
                    <Music className="w-5 h-5 text-amber-400" />
                    <span>लोकगीत के सम्पूर्ण बोल (Lyrics)</span>
                  </h3>
                  <button
                    onClick={() => handleCopyLyrics(selectedLokgeet)}
                    className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800/60 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                  >
                    {copiedLyricsId === selectedLokgeet.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">बोल कॉपी हो गए!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>बोल कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/90 p-6 md:p-8 rounded-2xl border border-amber-900/40 shadow-inner">
                  <pre className="text-base md:text-lg font-serif text-amber-50 whitespace-pre-wrap leading-relaxed tracking-wide font-normal">
                    {selectedLokgeet.lyrics_pawari}
                  </pre>
                </div>
              </div>

              {/* Hindi Meaning / भावार्थ */}
              {selectedLokgeet.lyrics_hindi_meaning && (
                <div className="p-5 bg-amber-950/40 border border-amber-800/30 rounded-2xl space-y-2">
                  <h4 className="text-sm font-bold text-amber-400 font-serif flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>गीत का भावार्थ (हिंदी अर्थ):</span>
                  </h4>
                  <p className="text-sm text-amber-100/90 leading-relaxed font-serif">
                    {selectedLokgeet.lyrics_hindi_meaning}
                  </p>
                </div>
              )}

              {/* Contributor & Share Footer */}
              <div className="pt-4 border-t border-amber-900/30 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-amber-400/60">
                  संग्रहकर्ता / योगदान: <strong className="text-amber-300">{selectedLokgeet.contributor_name || 'माँ ताप्ती शोध संस्थान'}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShareLokgeetWhatsApp(selectedLokgeet, e)}
                    className="px-3.5 py-1.5 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>व्हाट्सएप शेयर</span>
                  </button>
                  <button
                    onClick={(e) => handleCopyLokgeetLink(selectedLokgeet, e)}
                    className="px-3.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>डायरेक्ट लिंक कॉपी करें</span>
                  </button>
                </div>
              </div>

              {/* Prev / Next Lokgeet Navigation */}
              {approvedLokgeet.length > 1 && (
                <div className="pt-4 border-t border-amber-900/30 flex justify-between items-center gap-4">
                  {(() => {
                    const currentIndex = approvedLokgeet.findIndex(l => l.id === selectedLokgeet.id);
                    const prevItem = currentIndex > 0 ? approvedLokgeet[currentIndex - 1] : null;
                    const nextItem = currentIndex < approvedLokgeet.length - 1 ? approvedLokgeet[currentIndex + 1] : null;

                    return (
                      <>
                        {prevItem ? (
                          <button
                            onClick={(e) => handleOpenLokgeet(prevItem, e)}
                            className="px-3.5 py-2 bg-slate-950/80 hover:bg-slate-950 border border-amber-900/50 hover:border-amber-700 text-amber-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all max-w-[48%]"
                          >
                            <ChevronLeft className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span className="truncate">पिछला: {prevItem.title_pawari}</span>
                          </button>
                        ) : <div />}

                        {nextItem ? (
                          <button
                            onClick={(e) => handleOpenLokgeet(nextItem, e)}
                            className="px-3.5 py-2 bg-slate-950/80 hover:bg-slate-950 border border-amber-900/50 hover:border-amber-700 text-amber-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all max-w-[48%] ml-auto"
                          >
                            <span className="truncate">अगला: {nextItem.title_pawari}</span>
                            <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          </button>
                        ) : <div />}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* LOKGEET LIST VIEW */
            <div className="space-y-6">
              {/* Search, Filter Chips, Sort & Count Bar */}
              <div className="bg-slate-900/90 border border-amber-900/30 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
                {/* Search & Sort Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-amber-500/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="पवारी लोकगीत शीर्षक, श्रेणी या बोल खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-amber-900/40 rounded-xl text-amber-100 placeholder-amber-400/40 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-amber-400/70 hidden md:inline">क्रमबद्ध:</span>
                    <select
                      value={lokgeetSort}
                      onChange={(e) => setLokgeetSort(e.target.value as any)}
                      className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-amber-900/40 rounded-xl text-amber-200 text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="default">नवीनतम (Default)</option>
                      <option value="title">शीर्षक अनुसार (अ-ज़)</option>
                      <option value="category">श्रेणी अनुसार</option>
                    </select>
                  </div>
                </div>

                {/* Category Filter Chips */}
                {lokgeetCategories.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                    <span className="text-amber-400/60 font-semibold text-[11px] shrink-0 mr-1 hidden sm:inline">
                      श्रेणी:
                    </span>
                    <button
                      onClick={() => setLokgeetCategory('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        lokgeetCategory === 'all'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-950 text-amber-300 hover:bg-amber-950/60 border border-amber-900/40'
                      }`}
                    >
                      सभी श्रेणियाँ ({approvedLokgeet.length})
                    </button>

                    {lokgeetCategories.map((cat) => {
                      const count = approvedLokgeet.filter(l => l.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setLokgeetCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            lokgeetCategory === cat
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                              : 'bg-slate-950 text-amber-300 hover:bg-amber-950/60 border border-amber-900/40'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Total Count Bar */}
                <div className="flex flex-wrap items-center justify-between text-xs text-amber-400/80 pt-2 border-t border-amber-900/20 gap-2">
                  <span>
                    कुल उपलब्ध लोकगीत: <strong className="text-amber-300 font-serif">{sortedLokgeet.length}</strong>
                    {sortedLokgeet.length > LOKGEET_PER_PAGE && (
                      <span className="ml-2 text-amber-400/60">
                        (पृष्ठ {lokgeetPage} / {totalLokgeetPages})
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:inline text-amber-400/60 text-[11px]">
                    पूरा लोकगीत व भावार्थ पढ़ने हेतु "पूरा देखें" या शीर्षक पर क्लिक करें
                  </span>
                </div>
              </div>

              {/* Compact Archive Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedLokgeet.map((item) => {
                  const directUrl = `/lokgeet/${item.slug || item.id}`;
                  const lyricsClean = item.lyrics_pawari.replace(/\n+/g, ' ').trim();
                  const shortSnippet = lyricsClean.slice(0, 110) + (lyricsClean.length > 110 ? '...' : '');

                  return (
                    <div 
                      key={item.id}
                      onClick={(e) => handleOpenLokgeet(item, e)}
                      className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:bg-slate-900 shadow-xs hover:shadow-md cursor-pointer space-y-3"
                    >
                      <div className="space-y-2.5">
                        {/* Header Row: Category Tag */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/40">
                            🎵 {item.category}
                          </span>
                          <span className="text-[11px] text-amber-400/50 font-serif">
                            पवारी लोकसाहित्य
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <a
                            href={directUrl}
                            onClick={(e) => handleOpenLokgeet(item, e)}
                            className="block text-left cursor-pointer focus:outline-none"
                          >
                            <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-300 font-serif leading-snug transition-colors">
                              {item.title_pawari}
                            </h3>
                          </a>
                          {item.title_hindi && (
                            <p className="text-xs text-amber-400/70 font-medium mt-0.5">
                              ({item.title_hindi})
                            </p>
                          )}
                        </div>

                        {/* Short Snippet Preview (Not full lyrics) */}
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-900/20 text-xs font-serif text-amber-200/90 leading-relaxed italic line-clamp-2">
                          "{shortSnippet}"
                        </div>

                        {/* Source / Collector */}
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/70 italic">
                          <User className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                          <span className="truncate">
                            संग्रहकर्ता: {item.singer_or_collector || item.contributor_name || 'माँ ताप्ती शोध संस्थान'}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-amber-900/20 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => handleOpenLokgeet(item, e)}
                          className="px-3.5 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-200 hover:text-white rounded-xl text-xs font-bold border border-amber-700/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <span>पूरा देखें ➔</span>
                        </button>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleCopyLokgeetLink(item, e)}
                            title="डायरेक्ट URL लिंक कॉपी करें"
                            className="p-1.5 bg-slate-950 hover:bg-amber-950 text-amber-400 hover:text-amber-200 rounded-lg border border-amber-900/40 text-xs transition-colors cursor-pointer"
                          >
                            {copiedLokgeetId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Link2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleShareLokgeetWhatsApp(item, e)}
                            title="व्हाट्सएप पर शेयर करें"
                            className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-800/40 text-xs transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sortedLokgeet.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl space-y-2">
                    <Music className="w-12 h-12 text-amber-600/30 mx-auto" />
                    <p className="text-amber-200/70 font-medium">कोई पवारी लोकगीत नहीं मिला।</p>
                    <p className="text-xs text-amber-400/50">कृपया अन्य खोज शब्द या श्रेणी चुनकर प्रयास करें।</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalLokgeetPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">
                    प्रदर्शित: <strong className="text-amber-200 font-serif">{((lokgeetPage - 1) * LOKGEET_PER_PAGE) + 1}</strong> से <strong className="text-amber-200 font-serif">{Math.min(lokgeetPage * LOKGEET_PER_PAGE, sortedLokgeet.length)}</strong> (कुल {sortedLokgeet.length})
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={lokgeetPage === 1}
                      onClick={() => setLokgeetPage(p => Math.max(p - 1, 1))}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-900/40 text-amber-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-950/60 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                      <span>पिछला</span>
                    </button>

                    {Array.from({ length: totalLokgeetPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setLokgeetPage(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          lokgeetPage === pg
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-950 text-amber-300 hover:bg-amber-950/60 border border-amber-900/40'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      disabled={lokgeetPage === totalLokgeetPages}
                      onClick={() => setLokgeetPage(p => Math.min(p + 1, totalLokgeetPages))}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-900/40 text-amber-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-950/60 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>अगला</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Callout Box for Contributions */}
              <div className="bg-slate-900/60 border border-amber-900/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-100 mt-6 shadow-xs">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                    क्या आपके पास पारम्परिक पवारी लोकगीत उपलब्ध हैं?
                  </h4>
                  <p className="text-xs text-amber-200/70">
                    माँ ताप्ती शोध संस्थान में अपने अंचल के विवाह, पूजा या भगत गीत साझा करके लोकसाहित्य संरक्षण में योगदान दें।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setContribType('lokgeet');
                    setIsContribModalOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  लोकगीत जमा करें ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. QUIZ & CERTIFICATE ENGINE */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Dedicated Quiz Share Link Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-100 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>पवारी भोयरी संस्कृति ई-क्विज़</span>
              </div>
              <h3 className="font-serif font-bold text-amber-200 text-base sm:text-lg">
                पवारी क्विज़ शेयर करें (Direct Link)
              </h3>
              <p className="text-xs text-amber-300/80">
                बिना किसी संकेत (Hint) के अपनी पवारी भाषा एवं संस्कृति ज्ञान की परीक्षा लें। अपने मित्रों व समूह में क्विज़ लिंक शेयर करें!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShareQuizWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>वॉट्सऐप शेयर</span>
              </button>
              <button
                onClick={handleCopyQuizLink}
                className="px-3.5 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-600/60 text-amber-200 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedQuizLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">लिंक कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-amber-400" />
                    <span>क्विज़ डायरेक्ट लिंक</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!isQuizSubmitted ? (
            <div className="bg-slate-900/90 border border-amber-800/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-amber-100">
              {/* User Details Setup Before or During Quiz */}
              <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800/30 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  प्रमाण-पत्र हेतु प्रतिभागी का नाम एवं फोटो (Participant Info for Certificate)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      आपका पूरा नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      placeholder="जैसे: रूपेश पवार / अनिता मालवीय"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      प्रमाण-पत्र फोटो (Optional Photo)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="https://... या फाइल अपलोड करें"
                        value={userPhoto}
                        onChange={(e) => setUserPhoto(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <label className="px-3 py-2 bg-amber-950 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'quiz')} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Header & Progress */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      प्रश्न {currentQIndex + 1} / {activeQuizQuestions.length}
                    </span>
                    <span className="text-[10px] bg-red-950/90 text-amber-300/90 border border-amber-700/50 px-2 py-0.5 rounded font-mono font-semibold">
                      संकेत/Hint रहित निष्पक्ष परीक्षा
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-100 font-serif mt-1">
                    {activeQuizQuestions[currentQIndex]?.question_pawari}
                  </h3>
                  {activeQuizQuestions[currentQIndex]?.question_hindi && (
                    <p className="text-xs text-amber-400/70 mt-0.5">
                      ({activeQuizQuestions[currentQIndex]?.question_hindi})
                    </p>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-600/50 flex items-center justify-center font-bold text-amber-300 text-sm flex-shrink-0">
                  {currentQIndex + 1}/{activeQuizQuestions.length}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {activeQuizQuestions[currentQIndex]?.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-100 font-semibold shadow-lg' 
                          : 'bg-slate-950/60 border-amber-900/40 text-amber-200/90 hover:bg-slate-950 hover:border-amber-700/50'
                      }`}
                    >
                      <span className="text-sm flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-amber-500 text-amber-950' : 'bg-slate-900 text-amber-400'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {opt}
                      </span>
                      {isSelected && <Check className="w-5 h-5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-900/30">
                <button
                  onClick={handlePrevQuiz}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-amber-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  पिछला प्रश्न
                </button>

                {currentQIndex < activeQuizQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-lg cursor-pointer"
                  >
                    अगला प्रश्न
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-emerald-950 font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>क्विज़ सबमिट करें एवं प्रमाण-पत्र देखें</span>
                  </button>
                )}
              </div>
            </div>
          ) : certificateData && certificateData.percentage >= 60 ? (
            /* CERTIFICATE DISPLAY & DOWNLOAD CARD FOR PASSING SCORE (>= 60%) */
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-amber-500/40 p-6 rounded-3xl text-center space-y-4 shadow-2xl">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-amber-200 font-serif">
                  बधाई हो! {certificateData?.user_name}
                </h3>
                <p className="text-sm text-amber-100/80">
                  आपने {certificateData?.total_questions} में से {certificateData?.quiz_score} प्रश्नों का सही उत्तर देकर 
                  <strong className="text-amber-400 mx-1 font-bold">{certificateData?.percentage}%</strong> सफलता प्राप्त की है!
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={handlePrintCertificate}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ई-प्रमाण-पत्र प्रिंट / डाउनलोड करें</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>वॉट्सऐप पर शेयर करें</span>
                  </button>

                  <button
                    onClick={handleCopyQuizLink}
                    className="px-4 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {copiedQuizLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">क्विज़ लिंक कॉपी हुआ!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-amber-400" />
                        <span>क्विज़ लिंक शेयर करें</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>पुनः क्विज़ दें</span>
                  </button>
                </div>
              </div>

              {/* HIGH-RES VISUAL CERTIFICATE TEMPLATE */}
              <div className="print:m-0 print:p-0 print:shadow-none">
                <div className="bg-gradient-to-br from-amber-950 via-red-950 to-amber-950 border-8 border-amber-600/80 p-8 md:p-12 rounded-3xl text-amber-100 relative shadow-2xl font-serif text-center overflow-hidden">
                  {/* Decorative Border Corners */}
                  <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400" />

                  {/* Institution Header */}
                  <div className="mb-6 space-y-1">
                    <p className="text-xs uppercase tracking-widest text-amber-400 font-sans font-bold">
                      🚩 माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) 🚩
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-amber-200 tracking-wide drop-shadow-md">
                      पवारी भोयरी संस्कृति ई-प्रमाण-पत्र
                    </h2>
                    <p className="text-xs text-amber-300/80 font-sans">
                      (Pawari Cultural Heritage Quiz Certificate of Merit)
                    </p>
                  </div>

                  {/* Photo & Name Section */}
                  <div className="my-6 space-y-4">
                    {certificateData?.user_photo_url ? (
                      <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-900">
                        <SafeImage 
                          src={certificateData.user_photo_url} 
                          alt={certificateData.user_name} 
                          loading="lazy"
                          decoding="async"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto bg-amber-900/60 border-2 border-amber-500/50 flex items-center justify-center text-amber-300">
                        <Award className="w-10 h-10" />
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-amber-300/80 font-sans uppercase tracking-wider">यह प्रमाण-पत्र सहर्ष प्रदान किया जाता है:</p>
                      <h3 className="text-2xl md:text-3xl font-black text-amber-300 underline decoration-amber-500/50 underline-offset-8 mt-1">
                        {certificateData?.user_name}
                      </h3>
                    </div>
                  </div>

                  {/* Citation text */}
                  <p className="text-sm md:text-base text-amber-100/90 max-w-xl mx-auto leading-relaxed my-4 font-normal">
                    जिन्होंने पवारी भोयरी संस्कृति, लोकगीत, पहेली एवं शब्दकोश पर आधारित ज्ञान परीक्षण में 
                    <strong className="text-amber-300 font-bold mx-1">{certificateData?.percentage}% प्राप्तांक</strong> के साथ उत्कृष्ट प्रदर्शन कर पवारी भाषा के संरक्षण एवं संवर्धन में सराहनीय योगदान दिया है।
                  </p>

                  {/* Seal and Signatures */}
                  <div className="mt-10 pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans text-xs">
                    <div className="text-left space-y-0.5">
                      <p className="text-amber-400 font-bold">क्रमांक: {certificateData?.certificate_no}</p>
                      <p className="text-amber-300/70">जारी तिथि: {certificateData?.issued_date}</p>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-bold text-[10px] uppercase text-center p-1 leading-tight shadow-inner">
                      ऑफिशियल सील 2026
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-serif text-sm font-bold text-amber-200">डॉ. कैलाश पवार</p>
                      <p className="text-amber-400 font-semibold">संरक्षक / निदेशक</p>
                      <p className="text-amber-300/60 text-[10px]">माँ ताप्ती पवारी शोध संस्थान</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* RETAKE QUIZ CARD FOR SCORES BELOW 60% */
            <div className="bg-slate-900/90 border border-amber-700/50 p-8 rounded-3xl text-center space-y-5 shadow-2xl">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-12 h-12 text-amber-400" />
              </div>

              <h3 className="text-2xl font-black text-amber-100 font-serif">
                प्रयास पूर्ण: {certificateData?.user_name}
              </h3>

              <p className="text-base text-amber-200/90">
                आपने {certificateData?.total_questions} में से <strong className="text-amber-400 font-bold">{certificateData?.quiz_score}</strong> प्रश्नों के सही उत्तर दिए हैं (प्राप्तांक: <strong className="text-amber-400 font-bold">{certificateData?.percentage}%</strong>)।
              </p>

              <div className="p-4 bg-amber-950/70 border border-amber-700/60 rounded-2xl max-w-md mx-auto text-xs text-amber-200 leading-relaxed text-left space-y-1">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  प्रमाण-पत्र पात्रता दिशानिर्देश:
                </p>
                <p>• पवारी ई-प्रमाण-पत्र प्राप्त करने हेतु न्यूनतम <strong>60% अंक (10 में से कम से कम 6 सही उत्तर)</strong> आवश्यक हैं।</p>
                <p>• कृपया पवारी शब्दकोश एवं पहेलियों का पुनः अध्ययन कर दोबारा प्रयास करें।</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-xl inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः क्विज़ का प्रयास करें (Retake Quiz)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PUBLIC CONTRIBUTION MODAL FORM */}
      {isContribModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setIsContribModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              जन-सामान्य पाठक योगदान (Public Contribution)
            </h3>
            <p className="text-xs text-amber-200/90 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>नोट: आपके द्वारा भेजा गया शब्द, पहेली या लोकगीत एडमिन/CMS संपादक मंडल की स्वीकृति (Approval) मिलने के बाद ही पोर्टल पर सार्वजनिक होगा।</span>
            </p>

            {contribSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-amber-200">योगदान सफलतापूर्वक दर्ज किया गया!</h4>
                <p className="text-xs text-amber-400/80">धन्यवाद! समीक्षा के उपरांत आपकी प्रविष्टि प्रकाशित की जाएगी।</p>
              </div>
            ) : (
              <form onSubmit={handleContribSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    आपका शुभ नाम (Contributor Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: रामेश्वर शर्मा, बैतूल"
                    value={contribFormData.contributor_name || ''}
                    onChange={(e) => setContribFormData((prev: any) => ({ ...prev, contributor_name: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    योगदान का वर्ग (Select Type) *
                  </label>
                  <select
                    value={contribType}
                    onChange={(e) => setContribType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm font-medium"
                  >
                    <option value="shabdkosh" className="bg-slate-900 text-amber-100">📖 पवारी शब्दकोश (Word & Meaning)</option>
                    <option value="paheli" className="bg-slate-900 text-amber-100">🧩 पवारी पहेली (Riddle & Answer)</option>
                    <option value="lokgeet" className="bg-slate-900 text-amber-100">🎵 पवारी लोकगीत (Folk Song)</option>
                    <option value="blogs" className="bg-slate-900 text-amber-100">✍️ ब्लॉग / लेख (Blog Article)</option>
                    <option value="books" className="bg-slate-900 text-amber-100">📚 पुस्तक / शोध ग्रंथ (Book Proposal)</option>
                    <option value="review" className="bg-slate-900 text-amber-100">📑 पुस्तक समीक्षा (Book Review)</option>
                  </select>
                </div>

                {/* Dynamic Fields for Shabdkosh */}
                {contribType === 'shabdkosh' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी शब्द *</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: डोरा, भाकर"
                          value={contribFormData.word_pawari || ''}
                          onChange={(e) => setContribFormData((prev: any) => ({ ...prev, word_pawari: e.target.value }))}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1">हिंदी अर्थ *</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: आंख / नेत्र"
                          value={contribFormData.meaning_hindi || ''}
                          onChange={(e) => setContribFormData((prev: any) => ({ ...prev, meaning_hindi: e.target.value }))}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी वाक्य प्रयोग</label>
                      <textarea
                        rows={2}
                        placeholder="वाक्य प्रयोग लिखें..."
                        value={contribFormData.example_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, example_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Paheli */}
                {contribType === 'paheli' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी पहेली (Riddle) *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="पहेली की पंक्तियाँ लिखें..."
                        value={contribFormData.riddle_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, riddle_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">उत्तर (हिंदी में) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उत्तर लिखें..."
                        value={contribFormData.answer_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, answer_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Lokgeet */}
                {contribType === 'lokgeet' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">लोकगीत का नाम *</label>
                      <input
                        type="text"
                        required
                        placeholder="शीर्षक दर्ज करें..."
                        value={contribFormData.title_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">लोकगीत बोल (Lyrics) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="गीत की पंक्तियाँ दर्ज करें..."
                        value={contribFormData.lyrics_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, lyrics_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm font-serif"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Blogs */}
                {contribType === 'blogs' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">ब्लॉग का शीर्षक (Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी लोकसाहित्य में ताप्ती संस्कृति का प्रभाव"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">ब्लॉग सामग्री (Full Article) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="यहाँ अपना आलेख विस्तार से लिखें..."
                        value={contribFormData.content_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, content_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Books */}
                {contribType === 'books' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पुस्तक का शीर्षक (Book Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी व्याकरण एवं शब्द कोश"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पुस्तक सारांश / परिचय (Synopsis) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="पुस्तक का परिचय, विषय-वस्तु एवं उद्देश्य लिखें..."
                        value={contribFormData.synopsis_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, synopsis_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Book Review */}
                {contribType === 'review' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षा का शीर्षक (Review Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी लोककथाएं पुस्तक की समालोचना"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षित पुस्तक एवं लेखक का नाम *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: 'पवारी कहावतें' (लेखक: डॉ. रामेश्वर पवार)"
                        value={contribFormData.reviewedBookDetails || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, reviewedBookDetails: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षा आलेख (Review Article) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="विस्तृत समीक्षा लिखें..."
                        value={contribFormData.content_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, content_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    संबंधित फोटो (Optional Image URL or Upload)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={contribFormData.image_url || ''}
                      onChange={(e) => setContribFormData((prev: any) => ({ ...prev, image_url: e.target.value }))}
                      className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs"
                    />
                    <label className="px-3 py-2 bg-amber-950 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'contrib')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsContribModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-slate-800 text-amber-200 text-sm font-medium"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>सबमिट करें</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
