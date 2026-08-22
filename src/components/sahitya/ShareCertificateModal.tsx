import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  MessageCircle,
  Sparkles,
  Award,
  Instagram,
  Facebook
} from 'lucide-react';
import { QuizCertificate } from '../../types';
import { downloadCertificateImage, downloadCertificatePdf, shareCertificate } from '../../utils/certificateExporter';

export interface ShareCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: QuizCertificate | null;
  canvasElementId?: string;
  lang?: 'hi' | 'en';
}

export const ShareCertificateModal: React.FC<ShareCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  canvasElementId = 'pawari-official-certificate-canvas',
  lang = 'hi'
}) => {
  const [isExporting, setIsExporting] = useState<'image' | 'pdf' | 'native' | null>(null);
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const quizUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://pawari-shodh-patrika.org'}/quiz?cert=${certificate.certificate_no}`;
  
  const shareText = `🚩 मैंने माँ ताप्ती पवारी शोध संस्थान द्वारा आयोजित "पवारी भोयरी संस्कृति ज्ञान परीक्षा" में ${certificate.percentage}% अंक (${certificate.quiz_score}/${certificate.total_questions}) प्राप्त कर ई-प्रमाण-पत्र (प्रमाण-पत्र क्र.: ${certificate.certificate_no}) अर्जित किया है! 

आप भी पवारी भाषा, लोकगीत, पहेली व साहित्य की परीक्षा दें और डिजिटल प्रमाण-पत्र प्राप्त करें:
${quizUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    setInstaCopied(true);
    setTimeout(() => setInstaCopied(false), 3500);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadImage = async () => {
    try {
      setIsExporting('image');
      await downloadCertificateImage({
        elementId: canvasElementId,
        userName: certificate.user_name,
        certificateNo: certificate.certificate_no,
        scale: 2.5
      });
    } catch (err) {
      alert(lang === 'hi' ? 'छवि डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Failed to download image. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting('pdf');
      await downloadCertificatePdf({
        elementId: canvasElementId,
        userName: certificate.user_name,
        certificateNo: certificate.certificate_no,
        scale: 3
      });
    } catch (err) {
      alert(lang === 'hi' ? 'पीडीएफ डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Failed to download PDF. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsExporting('native');
      await shareCertificate({
        elementId: canvasElementId,
        userName: certificate.user_name,
        score: certificate.quiz_score,
        total: certificate.total_questions,
        percentage: certificate.percentage,
        certificateNo: certificate.certificate_no,
        quizUrl,
        onFallback: () => {
          handleCopyLink();
        }
      });
    } finally {
      setIsExporting(null);
    }
  };

  // Social URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=PawariCulture,MaaTapti,ShodhPatrika`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'प्रमाण-पत्र साझा करें' : 'Share Certificate'}
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {certificate.user_name}
              </h3>
              <p className="text-xs text-stone-300">
                {certificate.percentage}% अंक • {certificate.certificate_no}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Action Download Buttons */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'hi' ? '1. प्रमाण-पत्र डाउनलोड विकल्प:' : '1. Certificate Download Formats:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting !== null}
                className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-red-950 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs group"
              >
                <ImageIcon className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
                <span>{isExporting === 'image' ? (lang === 'hi' ? 'जनरेट हो रहा है...' : 'Generating...') : (lang === 'hi' ? 'उच्च-गुणवत्ता इमेज (PNG)' : 'High-Res Image (PNG)')}</span>
                <span className="text-[10px] font-normal text-stone-500">सोशल मीडिया शेयर हेतु अनुकूल</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExporting !== null}
                className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs group"
              >
                <FileText className="w-5 h-5 text-red-700 group-hover:scale-110 transition-transform" />
                <span>{isExporting === 'pdf' ? (lang === 'hi' ? 'जनरेट हो रहा है...' : 'Generating...') : (lang === 'hi' ? 'A4 आधिकारिक PDF' : 'Official A4 PDF')}</span>
                <span className="text-[10px] font-normal text-stone-500">प्रिंट एवं लेमिनेशन हेतु सर्वोत्तम</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'hi' ? '2. सोशल मीडिया पर साझा करें:' : '2. Share on Social Media:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </a>

              <button
                type="button"
                onClick={handleInstagramShare}
                className="p-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-300 text-pink-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
                <span>Instagram</span>
              </button>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-900 text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center"
              >
                <span className="font-mono text-base font-bold">𝕏</span>
                <span>X (Twitter)</span>
              </a>
            </div>
            {instaCopied && (
              <p className="text-[11px] text-pink-700 font-semibold text-center animate-in fade-in duration-200">
                ✓ {lang === 'hi' ? 'प्रमाण-पत्र लिंक कॉपी हुआ! इंस्टाग्राम ओपन करके स्टोरी/पोस्ट में शेयर करें।' : 'Certificate text & link copied! Open Instagram to share.'}
              </p>
            )}
          </div>

          {/* Copy Share Text / Web Share */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'hi' ? '3. क्विज़ लिंक व संदेश कॉपी करें:' : '3. Copy Share Text & Link:'}
            </label>
            <div className="relative">
              <textarea
                readOnly
                rows={3}
                value={shareText}
                className="w-full p-3 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-800 font-sans focus:outline-hidden resize-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Direct Web Share API Button if available */}
          {typeof navigator !== 'undefined' && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={isExporting !== null}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-950 to-stone-900 hover:from-red-900 hover:to-stone-800 text-amber-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>{isExporting === 'native' ? (lang === 'hi' ? 'शेयर तैयार हो रहा है...' : 'Preparing share...') : (lang === 'hi' ? 'डिवाइस शेयर मेनू खोलें (Direct Share)' : 'Open Device Share Menu')}</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            {lang === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
