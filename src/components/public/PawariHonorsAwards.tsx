import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  User, 
  BookOpen, 
  Medal, 
  Star,
  Printer,
  ChevronRight
} from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

export interface HonorAwardItem {
  id: string;
  title_hindi: string;
  title_english: string;
  category: 'lifetime' | 'folklore' | 'poetry' | 'preservation' | 'youth';
  category_name_hindi: string;
  year: number;
  awardee_hindi: string;
  awardee_english: string;
  awardee_title_hindi: string;
  awardee_image: string;
  awardee_location_hindi: string;
  citation_hindi: string;
  citation_english: string;
  key_contributions_hindi: string[];
  awarding_body_hindi: string;
  badge_color: string;
}

export const PAWARI_HONORS_DATA: HonorAwardItem[] = [
  {
    id: 'award-1',
    title_hindi: 'माँ ताप्ती साहित्य शिखर सम्मान (जीवन पर्यन्त साधना)',
    title_english: 'Maa Tapti Lifetime Achievement Award in Pawari Literature',
    category: 'lifetime',
    category_name_hindi: 'शिखर सम्मान',
    year: 2025,
    awardee_hindi: 'डॉ. कैलाश पवार',
    awardee_english: 'Dr. Kailash Pawar',
    awardee_title_hindi: 'वरिष्ठ पवारी भाषाविद् एवं शोध निदेशक',
    awardee_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    awardee_location_hindi: 'मुलताई (जिला बैतूल, म.प्र.)',
    citation_hindi: 'पवारी बोली के ध्वनिविज्ञान, व्याकरण, एवं 15,000 प्रविष्टियों वाले त्रिभाषीय बृहत् शब्दकोश के निर्माण तथा 25 वर्षों के अनवरत शोध एवं भाषा संरक्षण के लिए सर्वोच्च शिखर सम्मान।',
    citation_english: 'For monumental contributions towards Pawari phonology, grammar, trilingual dictionary compilation, and 25 years of relentless research.',
    key_contributions_hindi: [
      'पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास (384 पृष्ठ) का प्रणयन',
      'पवारी-हिंदी-अंग्रेजी बृहत् त्रिभाषीय शब्दकोश का मुख्य संपादन',
      'माँ ताप्ती शोध संस्थान, मुलताई की स्थापना एवं शोध पत्रिका का मार्गदर्शन'
    ],
    awarding_body_hindi: 'माँ ताप्ती शोध संस्थान, मुलताई एवं पवारी साहित्य अकादमी मंडल',
    badge_color: 'from-amber-600 to-yellow-500'
  },
  {
    id: 'award-2',
    title_hindi: 'सतपुड़ा लोकसाहित्य गौरव सम्मान',
    title_english: 'Satpura Folklore Prestige Award',
    category: 'folklore',
    category_name_hindi: 'लोकसाहित्य गौरव',
    year: 2024,
    awardee_hindi: 'प्रो. रामेश्वर शर्मा',
    awardee_english: 'Prof. Rameshwar Sharma',
    awardee_title_hindi: 'मूर्धन्य लोकसंस्कृतिविद् एवं प्राध्यापक',
    awardee_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    awardee_location_hindi: 'छिंदवाड़ा एवं नागपुर अंचल',
    citation_hindi: 'सतपुड़ा की विस्तृत उपत्यकाओं से लुप्तप्राय पवारी लोकगाथाओं, भरथरी एवं आल्हा शैली के लोकगीतों के वैज्ञानिक क्षेत्रीय संकलन व अंतरराष्ट्रीय प्रकाशन हेतु।',
    citation_english: 'For exhaustive field documentation of oral Pawari folk ballads, epic narratives, and rural bards in Satpura.',
    key_contributions_hindi: [
      'पवारी लोकगाथाएं और मौखिक परंपरा ग्रंथ का संपादन',
      '100+ ग्रामीण लोकगायकों के मौखिक साक्षात्कारों का ऑडियो-डिजिटल दस्तावेजीकरण',
      'राष्ट्रीय शोध पत्रिकाओं में पवारी लोकचेतना पर 30+ शोध पत्रों का प्रकाशन'
    ],
    awarding_body_hindi: 'मध्य भारत लोकसंस्कृति परिषद एवं ताप्ती शोध पीठ',
    badge_color: 'from-red-600 to-rose-500'
  },
  {
    id: 'award-3',
    title_hindi: 'पवारी काव्य श्री सम्मान',
    title_english: 'Pawari Poetry Excellence Award',
    category: 'poetry',
    category_name_hindi: 'काव्य श्री सम्मान',
    year: 2025,
    awardee_hindi: 'डॉ. अनिता मालवीय',
    awardee_english: 'Dr. Anita Malviya',
    awardee_title_hindi: 'पवारी कवयित्री एवं शोध अध्येता',
    awardee_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    awardee_location_hindi: 'बैतूल (म.प्र.)',
    citation_hindi: 'पवारी बोली में आधुनिक छंदमुक्त एवं गीत काव्य का सृजन कर नारी चेतना, मातृशक्ति और पर्यावरण चेतना को राष्ट्रीय स्तर पर प्रतिष्ठित करने हेतु।',
    citation_english: 'For enriching modern Pawari poetic forms and highlighting gender empowerment and ecology in folk literature.',
    key_contributions_hindi: [
      'पवारी काव्य धारा: लोक चेतना के स्वर कविता संग्रह की रचना',
      'माँ ताप्ती प्राकट्य वंदना एवं लोकगीत गायन संकलन',
      'पवारी महिला साहित्यकार सम्मेलन का सफल संयोजन'
    ],
    awarding_body_hindi: 'पवारी महिला सर्जना पीठ एवं शोध संस्थान',
    badge_color: 'from-purple-600 to-pink-500'
  },
  {
    id: 'award-4',
    title_hindi: 'लोकभाषा संवर्धन रत्न उपाधि',
    title_english: 'Pawari Language Preservation Jewel Honor',
    category: 'preservation',
    category_name_hindi: 'संवर्धन रत्न',
    year: 2024,
    awardee_hindi: 'श्री सुरेश देशमुख',
    awardee_english: 'Shri Suresh Deshmukh',
    awardee_title_hindi: 'पवारी लोकसाहित्यकार व संकलनकर्ता',
    awardee_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    awardee_location_hindi: 'सिवनी (म.प्र.)',
    citation_hindi: 'पवारी अंचल की लुप्त होती 1000 से अधिक पाहलोड़ी (पहेलियां), मुहावरों एवं कहावतों के ऐतिहासिक संकलन व जन-जागृति अभियानों के लिए।',
    citation_english: 'For documenting over 1,000 rare Pawari riddles, idioms, and village folklore traditions across Seoni district.',
    key_contributions_hindi: [
      'पवारी लोक कहावतें एवं बुझौवल संकलन (240 पृष्ठ)',
      'सतपुड़ा के लोकदेवता और अनुष्ठान सांस्कृतिक अध्ययन',
      'विद्यालयों में पवारी भाषा कार्यशालाओं का निःशुल्क संचालन'
    ],
    awarding_body_hindi: 'सतपुड़ा शोध न्यास एवं पवारी संस्कृति मंडल',
    badge_color: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'award-5',
    title_hindi: 'माँ ताप्ती युवा शोध प्रतिभा फेलोशिप',
    title_english: 'Maa Tapti Young Researcher Fellowship',
    category: 'youth',
    category_name_hindi: 'युवा प्रतिभा फेलोशिप',
    year: 2026,
    awardee_hindi: 'पवारी युवा भाषा शोधार्थी मंडल',
    awardee_english: 'Pawari Youth Linguistics Research Group',
    awardee_title_hindi: 'डिजिटल मानविकी एवं क्षेत्रीय सर्वेक्षण दल',
    awardee_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80',
    awardee_location_hindi: 'बैतूल, मुलताई एवं छिंदवाड़ा',
    citation_hindi: 'पवारी भाषा और संस्कृति के डिजिटल संरक्षण, ओपन एक्सेस वेब पोर्टल एवं ऑडियो आर्काइविंग में अभूतपूर्व योगदान हेतु।',
    citation_english: 'For pioneering digital archiving, open-access lexical databases, and community audio preservation for Pawari dialect.',
    key_contributions_hindi: [
      'पवारी ऑनलाइन शब्दकोश एवं ऑडियो पोर्टल का निर्माण',
      '50+ गांवों में लोकगीत एवं पहेलियों का ऑडियो संकलन अभियान',
      'युवा पीढ़ी में पवारी भाषा के प्रति स्वाभिमान जागरण'
    ],
    awarding_body_hindi: 'माँ ताप्ती शोध संस्थान, मुलताई',
    badge_color: 'from-blue-600 to-indigo-500'
  }
];

