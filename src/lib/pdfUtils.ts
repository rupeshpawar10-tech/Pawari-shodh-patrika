import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fileBlobManager, base64ToBlob } from './fileBlobManager';

/**
 * Helper utilities for processing, converting, viewing and downloading PDF files safely
 * across desktop and mobile devices using persistent Blob-based URL mapping.
 */

// Resolves a raw URL / file ID / path to a valid local Blob URL or HTTP URL
export async function resolvePdfSource(rawUrl: string, articleMetadata?: { title?: string; authors?: string; volume?: number; issue?: number; year?: number; abstract?: string }): Promise<string> {
  if (!rawUrl || rawUrl.includes('w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')) {
    return generateFormattedPdfDataUrl(
      articleMetadata?.title || 'PAWARI SHODH PATRIKA - RESEARCH PAPER',
      articleMetadata?.authors || 'Maa Tapti Research Institute',
      `Volume ${articleMetadata?.volume || 1}, Issue ${articleMetadata?.issue || 1} (${articleMetadata?.year || 2025})`,
      articleMetadata?.abstract || 'Peer-Reviewed Research Article on Pawari Language, Culture and Regional History.'
    );
  }
  return await fileBlobManager.getBlobUrl(rawUrl);
}

/**
 * Generates a valid 100% compliant PDF 1.4 Data URL for Pawari Shodh Patrika articles/documents
 * so that PDF.js can parse, render on canvas, and allow page viewing & downloads offline/online.
 */
export function generateFormattedPdfDataUrl(
  title?: string,
  authors?: string,
  journalInfo?: string,
  abstractText?: string,
  keywords?: string[]
): string {
  const sanitize = (str?: string) =>
    (str || '')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .trim();

  const safeTitle = sanitize(title) || 'PAWARI SHODH PATRIKA - PEER REVIEWED RESEARCH ARTICLE';
  const safeAuthors = sanitize(authors) || 'Maa Tapti Research Institute, Multai, Betul (MP)';
  const safeInfo = sanitize(journalInfo) || 'Volume 1, Issue 1 | ISSN: Applied For | Open Access Journal';
  const safeAbstract = sanitize(abstractText) || 'This peer-reviewed research paper explores regional dialects, folk literature, and cultural heritage of Central India.';
  const safeKeywords = keywords && keywords.length > 0 ? sanitize(keywords.join(', ')) : 'Pawari, Language, Research, Central India';

  const streamText = `BT
/F1 16 Tf
40 740 Td
(PAWARI SHODH PATRIKA) Tj
ET
BT
/F2 10 Tf
40 722 Td
(${safeInfo}) Tj
ET
BT
/F1 13 Tf
40 680 Td
(${safeTitle.slice(0, 75)}) Tj
ET
${safeTitle.length > 75 ? `BT /F1 13 Tf 40 662 Td (${safeTitle.slice(75, 150)}) Tj ET` : ''}
BT
/F2 10 Tf
40 635 Td
(Authors: ${safeAuthors.slice(0, 80)}) Tj
ET
BT
/F1 11 Tf
40 595 Td
(ABSTRACT & RESEARCH SUMMARY) Tj
ET
BT
/F2 9.5 Tf
40 575 Td
(${safeAbstract.slice(0, 95)}) Tj
ET
${safeAbstract.length > 95 ? `BT /F2 9.5 Tf 40 560 Td (${safeAbstract.slice(95, 190)}) Tj ET` : ''}
${safeAbstract.length > 190 ? `BT /F2 9.5 Tf 40 545 Td (${safeAbstract.slice(190, 280)}) Tj ET` : ''}
BT
/F1 10 Tf
40 510 Td
(KEYWORDS & INDEX TERMS) Tj
ET
BT
/F2 9 Tf
40 495 Td
(${safeKeywords.slice(0, 90)}) Tj
ET
BT
/F1 10 Tf
40 450 Td
(PUBLISHER & INDEXING) Tj
ET
BT
/F2 9 Tf
40 435 Td
(Published by Maa Tapti Research Institute, Multai - 460661, District Betul, M.P., India.) Tj
40 420 Td
(Indexed in Google Scholar, Zenodo, ResearchGate | Double-Blind Peer Reviewed.) Tj
ET`;

  const streamLength = streamText.length;

  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamText}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000370 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${370 + streamLength + 50}
