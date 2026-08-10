import React, { useEffect } from 'react';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';
import { downloadPdf, openPdfInNewTab } from '../../lib/pdfUtils';

const PdfCanvasViewer = React.lazy(() => import('./PdfCanvasViewer').then(m => ({ default: m.PdfCanvasViewer })));

interface PdfViewerModalProps {
  url: string;
  title: string;
  onClose: () => void;
  onDownload?: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  url,
  title,
  onClose,
  onDownload
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    }
    downloadPdf(url, `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  };

  const handleExternalOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    openPdfInNewTab(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PDF Document
            </span>
            <h3 id="pdf-viewer-modal-title" className="font-semibold text-sm sm:text-base text-slate-100 truncate max-w-md sm:max-w-xl" title={title}>
              {title}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadClick}
              aria-label="Download PDF document"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExternalOpen}
              className="p-2 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              aria-label="Open PDF in new tab"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 hover:text-red-300 text-slate-400 rounded-lg transition"
              aria-label="Close viewer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Canvas Viewer */}
        <div className="flex-1 bg-slate-950 overflow-hidden">
          <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center h-full text-amber-400 p-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs font-mono text-slate-400">Initializing PDF Engine...</p>
            </div>
          }>
            <PdfCanvasViewer url={url} title={title} onDownload={onDownload} className="h-full rounded-none border-0" />
          </React.Suspense>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Pawari Shodh Patrika - Peer-Reviewed PDF Document</span>
          <span className="hidden sm:inline">Press Esc or Close button to return</span>
        </div>

      </div>
    </div>
  );
};
