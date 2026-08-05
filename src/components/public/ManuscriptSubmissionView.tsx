import React, { useState, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Send, File as FileIcon, X, ShieldAlert, FileDown, FileCheck } from 'lucide-react';

export const ManuscriptSubmissionView: React.FC = () => {
  const { lang, setActiveView, addSubmission, settings } = useCms();
  
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    title: '',
    abstract: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        alert(lang === 'hi' ? 'कृपया केवल Word (.doc, .docx) या PDF फ़ाइल अपलोड करें।' : 'Please upload only Word (.doc, .docx) or PDF files.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        alert(lang === 'hi' ? 'कृपया केवल Word (.doc, .docx) या PDF फ़ाइल अपलोड करें।' : 'Please upload only Word (.doc, .docx) or PDF files.');
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert(lang === 'hi' ? 'कृपया शोध पत्र की फ़ाइल अपलोड करें।' : 'Please upload the manuscript file.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addSubmission({
        author_name: formData.authorName,
        email: formData.email,
        title: formData.title,
        abstract: formData.abstract,
        file_name: file.name
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert(lang === 'hi' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      authorName: '',
      email: '',
      title: '',
      abstract: '',
    });
    setFile(null);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-2xl p-10 border border-emerald-200 shadow-md text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {lang === 'hi' ? 'पांडुलिपि सफलतापूर्वक सबमिट हो गई!' : 'Manuscript Submitted Successfully!'}
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            {lang === 'hi' 
              ? 'आपकी पांडुलिपि हमें प्राप्त हो गई है। संपादकीय टीम इसकी प्रारंभिक जांच करेगी और जल्द ही आपके ईमेल पर आगे की प्रक्रिया की जानकारी भेजी जाएगी।' 
              : 'We have received your manuscript. The editorial team will conduct a preliminary check and notify you via email regarding the next steps.'}
          </p>
          <div className="pt-6 border-t border-slate-100 flex items-center justify-center space-x-4">
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              {lang === 'hi' ? 'होम पेज पर जाएं' : 'Return to Home'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md"
            >
              {lang === 'hi' ? 'एक और पांडुलिपि सबमिट करें' : 'Submit Another'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-10 shadow-md border border-amber-500/30">
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'शोध पत्र सबमिशन' : 'Manuscript Submission'}
        </h1>
        <p className="text-sm text-amber-200/80 mt-2">
          {lang === 'hi' 
            ? 'नीचे दिए गए फॉर्म को भरकर अपनी पांडुलिपि जमा करें। कृपया सुनिश्चित करें कि आपने लेखक दिशानिर्देशों का पालन किया है।' 
            : 'Submit your manuscript by filling out the form below. Please ensure you have followed the author guidelines.'}
        </p>
      </div>

      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Guidelines Reminder Banner */}
        <div className="bg-amber-50 border-b border-amber-200/50 p-4 sm:p-5 space-y-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 flex-1">
              <span className="font-bold">
                {lang === 'hi' ? 'महत्वपूर्ण निर्देश: ' : 'Important Note: '}
              </span>
              {lang === 'hi' 
                ? 'सबमिट करने से पहले सुनिश्चित करें कि आपकी फ़ाइल Word (.doc, .docx) या PDF प्रारूप में है और आपने पत्रिका के मानक टेम्पलेट का उपयोग किया है।' 
                : 'Before submitting, ensure your file is formatted in Word (.doc, .docx) or PDF as per the journal manuscript template.'}
              <button 
                onClick={() => setActiveView('author_guidelines')}
                className="ml-2 text-red-700 hover:underline font-bold"
              >
                {lang === 'hi' ? 'संपूर्ण नियम पढ़ें' : 'Read Full Guidelines'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1 pl-8">
            <button
              type="button"
              onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 rounded-lg text-xs font-bold text-amber-950 transition shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'पांडुलिपि टेम्पलेट (Word)' : 'Manuscript Template (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100/60 rounded-lg text-xs font-bold text-emerald-950 transition shadow-2xs"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'कॉपीराइट एवं स्वघोषणा पत्र' : 'Copyright Form (.doc/.pdf)'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Author Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                {lang === 'hi' ? 'लेखक का नाम (Corresponding Author)' : 'Corresponding Author Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={e => setFormData({...formData, authorName: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition"
                placeholder={lang === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                {lang === 'hi' ? 'ईमेल (Email Address)' : 'Email Address'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition"
                placeholder="name@university.edu"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              {lang === 'hi' ? 'शोध पत्र का शीर्षक (Manuscript Title)' : 'Manuscript Title'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition"
              placeholder={lang === 'hi' ? 'अपने शोध पत्र का शीर्षक यहाँ लिखें...' : 'Enter the title of your manuscript...'}
            />
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              {lang === 'hi' ? 'सारांश (Abstract)' : 'Abstract'}
            </label>
            <textarea
              rows={4}
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition resize-y"
              placeholder={lang === 'hi' ? 'अपने शोध का संक्षिप्त सारांश दर्ज करें (वैकल्पिक)...' : 'Brief abstract of your research (Optional)...'}
            />
          </div>

          {/* File Upload Drag & Drop */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              {lang === 'hi' ? 'पांडुलिपि फ़ाइल (Manuscript File)' : 'Manuscript File'} <span className="text-red-500">*</span>
            </label>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-amber-500 bg-amber-50/50' 
                  : file ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 hover:border-amber-400 bg-slate-50'
              }`}
            >
              {!file ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold mb-1">
                      {lang === 'hi' ? 'अपनी फ़ाइल यहाँ खींचें और छोड़ें' : 'Drag & drop your file here'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lang === 'hi' ? 'या ब्राउज़ करने के लिए नीचे क्लिक करें (.docx, .doc, .pdf)' : 'or click below to browse (.docx, .doc, .pdf)'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-700 text-slate-700 text-sm font-bold rounded-lg transition shadow-sm"
                  >
                    {lang === 'hi' ? 'फ़ाइल चुनें' : 'Select File'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-emerald-100 flex items-center justify-center relative">
                    <FileType className="w-8 h-8 text-emerald-500" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm max-w-xs w-full">
                    <FileIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'hi' ? 'आपका डेटा सुरक्षित है।' : 'Your data is securely transmitted.'}</span>
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                isSubmitting || !file 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-900 hover:bg-red-800 text-amber-100 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />
                  <span>{lang === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'पांडुलिपि सबमिट करें' : 'Submit Manuscript'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
