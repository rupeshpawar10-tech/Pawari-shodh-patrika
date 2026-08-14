import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { SafeImage } from '../common/SafeImage';
import { DEFAULT_PAWARI_MEMBER_AVATAR } from '../../data/seedData';
import { 
  Mail, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Search,
  Users,
  Filter,
  CheckCircle2,
  Tag,
  BookMarked
} from 'lucide-react';
import { EditorialMember } from '../../types';

export const EditorialBoardView: React.FC = () => {
  const { lang, editorialMembers } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sort members strictly by admin defined order
  const sortedMembers = useMemo(() => {
    return [...(editorialMembers || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [editorialMembers]);

  // Helper to categorize roles safely supporting English, Hindi, and custom roles
  const getRoleCategory = (member: EditorialMember): string => {
    const r = (member.role || member.designation_english || member.designation_hindi || '').toLowerCase();
    
    // 1. Patrons & Chief Editors
    if (
      r.includes('chief') || 
      r.includes('patron') || 
      r.includes('director') || 
      r.includes('founder') || 
      r.includes('संरक्षक') || 
      r.includes('संस्थापक') || 
      r.includes('मुख्य') || 
      r.includes('अध्यक्ष') || 
      r.includes('निदेशक')
    ) {
      return 'chief';
    }

    // 2. Managing & Executive Editors
    if (
      r.includes('executive') || 
      r.includes('managing') || 
      r.includes('कार्यकारी') || 
      r.includes('प्रबंध')
    ) {
      return 'managing';
    }

    // 3. Associate & Co-Editors
    if (
      r.includes('associate') || 
      r.includes('co-editor') || 
      r.includes('section') || 
      r.includes('सह-संपादक') || 
      r.includes('सह संपादक')
    ) {
      return 'associate';
    }

    // 4. Board Members
    if (
      r.includes('board member') || 
      r.includes('editorial member') || 
      r.includes('member') || 
      r.includes('मंडल सदस्य') || 
      r.includes('सदस्य')
    ) {
      return 'members';
    }

    // 5. Reviewers & Advisory
    if (
      r.includes('advisor') || 
      r.includes('advisory') || 
      r.includes('reviewer') || 
      r.includes('consultant') || 
      r.includes('परामर्श') || 
      r.includes('सलाहकार') || 
      r.includes('समीक्षक')
    ) {
      return 'advisory';
    }

    // Default: If it contains editor / संपादक, group under associate/general editor
    if (r.includes('editor') || r.includes('संपादक')) {
      return 'associate';
    }

    // 6. Custom or Specialist Roles
    return 'specialist';
  };

  // Filtered members based on search and category tab
  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(m => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || (
        (m.name_hindi && m.name_hindi.toLowerCase().includes(q)) ||
        (m.name_english && m.name_english.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.designation_hindi && m.designation_hindi.toLowerCase().includes(q)) ||
        (m.designation_english && m.designation_english.toLowerCase().includes(q)) ||
        (m.affiliation_hindi && m.affiliation_hindi.toLowerCase().includes(q)) ||
        (m.affiliation_english && m.affiliation_english.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.research_areas && m.research_areas.some(a => a.toLowerCase().includes(q))) ||
        (m.subject_areas && m.subject_areas.some(a => a.toLowerCase().includes(q)))
      );

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      return getRoleCategory(m) === selectedCategory;
    });
  }, [sortedMembers, searchTerm, selectedCategory]);

  // Dynamic Grouping for Section View (when 'all' is selected and no search)
  const groupedSections = useMemo(() => {
    const chief = sortedMembers.filter(m => getRoleCategory(m) === 'chief');
    const managing = sortedMembers.filter(m => getRoleCategory(m) === 'managing');
    const associate = sortedMembers.filter(m => getRoleCategory(m) === 'associate');
    const members = sortedMembers.filter(m => getRoleCategory(m) === 'members');
    const advisory = sortedMembers.filter(m => getRoleCategory(m) === 'advisory');
    const specialist = sortedMembers.filter(m => getRoleCategory(m) === 'specialist');

    const sections = [];

    if (chief.length > 0) {
      sections.push({
        id: 'chief',
        titleHi: 'संरक्षक एवं मुख्य संपादन मंडल',
        titleEn: 'Patrons & Chief Editorial Board',
        icon: Sparkles,
        iconColor: 'text-amber-600',
        members: chief
      });
    }

    if (managing.length > 0) {
      sections.push({
        id: 'managing',
        titleHi: 'प्रबंध एवं कार्यकारी संपादक',
        titleEn: 'Executive & Managing Editors',
        icon: BookMarked,
        iconColor: 'text-red-800',
        members: managing
      });
    }

    if (associate.length > 0) {
      sections.push({
        id: 'associate',
        titleHi: 'सह-संपादक एवं खंड संपादन मंडल',
        titleEn: 'Associate & Section Editors',
        icon: BookOpen,
        iconColor: 'text-amber-700',
        members: associate
      });
    }

    if (members.length > 0) {
      sections.push({
        id: 'members',
        titleHi: 'संपादकीय मंडल सदस्य',
        titleEn: 'Editorial Board Members',
        icon: Users,
        iconColor: 'text-indigo-700',
        members: members
      });
    }

    if (advisory.length > 0) {
      sections.push({
        id: 'advisory',
        titleHi: 'अंतर्राष्ट्रीय अकादमिक परामर्शदाता एवं समीक्षा परिषद',
        titleEn: 'Editorial Advisory Board & Peer Reviewers',
        icon: Globe,
        iconColor: 'text-sky-700',
        members: advisory
      });
    }

    if (specialist.length > 0) {
      sections.push({
        id: 'specialist',
        titleHi: 'विद्वत विशेषज्ञ एवं विशिष्ट पद',
        titleEn: 'Specialist Advisors & Honorary Roles',
        icon: Award,
        iconColor: 'text-emerald-700',
        members: specialist
      });
    }

    return sections;
  }, [sortedMembers]);

  // Render a Single Member Card
  const renderMemberCard = (member: EditorialMember) => (
    <div 
      key={member.id}
      className="bg-white border border-amber-900/15 hover:border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-amber-500 to-amber-700 opacity-80" />

      <div className="space-y-4">
        
        <div className="flex items-start space-x-3.5 sm:space-x-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md flex-shrink-0 bg-amber-50 group-hover:scale-105 transition transform duration-200">
            <SafeImage 
              src={member.photo_url || DEFAULT_PAWARI_MEMBER_AVATAR} 
              alt={member.name_english || member.name_hindi || 'Editorial Board Member'} 
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              fallbackSrc={DEFAULT_PAWARI_MEMBER_AVATAR}
            />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-red-950 px-2.5 py-0.5 rounded-full inline-block border border-amber-400/40 truncate max-w-full">
                {member.role || 'Editorial Member'}
              </span>
              {typeof member.order === 'number' && (
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  #{member.order}
                </span>
              )}
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-red-950 transition leading-snug">
              {lang === 'hi' ? member.name_hindi : member.name_english}
            </h3>

            {member.name_hindi && member.name_english && member.name_hindi !== member.name_english && (
              <p className="text-[11px] font-medium text-slate-500 font-sans">
                {lang === 'hi' ? member.name_english : member.name_hindi}
              </p>
            )}

            <p className="text-xs font-semibold text-red-900 flex items-center space-x-1 pt-0.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="line-clamp-2">{lang === 'hi' ? member.designation_hindi || member.designation_english : member.designation_english || member.designation_hindi}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2 pt-2.5 border-t border-slate-100">
          <p className="font-medium flex items-start space-x-1.5 text-slate-700 leading-relaxed">
            <Building className="w-3.5 h-3.5 text-amber-800 flex-shrink-0 mt-0.5" />
            <span>{lang === 'hi' ? member.affiliation_hindi || member.affiliation_english : member.affiliation_english || member.affiliation_hindi}</span>
          </p>

          {member.email && (
            <p className="text-red-900 font-mono text-[11px] flex items-center space-x-1.5 pt-0.5">
              <Mail className="w-3.5 h-3.5 text-red-800 shrink-0" />
              <a href={`mailto:${member.email}`} className="hover:underline truncate">{member.email}</a>
            </p>
          )}
        </div>

        {/* Research Expertise & Subject Areas Tags */}
        {((member.research_areas && member.research_areas.length > 0) || (member.subject_areas && member.subject_areas.length > 0)) && (
          <div className="pt-2 space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-950 uppercase tracking-wider block">
              {lang === 'hi' ? 'शोध क्षेत्र एवं विशेषज्ञता:' : 'Research Interests & Expertise:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {[...(member.research_areas || []), ...(member.subject_areas || [])].map((area, i) => (
                <span key={i} className="text-[10px] bg-amber-50/80 text-amber-950 px-2.5 py-0.5 rounded-md font-medium border border-amber-200/80 shadow-2xs">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Member Bio / Profile Summary */}
        {(member.bio_hindi || member.bio_english) && (
          <div className="pt-2 text-xs text-slate-600 italic leading-relaxed bg-amber-50/40 p-3 rounded-2xl border border-amber-200/60 font-serif">
            "{lang === 'hi' ? (member.bio_hindi || member.bio_english) : (member.bio_english || member.bio_hindi)}"
          </div>
        )}

      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center space-x-1 text-emerald-700 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Peer Review Council</span>
        </span>
        <span className="text-slate-500 font-semibold">PSP-Verified</span>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Editorial Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-500/30 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-400/30 text-xs font-bold font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'अकादमिक विद्वत परिषद' : 'Academic Leadership & Editorial Council'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight">
              {lang === 'hi' ? 'संपादकीय मंडल एवं समीक्षा परिषद' : 'Editorial Board & Reviewers Committee'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पवारी शोध पत्रिका का कुशल मार्गदर्शन एवं डबल-ब्लाइंड समीक्षा प्रक्रिया अंतर्राष्ट्रीय तथा राष्ट्रीय स्तर के प्रतिष्ठित प्रोफेसरों, भाषावैज्ञानिकों एवं अकादमिक विद्वानों द्वारा संचालित की जाती है।'
                : 'Pawari Shodh Patrika is guided by distinguished linguists, folklorists, and academic scholars adhering strictly to rigorous double-blind peer review protocols.'}
            </p>
          </div>

          <div className="bg-white/10 p-4 sm:p-5 rounded-2xl border border-amber-400/30 text-xs font-mono text-amber-200 space-y-2 flex-shrink-0 w-full md:w-auto shadow-inner">
            <div className="flex justify-between space-x-6">
              <span>Review Standard:</span>
              <strong className="text-amber-400">Double Blind</strong>
            </div>
            <div className="flex justify-between space-x-6">
              <span>COPE Compliance:</span>
              <strong className="text-emerald-400">Adhered & Verified</strong>
            </div>
            <div className="flex justify-between space-x-6">
              <span>Active Board Members:</span>
              <strong className="text-amber-300">{sortedMembers.length} Scholars</strong>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'hi' ? 'नाम, पद, विश्वविद्यालय या शोध क्षेत्र से खोजें...' : 'Search scholar by name, role, university, or research topic...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-amber-400/80 shadow-xs focus:ring-2 focus:ring-amber-500 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-200 shrink-0">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>{filteredMembers.length} of {sortedMembers.length} Listed</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'all'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? `समस्त विद्वत परिषद (${sortedMembers.length})` : `All Board Members (${sortedMembers.length})`}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('chief')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'chief'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? 'संरक्षक एवं मुख्य संपादन' : 'Patrons & Chief Editors'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('managing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'managing'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? 'प्रबंध एवं कार्यकारी संपादक' : 'Executive & Managing'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('associate')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'associate'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? 'सह-संपादक व खंड संपादक' : 'Associate Editors'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('members')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'members'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? 'संपादकीय सदस्य' : 'Board Members'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('advisory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
            selectedCategory === 'advisory'
              ? 'bg-red-950 text-amber-100 shadow-md border border-amber-500/40'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'hi' ? 'परामर्शदाता व समीक्षक' : 'Advisory & Reviewers'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      {selectedCategory === 'all' && !searchTerm ? (
        // Hierarchical Grouped View by Sections
        <div className="space-y-10">
          {groupedSections.map(sec => {
            const IconComponent = sec.icon;
            return (
              <div key={sec.id} className="space-y-4">
                <div className="border-b border-amber-900/15 pb-2.5 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 flex items-center space-x-2">
                    <IconComponent className={`w-5 h-5 ${sec.iconColor}`} />
                    <span>{lang === 'hi' ? sec.titleHi : sec.titleEn}</span>
                  </h2>
                  <span className="text-xs font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {sec.members.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sec.members.map(renderMemberCard)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Filtered Grid View
        <div className="space-y-4">
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(renderMemberCard)}
            </div>
          ) : (
            <div className="bg-white border border-amber-900/10 rounded-3xl p-10 text-center space-y-3">
              <Users className="w-10 h-10 text-amber-800/40 mx-auto" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                {lang === 'hi' ? 'कोई सदस्य नहीं मिला' : 'No Board Members Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'hi' 
                  ? 'आपके खोज या फ़िल्टर के अनुसार कोई सदस्य उपलब्ध नहीं है। कृपया भिन्न खोज शब्द का प्रयोग करें।' 
                  : 'No editorial board members matched your current filter criteria. Try clearing the search keyword.'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="px-4 py-2 bg-red-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-red-900 transition cursor-pointer"
              >
                {lang === 'hi' ? 'फ़िल्टर हटाएं (Reset Filters)' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
