import React, { useEffect } from 'react';
import { X, Download, ExternalLink, BookOpen } from 'lucide-react';
import { downloadPdf, openPdfInNewTab } from '../../lib/pdfUtils';
import { PdfCanvasViewer, PdfEngineDriver } from './PdfCanvasViewer';

interface PdfViewerModalProps {
  url: string;
  title: string;
  authors?: string;
  journalInfo?: string;
  abstractText?: string;
  onClose: () => void;
  onDownload?: () => void;
  engineDriver?: PdfEngineDriver;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  url,
  title,
  authors,
  journalInfo,
  abstractText,
  onClose,
  onDownload,
  engineDriver
}) => {
  // Listen for Escape key press
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 text-slate-100 rounded-2xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/95 border-b border-slate-700/80 backdrop-blur">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 shrink-0">
              <BookOpen className="w-3 h-3 mr-1" />
              <span>Academic PDF</span>
            </span>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm sm:text-base text-slate-100 truncate max-w-md sm:max-w-2xl" title={title}>
                {title}
              </h3>
              {authors && (
                <p className="text-[11px] text-slate-400 truncate">
                  Authors: {authors}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={handleDownloadClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition shadow-sm"
              title="Download PDF File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleExternalOpen}
              className="p-2 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 hover:text-red-300 text-slate-400 rounded-lg transition"
              title="Close viewer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dependency-Injected Embedded PDF Canvas Viewer */}
        <div className="flex-1 bg-slate-950 overflow-hidden">
          <PdfCanvasViewer 
            url={url} 
            title={title} 
            authors={authors}
            journalInfo={journalInfo}
            abstractText={abstractText}
            onDownload={onDownload} 
            engineDriver={engineDriver}
            className="h-full rounded-none border-0" 
          />
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between select-none">
          <span className="truncate">Pawari Shodh Patrika - Peer-Reviewed Research Publication</span>
          <span className="hidden sm:inline text-slate-500">Press Esc or click backdrop to close</span>
        </div>

      </div>
    </div>
  );
};

