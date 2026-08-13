import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { findShabdkosh, findPaheli } from '../../lib/slugUtils';
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
  Play,
  Trophy,
  Medal,
  Image as ImageIcon,
  Loader2,
  Printer
} from 'lucide-react';

interface PawariCulturalSectionProps {
  initialTab?: 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

// Helper function to shuffle options of a QuizQuestion so correct answer is NOT stuck at A
export function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  if (!q || !q.options || q.options.length === 0) return q;
  const correctText = q.options[q.correct_option_index ?? 0];
  const shuffledOptions = [...q.options];

  // Fisher-Yates shuffle
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  let newCorrectIndex = shuffledOptions.indexOf(correctText);
  if (newCorrectIndex === -1) newCorrectIndex = 0;

  return {
    ...q,
    options: shuffledOptions,
    correct_option_index: newCorrectIndex
  };
}

const FALLBACK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fq1',
    question_pawari: 'हरी घास पर प्रातःकाल मोती जैसी चमकने वाली इस बूंद की पहेली (पाहलोड़ी) का उत्तर क्या है?',
    question_hindi: 'हरी घास पर प्रातःकाल मोती जैसी चमकने वाली इस बूंद की पहेली (पाहलोड़ी) का उत्तर क्या है?',
    options: ['पानी (Water)', 'ओस (Dew)', 'दूध (Milk)', 'अमृत (Nectar)'],
    correct_option_index: 1,
    explanation: 'प्रातःकाल घास की पत्तियों पर जमी बूंदों को ओस (Dew) कहा जाता है।',
    section_type: 'paheli'
  },
  {
    id: 'fq2',
    question_pawari: 'पवारी बोली मुख्य रूप से किस भौगोलिक अंचल एवं भाषा-परिवार की सांस्कृतिक धरोहर है?',
    question_hindi: 'पवारी बोली मुख्य रूप से किस भौगोलिक अंचल एवं भाषा-परिवार की सांस्कृतिक धरोहर है?',
    options: ['उत्तर प्रदेश (UP)', 'राजस्थान (Rajasthan)', 'बैतूल, छिंदवाड़ा, सिवनी व ताप्ती अंचल (म.प्र.-महाराष्ट्र सीमा)', 'गुजरात (Gujarat)'],
    correct_option_index: 2,
    explanation: 'पवारी बोली बैतूल, छिंदवाड़ा, सिवनी, बालाघाट एवं वर्धा क्षेत्र की सांस्कृतिक धरोहर है।',
    section_type: 'shabdkosh'
  },
  {
    id: 'fq3',
    question_pawari: 'पवारी भाषा में "रोटी / अनाज के पकवान" को सामान्यतः क्या कहा जाता है?',
    question_hindi: 'पवारी भाषा में "रोटी / अनाज के पकवान" को सामान्यतः क्या कहा जाता है?',
    options: ['चावल (Rice)', 'खीर (Pudding)', 'रोटी / भाकर (Bread / Bhakar)', 'सब्जी (Vegetable)'],
    correct_option_index: 2,
    explanation: 'पवारी में रोटी/भाकर अनाज के पकवान के लिए प्रयुक्त होता है।',
    section_type: 'shabdkosh'
  },
  {
    id: 'fq4',
    question_pawari: 'पवारी लोक संस्कृति में माँ ताप्ती का पावन उद्गम स्थल कहाँ स्थित है?',
    question_hindi: 'पवारी लोक संस्कृति में माँ ताप्ती का पावन उद्गम स्थल कहाँ स्थित है?',
    options: ['भोपाल (Bhopal)', 'मुलताई, बैतूल (Multai, Betul)', 'इन्दौर (Indore)', 'जबलपुर (Jabalpur)'],
    correct_option_index: 1,
    explanation: 'माँ ताप्ती का पावन उद्गम मुलताई नगर (बैतूल, म.प्र.) में स्थित है।',
    section_type: 'lokgeet'
  },
  {
    id: 'fq5',
    question_pawari: 'पवारी लोकगीत मुख्य रूप से किस अवसर पर गाए जाते हैं?',
    question_hindi: 'पवारी लोकगीत मुख्य रूप से किस अवसर पर गाए जाते हैं?',
    options: ['विवाह, दीवाली, होली एवं पर्व-त्योहार', 'केवल खेलकूद स्पर्धा', 'कार्यालयीन मीटिंग', 'व्यापारिक क्रय-विक्रय'],
    correct_option_index: 0,
    explanation: 'पवारी लोकगीत विवाह, दीवाली, होली व सांस्कृतिक उत्सवों पर गाए जाते हैं।',
    section_type: 'lokgeet'
  },
  {
    id: 'fq6',
    question_pawari: 'माँ ताप्ती पवारी शोध संस्थान के निदेशक एवं वरिष्ठ पवारी साहित्यकार कौन हैं?',
    question_hindi: 'माँ ताप्ती पवारी शोध संस्थान के निदेशक एवं वरिष्ठ पवारी साहित्यकार कौन हैं?',
    options: ['डॉ. कैलाश पवार', 'डॉ. मोहन लाल गुप्ता', 'श्री रामेश्वर शर्मा', 'प्रो. अनिता मालवीय'],
    correct_option_index: 0,
    explanation: 'डॉ. कैलाश पवार माँ ताप्ती पवारी शोध संस्थान मुलताई के निदेशक एवं शोधकर्ता हैं।',
    section_type: 'writers'
  },
  {
    id: 'fq7',
    question_pawari: 'पवारी शोध पत्रिका में प्रकाशित शोध पत्रों (Research Papers) का प्राथमिक उद्देश्य क्या है?',
    question_hindi: 'पवारी शोध पत्रिका में प्रकाशित शोध पत्रों (Research Papers) का प्राथमिक उद्देश्य क्या है?',
    options: ['व्यवसायिक विज्ञापन', 'पवारी भाषा विज्ञान, लोकसाहित्य व संस्कृति का वैज्ञानिक संरक्षण', 'राजनीतिक चुनाव प्रचार', 'सिनेमा मनोरंजन'],
    correct_option_index: 1,
    explanation: 'शोध पत्रों का उद्देश्य पवारी बोली के व्याकरण, लोकसाहित्य एवं इतिहास का प्रामाणिक दस्तावेजीकरण है।',
    section_type: 'articles'
  },
  {
    id: 'fq8',
    question_pawari: 'पवारी पहेली (पाहलोड़ी): "लाल-लाल गाजर, पेट मा पत्थर" का सही उत्तर क्या है?',
    question_hindi: 'पवारी पहेली (पाहलोड़ी): "लाल-लाल गाजर, पेट मा पत्थर" का सही उत्तर क्या है?',
    options: ['आम (Mango)', 'इमली (Tamarind)', 'जामुन (Black Plum)', 'महुआ / खजूर (Mahua / Date)'],
    correct_option_index: 3,
    explanation: 'इस पारम्परिक पाहलोड़ी (पहेली) का सही उत्तर महुआ या खजूर है।',
    section_type: 'paheli'
  },
  {
    id: 'fq9',
    question_pawari: 'पवारी भाषा-संस्कृति पर आधारित प्रकाशित ग्रन्थों व पुस्तकों का डिजिटल रिकॉर्ड कौन रखता है?',
    question_hindi: 'पवारी भाषा-संस्कृति पर आधारित प्रकाशित ग्रन्थों व पुस्तकों का डिजिटल रिकॉर्ड कौन रखता है?',
    options: ['विदेश शोध संस्थान', 'माँ ताप्ती पवारी शोध संस्थान एवं अंचल साहित्यकार', 'फिल्म सेंसर बोर्ड', 'खेल प्राधिकरण'],
    correct_option_index: 1,
    explanation: 'माँ ताप्ती पवारी शोध संस्थान मुलताई पवारी ग्रन्थों एवं साहित्यकारों का डिजिटल रिकॉर्ड रखता है।',
    section_type: 'books'
  },
  {
    id: 'fq10',
    question_pawari: 'पवारी लोकगीतों में विवाह अवसर पर गाया जाने वाला प्रमुख मंगल गीत कौन सा है?',
    question_hindi: 'पवारी लोकगीतों में विवाह अवसर पर गाया जाने वाला प्रमुख मंगल गीत कौन सा है?',
    options: ['फाग गीत', 'विवाह बन्ना-बन्नी व भांवर गीत', 'मराठी लावणी', 'कव्वाली'],
    correct_option_index: 1,
    explanation: 'विवाह के समय पवारी बन्ना-बन्नी, हल्दी, भांवर व विदाई गीत मंगल स्वरों में गाए जाते हैं।',
    section_type: 'lokgeet'
  }
];

