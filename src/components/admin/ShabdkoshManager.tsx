import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Upload, 
  Image as ImageIcon,
  Sparkles,
  Volume2
} from 'lucide-react';

export const ShabdkoshManager: React.FC = () => {
  const { shabdkoshList, saveShabdkosh, deleteShabdkosh, uploadFileToStorage } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PawariShabdkoshItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<PawariShabdkoshItem>>({
    word_pawari: '',
    pronunciation_hindi: '',
    meaning_hindi: '',
    meaning_english: '',
    example_pawari: '',
    example_hindi: '',
    category: 'दैनिक शब्द',
    image_url: '',
    contributor_name: 'एडमिन',
    status: 'approved'
  });

  const categories = ['दैनिक शब्द', 'रिश्ते-नाते', 'खान-पान', 'कृषि एवं लोक जीवन', 'संस्कृति एवं परम्परा', 'अन्य'];

  const filteredItems = shabdkoshList.filter(item => {
    const matchesSearch = 
      item.word_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.meaning_english && item.meaning_english.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      word_pawari: '',
      pronunciation_hindi: '',
      meaning_hindi: '',
      meaning_english: '',
      example_pawari: '',
      example_hindi: '',
      category: 'दैनिक शब्द',
      image_url: '',
      contributor_name: 'माँ ताप्ती शोध संस्थान',
      status: 'approved'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PawariShabdkoshItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'shabdkosh');
      setFormData(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word_pawari || !formData.meaning_hindi) {
      alert('कृपया पवारी शब्द एवं हिंदी अर्थ दोनों दर्ज करें।');
      return;
    }

    const itemToSave: PawariShabdkoshItem = {
      id: editingItem ? editingItem.id : 'shabd_' + Date.now(),
      word_pawari: formData.word_pawari || '',
      pronunciation_hindi: formData.pronunciation_hindi || '',
      meaning_hindi: formData.meaning_hindi || '',
      meaning_english: formData.meaning_english || '',
      example_pawari: formData.example_pawari || '',
      example_hindi: formData.example_hindi || '',
      category: formData.category || 'दैनिक शब्द',
      image_url: formData.image_url || '',
      audio_url: formData.audio_url || '',
      contributor_name: formData.contributor_name || 'एडमिन',
      status: formData.status || 'approved',
      created_at: editingItem ? editingItem.created_at : new Date().toISOString()
    };

    await saveShabdkosh(itemToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, word: string) => {
    if (window.confirm(`क्या आप शब्द "${word}" को हटाना चाहते हैं?`)) {
      await deleteShabdkosh(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <BookOpen className="w-5 h-5" />
            <span>पवारी भोयरी शब्दकोश प्रबंधक (Pawari Shabdkosh CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            पवारी भाषा के शब्दों, उनके हिंदी/अंग्रेजी अर्थ, उच्चारण एवं वाक्यों का प्रबंधन करें (कुल {shabdkoshList.length} शब्द)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>नया शब्द जोड़ें</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="शब्द या अर्थ खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-amber-500 text-amber-950 font-bold' 
                : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
            }`}
          >
            सभी श्रेणी
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-amber-500 text-amber-950 font-bold' 
                  : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shabdkosh Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col group"
          >
            {item.image_url ? (
              <div className="h-44 overflow-hidden relative bg-slate-950">
                <img 
                  src={item.image_url} 
                  alt={item.word_pawari} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-700/50">
                  {item.category}
                </span>
              </div>
            ) : (
              <div className="h-28 bg-gradient-to-br from-amber-950/40 to-slate-900 flex items-center justify-center relative border-b border-amber-900/20">
                <BookOpen className="w-10 h-10 text-amber-600/30" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/50">
                  {item.category}
                </span>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-amber-200 tracking-wide font-serif">
                    {item.word_pawari}
                  </h3>
                  {item.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" /> स्वीकृत
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                      <Clock className="w-3 h-3" /> विचाराधीन
                    </span>
                  )}
                </div>

                {item.pronunciation_hindi && (
                  <p className="text-xs text-amber-400/70 mb-2 italic">
                    उच्चारण: [{item.pronunciation_hindi}]
                  </p>
                )}

                <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-900/20 mb-3 space-y-1">
                  <p className="text-sm font-semibold text-amber-100">
                    <span className="text-amber-500 font-normal text-xs mr-1">अर्थ (हिंदी):</span> 
                    {item.meaning_hindi}
                  </p>
                  {item.meaning_english && (
                    <p className="text-xs text-slate-400">
                      <span className="text-slate-500 mr-1">English:</span> {item.meaning_english}
                    </p>
                  )}
                </div>

                {item.example_pawari && (
                  <div className="text-xs text-amber-200/80 space-y-1 mb-3">
                    <p className="italic bg-amber-950/30 p-2 rounded-lg border border-amber-800/20">
                      <span className="font-semibold text-amber-400 not-italic">वाक्य (पवारी):</span> "{item.example_pawari}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-400/60 mt-2">
                <span>योगदान: {item.contributor_name || 'एडमिन'}</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/50 text-amber-200 transition-colors"
                    title="संपादित करें"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.word_pawari)}
                    className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 text-red-300 transition-colors"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <BookOpen className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई शब्द नहीं मिला।</p>
            <p className="text-xs text-amber-400/40 mt-1">नया शब्द जोड़ने के लिए ऊपर बटन पर क्लिक करें।</p>
          </div>
        )}
      </div>

      {/* Add / Edit Shabdkosh Modal */}
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
              {editingItem ? 'शब्द संपादित करें (Edit Word)' : 'नया पवारी शब्द जोड़ें (Add Pawari Word)'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    पवारी शब्द (Pawari Word) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: डोरा, आवो, भाकर"
                    value={formData.word_pawari || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, word_pawari: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    हिंदी उच्चारण (Pronunciation)
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: डो-रा"
                    value={formData.pronunciation_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pronunciation_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    हिंदी अर्थ (Hindi Meaning) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: आंख / नेत्र"
                    value={formData.meaning_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meaning_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    अंग्रेजी अर्थ (English Meaning)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eye, Mother, Roti"
                    value={formData.meaning_english || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meaning_english: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  श्रेणी (Category)
                </label>
                <select
                  value={formData.category || 'दैनिक शब्द'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  पवारी वाक्य प्रयोग (Example Sentence in Pawari)
                </label>
                <textarea
                  rows={2}
                  placeholder="जैसे: पवारी लरका का डोरा बड़ा सुंदर चमकत है।"
                  value={formData.example_pawari || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, example_pawari: e.target.value }))}
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

              <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-sm font-medium transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-sm font-bold shadow-lg transition-colors"
                >
                  {editingItem ? 'सहेजें (Save Changes)' : 'शब्द जोड़ें (Add Word)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
