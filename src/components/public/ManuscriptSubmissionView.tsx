import React, { useState, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { FileUploadZone } from '../common/FileUploadZone';
import { ParsedWordArticle } from '../../lib/wordParser';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Send, File as FileIcon, X, ShieldAlert, FileDown, FileCheck, Sparkles, Mail, Clock, BookOpen, Layers, Check, FileText } from 'lucide-react';

export const ManuscriptSubmissionView: React.FC = () => {
  const { lang, setActiveView, addSubmission, settings, uploadFileToStorage } = useCms();
  
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    coAuthors: '',
    affiliation: '',
    title: '',
    paperType: 'Journal Article',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    keywords: '',
    doi: '',
    licenseType: 'CC-BY Open Access',
    abstract: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Field validations
    if (!formData.authorName.trim()) {
      setFormError(lang === 'hi' ? 'कृपया मुख्य लेखक का नाम दर्ज करें।' : 'Please enter the primary author name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError(lang === 'hi' ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (!formData.title.trim()) {
      setFormError(lang === 'hi' ? 'कृपया शोध पत्र का पूरा शीर्षक दर्ज करें।' : 'Please enter the full paper title.');
      return;
    }

    const hasUploadedUrl = Boolean(fileUrlInput && fileUrlInput.trim());
    const hasRawFile = Boolean(file && file.size > 0);

    if (!hasUploadedUrl && !hasRawFile) {
      setFormError(lang === 'hi' ? 'कृपया शोध पत्र की Word (.doc/.docx) या PDF फ़ाइल अपलोड करें या ऑनलाइन लिंक दर्ज करें।' : 'Please upload a Word (.doc/.docx) or PDF manuscript file or provide a direct document URL.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let finalFileUrl = fileUrlInput.trim();
      
      // Upload raw file if present and not yet uploaded
      if (file && file.size > 0 && !finalFileUrl) {
        const uploadRes = await uploadFileToStorage(file, 'submissions');
        finalFileUrl = uploadRes.url || uploadRes.fileId || uploadRes.path;
      }

      await addSubmission({
        author_name: formData.authorName.trim(),
        email: formData.email.trim(),
        co_authors: formData.coAuthors.trim(),
        affiliation: formData.affiliation.trim(),
        title: formData.title.trim(),
        paper_type: formData.paperType,
        category: formData.category,
        keywords: formData.keywords.trim(),
        doi: formData.doi.trim(),
        license_type: formData.licenseType,
        abstract: formData.abstract.trim(),
        file_name: uploadedFileName || (file && file.size > 0 ? file.name : (finalFileUrl ? 'Linked Document' : 'Manuscript Document')),
        file_url: finalFileUrl || undefined
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error('Submission failed:', e);
      setIsSubmitting(false);
      setFormError(e?.message || (lang === 'hi' ? 'शोध पत्र जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred during manuscript submission. Please try again.'));
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      authorName: '',
      email: '',
      coAuthors: '',
      affiliation: '',
      title: '',
      paperType: 'Journal Article',
      category: 'भाषाविज्ञान एवं लोकसाहित्य',
      keywords: '',
      doi: '',
      licenseType: 'CC-BY Open Access',
      abstract: '',
    });
    setFile(null);
    setFileUrlInput('');
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {lang === 'hi' ? 'शोध पत्र सफलतापूर्वक जमा हुआ!' : 'Paper Submitted Successfully!'}
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            {lang === 'hi' 
              ? 'आपका शोध पत्र/पांडुलिपि अकादमिक रिकॉर्ड्स व संपादकीय कतार में दर्ज कर ली गई है। डबल-ब्लाइंड पीर-रिव्यू समीक्षा के पश्चात आपको 15-30 दिनों के भीतर ईमेल द्वारा सूचित किया जाएगा।' 
              : 'Your research paper has been registered in our editorial queue. You will receive peer review feedback within 15-30 days.'}
          </p>
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('home')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-sm"
            >
              {lang === 'hi' ? 'होम पेज पर जाएं' : 'Return to Home'}
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition shadow-md text-sm"
            >
              {lang === 'hi' ? 'एक और शोध पत्र जोड़ें' : 'Submit Another Paper'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Strong Submission Landing Banner & Call to Action */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3.5 py-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase rounded-full tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.call_for_papers?.title_badge_hindi || 'शोध पत्र आमंत्रण'}</span>
          </span>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-200/90 bg-red-900/60 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'अंतिम तिथि:' : 'Deadline:'} <strong className="text-white">{settings.call_for_papers?.deadline_date || '31 October 2026'}</strong></span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight">
            {lang === 'hi' ? 'लेख भेजें / शोध पत्र सबमिट करें' : 'Submit Research Article'}
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            {lang === 'hi'
              ? `दिसंबर 2026 अंक (${settings.call_for_papers?.target_volume_issue || 'Vol. 2 Issue 2'}) हेतु पवारी भाषा, लोकसाहित्य, क्षेत्रीय बोलियों एवं संस्कृति पर मौलिक एवं अप्रकाशित शोध पत्र आमंत्रित हैं।`
              : `Inviting original research papers for December 2026 Issue (${settings.call_for_papers?.target_volume_issue || 'Vol. 2 Issue 2'}) in Pawari language, literature, dialects, and culture.`}
          </p>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a
            href={`mailto:${settings.contact_email}?subject=Manuscript Submission - Pawari Shodh Patrika&body=Respected Editor,%0D%0A%0D%0APlease find attached my research manuscript for consideration in Pawari Shodh Patrika.%0D%0A%0D%0ATitle:%0D%0AAuthor Name:%0D%0AInstitution/Affiliation:%0D%0AContact Email:`}
            className="flex items-center justify-center space-x-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-lg hover:shadow-xl"
          >
            <Mail className="w-4 h-4" />
            <span>{lang === 'hi' ? '📧 ईमेल द्वारा लेख भेजें' : '📧 Submit via Email'}</span>
          </a>

          <button
            onClick={() => setActiveView('author_guidelines')}
            className="flex items-center justify-center space-x-2 bg-red-900/80 hover:bg-red-900 text-amber-100 border border-amber-500/40 font-semibold px-6 py-3.5 rounded-2xl text-sm transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? '📖 लेखक निर्देश व नियम पढ़ें' : '📖 Read Author Guidelines'}</span>
          </button>
        </div>
      </div>

      {/* 2. Step-by-Step Submission Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-serif font-bold text-red-950 flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">i</span>
            <span>{lang === 'hi' ? 'सरल 5-चरणीय सबमिशन प्रक्रिया' : 'Simple 5-Step Submission Journey'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'hi' ? 'शोध पत्र जमा करने से लेकर प्रकाशन तक की पूरी पारदर्शी प्रक्रिया' : 'Transparent end-to-end journey from preparation to publication'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">01</div>
            <h3 className="font-bold text-amber-950 text-sm">
              {lang === 'hi' ? 'Word फ़ाइल तैयार करें' : 'Prepare Word File'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'मानक Word (.doc / .docx) प्रारूप में लिखें। (PDF मुख्य पाठ हेतु मान्य नहीं)।' : 'Write in Word format (.doc/.docx). PDF is not accepted for editable text.'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">02</div>
            <h3 className="font-bold text-amber-950 text-sm">
              {lang === 'hi' ? 'सार एवं कीवर्ड्स' : 'Abstract & Keywords'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'लगभग 200 शब्दों का सारांश (हिंदी व अंग्रेजी) और 4-6 बीज शब्द जोड़ें।' : 'Include ~200 word abstract and 4-6 keywords in Hindi & English.'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">03</div>
            <h3 className="font-bold text-amber-950 text-sm">
              {lang === 'hi' ? 'लेखक विवरण' : 'Author Details'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'मुख्य लेखक, सह-लेखक, ईमेल और विश्वविद्यालय/संस्थान की जानकारी दें।' : 'Provide author names, institutional affiliation, and active email.'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">04</div>
            <h3 className="font-bold text-amber-950 text-sm">
              {lang === 'hi' ? 'ईमेल या ऑनलाइन भेजें' : 'Send via Email or Form'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? `ईमेल करें: ${settings.contact_email} या नीचे दिए गए फॉर्म का उपयोग करें।` : `Email to ${settings.contact_email} or submit via online form below.`}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">05</div>
            <h3 className="font-bold text-amber-950 text-sm">
              {lang === 'hi' ? 'समीक्षा व प्रकाशन' : 'Review & Publish'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? '15-30 दिनों में डबल-ब्लाइंड पीर-रिव्यू रिपोर्ट व प्रकाशन पुष्टि।' : 'Double-blind review feedback and publication confirmation within 15-30 days.'}
            </p>
          </div>
        </div>

        {/* Quick Template Downloads */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>{lang === 'hi' ? 'लेखन सहायता:' : 'Helpful Resources:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? '📥 पांडुलिपि वर्ड टेम्पलेट डाउनलोड करें' : '📥 Download Word Template'}</span>
            </button>
            <button
              onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? '📥 कॉपीराइट स्वघोषणा पत्र डाउनलोड' : '📥 Download Copyright Form'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Structured Submission Guidelines Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-red-950 font-serif font-bold">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <h3>{lang === 'hi' ? 'शब्द सीमा (Word Limits)' : 'Article Word Limits'}</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'शोध पत्र (Research Paper): 3,000 से 5,000 शब्द।' : 'Research Paper: 3,000 to 5,000 words.'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'सामान्य लेख (General Article): 1,000 से 1,500 शब्द।' : 'General Article: 1,000 to 1,500 words.'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'शोध सार (Abstract): लगभग 200 शब्द।' : 'Abstract: Approximately 200 words.'}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-red-950 font-serif font-bold">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <h3>{lang === 'hi' ? 'भाषा एवं प्रारूप नियम' : 'Languages & Formatting'}</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'स्वीकृत भाषाएँ: हिंदी, अंग्रेजी, पवारी।' : 'Accepted Languages: Hindi, English, Pawari.'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'फ़ॉन्ट: यूनिकोड (मङ्गल) या Times New Roman (12pt)।' : 'Font: Unicode Mangal or Times New Roman (12pt).'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'सन्दर्भ शैली: APA (7th Edition) अनिवार्य।' : 'Citations: APA (7th Edition) format mandatory.'}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-red-950 font-serif font-bold">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <h3>{lang === 'hi' ? 'नीति एवं शुल्क' : 'Policy & APC'}</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'समीक्षा: डबल-ब्लाइंड पीर-रिव्यू (15-30 दिन)।' : 'Review: Double-blind peer review (15-30 days).'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'प्रकाशन शुल्क: शून्य प्रकाशन शुल्क (मुक्त पहुँच)।' : 'Publication Fee: Zero publication fee (Open Access).'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-slate-900 mr-1.5">•</span>
              <span>{lang === 'hi' ? 'प्लैगेरिज्म: 10% से कम समरूपता अनिवार्य।' : 'Plagiarism: Similarity index below 10%.'}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 4. Online Submission Form */}
      <div className="bg-white border border-amber-900/10 rounded-3xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-950 to-red-900 px-6 sm:px-10 py-6 text-amber-100">
          <h2 className="text-xl font-serif font-bold">
            {lang === 'hi' ? 'ऑनलाइन पांडुलिपि सबमिशन फॉर्म' : 'Online Manuscript Submission Form'}
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            {lang === 'hi' ? 'आप सीधे नीचे दिए गए फॉर्म के माध्यम से भी अपना शोध पत्र अपलोड कर सकते हैं।' : 'You can also submit your research paper directly using the secure form below.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          
          {/* Author Details */}
          <div className="space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">1</span>
              <span>{lang === 'hi' ? 'लेखक एवं संस्था विवरण (Author & Affiliation)' : 'Author & Affiliation Details'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'मुख्य लेखक का नाम (Primary Author Name)' : 'Primary Author Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={e => setFormData({...formData, authorName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: डॉ. रामेश्वर पवार' : 'e.g. Dr. Rameshwar Pawar'}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'ईमेल (Email Address)' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder="author@university.edu"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'सह-लेखक (Co-Authors, optional)' : 'Co-Authors'}
                </label>
                <input
                  type="text"
                  value={formData.coAuthors}
                  onChange={e => setFormData({...formData, coAuthors: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: डॉ. ए. के. शर्मा, प्रो. विकास वर्मा' : 'e.g. Dr. A. K. Sharma, Prof. Vikas Verma'}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'संस्थान / विश्वविद्यालय (University / Affiliation)' : 'Institution / Affiliation'}
                </label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={e => setFormData({...formData, affiliation: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: देवी अहिल्या विश्वविद्यालय, इंदौर' : 'e.g. Devi Ahilya University, Indore'}
                />
              </div>
            </div>
          </div>

          {/* Paper Title & Metadata */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">2</span>
              <span>{lang === 'hi' ? 'शोध पत्र शीर्षक एवं मेटाडेटा (Title & Metadata)' : 'Title & Paper Metadata'}</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'hi' ? 'शोध पत्र का पूरा शीर्षक (Full Title)' : 'Full Paper Title'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition font-serif font-bold text-slate-900"
                placeholder={lang === 'hi' ? 'अपने शोध पत्र का शीर्षक दर्ज करें...' : 'Enter the complete title of your research paper...'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'विषय श्रेणी (Category)' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                >
                  <option value="पवारी भाषा एवं साहित्य">1. पवारी (भोयरी/पंवारी) भाषा, साहित्य व व्याकरण</option>
                  <option value="मध्यप्रदेश की बोलियाँ व लोकभाषाएँ">2. मध्यप्रदेश की बोलियाँ (मालवी, निमाड़ी, बुन्देली, बघेली)</option>
                  <option value="जनजातीय भाषिक एवं सांस्कृतिक अध्ययन">3. जनजातीय भाषाएँ (गोंडी, कोरकू, नहाली, भीली)</option>
                  <option value="लोकसाहित्य एवं मौखिक परंपराएँ">4. लोकसाहित्य, लोकगीत, लोककथा व वाचिक परंपराएँ</option>
                  <option value="इतिहास, पुरालेख व वंशावली">5. क्षेत्रीय इतिहास, पुरालेख, ताम्रपत्र व गोत्र अध्ययन</option>
                  <option value="समाजशास्त्र एवं लोक-पारिस्थितिकी">6. समाजशास्त्र, लोकज्ञान, कृषि-संस्कृति व पारिस्थिकी</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'DOI (यदि उपलब्ध हो)' : 'DOI (Digital Object Identifier)'}
                </label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={e => setFormData({...formData, doi: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-amber-900"
                  placeholder="e.g. 10.5281/zenodo.1234567"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'बीज शब्द (4-6 Keywords)' : '4-6 Keywords / Tags'}
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. पवारी, भाषाविज्ञान, लोकगीत, बैतूल"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'hi' ? 'शोध सार (~200 शब्द Abstract)' : 'Abstract (~200 words)'}
              </label>
              <textarea
                rows={4}
                value={formData.abstract}
                onChange={e => setFormData({...formData, abstract: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition resize-y"
                placeholder={lang === 'hi' ? 'अपने शोध का संक्षिप्त सार (Abstract) लिखें...' : 'Provide abstract summarizing your research methodology & conclusions...'}
              />
            </div>
          </div>

          {/* Manuscript File Upload */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">3</span>
              <span>{lang === 'hi' ? 'पांडुलिपि फ़ाइल अपलोड (Word या PDF)' : 'Upload Manuscript File (Word or PDF)'}</span>
            </h3>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {lang === 'hi' 
                  ? 'स्वीकृत फ़ाइल प्रारूप: Word (.doc / .docx) अथवा PDF (.pdf) फ़ाइल। अधिकतम आकार: 15MB।' 
                  : 'Accepted file formats: Word (.doc / .docx) or PDF (.pdf) documents. Maximum size limit: 15MB.'}
              </span>
            </div>

            <FileUploadZone
              label={lang === 'hi' ? 'शोध पत्र फ़ाइल अपलोड (.doc / .docx / .pdf)' : 'Manuscript Document File Upload'}
              description={lang === 'hi' ? 'DOC, DOCX, या PDF फ़ाइल अपलोड करें। अधिकतम 15MB।' : 'Upload manuscript in DOC, DOCX, or PDF format (Max 15MB).'}
              acceptedCategory="documents"
              maxFiles={1}
              customFolder="submissions"
              onUploadComplete={(fileItem) => {
                setFileUrlInput(fileItem.url);
                setUploadedFileName(fileItem.name);
                setFormError(null);
              }}
              onRemoveFile={() => {
                setFileUrlInput('');
                setUploadedFileName('');
                setFile(null);
              }}
            />

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'या प्रत्यक्ष गूगल ड्राइव / क्लाउड लिंक दर्ज करें' : 'Or Provide Direct Google Drive / Cloud Document Link'}
              </label>
              <input
                type="url"
                value={fileUrlInput}
                onChange={e => {
                  setFileUrlInput(e.target.value);
                  setFormError(null);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-amber-500/50 outline-none"
                placeholder="https://docs.google.com/document/d/... or direct document URL"
              />
            </div>
          </div>

          {/* Validation Error Banner */}
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{formError}</div>
              <button 
                type="button" 
                onClick={() => setFormError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'hi' ? 'मुक्त पहुँच CC-BY लाइसेंस नीति लागू।' : 'Open Access CC-BY License Policy applies.'}</span>
            </p>
            <button
              type="submit"
              disabled={isSubmitting || (!fileUrlInput && (!file || file.size === 0))}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition ${
                isSubmitting || (!fileUrlInput && (!file || file.size === 0))
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-950 hover:bg-red-900 text-amber-100 hover:shadow-lg cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />
                  <span>{lang === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting Paper...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'शोध पत्र सबमिट करें (Submit Manuscript)' : 'Submit Manuscript'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
