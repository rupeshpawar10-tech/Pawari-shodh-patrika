import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportCertificateOptions {
  elementId: string;
  fileName?: string;
  userName?: string;
  certificateNo?: string;
  scale?: number;
}

/**
 * Capture an HTML element as a high-resolution HTML Canvas
 */
export async function captureCertificateCanvas(elementId: string, scale = 2): Promise<HTMLCanvasElement | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Certificate element with id "${elementId}" not found.`);
    return null;
  }

  try {
    // Scroll element into view and ensure images are loaded
    const canvas = await html2canvas(element, {
      scale: Math.max(scale, 2),
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFDF7',
      logging: false,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.width = '1120px';
          clonedEl.style.maxWidth = '1120px';
          clonedEl.style.minWidth = '1120px';
        }
      }
    });

    return canvas;
  } catch (error) {
    console.error('Failed to capture certificate canvas:', error);
    throw error;
  }
}

/**
 * Downloads high-res PNG image of the certificate
 */
export async function downloadCertificateImage(options: ExportCertificateOptions): Promise<string | null> {
  const canvas = await captureCertificateCanvas(options.elementId, options.scale || 2.5);
  if (!canvas) return null;

  return new Promise((resolve, reject) => {
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const safeName = (options.userName || 'Participant').replace(/\s+/g, '_');
      const safeNo = (options.certificateNo || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = options.fileName || `Pawari_Culture_Certificate_${safeName}_${safeNo}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      resolve(dataUrl);
    } catch (err) {
      console.error('Error generating image download:', err);
      reject(err);
    }
  });
}

/**
 * Generates and downloads an A4 Landscape PDF of the certificate
 */
export async function downloadCertificatePdf(options: ExportCertificateOptions): Promise<boolean> {
  const canvas = await captureCertificateCanvas(options.elementId, options.scale || 3);
  if (!canvas) return false;

  try {
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // A4 Landscape dimensions: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 297;
    const pdfHeight = 210;

    // Place image to fill A4 landscape with exact dimensions
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const safeName = (options.userName || 'Participant').replace(/\s+/g, '_');
    const safeNo = (options.certificateNo || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = options.fileName || `Pawari_Culture_Certificate_${safeName}_${safeNo}.pdf`;

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}

/**
 * Shares certificate using the Web Share API (with file attachment if supported, fallback to URL/text)
 */
export async function shareCertificate(options: {
  elementId: string;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  certificateNo: string;
  quizUrl?: string;
  onFallback?: () => void;
}): Promise<boolean> {
  const quizUrl = options.quizUrl || `${window.location.origin}/quiz`;
  const shareTitle = `पवारी भोयरी संस्कृति ज्ञान ई-प्रमाण-पत्र | ${options.userName}`;
  const shareText = `🚩 मैंने माँ ताप्ती पवारी शोध संस्थान द्वारा आयोजित "पवारी भोयरी संस्कृति ज्ञान परीक्षा" में ${options.percentage}% अंक (${options.score}/${options.total}) प्राप्त कर ई-प्रमाण-पत्र (प्रमाण-पत्र क्र.: ${options.certificateNo}) अर्जित किया है! आप भी अपनी संस्कृति ज्ञान की परीक्षा दें और डिजिटल प्रमाण-पत्र प्राप्त करें: ${quizUrl}`;

  // Try Web Share API with File
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const canvas = await captureCertificateCanvas(options.elementId, 2);
      if (canvas && typeof navigator.canShare === 'function') {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
        if (blob) {
          const file = new File([blob], `Pawari_Certificate_${options.certificateNo}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              files: [file],
              url: quizUrl
            });
            return true;
          }
        }
      }

      // Fallback share without file
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: quizUrl
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, using fallback:', err);
        if (options.onFallback) options.onFallback();
      }
      return false;
    }
  } else {
    // Desktop or unsupported browser
    if (options.onFallback) options.onFallback();
    return false;
  }
}
