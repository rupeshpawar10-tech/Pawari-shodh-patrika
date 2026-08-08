import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ExternalLink, 
  FileText, 
  Loader2, 
  AlertCircle,
  Sidebar,
  BookOpen
} from 'lucide-react';
import { 
  downloadPdf, 
  openPdfInNewTab, 
  generateFormattedPdfDataUrl,
  dataUrlToArrayBuffer
} from '../../lib/pdfUtils';
import { useManagedBlobUrl } from '../../lib/fileBlobManager';

// Dependency-injected Worker setup for react-pdf
if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions) {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('[PdfCanvasViewer] Worker init note:', e);
  }
}

export interface PdfEngineDriver {
  pdfjsInstance?: typeof pdfjs;
  workerSrc?: string;
}

export interface PdfCanvasViewerProps {
  url: string;
  title?: string;
  authors?: string;
  journalInfo?: string;
  abstractText?: string;
  onDownload?: () => void;
  className?: string;
  engineDriver?: PdfEngineDriver;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  title = 'Document',
  authors,
  journalInfo,
  abstractText,
  onDownload,
  className = '',
  engineDriver
}) => {
  // 1. Secure Blob URL handling with automatic memory leak revocation
  const { resolvedUrl: managedBlobUrl, loading: resolvingBlob } = useManagedBlobUrl(url);

  // States for react-pdf document rendering
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const [rotation, setRotation] = useState<number>(0);
  const [pageInputText, setPageInputText] = useState<string>('1');
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<boolean>(false);
  const [fallbackDataUrl, setFallbackDataUrl] = useState<string>('');

  // View Mode: 'canvas' (react-pdf HTML5 Canvas), 'document' (formatted academic paper)
  const [viewMode, setViewMode] = useState<'canvas' | 'document'>('canvas');

  // Configure custom workerSrc if dependency-injected
  useEffect(() => {
    if (engineDriver?.workerSrc && pdfjs?.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = engineDriver.workerSrc;
    }
  }, [engineDriver]);

  // Reset page & errors when URL changes
  useEffect(() => {
    setCurrentPage(1);
    setPageInputText('1');
    setRenderError(false);
    setFallbackDataUrl('');
  }, [url]);

  // Fallback Data URL generation if primary document fails or is empty
  const activeSource = useMemo(() => {
    if (renderError || !managedBlobUrl) {
      if (!fallbackDataUrl) {
        const generated = generateFormattedPdfDataUrl(title, authors, journalInfo, abstractText);
        setFallbackDataUrl(generated);
        return generated;
      }
      return fallbackDataUrl;
    }
    return managedBlobUrl;
  }, [managedBlobUrl, renderError, fallbackDataUrl, title, authors, journalInfo, abstractText]);

  // Parse data URLs to Uint8Array for direct memory parsing by pdfjs without iframe/fetch blocks
  const pdfFileSource = useMemo(() => {
    if (!activeSource) return null;
    if (activeSource.startsWith('data:')) {
      const buffer = dataUrlToArrayBuffer(activeSource);
      if (buffer) {
        return { data: new Uint8Array(buffer) };
      }
    }
    return activeSource;
  }, [activeSource]);

  // Document success callback
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setPageInputText('1');
    setRenderError(false);
  }, []);

  // Document error callback: failover gracefully to Formatted Academic Article Document
  const onDocumentLoadError = useCallback((error: Error) => {
    console.warn('[PdfCanvasViewer] react-pdf worker or render error, auto-switching to article view:', error?.message || error);
    setRenderError(true);
    setViewMode('document');
  }, []);

  // Page input jump
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputText(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputText, 10);
    if (!isNaN(pageNum) && numPages && pageNum >= 1 && pageNum <= numPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInputText(String(currentPage));
    }
  };

  const handleDownload = () => {
    if (onDownload) onDownload();
    downloadPdf(url || activeSource, `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  };

  const handleOpenNewTab = () => {
    openPdfInNewTab(url || activeSource, title);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-100 shadow-2xl ${className}`}>
      
      {/* Viewer Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-slate-900 border-b border-slate-800 text-xs select-none">
        
        {/* Left: Page Navigation & Thumbnails toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {viewMode === 'canvas' && numPages && numPages > 1 && (
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 rounded-lg transition ${showThumbnails ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'hover:bg-slate-800 text-slate-300'}`}
              title="Toggle Thumbnails Sidebar"
            >
              <Sidebar className="w-4 h-4" />
            </button>
          )}

          {viewMode === 'canvas' && (
            <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  const prev = Math.max(currentPage - 1, 1);
                  setCurrentPage(prev);
                  setPageInputText(String(prev));
                }}
                disabled={currentPage <= 1 || resolvingBlob}
                className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-200 transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={pageInputText}
                  onChange={handlePageInputChange}
                  className="w-9 bg-slate-900 border border-slate-700 text-center font-mono text-xs rounded py-0.5 text-amber-300 focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 font-mono">/ {numPages || '-'}</span>
              </form>

              <button
                onClick={() => {
                  const next = Math.min(currentPage + 1, numPages || 1);
                  setCurrentPage(next);
                  setPageInputText(String(next));
                }}
                disabled={!numPages || currentPage >= numPages || resolvingBlob}
                className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-200 transition"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {viewMode === 'document' && (
            <div className="flex items-center space-x-2 text-slate-300">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-xs text-amber-400">Academic Article View</span>
            </div>
          )}
        </div>

        {/* Center: Zoom, Rotation Controls & Mode Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          {viewMode === 'canvas' && (
            <>
              <button
                onClick={() => setScale(s => Math.max(s - 0.15, 0.5))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setScale(1.1)}
                className="font-mono text-slate-300 hover:text-amber-300 px-1 text-center min-w-[42px]"
                title="Reset Zoom to 100%"
              >
                {Math.round(scale * 100)}%
              </button>

              <button
                onClick={() => setScale(s => Math.min(s + 0.2, 2.5))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-3.5 w-px bg-slate-800 mx-1" />

              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 transition"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="h-3.5 w-px bg-slate-800 mx-1" />
            </>
          )}

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-0.5 rounded transition font-medium ${viewMode === 'canvas' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Canvas Reader Mode"
            >
              PDF Canvas
            </button>
            <button
              onClick={() => setViewMode('document')}
              className={`px-2.5 py-0.5 rounded transition font-medium ${viewMode === 'document' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Formatted Article Text View"
            >
              Article Text
            </button>
          </div>
        </div>

        {/* Right: Actions */}
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
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Display Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Optional Page Thumbnails Sidebar (Canvas Mode) */}
        {viewMode === 'canvas' && showThumbnails && numPages && numPages > 1 && (
          <div className="w-48 bg-slate-900 border-r border-slate-800 overflow-y-auto p-2 space-y-3 shrink-0">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-1 mb-1">
              Document Pages ({numPages})
            </div>
            <Document file={pdfFileSource} loading={null}>
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1;
                const isSelected = pageNum === currentPage;
                return (
                  <button
                    key={`thumb_${pageNum}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      setPageInputText(String(pageNum));
                    }}
                    className={`w-full text-left p-1.5 rounded-lg transition border flex flex-col items-center ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="w-full bg-white rounded overflow-hidden flex justify-center py-1">
                      <Page
                        pageNumber={pageNum}
                        width={120}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                    <span className="text-[11px] font-mono mt-1 font-medium">
                      Page {pageNum}
                    </span>
                  </button>
                );
              })}
            </Document>
          </div>
        )}

        {/* Primary Page Content Container */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex items-center justify-center min-h-[480px]">
          {resolvingBlob && (
            <div className="flex flex-col items-center space-y-3 text-amber-400 p-8">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs font-mono text-slate-400">Loading Document Stream...</p>
            </div>
          )}

          {/* VIEW MODE 1: REACT-PDF CANVAS */}
          {!resolvingBlob && viewMode === 'canvas' && pdfFileSource && (
            <Document
              file={pdfFileSource}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center space-y-3 text-amber-400 p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <p className="text-xs font-mono text-slate-400">Parsing Academic PDF...</p>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                  <h4 className="font-semibold text-slate-200">Switching to Article View</h4>
                  <p className="text-xs text-slate-400">
                    Direct worker canvas rendering is restricted in this browser frame. You can view the complete formatted research paper text or download the PDF file directly.
                  </p>
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => setViewMode('document')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition"
                    >
                      View Article Text
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              }
            >
              <div className="shadow-2xl rounded overflow-hidden border border-slate-800 bg-white transition-all duration-200">
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            </Document>
          )}

          {/* VIEW MODE 2: FORMATTED ACADEMIC ARTICLE MANUSCRIPT DOCUMENT */}
          {(!resolvingBlob && (viewMode === 'document' || renderError)) && (
            <div className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-200 my-4 text-left font-serif leading-relaxed">
              <div className="border-b-2 border-amber-600 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
                    {title}
                  </h1>
                  {journalInfo && (
                    <p className="text-xs font-sans text-amber-700 font-semibold uppercase tracking-wider mt-1">
                      {journalInfo}
                    </p>
                  )}
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-sans font-bold px-2.5 py-1 rounded border border-amber-300 shrink-0 ml-2">
                  ISSN APPLIED
                </span>
              </div>

              {authors && (
                <div className="mb-6 font-sans">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Authors & Research Team</h4>
                  <p className="text-sm font-semibold text-slate-800">{authors}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Maa Tapti Research Institute, Multai, Betul (MP)</p>
                </div>
              )}

              {abstractText && (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-6 font-sans">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Abstract & Executive Summary
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{abstractText}"
                  </p>
                </div>
              )}

              <div className="space-y-4 text-sm text-slate-800 border-t border-slate-200 pt-6 font-sans">
                <div className="flex items-center justify-between bg-amber-50/80 p-4 rounded-lg border border-amber-200/80">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Full Peer-Reviewed Paper PDF</h5>
                    <p className="text-xs text-slate-600">Double-blind peer-reviewed academic article file</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};


