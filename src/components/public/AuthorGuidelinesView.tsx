import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { FileText, CheckCircle2, AlertCircle, Send, ShieldAlert, FileDown, Layers, FileCheck, Mail, Clock, BookOpen, Sparkles } from 'lucide-react';

export const AuthorGuidelinesView: React.FC = () => {
  const { lang, pages, settings, setActiveView } = useCms();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase rounded-full tracking-wider">
            {lang === 'hi' ? 'लेखक एवं शोधकर्ता निर्देशिका' : 'Author Guidelines & Policies'}
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'शोध पत्र तैयार करने एवं प्रस्तुतिकरण हेतु दिशानिर्देश' : 'Guidelines for Authors & Contributors'}
        </h1>
        <p className="text-sm text-amber-200/95 max-w-2xl leading-relaxed">
          {lang === 'hi' 
            ? 'पांडुलिपि संरचना, शब्द सीमा, APA 7th संस्करण संदर्भ शैली, वर्ड (.doc/.docx) प्रारूप आवश्यकता तथा डबल-ब्लाइंड पीर-रिव्यू प्रक्रिया के संपूर्ण नियम।'
            : 'Manuscript structure, word limits, APA 7th citation format, Word (.doc/.docx) requirement, and double-blind peer review process.'}
        </p>
      </div>

      {/* Quick Downloads & Submit Direct Action */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-400 hover:shadow-md transition group text-left w-full cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <span>{lang === 'hi' ? 'वर्ड टेम्पलेट' : 'Word Template'}</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">.DOCX</span>
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'मानक प्रारूप में लिखें' : 'Standard writing format'}
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:shadow-md transition group text-left w-full cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <span>{lang === 'hi' ? 'कॉपीराइट फॉर्म' : 'Copyright Form'}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">.DOC / .PDF</span>
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'हस्ताक्षरित प्रति अनिवार्य' : 'Signed copy required'}
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveView('submit_manuscript')}
          className="flex items-center justify-between p-4 bg-red-950 hover:bg-red-900 border border-amber-500/40 rounded-2xl text-amber-100 shadow-md transition group text-left w-full cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-red-950 p-2.5 rounded-xl group-hover:scale-105 transition">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm">
                {lang === 'hi' ? 'लेख सबमिट करें' : 'Submit Article'}
              </h4>
              <p className="text-xs text-amber-300/80 font-mono">
                {settings.contact_email}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Guidelines Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-amber-900/10 pb-4">
              <h2 className="text-2xl font-serif font-bold text-red-950 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-amber-600" />
                <span>{lang === 'hi' ? 'पांडुलिपि तैयारी के मुख्य नियम' : 'Core Manuscript Preparation Rules'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'hi' ? 'अंतर्राष्ट्रीय अकादमिक मानकों एवं पीर-रिव्यू आवश्यकताओं के अनुरूप' : 'According to international academic standards & peer-review requirements'}
              </p>
            </div>

            {/* Structured Guideline Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '1. स्वीकृत भाषाएँ (Languages)' : '1. Accepted Languages'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'हिंदी (मङ्गल / यूनिकोड / कृतिदेव 010), पवारी (भोयरी/पंवारी) अथवा अंग्रेजी भाषा में शोध पत्र स्वीकार किए जाते हैं।' 
                    : 'Research papers are accepted in Hindi (Unicode Mangal / Krutidev 010), Pawari, or English.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '2. शब्द सीमा (Word Limit)' : '2. Word Limits'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'शोध पत्र: 3,000 से 5,000 शब्द। सामान्य साहित्यिक या समीक्षा लेख: 1,000 से 1,500 शब्द।' 
                    : 'Research Papers: 3,000 to 5,000 words. General / Review Articles: 1,000 to 1,500 words.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '3. फ़ाइल प्रारूप (File Format)' : '3. File Format Requirement'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'केवल Word (.doc / .docx) फ़ाइल अनिवार्य है। PDF फ़ाइल मुख्य पाठ के संपादन हेतु स्वीकार नहीं की जाती।' 
                    : 'Mandatory Word (.doc / .docx) file required. PDF is not accepted for primary editable text.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '4. सारांश एवं कीवर्ड्स (Abstract)' : '4. Abstract & Keywords'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'प्रत्येक लेख के साथ लगभग 200 शब्दों का सारांश (हिंदी एवं अंग्रेजी में) तथा 4 से 6 बीज शब्द (Keywords) आवश्यक हैं।' 
                    : 'Include ~200 word abstract in both Hindi & English and 4 to 6 keywords.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '5. संदर्भ शैली (APA Citations)' : '5. Citation Style (APA 7th)'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'संदर्भ ग्रंथ सूची (References) APA 7th Edition (American Psychological Association) शैली के अनुसार होनी चाहिए।' 
                    : 'All citations and bibliography references must strictly follow APA (7th Edition) format.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4.5 rounded-2xl border border-amber-200/50 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? '6. प्लेगेरिज्म नीति (Plagiarism)' : '6. Plagiarism Policy'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'hi' 
                    ? 'शोध पत्र पूरी तरह मौलिक होना चाहिए। साहित्यिक चोरी (Plagiarism) 10% से कम होनी अनिवार्य है।' 
                    : 'Manuscripts must be original. Similarity index must be strictly less than 10%.'}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Pre-Submission Checklist */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200/60 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-lg text-amber-950">
                {lang === 'hi' ? 'सबमिशन चेकलिस्ट' : 'Pre-Submission Checklist'}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'लेख 3000-5000 शब्दों के दायरे में है।' : 'Paper is between 3000-5000 words.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'Word (.doc/.docx) फॉर्मेट में तैयार है।' : 'Prepared in Word (.doc/.docx) format.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'सार (~200 शब्द) एवं 4-6 कीवर्ड्स शामिल हैं।' : 'Abstract (~200 words) & 4-6 keywords included.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'APA 7th शैली में संदर्भ सूची दी गई है।' : 'References formatted in APA 7th style.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'हस्ताक्षरित कॉपीराइट स्वघोषणा पत्र तैयार है।' : 'Signed copyright declaration ready.'}</span>
              </li>
            </ul>
          </div>

          {/* Ethics & Review Policy */}
          <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-950" />
              <h3 className="font-serif font-bold text-lg text-red-950">
                {lang === 'hi' ? 'नैतिकता एवं समीक्षा' : 'Review & Ethics'}
              </h3>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                {lang === 'hi' 
                  ? 'पत्रिका डबल-ब्लाइंड पीयर रिव्यू प्रक्रिया का पालन करती है। सभी प्राप्त पांडुलिपियों की समीक्षा न्यूनतम 2 विषय विशेषज्ञों द्वारा की जाती है।' 
                  : 'The journal follows a double-blind peer review process. All manuscripts are reviewed by at least 2 subject experts.'}
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lang === 'hi' ? 'समीक्षा प्रतिक्रिया: 15 से 30 दिन' : 'Review Response: 15-30 days'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Submission Action Box */}
      <div className="bg-gradient-to-r from-red-950 to-amber-950 text-amber-100 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl border border-amber-500/30">
        <Mail className="w-10 h-10 mx-auto text-amber-400" />
        <h3 className="text-2xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'अपने शोध पत्र सीधे ईमेल द्वारा भेजें' : 'Send Your Research Paper Directly'}
        </h3>
        <p className="text-sm text-amber-200/90 max-w-xl mx-auto">
          {lang === 'hi'
            ? `अपनी पूर्ण वर्ड (.doc/.docx) पांडुलिपि द्विभाषी सार सहित आधिकारिक ईमेल पर भेजें: `
            : `Email your complete Word manuscript along with bilingual abstract to: `}
          <strong className="text-white underline">{settings.contact_email}</strong>
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${settings.contact_email}?subject=Manuscript Submission - Pawari Shodh Patrika`}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-red-950 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition"
          >
            <Mail className="w-4 h-4" />
            <span>{lang === 'hi' ? 'ईमेल भेजें (Send Email)' : 'Send Email Now'}</span>
          </a>
          <button
            onClick={() => setActiveView('submit_manuscript')}
            className="inline-flex items-center space-x-2 bg-red-900/80 hover:bg-red-900 text-amber-100 border border-amber-400/40 px-8 py-3.5 rounded-2xl font-bold text-sm transition"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'hi' ? 'ऑनलाइन फॉर्म भरें' : 'Open Online Form'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
