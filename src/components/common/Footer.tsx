import React from 'react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  FileText, 
  Award,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, settings, setActiveView, setSelectedArticleId } = useCms();

  const handleNav = (page: PublicPageView) => {
    setSelectedArticleId(null);
    setActiveView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="relative text-amber-100/90 pt-16 pb-10 transition-colors duration-300 overflow-hidden border-t"
      style={{ 
        backgroundColor: 'var(--color-brand-primary)',
        borderColor: 'rgba(217, 119, 6, 0.35)' 
      }}
    >
      {/* Subtle background glossy ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(217, 119, 6, 0.25) 0%, transparent 70%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-10 mb-12 border-b border-amber-500/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-200">
                {lang === 'hi' ? 'डबल-ब्लाइंड पियर रिव्यू' : 'Double-Blind Review'}
              </p>
              <p className="text-[10px] text-amber-200/60">
                {lang === 'hi' ? 'कठोर शैक्षणिक मानक' : 'Rigorous Standards'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-200">
                {lang === 'hi' ? 'ओपन एक्सेस (Open Access)' : 'Open Access'}
              </p>
              <p className="text-[10px] text-amber-200/60">
                CC BY-NC 4.0 License
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-200">
                {lang === 'hi' ? 'शून्य प्रकाशन शुल्क (Zero APC)' : 'Zero APC'}
              </p>
              <p className="text-[10px] text-amber-200/60">
                {lang === 'hi' ? 'निःशुल्क शोध प्रकाशन' : 'Free Publication'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-200">
                {lang === 'hi' ? 'डिजिटल आर्काइविंग' : 'Digital Archiving'}
              </p>
              <p className="text-[10px] text-amber-200/60">
                DOI & Permanent Links
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Branding & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-bold font-serif shadow-lg shadow-amber-950/40 shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-amber-100 leading-tight">
                  {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
                </h3>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  {lang === 'hi' ? 'अंतर्राष्ट्रीय बहुविषयक शोध पत्रिका' : 'International Multidisciplinary Journal'}
                </p>
              </div>
            </div>

            <p className="text-xs text-amber-100/70 leading-relaxed pt-1">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 font-mono">
              <span>ISSN:</span>
              <strong className="text-amber-300 font-bold">{settings.issn_online || 'Applied For'}</strong>
              <span>(Online)</span>
            </div>
          </div>

          {/* Col 2: Digital Literature & Sahitya */}
          <div>
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {lang === 'hi' ? 'डिजिटल साहित्य व लोक संस्कृति' : 'Digital Literature & Culture'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href={getUrlForView('blog_list')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('blog_list'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '📝 शोध एवं विचार ब्लॉग' : 'Research & Culture Blog'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('submit_blog')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('submit_blog'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '✍️ ब्लॉग आलेख प्रस्तुत करें' : 'Submit a Blog Post'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('books_blogs')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('books_blogs'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '📚 पुस्तकें एवं साहित्य कोष' : 'Books & Literature'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('pawari_writers')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_writers'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '✍️ लेखक एवं साहित्यकार' : 'Writers & Authors'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('pawari_shabdkosh')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_shabdkosh'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '📖 पवारी शब्दकोश (Shabdkosh)' : 'Pawari Dictionary'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('pawari_paheli')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_paheli'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '🧩 पवारी पहेलियाँ (Paheli)' : 'Pawari Riddles'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('pawari_lokgeet')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_lokgeet'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '🎵 पवारी लोकगीत' : 'Pawari Folk Songs'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('pawari_quiz')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_quiz'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>{lang === 'hi' ? '🏆 पवारी संस्कृति प्रश्नोत्तरी' : 'Cultural Quiz'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Governance & Policies */}
          <div>
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {lang === 'hi' ? 'नीति एवं प्रशासन' : 'Ethics & Governance'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href={getUrlForView('editorial_board')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('editorial_board'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors block"
                >
                  {lang === 'hi' ? 'संपादकीय मंडल (Editorial Board)' : 'Editorial Board'}
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('about')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('about'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors block"
                >
                  {lang === 'hi' ? 'पीर समीक्षा एवं प्रकाशन नीति' : 'Peer Review & Publication Policy'}
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('about')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('about'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors block"
                >
                  {lang === 'hi' ? 'खुला पहुंच नीति (Open Access Policy)' : 'Open Access Policy'}
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('author_guidelines')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('author_guidelines'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors block"
                >
                  {lang === 'hi' ? 'लेखक दिशानिर्देश व प्लेगेरिज्म नीति' : 'Author Guidelines & Plagiarism'}
                </a>
              </li>
              <li>
                <a 
                  href={getUrlForView('contact')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('contact'); } }} 
                  className="text-amber-100/80 hover:text-amber-300 transition-colors block"
                >
                  {lang === 'hi' ? 'संपर्क एवं पूछताछ (Contact)' : 'Contact Editorial Office'}
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href={getUrlForView('admin')} 
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('admin'); } }} 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-[11px] transition-colors border border-amber-500/20"
                >
                  <Lock className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'एडमिन पोर्टल लॉगिन' : 'Admin CMS Portal'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial Office Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {lang === 'hi' ? 'संपादकीय कार्यालय' : 'Editorial Office'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-amber-100/80 leading-relaxed">
                  {lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="text-amber-200 hover:text-amber-300 underline underline-offset-2">
                  {settings.contact_email}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-100/80 font-mono">{settings.contact_phone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/70 gap-4 pt-6 border-t border-amber-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              {lang === 'hi' ? settings.footer_text_hindi : settings.footer_text_english}
            </p>
            <p className="text-[11px] text-amber-300/60 font-mono">
              {lang === 'hi'
                ? 'सभी प्रकाशित शोध लेख क्रिएटिव कॉमन्स एट्रीब्यूशन-नॉनकमर्शियल 4.0 इंटरनेशनल लाइसेंस (CC BY-NC 4.0) के तहत सुरक्षित हैं।'
                : 'All published research papers are licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).'}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-amber-300/80 shrink-0 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/10">
            <span>ISSN: {settings.issn_online || 'Applied For'}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{lang === 'hi' ? 'मुक्त पहुंच (Open Access)' : 'Open Access'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

