import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Edit3, 
  BookOpen, 
  HelpCircle, 
  Music,
  Filter
} from 'lucide-react';

export const PublicContributionsManager: React.FC = () => {
  const { shabdkoshList, paheliList, lokgeetList, updateContributionStatus, deleteShabdkosh, deletePaheli, deleteLokgeet } = useCms();
  const [activeTab, setActiveTab] = useState<'shabdkosh' | 'paheli' | 'lokgeet'>('shabdkosh');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all items for active tab
  const getItems = () => {
    if (activeTab === 'shabdkosh') return shabdkoshList;
    if (activeTab === 'paheli') return paheliList;
    return lokgeetList;
  };

  const rawItems = getItems();

  const filteredItems = rawItems.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const itemTitle = (item as any).word_pawari || (item as any).riddle_pawari || (item as any).title_pawari || '';
    const itemContributor = item.contributor_name || '';
    const matchesSearch = 
      itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemContributor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = {
    shabdkosh: shabdkoshList.filter(i => i.status === 'pending').length,
    paheli: paheliList.filter(i => i.status === 'pending').length,
    lokgeet: lokgeetList.filter(i => i.status === 'pending').length
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'pending' | 'rejected') => {
    await updateContributionStatus(activeTab, id, status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप इस प्रविष्टि को हटाना चाहते हैं?')) {
      if (activeTab === 'shabdkosh') await deleteShabdkosh(id);
      else if (activeTab === 'paheli') await deletePaheli(id);
      else await deleteLokgeet(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Users className="w-5 h-5" />
            <span>जन-सामान्‍य (पाठक) योगदान समीक्षा (Public Contributions CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            आम पाठकों द्वारा जोड़े गए शब्द, पहेलियाँ एवं लोकगीत की समीक्षा, स्वीकृति (Approve) या अस्वीकृति (Reject) करें
          </p>
        </div>

        {/* Pending Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            कुल लंबित: {pendingCount.shabdkosh + pendingCount.paheli + pendingCount.lokgeet}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-amber-900/40 pb-3">
        <button
          onClick={() => setActiveTab('shabdkosh')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'shabdkosh'
              ? 'bg-amber-500 text-amber-950 shadow-lg'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>शब्दकोश (Words)</span>
          {pendingCount.shabdkosh > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.shabdkosh}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('paheli')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'paheli'
              ? 'bg-amber-500 text-amber-950 shadow-lg'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>पहेलियाँ (Riddles)</span>
          {pendingCount.paheli > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.paheli}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lokgeet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'lokgeet'
              ? 'bg-amber-500 text-amber-950 shadow-lg'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>लोकगीत (Songs)</span>
          {pendingCount.lokgeet > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.lokgeet}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="योगदानकर्ता या शीर्षक खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400/60" />
          {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st 
                  ? 'bg-amber-500 text-amber-950 font-bold' 
                  : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? 'सभी' : st === 'pending' ? 'लंबित (Pending)' : st === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map((item: any) => (
          <div 
            key={item.id}
            className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                  {item.category || 'सामान्य'}
                </span>

                {item.status === 'approved' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700">
                    <CheckCircle2 className="w-3 h-3" /> स्वीकृत (Approved)
                  </span>
                )}
                {item.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700">
                    <Clock className="w-3 h-3" /> समीक्षा हेतु लंबित (Pending)
                  </span>
                )}
                {item.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-700">
                    <XCircle className="w-3 h-3" /> अस्वीकृत (Rejected)
                  </span>
                )}
              </div>

              {/* Detail Content */}
              {activeTab === 'shabdkosh' && (
                <div>
                  <h4 className="text-lg font-bold text-amber-200 font-serif">
                    {item.word_pawari} {item.pronunciation_hindi && <span className="text-xs text-amber-400/80 font-sans font-normal">[{item.pronunciation_hindi}]</span>}
                  </h4>
                  <p className="text-sm text-amber-100 font-medium mt-1">
                    <span className="text-amber-400 text-xs">अर्थ:</span> {item.meaning_hindi}
                  </p>
                  {item.example_pawari && (
                    <p className="text-xs text-amber-300/80 italic mt-1 bg-amber-950/30 p-2 rounded-lg">
                      "{item.example_pawari}"
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'paheli' && (
                <div>
                  <h4 className="text-base font-bold text-amber-200 font-serif leading-relaxed">
                    "{item.riddle_pawari}"
                  </h4>
                  <p className="text-sm text-emerald-300 font-bold mt-1">
                    उत्तर: {item.answer_hindi} {item.answer_pawari && `(${item.answer_pawari})`}
                  </p>
                </div>
              )}

              {activeTab === 'lokgeet' && (
                <div>
                  <h4 className="text-lg font-bold text-amber-200 font-serif">
                    {item.title_pawari}
                  </h4>
                  <p className="text-xs text-amber-300/80 font-serif line-clamp-2 mt-1 whitespace-pre-line bg-amber-950/30 p-2 rounded-lg">
                    {item.lyrics_pawari}
                  </p>
                </div>
              )}

              <div className="text-xs text-amber-400/60 pt-1 flex items-center gap-4">
                <span>योगदानकर्ता: <strong className="text-amber-300">{item.contributor_name || 'पाठक'}</strong></span>
                <span>दिनांक: {new Date(item.created_at || Date.now()).toLocaleDateString('hi-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-amber-900/30">
              {item.status !== 'approved' && (
                <button
                  onClick={() => handleStatusChange(item.id, 'approved')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-emerald-950 font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> स्वीकारें
                </button>
              )}

              {item.status !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange(item.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> अस्वीकारें
                </button>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <Users className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई योगदान नहीं मिला।</p>
          </div>
        )}
      </div>
    </div>
  );
};
