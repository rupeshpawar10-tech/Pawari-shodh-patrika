import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { SafeImage } from '../common/SafeImage';
import { DEFAULT_PAWARI_MEMBER_AVATAR } from '../../data/seedData';
import { Mail, Award, BookOpen, GraduationCap, Building, ExternalLink, ShieldCheck, Globe, Sparkles } from 'lucide-react';

export const EditorialBoardView: React.FC = () => {
  const { lang, editorialMembers } = useCms();

  const sortedMembers = [...(editorialMembers || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const getRoleStr = (m: typeof editorialMembers[0]) => (m.role || m.designation_english || m.designation_hindi || '').toLowerCase();

  // Grouping by Role safely
  const chiefEditors = sortedMembers.filter(m => {
    const r = getRoleStr(m);
    return r.includes('chief') || r.includes('patron') || r.includes('director') || r.includes('संरक्षक') || r.includes('संस्थापक') || r.includes('अध्यक्ष') || r.includes('निदेशक');
  });

  const associateEditors = sortedMembers.filter(m => {
    if (chiefEditors.includes(m)) return false;
    const r = getRoleStr(m);
    return r.includes('associate') || r.includes('managing') || r.includes('executive') || r.includes('co-editor') || r.includes('editor') || r.includes('संपादक');
  });

  const advisoryBoard = sortedMembers.filter(m => !chiefEditors.includes(m) && !associateEditors.includes(m));

  const renderMemberCard = (member: typeof editorialMembers[0]) => (
    <div 
      key={member.id}
      className="bg-white border border-amber-900/15 hover:border-amber-400/60 rounded-3xl p-6 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between group"
    >
      <div className="space-y-4">
        
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-md flex-shrink-0 bg-slate-100 group-hover:scale-105 transition transform duration-200">
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

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-red-950 px-2.5 py-0.5 rounded-full inline-block border border-amber-400/40">
              {member.role}
            </span>

            <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-red-950 transition leading-snug">
              {lang === 'hi' ? member.name_hindi : member.name_english}
            </h3>

            <p className="text-xs font-semibold text-red-900 flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? member.designation_hindi : member.designation_english}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
          <p className="font-medium flex items-start space-x-1.5 text-slate-700">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>{lang === 'hi' ? member.affiliation_hindi : member.affiliation_english}</span>
          </p>

          {member.email && (
            <p className="text-red-900 font-mono text-[11px] flex items-center space-x-1.5 pt-0.5">
              <Mail className="w-3.5 h-3.5 text-red-800" />
              <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
            </p>
          )}
        </div>

        {/* Research Expertise & Subject Areas Tags */}
        {((member.research_areas && member.research_areas.length > 0) || (member.subject_areas && member.subject_areas.length > 0)) && (
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'शोध क्षेत्र एवं विषय (Research Interests & Subject Areas):' : 'Research Interests & Subject Areas:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {[...(member.research_areas || []), ...(member.subject_areas || [])].map((area, i) => (
                <span key={i} className="text-[10px] bg-amber-50 text-amber-950 px-2.5 py-0.5 rounded-md font-medium border border-amber-200/80 shadow-2xs">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Member Bio / Profile Summary */}
        {(lang === 'hi' ? (member.bio_hindi || member.bio_english) : (member.bio_english || member.bio_hindi)) && (
          <div className="pt-2 text-xs text-slate-600 italic leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-200/60">
            "{lang === 'hi' ? (member.bio_hindi || member.bio_english) : (member.bio_english || member.bio_hindi)}"
          </div>
        )}

      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center space-x-1 text-emerald-700 font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Editorial Member</span>
        </span>
        <span>ORCID Verified</span>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Editorial Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-400/30 text-xs font-bold font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'अंतर्राष्ट्रीय विद्वत परिषद' : 'International Academic Leadership'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              {lang === 'hi' ? 'संपादकीय मंडल एवं समीक्षा परिषद' : 'Editorial Board & Reviewers Committee'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
              {lang === 'hi' 
                ? 'पवारी शोध पत्रिका का कुशल मार्गदर्शन एवं डबल-ब्लाइंड समीक्षा प्रक्रिया अंतर्राष्ट्रीय तथा राष्ट्रीय स्तर के प्रतिष्ठित प्रोफेसरों, भाषावैज्ञानिकों एवं अकादमिक विद्वानों द्वारा संचालित की जाती है।'
                : 'Pawari Shodh Patrika is guided by eminent linguists, sociologists, and international academic scholars adhering strictly to double-blind peer review protocols.'}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-amber-400/30 text-xs font-mono text-amber-200 space-y-1.5 flex-shrink-0">
            <div className="flex justify-between space-x-4">
              <span>Review Standard:</span>
              <strong className="text-amber-400">Double Blind</strong>
            </div>
            <div className="flex justify-between space-x-4">
              <span>COPE Compliance:</span>
              <strong className="text-emerald-400">Verified</strong>
            </div>
            <div className="flex justify-between space-x-4">
              <span>Total Members:</span>
              <strong className="text-amber-300">{sortedMembers.length} Scholars</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chief / Patron Section */}
      {chiefEditors.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-amber-900/15 pb-2">
            <h2 className="text-xl font-serif font-bold text-red-950 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>{lang === 'hi' ? 'संरक्षक एवं मुख्य संपादन मंडल' : 'Patron & Chief Editorial Board'}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chiefEditors.map(renderMemberCard)}
          </div>
        </div>
      )}

      {/* Associate / Section Editors */}
      {associateEditors.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-amber-900/15 pb-2">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{lang === 'hi' ? 'सह-संपादक एवं प्रबंध मंडल' : 'Associate Editors & Managing Board'}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associateEditors.map(renderMemberCard)}
          </div>
        </div>
      )}

      {/* Editorial Advisory Committee */}
      {advisoryBoard.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-amber-900/15 pb-2">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-sky-700" />
              <span>{lang === 'hi' ? 'अंतर्राष्ट्रीय अकादमिक परामर्शदाता मंडल' : 'Editorial Advisory Board'}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisoryBoard.map(renderMemberCard)}
          </div>
        </div>
      )}

    </div>
  );
};
