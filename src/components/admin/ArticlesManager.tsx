import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import { Article, Author, CustomSectionBlock, Submission } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { ManuscriptReviewModal } from './ManuscriptReviewModal';
import { WordPasteImporter } from '../common/WordPasteImporter';
import { FullTextPublishingSuite } from './FullTextPublishingSuite';
import { AcademicPdfExporter } from '../common/AcademicPdfExporter';
import { FileUploadZone } from '../common/FileUploadZone';
import { ParsedWordArticle } from '../../lib/wordParser';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Eye, 
  Search, 
  Filter, 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Download,
  Link as LinkIcon,
  AlertTriangle,
  Info,
  UserPlus,
  ShieldCheck,
  BookOpen,
  Clock,
  Sparkles,
  Layers,
  FileType,
  Wand2,
  List,
  Sparkle,
  Copy,
  Calendar,
  Award,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const ArticlesManager: React.FC = () => {
  const { 
    lang,
    articles, 
    submissions,
    saveArticle, 
    deleteArticle, 
    uploadFileToStorage, 
    openPdfViewer,
    deleteSubmission,
    issues,
    setActiveView,
    setSelectedArticleId
  } = useCms();
  const { canManageArticles, isDirector, isSuperAdmin, currentUser } = useAuth();

  const [activeSection, setActiveSection] = useState<'published' | 'submissions'>('published');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [issueFilter, setIssueFilter] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'metadata' | 'history' | 'authors' | 'abstract' | 'fulltext' | 'blocks' | 'figures' | 'pdf'>('fulltext');
  
  // Figure Upload State
  const [uploadingFigId, setUploadingFigId] = useState<string | null>(null);
  const [figUploadPercent, setFigUploadPercent] = useState<number>(0);
  
  // Bulk Paste State
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [bulkPasteFeedback, setBulkPasteFeedback] = useState<string | null>(null);

  // Live Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Upload state
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploadPercent, setPdfUploadPercent] = useState<number>(0);
  const [pdfUploadTimingInfo, setPdfUploadTimingInfo] = useState<string | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);

  // Review modal state
  const [selectedReviewSubmission, setSelectedReviewSubmission] = useState<Submission | null>(null);

  // Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filtered articles
  const filtered = articles.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch = !q || a.title_hindi.toLowerCase().includes(q) || a.title_english.toLowerCase().includes(q) || a.authors.some(au => au.name.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesIssue = issueFilter === 'all' || `${a.volume}_${a.issue}` === issueFilter;
    return matchesSearch && matchesStatus && matchesIssue;
  });

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.author_name.toLowerCase().includes(q) || (s.email && s.email.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setSelectedArticleId('new');
    setActiveView('author_article_editor');
  };

  const handleEdit = (art: Article) => {
    setSelectedArticleId(art.id);
    setActiveView('author_article_editor');
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    await saveArticle(editingArticle);
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingArticle) return;

    setPdfUploadError(null);
    setPdfUploadTimingInfo(null);
    setPdfUploadPercent(0);

    const activeUser = currentUser || auth.currentUser;
    if (!activeUser) {
      setPdfUploadError('Please sign in with Google first before uploading files.');
      return;
    }

    setUploadingPdf(true);

    const userUid = activeUser.uid;
    const selectTime = new Date().toLocaleTimeString();
    const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const timestamp = Date.now();
    const targetPath = `users/${userUid}/pdfs/${timestamp}-${cleanName}`;

    setPdfUploadTimingInfo(`Selected "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB) at ${selectTime}`);

    try {
      const res = await uploadFileToStorage(file, undefined, (percent) => {
        setPdfUploadPercent(percent);
      });

      setEditingArticle(prev => prev ? {
        ...prev,
        pdf_url: res.fileId || res.path || res.url,
        pdf_storage_path: res.path
      } : null);

      setPdfUploadTimingInfo(`PDF file "${file.name}" uploaded successfully!`);
    } catch (err: any) {
      const msg = err?.message || String(err);
      setPdfUploadError(msg);
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  // Author helpers
  const handleAddAuthor = () => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      authors: [...editingArticle.authors, { name: '', affiliation: '', email: '', is_corresponding: false, orcid: '' }]
    });
  };

  const handleRemoveAuthor = (idx: number) => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      authors: editingArticle.authors.filter((_, i) => i !== idx)
    });
  };

  const handleAuthorChange = (idx: number, field: keyof Author, value: any) => {
    if (!editingArticle) return;
    const updated = [...editingArticle.authors];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditingArticle({ ...editingArticle, authors: updated });
  };

  // Smart Bulk Paste Parser
  const handleAutoSegmentBulkText = () => {
    if (!bulkPasteText.trim() || !editingArticle) return;

    const lines = bulkPasteText.split('\n');
    let currentSec = 'intro';

    const introLines: string[] = [];
    const litLines: string[] = [];
    const methLines: string[] = [];
    const resLines: string[] = [];
    const concLines: string[] = [];
    const ackLines: string[] = [];
    const refLines: string[] = [];

    for (const line of lines) {
      const lLower = line.trim().toLowerCase();

      if (/^(1\.|१\.)?\s*(prostavna|introduction|प्रस्तावना)/i.test(lLower)) {
        currentSec = 'intro';
        continue;
      } else if (/^(2\.|२\.)?\s*(literature review|sahitya|साहित्य अवलोकन)/i.test(lLower)) {
        currentSec = 'literature';
        continue;
      } else if (/^(3\.|३\.)?\s*(methodology|karyapranali|अनुसंधान कार्यप्रणाली|प्रणाली)/i.test(lLower)) {
        currentSec = 'methodology';
        continue;
      } else if (/^(4\.|४\.)?\s*(results|discussion|परिणाम एवं विश्लेषण|निष्कर्ष व परिणाम)/i.test(lLower)) {
        currentSec = 'results';
        continue;
      } else if (/^(5\.|५\.)?\s*(conclusion|निष्कर्ष)/i.test(lLower)) {
        currentSec = 'conclusion';
        continue;
      } else if (/(acknowledgement|आभार)/i.test(lLower)) {
        currentSec = 'ack';
        continue;
      } else if (/(references|bibliography|संदर्भ|ग्रंथसूची)/i.test(lLower)) {
        currentSec = 'references';
        continue;
      }

      if (currentSec === 'intro') introLines.push(line);
      else if (currentSec === 'literature') litLines.push(line);
      else if (currentSec === 'methodology') methLines.push(line);
      else if (currentSec === 'results') resLines.push(line);
      else if (currentSec === 'conclusion') concLines.push(line);
      else if (currentSec === 'ack') ackLines.push(line);
      else if (currentSec === 'references') refLines.push(line);
    }

    const cleanRefs = refLines
      .map(r => r.trim())
      .filter(r => r.length > 3 && !/^(references|bibliography|संदर्भ)/i.test(r));

    setEditingArticle({
      ...editingArticle,
      content_mode: 'full_text',
      full_text_introduction: introLines.join('\n').trim() || editingArticle.full_text_introduction,
      full_text_literature_review: litLines.join('\n').trim() || editingArticle.full_text_literature_review,
      full_text_methodology: methLines.join('\n').trim() || editingArticle.full_text_methodology,
      full_text_results_discussion: resLines.join('\n').trim() || editingArticle.full_text_results_discussion,
      full_text_conclusion: concLines.join('\n').trim() || editingArticle.full_text_conclusion,
      full_text_acknowledgement: ackLines.join('\n').trim() || editingArticle.full_text_acknowledgement,
      references: cleanRefs.length > 0 ? cleanRefs : editingArticle.references
    });

    setBulkPasteFeedback('Article text successfully auto-segmented into structured sections!');
  };

  const handleApplyWordParsed = (parsed: ParsedWordArticle) => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      title_hindi: parsed.title_hindi || editingArticle.title_hindi,
      title_english: parsed.title_english || editingArticle.title_english,
      authors: parsed.authors.length > 0 ? parsed.authors : editingArticle.authors,
      abstract_hindi: parsed.abstract_hindi || editingArticle.abstract_hindi,
      abstract_english: parsed.abstract_english || editingArticle.abstract_english,
      keywords: parsed.keywords.length > 0 ? parsed.keywords : editingArticle.keywords,
      full_text_introduction: parsed.full_text_introduction || editingArticle.full_text_introduction,
      full_text_literature_review: parsed.full_text_literature_review || editingArticle.full_text_literature_review,
      full_text_methodology: parsed.full_text_methodology || editingArticle.full_text_methodology,
      full_text_results_discussion: parsed.full_text_results_discussion || editingArticle.full_text_results_discussion,
      full_text_conclusion: parsed.full_text_conclusion || editingArticle.full_text_conclusion,
      full_text_acknowledgement: parsed.full_text_acknowledgement || editingArticle.full_text_acknowledgement,
      full_text_conflict_of_interest: parsed.full_text_conflict_of_interest || editingArticle.full_text_conflict_of_interest,
      references: parsed.references.length > 0 ? parsed.references : editingArticle.references,
      custom_sections: parsed.custom_sections.length > 0 ? [...(editingArticle.custom_sections || []), ...parsed.custom_sections] : editingArticle.custom_sections,
      content_mode: 'full_text'
    });
    setBulkPasteFeedback('Word document structure successfully mapped into journal paper template!');
  };

  // Custom Section Blocks helpers
  const handleAddCustomBlock = (type: CustomSectionBlock['type'], parentSec: CustomSectionBlock['parent_section'] = 'custom') => {
    if (!editingArticle) return;
    const newBlock: CustomSectionBlock = {
      id: 'cs_' + Date.now(),
      type,
      title: type === 'quote' ? 'Blockquote' : type === 'figure' ? 'Figure 1' : type === 'table' ? 'Table 1' : 'New Subheading',
      content: '',
      caption: '',
      image_url: '',
      parent_section: parentSec,
      table_data: type === 'table' ? { headers: ['Col 1', 'Col 2'], rows: [['Data 1', 'Data 2']] } : undefined
    };
    setEditingArticle({
      ...editingArticle,
      custom_sections: [...(editingArticle.custom_sections || []), newBlock]
    });
  };

  const handleRemoveCustomBlock = (id: string) => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      custom_sections: (editingArticle.custom_sections || []).filter(b => b.id !== id)
    });
  };

  const handleUpdateCustomBlock = (id: string, updates: Partial<CustomSectionBlock>) => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      custom_sections: (editingArticle.custom_sections || []).map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  const handleMoveCustomBlockUp = (index: number) => {
    if (!editingArticle || index <= 0) return;
    const list = [...(editingArticle.custom_sections || [])];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    setEditingArticle({ ...editingArticle, custom_sections: list });
  };

  const handleMoveCustomBlockDown = (index: number) => {
    if (!editingArticle) return;
    const list = [...(editingArticle.custom_sections || [])];
    if (index >= list.length - 1) return;
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    setEditingArticle({ ...editingArticle, custom_sections: list });
  };

  const renderCustomBlockCard = (block: CustomSectionBlock, bIdx: number) => {
    if (!editingArticle) return null;
    const totalBlocks = (editingArticle.custom_sections || []).length;
    return (
      <div key={block.id} className="p-3 bg-white border border-amber-900/20 rounded-xl space-y-2 text-xs shadow-2xs my-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold text-[10px] uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              #{bIdx + 1} {block.type}
            </span>
            
            {/* Move Up / Move Down buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                type="button"
                disabled={bIdx === 0}
                onClick={() => handleMoveCustomBlockUp(bIdx)}
                title="Move Up"
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ↑ Up
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                disabled={bIdx === totalBlocks - 1}
                onClick={() => handleMoveCustomBlockDown(bIdx)}
                title="Move Down"
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ↓ Down
              </button>
            </div>

            {/* Parent Section Selector Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500">In Section:</span>
              <select
                value={block.parent_section || 'custom'}
                onChange={e => handleUpdateCustomBlock(block.id, { parent_section: e.target.value as any })}
                className="p-0.5 text-[10px] font-bold bg-amber-50 border border-amber-300 rounded text-amber-950"
              >
                <option value="intro">1. Introduction</option>
                <option value="literature">2. Literature Review</option>
                <option value="methodology">3. Methodology</option>
                <option value="results">4. Results & Discussion</option>
                <option value="conclusion">5. Conclusion</option>
                <option value="custom">7. Additional Section</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleRemoveCustomBlock(block.id)}
            className="text-red-600 hover:text-red-800 text-[10px] font-bold"
          >
            Remove
          </button>
        </div>

        <div className="space-y-1">
          {block.type === 'heading_h2' && (
            <span className="inline-block text-[10px] font-bold text-red-950 bg-amber-200 px-2 py-0.5 rounded uppercase tracking-wider mb-1">
              ★ Main Heading (मुख्य शीर्ष शीर्षक)
            </span>
          )}
          <input
            type="text"
            value={block.title || ''}
            onChange={e => handleUpdateCustomBlock(block.id, { title: e.target.value })}
            placeholder={block.type === 'heading_h2' ? "Main Heading Title (e.g. 2. Literature Review / 3. Case Study / 4. Theoretical Framework)" : "Subheading / Figure Label (e.g. 1.1 Context / Figure 1)"}
            className={`w-full p-2 border rounded font-bold text-slate-800 text-xs ${
              block.type === 'heading_h2' ? 'bg-amber-50/70 border-amber-300 font-serif text-sm text-red-950' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>

        {block.type === 'figure' && (
          <div className="space-y-2 p-2 bg-emerald-50/60 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between gap-2">
              <label className="font-bold text-[10px] text-emerald-900">Figure Image URL or Direct File Upload:</label>
              <label className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFigureUpload(block.id, file);
                  }}
                />
              </label>
            </div>

            <input
              type="text"
              value={block.image_url || ''}
              onChange={e => handleUpdateCustomBlock(block.id, { image_url: e.target.value })}
              placeholder="Image URL (e.g. https://...)"
              className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono text-[11px]"
            />

            {block.image_url && (
              <div className="flex items-center gap-3 bg-white p-1 rounded border border-emerald-100">
                <img src={block.image_url} alt="" className="w-14 h-10 object-cover rounded border" />
                <span className="text-[10px] text-emerald-700 font-bold">Image Uploaded Successfully</span>
              </div>
            )}
          </div>
        )}

        {block.type === 'table' && (
          <div className="space-y-2 p-2 bg-amber-50/70 rounded-lg border border-amber-200">
            <div>
              <label className="block text-[10px] font-bold text-amber-900 mb-0.5">
                Table Headers (Comma Separated):
              </label>
              <input
                type="text"
                value={(block.table_data?.headers || ['Header 1', 'Header 2']).join(', ')}
                onChange={e => {
                  const headers = e.target.value.split(',').map(s => s.trim());
                  handleUpdateCustomBlock(block.id, {
                    table_data: {
                      headers,
                      rows: block.table_data?.rows || [['Val 1', 'Val 2']]
                    }
                  });
                }}
                className="w-full p-1.5 bg-white border rounded font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-amber-900 mb-0.5">
                Table Rows (One row per line, comma separated values):
              </label>
              <textarea
                rows={2}
                value={(block.table_data?.rows || [['Val 1', 'Val 2']]).map(r => r.join(', ')).join('\n')}
                onChange={e => {
                  const rows = e.target.value.split('\n').map(line => line.split(',').map(s => s.trim()));
                  handleUpdateCustomBlock(block.id, {
                    table_data: {
                      headers: block.table_data?.headers || ['Header 1', 'Header 2'],
                      rows
                    }
                  });
                }}
                placeholder="Row 1 Val 1, Row 1 Val 2&#10;Row 2 Val 1, Row 2 Val 2"
                className="w-full p-1.5 bg-white border rounded font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        <textarea
          rows={2}
          value={block.content || ''}
          onChange={e => handleUpdateCustomBlock(block.id, { content: e.target.value })}
          placeholder="Text content, paragraph, or figure caption..."
          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
        />
      </div>
    );
  };

  const handleAddFigureBlock = (placement: 'in_body' | 'at_end' = 'in_body') => {
    if (!editingArticle) return;
    const existingFigs = (editingArticle.custom_sections || []).filter(b => b.type === 'figure');
    const figNum = existingFigs.length + 1;
    const newBlock: CustomSectionBlock = {
      id: 'cs_fig_' + Date.now(),
      type: 'figure',
      title: `Figure ${figNum}`,
      content: '',
      caption: '',
      image_url: '',
      alt_text: '',
      is_decorative: false,
      source_credit: '',
      figure_number: figNum,
      placement
    };
    setEditingArticle({
      ...editingArticle,
      custom_sections: [...(editingArticle.custom_sections || []), newBlock]
    });
    setEditorTab('figures');
  };

  const handleFigureUpload = async (blockId: string, file: File) => {
    if (!file) return;
    try {
      setUploadingFigId(blockId);
      setFigUploadPercent(0);
      const res = await uploadFileToStorage(file, 'article_figures', (progress) => {
        setFigUploadPercent(progress);
      });
      if (res.url) {
        handleUpdateCustomBlock(blockId, { image_url: res.url });
      }
    } catch (err: any) {
      console.error('Figure image upload failed:', err);
      alert('Failed to upload figure image: ' + (err?.message || 'Upload error'));
    } finally {
      setUploadingFigId(null);
      setFigUploadPercent(0);
    }
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down' | 'to_end' | 'to_body') => {
    if (!editingArticle || !editingArticle.custom_sections) return;
    const sections = [...editingArticle.custom_sections];
    const index = sections.findIndex(b => b.id === id);
    if (index === -1) return;

    if (direction === 'to_end') {
      sections[index] = { ...sections[index], placement: 'at_end' };
    } else if (direction === 'to_body') {
      sections[index] = { ...sections[index], placement: 'in_body' };
    } else if (direction === 'up' && index > 0) {
      const temp = sections[index];
      sections[index] = sections[index - 1];
      sections[index - 1] = temp;
    } else if (direction === 'down' && index < sections.length - 1) {
      const temp = sections[index];
      sections[index] = sections[index + 1];
      sections[index + 1] = temp;
    }

    setEditingArticle({
      ...editingArticle,
      custom_sections: sections
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Articles & Full-Text Publication CMS</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Publish searchable, structured full-text articles with live preview, auto-segmentation, and PDF generation.</p>
        </div>

        {canManageArticles && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Publish Full-Text Article (नया शोध पत्र जोड़ें)</span>
          </button>
        )}
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => { setActiveSection('published'); setSearch(''); setStatusFilter('all'); setIssueFilter('all'); }}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
            activeSection === 'published'
              ? 'bg-red-950 text-amber-100 shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Published Articles ({articles.length})</span>
        </button>

        <button
          onClick={() => { setActiveSection('submissions'); setSearch(''); setStatusFilter('all'); setIssueFilter('all'); }}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
            activeSection === 'submissions'
              ? 'bg-red-950 text-amber-100 shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Incoming Manuscripts ({submissions.length})</span>
          {submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length > 0 && (
            <span className="ml-1 bg-amber-500 text-red-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length} New
            </span>
          )}
        </button>
      </div>

      {/* Toolbar Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title, author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {activeSection === 'published' && (
            <>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={issueFilter}
                onChange={e => setIssueFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Journal Issues</option>
                {issues.map(iss => (
                  <option key={iss.id} value={`${iss.volume}_${iss.issue_number}`}>
                    Vol {iss.volume}, Issue {iss.issue_number} ({iss.year})
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* SECTION 1: Published Articles List Table */}
      {activeSection === 'published' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50 border border-amber-300/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <Info className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <strong className="block font-serif text-slate-900">पब्लिक वेबसाइट विजिबिलिटी (Public Website Visibility):</strong>
                <span>सार्वजनिक पाठकों को केवल <strong className="text-emerald-800">"Published"</strong> स्टेटस वाले शोध पत्र ही दिखते हैं। ड्राफ्ट (Draft) या पेंडिंग शोध पत्रों को सार्वजनिक रूप से दिखाने हेतु नीचे टेबल में स्टेटस को <strong className="text-emerald-800">"Published"</strong> चुनें।</span>
              </div>
            </div>
            <span className="shrink-0 px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-lg text-[11px] font-mono">
              {articles.filter(a => !a.status || a.status.toLowerCase() === 'published' || a.status.toLowerCase() === 'accepted').length} Published Papers Live
            </span>
          </div>

          <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-serif font-bold text-lg text-slate-800">No Articles Found</p>
              <p className="text-xs">Try adjusting your search criteria or create a new full-text article.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-serif font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4">Article Title & DOI</th>
                    <th className="p-4">Authors</th>
                    <th className="p-4">Issue / Volume</th>
                    <th className="p-4">Content Type</th>
                    <th className="p-4">Status & Visibility</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((art) => (
                    <tr key={art.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-4 max-w-sm">
                        <p className="font-serif font-bold text-slate-900 text-sm line-clamp-2">{art.title_hindi}</p>
                        <p className="text-xs text-slate-600 italic line-clamp-1 mt-0.5">{art.title_english}</p>
                        <p className="text-[10px] text-amber-800 font-mono mt-1">DOI: {art.doi || 'Not set'}</p>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="font-bold text-slate-800 line-clamp-2">
                          {art.authors.map(a => a.name).join(', ')}
                        </p>
                      </td>

                      <td className="p-4 font-mono">
                        Vol {art.volume}, Issue {art.issue} ({art.year})
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          art.content_mode === 'full_text' || art.full_text_introduction
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {art.content_mode === 'full_text' || art.full_text_introduction ? 'Full-Text Paper' : 'PDF Only'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col space-y-1.5 min-w-[130px]">
                          <select
                            value={art.status || 'published'}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              saveArticle({ ...art, status: newStatus as any });
                            }}
                            className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition ${
                              (art.status?.toLowerCase() === 'published' || art.status?.toLowerCase() === 'accepted' || !art.status)
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 focus:ring-emerald-400'
                                : art.status === 'draft'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 focus:ring-amber-400'
                                : 'bg-slate-50 text-slate-800 border-slate-300'
                            }`}
                          >
                            <option value="published">✓ Published (सार्वजनिक)</option>
                            <option value="draft">Draft (ड्राफ्ट - अप्रकाशित)</option>
                            <option value="under_review">Under Review (समीक्षाधीन)</option>
                            <option value="archived">Archived (संग्रहीत)</option>
                          </select>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(art.status?.toLowerCase() === 'published' || art.status?.toLowerCase() === 'accepted' || !art.status) ? '🟢 Live on website' : '🟡 Hidden from public'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(art)}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-lg transition inline-flex items-center space-x-1"
                          title="Edit Full Text & Metadata"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Article</span>
                        </button>

                        <button
                          onClick={() => setActiveView('article_detail', art.slug || art.id)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition"
                          title="वेबसाइट पर प्रकाशित लेख देखें (View Article)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <AcademicPdfExporter
                          article={art}
                          variant="icon"
                          lang={lang}
                        />

                        <button
                          onClick={() => {
                            const cloned: Article = {
                              ...art,
                              id: 'art_' + Date.now(),
                              title_hindi: `${art.title_hindi} (प्रतिलिपि / Copy)`,
                              title_english: `${art.title_english} (Copy)`,
                              slug: `${art.slug}-copy-${Date.now()}`,
                              status: 'draft',
                              created_at: new Date().toISOString().split('T')[0]
                            };
                            saveArticle(cloned);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Duplicate Article as Draft"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>

                        {canManageArticles && (
                          <button
                            onClick={() => setDeleteId(art.id)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="शोध पत्र हटाएं (Delete Article)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      )}

      {/* SECTION 2: Submissions Workflow Table */}
      {activeSection === 'submissions' && (
        <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-serif font-bold text-lg text-slate-800">No Manuscripts Found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-serif font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4">Submitted Manuscript Title</th>
                    <th className="p-4">Author Info</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Review Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-4 max-w-xs font-serif font-bold text-slate-900">{sub.title}</td>
                      <td className="p-4 font-bold text-slate-800">{sub.author_name} ({sub.email})</td>
                      <td className="p-4 font-mono">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold uppercase">{sub.status}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedReviewSubmission(sub)}
                          className="px-3 py-1.5 bg-red-950 text-amber-100 font-bold text-xs rounded-lg inline-flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Review & Publish</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FULL-TEXT ARTICLE PUBLISHING SUITE (शोध आलेख संपादक) */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-7xl w-full max-h-[96vh] overflow-y-auto shadow-2xl relative">
            <FullTextPublishingSuite
              article={editingArticle}
              onSave={async (updatedArt) => {
                await saveArticle(updatedArt);
                setEditingArticle(updatedArt);
              }}
              onClose={() => {
                setIsModalOpen(false);
                setEditingArticle(null);
              }}
              lang="hi"
            />
          </div>
        </div>
      )}

      {/* REPLACED OLD MODAL CONTAINER */}
      {false && isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 px-6 py-4 border-b border-amber-500/30">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-100">
                    {editingArticle.id ? 'शोध आलेख संपादक (Article Editor)' : 'नया शोध आलेख जोड़ें (Add Research Article)'}
                  </h2>
                  <p className="text-[11px] text-amber-300/80 font-mono">
                    वर्ड दस्तावेज़ या टेक्स्ट पेस्ट करें, शीर्षक व लेखक जोड़ें और आसानी से प्रकाशित करें।
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Live Preview Paper</span>
                </button>

                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 text-amber-200/80 hover:text-white rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex flex-wrap gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditorTab('fulltext')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'fulltext' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span>1. मुख्य पाठ एवं वर्ड पेस्ट (Full Text & Word)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('metadata')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'metadata' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. शीर्षक एवं मेटाडेटा (Title & DOI)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('authors')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'authors' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>3. लेखक (Authors)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('abstract')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'abstract' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>4. सारांश व कुंजी शब्द (Abstract & Keywords)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('history')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'history' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>5. प्रकाशन तिथियां (Dates)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('blocks')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'blocks' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>6. अतिरिक्त भाग (Custom Sections)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('figures')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'figures' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>7. Figures & Plates (चित्र)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('pdf')}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                  editorTab === 'pdf' ? 'bg-red-950 text-amber-300 shadow-xs' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>8. Attached PDF File</span>
              </button>
            </div>

            {/* Modal Body / Form Area */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
              
              {/* TAB 1: FULL ARTICLE TEXT & SMART PASTE */}
              {editorTab === 'fulltext' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Word Document Smart Paste Component */}
                  <WordPasteImporter 
                    onApplyParsedArticle={handleApplyWordParsed} 
                  />

                  {/* Raw Text Fallback Auto-Segment Card */}
                  <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-900/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-5 h-5 text-amber-600" />
                        <h3 className="font-serif font-bold text-red-950 text-sm">
                          Quick Text Auto-Segmenter (कच्चा पाठ ऑटो-सेगमेंट करें)
                        </h3>
                      </div>
                      <span className="text-xs text-amber-800 font-mono font-bold">Text Parser</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-normal">
                      Paste plain paper text to auto-split into Introduction, Literature Review, Methodology, Results, Conclusion, and References.
                    </p>

                    <textarea
                      rows={4}
                      value={bulkPasteText}
                      onChange={e => setBulkPasteText(e.target.value)}
                      placeholder="Paste text here... (e.g. 1. Introduction... 2. Literature Review... 3. Methodology... 4. Results... 5. Conclusion... References...)"
                      className="w-full p-3 bg-white border border-amber-900/20 rounded-xl text-xs font-mono"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleAutoSegmentBulkText}
                        disabled={!bulkPasteText.trim()}
                        className="px-4 py-2 bg-red-950 hover:bg-red-900 disabled:opacity-50 text-amber-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
                      >
                        <Wand2 className="w-4 h-4 text-amber-400" />
                        <span>Auto-Segment into Sections</span>
                      </button>

                      {bulkPasteFeedback && (
                        <p className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          ✓ {bulkPasteFeedback}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Individual Section Fields with In-Place Blocks */}
                  <div className="space-y-4">
                    <div className="space-y-5">
                      {/* 1. Introduction */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                              <label className="block text-slate-900 font-serif font-bold text-sm flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-red-950 text-amber-200 text-xs flex items-center justify-center font-sans font-bold">1</span>
                                <span>Introduction (प्रस्तावना)</span>
                              </label>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'intro')}
                                  className="px-2.5 py-1 bg-red-950 text-amber-100 text-xs font-bold rounded-lg hover:bg-red-900 shadow-2xs flex items-center gap-1 transition"
                                  title="Add new Heading under Introduction"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Heading (नई हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'intro')}
                                  className="px-2.5 py-1 bg-amber-800 text-amber-100 text-xs font-bold rounded-lg hover:bg-amber-900 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                                  <span>+ Subheading</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'intro')}
                                  className="px-2.5 py-1 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-emerald-200" />
                                  <span>+ Image / Figure</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'intro')}
                                  className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-200" />
                                  <span>+ Table</span>
                                </button>
                              </div>
                            </div>

                            <textarea
                              rows={4}
                              value={editingArticle.full_text_introduction || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, full_text_introduction: e.target.value })}
                              placeholder="Enter or paste full Introduction text (प्रस्तावना का मुख्य पाठ यहाँ दर्ज करें)..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-sans leading-relaxed focus:ring-2 focus:ring-amber-500/40 outline-none"
                            />

                            {/* Sub-blocks under Introduction */}
                            {(editingArticle.custom_sections || []).filter(b => b.parent_section === 'intro').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}

                            {/* Quick Add Sub-Heading / New Main Heading Option under Introduction */}
                            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-900/10">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Plus className="w-4 h-4 text-amber-700" />
                                <span>प्रस्तावना के बाद नया मुख्य भाग या हेडिंग जोड़ें (Add Main Heading / Section after Introduction):</span>
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'intro')}
                                  className="px-3 py-1 bg-red-950 text-amber-200 font-bold rounded-lg text-xs hover:bg-red-900 shadow-2xs transition flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Main Heading (मुख्य भाग/हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'intro')}
                                  className="px-3 py-1 bg-slate-800 text-amber-200 font-bold rounded-lg text-xs hover:bg-slate-900 transition"
                                >
                                  + Subheading (उप-शीर्षक)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('quote', 'intro')}
                                  className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-xs hover:bg-amber-200 transition"
                                >
                                  + Quote Box
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Literature Review */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                              <label className="block text-slate-900 font-serif font-bold text-sm flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-red-950 text-amber-200 text-xs flex items-center justify-center font-sans font-bold">2</span>
                                <span>Literature Review (साहित्य अवलोकन)</span>
                              </label>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'literature')}
                                  className="px-2.5 py-1 bg-red-950 text-amber-100 text-xs font-bold rounded-lg hover:bg-red-900 shadow-2xs flex items-center gap-1 transition"
                                  title="Add new Main Heading under Literature Review"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Main Heading (मुख्य हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'literature')}
                                  className="px-2.5 py-1 bg-amber-800 text-amber-100 text-xs font-bold rounded-lg hover:bg-amber-900 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                                  <span>+ Subheading</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'literature')}
                                  className="px-2.5 py-1 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-emerald-200" />
                                  <span>+ Image / Figure</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'literature')}
                                  className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-200" />
                                  <span>+ Table</span>
                                </button>
                              </div>
                            </div>
                            <textarea
                              rows={4}
                              value={editingArticle.full_text_literature_review || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, full_text_literature_review: e.target.value })}
                              placeholder="Enter Literature Review text..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-sans leading-relaxed focus:ring-2 focus:ring-amber-500/40 outline-none"
                            />
                            {(editingArticle.custom_sections || []).filter(b => b.parent_section === 'literature').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}

                            {/* Quick Add Section Option after Literature Review */}
                            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-900/10">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Plus className="w-4 h-4 text-amber-700" />
                                <span>साहित्य अवलोकन के बाद नया मुख्य भाग जोड़ें (Add Section after Literature Review):</span>
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'literature')}
                                  className="px-3 py-1 bg-red-950 text-amber-200 font-bold rounded-lg text-xs hover:bg-red-900 shadow-2xs transition flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Main Heading (मुख्य भाग/हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'literature')}
                                  className="px-3 py-1 bg-slate-800 text-amber-200 font-bold rounded-lg text-xs hover:bg-slate-900 transition"
                                >
                                  + Subheading (उप-शीर्षक)
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Methodology */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                              <label className="block text-slate-900 font-serif font-bold text-sm flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-red-950 text-amber-200 text-xs flex items-center justify-center font-sans font-bold">3</span>
                                <span>Methodology (अनुसंधान कार्यप्रणाली)</span>
                              </label>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'methodology')}
                                  className="px-2.5 py-1 bg-red-950 text-amber-100 text-xs font-bold rounded-lg hover:bg-red-900 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Main Heading (मुख्य हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'methodology')}
                                  className="px-2.5 py-1 bg-amber-800 text-amber-100 text-xs font-bold rounded-lg hover:bg-amber-900 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                                  <span>+ Subheading</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'methodology')}
                                  className="px-2.5 py-1 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-emerald-200" />
                                  <span>+ Image / Figure</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'methodology')}
                                  className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-2xs flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-200" />
                                  <span>+ Table</span>
                                </button>
                              </div>
                            </div>
                            <textarea
                              rows={4}
                              value={editingArticle.full_text_methodology || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, full_text_methodology: e.target.value })}
                              placeholder="Enter Methodology text..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-sans leading-relaxed focus:ring-2 focus:ring-amber-500/40 outline-none"
                            />
                            {(editingArticle.custom_sections || []).filter(b => b.parent_section === 'methodology').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}

                            {/* Quick Add Section Option after Methodology */}
                            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-900/10">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Plus className="w-4 h-4 text-amber-700" />
                                <span>कार्यप्रणाली के बाद नया मुख्य भाग जोड़ें (Add Section after Methodology):</span>
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'methodology')}
                                  className="px-3 py-1 bg-red-950 text-amber-200 font-bold rounded-lg text-xs hover:bg-red-900 shadow-2xs transition flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+ Main Heading (मुख्य भाग/हेडिंग)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'methodology')}
                                  className="px-3 py-1 bg-slate-800 text-amber-200 font-bold rounded-lg text-xs hover:bg-slate-900 transition"
                                >
                                  + Subheading (उप-शीर्षक)
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Results and Discussion */}
                          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="block text-slate-900 font-bold text-xs">4. Results and Discussion (परिणाम एवं विश्लेषण)</label>
                              <div className="flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'results')}
                                  className="px-2 py-0.5 bg-red-950 text-amber-100 text-[10px] font-bold rounded hover:bg-red-900"
                                >
                                  + Heading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'results')}
                                  className="px-2 py-0.5 bg-amber-800 text-amber-100 text-[10px] font-bold rounded hover:bg-amber-900"
                                >
                                  + Subheading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'results')}
                                  className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded hover:bg-emerald-800"
                                >
                                  + Image / Figure
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'results')}
                                  className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700"
                                >
                                  + Table
                                </button>
                              </div>
                            </div>
                            <textarea
                              rows={5}
                              value={editingArticle.full_text_results_discussion || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, full_text_results_discussion: e.target.value })}
                              placeholder="Enter Results & Discussion text..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-sans leading-relaxed"
                            />
                            {(editingArticle.custom_sections || []).filter(b => b.parent_section === 'results').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}
                          </div>

                          {/* 5. Conclusion */}
                          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="block text-slate-900 font-bold text-xs">5. Conclusion (निष्कर्ष)</label>
                              <div className="flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'conclusion')}
                                  className="px-2 py-0.5 bg-red-950 text-amber-100 text-[10px] font-bold rounded hover:bg-red-900"
                                >
                                  + Heading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'conclusion')}
                                  className="px-2 py-0.5 bg-amber-800 text-amber-100 text-[10px] font-bold rounded hover:bg-amber-900"
                                >
                                  + Subheading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'conclusion')}
                                  className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded hover:bg-emerald-800"
                                >
                                  + Image / Figure
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'conclusion')}
                                  className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700"
                                >
                                  + Table
                                </button>
                              </div>
                            </div>
                            <textarea
                              rows={4}
                              value={editingArticle.full_text_conclusion || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, full_text_conclusion: e.target.value })}
                              placeholder="Enter Conclusion text..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-sans leading-relaxed"
                            />
                            {(editingArticle.custom_sections || []).filter(b => b.parent_section === 'conclusion').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}
                          </div>

                          {/* 6. Acknowledgements & Declarations */}
                          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-slate-900 font-bold text-xs">6. Acknowledgements & Declarations</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <textarea
                                rows={3}
                                value={editingArticle.full_text_acknowledgement || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, full_text_acknowledgement: e.target.value })}
                                placeholder="Acknowledgement / आभार..."
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                              <textarea
                                rows={3}
                                value={editingArticle.full_text_conflict_of_interest || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, full_text_conflict_of_interest: e.target.value })}
                                placeholder="Conflict of Interest statement..."
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          {/* 7. Additional Standalone Sections & Blocks */}
                          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-900/15 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800">7. Additional Custom Sections, Figures & Tables</span>
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('heading_h2', 'custom')}
                                  className="px-2.5 py-1 bg-red-950 text-amber-100 font-bold text-xs rounded-lg hover:bg-red-900"
                                >
                                  + H2 Heading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('subheading_h3', 'custom')}
                                  className="px-2.5 py-1 bg-amber-700 text-white font-bold text-xs rounded-lg hover:bg-amber-800"
                                >
                                  + Subheading
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('figure', 'custom')}
                                  className="px-2.5 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-600"
                                >
                                  + Figure
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomBlock('table', 'custom')}
                                  className="px-2.5 py-1 bg-amber-500 text-red-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                                >
                                  + Table
                                </button>
                              </div>
                            </div>

                            {(editingArticle.custom_sections || []).filter(b => !b.parent_section || b.parent_section === 'custom').map((block) => {
                              const bIdx = (editingArticle.custom_sections || []).findIndex(b => b.id === block.id);
                              return renderCustomBlockCard(block, bIdx);
                            })}
                          </div>
                        </div>
                      </div>

                    <div>
                      <label className="block text-slate-800 font-bold mb-1">8. References (संदर्भ ग्रंथसूची - One per line)</label>
                      <textarea
                        rows={6}
                        value={(editingArticle.references || []).join('\n')}
                        onChange={e => setEditingArticle({
                          ...editingArticle,
                          references: e.target.value.split('\n').filter(r => r.trim().length > 0)
                        })}
                        placeholder="Paste references list here (one reference per line)..."
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono leading-relaxed"
                      />
                    </div>
                  </div>
              )}

              {/* TAB 2: ARTICLE METADATA & DOI */}
              {editorTab === 'metadata' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Article Title (Hindi - शीर्षक) *</label>
                      <input
                        type="text"
                        required
                        value={editingArticle.title_hindi}
                        onChange={e => setEditingArticle({ ...editingArticle, title_hindi: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Article Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={editingArticle.title_english}
                        onChange={e => setEditingArticle({ ...editingArticle, title_english: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Short / Running Title (लघु शीर्षक)</label>
                      <input
                        type="text"
                        value={editingArticle.short_title || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, short_title: e.target.value })}
                        placeholder="e.g. Phonetic Study of Pawari Dialect"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Article Type (आलेख प्रकार)</label>
                      <select
                        value={editingArticle.article_type || 'Original Research Article (मूल शोध पत्र)'}
                        onChange={e => setEditingArticle({ ...editingArticle, article_type: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="Original Research Article (मूल शोध पत्र)">Original Research Article (मूल शोध पत्र)</option>
                        <option value="Review Article (पुनरीक्षण शोध पत्र)">Review Article (पुनरीक्षण शोध पत्र)</option>
                        <option value="Case Study (विशेष मामला अध्ययन)">Case Study (विशेष मामला अध्ययन)</option>
                        <option value="Short Communication (लघु शोध संचार)">Short Communication (लघु शोध संचार)</option>
                        <option value="Editorial Note (संपादकीय टिप्पणी)">Editorial Note (संपादकीय टिप्पणी)</option>
                        <option value="Special Feature (विशेष आलेख)">Special Feature (विशेष आलेख)</option>
                      </select>
                    </div>
                  </div>

                  {/* Volume / Issue Dropdown selection */}
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-900/15 space-y-3">
                    <label className="block text-slate-900 font-bold text-xs">
                      Journal Issue Selection (पत्रिका अंक):
                    </label>
                    <select
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                      value={issues.find(i => i.volume === editingArticle.volume && i.issue_number === editingArticle.issue)?.id || 'custom'}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        if (selectedId !== 'custom') {
                          const found = issues.find(i => i.id === selectedId);
                          if (found) {
                            setEditingArticle({
                              ...editingArticle,
                              volume: found.volume,
                              issue: found.issue_number,
                              year: found.year
                            });
                          }
                        }
                      }}
                    >
                      <option value="custom">-- Choose from Published Issues --</option>
                      {issues.map(iss => (
                        <option key={iss.id} value={iss.id}>
                          Vol. {iss.volume}, Issue {iss.issue_number} ({iss.year} - {iss.month}) — {iss.title_hindi || iss.title_english}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Volume</label>
                        <input
                          type="number"
                          value={editingArticle.volume}
                          onChange={e => setEditingArticle({ ...editingArticle, volume: Number(e.target.value) })}
                          className="w-full p-2 bg-white border rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Issue No.</label>
                        <input
                          type="number"
                          value={editingArticle.issue}
                          onChange={e => setEditingArticle({ ...editingArticle, issue: Number(e.target.value) })}
                          className="w-full p-2 bg-white border rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Year</label>
                        <input
                          type="number"
                          value={editingArticle.year}
                          onChange={e => setEditingArticle({ ...editingArticle, year: Number(e.target.value) })}
                          className="w-full p-2 bg-white border rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Page Range</label>
                        <input
                          type="text"
                          value={editingArticle.page_numbers || ''}
                          onChange={e => setEditingArticle({ ...editingArticle, page_numbers: e.target.value })}
                          placeholder="e.g. 01–15"
                          className="w-full p-2 bg-white border rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">DOI (Digital Object Identifier)</label>
                      <input
                        type="text"
                        value={editingArticle.doi || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, doi: e.target.value })}
                        placeholder="e.g. 10.5281/zenodo.123456"
                        className="w-full p-2 bg-slate-50 border rounded font-mono text-xs font-bold text-amber-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category / Discipline</label>
                      <input
                        type="text"
                        value={editingArticle.category}
                        onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                        className="w-full p-2 bg-slate-50 border rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Publication Status</label>
                      <select
                        value={editingArticle.status}
                        onChange={e => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                        className="w-full p-2 bg-slate-50 border rounded text-xs font-bold text-emerald-950"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="under_review">Under Review</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Custom Citation Text (उद्धरण शैली)</label>
                    <textarea
                      rows={2}
                      value={editingArticle.citation_text || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, citation_text: e.target.value })}
                      placeholder="Optional APA / MLA citation text..."
                      className="w-full p-2.5 bg-slate-50 border rounded text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AUTHORS & ORCID */}
              {editorTab === 'authors' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b pb-2">
                    <label className="font-serif font-bold text-slate-900 text-sm">Authors, Affiliations & ORCID</label>
                    <button
                      type="button"
                      onClick={handleAddAuthor}
                      className="px-3 py-1.5 bg-amber-500 text-red-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                    >
                      + Add Author
                    </button>
                  </div>

                  {editingArticle.authors.map((author, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Author Name *</label>
                          <input
                            type="text"
                            required
                            value={author.name}
                            onChange={e => handleAuthorChange(idx, 'name', e.target.value)}
                            placeholder="e.g. Dr. Rameshwar Pawar"
                            className="w-full p-2 bg-white border rounded text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Affiliation & University</label>
                          <input
                            type="text"
                            value={author.affiliation || ''}
                            onChange={e => handleAuthorChange(idx, 'affiliation', e.target.value)}
                            placeholder="e.g. Department of Linguistics, PG College Balaghat"
                            className="w-full p-2 bg-white border rounded text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={author.email || ''}
                            onChange={e => handleAuthorChange(idx, 'email', e.target.value)}
                            placeholder="author@university.edu.in"
                            className="w-full p-2 bg-white border rounded text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ORCID iD</label>
                          <input
                            type="text"
                            value={author.orcid || ''}
                            onChange={e => handleAuthorChange(idx, 'orcid', e.target.value)}
                            placeholder="0000-0002-1823-9211"
                            className="w-full p-2 bg-white border rounded text-xs font-mono text-emerald-800"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={author.is_corresponding || false}
                            onChange={e => handleAuthorChange(idx, 'is_corresponding', e.target.checked)}
                          />
                          <span>Corresponding Author (मुख्य संपर्क शोधकर्ता)</span>
                        </label>

                        {editingArticle.authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(idx)}
                            className="text-red-600 text-xs hover:underline font-bold"
                          >
                            Remove Author
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: ABSTRACTS & KEYWORDS */}
              {editorTab === 'abstract' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Abstract (Hindi - शोध सार)</label>
                    <textarea
                      rows={5}
                      value={editingArticle.abstract_hindi}
                      onChange={e => setEditingArticle({ ...editingArticle, abstract_hindi: e.target.value })}
                      placeholder="हिंदी में शोध सार यहाँ दर्ज करें..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Abstract (English)</label>
                    <textarea
                      rows={5}
                      value={editingArticle.abstract_english}
                      onChange={e => setEditingArticle({ ...editingArticle, abstract_english: e.target.value })}
                      placeholder="Enter Abstract in English here..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Keywords / Index Terms (Comma separated)</label>
                    <input
                      type="text"
                      value={editingArticle.keywords.join(', ')}
                      onChange={e => setEditingArticle({
                        ...editingArticle,
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      })}
                      placeholder="e.g. Pawari Dialect, Phonetics, Linguistics, Satpura Region"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: PUBLICATION HISTORY DATES */}
              {editorTab === 'history' && (
                <div className="space-y-4 animate-in fade-in duration-150 bg-amber-50/40 p-5 rounded-2xl border border-amber-900/10">
                  <h3 className="font-serif font-bold text-slate-900 text-sm">Article History Timeline Dates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Received Date (प्राप्ति तिथि)</label>
                      <input
                        type="date"
                        value={editingArticle.date_received || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, date_received: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Revised Date (संशोधन तिथि)</label>
                      <input
                        type="date"
                        value={editingArticle.date_revised || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, date_revised: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Accepted Date (स्वीकृति तिथि)</label>
                      <input
                        type="date"
                        value={editingArticle.date_accepted || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, date_accepted: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Published Online Date (प्रकाशन तिथि)</label>
                      <input
                        type="date"
                        value={editingArticle.date_published || ''}
                        onChange={e => setEditingArticle({ ...editingArticle, date_published: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CUSTOM CONTENT BLOCKS (Quotes, Figures, Tables) */}
              {editorTab === 'blocks' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif font-bold text-slate-900 text-sm">Custom Blocks (Figures, Tables, Quotes)</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddCustomBlock('quote')}
                        className="px-3 py-1.5 bg-amber-500 text-red-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                      >
                        + Add Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCustomBlock('figure')}
                        className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-600"
                      >
                        + Add Figure
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCustomBlock('table')}
                        className="px-3 py-1.5 bg-red-950 text-amber-100 font-bold text-xs rounded-lg hover:bg-red-900"
                      >
                        + Add Table
                      </button>
                    </div>
                  </div>

                  {(editingArticle.custom_sections || []).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <p className="font-serif font-bold text-slate-600">No Custom Blocks Added</p>
                      <p className="text-xs">Add blockquotes, figures with captions, or structured HTML tables above.</p>
                    </div>
                  ) : (
                    (editingArticle.custom_sections || []).map((block) => (
                      <div key={block.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                            Block: {block.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomBlock(block.id)}
                            className="text-red-600 hover:underline text-xs font-bold"
                          >
                            Remove Block
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Block Title / Label *"
                            value={block.title || ''}
                            onChange={e => handleUpdateCustomBlock(block.id, { title: e.target.value })}
                            className="p-2 bg-white border rounded text-xs font-bold"
                          />

                          {block.type === 'figure' && (
                            <input
                              type="text"
                              placeholder="Image URL *"
                              value={block.image_url || ''}
                              onChange={e => handleUpdateCustomBlock(block.id, { image_url: e.target.value })}
                              className="p-2 bg-white border rounded text-xs font-mono"
                            />
                          )}
                        </div>

                        <textarea
                          rows={3}
                          placeholder={block.type === 'quote' ? 'Enter quote content...' : 'Enter caption or description...'}
                          value={block.content}
                          onChange={e => handleUpdateCustomBlock(block.id, { content: e.target.value })}
                          className="w-full p-2.5 bg-white border rounded text-xs"
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 7: ARTICLE FIGURES & PLATES MANAGER */}
              {editorTab === 'figures' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-amber-100 flex items-center space-x-2">
                        <ImageIcon className="w-5 h-5 text-amber-400" />
                        <span>Academic Article Figures & Document Images (आकृति व चित्र प्रबंधन)</span>
                      </h3>
                      <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                        Insert high-resolution figures, maps, waveforms, and manuscript photos with captions, alt text, and credits.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddFigureBlock('in_body')}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-xl transition shadow-2xs flex items-center space-x-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Figure in Article Flow</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddFigureBlock('at_end')}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-2xs flex items-center space-x-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Figure at End of Article</span>
                      </button>
                    </div>
                  </div>

                  {/* Figure List */}
                  {((editingArticle.custom_sections || []).filter(b => b.type === 'figure')).length === 0 ? (
                    <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                      <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
                      <p className="font-serif font-bold text-slate-700 text-base">No Article Figures Added Yet</p>
                      <p className="text-xs max-w-md mx-auto text-slate-500">
                        Add figures, maps, diagrams, or plates. You can place them inline within text sections or at the end of the article in an appendix figures section.
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleAddFigureBlock('in_body')}
                          className="px-4 py-2 bg-red-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-red-900"
                        >
                          + Insert First Inline Figure
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddFigureBlock('at_end')}
                          className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-600"
                        >
                          + Insert End-of-Article Figure
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {(editingArticle.custom_sections || [])
                        .filter(b => b.type === 'figure')
                        .map((block, figIdx) => (
                          <div key={block.id} className="p-5 bg-slate-50 border-2 border-slate-200 hover:border-amber-900/30 rounded-2xl space-y-4 transition shadow-xs">
                            
                            {/* Figure Header Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-red-950 text-amber-300 font-mono font-bold px-2.5 py-1 rounded-lg text-xs">
                                  Figure {figIdx + 1}
                                </span>
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg font-mono ${
                                  block.placement === 'at_end' 
                                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' 
                                    : 'bg-amber-100 text-amber-950 border border-amber-300'
                                }`}>
                                  {block.placement === 'at_end' ? '📌 Placement: End of Article / Appendix' : '📄 Placement: In Article Flow'}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1.5 text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => handleMoveBlock(block.id, 'up')}
                                  disabled={figIdx === 0}
                                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border rounded-lg disabled:opacity-30 transition"
                                  title="Move Figure Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveBlock(block.id, 'down')}
                                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border rounded-lg transition"
                                  title="Move Figure Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                
                                {block.placement === 'at_end' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveBlock(block.id, 'to_body')}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 rounded-lg text-[11px]"
                                  >
                                    Move to Article Body
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveBlock(block.id, 'to_end')}
                                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px]"
                                  >
                                    Move to End of Article
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomBlock(block.id)}
                                  className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                                  title="Delete Figure"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Image Preview & Upload Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                              
                              {/* Thumbnail Container */}
                              <div className="flex flex-col items-center justify-center bg-slate-100 p-2 rounded-xl border border-slate-200 min-h-[140px] relative group">
                                {block.image_url ? (
                                  <>
                                    <img
                                      src={block.image_url}
                                      alt={block.alt_text || 'Figure Preview'}
                                      className="max-h-36 object-contain rounded"
                                    />
                                    <span className="text-[10px] text-slate-500 font-mono mt-1">Image Loaded</span>
                                  </>
                                ) : (
                                  <div className="text-center p-3 text-slate-400 space-y-1">
                                    <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                                    <p className="text-[11px] font-bold">No Image Attached</p>
                                  </div>
                                )}
                              </div>

                              {/* Upload & URL Controls */}
                              <div className="md:col-span-2 space-y-3">
                                <div>
                                  <label className="block text-xs font-bold text-slate-800 mb-1">
                                    Upload Image File (फ़ाइल अपलोड करें):
                                  </label>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <label className={`cursor-pointer px-3.5 py-2 ${uploadingFigId === block.id ? 'bg-amber-600' : 'bg-red-950 hover:bg-red-900'} text-amber-100 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0`}>
                                      <Upload className="w-4 h-4" />
                                      <span>
                                        {uploadingFigId === block.id 
                                          ? `Uploading... ${figUploadPercent}%` 
                                          : block.image_url ? 'Replace Image File' : 'Upload Image File'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        disabled={uploadingFigId === block.id}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleFigureUpload(block.id, file);
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                    
                                    <span className="text-xs text-slate-400 font-bold">OR</span>

                                    <input
                                      type="text"
                                      placeholder="Paste direct Image URL (https://...)"
                                      value={block.image_url || ''}
                                      onChange={e => handleUpdateCustomBlock(block.id, { image_url: e.target.value })}
                                      className="flex-1 min-w-[200px] p-2 bg-slate-50 border rounded-xl text-xs font-mono"
                                    />
                                  </div>
                                  {uploadingFigId === block.id && (
                                    <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                      <div className="bg-amber-500 h-full transition-all" style={{ width: `${figUploadPercent}%` }}></div>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Figure Number / Title (शीर्षक) *
                                    </label>
                                    <input
                                      type="text"
                                      value={block.title || `Figure ${figIdx + 1}`}
                                      onChange={e => handleUpdateCustomBlock(block.id, { title: e.target.value })}
                                      placeholder="e.g. Figure 1: Pawari Dialect Map"
                                      className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Placement Location (स्थान)
                                    </label>
                                    <select
                                      value={block.placement || 'in_body'}
                                      onChange={e => handleUpdateCustomBlock(block.id, { placement: e.target.value as any })}
                                      className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold"
                                    >
                                      <option value="in_body">In Article Flow (धाराप्रवाह पाठ में)</option>
                                      <option value="at_end">At Very End of Article / Appendix (परिशिष्ट में)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Caption & Source Line */}
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">
                                  Figure Caption (आकृति विवरण / कैप्शन) *
                                </label>
                                <textarea
                                  rows={2}
                                  value={block.caption || block.content}
                                  onChange={e => handleUpdateCustomBlock(block.id, { caption: e.target.value, content: e.target.value })}
                                  placeholder="Enter detailed academic figure caption displayed below the image..."
                                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed font-sans"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Accessibility Alt Text (वर्णनात्मक अल्टरनेटिव टेक्स्ट)
                                  </label>
                                  <input
                                    type="text"
                                    disabled={block.is_decorative}
                                    value={block.is_decorative ? '' : (block.alt_text || '')}
                                    onChange={e => handleUpdateCustomBlock(block.id, { alt_text: e.target.value })}
                                    placeholder="Describe image content for screen readers..."
                                    className="w-full p-2 bg-white border rounded-xl text-xs font-sans disabled:bg-slate-100"
                                  />
                                  <label className="flex items-center space-x-1.5 text-[11px] text-slate-600 mt-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={block.is_decorative || false}
                                      onChange={e => handleUpdateCustomBlock(block.id, { is_decorative: e.target.checked })}
                                    />
                                    <span>Decorative Image (Empty Alt attribute)</span>
                                  </label>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Source / Credit Line (स्रोत / आभार)
                                  </label>
                                  <input
                                    type="text"
                                    value={block.source_credit || ''}
                                    onChange={e => handleUpdateCustomBlock(block.id, { source_credit: e.target.value })}
                                    placeholder="e.g. Source: Adapted from CIIL Survey (2024)"
                                    className="w-full p-2 bg-white border rounded-xl text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: ATTACHED PDF FILE */}
              {editorTab === 'pdf' && (
                <div className="space-y-5 animate-in fade-in duration-150 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between border-b pb-3 border-slate-200 gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-red-900" />
                        <span>शोध आलेख PDF अटैचमेंट व क्लाउड स्टोरेज (Firebase Storage)</span>
                      </h3>
                      <p className="text-xs text-slate-600">
                        यहाँ PDF फ़ाइल डायरेक्ट अपलोड करें या फ़ायरबेस स्टोरेज का डाउनलोड लिंक दर्ज करें।
                      </p>
                    </div>
                    {editingArticle.pdf_url ? (
                      <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>PDF संलग्न है</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs rounded-full">
                        PDF फ़ाइल संलग्न नहीं है
                      </span>
                    )}
                  </div>

                  {/* FileUploadZone */}
                  <div className="space-y-2">
                    <label className="block font-bold text-xs text-slate-800">
                      Firebase Cloud Storage में PDF फ़ाइल अपलोड करें:
                    </label>
                    <FileUploadZone
                      acceptedCategory="documents"
                      maxFiles={1}
                      customFolder="articles/pdfs"
                      label="शोध पत्र PDF अपलोड करें (Upload Article PDF)"
                      description="PDF फ़ाइल को यहाँ ड्रैग-ड्रॉप करें या कंप्यूटर से चुनें। (Max 15MB, Supports PDF)."
                      onUploadComplete={(file) => {
                        setEditingArticle(prev => prev ? ({
                          ...prev,
                          pdf_url: file.url,
                          pdf_storage_path: file.path
                        }) : null);
                      }}
                    />
                  </div>

                  {/* Direct Link Input */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block font-bold text-xs text-slate-800">या डायरेक्ट PDF URL दर्ज करें (Direct PDF URL):</label>
                    <input
                      type="text"
                      value={editingArticle.pdf_url || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, pdf_url: e.target.value })}
                      placeholder="https://firebasestorage.googleapis.com/.../paper.pdf"
                      className="w-full p-2.5 border rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {editingArticle.pdf_url && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">✓ PDF फ़ाइल सफलतापूर्वक संलग्न है</span>
                        <span className="text-[11px] font-mono text-emerald-800 truncate block max-w-sm">
                          {editingArticle.pdf_storage_path || editingArticle.pdf_url}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openPdfViewer(editingArticle.pdf_url || '', editingArticle.title_english || editingArticle.title_hindi || 'Article')}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                          <span>PDF पूर्वावलोकन देखें</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingArticle({ ...editingArticle, pdf_url: '', pdf_storage_path: '' })}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* WORD DOCUMENT (.docx / .doc) ATTACHMENT SECTION */}
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-700" />
                          <span>MS Word (.docx/.doc) पांडुलिपि फ़ाइल (Word Manuscript)</span>
                        </h4>
                        <p className="text-xs text-slate-600">
                          संपादित करने और वेब पर Word व्यूअर में प्रदर्शित करने के लिए Word फाइल अपलोड करें।
                        </p>
                      </div>
                      {editingArticle.word_url ? (
                        <span className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-950 font-bold text-xs rounded-full">
                          Word फ़ाइल संलग्न है
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                          Word वैकल्पिक
                        </span>
                      )}
                    </div>

                    <FileUploadZone
                      acceptedCategory="documents"
                      maxFiles={1}
                      customFolder="articles/words"
                      label="Word (.docx / .doc) अपलोड करें"
                      description="यहाँ .docx फ़ाइल ड्रॉप करें।"
                      onUploadComplete={(file) => {
                        setEditingArticle(prev => prev ? ({
                          ...prev,
                          word_url: file.url,
                          word_storage_path: file.path
                        }) : null);
                      }}
                    />

                    <input
                      type="text"
                      value={editingArticle.word_url || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, word_url: e.target.value })}
                      placeholder="या डायरेक्ट Word URL दर्ज करें (https://.../paper.docx)"
                      className="w-full p-2.5 border rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Form Action Footer Bar */}
              <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold rounded-xl text-xs transition shadow-xs flex items-center space-x-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Full Page Live Preview</span>
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-950 text-amber-100 font-bold rounded-xl text-xs hover:bg-red-900 transition shadow-xs"
                  >
                    Save & Publish Article
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* LIVE PREVIEW PAPER MODAL */}
      {isPreviewModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-100 rounded-3xl border border-amber-500/30 max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between bg-red-950 text-amber-100 px-6 py-3 border-b border-amber-500/30">
              <span className="font-serif font-bold text-xs uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Article Page Live Preview (प्रकाशन का सीधा दृश्य)</span>
              </span>
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-3 py-1 bg-amber-500 text-red-950 font-bold text-xs rounded-lg hover:bg-amber-400"
              >
                Close Preview
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-amber-900/10 shadow-md space-y-6">
                
                <div className="border-b-2 border-red-950/20 pb-4 space-y-2">
                  <span className="bg-red-950 text-amber-300 font-bold px-2.5 py-0.5 rounded text-[11px]">
                    {editingArticle.article_type || 'ORIGINAL RESEARCH ARTICLE'}
                  </span>
                  <h1 className="text-2xl font-serif font-extrabold text-slate-950">{editingArticle.title_hindi || 'Untilted Article'}</h1>
                  <h2 className="text-lg font-serif italic text-slate-700">{editingArticle.title_english}</h2>
                  <p className="text-xs font-mono text-slate-500 pt-1">
                    Authors: {editingArticle.authors.map(a => a.name).join(', ')} | DOI: {editingArticle.doi || '10.5281/zenodo.psp'}
                  </p>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-900/10 text-xs space-y-2">
                  <h3 className="font-serif font-bold text-red-950">Bilingual Abstract</h3>
                  <p className="text-slate-800 leading-relaxed">{editingArticle.abstract_hindi}</p>
                  <p className="text-slate-800 leading-relaxed italic">{editingArticle.abstract_english}</p>
                </div>

                {editingArticle.full_text_introduction && (
                  <div className="space-y-2 pt-2">
                    <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-red-950 pb-1">1. Introduction</h2>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">{editingArticle.full_text_introduction}</p>
                  </div>
                )}

                {editingArticle.full_text_results_discussion && (
                  <div className="space-y-2 pt-2">
                    <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-red-950 pb-1">4. Results and Discussion</h2>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">{editingArticle.full_text_results_discussion}</p>
                  </div>
                )}

                {editingArticle.full_text_conclusion && (
                  <div className="space-y-2 pt-2">
                    <h2 className="font-serif font-bold text-lg text-slate-900 border-b border-red-950 pb-1">5. Conclusion</h2>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">{editingArticle.full_text_conclusion}</p>
                  </div>
                )}

                {editingArticle.references && editingArticle.references.length > 0 && (
                  <div className="space-y-2 pt-4 border-t-2 border-red-950">
                    <h2 className="font-serif font-bold text-base text-slate-900">References</h2>
                    <ol className="list-decimal list-inside text-xs space-y-1">
                      {editingArticle.references.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ol>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manuscript Peer Review Modal */}
      {selectedReviewSubmission && (
        <ManuscriptReviewModal
          submission={selectedReviewSubmission}
          isOpen={!!selectedReviewSubmission}
          onClose={() => setSelectedReviewSubmission(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Research Paper"
        message="Are you sure you want to permanently delete this research paper? This action cannot be undone."
        isDestructive={true}
        confirmLabel="Delete Paper"
        onConfirm={() => {
          if (deleteId) {
            deleteArticle(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};
