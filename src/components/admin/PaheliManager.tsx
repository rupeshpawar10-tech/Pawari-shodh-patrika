import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariPaheliItem } from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Upload, 
  Lightbulb, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const PaheliManager: React.FC = () => {
  const { paheliList, savePaheli, deletePaheli, uploadFileToStorage } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PawariPaheliItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<Partial<PawariPaheliItem>>({
    riddle_pawari: '',
    answer_hindi: '',
    answer_pawari: '',
    hint_hindi: '',
    explanation_hindi: '',
    category: 'प्रकृति',
    image_url: '',
    contributor_name: 'माँ ताप्ती शोध संस्थान',
    status: 'approved'
  });

  const categories = ['प्रकृति', 'घरेलू सामान', 'कृषि/खेती', 'शरीर के अंग', 'पशु-पक्षी', 'सामान्य ज्ञान'];

  const filteredItems = paheliList.filter(item => 
    item.riddle_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.answer_pawari && item.answer_pawari.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      riddle_pawari: '',
      answer_hindi: '',
      answer_pawari: '',
      hint_hindi: '',
      explanation_hindi: '',
      category: 'प्रकृति',
      image_url: '',
      contributor_name: 'माँ ताप्ती शोध संस्थान',
      status: 'approved'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PawariPaheliItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'paheli');
      setFormData(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.riddle_pawari || !formData.answer_hindi) {
      alert('कृपया पहेली एवं उसका उत्तर दोनों दर्ज करें।');
      return;
    }

    const itemToSave: PawariPaheliItem = {
      id: editingItem ? editingItem.id : 'paheli_' + Date.now(),
      riddle_pawari: formData.riddle_pawari || '',
      answer_hindi: formData.answer_hindi || '',
      answer_pawari: formData.answer_pawari || '',
      hint_hindi: formData.hint_hindi || '',
      explanation_hindi: formData.explanation_hindi || '',
      category: formData.category || 'प्रकृति',
      image_url: formData.image_url || '',
      contributor_name: formData.contributor_name || 'एडमिन',
      status: formData.status || 'approved',
      created_at: editingItem ? editingItem.created_at : new Date().toISOString()
    };

    await savePaheli(itemToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप इस पहेली को हटाना चाहते हैं?')) {
      await deletePaheli(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <HelpCircle className="w-5 h-5" />
            <span>पवारी पहेली प्रबंधक (Pawari Paheli CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            पवारी लोक संस्कृति की प्रसिद्ध पहेलियों (बुझौवल), उत्तर, संकेत एवं व्याख्या का प्रबंधन करें (कुल {paheliList.length} पहेलियाँ)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>नयी पहेली जोड़ें</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="पहेली या उत्तर खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
      </div>

      {/* Paheli Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isAnswerShown = revealedAnswers[item.id];
          return (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3 border-b border-amber-900/20 pb-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
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

                <div className="flex gap-4">
                  {item.image_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-amber-900/40">
                      <img 
                        src={item.image_url} 
                        alt="पहेली चित्र" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-100 mb-2 font-serif leading-relaxed">
                      "{item.riddle_pawari}"
                    </h3>

                    {item.hint_hindi && (
                      <p className="text-xs text-amber-400/80 flex items-center gap-1.5 mb-3 bg-amber-950/40 p-2 rounded-lg border border-amber-800/20">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>संकेत: {item.hint_hindi}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Reveal Answer Box */}
                <div className="mt-4 pt-3 border-t border-amber-900/30">
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-950 hover:bg-slate-950/80 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300 transition-colors"
                  >
                    <span>उत्तर देखें (Reveal Answer)</span>
                    {isAnswerShown ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                  </button>

                  {isAnswerShown && (
                    <div className="mt-3 p-3 bg-amber-950/50 rounded-xl border border-amber-700/40 space-y-1 animate-fadeIn">
                      <p className="text-sm font-bold text-amber-200">
                        उत्तर (हिंदी): {item.answer_hindi}
                      </p>
                      {item.answer_pawari && (
                        <p className="text-xs text-amber-300">
                          उत्तर (पवारी): {item.answer_pawari}
                        </p>
                      )}
                      {item.explanation_hindi && (
                        <p className="text-xs text-slate-300 mt-2 border-t border-amber-800/30 pt-1.5">
                          {item.explanation_hindi}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-950/50 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-400/60">
                <span>योगदान: {item.contributor_name || 'एडमिन'}</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/50 text-amber-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई पहेली नहीं मिली।</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
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
              {editingItem ? 'पहेली संपादित करें (Edit Paheli)' : 'नयी पवारी पहेली जोड़ें (Add Paheli)'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  पवारी पहेली पाठ (Pawari Riddle Text) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="जैसे: एक थार मा मोती भरा, सब का सिर पर औंधा धरा..."
                  value={formData.riddle_pawari || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, riddle_pawari: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    उत्तर (हिंदी में) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: आकाश और तारे"
                    value={formData.answer_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    उत्तर (पवारी में)
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: तारा और अगाश"
                    value={formData.answer_pawari || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer_pawari: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    संकेत / Hint
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: रात के समय आसमान में देखना"
                    value={formData.hint_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hint_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={formData.category || 'प्रकृति'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  विस्तृत व्याख्या / सांस्कृतिक संदर्भ
                </label>
                <textarea
                  rows={2}
                  placeholder="पहेली के सांस्कृतिक महत्व या संदर्भ की संक्षिप्त टिप्पणी..."
                  value={formData.explanation_hindi || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, explanation_hindi: e.target.value }))}
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
                  {editingItem ? 'सहेजें (Save Changes)' : 'पहेली जोड़ें (Add Paheli)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
