import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { auth, firebaseConfig } from '../../lib/firebase';
import { Article, Author, Submission } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { ManuscriptReviewModal } from './ManuscriptReviewModal';
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
  FileType
} from 'lucide-react';

export const ArticlesManager: React.FC = () => {
  const { 
    articles, 
    submissions,
    saveArticle, 
    deleteArticle, 
    uploadFileToStorage, 
    openPdfViewer,
    deleteSubmission,
    issues 
  } = useCms();
  const { canManageArticles, isDirector, isSuperAdmin, currentUser, loading: authLoading, googleLogin } = useAuth();

  const [activeSection, setActiveSection] = useState<'published' | 'submissions'>('published');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [issueFilter, setIssueFilter] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Filtered submissions for new manuscripts tab
  const filteredSubmissions = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.author_name.toLowerCase().includes(q) || (s.email && s.email.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    const newArt: Article = {
      id: 'art_' + Date.now(),
      title_hindi: '',
      title_english: '',
      slug: 'article-' + Date.now(),
      authors: [{ name: '', affiliation: '', email: '', is_corresponding: true }],
      abstract_hindi: '',
      abstract_english: '',
      keywords: ['पवारी शोध', 'Linguistics'],
      doi: `10.5281/zenodo.psp.2026.${Math.floor(1000 + Math.random() * 9000)}`,
      pdf_url: '',
      volume: issues[0]?.volume || 2,
      issue: issues[0]?.issue_number || 1,
      year: 2026,
      category: 'Linguistics & Dialectology',
      language: 'Hindi',
      status: 'published',
      page_numbers: '01–15',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    setEditingArticle(newArt);
    setIsModalOpen(true);
  };

  const handleEdit = (art: Article) => {
    setEditingArticle({ ...art });
    setIsModalOpen(true);
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

    // 1. Validate auth state
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
    console.log(`[PDF Upload Initiated] Target Path: ${targetPath}`);

    try {
      const res = await uploadFileToStorage(file, undefined, (percent) => {
        setPdfUploadPercent(percent);
      });

      // Confirm download URL generated and save fileId or path or url to article state
      setEditingArticle(prev => prev ? {
        ...prev,
        pdf_url: res.fileId || res.path || res.url,
        pdf_storage_path: res.path
      } : null);

      setPdfUploadTimingInfo(`PDF file "${file.name}" uploaded successfully!`);
    } catch (err: any) {
      console.error('[PDF Upload Error]', {
        path: targetPath,
        message: err?.message || String(err)
      });
      const msg = err?.message || String(err);
      setPdfUploadError(msg);
    } finally {
      setUploadingPdf(false);
      // Reset input element so user can re-select if needed
      e.target.value = '';
    }
  };

  // Author helpers
  const handleAddAuthor = () => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      authors: [...editingArticle.authors, { name: '', affiliation: '', email: '', is_corresponding: false }]
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Articles & Peer Review CMS Manager</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Manage published research papers, incoming author manuscripts, reviewer assignments, and peer review reports.</p>
        </div>

        {canManageArticles && activeSection === 'published' && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Published Paper</span>
          </button>
        )}
      </div>

      {/* Primary Section Switcher Tabs (Separating Published Articles from New Submissions & Review) */}
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
          <span>Published Research Papers (प्रकाशित शोध पत्र) ({articles.length})</span>
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
          <span>New Manuscripts & Peer Review (नवीन प्राप्त पांडुलिपियाँ) ({submissions.length})</span>
          {submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length > 0 && (
            <span className="ml-1 bg-amber-500 text-red-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length} New
            </span>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={activeSection === 'published' ? "Search published title or author..." : "Search manuscript title or author..."}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs">
          {activeSection === 'published' && issues.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium">Volume & Issue:</span>
              <select
                value={issueFilter}
                onChange={e => setIssueFilter(e.target.value)}
                className="bg-amber-50/80 border border-amber-300 rounded-lg p-2 text-xs font-semibold text-amber-950 focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Volumes & Issues (सभी अंक)</option>
                {issues.map(iss => (
                  <option key={iss.id} value={`${iss.volume}_${iss.issue_number}`}>
                    Vol. {iss.volume}, Issue {iss.issue_number} ({iss.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
            >
              <option value="all">All Statuses</option>
              {activeSection === 'published' ? (
                <>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="archived">Archived</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending Review</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: Published Research Papers Table */}
      {activeSection === 'published' && (
        <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-serif font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Article Title (Hindi & English)</th>
                  <th className="p-4">Authors</th>
                  <th className="p-4">Issue</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">PDF</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(art => (
                  <tr key={art.id} className="hover:bg-amber-50/40 transition">
                    <td className="p-4 max-w-sm">
                      <p className="font-serif font-bold text-slate-900 text-sm">{art.title_hindi}</p>
                      <p className="text-slate-600 italic text-[11px] line-clamp-1">{art.title_english}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">DOI: {art.doi || 'N/A'}</p>
                    </td>

                    <td className="p-4 max-w-xs text-slate-700 font-medium">
                      {art.authors.map(a => a.name).join(', ')}
                    </td>

                    <td className="p-4 font-mono text-slate-600">
                      Vol {art.volume}, Iss {art.issue} ({art.year})
                    </td>

                    <td className="p-4">
                      <select
                        value={art.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as any;
                          saveArticle({ ...art, status: newStatus });
                        }}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg uppercase cursor-pointer border ${
                          art.status === 'published' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          art.status === 'draft' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          art.status === 'under_review' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                          'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="under_review">Under Review</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td className="p-4">
                      {art.pdf_url ? (
                        <button
                          onClick={() => openPdfViewer(art.pdf_url || '', art.title_english)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded text-emerald-700 border border-emerald-200 transition flex items-center space-x-1"
                          title="View PDF Document"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-[10px] font-bold">PDF</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No PDF</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleEdit(art)}
                        className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-900 rounded font-bold transition"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

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
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                        title="Duplicate Article as Draft"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>

                      {(isDirector || isSuperAdmin) && (
                        <button
                          onClick={() => setDeleteId(art.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 rounded transition"
                          title="Delete Article"
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
        </div>
      )}

      {/* SECTION 2: Submitted Manuscripts & Peer Review Workflow Table */}
      {activeSection === 'submissions' && (
        <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-serif font-bold text-lg text-slate-800">No Manuscripts Found</p>
              <p className="text-xs">No submitted manuscripts match your search/filters.</p>
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
                    <th className="p-4">Assigned Reviewers & Comments</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => {
                    const reviewerCount = sub.assigned_reviewers?.length || 0;
                    const completedReviews = sub.assigned_reviewers?.filter(r => r.status === 'completed').length || 0;

                    return (
                      <tr key={sub.id} className="hover:bg-amber-50/40 transition">
                        <td className="p-4 max-w-xs">
                          <p className="font-serif font-bold text-slate-900 text-sm line-clamp-2">{sub.title}</p>
                          {sub.file_name && (
                            <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center space-x-1">
                              <FileType className="w-3 h-3 text-amber-700" />
                              <span className="truncate max-w-[180px]">{sub.file_name}</span>
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-slate-800">{sub.author_name}</p>
                          <a href={`mailto:${sub.email}`} className="text-[11px] text-amber-800 hover:underline">
                            {sub.email}
                          </a>
                        </td>

                        <td className="p-4 font-mono text-slate-600">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                            sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            sub.status === 'under_review' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                            sub.status === 'revision_requested' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            sub.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 flex items-center space-x-1">
                              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                              <span>{reviewerCount} Reviewer(s) ({completedReviews} Done)</span>
                            </span>
                            {sub.editorial_comments && (
                              <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                                Note: "{sub.editorial_comments}"
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedReviewSubmission(sub)}
                            className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-2xs inline-flex items-center space-x-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Assign Reviewer & Comments</span>
                          </button>

                          {(isDirector || isSuperAdmin) && (
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this manuscript submission permanently?')) {
                                  deleteSubmission(sub.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit / Create Drawer Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-serif font-bold text-slate-900">
                {editingArticle.id ? 'Edit Research Paper' : 'Add New Research Paper'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-6 text-xs sm:text-sm">
              
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Title (Hindi - शीर्षक) *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title_hindi}
                    onChange={e => setEditingArticle({ ...editingArticle, title_hindi: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title_english}
                    onChange={e => setEditingArticle({ ...editingArticle, title_english: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Authors List */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-slate-900">Authors & Contributors</label>
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="px-2.5 py-1 bg-amber-500 text-red-950 font-bold text-xs rounded hover:bg-amber-400"
                  >
                    + Add Author
                  </button>
                </div>

                {editingArticle.authors.map((author, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Author Name *"
                        required
                        value={author.name}
                        onChange={e => handleAuthorChange(idx, 'name', e.target.value)}
                        className="p-2 bg-slate-50 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Affiliation / University"
                        value={author.affiliation || ''}
                        onChange={e => handleAuthorChange(idx, 'affiliation', e.target.value)}
                        className="p-2 bg-slate-50 border rounded text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={author.email || ''}
                        onChange={e => handleAuthorChange(idx, 'email', e.target.value)}
                        className="p-2 bg-slate-50 border rounded text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center space-x-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={author.is_corresponding || false}
                          onChange={e => handleAuthorChange(idx, 'is_corresponding', e.target.checked)}
                        />
                        <span>Corresponding Author</span>
                      </label>

                      {editingArticle.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(idx)}
                          className="text-red-600 text-xs hover:underline"
                        >
                          Remove Author
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Abstracts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Abstract (Hindi - शोध सार)</label>
                  <textarea
                    rows={4}
                    value={editingArticle.abstract_hindi}
                    onChange={e => setEditingArticle({ ...editingArticle, abstract_hindi: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Abstract (English)</label>
                  <textarea
                    rows={4}
                    value={editingArticle.abstract_english}
                    onChange={e => setEditingArticle({ ...editingArticle, abstract_english: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Volume, Issue, Category, Language, Status */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-900/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="font-serif font-bold text-slate-900 text-xs sm:text-sm">
                    Volume & Issue Selection (अंक एवं वॉल्यूम चयन)
                  </label>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Select from existing journal issues or customize values below
                  </span>
                </div>

                {/* Integrated Dropdown Selector */}
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">
                    Select Existing Journal Issue (पत्रिका अंक ड्रॉपडाउन से चुनें):
                  </label>
                  <select
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={
                      issues.find(i => i.volume === editingArticle.volume && i.issue_number === editingArticle.issue)?.id || 'custom'
                    }
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
                    <option value="custom">-- Choose from Published Issues (या नीचे मैन्युअल दर्ज करें) --</option>
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id}>
                        Vol. {iss.volume}, Issue {iss.issue_number} ({iss.year} - {iss.month}) — {iss.title_hindi || iss.title_english} {iss.status === 'current' ? '★ Current Issue' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Volume (खंड)</label>
                    <input
                      type="number"
                      value={editingArticle.volume}
                      onChange={e => setEditingArticle({ ...editingArticle, volume: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Issue No. (अंक संख्या)</label>
                    <input
                      type="number"
                      value={editingArticle.issue}
                      onChange={e => setEditingArticle({ ...editingArticle, issue: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Year (वर्ष)</label>
                    <input
                      type="number"
                      value={editingArticle.year}
                      onChange={e => setEditingArticle({ ...editingArticle, year: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Status (स्थिति)</label>
                    <select
                      value={editingArticle.status}
                      onChange={e => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-950"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingArticle.category}
                    onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Language</label>
                  <select
                    value={editingArticle.language}
                    onChange={e => setEditingArticle({ ...editingArticle, language: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border rounded"
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Pawari">Pawari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Page Numbers</label>
                  <input
                    type="text"
                    value={editingArticle.page_numbers || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, page_numbers: e.target.value })}
                    placeholder="e.g. 01–15"
                    className="w-full p-2 bg-slate-50 border rounded"
                  />
                </div>
              </div>

              {/* PDF & Document File Storage Upload */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block font-serif font-bold text-slate-900">Article File (PDF / DOC / Image)</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className={`cursor-pointer px-4 py-2.5 ${uploadingPdf ? 'bg-amber-600' : 'bg-red-950 hover:bg-red-900'} text-amber-100 font-bold text-xs rounded-lg transition flex items-center space-x-2 shrink-0`}>
                    <Upload className="w-4 h-4" />
                    <span>{uploadingPdf ? `Uploading... ${pdfUploadPercent}%` : 'Upload File (PDF / DOC / Image)'}</span>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                      onChange={handlePdfUpload} 
                      disabled={uploadingPdf} 
                      className="hidden" 
                    />
                  </label>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={editingArticle.pdf_url || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, pdf_url: e.target.value })}
                      placeholder="Optional: Paste direct web URL or upload file above..."
                      className="w-full p-2 border rounded text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Progress bar and percentage display */}
                {uploadingPdf && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                      <span>{pdfUploadTimingInfo || 'Uploading PDF file...'}</span>
                      <span className="font-bold text-amber-900">{pdfUploadPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${pdfUploadPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Completion timing info */}
                {!uploadingPdf && pdfUploadTimingInfo && !pdfUploadError && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center space-x-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{pdfUploadTimingInfo}</span>
                  </p>
                )}

                {/* Error message */}
                {pdfUploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 font-mono flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="break-all">{pdfUploadError}</span>
                  </div>
                )}

                {editingArticle.pdf_url && (
                  <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-950 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>PDF Document Attached</span>
                        </p>
                        <p className="text-[11px] text-emerald-800/80 truncate">
                          Ready to view and download with research article
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openPdfViewer(editingArticle.pdf_url || '', editingArticle.title_english || 'Article PDF')}
                        className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, pdf_url: '', pdf_storage_path: '' })}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove attached PDF"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit & Reset Buttons */}
              <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset form fields back to default?')) {
                      handleCreateNew();
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  Clear & Reset Form Fields
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-950 text-amber-100 font-bold rounded-lg text-xs hover:bg-red-900 transition shadow-xs"
                  >
                    Save Research Paper
                  </button>
                </div>
              </div>

            </form>

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
        message="Are you sure you want to permanently delete this research paper from Firestore? This action cannot be undone."
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
