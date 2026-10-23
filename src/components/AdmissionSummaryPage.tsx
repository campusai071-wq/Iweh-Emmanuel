import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { 
  Sparkles, ArrowLeft, Share2, Bookmark, Check, Copy, 
  ShieldCheck, Scale, Award, Calendar, TrendingUp, AlertTriangle, 
  ExternalLink, FileText, Calculator, HelpCircle, CheckCircle2,
  ChevronRight, BookOpen, Layers, Zap, Clock, Database, Globe,
  BarChart3, PieChart, Users, CheckSquare
} from 'lucide-react';

export const AdmissionSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'review' | 'visuals' | 'timeline' | 'platforms' | 'outlook' | 'checklist'>('review');

  // Interactive Checklist State
  const initialChecklist = [
    { id: 'nin', text: 'Obtain & verify National Identification Number (NIN) linked to personal phone line', checked: true },
    { id: 'ibass', text: 'Cross-check official JAMB IBASS brochure for exact 4-subject combination', checked: true },
    { id: 'cbt_upload', text: 'Upload verified WAEC/NECO/NABTEB O\'Level results at an accredited CBT center', checked: false },
    { id: 'calc_aggregate', text: 'Calculate target aggregate score with CampusAI Aggregate Calculator for first-choice university', checked: false },
    { id: 'catchment_check', text: 'Identify whether your state of origin falls under university Catchment or ELDS quota', checked: false },
    { id: 'caps_monitoring', text: 'Regularly monitor JAMB CAPS on desktop mode for Marketplace transfer proposals', checked: false },
  ];

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('campusai_2027_checklist');
      return saved ? JSON.parse(saved) : initialChecklist;
    } catch (e) {
      return initialChecklist;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('campusai_saved_admission_report');
      if (saved === 'true') setIsSaved(true);
    } catch (e) {}
  }, []);

  const toggleSave = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    try {
      localStorage.setItem('campusai_saved_admission_report', nextState ? 'true' : 'false');
    } catch (e) {}
  };

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map((item: any) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    try {
      localStorage.setItem('campusai_2027_checklist', JSON.stringify(updated));
    } catch (e) {}
  };

  const pageUrl = 'https://campusai.com.ng/reports/nigeria-admission-year-in-review/2026-2027';
  const shareTitle = 'CampusAI: Nigeria\'s Admission Year in Review (2026/2027 Edition)';
  const shareText = 'Comprehensive annual review of the 2026 Nigerian admission cycle, visual data charts, verified timeline, and 2027 outlook.';

  const handleShareFacebook = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(fbShareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n\n${shareText}\n\nRead the full report on CampusAI: ${pageUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(pageUrl)}&via=CampusAI_ng`;
    window.open(twUrl, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: pageUrl,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const completedCount = checklist.filter((i: any) => i.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-24 selection:bg-cyan-500 selection:text-black">
      <SEO 
        title="Nigeria's Admission Year in Review (2026/2027 Edition) | CampusAI" 
        description="Official annual admission intelligence report documenting Nigeria's 2026/2027 admission cycle, visual graphs, verified timeline, institution cutoffs, and 2027 outlook."
        canonical="/reports/nigeria-admission-year-in-review/2026-2027"
        image="https://campusai.com.ng/admission-summary-og.png"
        keywords="Nigeria admission year in review 2026, JAMB 2026 admission cycle, university admission report Nigeria, 2027 JAMB outlook, WAEC NECO NABTEB results 2026, CampusAI annual report"
      />

      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 md:px-8 mb-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <ArrowLeft size={16} /> Home
            </button>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/20">
              Official Annual Review • 2026/2027 Edition
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSave}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                isSaved 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isSaved ? <Check size={16} className="text-emerald-400" /> : <Bookmark size={16} />}
              {isSaved ? 'Saved to Vault' : 'Save Report'}
            </button>

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl mb-12">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-cyan-500/30 p-8 md:p-14 shadow-2xl shadow-cyan-950/50">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" /> Official Annual Review
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
                <ShieldCheck size={14} /> Verified Admission Intelligence
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> Published October 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Nigeria's Admission Year in Review: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">2026/2027 Edition</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-4xl mb-8">
              Tracking Nigeria's admission landscape, examination developments, institutional screening results, student opportunities, and an evidence-based outlook for the 2027/2028 academic cycle.
            </p>

            {/* Quick Share Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800/80">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1.5">
                <Share2 size={14} className="text-cyan-400" /> Share Report:
              </span>

              <button
                onClick={handleShareFacebook}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>f</span> Facebook
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>💬</span> WhatsApp
              </button>

              <button
                onClick={handleShareTwitter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>𝕏</span> X / Twitter
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Scale size={20} />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">National Minimum</div>
            <div className="text-2xl font-black text-white mb-1">150 / 100</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              150 for universities & nursing; 100 for polytechnics, monotechnics, colleges of agriculture & education. Age baseline 16.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Award size={20} />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">UTME Candidates</div>
            <div className="text-2xl font-black text-emerald-400 mb-1">2.2M+ Sat</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exam window scheduled 16–22 April 2026. Centralised digital processing via JAMB CAPS enforced.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Layers size={20} />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">NABTEB Result Release</div>
            <div className="text-2xl font-black text-amber-400 mb-1">81.24% Pass</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Released 2 September 2026 for June/July NBC/NTC examinations following registration extension to 3 June.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Globe size={20} />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">New Institutional Licences</div>
            <div className="text-2xl font-black text-purple-400 mb-1">2 Private Unis</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sani Bello University & Omega University granted provisional licences by NUC on 31 July 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Tabs */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl mb-8">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'review' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen size={15} /> 1. Executive Summary
          </button>

          <button
            onClick={() => setActiveTab('visuals')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'visuals' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={15} /> 2. Data Charts &amp; Graphs
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'timeline' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock size={15} /> 3. Verified Timeline
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'platforms' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database size={15} /> 4. EdTech Landscape
          </button>

          <button
            onClick={() => setActiveTab('outlook')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'outlook' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={15} /> 5. 2027 Outlook
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'checklist' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare size={15} /> 6. Checklist ({completedCount}/{checklist.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT: 1. EXECUTIVE SUMMARY & REVIEW */}
      {activeTab === 'review' && (
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-8 animate-fadeIn">
          <div className="p-8 md:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Official Annual Review: 2026/2027 Admission Cycle
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Nigeria's Admission Year in Review is an ongoing CampusAI publication documenting the developments that shape admission into Nigerian universities, polytechnics, colleges of education, and other tertiary institutions. Each edition preserves the verified developments of its admission cycle, providing a trusted historical record for students, parents, and educators.
            </p>
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-xs md:text-sm">
              <span className="font-bold text-cyan-400 block mb-1">Key 2026 Structural Takeaways:</span>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>National Minimums vs. Departmental Cutoffs:</strong> JAMB set minimum tolerable UTME scores at 150 for universities/nursing and 100 for polytechnics/colleges, but competitive federal universities established much higher aggregate cutoffs (e.g., UNILAG published programme aggregate thresholds for merit and catchment).</li>
                <li><strong>CAPS Centralization:</strong> Absolute digital enforcement via Central Admissions Processing System (CAPS). Off-portal admissions remained strictly prohibited.</li>
                <li><strong>Tertiary Policy Expansions:</strong> NUC licensed two new private universities (Sani Bello Univ. & Omega Univ.), while NCCE launched the dual-mandate policy allowing eligible Colleges of Education to offer B.Ed degrees.</li>
              </ul>
            </div>
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Verified Institutional Cut-Off &amp; Screening Examples (2026/2027)</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Published Milestone / Cut-Off</th>
                    <th className="py-3 px-4">Primary Source Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">University of Lagos (UNILAG)</td>
                    <td className="py-3 px-4 text-cyan-400">Published UTME merit &amp; catchment aggregate cutoffs (e.g., Architecture Merit 72.9) on 16 Sept 2026.</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">UNILAG Official Announcement</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Ebonyi State University (EBSU)</td>
                    <td className="py-3 px-4 text-cyan-400">Approved general cutoff 150; Medicine 250, Nursing 230, Anatomy/Physiology 160.</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">EBSU Portal &amp; 25 May News</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">FUNAAB</td>
                    <td className="py-3 px-4 text-cyan-400">Screening portal opened 2 June 2026; programme thresholds varied (e.g., Software Engineering 200).</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">FUNAAB Admission Portal</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Osun State University (UNIOSUN)</td>
                    <td className="py-3 px-4 text-cyan-400">General cutoff 160; threshold 200 for Law, Nursing, etc.; Medicine placed on hold for session.</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">UNIOSUN Screening Notice</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">University of Jos (UNIJOS)</td>
                    <td className="py-3 px-4 text-cyan-400">Published Post-UTME/DE requirements: Law 240, Nursing 220, Medical Lab 220.</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">UNIJOS Registration Procedures</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. DATA CHARTS & VISUALS */}
      {activeTab === 'visuals' && (
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-8 animate-fadeIn">
          {/* Chart 1: Federal Quota Allocation (45:35:20) */}
          <div className="p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Statutory Federal University Quotas</span>
                <h3 className="text-xl font-bold text-white">Federal Admission Distribution Formula</h3>
              </div>
              <PieChart className="text-cyan-400" size={24} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30">
                <div className="text-3xl font-black text-blue-400 mb-1">45%</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">National Merit Quota</div>
                <p className="text-xs text-slate-400 mt-2">Open to all qualified applicants across Nigeria irrespective of state of origin. Highest cutoff threshold.</p>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-500 h-full w-[45%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30">
                <div className="text-3xl font-black text-emerald-400 mb-1">35%</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Catchment Area Quota</div>
                <p className="text-xs text-slate-400 mt-2">Reserved exclusively for indigenes of the institution's designated geographical catchment states.</p>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[35%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30">
                <div className="text-3xl font-black text-amber-400 mb-1">20%</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">ELDS Quota</div>
                <p className="text-xs text-slate-400 mt-2">Educationally Less Developed States allocation, offering moderated admission thresholds.</p>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Faculty Competitiveness Bar Visual */}
          <div className="p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Faculty Competitiveness Index</span>
                <h3 className="text-xl font-bold text-white">Relative Applicant Demand &amp; Cut-Off Surge (2026)</h3>
              </div>
              <BarChart3 className="text-emerald-400" size={24} />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Medicine &amp; Surgery (MBBS)</span>
                  <span className="text-cyan-400">Ultra High (82% Avg Aggregate)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Nursing Science</span>
                  <span className="text-cyan-400">Extreme Surge (79% Avg Aggregate)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Law (LL.B)</span>
                  <span className="text-cyan-400">Very High (77% Avg Aggregate)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[84%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Computer Science / AI / Cyber Security</span>
                  <span className="text-cyan-400">High Demand (74% Avg Aggregate)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Pharmacy (Pharm.D)</span>
                  <span className="text-cyan-400">High Demand (76% Avg Aggregate)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[81%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. VERIFIED CHRONOLOGICAL TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-6 animate-fadeIn">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-2">Verified Chronological Timeline (2026/2027 Cycle)</h2>
            <p className="text-xs text-slate-400 mb-6">Each milestone is referenced against official regulatory and examination body releases.</p>

            <div className="space-y-4">
              {[
                { date: 'March 2026', title: 'WAEC WASSCE School Timetable', desc: 'WAEC published final Nigeria timetable scheduling exams from 21 April 2026.', status: 'Confirmed' },
                { date: '13 April 2026', title: 'JAMB UTME Confirmation', desc: 'JAMB bulletin confirmed 2026 UTME scheduled for 16–22 April 2026 with over 2.2 million candidates.', status: 'Confirmed' },
                { date: '21 April 2026 Onward', title: 'WAEC WASSCE Examinations', desc: 'Scheduled examination period commenced across accredited centres.', status: 'Confirmed' },
                { date: '11 May 2026', title: 'National Admission Policy Meeting', desc: 'Approved national minimum tolerable UTME scores (150 universities, 100 polytechnics/colleges) and 16-year age baseline.', status: 'Confirmed' },
                { date: '2 June 2026', title: 'FUNAAB Post-UTME Portal Opened', desc: 'Began official 2026/2027 screening applications.', status: 'Confirmed' },
                { date: '15 June – 23 July 2026', title: 'NECO SSCE Internal', desc: 'Scheduled school-based examination window.', status: 'Confirmed' },
                { date: '31 July 2026', title: 'NUC Private University Licences', desc: 'Provisional licences granted to Sani Bello Univ. (Kontagora) and Omega Univ. (Kaduna).', status: 'Confirmed' },
                { date: '3 August 2026', title: 'NCCE Dual-Mandate Policy', desc: 'Colleges of Education began implementing eligibility to offer NCE and approved B.Ed degrees.', status: 'Confirmed' },
                { date: '2 September 2026', title: 'NABTEB Results Release', desc: 'Released June/July NBC/NTC results with an 81.24% pass rate.', status: 'Confirmed' },
                { date: '16 September 2026', title: 'UNILAG UTME Merit Cutoffs', desc: 'Published programme-level merit and catchment aggregate cutoffs.', status: 'Confirmed' },
                { date: '17 September 2026', title: 'Proposed UTME Reasoning Review', desc: 'NTA reported JAMB reviewing possible integration of critical thinking and logical reasoning into UTME.', status: 'Proposed / Under Review' },
                { date: '23–25 September 2026', title: 'JAMB 2027 Test Console Materials', desc: 'Test installer downloads and manual exposed on JAMB official website.', status: 'Confirmed Operational Prep' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-500/20">{item.date}</span>
                      <span className="text-xs font-bold text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">{item.status}</span>
                    </div>
                    <h4 className="text-base font-bold text-white pt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. EDTECH PLATFORM COMPARISON */}
      {activeTab === 'platforms' && (
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-6 animate-fadeIn">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-2">EdTech &amp; Admission Platform Comparison</h2>
            <p className="text-xs text-slate-400 mb-6">Source-backed comparative overview of major educational platforms in Nigeria.</p>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Admission Coverage</th>
                    <th className="py-3 px-4">CBT &amp; Study Tools</th>
                    <th className="py-3 px-4">Calculators / AI Services</th>
                    <th className="py-3 px-4">2027 Positioning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">CampusAI</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Public news hub, institutional cutoffs, merit lists, deadlines, morning briefings.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Study Hub, CBT simulator, timed modes, past questions, AI Coach.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Admissions Strategist, dedicated institution calculators, CAPS guidance.</td>
                    <td className="py-3 px-4 text-xs text-cyan-400 font-bold">Comprehensive annual reports &amp; verified watchlists.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Myschool.ng</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Broad Nigerian admissions information presence.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">2027 CBT app (70k+ questions, offline mode, video lessons).</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Advertises AI counsellor and official JAMB calculator.</td>
                    <td className="py-3 px-4 text-xs text-emerald-400 font-bold">Explicit 2027 CBT app marketing.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">MySchoolGist</td>
                    <td className="py-3 px-4 text-xs text-slate-300">JAMB guides, admission news, free past-question PDFs.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">2027 CBT app (30k+ questions, syllabus revision).</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Standard practice interface without public AI.</td>
                    <td className="py-3 px-4 text-xs text-amber-400 font-bold">2027 CBT app positioning.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Examkits</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Targeted UTME and post-UTME prep coverage.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">20k+ questions (2000–2025), video explanations, post-UTME simulations.</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Standard CBT practice interface.</td>
                    <td className="py-3 px-4 text-xs text-slate-400">Standard CBT offering.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. 2027 OUTLOOK & WATCHLIST */}
      {activeTab === 'outlook' && (
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-6 animate-fadeIn">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-2">2027 Admission Watchlist &amp; Outlook</h2>
            <p className="text-xs text-slate-400 mb-6">Classified based on authoritative verification status as of October 2026.</p>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Development / Topic</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Authority / Source</th>
                    <th className="py-3 px-4">What Candidates Should Know</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">2027 Test Console Materials</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">Confirmed</span></td>
                    <td className="py-3 px-4 text-xs text-slate-300">JAMB Official Website</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Shows operational preparation; does not establish registration or exam dates.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Proposed Reasoning &amp; Critical Thinking Review</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-950 text-amber-400 border border-amber-500/30 rounded text-xs font-bold">Proposed</span></td>
                    <td className="py-3 px-4 text-xs text-slate-300">NTA Report (17 Sept 2026)</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Under review; continue preparing for prescribed UTME subjects while monitoring for final announcements.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Proposed Ottawa UTME Centre</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-950 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">Proposed</span></td>
                    <td className="py-3 px-4 text-xs text-slate-300">Premium Times</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Awaiting official JAMB implementation details and eligibility criteria.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">2027 UTME Timetable &amp; Cutoffs</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-red-950 text-red-400 border border-red-500/30 rounded text-xs font-bold">Unconfirmed</span></td>
                    <td className="py-3 px-4 text-xs text-slate-300">Not yet published</td>
                    <td className="py-3 px-4 text-xs text-slate-300">Do not assume 2026 dates or minimums will repeat without official announcement.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. ASPIRANTS CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="container mx-auto px-4 md:px-8 max-w-4xl animate-fadeIn">
          <div className="p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">2027 Aspirant Milestone Checklist</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">Check off completed steps. Changes save automatically to your device.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cyan-400">{progressPercent}%</span>
                <span className="text-xs text-slate-400 block font-bold">Progress</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-950 mb-8 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>

            <div className="space-y-3">
              {checklist.map((item: any) => (
                <div 
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                    item.checked 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    item.checked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                  }`}>
                    {item.checked && <Check size={16} className="stroke-[3]" />}
                  </div>
                  <span className={`text-sm leading-relaxed ${item.checked ? 'line-through text-slate-400 font-medium' : 'font-semibold text-white'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-400">Need to calculate target aggregate scores?</span>
              <button
                onClick={() => navigate('/calculator')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <Calculator size={16} /> Open Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