export const PawariCulturalSection: React.FC<PawariCulturalSectionProps> = ({ initialTab = 'shabdkosh' }) => {
  const { 
    lang,
    shabdkoshList, 
    paheliList, 
    lokgeetList, 
    quizQuestions, 
    writers,
    books,
    articles,
    editorialMembers,
    quizLeaderboard,
    saveQuizCertificate,
    submitPublicContribution, 
    uploadFileToStorage 
  } = useCms();
  const [activeTab, setActiveTab] = useState<'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

  // Dynamic Patron / Director and Chief Editor from CMS Editorial Members
  const patronMember = (editorialMembers || []).find(m => 
    (m.role && (m.role.toLowerCase().includes('patron') || m.role.includes('संरक्षक'))) || 
    (m.designation_hindi && m.designation_hindi.includes('संरक्षक'))
  ) || (editorialMembers || [])[0];

  const chiefEditorMember = (editorialMembers || []).find(m => 
    (m.role && (m.role.toLowerCase().includes('chief') || m.role.includes('मुख्य'))) || 
    (m.designation_hindi && m.designation_hindi.includes('मुख्य संपादक'))
  ) || (editorialMembers || [])[1] || (editorialMembers || [])[0];

  // Filter approved items only for public display (Pending contributions require CMS approval)
  const approvedShabdkosh = shabdkoshList.filter(s => s.status === 'approved' || s.status === 'published' || (!s.status && !s.id.startsWith('contrib_')));
  const approvedPaheli = paheliList.filter(p => p.status === 'approved' || p.status === 'published' || (!p.status && !p.id.startsWith('contrib_')));
  const approvedLokgeet = lokgeetList.filter(l => l.status === 'approved' || l.status === 'published' || (!l.status && !l.id.startsWith('contrib_')));

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

  // Shabdkosh & Paheli deep linking state
  const [selectedShabdkosh, setSelectedShabdkosh] = useState<PawariShabdkoshItem | null>(null);
  const [copiedShabdkoshId, setCopiedShabdkoshId] = useState<string | null>(null);

  const [selectedPaheli, setSelectedPaheli] = useState<PawariPaheliItem | null>(null);

  // Sync Shabdkosh from URL on mount & popstate
  React.useEffect(() => {
    const syncShabdkoshFromUrl = () => {
      try {
        const pathname = decodeURIComponent(window.location.pathname.toLowerCase());
        if (pathname.startsWith('/shabdkosh/')) {
          const slugOrId = pathname.replace('/shabdkosh/', '').trim();
          if (slugOrId) {
            const found = findShabdkosh(approvedShabdkosh, slugOrId);
            if (found) {
              setSelectedShabdkosh(found);
              setActiveTab('shabdkosh');
              return;
            }
          }
        } else if (pathname === '/shabdkosh' || pathname === '/pawari-shabdkosh') {
          setActiveTab('shabdkosh');
        }
      } catch (e) {}
    };

    syncShabdkoshFromUrl();
    window.addEventListener('popstate', syncShabdkoshFromUrl);
    return () => window.removeEventListener('popstate', syncShabdkoshFromUrl);
  }, [approvedShabdkosh]);

  // Sync Paheli from URL on mount & popstate
  React.useEffect(() => {
    const syncPaheliFromUrl = () => {
      try {
        const pathname = decodeURIComponent(window.location.pathname.toLowerCase());
        if (pathname.startsWith('/paheli/')) {
          const slugOrId = pathname.replace('/paheli/', '').trim();
          if (slugOrId) {
            const found = findPaheli(approvedPaheli, slugOrId);
            if (found) {
              setSelectedPaheli(found);
              setActiveTab('paheli');
              return;
            }
          }
        } else if (pathname === '/paheli' || pathname === '/pawari-paheli') {
          setActiveTab('paheli');
        }
      } catch (e) {}
    };

    syncPaheliFromUrl();
    window.addEventListener('popstate', syncPaheliFromUrl);
    return () => window.removeEventListener('popstate', syncPaheliFromUrl);
  }, [approvedPaheli]);

  const handleOpenShabdkosh = (item: PawariShabdkoshItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSelectedShabdkosh(item);
    setActiveTab('shabdkosh');
    const targetId = item.slug || item.id;
    const targetUrl = `/shabdkosh/${targetId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: 'pawari_shabdkosh', itemSlugOrId: targetId }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseShabdkosh = () => {
    setSelectedShabdkosh(null);
    if (window.location.pathname.startsWith('/shabdkosh/')) {
      window.history.pushState({ view: 'pawari_shabdkosh' }, '', '/shabdkosh');
    }
  };

  const handleCopyShabdkoshLink = (item: PawariShabdkoshItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/shabdkosh/${item.slug || item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directUrl).then(() => {
        setCopiedShabdkoshId(item.id);
        setTimeout(() => setCopiedShabdkoshId(null), 2500);
      });
    } else {
      prompt('पवारी शब्द का डायरेक्ट लिंक कॉपी करें:', directUrl);
    }
  };

  const handleShareShabdkoshWhatsApp = (item: PawariShabdkoshItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/shabdkosh/${item.slug || item.id}`;
    const shareText = `📚 *पवारी शब्दकोश:* "${item.word_pawari}"\n${item.pronunciation_hindi ? `उच्चारण: [${item.pronunciation_hindi}]\n` : ''}हिंदी अर्थ: ${item.meaning_hindi}\n${item.example_pawari ? `वाक्य प्रयोग: "${item.example_pawari}"\n` : ''}\n📖 पवारी भाषा एवं संस्कृति शोध पत्रिका:\n${directUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleOpenPaheli = (item: PawariPaheliItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSelectedPaheli(item);
    setActiveTab('paheli');
    const targetId = item.slug || item.id;
    const targetUrl = `/paheli/${targetId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: 'pawari_paheli', itemSlugOrId: targetId }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePaheli = () => {
    setSelectedPaheli(null);
    if (window.location.pathname.startsWith('/paheli/')) {
      window.history.pushState({ view: 'pawari_paheli' }, '', '/paheli');
    }
  };

  const handleCopyPaheliLink = (item: PawariPaheliItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/paheli/${item.slug || item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directUrl).then(() => {
        setCopiedPaheliId(item.id);
        setTimeout(() => setCopiedPaheliId(null), 2500);
      });
    } else {
      prompt('पवारी पहेली का डायरेक्ट लिंक कॉपी करें:', directUrl);
    }
  };

  const handleSharePaheliWhatsApp = (item: PawariPaheliItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const directUrl = `${window.location.origin}/paheli/${item.slug || item.id}`;
    const isAnswerRevealed = !!revealedPaheli[item.id];
    let shareText = `🧩 *पवारी पहेली (पवारी बुझौवल)* 🧩\n\n"${item.riddle_pawari}"`;
    if (isAnswerRevealed) {
      shareText += `\n\n✅ *उत्तर:* ${item.answer_hindi}`;
      if (item.answer_pawari) shareText += ` (${item.answer_pawari})`;
    } else {
      shareText += `\n\n🤔 *उत्तर बुझिए और देखिए यहाँ:*`;
    }
    shareText += `\n${directUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

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
  const [quizSubTab, setQuizSubTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  // Helper function to reliably render the certificate DOM element to HTML5 Canvas
  const renderCertificateCanvas = async (certElement: HTMLElement): Promise<HTMLCanvasElement> => {
    // Wait for any images inside the certificate element to finish loading
    const images = Array.from(certElement.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        if (!img.complete) {
          const currentSrc = img.src;
          img.src = currentSrc;
        }
      });
    }));

    const html2canvasModule = await import('html2canvas-pro');
    const html2canvas = (html2canvasModule.default || html2canvasModule) as unknown as (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;

    return await html2canvas(certElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFDF7',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: certElement.scrollWidth || 900,
      windowHeight: certElement.scrollHeight || 600,
      onclone: (clonedDoc: Document) => {
        // 1. Convert/clean oklch(...) colors in cloned stylesheets to avoid parser crashes
        const styleEls = clonedDoc.querySelectorAll('style');
        styleEls.forEach((style) => {
          if (style.textContent && /oklch/i.test(style.textContent)) {
            style.textContent = style.textContent.replace(/oklch\([^)]+\)/gi, '#b45309');
          }
        });

        // 2. Format printable-certificate-card element
        const target = clonedDoc.getElementById('printable-certificate-card');
        if (target) {
          target.style.backgroundColor = '#FFFDF7';
          target.style.color = '#0f172a';
          
          // Ensure crossOrigin on cloned images
          const clonedImgs = target.querySelectorAll('img');
          clonedImgs.forEach(img => {
            if (img.src && !img.src.startsWith('data:')) {
              img.crossOrigin = 'anonymous';
            }
          });
        }
      }
    });
  };

  const handleDownloadCertificateImage = async () => {
    const certElement = document.getElementById('printable-certificate-card');
    if (!certElement) {
      alert('प्रमाण-पत्र कार्ड उपलब्ध नहीं है।');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const canvas = await renderCertificateCanvas(certElement);
      const imageUri = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const nameClean = (certificateData?.user_name || 'Participant').replace(/\s+/g, '_');
      link.download = `Pawari_Quiz_Certificate_${nameClean}.png`;
      link.href = imageUri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Error generating certificate image:', err);
      alert('इमेज डाउनलोड करने में त्रुटि हुई: ' + (err?.message || 'पुनः प्रयास करें।'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadCertificatePdf = async () => {
    const certElement = document.getElementById('printable-certificate-card');
    if (!certElement) {
      alert('प्रमाण-पत्र कार्ड उपलब्ध नहीं है।');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const jspdfModule = await import('jspdf');
      const jsPDFClass = ((jspdfModule as any).jsPDF || (jspdfModule as any).default) as any;

      if (!jsPDFClass) {
        throw new Error('jsPDF module load error');
      }

      const canvas = await renderCertificateCanvas(certElement);
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // ALWAYS STRICT A4 FORMAT: Landscape orientation (297mm x 210mm) for A4 print & PDF
      const pdf = new jsPDFClass({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // Exactly 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Exactly 210mm

      // Standardized 6mm margin to fit cleanly on 1 single A4 page
      const margin = 6;
      const maxWidth = pdfWidth - (margin * 2);
      const maxHeight = pdfHeight - (margin * 2);

      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const renderWidth = imgWidth * ratio;
      const renderHeight = imgHeight * ratio;

      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');
      const nameClean = (certificateData?.user_name || 'Participant').replace(/\s+/g, '_');
      pdf.save(`Pawari_Quiz_Certificate_A4_${nameClean}.pdf`);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      alert('PDF डाउनलोड करने में त्रुटि हुई: ' + (err?.message || 'पुनः प्रयास करें।'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareCertificateImage = async () => {
    const certElement = document.getElementById('printable-certificate-card');
    if (!certElement) {
      alert('प्रमाण-पत्र कार्ड उपलब्ध नहीं है।');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const canvas = await renderCertificateCanvas(certElement);
      const nameClean = (certificateData?.user_name || 'Participant').replace(/\s+/g, '_');
      const fileName = `Pawari_Quiz_Certificate_${nameClean}.png`;
      const quizUrl = `${window.location.origin}/quiz`;

      const shareText = `🏆 *पवारी भोयरी लोक संस्कृति एवं साहित्य ई-प्रमाण-पत्र 2026* 🏆\n\nमैंने माँ ताप्ती पवारी शोध संस्थान की पवारी भोयरी संस्कृति ई-क्विज़ में ${certificateData?.quiz_score}/${certificateData?.total_questions} (${certificateData?.percentage}%) अंक प्राप्त कर यह सम्मानजनक ई-प्रमाण-पत्र अर्जित किया है!\n\nप्रतिभागी: ${certificateData?.user_name}\nसर्टिफिकेट क्रमांक: PST-2026-QUIZ-${certificateData?.certificate_no}\n\n👉 *अपनी पवारी भाषा, लोकगीत एवं संस्कृति ज्ञान का परीक्षण करें तथा ई-सर्टिफिकेट पाएं:*\n${quizUrl}\n\n🚩 *माँ ताप्ती पवारी शोध संस्थान*`;

      const runFallbackShare = () => {
        const imageUri = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = imageUri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');

        alert('सर्टिफिकेट इमेज डाउनलोड हो गई है एवं व्हाट्सएप शेयर विंडो खोल दी गई है! डाउनलोड इमेज को साथ में अटैच करके भेजें।');
      };

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGeneratingImage(false);
          alert('इमेज फ़ाइल तैयार करने में असमर्थ।');
          return;
        }

        const file = new File([blob], fileName, { type: 'image/png' });
        const shareData = {
          title: 'पवारी भोयरी संस्कृति ई-प्रमाण-पत्र',
          text: shareText,
          files: [file]
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share(shareData);
            setIsGeneratingImage(false);
            return;
          } catch (shareErr: any) {
            if (shareErr?.name === 'AbortError') {
              setIsGeneratingImage(false);
              return;
            }
            console.log('Native file share failed/fallback needed:', shareErr);
          }
        }

        runFallbackShare();
        setIsGeneratingImage(false);
      }, 'image/png');
    } catch (err: any) {
      console.error('Error sharing certificate image:', err);
      alert('शेयर करने में त्रुटि हुई: ' + (err?.message || 'पुनः प्रयास करें।'));
      setIsGeneratingImage(false);
    }
  };

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
    const shareText = `🏆 *पवारी भोयरी लोक संस्कृति एवं साहित्य ई-क्विज़ 2026* 🏆\n\nअपनी पवारी बोली, लोकगीत, शब्दकोश एवं पहेली ज्ञान की परीक्षा दें और ई-प्रमाण-पत्र प्राप्त करें!\n\n👉 *क्विज़ में भाग लेने के लिए नीचे दिए गए डायरेक्ट लिंक पर क्लिक करें:*\n${quizUrl}\n\n🚩 *माँ ताप्ती पवारी शोध संस्थान*`;
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

  // Quiz Category Filter and Question Count Limit states
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<string>('all');
  const [quizQuestionLimit, setQuizQuestionLimit] = useState<number | 'all'>(10);

  // Quiz logic - dynamically generate multi-domain questions (Shabdkosh, Paheli, Lokgeet, Writers, Research Papers, Books)
  // guaranteeing that ALL shabdkosh, ALL paheli, and ALL lokgeet items are converted into questions!
  const generateFreshQuizQuestions = React.useCallback((catFilter: string = selectedQuizCategory, limit: number | 'all' = quizQuestionLimit): QuizQuestion[] => {
    const dynamicList: QuizQuestion[] = [];

    const defaultShabdkoshDistractors = ['पानी (Water)', 'रोटी / भाकर (Bread)', 'घर / मकान (House)', 'पेड़ / वृक्ष (Tree)', 'मित्र / सखा (Friend)', 'सूर्य / धूप (Sun)', 'आकाश / गगन (Sky)', 'दूध (Milk)', 'नदी / जल (River)', 'अमृत / मिठास (Nectar)'];
    const defaultPaheliDistractors = ['ओस की बूंद (Dew)', 'महुआ / खजूर (Date/Mahua)', 'दीपक एवं बाटी (Lamp)', 'सूरज और धूप (Sun)', 'ताला और चाबी (Lock)', 'आंखें (Eyes)', 'रास्ता / मार्ग (Path)', 'दर्पण / शीशा (Mirror)', 'बादल / घटा (Cloud)'];
    const standardCategories = ['विवाह गीत', 'भक्ति / पूजा गीत', 'ऋतु एवं उत्सव गीत', 'दीवाली / गोधन गीत', 'होरी / फाग गीत', 'श्रम व लोकोक्ति गीत', 'विदाई एवं करुण गीत'];

    // 1. Shabdkosh Questions - Ensure ALL shabdkosh items are included
    const validShabdkosh = (shabdkoshList || []).filter(s => s.word_pawari && s.meaning_hindi);
    validShabdkosh.forEach((item, idx) => {
      let distractors = validShabdkosh
        .filter(s => s.id !== item.id && s.meaning_hindi !== item.meaning_hindi)
        .map(s => s.meaning_hindi);
      
      if (distractors.length < 3) {
        const extra = defaultShabdkoshDistractors.filter(d => d !== item.meaning_hindi && !distractors.includes(d));
        distractors = [...distractors, ...extra];
      }
      const picked = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
      dynamicList.push({
        id: `dyn_shabd_${item.id}_${idx}`,
        question_pawari: `पवारी शब्द '${item.word_pawari}' का सही हिंदी अर्थ क्या है?`,
        question_hindi: `पवारी शब्द '${item.word_pawari}' का सही हिंदी अर्थ क्या है?`,
        options: [item.meaning_hindi, ...picked],
        correct_option_index: 0,
        explanation: `'${item.word_pawari}' का प्रामाणिक हिंदी अर्थ '${item.meaning_hindi}' है।`,
        section_type: 'shabdkosh'
      });
    });

    // 2. Paheli (Pahlodi) Questions - Ensure ALL paheli items are included
    const validPaheli = (paheliList || []).filter(p => p.riddle_pawari && p.answer_hindi);
    validPaheli.forEach((item, idx) => {
      let distractors = validPaheli
        .filter(p => p.id !== item.id && p.answer_hindi !== item.answer_hindi)
        .map(p => p.answer_hindi);

      if (distractors.length < 3) {
        const extra = defaultPaheliDistractors.filter(d => d !== item.answer_hindi && !distractors.includes(d));
        distractors = [...distractors, ...extra];
      }
      const picked = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
      dynamicList.push({
        id: `dyn_pah_${item.id}_${idx}`,
        question_pawari: `पवारी पहेली (पाहलोड़ी): "${item.riddle_pawari}" का सही उत्तर क्या है?`,
        question_hindi: `पवारी पहेली (पाहलोड़ी): "${item.riddle_pawari}" का सही उत्तर क्या है?`,
        options: [item.answer_hindi, ...picked],
        correct_option_index: 0,
        explanation: `इस पवारी पहेली का सही उत्तर '${item.answer_hindi}' है।${item.hint_hindi ? ' संकेत: ' + item.hint_hindi : ''}`,
        section_type: 'paheli'
      });
    });

    // 3. Lokgeet Questions - Ensure ALL lokgeet items are included
    const validLokgeet = (lokgeetList || []).filter(l => l.title_pawari);
    validLokgeet.forEach((song, idx) => {
      const songCat = song.category || 'विवाह गीत';
      const wrongCats = standardCategories.filter(c => c !== songCat).sort(() => 0.5 - Math.random()).slice(0, 3);
      dynamicList.push({
        id: `dyn_lok_${song.id}_${idx}`,
        question_pawari: `पवारी लोकगीत '${song.title_pawari}' किस श्रेणी का प्रामाणिक लोकगीत है?`,
        question_hindi: `पवारी लोकगीत '${song.title_pawari}' किस श्रेणी का प्रामाणिक लोकगीत है?`,
        options: [songCat, ...wrongCats],
        correct_option_index: 0,
        explanation: `'${song.title_pawari}' ${songCat} श्रेणी का पवारी लोकगीत है।`,
        section_type: 'lokgeet'
      });
    });

    // 4. Writers / Authors Questions
    const validWriters = (writers || []).filter(w => w.name_hindi);
    validWriters.forEach((w, idx) => {
      const bookOrSpec = w.published_books?.[0] || w.specialization_hindi || w.designation_hindi || 'पवारी साहित्य व भाषा संवर्धन';
      const wrongNames = ['डॉ. मोहन लाल गुप्ता', 'श्री रामेश्वर शर्मा', 'प्रो. अनिता मालवीय', 'डॉ. रमेश पंवार', 'डॉ. कैलाश पवार']
        .filter(n => n !== w.name_hindi)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      dynamicList.push({
        id: `dyn_wri_${w.id}_${idx}`,
        question_pawari: `पवारी लोकसाहित्य में '${bookOrSpec}' कार्य हेतु जाने जाने वाले प्रसिद्ध साहित्यकार कौन हैं?`,
        question_hindi: `पवारी लोकसाहित्य में '${bookOrSpec}' कार्य हेतु जाने जाने वाले प्रसिद्ध साहित्यकार कौन हैं?`,
        options: [w.name_hindi, ...wrongNames],
        correct_option_index: 0,
        explanation: `'${w.name_hindi}' पवारी भाषा व संस्कृति के प्रतिष्ठित साहित्यकार हैं।`,
        section_type: 'writers'
      });
    });

    // 5. Research Papers (शोध पत्र व आलेख) Questions
    const validArticles = (articles || []).filter(a => a.title_hindi);
    validArticles.forEach((art, idx) => {
      const authorName = art.authors?.[0]?.name || 'डॉ. कैलाश पवार';
      const wrongAuthors = ['डॉ. मोहन लाल गुप्ता', 'श्री रामेश्वर शर्मा', 'प्रो. अनिता मालवीय', 'डॉ. रमेश पंवार']
        .filter(n => n !== authorName)
        .slice(0, 3);

      dynamicList.push({
        id: `dyn_art_${art.id}_${idx}`,
        question_pawari: `पवारी शोध पत्रिका में प्रकाशित शोध पत्र '${art.title_hindi}' के लेखक/शोधकर्ता कौन हैं?`,
        question_hindi: `पवारी शोध पत्रिका में प्रकाशित शोध पत्र '${art.title_hindi}' के लेखक/शोधकर्ता कौन हैं?`,
        options: [authorName, ...wrongAuthors],
        correct_option_index: 0,
        explanation: `शोध पत्र '${art.title_hindi}' के लेखक ${authorName} हैं।`,
        section_type: 'articles'
      });
    });

    // 6. Books Questions
    const validBooks = (books || []).filter(b => b.title_hindi);
    validBooks.forEach((b, idx) => {
      const authorName = b.author || 'माँ ताप्ती पवारी शोध संस्थान';
      const wrongAuthors = ['डॉ. कैलाश पवार', 'डॉ. रमेश पंवार', 'प्रो. अनिता मालवीय', 'श्री रामेश्वर शर्मा']
        .filter(n => n !== authorName)
        .slice(0, 3);

      dynamicList.push({
        id: `dyn_bk_${b.id}_${idx}`,
        question_pawari: `पवारी ग्रन्थ/पुस्तक '${b.title_hindi}' के लेखक / संपादक कौन हैं?`,
        question_hindi: `पवारी ग्रन्थ/पुस्तक '${b.title_hindi}' के लेखक / संपादक कौन हैं?`,
        options: [authorName, ...wrongAuthors],
        correct_option_index: 0,
        explanation: `पुस्तक '${b.title_hindi}' के लेखक/संपादक ${authorName} हैं।`,
        section_type: 'books'
      });
    });

    // Combine static stored questions, dynamic questions and fallback set
    let pool = [
      ...(quizQuestions || []),
      ...dynamicList,
      ...FALLBACK_QUIZ_QUESTIONS
    ];

    // Filter by category if selected
    if (catFilter !== 'all') {
      pool = pool.filter(q => q.section_type === catFilter);
    }

    // Shuffle pool order
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

    // Slice according to limit
    const finalPool = (limit === 'all' || limit <= 0) ? shuffledPool : shuffledPool.slice(0, limit);

    // Shuffle options for each question so correct option is NOT stuck at A
    return finalPool.map(q => shuffleQuestionOptions(q));
  }, [shabdkoshList, paheliList, lokgeetList, quizQuestions, writers, books, articles, selectedQuizCategory, quizQuestionLimit]);

  const handleQuizFilterChange = (cat: string, limit: number | 'all') => {
    setSelectedQuizCategory(cat);
    setQuizQuestionLimit(limit);
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setActiveQuizQuestions(generateFreshQuizQuestions(cat, limit));
  };

  const [activeQuizQuestions, setActiveQuizQuestions] = React.useState<QuizQuestion[]>([]);

  React.useEffect(() => {
    setActiveQuizQuestions(generateFreshQuizQuestions());
  }, [generateFreshQuizQuestions]);

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
    const trimmedName = userName ? userName.trim() : '';
    if (!trimmedName) {
      alert('⚠️ कृपया प्रमाण-पत्र प्राप्त करने के लिए अपना शुभ नाम दर्ज करें। (नाम लिखना अनिवार्य है)');
      const nameInput = document.getElementById('participant-name-input');
      if (nameInput) {
        nameInput.focus();
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const questionsToGrade = activeQuizQuestions.length > 0 
      ? activeQuizQuestions 
      : ((quizQuestions && quizQuestions.length > 0) ? quizQuestions.slice(0, 10) : FALLBACK_QUIZ_QUESTIONS.slice(0, 10));

    let score = 0;
    questionsToGrade.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option_index) {
        score += 1;
      }
    });

    const totalQ = questionsToGrade.length || 10;
    const percentage = Math.round((score / totalQ) * 100);
    const certNo = 'PCH-' + Math.floor(100000 + Math.random() * 900000);

    const cert: QuizCertificate = {
      id: certNo,
      user_name: trimmedName,
      user_photo_url: userPhoto,
      quiz_score: score,
      total_questions: totalQ,
      percentage,
      issued_date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificate_no: certNo
    };

    setCertificateData(cert);
    setIsQuizSubmitted(true);

    if (saveQuizCertificate) {
      try {
        saveQuizCertificate(cert);
      } catch (err) {
        console.error('Error saving quiz certificate:', err);
      }
    }
  };

  const handleResetQuiz = () => {
    setActiveQuizQuestions(generateFreshQuizQuestions());
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
        <div className="space-y-6">
          {selectedShabdkosh ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-amber-100 relative animate-in fade-in duration-300">
              {/* Top Navigation / Breadcrumb Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
                <button
                  type="button"
                  onClick={handleCloseShabdkosh}
                  className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-600/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>← शब्दकोश सूची पर लौटें (Back to List)</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => handleShareShabdkoshWhatsApp(selectedShabdkosh, e)}
                    className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleCopyShabdkoshLink(selectedShabdkosh, e)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedShabdkoshId === selectedShabdkosh.id ? 'कॉपी हुआ ✓' : 'डायरेक्ट लिंक'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Link Chip */}
              <div className="bg-amber-950/60 border border-amber-800/50 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-amber-300">
                <div className="flex items-center space-x-2 truncate">
                  <Link2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">डायरेक्ट शब्द यूआरएल:</span>
                  <span className="text-slate-300 truncate">{window.location.origin}/shabdkosh/{selectedShabdkosh.slug || selectedShabdkosh.id}</span>
                </div>
              </div>

              {/* Shabdkosh Word Content */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {selectedShabdkosh.image_url && (
                  <div className="w-full md:w-56 aspect-4/3 shrink-0 rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shadow-lg">
                    <SafeImage
                      src={selectedShabdkosh.image_url}
                      alt={selectedShabdkosh.word_pawari}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-900/80 text-amber-200 border border-amber-600/40 font-mono">
                      📚 श्रेणी: {selectedShabdkosh.category}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black text-amber-200 tracking-wide">
                      {selectedShabdkosh.word_pawari}
                    </h2>
                    {selectedShabdkosh.pronunciation_hindi && (
                      <p className="text-sm text-amber-400/90 italic mt-1">
                        उच्चारण: [{selectedShabdkosh.pronunciation_hindi}]
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-900/40 space-y-2">
                    <h4 className="text-xs font-bold uppercase font-mono text-amber-400 tracking-wider">हिंदी अर्थ</h4>
                    <p className="text-base sm:text-lg font-semibold text-amber-100 leading-relaxed">
                      {selectedShabdkosh.meaning_hindi}
                    </p>
                    {selectedShabdkosh.meaning_english && (
                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-xs font-mono text-slate-400">English Meaning: </span>
                        <span className="text-xs text-slate-300">{selectedShabdkosh.meaning_english}</span>
                      </div>
                    )}
                  </div>

                  {selectedShabdkosh.example_pawari && (
                    <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-800/30 space-y-1.5">
                      <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">वाक्य प्रयोग (Sentence Usage)</h4>
                      <p className="text-sm italic font-serif text-amber-200">
                        "{selectedShabdkosh.example_pawari}"
                      </p>
                      {selectedShabdkosh.example_hindi && (
                        <p className="text-xs text-amber-300/70 not-italic">
                          हिंदी अनुवाद: ({selectedShabdkosh.example_hindi})
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 text-xs text-amber-400/60 font-mono">
                    प्रस्तुति / योगदानकर्ता: <strong className="text-amber-300">{selectedShabdkosh.contributor_name || 'माँ ताप्ती शोध संस्थान'}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShabdkosh.map((item) => (
                <div 
                  key={item.id}
                  onClick={(e) => handleOpenShabdkosh(item, e)}
                  className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
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

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="text-2xl font-black text-amber-200 font-serif tracking-wide group-hover:text-amber-300 transition">
                          {item.word_pawari}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleCopyShabdkoshLink(item, e)}
                          className="p-1.5 bg-slate-950 hover:bg-amber-900 text-amber-400 border border-amber-700/50 rounded-lg transition shrink-0"
                          title="डायरेक्ट पेज लिंक कॉपी करें"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
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

                    <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 flex justify-between items-center">
                      <span>प्रस्तुति: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                      <span className="text-amber-400 font-bold group-hover:underline flex items-center space-x-0.5">
                        <span>विस्तार देखें ↗</span>
                      </span>
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
        </div>
      )}

      {/* 2. PAHELI VIEW */}
      {activeTab === 'paheli' && (
        <div className="space-y-6">
          {selectedPaheli ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-amber-100 relative animate-in fade-in duration-300">
              {/* Top Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
                <button
                  type="button"
                  onClick={handleClosePaheli}
                  className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-600/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>← पहेली सूची पर लौटें (Back to List)</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => handleSharePaheliWhatsApp(selectedPaheli, e)}
                    className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleCopyPaheliLink(selectedPaheli, e)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedPaheliId === selectedPaheli.id ? 'कॉपी हुआ ✓' : 'डायरेक्ट लिंक'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Link Chip */}
              <div className="bg-amber-950/60 border border-amber-800/50 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-amber-300">
                <div className="flex items-center space-x-2 truncate">
                  <Link2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">डायरेक्ट पहेली यूआरएल:</span>
                  <span className="text-slate-300 truncate">{window.location.origin}/paheli/{selectedPaheli.slug || selectedPaheli.id}</span>
                </div>
              </div>

              {/* Paheli Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-900/80 text-amber-200 border border-amber-600/40 font-mono">
                    🧩 {selectedPaheli.category}
                  </span>
                  <span className="text-xs text-amber-400/70 italic font-mono">पवारी बुझौवल</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {selectedPaheli.image_url && (
                    <div className="w-full md:w-56 aspect-square shrink-0 rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shadow-lg">
                      <SafeImage
                        src={selectedPaheli.image_url}
                        alt="पहेली चित्र"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4 flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 leading-relaxed">
                      "{selectedPaheli.riddle_pawari}"
                    </h2>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => togglePaheliAnswer(selectedPaheli.id)}
                        className="w-full sm:w-auto px-5 py-3 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-500/50 rounded-2xl text-xs font-bold transition flex items-center justify-between gap-3 cursor-pointer shadow-md"
                      >
                        <span>उत्तर बुझो / उत्तर देखें (Reveal Answer)</span>
                        {revealedPaheli[selectedPaheli.id] ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                      </button>

                      {revealedPaheli[selectedPaheli.id] && (
                        <div className="mt-4 p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl space-y-1 text-emerald-100 animate-in fade-in duration-200">
                          <p className="text-xs font-bold text-emerald-400 font-mono uppercase">✅ पहेली का सही उत्तर:</p>
                          <p className="text-lg font-serif font-black text-emerald-200">
                            {selectedPaheli.answer_hindi} {selectedPaheli.answer_pawari ? `(${selectedPaheli.answer_pawari})` : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 text-xs text-amber-400/60 font-mono">
                      योगदानकर्ता: <strong className="text-amber-300">{selectedPaheli.contributor_name || 'माँ ताप्ती शोध संस्थान'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPaheli.map((item) => {
                const isRevealed = revealedPaheli[item.id];
                return (
                  <div 
                    key={item.id}
                    onClick={(e) => handleOpenPaheli(item, e)}
                    className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all p-6 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-amber-900/20 pb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                          {item.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => handleCopyPaheliLink(item, e)}
                            className="p-1 bg-slate-950 hover:bg-amber-900 text-amber-400 border border-amber-700/50 rounded-lg transition"
                            title="डायरेक्ट लिंक कॉपी करें"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs text-amber-400/60 italic">पवारी बुझौवल</span>
                        </div>
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
                          <h3 className="text-xl font-bold text-amber-100 font-serif leading-relaxed mb-3 group-hover:text-amber-300 transition">
                            "{item.riddle_pawari}"
                          </h3>
                        </div>
                      </div>

                      {/* Interactive Answer Reveal & Share Controls */}
                      <div className="mt-5 pt-3 border-t border-amber-900/30 space-y-2.5">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePaheliAnswer(item.id);
                            }}
                            className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-950 hover:bg-slate-950/80 rounded-xl border border-amber-900/40 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                          >
                            <span>उत्तर बुझो / उत्तर देखें (Reveal)</span>
                            {isRevealed ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleSharePaheliWhatsApp(item, e)}
                            title="व्हाट्सएप पर शेयर करें"
                            className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Share2 className="w-4 h-4 text-emerald-400" />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-700/50 text-xs text-amber-200 animate-in fade-in duration-200">
                            <span className="font-bold text-amber-400">✅ उत्तर: </span>
                            <span>{item.answer_hindi}</span>
                            {item.answer_pawari && <span className="text-amber-300/80 ml-1">({item.answer_pawari})</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                      <span>योगदान: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                      <span className="text-amber-400 font-bold group-hover:underline">
                        विस्तार देखें ↗
                      </span>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Sub-tab Navigation: Take Quiz vs Top Scorer Leaderboard */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-amber-500/40 p-2 rounded-2xl shadow-xl gap-2">
            <button
              onClick={() => setQuizSubTab('quiz')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                quizSubTab === 'quiz'
                  ? 'bg-amber-500 text-amber-950 shadow-md'
                  : 'text-amber-200 hover:bg-amber-950/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>📋 ई-क्विज़ परीक्षा (Take Quiz)</span>
            </button>

            <button
              onClick={() => setQuizSubTab('leaderboard')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                quizSubTab === 'leaderboard'
                  ? 'bg-amber-500 text-amber-950 shadow-md'
                  : 'text-amber-200 hover:bg-amber-950/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-950" />
              <span>🏆 टॉप स्कोरर लीडरबोर्ड ({quizLeaderboard?.length || 0})</span>
            </button>
          </div>

          {/* LEADERBOARD SUB-TAB VIEW */}
          {quizSubTab === 'leaderboard' ? (
            <div className="space-y-6">
              {/* Leaderboard Banner */}
              <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/40 rounded-3xl p-6 text-amber-100 text-center space-y-3 shadow-2xl relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>पवारी भोयरी संस्कृति ज्ञान प्रतियोगिता</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-200 font-serif">
                  टॉप स्कोरर लीडरबोर्ड (Top Scorers Leaderboard)
                </h3>
                <p className="text-xs sm:text-sm text-amber-300/80 max-w-xl mx-auto">
                  निष्पक्ष परीक्षा में सर्वोच्च अंक प्राप्त करने वाले शीर्ष विद्वान प्रतिभागियों की सूची।
                </p>

                {/* Search Bar for Leaderboard */}
                <div className="pt-2 max-w-md mx-auto relative">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="प्रतिभागी का नाम या प्रमाण-पत्र क्रमांक खोजें..."
                    value={leaderboardSearch}
                    onChange={(e) => setLeaderboardSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/90 border border-amber-600/50 rounded-xl text-amber-100 text-xs placeholder:text-amber-400/50 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Top 3 Winner Podium Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quizLeaderboard.slice(0, 3).map((item, index) => {
                  const ranks = [
                    { title: 'प्रथम स्थान (Rank 1)', badge: '🥇', color: 'from-amber-500 to-amber-300 text-amber-950 border-amber-400' },
                    { title: 'द्वितीय स्थान (Rank 2)', badge: '🥈', color: 'from-slate-300 to-slate-100 text-slate-950 border-slate-300' },
                    { title: 'तृतीय स्थान (Rank 3)', badge: '🥉', color: 'from-amber-700 to-amber-600 text-amber-100 border-amber-600' }
                  ];
                  const rank = ranks[index];
                  return (
                    <div key={item.id} className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 text-center space-y-3 relative shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r ${rank.color} shadow-lg`}>
                          <span>{rank.badge}</span>
                          <span>{rank.title}</span>
                        </div>

                        <div className="relative w-20 h-20 mx-auto">
                          {item.user_photo_url ? (
                            <img
                              src={item.user_photo_url}
                              alt={item.user_name}
                              className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-xl font-bold">
                              {item.user_name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 p-1 rounded-full shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-amber-100 text-base line-clamp-1">{item.user_name}</h4>
                          <p className="text-[11px] text-amber-300/70 font-mono mt-0.5">{item.issued_date}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-amber-900/40 bg-amber-950/40 rounded-2xl p-2.5 text-xs">
                        <div className="flex justify-between items-center text-amber-200">
                          <span>प्राप्तांक:</span>
                          <strong className="text-amber-400 font-bold">{item.quiz_score}/{item.total_questions} ({item.percentage}%)</strong>
                        </div>
                        <div className="text-[10px] text-amber-400/60 font-mono mt-1 text-right">
                          {item.certificate_no}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Participant Leaderboard List */}
              <div className="bg-slate-900/90 border border-amber-800/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
                  <h4 className="font-serif font-bold text-amber-200 text-lg flex items-center gap-2">
                    <Medal className="w-5 h-5 text-amber-400" />
                    समस्त प्रतिभागी सूची (Full Scorers List)
                  </h4>
                  <span className="text-xs text-amber-400/80 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
                    कुल प्रतिभागी: {quizLeaderboard.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                  {quizLeaderboard
                    .filter(item => 
                      item.user_name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
                      item.certificate_no.toLowerCase().includes(leaderboardSearch.toLowerCase())
                    )
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-slate-950/70 border border-amber-900/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-amber-700/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-amber-300'
                          }`}>
                            #{idx + 1}
                          </span>

                          {item.user_photo_url ? (
                            <img src={item.user_photo_url} alt={item.user_name} className="w-9 h-9 rounded-full object-cover border border-amber-500/50 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0">
                              {item.user_name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <h5 className="font-semibold text-amber-100 text-xs sm:text-sm">{item.user_name}</h5>
                            <p className="text-[10px] text-amber-400/60 font-mono">क्रमांक: {item.certificate_no} • {item.issued_date}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                            {item.quiz_score}/{item.total_questions} ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setQuizSubTab('quiz');
                      handleResetQuiz();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>स्वयं क्विज़ दें और लीडरबोर्ड में स्थान पाएँ ➔</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAKE QUIZ OR VIEW CERTIFICATE SUB-TAB */
            <div className="space-y-6">
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
                    अपनी पवारी भाषा एवं संस्कृति ज्ञान की परीक्षा लें। अपने मित्रों व समूह में क्विज़ लिंक शेयर करें!
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
                          आपका पूरा नाम (Full Name) <span className="text-red-400 font-bold">* अनिवार्य</span>
                        </label>
                        <input
                          id="participant-name-input"
                          type="text"
                          placeholder="जैसे: रूपेश पवार / अनिता मालवीय"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className={`w-full px-3.5 py-2 bg-slate-950 border rounded-xl text-amber-100 text-sm focus:outline-none transition-all ${
                            !userName.trim() ? 'border-red-500/80 focus:border-red-400 bg-red-950/20' : 'border-amber-900/50 focus:border-amber-500'
                          }`}
                          required
                        />
                        {!userName.trim() && (
                          <p className="text-[11px] text-red-400 mt-1 font-semibold flex items-center gap-1">
                            ⚠️ प्रमाण-पत्र प्राप्त करने के लिए अपना नाम यहाँ लिखें।
                          </p>
                        )}
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

                  {/* Category & Question Count Filter Bar */}
                  <div className="mb-6 p-4 bg-slate-950/80 border border-amber-800/40 rounded-2xl space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                          <span>🎯 क्विज़ विषय श्रेणी चुनें (Select Quiz Domain)</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', label: '🌟 सभी विषय (All)' },
                            { id: 'shabdkosh', label: `📖 शब्दकोश (${(shabdkoshList || []).length})` },
                            { id: 'paheli', label: `🧩 पहेली (पाहलोड़ी) (${(paheliList || []).length})` },
                            { id: 'lokgeet', label: `🎵 लोकगीत (${(lokgeetList || []).length})` },
                            { id: 'writers', label: `✒️ साहित्यकार (${(writers || []).length})` },
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleQuizFilterChange(cat.id, quizQuestionLimit)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                                selectedQuizCategory === cat.id
                                  ? 'bg-amber-500 text-amber-950 font-bold shadow-md scale-102'
                                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-800/40'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 border-t md:border-t-0 md:border-l border-amber-800/30 pt-2.5 md:pt-0 md:pl-4">
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                          📊 कुल प्रश्न संख्या (Questions Limit)
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 10, label: '10 प्रश्न' },
                            { id: 20, label: '20 प्रश्न' },
                            { id: 50, label: '50 प्रश्न' },
                            { id: 'all', label: '♾️ सभी प्रश्न' },
                          ].map((lim) => (
                            <button
                              key={lim.id}
                              type="button"
                              onClick={() => handleQuizFilterChange(selectedQuizCategory, lim.id as number | 'all')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                quizQuestionLimit === lim.id
                                  ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/50'
                              }`}
                            >
                              {lim.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Header & Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-900/30">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                          प्रश्न {currentQIndex + 1} / {activeQuizQuestions.length}
                        </span>

                        {activeQuizQuestions[currentQIndex]?.section_type && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {activeQuizQuestions[currentQIndex]?.section_type === 'shabdkosh' ? '📖 शब्दकोश' :
                             activeQuizQuestions[currentQIndex]?.section_type === 'paheli' ? '🧩 पहेली (पाहलोड़ी)' :
                             activeQuizQuestions[currentQIndex]?.section_type === 'lokgeet' ? '🎵 लोकगीत' :
                             activeQuizQuestions[currentQIndex]?.section_type === 'writers' ? '✒️ साहित्यकार' :
                             activeQuizQuestions[currentQIndex]?.section_type === 'articles' ? '📜 शोध पत्र' : '📚 ग्रन्थ/पुस्तक'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-amber-100 font-serif">
                        {activeQuizQuestions[currentQIndex]?.question_pawari}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleResetQuiz}
                        title="नये रैंडम प्रश्न लोड करें"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-700/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>नये प्रश्न</span>
                      </button>

                      <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-600/50 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
                        {currentQIndex + 1}/{activeQuizQuestions.length}
                      </div>
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
                        onClick={handleDownloadCertificatePdf}
                        disabled={isGeneratingImage}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all border border-amber-300"
                      >
                        {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-amber-950" />}
                        <span>सर्टिफिकेट A4 Size PDF डाउनलोड करें</span>
                      </button>

                      <button
                        onClick={handleDownloadCertificateImage}
                        disabled={isGeneratingImage}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs sm:text-sm shadow-md border border-amber-700/60 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 text-amber-400" />}
                        <span>HD इमेज (PNG) डाउनलोड करें</span>
                      </button>

                      <button
                        onClick={handleShareCertificateImage}
                        disabled={isGeneratingImage}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                        <span>सर्टिफिकेट इमेज + क्विज़ लिंक शेयर करें</span>
                      </button>

                      <button
                        onClick={handlePrintCertificate}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-700/60 text-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>A4 प्रिंट</span>
                      </button>

                      <button
                        onClick={() => setQuizSubTab('leaderboard')}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>लीडरबोर्ड देखें</span>
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

                  {/* HIGH-RES PRESTIGIOUS ELEGANT LIGHT VISUAL CERTIFICATE TEMPLATE */}
                  <div className="printable-certificate print:m-0 print:p-0 print:shadow-none transition-all" id="printable-certificate-card">
                    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FAF5E8] to-[#F5EEDC] border-[10px] border-double border-[#B45309] p-8 sm:p-12 md:p-16 rounded-3xl text-slate-900 relative shadow-2xl font-serif text-center overflow-hidden">
                      
                      {/* Subtle Background Watermark Text */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none font-black text-6xl md:text-8xl text-amber-900 uppercase tracking-widest leading-none rotate-[-12deg]">
                        माँ ताप्ती पवारी शोध संस्थान 2026
                      </div>

                  {/* Inner Fine Gold Line Frame */}
                  <div className="absolute inset-3 border border-amber-600/40 rounded-2xl pointer-events-none" />

                  {/* Decorative Filigree Corner Ornaments */}
                  <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-700/80 flex items-start justify-start p-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-700/80 flex items-start justify-end p-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-700/80 flex items-end justify-start p-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-700/80 flex items-end justify-end p-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </div>

                  {/* Top Institution Banner */}
                  <div className="relative z-10 space-y-2 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-400 text-amber-950 font-sans text-xs font-bold uppercase tracking-widest shadow-sm">
                      <Award className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>🚩 माँ ताप्ती पवारी शोध संस्थान, मुलताई (बैतूल) • म.प्र. 🚩</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] tracking-wide drop-shadow-sm font-serif">
                      राष्ट्रीय पवारी संस्कृति ई-प्रमाण-पत्र
                    </h2>

                    <p className="text-xs sm:text-sm text-amber-800/90 font-sans tracking-wide uppercase font-semibold">
                      NATIONAL E-CERTIFICATE OF CULTURAL & LINGUISTIC EXCELLENCE
                    </p>
                  </div>

                  {/* Grade & Score Badge Ribbon */}
                  <div className="relative z-10 my-4 inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-amber-100/80 border border-amber-300 shadow-md">
                    <div className="text-left font-sans">
                      <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">परिणाम / Grade:</p>
                      <p className="text-sm font-bold text-amber-950">
                        {certificateData?.percentage >= 90 ? 'उत्कृष्ट श्रेणी (Grade A+ Distinction)' : 'प्रथम श्रेणी (Grade A)'}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-amber-400/60" />
                    <div className="text-right font-sans">
                      <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">प्राप्तांक / Score:</p>
                      <p className="text-sm font-bold text-amber-900">
                        {certificateData?.quiz_score} / {certificateData?.total_questions} ({certificateData?.percentage}%)
                      </p>
                    </div>
                  </div>

                  {/* Candidate Photo & Award Citation */}
                  <div className="relative z-10 my-6 space-y-4">
                    {certificateData?.user_photo_url ? (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto overflow-hidden border-4 border-amber-500 shadow-xl bg-amber-100 ring-4 ring-amber-300/50">
                        <img 
                          src={certificateData.user_photo_url} 
                          alt={certificateData.user_name} 
                          crossOrigin={certificateData.user_photo_url.startsWith('http') ? 'anonymous' : undefined}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 p-1 shadow-xl border-2 border-amber-300 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                          <Award className="w-12 h-12 text-amber-700" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <p className="text-xs text-amber-900/80 font-sans uppercase tracking-widest font-semibold">
                        यह प्रमाण-पत्र ससम्मान प्रदान किया जाता है (Presented To):
                      </p>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#881337] tracking-wide underline decoration-amber-500/80 underline-offset-8 py-1 drop-shadow-sm font-serif">
                        {certificateData?.user_name}
                      </h3>
                    </div>
                  </div>

                  {/* Formal Citation Text */}
                  <p className="relative z-10 text-sm sm:text-base md:text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed my-5 font-serif font-normal bg-white/80 p-4 rounded-2xl border border-amber-300/80 shadow-sm">
                    जिन्होंने माँ ताप्ती पवारी शोध संस्थान द्वारा आयोजित <strong className="text-amber-900 font-bold">पवारी भोयरी संस्कृति ज्ञान ई-परीक्षा</strong> में 
                    <strong className="text-amber-900 font-bold mx-1.5 underline decoration-amber-600">{certificateData?.percentage}% अंक</strong> प्राप्त कर सफलता अर्जित की है तथा पवारी भाषा, लोकगीत, पहेली एवं शब्दकोश संवर्धन में सराहनीय योगदान दिया है।
                  </p>

                  {/* Seal, Verification Code & Official Signatures */}
                  <div className="relative z-10 mt-8 pt-6 border-t-2 border-amber-400/50 space-y-6 font-sans text-xs">
                    
                    {/* Dual Signatures & Seal Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-6">
                      
                      {/* Chief Editor Signature (मुख्य संपादक) */}
                      <div className="text-center md:text-left space-y-1">
                        <div className="inline-block border-b-2 border-amber-800/60 pb-1 mb-1 font-serif text-base font-extrabold text-amber-950 px-2">
                          {chiefEditorMember ? (lang === 'hi' ? chiefEditorMember.name_hindi : chiefEditorMember.name_english) : 'प्रो. (डॉ.) रमाकांत शर्मा'}
                        </div>
                        <p className="text-amber-950 font-bold text-xs">
                          {chiefEditorMember ? (lang === 'hi' ? (chiefEditorMember.designation_hindi || chiefEditorMember.role || 'मुख्य संपादक') : (chiefEditorMember.designation_english || chiefEditorMember.role || 'Chief Editor')) : 'मुख्य संपादक'}
                        </p>
                        <p className="text-amber-900/90 text-[11px] font-medium max-w-xs mx-auto md:mx-0">
                          {chiefEditorMember ? (lang === 'hi' ? (chiefEditorMember.affiliation_hindi || 'पवारी शोध पत्रिका') : (chiefEditorMember.affiliation_english || 'Pawari Shodh Patrika')) : 'पवारी शोध पत्रिका'}
                        </p>
                      </div>

                      {/* Center: Official Seal & Verification Details */}
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="relative group shrink-0">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-200 text-amber-950 p-1 shadow-xl border-4 border-amber-100 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/60 p-1 flex flex-col items-center justify-center text-center bg-amber-300/90 shadow-inner">
                              <Award className="w-5 h-5 text-amber-950 mb-0.5" />
                              <span className="text-[8px] font-black uppercase tracking-tight leading-none text-amber-950">
                                माँ ताप्ती पवारी
                              </span>
                              <span className="text-[7px] font-bold text-amber-900 uppercase">
                                शोध संस्थान 2026
                              </span>
                              <span className="text-[6px] font-black text-amber-950 mt-0.5 border-t border-amber-800/40 pt-0.5 w-full">
                                ★ आधिकारिक मोहर ★
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center space-y-0.5">
                          <div className="inline-block bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-lg shadow-2xs">
                            <p className="text-amber-950 font-mono font-bold text-[11px]">
                              प्रमाण-पत्र क्र.: PST-2026-QUIZ-{certificateData?.certificate_no}
                            </p>
                            <p className="text-amber-900/80 text-[10px]">
                              जारी तिथि: {certificateData?.issued_date}
                            </p>
                          </div>
                          <p className="text-[9px] text-amber-800/80 font-mono uppercase tracking-wider block font-semibold">
                            Verifiable Official Digital E-Certificate
                          </p>
                        </div>
                      </div>

                      {/* Patron / Director Signature (संरक्षक / निदेशक) */}
                      <div className="text-center md:text-right space-y-1">
                        <div className="inline-block border-b-2 border-amber-800/60 pb-1 mb-1 font-serif text-base font-extrabold text-amber-950 px-2">
                          {patronMember ? (lang === 'hi' ? patronMember.name_hindi : patronMember.name_english) : 'डॉ. बी. एल. पवार'}
                        </div>
                        <p className="text-amber-950 font-bold text-xs">
                          {patronMember ? (lang === 'hi' ? (patronMember.designation_hindi || patronMember.role || 'संरक्षक / निदेशक') : (patronMember.designation_english || patronMember.role || 'Patron & Director')) : 'संरक्षक एवं संस्थापक निदेशक'}
                        </p>
                        <p className="text-amber-900/90 text-[11px] font-medium max-w-xs mx-auto md:ml-auto md:mr-0">
                          {patronMember ? (lang === 'hi' ? (patronMember.affiliation_hindi || 'माँ ताप्ती पवारी शोध संस्थान, मुलताई') : (patronMember.affiliation_english || 'Maa Tapti Pawari Research Institute, Multai')) : 'माँ ताप्ती पवारी शोध संस्थान, मुलताई'}
                        </p>
                      </div>

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