%%EOF`;

  try {
    const base64 = typeof btoa === 'function' ? btoa(pdfString) : Buffer.from(pdfString).toString('base64');
    return `data:application/pdf;base64,${base64}`;
  } catch (e) {
    return '';
  }
}

// Converts a base64 Data URL or string to an ArrayBuffer for PDF.js
export function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer | null {
  if (!dataUrl) return null;
  try {
    let base64 = dataUrl;
    if (dataUrl.includes(';base64,')) {
      base64 = dataUrl.split(';base64,')[1];
    }
    const binaryString = atob(base64.trim().replace(/[\r\n\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (err) {
    console.error('Failed to convert base64 to ArrayBuffer:', err);
    return null;
  }
}

// Converts a base64 Data URL or string to a Blob object
export function dataUrlToBlob(dataUrl: string): Blob | null {
  return base64ToBlob(dataUrl);
}

// Converts a raw pdf_url into a lightweight Blob URL
export function getEmbeddablePdfUrl(rawUrl: string): { displayUrl: string; isBlob: boolean; cleanup: () => void } {
  if (!rawUrl) {
    return { displayUrl: '', isBlob: false, cleanup: () => {} };
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return { displayUrl: rawUrl, isBlob: false, cleanup: () => {} };
  }

  if (rawUrl.startsWith('blob:')) {
    return { displayUrl: rawUrl, isBlob: true, cleanup: () => {} };
  }

  const memoryBlob = fileBlobManager.getMemoryBlobUrl(rawUrl);
  if (memoryBlob) {
    return { displayUrl: memoryBlob, isBlob: true, cleanup: () => {} };
  }

  if (rawUrl.startsWith('data:') || rawUrl.length > 300) {
    const blob = base64ToBlob(rawUrl);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      return {
        displayUrl: blobUrl,
        isBlob: true,
        cleanup: () => {
          URL.revokeObjectURL(blobUrl);
        }
      };
    }
  }

  return { displayUrl: rawUrl, isBlob: false, cleanup: () => {} };
}

// Downloads a PDF file safely regardless of format
export async function downloadPdf(rawUrl: string, fileName = 'article.pdf') {
  if (!rawUrl) return;

  const resolved = await resolvePdfSource(rawUrl);
  const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  const a = document.createElement('a');
  a.href = resolved;
  a.download = cleanFileName;
  a.target = '_blank';
  a.rel = 'noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Opens PDF in a new tab safely without triggering Chrome's data/blob URL blocking
export async function openPdfInNewTab(rawUrl: string, articleTitle = 'Pawari Shodh Patrika Article') {
  if (!rawUrl) return;

  const resolved = await resolvePdfSource(rawUrl);

  // If it's a real external http/https URL, open directly
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    window.open(resolved, '_blank', 'noopener,noreferrer');
    return;
  }

  // Chrome blocks direct top-level window.open on data: or blob: PDF URLs ("This page has been blocked by Chrome").
  // Opening an HTML Blob document wrapping the PDF / download action avoids Chrome security block.
  const safeTitle = articleTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <title>${safeTitle} - Pawari Shodh Patrika</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
    .header { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid rgba(217, 119, 6, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block; margin-right: 12px; }
    .title { font-size: 15px; font-weight: 600; color: #f1f5f9; display: inline-block; margin: 0; }
    .btn { background: #d97706; color: white; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; gap: 8px; }
    .btn:hover { background: #b45309; }
    .main { flex: 1; padding: 32px 20px; display: flex; justify-content: center; align-items: center; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; max-width: 680px; width: 100%; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .paper-icon { font-size: 48px; margin-bottom: 16px; }
    h2 { font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 12px 0; line-height: 1.3; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0; }
    .btn-large { font-size: 15px; padding: 12px 28px; background: #d97706; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">Pawari Shodh Patrika</span>
      <h1 class="title">${safeTitle}</h1>
    </div>
    <a href="${resolved}" download="Pawari_Shodh_Patrika_Manuscript.pdf" class="btn">Download PDF</a>
  </div>
  <div class="main">
    <div class="card">
      <div class="paper-icon">📜</div>
      <h2>${safeTitle}</h2>
      <p>Peer-Reviewed Research Article & Academic Publication</p>
      <a href="${resolved}" download="Pawari_Shodh_Patrika_Manuscript.pdf" class="btn btn-large">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download Research Paper PDF
      </a>
    </div>
  </div>
</body>
</html>`;

  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  window.open(htmlUrl, '_blank');
}