export const PawariHonorsAwards: React.FC<{ lang?: 'hi' | 'en' }> = ({ lang = 'hi' }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedAward, setSelectedAward] = useState<HonorAwardItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAwards = PAWARI_HONORS_DATA.filter(award => {
    if (selectedYear === 'all') return true;
    return String(award.year) === selectedYear;
  });

  const handleShare = (award: HonorAwardItem) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/awards/${award.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(award.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-900 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'पवारी साहित्य गौरव एवं सम्मान पीठ' : 'Pawari Literary Honors & Awards'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            {lang === 'hi' ? 'साहित्यकार सम्मान एवं राष्ट्रीय प्रशस्ति पत्र' : 'Eminent Writer Awards & Citations'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
            {lang === 'hi' 
              ? 'पवारी भाषा, व्याकरण, शब्दकोश एवं सतपुड़ा की लोकसंस्कृति को जीवन समर्पित करने वाले मूर्धन्य विद्वानों, कवियों एवं लोकसाहित्यकारों के प्रति संस्थान का सर्वोच्च नमन।'
              : 'Honoring stalwart linguists, folklorists, poets, and researchers who dedicated their lives to preserving Pawari language and cultural heritage.'}
          </p>
        </div>

        <div className="relative z-10 bg-black/40 border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-red-950 flex items-center justify-center font-bold shadow-md">
            <Medal className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-amber-200 font-serif">
              {PAWARI_HONORS_DATA.length} {lang === 'hi' ? 'विशिष्ट अलंकृत विद्वान' : 'Honored Scholars'}
            </p>
            <p className="text-[11px] text-amber-300/70 font-mono">
              माँ ताप्ती शोध संस्थान, मुलताई
            </p>
          </div>
        </div>
      </div>

      {/* Filter by Year */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-amber-900/10 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 font-mono flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'hi' ? 'वर्ष अनुसार फ़िल्टर:' : 'Filter by Year:'}</span>
          </span>
          <div className="flex space-x-1.5">
            {['all', '2026', '2025', '2024'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-red-950 text-amber-200 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {yr === 'all' ? (lang === 'hi' ? 'समस्त सम्मान' : 'All Years') : yr}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          {filteredAwards.length} {lang === 'hi' ? 'सम्मान प्रविष्टियां प्रदर्शित' : 'Awards listed'}
        </p>
      </div>

      {/* Awards Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAwards.map(award => (
          <div
            key={award.id}
            className="bg-white border border-amber-900/15 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            {/* Top Award Category Pill & Year */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold text-white bg-gradient-to-r ${award.badge_color} shadow-xs`}>
                  {award.category_name_hindi} ({award.year})
                </span>
                <span className="text-xs text-amber-900 font-serif font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{award.year}</span>
                </span>
              </div>

              {/* Award Title */}
              <h3 className="text-lg sm:text-xl font-serif font-bold text-red-950 group-hover:text-amber-900 transition leading-snug">
                {award.title_hindi}
              </h3>

              {/* Awardee Info Box */}
              <div className="flex items-start space-x-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-500/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md bg-slate-900">
                  <SafeImage 
                    src={award.awardee_image} 
                    alt={award.awardee_hindi} 
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    {award.awardee_hindi}
                  </h4>
                  <p className="text-xs text-red-900 font-semibold">
                    {award.awardee_title_hindi}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-amber-700" />
                    <span>{award.awardee_location_hindi}</span>
                  </p>
                </div>
              </div>

              {/* Citation Quote */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>{lang === 'hi' ? 'अभिनंदन एवं प्रशस्ति विवरण:' : 'Citation:'}</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed italic">
                  "{award.citation_hindi}"
                </p>
              </div>

              {/* Key Contributions */}
              <div className="space-y-1.5 text-xs">
                <h5 className="font-bold text-slate-900 font-mono text-[11px]">
                  {lang === 'hi' ? 'प्रमुख योगदान एवं कृतियां:' : 'Key Contributions:'}
                </h5>
                <ul className="space-y-1">
                  {award.key_contributions_hindi.map((c, cIdx) => (
                    <li key={cIdx} className="flex items-start space-x-2 text-slate-600">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs">
              <div className="text-[10px] text-slate-500 font-mono">
                🏛️ {award.awarding_body_hindi}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedAward(award)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-red-950 font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'प्रशस्ति पत्र देखें' : 'View Citation Certificate'}</span>
                </button>

                <button
                  onClick={() => handleShare(award)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 transition"
                  title="लिंक साझा करें"
                >
                  {copiedId === award.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- INTERACTIVE CITATION CERTIFICATE MODAL ---------------- */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#fdfbf7] text-[#2b2118] border-8 border-amber-600 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAward(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-900 text-white hover:bg-red-800 transition cursor-pointer shadow-md"
            >
              ✕
            </button>

            {/* Official Seal and Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-600/40 pb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500 text-red-950 flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-amber-300">
                ⚜️
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 tracking-wide uppercase">
                माँ ताप्ती शोध संस्थान, मुलताई
              </h2>
              <p className="text-xs font-serif italic text-amber-900 font-bold">
                पवारी भाषा, साहित्य एवं लोकसंस्कृति शोध पीठ (पंजीकृत)
              </p>
              <div className="inline-block px-4 py-1 rounded-full bg-amber-200 text-red-950 font-serif font-bold text-sm shadow-xs mt-1">
                📜 {selectedAward.title_hindi}
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 font-serif">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                — राष्ट्रीय पवारी साहित्य गौरव अलंकरण ({selectedAward.year}) —
              </p>

              <div className="py-2">
                <p className="text-sm italic text-slate-700">यह सम्मान पत्र परम आदरपूर्वक प्रदान किया जाता है:</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-red-950 mt-1">
                  {selectedAward.awardee_hindi}
                </h3>
                <p className="text-xs font-bold text-amber-800 font-sans mt-0.5">
                  ({selectedAward.awardee_title_hindi} • {selectedAward.awardee_location_hindi})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-justify leading-relaxed">
                "{selectedAward.citation_hindi}" पवारी समाज एवं शोध संस्थान आपके इस अमर योगदान के प्रति सदैव ऋणी रहेगा।
              </div>
            </div>

            {/* Certificate Footer with Signatures */}
            <div className="pt-6 border-t-2 border-amber-600/40 grid grid-cols-2 gap-4 text-center font-serif text-xs">
              <div className="space-y-1">
                <p className="font-bold text-red-950 font-signature text-sm">रामेश्वर शास्त्री</p>
                <p className="text-[11px] text-slate-600">अध्यक्ष, सम्मान समिति</p>
                <p className="text-[10px] text-slate-400 font-mono">माँ ताप्ती शोध संस्थान</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-red-950 font-signature text-sm">कैलाश पवार</p>
                <p className="text-[11px] text-slate-600">महानिदेशक / प्रधान संपादक</p>
                <p className="text-[10px] text-slate-400 font-mono">पवारी शोध पत्रिका</p>
              </div>
            </div>

            {/* Print / Close Actions */}
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>प्रशस्ति पत्र प्रिंट करें / सहेजें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
