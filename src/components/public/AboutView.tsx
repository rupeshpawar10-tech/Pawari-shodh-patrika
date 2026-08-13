import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  FileText, 
  Award, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Scale, 
  FileCheck2, 
  UserCheck, 
  Quote, 
  Clock, 
  FileSpreadsheet,
  ArrowRight,
  Mail,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { lang, settings, setActiveView } = useCms();

  const [activeTab, setActiveTab] = useState<'paper' | 'specs' | 'workflow' | 'citation'>('paper');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);

  const doiNumber = '10.5281/zenodo.psp.about.2026.001';
  const doiUrl = `https://doi.org/${doiNumber}`;

  const citations = {
    apa: `Pawar, B. L., & Sharma, R. K. (2026). Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework. Pawari Shodh Patrika (पवारी शोध पत्रिका), 2(1), 01–10. https://doi.org/${doiNumber}`,
    mla: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika, vol. 2, no. 1, 2026, pp. 01–10.`,
    chicago: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika 2, no. 1 (2026): 01–10.`,
    bibtex: `@article{psp2026about,
  author = {Pawar, B. L. and Sharma, R. K.},
  title = {Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework},
  journal = {Pawari Shodh Patrika (पवारी शोध पत्रिका)},
  volume = {2},
  number = {1},
  pages = {01--10},
  year = {2026},
  doi = {${doiNumber}},
  issn = {${settings.issn_online || '2583-9128'}}
}`
  };

  const handleCopyCitation = (type: keyof typeof citations) => {
    navigator.clipboard.writeText(citations[type]);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- COMPACT TRUST SUMMARY HEADER BAR ----------------- */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase rounded-full tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'आधिकारिक शोध पत्रिका' : 'Official Peer-Reviewed Journal'}</span>
          </span>
          <div className="flex items-center space-x-3 text-xs font-mono text-amber-200/90 bg-red-900/60 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'समीक्षा समय: 15-30 दिन' : 'Review Speed: 15-30 Days'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight">
            {lang === 'hi' ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika)' : 'Pawari Shodh Patrika'}
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base max-w-3xl leading-relaxed">
            {lang === 'hi' 
              ? 'पवारी भाषा, साहित्य, लोकसंस्कृति, क्षेत्रीय इतिहास एवं मध्यप्रदेश तथा समीपवर्ती अंचलों की जनजातीय बोलियों पर केंद्रित द्विभाषी (हिंदी/अंग्रेजी) अर्धवार्षिक शोध पत्रिका।' 
              : 'A bilingual (Hindi & English) half-yearly peer-reviewed research journal dedicated to Pawari language, literature, folklore, regional history, and Central Indian tribal dialects.'}
          </p>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-4 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-red-900/40 border border-amber-500/20 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-amber-300 block uppercase">Language</span>
            <span className="font-bold text-xs text-white">Bilingual (हि/Eng)</span>
          </div>
          <div className="bg-red-900/40 border border-amber-500/20 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-amber-300 block uppercase">Review Process</span>
            <span className="font-bold text-xs text-white">Double-Blind Peer</span>
          </div>
          <div className="bg-red-900/40 border border-amber-500/20 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-amber-300 block uppercase">Frequency</span>
            <span className="font-bold text-xs text-white">Half-Yearly</span>
          </div>
          <div className="bg-red-900/40 border border-amber-500/20 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-amber-300 block uppercase">Access Model</span>
            <span className="font-bold text-xs text-white">Open Access (CC-BY)</span>
          </div>
          <div className="bg-red-900/40 border border-amber-500/20 p-3 rounded-2xl text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-amber-300 block uppercase">Publication Fee</span>
            <span className="font-bold text-xs text-emerald-300">Zero (Free APC)</span>
          </div>
        </div>
      </div>

      {/* ----------------- VIEW MODE TABS ----------------- */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'paper'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पत्रिका परिचय एवं उद्देश्य (About & Scope)' : 'About Journal & Scope'}</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पत्रिका विशिष्टताएँ (Journal Specs)' : 'Journal Specifications'}</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पीर रिव्यू प्रक्रिया (Review Workflow)' : 'Review Pipeline'}</span>
          </button>
        </div>

        <button
          onClick={() => setActiveView('author_guidelines')}
          className="hidden md:inline-flex items-center space-x-1.5 text-xs font-bold text-red-900 hover:text-red-700 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 transition"
        >
          <span>{lang === 'hi' ? 'लेखक दिशानिर्देश' : 'Submit Manuscript'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ----------------- TAB 1: JOURNAL OVERVIEW & AIMS & SCOPE ----------------- */}
      {activeTab === 'paper' && (
        <div className="bg-white border-2 border-slate-200/80 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 space-y-10">
          
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '1. पत्रिका का परिचय (About the Journal)' : '1. About the Journal'}</span>
            </h2>

            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-justify font-serif text-slate-900">
              <p>
                मध्य भारत की सतपुड़ा पर्वतमाला, माँ ताप्ती नदी घाटी तथा नर्मदा व वर्धा अंचल (बैतूल, छिंदवाड़ा, पांढुर्णा) का भौगोलिक क्षेत्र भाषिक, ऐतिहासिक एवं सांस्कृतिक दृष्टि से अत्यंत समृद्ध है। इस अंचल में निवास करने वाले 72 गोत्र क्षत्रिय पवार (भोयर पवार) समाज द्वारा बोली जाने वाली <strong>पवारी (भोयरी/पंवारी) भाषा</strong> माँ ताप्ती नदी अंचल की मुख्य लोकभाषा एवं इंडो-आर्यन भाषा परिवार का एक अत्यंत विशिष्ट रूप है, जो ऐतिहासिक रूप से मालवा, राजस्थान एवं सतपुड़ा परिदृश्य से जुड़ी रही है।
              </p>

              <p>
                <strong>पवारी शोध पत्रिका (Pawari Shodh Patrika)</strong> पवारी भाषा, साहित्य, इतिहास और संस्कृति के गहन अध्ययन को केंद्रीय पीठ मानने के साथ-साथ मध्यप्रदेश एवं समीपवर्ती अंचलों की विभिन्न बोलियों, लोकभाषाओं (मालवी, निमाड़ी, बुन्देली, बघेली), जनजातीय भाषिक परंपराओं (गोंडी, कोरकू, नहाली/निहाली, भीली, भिलाली, बरेली) तथा क्षेत्रीय समाजशास्त्र पर शोध प्रोत्साहन हेतु स्थापित एक द्विभाषी (हिंदी व अंग्रेजी) पीर-रिव्यूड (Peer-Reviewed) अकादमिक मंच है।
              </p>

              <p>
                यह पत्रिका केवल भाषाई विवरणों तक सीमित न रहकर इतिहास, समाजशास्त्र, लोककला, मौखिक परंपराओं, पुरालेखों, वंशावली अध्ययनों, कृषि-संस्कृति तथा परंपरावादी लोकज्ञान प्रणालियों (Ethno-Knowledge) को समेटते हुए एक बहुविषयी शोध पीठ के रूप में कार्य करती है।
              </p>
            </div>
          </section>

          {/* Section 2: Aims & Objectives / Scope */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <Award className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '2. प्रमुख उद्देश्य एवं शोध दायरा (Aims & Scope)' : '2. Aims & Scope'}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पत्रिका शोधकर्ताओं, विद्वानों, भाषाविदों एवं समाजशास्त्रियों से निम्नलिखित प्रमुख क्षेत्रों में मौलिक, अप्रकाशित एवं गुणवत्तापूर्ण शोध पत्रों का स्वागत करती है:'
                : 'The journal invites original, unpublished, and peer-reviewed research papers across the following core thematic domains:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'पवारी भाषा, साहित्य एवं व्याकरण' : 'Pawari Language & Literature'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  पवारी (भोयरी/पंवारी) भाषा का ध्वनिविज्ञान (Phonetics), व्याकरणिक संरचना, शब्दकोश निर्माण, लोकसाहित्य, इतिहास, सांस्कृतिक धरोहर तथा मौखिक इतिहास का वैज्ञानिक विश्लेषण।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'मध्यप्रदेश की बोलियाँ एवं लोकभाषाएँ' : 'Regional Dialects of MP'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  राजस्थानी, मालवी, निमाड़ी, बुन्देली, बघेली एवं मध्य भारत के अंचल में बोली जाने वाली विभिन्न उपभाषाओं व स्थानीय भाषाई रूपों का विश्लेषणात्मक व साहित्यिक अध्ययन।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'जनजातीय भाषिक एवं सांस्कृतिक अध्ययन' : 'Tribal Linguistics & Culture'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित व संकटग्रस्त जनजातीय भाषिक परंपराओं एवं सांस्कृतिक ज्ञान प्रणालियों का संरक्षण व अध्ययन।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'लोकसाहित्य एवं मौखिक परंपराएँ' : 'Folklore & Oral Traditions'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  लोकगीत, अनुष्ठानिक गायन, लोककथाएँ, लोकनाट्य, गाथाएँ, कहावतें, मुहावरे, लोकोक्तियाँ तथा जनस्मृतियों एवं वाचिक परंपराओं का प्रामाणिक दस्तावेजीकरण।
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Publisher & Contact Info */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <Building className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '3. प्रकाशक एवं संपर्क विवरण (Publisher & Secretariat)' : '3. Publisher & Secretariat'}</span>
            </h2>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">{lang === 'hi' ? 'प्रकाशक संस्थान:' : 'Publisher Organization:'}</strong>
                    <span>{settings.publisher_hindi || 'माँ ताप्ती शोध संस्थान, मुलताई (मध्य प्रदेश)'}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">{lang === 'hi' ? 'कार्यालय / पता:' : 'Editorial Secretariat Address:'}</strong>
                    <span>{settings.contact_address || 'मुलताई, जिला - बैतूल, मध्य प्रदेश, भारत - 460661'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">{lang === 'hi' ? 'आधिकारिक ईमेल:' : 'Official Submission Email:'}</strong>
                    <a href={`mailto:${settings.contact_email}`} className="text-red-900 font-mono hover:underline font-bold">
                      {settings.contact_email || 'maa.tapti.shodh.sansthan@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">{lang === 'hi' ? 'प्रकाशन आवृत्ति:' : 'Publication Frequency:'}</strong>
                    <span>{lang === 'hi' ? 'अर्द्धवार्षिक (जून एवं दिसंबर)' : 'Half-Yearly (June & December)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Callout */}
          <div className="bg-red-950 text-amber-100 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif font-bold text-lg text-amber-300">
                {lang === 'hi' ? 'क्या आप अपना शोध पत्र प्रकाशित करना चाहते हैं?' : 'Would you like to submit your research manuscript?'}
              </h3>
              <p className="text-xs text-amber-100/80">
                {lang === 'hi' 
                  ? 'दिसंबर 2026 अंक हेतु हिंदी, अंग्रेजी या पवारी में शोध पत्र आमंत्रित हैं।'
                  : 'Manuscripts are invited in Hindi, English, or Pawari for the December 2026 issue.'}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setActiveView('author_guidelines')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md flex items-center space-x-1"
              >
                <span>{lang === 'hi' ? 'लेखक दिशानिर्देश देखें' : 'Author Guidelines'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 2: JOURNAL SPECIFICATIONS ----------------- */}
      {activeTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-red-950">
              {lang === 'hi' ? 'पत्रिका की आधिकारिक विशिष्टताएँ (Journal Specifications)' : 'Official Journal Specifications'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi' ? 'राष्ट्रीय एवं अंतर्राष्ट्रीय निकायों में पंजीकृत मेटाडेटा' : 'Verified metadata registered with national and international indexing bodies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'पत्रिका का नाम' : 'Journal Title'}</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">{settings.journal_title_hindi}</h3>
              <p className="text-xs text-slate-500 font-serif">{settings.journal_title_english}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">ISSN Numbers</span>
              <div className="text-sm font-mono font-bold text-slate-900 space-y-1">
                <p>Online: <span className="text-red-900">{settings.issn_online || '2583-9128'}</span></p>
                <p>Print: <span className="text-slate-700">{settings.issn_print || 'Pending'}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशन आवृत्ति' : 'Publication Frequency'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{lang === 'hi' ? 'अर्द्धवार्षिक' : 'Half-Yearly'}</h3>
              <p className="text-xs text-slate-500">{lang === 'hi' ? 'वर्ष में 2 अंक (जून और दिसंबर)' : '2 Issues per Year (Published in June & December)'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशक संस्थान' : 'Publisher'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.publisher_hindi || 'माँ ताप्ती शोध संस्थान, मुलताई'}</h3>
              <p className="text-xs text-slate-500">{settings.publisher_english || 'Maa Tapti Research Institute, Multai, M.P.'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'जेनोडो डीओआई' : 'Zenodo DOI Repository'}</span>
              <h3 className="font-mono font-bold text-base text-slate-900">10.5281/zenodo.10892341</h3>
              <p className="text-xs text-slate-500 font-mono">Open Access Repository DOI</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'समीक्षा मानक' : 'Review Standard'}</span>
              <h3 className="font-mono font-bold text-base text-red-900">Double-Blind Peer Review</h3>
              <p className="text-xs text-slate-500">15-30 Days Average Review Timeline</p>
            </div>

          </div>

          {/* Indexing Badges */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {lang === 'hi' ? 'मान्य इंडेक्सिंग एवं डिजिटल अर्काइविंग निकाय' : 'Indexing & Digital Archiving Registries'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <Globe className="w-6 h-6 text-sky-600 mb-1" />
                <span>Google Scholar</span>
                <span className="text-[10px] text-slate-500 font-mono">Academic Indexing</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <Award className="w-6 h-6 text-amber-600 mb-1" />
                <span>Zenodo</span>
                <span className="text-[10px] text-slate-700 font-mono font-bold">10.5281/zenodo</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span>ResearchGate</span>
                <span className="text-[10px] text-slate-500 font-mono">Scholarly Network</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <BookOpen className="w-6 h-6 text-red-800 mb-1" />
                <span>Academia.edu</span>
                <span className="text-[10px] text-slate-500 font-mono">Research Sharing</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 3: REVIEW WORKFLOW ----------------- */}
      {activeTab === 'workflow' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-red-950">
              {lang === 'hi' ? 'प्रकाशन एवं डबल-ब्लाइंड समीक्षा फ़्लोचार्ट' : 'Peer Review & Publication Workflow'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi' ? 'पांडुलिपि सबमिशन से लेकर अंतिम ऑनलाइन प्रकाशन तक की पारदर्शी प्रक्रिया' : 'Transparent 5-stage publishing pipeline adhering to international academic standards.'}
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            
            <div className="flex items-start space-x-4 p-5 bg-amber-50/60 rounded-2xl border border-amber-200">
              <div className="w-10 h-10 bg-amber-500 text-slate-950 font-bold font-mono text-base rounded-xl flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 1: ऑनलाइन पांडुलिपि सबमिशन' : 'Stage 1: Online / Email Submission'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  लेखक ऑनलाइन पोर्टल या ईमेल द्वारा Word (.doc/.docx) प्रारूप में द्विभाषी सारांश के साथ पांडुलिपि जमा करते हैं।
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-red-950 text-amber-100 font-bold font-mono text-base rounded-xl flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 2: प्रारंभिक प्लेगरिज्म एवं प्रारूप जांच' : 'Stage 2: Initial Screening & Plagiarism Check'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  संपादकीय डेस्क प्लेगरिज्म जांच (सीमा &lt; 10%) और लेखक दिशानिर्देश अनुपालन की समीक्षा करती है।
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-sky-50/70 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-sky-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 3: डबल-ब्लाइंड पीर समीक्षा (Double-Blind Peer Review)' : 'Stage 3: Double-Blind Peer Review'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  गुमनाम पांडुलिपि 2 स्वतंत्र विषय विशेषज्ञों को भेजी जाती है। समीक्षक 15-30 दिनों के भीतर विस्तृत मूल्यांकन रिपोर्ट प्रस्तुत करते हैं।
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 text-slate-100 font-bold font-mono text-base rounded-xl flex items-center justify-center shrink-0 shadow-md">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 4: संशोधन एवं अंतिम संपादकीय स्वीकृति' : 'Stage 4: Revision & Editorial Decision'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  समीक्षकों के सुझावों के आधार पर लेखक संशोधन करते हैं। अंतिम संपादन के बाद स्वीकृति पत्र जारी किया जाता है।
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <div className="w-10 h-10 bg-emerald-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center shrink-0 shadow-md">
                5
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 5: DOI आवंटन एवं ओपन एक्सेस प्रकाशन' : 'Stage 5: Zenodo DOI Assignment & Open Access Publishing'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  शोध पत्र को Zenodo DOI, डिजिटल प्रूफ़िंग एवं PDF लेआउट के साथ वेबसाइट पर विश्वभर में निःशुल्क अध्ययन हेतु प्रकाशित किया जाता है।
                </p>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 text-center">
            <button
              onClick={() => setActiveView('author_guidelines')}
              className="inline-flex items-center space-x-2 bg-red-900 hover:bg-red-800 text-amber-100 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'अपनी पांडुलिपि सबमिट करें' : 'Submit Manuscript Now'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
