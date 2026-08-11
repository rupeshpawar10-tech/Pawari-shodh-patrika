import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerRaw from 'pdfjs-dist/build/pdf.worker.min.mjs?raw';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ExternalLink, 
  FileText, 
  Loader2, 
  AlertCircle,
  Printer,
  BookOpen,
  ShieldAlert,
  RotateCw,
  Eye
} from 'lucide-react';
import { 
  dataUrlToArrayBuffer, 
  dataUrlToBlob, 
  downloadPdf, 
  openPdfInNewTab, 
  resolvePdfSource 
} from '../../lib/pdfUtils';

// Configure pdfjs worker using a local Blob URL generated from raw bundled worker code.
// This guarantees zero cross-origin issues, zero worker load failures, and zero Chrome security blocks!
let globalWorkerBlobUrl = '';
try {
  if (pdfWorkerRaw) {
    const workerBlob = new Blob([pdfWorkerRaw], { type: 'text/javascript' });
    globalWorkerBlobUrl = URL.createObjectURL(workerBlob);
    pdfjsLib.GlobalWorkerOptions.workerSrc = globalWorkerBlobUrl;
  }
} catch (e) {
  console.warn('pdfjs local worker blob init note:', e);
}


interface PdfCanvasViewerProps {
  url: string;
  title?: string;
  onDownload?: () => void;
  className?: string;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  title = 'Document',
  onDownload,
  className = ''
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);
  const [resolvedSource, setResolvedSource] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setUseIframeFallback(false);
    pdfDocRef.current = null;
    setCurrentPage(1);

    let createdBlobUrl = '';

    async function loadPdf() {
      if (!url) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const resolved = await resolvePdfSource(url);
        if (!isMounted) return;

        setResolvedSource(resolved);

        let pdfDataBuffer: Uint8Array | null = null;

        // 1. Handle Base64 Data URL or raw base64 string
        if (resolved.startsWith('data:') || (!resolved.startsWith('http') && !resolved.startsWith('blob:') && resolved.length > 100)) {
          const arrayBuffer = dataUrlToArrayBuffer(resolved);
          const blob = dataUrlToBlob(resolved);
          
          if (blob) {
            createdBlobUrl = URL.createObjectURL(blob);
            setBlobUrl(createdBlobUrl);
          }

          if (arrayBuffer) {
            pdfDataBuffer = new Uint8Array(arrayBuffer);
          }
        } 
        // 2. Handle HTTP / HTTPS URL by converting to ArrayBuffer via fetch if possible
        else if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
          try {
            const res = await fetch(resolved, { mode: 'cors' });
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              pdfDataBuffer = new Uint8Array(buffer);
              const blob = new Blob([buffer], { type: 'application/pdf' });
              createdBlobUrl = URL.createObjectURL(blob);
              setBlobUrl(createdBlobUrl);
            }
          } catch (fetchErr) {
            console.warn('[PdfCanvasViewer] Direct fetch failed, trying url directly:', fetchErr);
          }
        }

        let loadingTask: any;

        if (pdfDataBuffer) {
          loadingTask = pdfjsLib.getDocument({ 
            data: pdfDataBuffer,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
            cMapPacked: true
          });
        } else if (createdBlobUrl) {
          loadingTask = pdfjsLib.getDocument({ url: createdBlobUrl });
        } else {
          loadingTask = pdfjsLib.getDocument({ url: resolved });
        }

        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
        setUseIframeFallback(false);
      } catch (err: any) {
        console.warn('[PdfCanvasViewer Load Warning]:', err?.message || err);
        if (isMounted) {
          // If initial attempt failed, try fallback without worker or display fallback card
          try {
            const resolved = await resolvePdfSource(url);
            const arrayBuffer = dataUrlToArrayBuffer(resolved);
            if (arrayBuffer) {
              const retryTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
              const pdf = await retryTask.promise;
              if (isMounted) {
                pdfDocRef.current = pdf;
                setNumPages(pdf.numPages);
                setLoading(false);
                setUseIframeFallback(false);
                return;
              }
            }
          } catch (retryErr) {
            console.error('[PdfCanvasViewer Retry Exception]:', retryErr);
          }

          setUseIframeFallback(true);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
      if (pdfDocRef.current && typeof pdfDocRef.current.destroy === 'function') {
        try {
          pdfDocRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [url]);

  // Render current page onto Canvas
  useEffect(() => {
    if (useIframeFallback || !pdfDocRef.current || loading) return;

    let isMounted = true;

    async function renderPage() {
      try {
        const page = await pdfDocRef.current!.getPage(currentPage);
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('[PdfCanvasViewer Render Exception] Switching to iframe fallback:', err);
          if (isMounted) {
            setUseIframeFallback(true);
          }
        }
      }
    }

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [currentPage, scale, loading, useIframeFallback]);

  const handleDownload = () => {
    if (onDownload) onDownload();
    downloadPdf(url, `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  };

  const handleOpenNewTab = () => {
    openPdfInNewTab(url);
  };

  const embedUrl = blobUrl || resolvedSource || url;

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-100 ${className}`}>
      
      {/* Viewer Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-slate-800/90 border-b border-slate-700/80 text-xs select-none">
        
        {/* Page Navigation */}
        {!useIframeFallback ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-slate-200 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-300 min-w-[70px] text-center">
              {numPages > 0 ? `${currentPage} / ${numPages}` : '-'}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
              disabled={currentPage >= numPages || loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-slate-200 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-slate-300">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="font-medium truncate max-w-xs">{title}</span>
          </div>
        )}

        {/* Zoom Controls (Canvas Mode Only) */}
        {!useIframeFallback && (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setScale(s => Math.max(s - 0.2, 0.6))}
              disabled={loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="font-mono text-slate-400 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={() => setScale(s => Math.min(s + 0.3, 2.5))}
              disabled={loading}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition shadow-sm"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Content Area */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex items-center justify-center min-h-[480px]">
        {loading && (
          <div className="flex flex-col items-center space-y-3 text-amber-400 p-8">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-xs font-mono text-slate-400">Loading PDF Document...</p>
          </div>
        )}

        {!loading && useIframeFallback && (
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <BookOpen className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                पवारी शोध पत्रिका (Pawari Shodh Patrika)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-3 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Peer-Reviewed Refereed Multidisciplinary Journal Document
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>PDF दस्तावेज़ सुरक्षित देखें (Document Access Ready)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                शोध पत्र की PDF फाइल पूरी तरह सुरक्षित और उपलब्ध है। आप इसे सीधे डाउनलोड कर सकते हैं या नई ब्राउज़र विंडो में पूर्ण रूप से खोल सकते हैं:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition shadow-lg hover:shadow-amber-600/20"
              >
                <Download className="w-4 h-4" />
                <span>PDF डाउनलोड करें (Download PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewTab}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-semibold rounded-xl transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>नई विंडो में खोलें (Open Full Window)</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !useIframeFallback && (
          <div className="shadow-2xl rounded overflow-hidden max-w-full my-auto border border-slate-800 bg-white">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>
        )}
      </div>

    </div>
  );
};
