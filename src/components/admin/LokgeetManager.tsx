import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariLokgeetItem } from '../../types';
import { 
  Music, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Upload, 
  Sparkles,
  FileText,
  Tag,
  Link2,
  AlertCircle,
  XCircle
} from 'lucide-react';

export const LokgeetManager: React.FC = () => {
  const { 
    lokgeetList, 
    lokgeetCategories, 
    saveLokgeetCategory, 
    deleteLokgeetCategory, 
    saveLokgeet, 
    deleteLokgeet, 
    uploadFileToStorage 
  } = useCms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingItem, setEditingItem] = useState<PawariLokgeetItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<PawariLokgeetItem>>({
    title_pawari: '',
    title_hindi: '',
    category: lokgeetCategories[0] || 'भजन / भक्ति गीत',
    lyrics_pawari: '',
    lyrics_hindi_meaning: '',
    singer_or_collector: '',
    youtube_url: '',
    image_url: '',
    slug: '',
    contributor_name: 'माँ ताप्ती शोध संस्थान',
    status: 'published',
    editorial_comments: ''
  });

  const WORKFLOW_STATUSES = [
    { value: 'draft', label: 'ड्राफ्ट (Draft)' },
    { value: 'pending', label: 'समीक्षा हेतु लंबित (Pending Review)' },
    { value: 'changes_requested', label: 'संशोधन अपेक्षित (Changes Requested)' },
    { value: 'approved', label: 'स्वीकृत (Approved)' },
    { value: 'published', label: 'प्रकाशित (Published)' },
    { value: 'rejected', label: 'अस्वीकृत (Rejected)' }
  ];

  const filteredItems = lokgeetList.filter(item => {
    const matchesSearch = 
      item.title_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title_hindi && item.title_hindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lyrics_pawari.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title_pawari: '',
      title_hindi: '',
      category: lokgeetCategories[0] || 'भजन / भक्ति गीत',
      lyrics_pawari: '',
      lyrics_hindi_meaning: '',
      singer_or_collector: '',
      youtube_url: '',
      image_url: '',
      slug: '',
      contributor_name: 'माँ ताप्ती शोध संस्थान',
      status: 'published',
      editorial_comments: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PawariLokgeetItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await saveLokgeetCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleDeleteCategory = async (cat: string) => {
    if (window.confirm(`क्या आप श्रेणी "${cat}" को हटाना चाहते हैं?`)) {
      await deleteLokgeetCategory(cat);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'lokgeet');
      setFormData(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_pawari || !formData.lyrics_pawari) {
      alert('कृपया लोकगीत का शीर्षक एवं बोल (Lyrics) दोनों दर्ज करें।');
      return;
    }

    const itemToSave: PawariLokgeetItem = {
      id: editingItem ? editingItem.id : 'lokgeet_' + Date.now(),
      title_pawari: formData.title_pawari || '',
      title_hindi: formData.title_hindi || '',
      category: formData.category || lokgeetCategories[0] || 'अन्य',
      lyrics_pawari: formData.lyrics_pawari || '',
      lyrics_hindi_meaning: formData.lyrics_hindi_meaning || '',
      singer_or_collector: formData.singer_or_collector || '',
      youtube_url: formData.youtube_url || '',
      image_url: formData.image_url || '',
      slug: formData.slug || '',
      contributor_name: formData.contributor_name || 'एडमिन',
      status: formData.status || 'published',
      editorial_comments: formData.editorial_comments || '',
      created_at: editingItem ? editingItem.created_at : new Date().toISOString()
    };

    await saveLokgeet(itemToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`क्या आप लोकगीत "${title}" को हटाना चाहते हैं?`)) {
      await deleteLokgeet(id);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/50"><CheckCircle2 className="w-3 h-3" /> प्रकाशित</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/50"><CheckCircle2 className="w-3 h-3" /> स्वीकृत</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/50"><Clock className="w-3 h-3" /> विचाराधीन</span>;
      case 'changes_requested':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-800/50"><AlertCircle className="w-3 h-3" /> संशोधन अपेक्षित</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800/50"><XCircle className="w-3 h-3" /> अस्वीकृत</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-700"><FileText className="w-3 h-3" /> ड्राफ्ट</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Music className="w-5 h-5" />
            <span>पवारी लोकगीत प्रबंधक (Pawari Lokgeet CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            पारंपरिक लोकगीतों का वर्गीकरण, सम्पादकीय वर्कफ़्लो तथा dynamic श्रेणियाँ (कुल {lokgeetList.length} लोकगीत)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-800/50 font-medium text-sm transition-all cursor-pointer"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>श्रेणियाँ प्रबंधित करें ({lokgeetCategories.length})</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>नया लोकगीत जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="लोकगीत का शीर्षक या बोल खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-amber-400 font-medium whitespace-nowrap">श्रेणी:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-amber-900/40 rounded-lg text-amber-200 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="all">सभी श्रेणियाँ ({lokgeetList.length})</option>
            {lokgeetCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lokgeet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="p-5">
              {item.image_url && (
                <div className="h-40 rounded-xl overflow-hidden mb-4 relative bg-slate-950 border border-amber-900/30">
                  <img 
                    src={item.image_url} 
                    alt={item.title_pawari} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-amber-200 font-serif">
                    {item.title_pawari}
                  </h3>
                  {item.title_hindi && (
                    <p className="text-xs text-amber-400/70 font-medium">
                      ({item.title_hindi})
                    </p>
                  )}
                </div>

                {getStatusBadge(item.status)}
              </div>

              {item.singer_or_collector && (
                <p className="text-xs text-amber-300/80 mb-3 flex items-center gap-1.5">
                  <span className="font-semibold text-amber-400">संग्रहकर्ता / गायक:</span>
                  <span>{item.singer_or_collector}</span>
                </p>
              )}

              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-900/20 text-xs text-amber-100/90 font-serif whitespace-pre-line line-clamp-4 leading-relaxed mb-3">
                {item.lyrics_pawari}
              </div>

              {item.slug && (
                <div className="text-[11px] text-amber-400/60 font-mono flex items-center gap-1 truncate mb-2">
                  <Link2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">/lokgeet/{item.slug}</span>
                </div>
              )}

              {item.editorial_comments && (
                <div className="bg-amber-950/40 border border-amber-800/30 p-2.5 rounded-lg text-xs text-amber-200/90 mb-2">
                  <span className="font-semibold text-amber-400">सम्पादकीय टिप्पणी:</span> {item.editorial_comments}
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-950/60 border-t border-amber-900/20 flex items-center justify-between">
              <span className="text-xs text-amber-400/60 font-mono">
                ID: {item.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer"
                  title="संपादित करें"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title_pawari)}
                  className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-amber-100">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <Tag className="w-5 h-5 text-amber-400" />
              लोकगीत श्रेणी प्रबंधन (Lokgeet Categories)
            </h3>

            <div className="space-y-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="नई श्रेणी का नाम..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-amber-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  जोड़ें
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {lokgeetCategories.map(cat => (
                  <div key={cat} className="flex items-center justify-between p-2.5 bg-slate-950 border border-amber-900/30 rounded-xl text-sm text-amber-100">
                    <span>{cat}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      title="श्रेणी हटाएँ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Item Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingItem ? 'लोकगीत संपादित करें (Edit Lokgeet)' : 'नया पवारी लोकगीत जोड़ें (Add Lokgeet)'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    लोकगीत शीर्षक (पवारी) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: माँ ताप्ती स्तुति एवं बधावा"
                    value={formData.title_pawari || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_pawari: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    शीर्षक (हिंदी अनुवाद)
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: माँ ताप्ती की वंदना"
                    value={formData.title_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={formData.category || lokgeetCategories[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {lokgeetCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    वर्कफ़्लो स्थिति (Editorial Status)
                  </label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {WORKFLOW_STATUSES.map(st => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    गायक / संग्रहकर्ता का नाम
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: संग्रहकर्ता: डॉ. कैलाश पवार"
                    value={formData.singer_or_collector || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, singer_or_collector: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    URL स्लग (Slug - optional override)
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated-if-empty"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  लोकगीत के बोल (Pawari Lyrics) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="पवारी लोकगीत के पूरे बोल पंक्तियों में लिखें..."
                  value={formData.lyrics_pawari || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics_pawari: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  गीत का हिंदी भावार्थ (Meaning in Hindi)
                </label>
                <textarea
                  rows={2}
                  placeholder="गीत की पंक्तियों का हिंदी अर्थ..."
                  value={formData.lyrics_hindi_meaning || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics_hindi_meaning: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  चित्र (Image URL or Upload)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                  <label className="px-4 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'अपलोड...' : 'फाइल चुनें'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  सम्पादकीय नोट्स / टिप्पणियाँ (Editorial Notes)
                </label>
                <input
                  type="text"
                  placeholder="आंतरिक टिप्पणियाँ या लेखक/योगदानकर्ता हेतु संदेश..."
                  value={formData.editorial_comments || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, editorial_comments: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-sm font-bold shadow-lg transition-colors cursor-pointer"
                >
                  {editingItem ? 'सहेजें (Save Changes)' : 'लोकगीत जोड़ें (Add Lokgeet)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