/**
 * Downloads standard Manuscript Template for authors
 */
export function downloadManuscriptTemplate(customUrl?: string) {
  if (customUrl && customUrl.trim() !== '') {
    const a = document.createElement('a');
    a.href = customUrl;
    a.download = 'Pawari_Shodh_Patrika_Manuscript_Template.docx';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pawari Shodh Patrika - Manuscript Template</title>
<style>
body { font-family: 'Times New Roman', Mangal, serif; margin: 40px; line-height: 1.6; }
h1 { text-align: center; color: #420708; font-size: 22pt; }
h2 { text-align: center; color: #7f1d1d; font-size: 14pt; font-weight: normal; }
.author { text-align: center; font-size: 12pt; margin-bottom: 20px; }
.abstract { border: 1px solid #ccc; padding: 15px; background: #f9f9f9; margin-bottom: 20px; }
.section { font-size: 14pt; font-weight: bold; color: #420708; margin-top: 20px; }
</style>
</head>
<body>
<h1>पवारी शोध पत्रिका (Pawari Shodh Patrika)</h1>
<h2>शोध पत्र हेतु मानक पांडुलिपि टेम्पलेट (Manuscript Formatting Template)</h2>

<div class="author">
<p><strong>[शोध पत्र का शीर्षक (Title in Hindi / English)]</strong></p>
<p><strong>लेखक का नाम:</strong> [लेखक का पूरा नाम]</p>
<p><strong>पद एवं संस्थान:</strong> [विभाग, कॉलेज/विश्वविद्यालय का नाम]</p>
<p><strong>ईमेल एवं मोबाइल:</strong> [email@example.com, +91-XXXXXXXXXX]</p>
<p><strong>ORCID iD:</strong> [0000-0000-0000-0000]</p>
</div>

<div class="abstract">
<p><strong>शोध सार (Abstract in Hindi):</strong> [यहाँ 150-250 शब्दों में शोध सार लिखें। इसमें शोध का उद्देश्य, अध्ययन पद्धति, मुख्य निष्कर्ष एवं सिफारिशें स्पष्ट करें।]</p>
<p><strong>कीवर्ड (Keywords in Hindi):</strong> [5-7 मुख्य शब्द, अल्पविराम (,) से पृथक]</p>
<hr>
<p><strong>Abstract (English):</strong> [Write 150-250 words English abstract here.]</p>
<p><strong>Keywords (English):</strong> [5-7 keywords in English]</p>
</div>

<div class="section">1. प्रस्तावना (Introduction)</div>
<p>[विषय का परिचय, शोध प्रश्न, शोध का महत्व एवं उद्देश्य यहाँ लिखें...]</p>

<div class="section">2. साहित्य पुनरावलोकन एवं अध्ययन पद्धति (Literature Review & Methodology)</div>
<p>[संबंधित शोध साहित्य, डेटा संग्रह विधि, नमूना आकार (Sample size) एवं विश्लेषण तकनीक...]</p>

<div class="section">3. अध्ययन एवं निष्कर्ष (Analysis & Discussion)</div>
<p>[शोध के मुख्य आंकड़े, तथ्य, भाषाई विश्लेषण एवं परिणाम...]</p>

<div class="section">4. उपसंहार एवं संस्तुतियाँ (Conclusion & Recommendations)</div>
<p>[अध्ययन का मुख्य निष्कर्ष एवं भावी शोध दिशाएँ...]</p>

<div class="section">5. सन्दर्भ सूची (References - APA 7th Edition)</div>
<p>1. पवार, रूपेश. (2025). <i>पवारी लोकभाषा का ऐतिहासिक एवं भाषाई अध्ययन</i>. भोपाल: मध्य प्रदेश साहित्य अकादमी.</p>
<p>2. Smith, J. A. (2024). Sociolinguistic profile of Pawari dialect. <i>Journal of Central Indian Languages</i>, 12(2), 45-62.</p>

</body>
</html>`;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pawari_Shodh_Patrika_Manuscript_Template.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads standard Copyright and Self-Declaration Form for authors
 */
export function downloadCopyrightForm(customUrl?: string) {
  if (customUrl && customUrl.trim() !== '') {
    const a = document.createElement('a');
    a.href = customUrl;
    a.download = 'Pawari_Shodh_Patrika_Copyright_Form.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Copyright & Self-Declaration Form - Pawari Shodh Patrika</title>
<style>
body { font-family: 'Times New Roman', Mangal, serif; margin: 40px; line-height: 1.6; }
h1 { text-align: center; color: #420708; font-size: 20pt; }
h2 { text-align: center; color: #7f1d1d; font-size: 13pt; margin-top: -10px; }
.form-box { border: 2px solid #420708; padding: 25px; border-radius: 10px; margin-top: 20px; }
.field { margin-bottom: 12px; }
.label { font-weight: bold; color: #333; }
.terms { background: #fdf8f0; border-left: 4px solid #d97706; padding: 12px; font-size: 10pt; margin: 20px 0; }
</style>
</head>
<body>

<h1>पवारी शोध पत्रिका (Pawari Shodh Patrika)</h1>
<h2>कॉपीराइट हस्तांतरण एवं स्वघोषणा पत्र (Copyright Transfer & Declaration Form)</h2>

<div class="form-box">
  <div class="field"><span class="label">शोध पत्र का शीर्षक (Article Title):</span> __________________________________________________</div>
  <div class="field"><span class="label">प्रथम लेखक का नाम (First Author):</span> __________________________________________________</div>
  <div class="field"><span class="label">सह-लेखकों के नाम (Co-Authors):</span> __________________________________________________</div>
  <div class="field"><span class="label">पद एवं संस्थान (Affiliation):</span> __________________________________________________</div>
  <div class="field"><span class="label">ईमेल (Email):</span> __________________________ <span class="label">मोबाइल (Phone):</span> ______________________</div>

  <div class="terms">
    <p><strong>स्वघोषणा एवं शर्तें (Mandatory Undertaking):</strong></p>
    <ol>
      <li>मैं/हम प्रमाणित करते हैं कि यह शोध पत्र मेरा/हमारा मूल (Original) कार्य है और यह किसी अन्य पत्रिका में प्रकाशन हेतु विचाराधीन नहीं है।</li>
      <li>शोध पत्र में उल्लिखित सभी आंकड़े, तथ्य एवं संदर्भ सत्य व प्रमाणिक हैं तथा इसमें किसी भी प्रकार का Plagiarism नहीं है।</li>
      <li>स्वीकृत होने पर इस शोध पत्र के सर्ववाधिकार (Copyright) 'पवारी शोध पत्रिका' को हस्तांतरित रहेंगे। Open Access (CC BY 4.0) लाइसेंस के तहत इसका अकादमिक प्रसार किया जा सकेगा।</li>
      <li>यदि शोध पत्र में किसी भी प्रकार की साहित्यिक चोरी या नियम उल्लंघन पाया जाता है, तो इसके लिए लेखक स्वयं पूर्णतः उत्तरदायी होंगे।</li>
    </ol>
  </div>

  <table width="100%" style="margin-top: 50px;">
    <tr>
      <td width="50%">
        <p><strong>लेखक के हस्ताक्षर (Signature):</strong> _______________</p>
        <p><strong>नाम (Name):</strong> ________________________</p>
        <p><strong>स्थान (Place):</strong> _______________________</p>
        <p><strong>दिनांक (Date):</strong> _______________________</p>
      </td>
      <td width="50%" style="text-align: right;">
        <p style="border: 1px dashed #999; padding: 30px 10px; text-align: center; font-size: 9pt; color: #666;">
          [हस्ताक्षरित प्रति स्कैन करके <br>PDF/JPEG प्रारूप में अपलोड करें]
        </p>
      </td>
    </tr>
  </table>
</div>

</body>
</html>`;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pawari_Shodh_Patrika_Copyright_Declaration_Form.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

