import React, { useState, useRef } from 'react';
import { Download, FileText, Printer, Eye, X, Check, Loader2, Sparkles, ShieldCheck, Bookmark } from 'lucide-react';
import { Article } from '../../types';

interface AcademicPdfExporterProps {
  article: Article;
  buttonLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  lang?: 'hi' | 'en';
}

export const AcademicPdfExporter: React.FC<AcademicPdfExporterProps> = ({
  article,
  buttonLabel,
  variant = 'primary',
  lang = 'hi'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Download PDF Handler
  const handleGeneratePdf = async () => {
    if (!printContainerRef.current) return;
    setIsGenerating(true);
    setProgressText(lang === 'hi' ? 'पीडीएफ लाइब्रेरी लोड हो रही है...' : 'Loading PDF Library...');

    try {
      const element = printContainerRef.current;
      
      const [jspdfModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default?.jsPDF || (jspdfModule as any).default;
      const html2canvas = (html2canvasModule as any).default || html2canvasModule;

      if (!jsPDF || typeof jsPDF !== 'function') {
        throw new Error('jsPDF constructor not resolved');
      }

      setProgressText(lang === 'hi' ? 'पीडीएफ तैयार हो रहा है...' : 'Generating Typeset PDF...');

      // Ensure full rendering of element
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution crisp text rendering
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth || 800
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if multi-page document
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `${(article.title_english || article.title_hindi || 'Pawari_Research_Paper')
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .slice(0, 30)}_Typeset.pdf`;

      pdf.save(fileName);
      setIsGenerating(false);
      setProgressText('');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback: trigger browser native print
      alert(lang === 'hi' ? 'पीडीएफ डाउनलोड की प्रक्रिया में तकनीकी सहायता हेतु ब्राउज़र प्रिंट विंडो खोली जा रही है। कृपया "Save as PDF" चुनें।' : 'Opening browser print window to Save as PDF...');
      window.print();
      setIsGenerating(false);
      setProgressText('');
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Extract author list string
  const authorsText = article.authors && article.authors.length > 0
    ? article.authors.map(a => a.name_hindi || a.name_english || a.name || '').filter(Boolean).join(', ')
    : 'शोधकर्ता / Author';

  // Sections or custom content
  const sections = article.sections && article.sections.length > 0
    ? article.sections
    : [
        { id: '1', section_type: 'abstract', section_title: 'Abstract (सार)', content_html: `<p>${article.abstract_hindi || article.abstract_english || ''}</p>` },
        { id: '2', section_type: 'keywords', section_title: 'Keywords (कुंजी शब्द)', content_html: `<p>${(article.keywords || []).join(', ')}</p>` },
        { id: '3', section_type: 'introduction', section_title: '1. Introduction (प्रस्तावना)', content_html: article.full_text_introduction || '<p>प्रस्तावना का विवरण...</p>' },
        { id: '4', section_type: 'literature_review', section_title: '2. Literature Review (साहित्य अवलोकन)', content_html: article.full_text_literature_review || '' },
        { id: '5', section_type: 'methodology', section_title: '3. Methodology (कार्यप्रणाली)', content_html: article.full_text_methodology || '' },
        { id: '6', section_type: 'results', section_title: '4. Results & Discussion (परिणाम व विवेचना)', content_html: article.full_text_results_discussion || '' },
        { id: '7', section_type: 'conclusion', section_title: '5. Conclusion (निष्कर्ष)', content_html: article.full_text_conclusion || '' },
        { id: '8', section_type: 'references', section_title: 'References (संदर्भ सूची)', content_html: article.references && article.references.length > 0 ? `<ol>${article.references.map(r => `<li>${r.title} ${r.authors} (${r.year}).</li>`).join('')}</ol>` : '' }
      ].filter(s => s.content_html);

  return (
    <>
      {/* Trigger Button */}
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-xl transition"
          title={lang === 'hi' ? 'जर्नल टाइप्सेट PDF डाउनलोड करें' : 'Download Typeset Academic PDF'}
        >
          <FileText className="w-5 h-5" />
        </button>
      ) : variant === 'outline' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2 border border-amber-600 text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-amber-600" />
          <span>{buttonLabel || (lang === 'hi' ? 'Typeset PDF डाउनलोड' : 'Download Typeset PDF')}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{buttonLabel || (lang === 'hi' ? 'Typeset PDF डाउनलोड करें' : 'Download Typeset Academic PDF')}</span>
        </button>
      )}

      {/* PDF Typeset Preview & Download Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
          {/* Modal Header Toolbar */}
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-3 px-5 mb-4 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl sticky top-2 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-600/30 border border-amber-500/50 rounded-xl flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-300">
                  {lang === 'hi' ? 'जर्नल टाइप्सेट एकेडेमिक PDF (Typeset Academic Preview)' : 'Typeset Academic PDF Preview'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  ISSN: Will Apply | Peer-Reviewed Journal Layout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-600"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>प्रिंट (Print / Save PDF)</span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGeneratePdf}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progressText}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>PDF फ़ाइल डाउनलोड करें (Download PDF)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Typeset Article Canvas Container (A4 Printable Layout) */}
          <div className="w-full max-w-4xl bg-slate-200 p-2 sm:p-6 rounded-3xl overflow-x-auto shadow-2xl flex justify-center">
            <div
              ref={printContainerRef}
              id="printable-typeset-paper"
              className="bg-white text-slate-900 shadow-xl p-8 sm:p-12 w-[794px] min-h-[1123px] font-serif text-sm leading-relaxed border border-slate-300 relative select-text"
              style={{ fontFamily: 'Noto Serif Devanagari, Georgia, serif' }}
            >
              {/* Journal Official Header / Letterhead */}
              <div className="border-b-2 border-amber-900 pb-4 mb-6 text-center space-y-1">
                <div className="flex items-center justify-between text-[11px] font-sans font-semibold text-slate-600 border-b border-slate-200 pb-2 mb-3">
                  <span className="text-amber-900 font-bold">PAWARI RESEARCH JOURNAL (पावारी शोध पत्रिका)</span>
                  <span>ISSN (Online): Will Apply | ISSN (Print): Will Apply</span>
                  <span>Peer-Reviewed Refereed Journal</span>
                </div>

                <h1 className="font-serif font-black text-2xl text-amber-950 tracking-tight">
                  पावारी शोध पत्रिका (Pawari Research Journal)
                </h1>
                <p className="text-xs font-medium text-slate-700 italic">
                  An International Peer-Reviewed Refereed Multidisciplinary Research Journal on Pawari Language, Culture & Literature
                </p>
                <p className="text-[11px] font-mono text-slate-500 pt-1">
                  Volume {article.volume || 2}, Issue {article.issue || 1} ({article.year || 2026}) | Pages: {article.page_numbers || '01-15'} | DOI: {article.doi || '10.5281/zenodo.psp.2026.01'}
                </p>
              </div>

              {/* Article Header Metadata */}
              <div className="mb-6 space-y-3">
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider">
                  {article.article_type || 'Original Research Paper (मूल शोध आलेख)'}
                </div>

                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-950 leading-snug">
                  {article.title_hindi || article.title_english || 'शोध आलेख'}
                </h2>

                {article.title_english && article.title_hindi && (
                  <h3 className="font-serif font-medium text-base text-slate-700 italic">
                    {article.title_english}
                  </h3>
                )}

                {/* Author Details */}
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <p className="font-sans font-bold text-sm text-slate-900">
                    {authorsText}
                  </p>
                  {article.authors && article.authors[0] && (
                    <p className="font-sans text-xs text-slate-600">
                      {article.authors[0].affiliation && <span>{article.authors[0].affiliation} | </span>}
                      {article.authors[0].email && <span>Email: {article.authors[0].email}</span>}
                    </p>
                  )}
                </div>

                {/* Dates Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 px-3 text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <span>Received: {article.date_received || article.submitted_date || '2026-01-10'}</span>
                  <span>Accepted: {article.date_published || '2026-01-25'}</span>
                  <span>Published Online: {article.date_published || '2026-02-01'}</span>
                </div>
              </div>

              {/* Abstract Box */}
              {(article.abstract_hindi || article.abstract_english) && (
                <div className="bg-amber-50/70 border-l-4 border-amber-800 p-4 rounded-r-xl mb-6 space-y-2 text-xs">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-950">
                    Abstract / सार:
                  </h4>
                  {article.abstract_hindi && (
                    <p className="font-serif text-slate-800 leading-relaxed text-justify">
                      {article.abstract_hindi}
                    </p>
                  )}
                  {article.abstract_english && (
                    <p className="font-serif text-slate-700 italic leading-relaxed text-justify pt-1 border-t border-amber-200/60">
                      {article.abstract_english}
                    </p>
                  )}
                  {article.keywords && article.keywords.length > 0 && (
                    <p className="font-sans text-[11px] font-bold text-amber-900 pt-1">
                      Keywords / कुंजी शब्द: <span className="font-normal font-serif text-slate-800">{article.keywords.join(', ')}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Main Full-Text Sections */}
              <div className="space-y-6 text-slate-900 leading-relaxed text-justify">
                {sections.map((sec, idx) => {
                  if (sec.section_type === 'abstract' || sec.section_type === 'keywords') return null;
                  return (
                    <div key={sec.id || idx} className="space-y-2">
                      <h3 className="font-serif font-bold text-base text-amber-950 border-b border-slate-200 pb-1">
                        {sec.section_title}
                      </h3>
                      <div
                        className="typeset-html-content text-sm space-y-3"
                        dangerouslySetInnerHTML={{ __html: sec.content_html || '' }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Conflict of Interest & Acknowledgements */}
              {article.full_text_conflict_of_interest && (
                <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-600">
                  <p className="font-bold font-sans text-slate-800 mb-0.5">Conflict of Interest (हित-संघर्ष):</p>
                  <p>{article.full_text_conflict_of_interest}</p>
                </div>
              )}

              {/* Footer Watermark / Copyright */}
              <div className="mt-12 border-t-2 border-amber-900/30 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>© {article.year || 2026} Pawari Research Journal. Open Access Creative Commons CC-BY 4.0</span>
                <span>http://pawarishodhpatrika.org</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          body > *:not(#printable-typeset-paper) {
            /* Keep hidden from print */
          }
          #printable-typeset-paper, #printable-typeset-paper * {
            visibility: visible !important;
          }
          #printable-typeset-paper {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            padding: 15mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            z-index: 9999999 !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </>
  );
};
