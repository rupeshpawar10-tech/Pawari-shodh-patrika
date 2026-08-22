import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle,
  Instagram,
  Facebook
} from 'lucide-react';

export interface SahityaShareBarProps {
  title: string;
  subtitle?: string;
  url?: string;
  category?: string;
  typeLabel?: string;
  lang?: 'hi' | 'en';
  variant?: 'compact' | 'full' | 'floating' | 'card';
  className?: string;
}

export const SahityaShareBar: React.FC<SahityaShareBarProps> = ({
  title,
  subtitle,
  url,
  category,
  typeLabel = 'पवारी साहित्य',
  lang = 'hi',
  variant = 'full',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [instaNotif, setInstaNotif] = useState(false);

  const getFullUrl = () => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    const origin = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://pawari-shodh-patrika.vercel.app';
    const path = url ? (url.startsWith('/') ? url : `/${url}`) : (typeof window !== 'undefined' ? window.location.pathname : '/');
    return `${origin}${path}`;
  };

  const currentUrl = getFullUrl();

  const getShareText = () => {
    const header = `📖 *${title}*`;
    const cat = category ? ` (${category})` : '';
    const sub = subtitle ? `\n_${subtitle}_` : '';
    const footer = `\n\nपवारी भाषा व संस्कृति के प्रामाणिक संकलन पर इसे पढ़ें व साझा करें:\n${currentUrl}\n\n— माँ ताप्ती पवारी शोध पत्रिका`;
    return `${header}${cat}${sub}${footer}`;
  };

  const handleCopyLink = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = currentUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      prompt(lang === 'hi' ? 'सीधे लिंक कॉपी करें:' : 'Copy direct link:', currentUrl);
    }
  };

  const handleWhatsAppShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = getShareText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await handleCopyLink();
    setInstaNotif(true);
    setTimeout(() => setInstaNotif(false), 3500);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${title} | ${typeLabel} — माँ ताप्ती पवारी शोध पत्रिका`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} | माँ ताप्ती पवारी शोध पत्रिका`,
          text: subtitle || `${title} (${typeLabel})`,
          url: currentUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
          title="WhatsApp पर साझा करें"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleFacebookShare}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer"
          title="Facebook पर साझा करें"
        >
          <Facebook className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleInstagramShare}
          className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 transition cursor-pointer"
          title="Instagram पर शेयर करें (लिंक कॉपी होगा)"
        >
          <Instagram className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition cursor-pointer"
          title="लिंक कॉपी करें"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`flex items-center justify-between gap-2 pt-3 border-t border-stone-100 ${className}`}>
        <span className="text-[11px] font-mono text-stone-500 font-semibold flex items-center gap-1">
          <Share2 className="w-3 h-3 text-stone-400" />
          <span>{lang === 'hi' ? 'शेयर करें:' : 'Share:'}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
              copied 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
            title="डायरेक्ट लिंक कॉपी करें"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{lang === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{lang === 'hi' ? 'कॉपी' : 'Copy'}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
            title="WhatsApp पर भेजें"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFacebookShare}
            className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer"
            title="Facebook पर साझा करें"
          >
            <Facebook className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleInstagramShare}
            className="p-1.5 rounded-md bg-gradient-to-tr from-amber-50 via-rose-50 to-pink-50 hover:from-amber-100 hover:to-pink-100 text-pink-700 border border-pink-200 transition cursor-pointer"
            title="Instagram पर शेयर करें (लिंक कॉपी होगा)"
          >
            <Instagram className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-amber-50/70 via-stone-50 to-orange-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Label and Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-900 border border-amber-300">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
              {lang === 'hi' ? 'सोशल मीडिया व मित्रों के साथ साझा करें' : 'Share with Friends & Scholars'}
            </span>
          </div>
          <p className="text-xs text-stone-600">
            {lang === 'hi'
              ? 'इस प्रामाणिक सामग्री को सीधे लिंक द्वारा व्हाट्सएप, फेसबुक, इंस्टाग्राम पर साझा करें।'
              : 'Share this authentic cultural content with direct permalink across WhatsApp, Facebook, Instagram.'}
          </p>
          {instaNotif && (
            <p className="text-[11px] text-pink-700 font-semibold animate-in fade-in duration-200">
              ✓ {lang === 'hi' ? 'लिंक कॉपी हो गया! इंस्टाग्राम पर पेस्ट करके स्टोरी या पोस्ट में शेयर करें।' : 'Link copied! Open Instagram and paste to share in story or post.'}
            </p>
          )}
        </div>

        {/* Share Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer shadow-2xs ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
            }`}
            title="डायरेक्ट वेब लिंक कॉपी करें"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>{lang === 'hi' ? 'कॉपी लिंक' : 'Copy Link'}</span>
              </>
            )}
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            title="WhatsApp पर भेजें"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Facebook पर साझा करें"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </button>

          {/* Instagram Button */}
          <button
            type="button"
            onClick={handleInstagramShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Instagram पर साझा करें (लिंक कॉपी होगा)"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </button>

          {/* Twitter / X Button */}
          <button
            type="button"
            onClick={handleTwitterShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            title="X (Twitter) पर पोस्ट करें"
          >
            <span className="font-mono text-xs">𝕏</span>
            <span>X</span>
          </button>

          {/* Web Share Native (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold transition cursor-pointer"
              title="अन्य ऐप्स पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

