import React, { useState } from 'react';
import { Users, Copy, Check, MessageCircle, Share2, Sparkles, Target, BookOpen, Brain } from 'lucide-react';
import { UserProfile } from '../types';

interface InviteEarnProps {
  user: UserProfile;
}

const InviteEarn: React.FC<InviteEarnProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}?ref=${user?.uid || 'scholar'}`;
  const referralCount = user?.referral_count || 0;

  const shareText = `Do you know someone writing JAMB in 2027? 🎓\n\nTell them about CampusAI—it's built specifically for JAMB 2027 preparation:\n• 🎯 Set target score & track preparation gap\n• ⚡ Practice real CBT past questions (2000-2026)\n• 🧠 AI diagnosis of weak topics & personalized study plans\n• 📚 Topic drills, novel summaries & formula cheat sheets\n• 🏛️ Cutoff marks and admission requirements for every university\n\nStart practicing for free here: ${referralLink}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-indigo-500/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-cyan-300 font-bold text-[10px] uppercase tracking-wider">
            <Sparkles size={12} /> 2027 Student Referral Network
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Do You Know Someone Writing JAMB in 2027?
          </h3>
          <p className="text-indigo-200 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            As the 2026 admission season winds down, share CampusAI with younger students, siblings, and tutorial classmates preparing for the 2027 UTME.
          </p>
        </div>

        {/* Value pillars that new candidates receive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-slate-900/80 border border-indigo-900/60 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Target size={14} /> Target & Score Gap
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Set UTME target score and monitor preparation progress against departmental cutoffs.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-indigo-900/60 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <BookOpen size={14} /> CBT Practice & Study
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Authentic CBT past questions (2000–2026), syllabus topic drills, and novel summaries.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-indigo-900/60 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Brain size={14} /> AI Weak-Topic Drill
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Instant AI diagnosis highlighting weak topics and recommending the exact lessons to study.
            </p>
          </div>
        </div>

        {/* Share buttons & referral link */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1 font-mono text-xs text-indigo-200 bg-slate-950/60 px-3 py-2.5 rounded-xl border border-slate-800 truncate select-all">
            {referralLink}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={shareToWhatsApp}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle size={15} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-indigo-300 pt-1 border-t border-indigo-900/50">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-cyan-400" />
            <span className="font-semibold">{referralCount} candidate(s) joined via your link</span>
          </div>
          <span className="text-[11px] text-indigo-400">Earn +3 AI Calculation & Coaching Credits per signup</span>
        </div>
      </div>
    </div>
  );
};

export default InviteEarn;
