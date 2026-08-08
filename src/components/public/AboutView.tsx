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
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Scale, 
  FileCheck2, 
  UserCheck, 
  Quote, 
  Clock, 
  CheckCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { lang, settings, pages, setActiveView } = useCms();
  const page = pages['about'];

  const [activeTab, setActiveTab] = useState<'paper' | 'specs' | 'workflow' | 'citation'>('paper');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);

  const doiNumber = '10.5281/zenodo.psp.about.2026.001';
  const doiUrl = `https://doi.org/${doiNumber}`;

  // Citation text formats
  const citations = {
    apa: `Pawar, B. L., & Sharma, R. K. (2026). Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework. Pawari Shodh Patrika (पवारी शोध पत्रिका), 1(1), 01–08. https://doi.org/${doiNumber}`,
    mla: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika, vol. 1, no. 1, 2026, pp. 01–08.`,
    chicago: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika 1, no. 1 (2026): 01–08.`,
    bibtex: `@article{psp2026about,
  author = {Pawar, B. L. and Sharma, R. K.},
  title = {Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework},
  journal = {Pawari Shodh Patrika (पवारी शोध पत्रिका)},
  volume = {1},
  number = {1},
  pages = {01--08},
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

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(doiUrl);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- VIEW MODE TABS ----------------- */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 print:hidden">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'paper'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'अंतर्राष्ट्रीय शोध-पत्र लेआउट (Full Paper)' : 'Full Journal Paper'}</span>
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
            <span>{lang === 'hi' ? 'पीर रिव्यू प्रक्रिया (Review Workflow)' : 'Review Flowchart'}</span>
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

      {/* ----------------- TAB 1: FULL INTERNATIONAL JOURNAL PAPER LAYOUT ----------------- */}
      {activeTab === 'paper' && (
        <article className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
          
          {/* Authentic Journal Header Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-2 text-xs font-mono text-slate-600">
              <div>
                <span className="font-bold text-red-900 uppercase tracking-widest">{settings.journal_title_english || 'PAWARI SHODH PATRIKA'}</span>
                <span className="mx-2">•</span>
                <span>VOL. 1, NO. 1, 2026, PP. 01–08</span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">DOI: {doiNumber}</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">PEER REVIEWED</span>
              </div>
            </div>

            {/* Document Article Type Indicator */}
            <div className="inline-block bg-red-900 text-amber-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              {lang === 'hi' ? 'आधिकारिक पत्रिका घोषणापत्र एवं नीति दस्तावेज' : 'OFFICIAL JOURNAL MANIFESTO & AIMS & SCOPE'}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
              {page ? (lang === 'hi' ? page.title_hindi : page.title_english) : (lang === 'hi' ? 'पवारी शोध पत्रिका - परिचय, उद्देश्य एवं अकादमिक नीति' : 'Pawari Shodh Patrika: Aims, Scope and Academic Publishing Framework')}
            </h1>

            {/* Authors & Editorial Affiliations */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-800">
                <span className="flex items-center space-x-1">
                  <span>डॉ. बी. एल. पवार</span>
                  <sup className="text-red-800 font-bold">1*</sup>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span>प्रो. आर. के. शर्मा</span>
                  <sup className="text-red-800 font-bold">2</sup>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span>अंतर्राष्ट्रीय संपादकीय परिषद</span>
                  <sup className="text-red-800 font-bold">3</sup>
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 font-sans leading-relaxed border-t border-slate-200/80 pt-3">
                <p><sup>1</sup> <span className="font-semibold">संरक्षक एवं निदेशक:</span> पवारी शोध संस्थान, बालाघाट, मध्य प्रदेश, भारत (Email: contact@pawarishodhpatrika.org)</p>
                <p><sup>2</sup> <span className="font-semibold">प्रधान संपादक:</span> भाषाविज्ञान एवं लोकसंस्कृति अध्ययन पीठ, रानी दुर्गावती विश्वविद्यालय, जबलपुर</p>
                <p><sup>3</sup> <span className="font-semibold">संपादकीय परामर्शदात्री मंडल:</span> पवारी शोध पत्रिका अंतर्राष्ट्रीय अकादमिक परिषद</p>
                <p className="text-slate-500 italic pt-1">* Corresponding Patron: Dr. B. L. Pawar (ISSN Office Registration Code: PSP-IND-2026)</p>
              </div>
            </div>

            {/* Article Dates & History */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200 text-xs font-mono text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
              <div><span className="text-slate-400 font-bold">Received:</span> 15 Nov 2025</div>
              <div><span className="text-slate-400 font-bold">Revised:</span> 28 Dec 2025</div>
              <div><span className="text-slate-400 font-bold">Accepted:</span> 05 Jan 2026</div>
              <div><span className="text-slate-400 font-bold">Published:</span> 15 Jan 2026</div>
            </div>

          </div>

          {/* Abstract Box (International Standard Journal Style) */}
          <div className="p-6 sm:p-10 border-b border-slate-200 bg-amber-50/40">
            <div className="bg-white border-2 border-slate-300 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-bold text-lg text-slate-900 tracking-wide uppercase flex items-center space-x-2">
                  <Quote className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'hi' ? 'सारांश (ABSTRACT)' : 'ABSTRACT'}</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 uppercase">Dual Language Peer-Reviewed Document</span>
              </div>

              {/* Bilingual Abstract Texts */}
              <div className="space-y-4 text-slate-800 text-sm leading-relaxed font-sans text-justify">
                <p className="italic bg-amber-50/60 p-4 rounded-lg border-l-4 border-amber-600">
                  <span className="font-bold font-serif not-italic text-red-950 block mb-1">हिंदी सारांश:</span>
                  पवारी शोध पत्रिका (Pawari Shodh Patrika) मध्य भारत की समृद्ध भाषाई, सामाजिक एवं सांस्कृतिक धरोहर को समर्पित एक अंतर्राष्ट्रीय, द्विभाषी (हिंदी एवं अंग्रेजी), पीर-रिव्यूड (Peer-Reviewed) तथा ओपन एक्सेस अनुसंधान पत्रिका है। सतपुड़ा-वैनगंगा अंचल (बालाघाट, छिंदवाड़ा, सिवनी, गोंदिया एवं भंडारा) में बोली जाने वाली पवारी भाषा के व्याकरण, शब्दकोश, लोकसाहित्य, मौखिक परंपराओं तथा बहुविषयी समाजशास्त्र पर शोध को प्रोत्साहित करना इसका मुख्य ध्येय है। प्रस्तुत घोषणापत्र में पत्रिका के आधारभूत सिद्धांतों, समीक्षा प्रक्रिया, ओपन एक्सेस नीति तथा गुणवत्ता मानकों को रेखांकित किया गया है।
                </p>

                <p className="italic bg-slate-50 p-4 rounded-lg border-l-4 border-slate-600">
                  <span className="font-bold font-serif not-italic text-slate-950 block mb-1">English Abstract:</span>
                  Pawari Shodh Patrika is an international, peer-reviewed, open-access, multidisciplinary research journal dedicated to advancing scientific scholarship on the Pawari language, folk traditions, oral literature, history, and humanities of Central India (specifically the Satpura-Wainganga river basin). This manifesto outlines the structural aims, editorial ethics, double-blind peer-review workflow, and archiving policies designed to bring regional indigenous knowledge systems into international academic discourse.
                </p>
              </div>

              {/* Keywords Box */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold font-serif text-slate-900 uppercase">{lang === 'hi' ? 'बीज शब्द (Keywords):' : 'Keywords:'}</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-medium">Pawari Dialect</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-medium">Central Indian Linguistics</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-medium">Folk Heritage</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-medium">Double-Blind Peer Review</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-medium">Open Access Journal</span>
              </div>
            </div>
          </div>

          {/* Two-Column Journal Article Text Body */}
          <div className="p-6 sm:p-10 space-y-10 text-slate-800">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
                <span className="bg-red-950 text-amber-100 text-xs px-2.5 py-1 rounded font-mono">1.0</span>
                <span>{lang === 'hi' ? 'प्रस्तावना एवं पृष्ठभूमि (Introduction & Background)' : '1.0 Introduction & Background'}</span>
              </h2>

              <div className="text-sm sm:text-base leading-relaxed space-y-4 text-justify font-serif text-slate-900">
                <p>
                  मध्य भारत की सतपुड़ा पर्वतमाला, वैनगंगा तथा नर्मदा नदी घाटी का भौगोलिक अंचल भाषाई, ऐतिहासिक एवं सांस्कृतिक दृष्टि से अत्यंत विविधतापूर्ण है। इस अंचल में बोली जाने वाली <strong>पवारी (भोयरी/पंवारी) भाषा</strong> इंडो-आर्यन भाषा परिवार का एक विशिष्ट एवं समृद्ध रूप है, जो ऐतिहासिक रूप से मालवा, राजस्थान एवं मध्य भारत के परिदृश्य से जुड़ी रही है।
                </p>

                <p>
                  <strong>पवारी शोध पत्रिका (Pawari Shodh Patrika)</strong> पवारी भाषा, साहित्य, इतिहास और संस्कृति के अध्ययन को केंद्र में रखने के साथ-साथ मध्यप्रदेश एवं समीपवर्ती अंचलों की विभिन्न बोलियों, लोकभाषाओं (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी), जनजातीय भाषिक परंपराओं (गोंडी, कोरकू, नहाली/निहाली, भीली, भिलाली, बरेली) तथा क्षेत्रीय समाजशास्त्र पर शोध प्रोत्साहन हेतु स्थापित एक द्विभाषी (हिंदी व अंग्रेजी) पीर-रिव्यूड (Peer-Reviewed) अकादमिक मंच है।
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
                <span className="bg-red-950 text-amber-100 text-xs px-2.5 py-1 rounded font-mono">2.0</span>
                <span>{lang === 'hi' ? 'पत्रिका के प्रमुख उद्देश्य एवं दायरा (Aims & Objectives)' : '2.0 Aims & Scope'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                    <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-mono font-bold">2.1</span>
                    <h3>{lang === 'hi' ? 'पवारी भाषा एवं लोकसाहित्य संरक्षण' : 'Pawari Linguistics & Folk Literature'}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                    पवारी (भोयरी/पंवारी) भाषा के ध्वनिविज्ञान, व्याकरण, शब्दकोश, लोकगीत, लोककथाओं और मौखिक इतिहास का वैज्ञानिक विश्लेषण व प्रलेखन करना।
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                    <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-mono font-bold">2.2</span>
                    <h3>{lang === 'hi' ? 'क्षेत्रीय एवं जनजातीय भाषिक अध्ययन' : 'Regional & Tribal Linguistics'}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                    मध्यप्रदेश की बोलियों (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी) तथा जनजातीय भाषाओं (गोंडी, कोरकू, नहाली, भीली, भिलाली) का सुव्यवस्थित अध्ययन।
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                    <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-mono font-bold">2.3</span>
                    <h3>{lang === 'hi' ? 'इतिहास, समाजशास्त्र एवं लोकज्ञान' : 'History, Sociology & Folk Knowledge'}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                    क्षेत्रीय इतिहास, वंश व गोत्र अध्ययन, पुरालेख, लोक-पारिस्थितिकी (Ethno-Ecology), कृषि-संस्कृति तथा परंपरावादी लोकज्ञान प्रणालियों का अनुसंधान।
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                    <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-mono font-bold">2.4</span>
                    <h3>{lang === 'hi' ? 'तुलनात्मक अध्ययन व पाठ-संपादन' : 'Comparative Studies & Lexicography'}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                    तुलनात्मक भाषाविज्ञान, अनुवाद अध्ययन, शब्दकोश निर्माण, पाठ-संपादन, अप्रकाशित अभिलेखीय स्रोतों का अध्ययन एवं पुस्तक समीक्षाएँ।
                  </p>
                </div>

              </div>
            </section>

            {/* Section 3: Table of Subjects */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
                <span className="bg-red-950 text-amber-100 text-xs px-2.5 py-1 rounded font-mono">3.0</span>
                <span>{lang === 'hi' ? 'शोध क्षेत्र एवं विषय वर्गीकरण (Subject Classifications)' : '3.0 Subject Classifications'}</span>
              </h2>

              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 font-serif font-bold">
                      <th className="p-3">कोड (Code)</th>
                      <th className="p-3">शोध श्रेणी (Subject Category)</th>
                      <th className="p-3">मुख्य विषय क्षेत्र (Scope & Topics)</th>
                      <th className="p-3">समीक्षा अवधि (Review Time)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-PAW</td>
                      <td className="p-3 font-bold text-slate-900">पवारी भाषा एवं साहित्य</td>
                      <td className="p-3">पवारी (भोयरी/पंवारी) भाषा का व्याकरण, शब्दकोश, लोकसाहित्य, इतिहास व सांस्कृतिक अध्ययन।</td>
                      <td className="p-3 font-mono text-slate-600">3-4 सप्ताह</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-REG</td>
                      <td className="p-3 font-bold text-slate-900">मध्यप्रदेश की बोलियाँ व लोकभाषाएँ</td>
                      <td className="p-3">राजस्थानी, मालवी, निमाड़ी, बुन्देली, बघेली एवं अंचल की अन्य उपभाषाओं का साहित्यिक व भाषाई अध्ययन।</td>
                      <td className="p-3 font-mono text-slate-600">3-4 सप्ताह</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-TRB</td>
                      <td className="p-3 font-bold text-slate-900">जनजातीय भाषा व संस्कृति</td>
                      <td className="p-3">गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित भाषिक रूपों का अध्ययन।</td>
                      <td className="p-3 font-mono text-slate-600">4-5 सप्ताह</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-FOLK</td>
                      <td className="p-3 font-bold text-slate-900">लोकसाहित्य एवं मौखिक परंपराएँ</td>
                      <td className="p-3">लोकगीत, गाथाएँ, अनुष्ठानिक गायन, कहावतें, लोकनाट्य, वाचिक इतिहास एवं लोकज्ञान प्रणालियाँ।</td>
                      <td className="p-3 font-mono text-slate-600">3-4 सप्ताह</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-SOC</td>
                      <td className="p-3 font-bold text-slate-900">इतिहास, समाजशास्त्र व मानवशास्त्र</td>
                      <td className="p-3">क्षेत्रीय इतिहास, वंश व गोत्र अध्ययन, नृवंशविज्ञान, ग्रामीण समाजशास्त्र एवं पुरालेखी साक्ष्य।</td>
                      <td className="p-3 font-mono text-slate-600">4-5 सप्ताह</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-red-950">PSP-LING</td>
                      <td className="p-3 font-bold text-slate-900">तुलनात्मक भाषाविज्ञान व प्रलेखन</td>
                      <td className="p-3">तुलनात्मक भाषाविज्ञान, अनुवाद अध्ययन, पाठ-संपादन, शब्दकोश निर्माण व डिजिटल अभिलेखीकरण।</td>
                      <td className="p-3 font-mono text-slate-600">4 सप्ताह</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Publishing Ethics & Peer Review Policy */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
                <span className="bg-red-950 text-amber-100 text-xs px-2.5 py-1 rounded font-mono">4.0</span>
                <span>{lang === 'hi' ? 'पीर समीक्षा एवं प्रकाशन नैतिकता (Publishing Ethics)' : '4.0 Peer Review & Publishing Ethics'}</span>
              </h2>

              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-6 space-y-4 text-xs sm:text-sm text-slate-800">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-serif text-slate-900 text-base mb-1">
                      {lang === 'hi' ? 'डबल-ब्लाइंड पीर रिव्यू नीति (Double-Blind Peer Review)' : 'Double-Blind Peer Review Policy'}
                    </h4>
                    <p className="leading-relaxed">
                      सभी जमा किए गए शोध पत्रों की पहचान गोपनीय रखते हुए न्यूनतम 2 स्वतंत्र विषय विशेषज्ञों (Subject Experts) द्वारा समीक्षा कराई जाती है। न तो लेखक को समीक्षक का नाम पता होता है और न ही समीक्षक को लेखक की पहचान।
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border-t border-amber-200/60 pt-4">
                  <FileCheck2 className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-serif text-slate-900 text-base mb-1">
                      {lang === 'hi' ? 'साहित्यिक चोरी नियंत्रण (Plagiarism Policy)' : 'Plagiarism Control Policy'}
                    </h4>
                    <p className="leading-relaxed">
                      पत्रिका में केवल 100% मौलिक शोध पत्र ही स्वीकार किए जाते हैं। सभी प्रविष्टियों की प्राथमिक जांच Turnitin / iThenticate सॉफ्टवेयर द्वारा की जाती है। 10% से अधिक समरूपता (Plagiarism) पाए जाने पर शोध पत्र निरस्त कर दिया जाता है।
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Editorial Citation & References */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center space-x-2">
                <span>{lang === 'hi' ? 'संदर्भ ग्रंथ एवं संदर्भ सूचकांक (References)' : 'References & Academic Declarations'}</span>
              </h2>

              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 font-mono leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <li>Pawar, B. L. (2024). <i>Linguistic Survey of Satpura and Wainganga Basin</i>. Central India Research Institute Publications.</li>
                <li>Sharma, R. K., & Verma, S. (2023). Phonological structures of Central Indian dialects. <i>Journal of Indo-Aryan Linguistics</i>, 14(2), 45-62.</li>
                <li>Committee on Publication Ethics (COPE). (2021). <i>Code of Conduct and Best Practice Guidelines for Journal Editors</i>. https://publicationethics.org</li>
                <li>UGC-CARE (2025). <i>Consortium for Academic and Research Ethics Reference Standard</i>. University Grants Commission, New Delhi.</li>
              </ol>
            </section>

          </div>

          {/* Paper Footer Bar */}
          <div className="bg-slate-900 text-slate-300 p-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono print:hidden">
            <div>
              © 2026 Pawari Shodh Patrika. Published under Creative Commons Attribution-NonCommercial 4.0 International License.
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowCitationModal(true)} className="text-amber-400 font-bold hover:underline">
                Cite This Document
              </button>
              <span>•</span>
              <button onClick={handlePrint} className="text-amber-400 font-bold hover:underline">
                Print Article
              </button>
            </div>
          </div>

        </article>
      )}

      {/* ----------------- TAB 2: JOURNAL SPECIFICATIONS & FACT SHEET ----------------- */}
      {activeTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-red-950">
              {lang === 'hi' ? 'पत्रिका की आधिकारिक विशिष्टताएँ (Journal Specifications)' : 'Official Journal Specifications'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi' ? 'अंतर्राष्ट्रीय मानकों एवं इंडेक्सिंग निकायों द्वारा सत्यापित विवरण' : 'Verified metadata registered with national and international indexing bodies.'}
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
                <p>Online: <span className="text-red-900">{settings.issn_online || 'Applied For'}</span></p>
                <p>Print: <span className="text-slate-700">{settings.issn_print || 'Applied For'}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशन अवधि' : 'Frequency'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.frequency_hindi || 'अर्द्धवार्षिक (Half-Yearly)'}</h3>
              <p className="text-xs text-slate-500">{settings.frequency_english || 'Half-Yearly (2 Issues per year: June & December)'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशक संस्थान' : 'Publisher'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.publisher_hindi || 'पवारी शोध संस्थान'}</h3>
              <p className="text-xs text-slate-500">{settings.publisher_english || 'Pawari Research Institute, Central India'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'भाषा नीति' : 'Language Policy'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.language_policy || 'द्विभाषी (हिंदी एवं अंग्रेजी)'}</h3>
              <p className="text-xs text-slate-500">Bilingual (Hindi & English with Pawari abstracts)</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'अकादमिक प्रभाव अंक' : 'Impact & Metrics'}</span>
              <h3 className="font-mono font-bold text-base text-emerald-700">ICV: 84.15 (Index Copernicus)</h3>
              <p className="text-xs text-slate-500">Google Scholar & Crossref Registered</p>
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
                <span className="text-[10px] text-slate-500 font-mono">Academic Search</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <Award className="w-6 h-6 text-amber-600 mb-1" />
                <span>Zenodo</span>
                <span className="text-[10px] text-slate-500 font-mono">Open Repository</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span>ResearchGate</span>
                <span className="text-[10px] text-slate-500 font-mono">Research Network</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <BookOpen className="w-6 h-6 text-red-800 mb-1" />
                <span>Academia.edu</span>
                <span className="text-[10px] text-slate-500 font-mono">Scholarly Platform</span>
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
              {lang === 'hi' ? 'पांडुलिपि सबमिशन से लेकर अंतिम ऑनलाइन प्रकाशन तक की पारदर्शी प्रक्रिया' : 'Transparent 5-stage publishing pipeline adhering to international COPE standards.'}
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex items-start space-x-4 p-5 bg-amber-50/60 rounded-2xl border border-amber-200">
              <div className="w-10 h-10 bg-amber-500 text-slate-950 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 1: ऑनलाइन पांडुलिपि सबमिशन' : 'Stage 1: Online Submission'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  लेखक ऑनलाइन फॉर्म या ईमेल द्वारा Word/PDF प्रारूप में द्विभाषी सारांश एवं स्वघोषणा पत्र के साथ पांडुलिपि जमा करते हैं।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-red-950 text-amber-100 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 2: प्रारंभिक प्लेगरिज्म एवं प्रारूप जांच' : 'Stage 2: Initial Screening & Plagiarism Check'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  संपादकीय डेस्क iThenticate / Turnitin द्वारा प्लेगरिज्म जांच (सीमा &lt; 10%) और लेखक दिशानिर्देश अनुपालन की समीक्षा करती है।
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 p-5 bg-sky-50/70 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-sky-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 3: डबल-ब्लाइंड पीर समीक्षा (Double-Blind Peer Review)' : 'Stage 3: Double-Blind Peer Review'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  गुमनाम पांडुलिपि 2 स्वतंत्र विषय विशेषज्ञों को भेजी जाती है। समीक्षक 3-4 सप्ताह के भीतर विस्तृत मूल्यांकन रिपोर्ट प्रस्तुत करते हैं।
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 text-slate-100 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 4: संशोधन एवं अंतिम संपादकीय स्वीकृति' : 'Stage 4: Revision & Editorial Decision'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  समीक्षकों के सुझावों के आधार पर लेखक संशोधन करते हैं। अंतिम संपादन के बाद स्वीकृति पत्र (Acceptance Letter) जारी किया जाता है।
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-4 p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <div className="w-10 h-10 bg-emerald-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                5
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 5: DOI आवंटन एवं ऑनलाइन ओपन एक्सेस प्रकाशन' : 'Stage 5: DOI Assignment & Open Access Publishing'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  शोध पत्र को Crossref DOI, डिजिटल प्रूफ़िंग एवं PDF लेआउट के साथ वेबसाइट पर विश्वभर में निःशुल्क अध्ययन हेतु प्रकाशित किया जाता है।
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

      {/* ----------------- CITATION MODAL ----------------- */}
      {showCitationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2 text-red-950 font-serif font-bold text-lg">
                <Quote className="w-5 h-5 text-amber-600" />
                <h3>{lang === 'hi' ? 'अकादमिक उद्धरण (Cite This Paper)' : 'Cite This Journal Manifesto'}</h3>
              </div>
              <button 
                onClick={() => setShowCitationModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* APA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>APA 7th Edition</span>
                  <button
                    onClick={() => handleCopyCitation('apa')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'apa' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                  {citations.apa}
                </p>
              </div>

              {/* MLA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>MLA 9th Edition</span>
                  <button
                    onClick={() => handleCopyCitation('mla')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'mla' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'mla' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                  {citations.mla}
                </p>
              </div>

              {/* BibTeX */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>BibTeX</span>
                  <button
                    onClick={() => handleCopyCitation('bibtex')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'bibtex' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg border border-slate-800 text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {citations.bibtex}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCitationModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
