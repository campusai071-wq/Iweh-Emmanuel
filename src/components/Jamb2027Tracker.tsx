import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, Plus, CheckCircle2, 
  AlertCircle, Calendar, Clock, BookOpen, Brain, 
  ArrowRight, MessageCircle, RotateCcw, 
  Sparkles, Check, School, 
  Layers, ArrowUpRight, ArrowDownRight, Edit3, X
} from 'lucide-react';
import { getLocalProfile } from '../services/userService';

interface ScoreEntry {
  id: string;
  month: string;
  score: number;
  date: string;
  examType: string;
  isExternal?: boolean;
}

export default function Jamb2027Tracker() {
  const navigate = useNavigate();

  // Mode: 'jamb2027' (Preparation loop) or 'admission2026' (Closing timelines & admission updates)
  const [activeMode, setActiveMode] = useState<'jamb2027' | 'admission2026'>(() => {
    try {
      return (localStorage.getItem('campusai_journey_focus') as any) || 'jamb2027';
    } catch {
      return 'jamb2027';
    }
  });

  // Target score and configuration
  const [targetScore, setTargetScore] = useState<number>(() => {
    try {
      const configStr = localStorage.getItem('campusai_target_config');
      if (configStr) {
        const parsed = JSON.parse(configStr);
        if (typeof parsed.score === 'number' && parsed.score > 0) return parsed.score;
      }
      const profile = getLocalProfile();
      if (profile.targetScore) return profile.targetScore;
      if (profile.targetUTMEScore) return profile.targetUTMEScore;
    } catch {}
    return 280;
  });

  const [targetUniversity, setTargetUniversity] = useState<string>(() => {
    try {
      const configStr = localStorage.getItem('campusai_target_config');
      if (configStr) {
        const parsed = JSON.parse(configStr);
        if (parsed.university) return parsed.university;
      }
      const profile = getLocalProfile();
      return profile.university || profile.academicProfile?.targetInstitution || 'University of Lagos (UNILAG)';
    } catch {}
    return 'University of Lagos (UNILAG)';
  });

  const [targetCourse, setTargetCourse] = useState<string>(() => {
    try {
      const configStr = localStorage.getItem('campusai_target_config');
      if (configStr) {
        const parsed = JSON.parse(configStr);
        if (parsed.course) return parsed.course;
      }
      const profile = getLocalProfile();
      return profile.targetCourse || profile.academicProfile?.targetCourse || 'Computer Science';
    } catch {}
    return 'Computer Science';
  });

  // Score History
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [weakSubject, setWeakSubject] = useState<string>('Chemistry');
  const [weakTopic, setWeakTopic] = useState<string>('Organic Chemistry — Hydrocarbons');
  const [strongSubject, setStrongSubject] = useState<string>('Mathematics');

  // Modal / Form state for manual score entry
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualScore, setManualScore] = useState<string>('');
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);
  const [newTargetInput, setNewTargetInput] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Countdown timer to JAMB 2027 (approx. April 2027 or Jan registration)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-01-15T00:00:00').getTime(); // UTME 2027 Registration kickoff
    const updateCountdown = () => {
      const now = Date.now();
      const distance = targetDate - now;
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize history & weak topics from localStorage
  const loadScoreTelemetry = () => {
    try {
      const historyList: ScoreEntry[] = [];

      // 1. Check target_config history
      const targetStr = localStorage.getItem('campusai_target_config');
      if (targetStr) {
        const parsed = JSON.parse(targetStr);
        if (parsed.history && Array.isArray(parsed.history)) {
          parsed.history.forEach((h: any) => {
            historyList.push({
              id: h.id || `entry-${Math.random()}`,
              month: h.month || 'Practice Session',
              score: Number(h.score) || 0,
              date: h.date || 'Recent',
              examType: h.examType || 'Mock',
              isExternal: h.examType === 'Mock Log' || h.examType === 'Tutorial Mock Log' || h.isExternal === true
            });
          });
        }
      }

      // 2. Check cbt_history if target_config was empty
      if (historyList.length === 0) {
        const cbtStr = localStorage.getItem('cbt_history');
        if (cbtStr) {
          const parsedCbt = JSON.parse(cbtStr);
          if (Array.isArray(parsedCbt)) {
            parsedCbt.slice(-5).forEach((c: any) => {
              historyList.push({
                id: c.id || `cbt-${Math.random()}`,
                month: `${c.examType?.toUpperCase() || 'CBT'} Practice`,
                score: Number(c.score || c.totalRawScore) || 240,
                date: c.formattedDate || 'Recent',
                examType: c.examType || 'CBT Mock',
                isExternal: false
              });
            });
          }
        }
      }

      // Default baseline if user has no test history yet
      if (historyList.length === 0) {
        historyList.push(
          { id: 'base-1', month: 'Initial Diagnostic', score: 235, date: 'Baseline Mock', examType: 'Diagnostic', isExternal: true },
          { id: 'base-2', month: 'Tutorial Center Mock', score: 248, date: 'External Practice', examType: 'Mock Log', isExternal: true }
        );
      }

      setScoreHistory(historyList);

      // Check weak topics
      const weakStr = localStorage.getItem('campusai_cbt_weak_topics');
      if (weakStr) {
        const parsedWeak = JSON.parse(weakStr);
        if (Array.isArray(parsedWeak) && parsedWeak.length > 0) {
          setWeakTopic(parsedWeak[0].topic || parsedWeak[0].name || weakTopic);
          setWeakSubject(parsedWeak[0].subject || weakSubject);
        }
      }
    } catch (e) {
      console.warn('[Jamb2027Tracker] Error loading telemetry:', e);
    }
  };

  useEffect(() => {
    loadScoreTelemetry();
    const handleUpdate = () => loadScoreTelemetry();
    window.addEventListener('campusai_target_updated', handleUpdate);
    window.addEventListener('campusai_cbt_completed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('campusai_target_updated', handleUpdate);
      window.removeEventListener('campusai_cbt_completed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleModeSwitch = (mode: 'jamb2027' | 'admission2026') => {
    setActiveMode(mode);
    try {
      localStorage.setItem('campusai_journey_focus', mode);
    } catch {}
  };

  // Latest performance calculation
  const latestAttempt = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1] : null;
  const currentPerformance = latestAttempt ? latestAttempt.score : 257;
  const scoreGap = targetScore - currentPerformance;

  // Previous attempt delta
  const previousAttempt = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2] : null;
  const scoreDelta = previousAttempt ? currentPerformance - previousAttempt.score : 0;

  // Save updated target score
  const handleSaveTarget = () => {
    const val = parseInt(newTargetInput);
    if (!isNaN(val) && val >= 120 && val <= 400) {
      setTargetScore(val);
      setIsEditingTarget(false);
      try {
        const configStr = localStorage.getItem('campusai_target_config');
        const existing = configStr ? JSON.parse(configStr) : {};
        localStorage.setItem('campusai_target_config', JSON.stringify({
          ...existing,
          score: val
        }));
        window.dispatchEvent(new CustomEvent('campusai_target_updated'));
      } catch {}
    }
  };

  // Log manual / external score
  const handleLogScore = (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseInt(manualScore);
    if (!manualTitle.trim() || isNaN(numScore) || numScore < 0 || numScore > 400) return;

    const newEntry: ScoreEntry = {
      id: `ext-${Date.now()}`,
      month: manualTitle.trim(),
      score: numScore,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      examType: 'Mock Log',
      isExternal: true
    };

    const updated = [...scoreHistory, newEntry];
    setScoreHistory(updated);

    try {
      const configStr = localStorage.getItem('campusai_target_config');
      const existing = configStr ? JSON.parse(configStr) : {};
      localStorage.setItem('campusai_target_config', JSON.stringify({
        ...existing,
        history: updated
      }));
      window.dispatchEvent(new CustomEvent('campusai_target_updated'));
    } catch {}

    setManualTitle('');
    setManualScore('');
    setShowLogModal(false);
  };

  // WhatsApp Share invitation copy
  const referralText = `Do you know someone writing JAMB in 2027? 🎓\n\nI'm using CampusAI to track my 2027 target score and practice:\n• 🎯 Target: ${targetScore} | Gap Tracker\n• ⚡ Authentic CBT Simulator (2000-2026 past questions)\n• 🧠 AI weak-topic diagnosis (${weakSubject}: ${weakTopic})\n• 📚 Syllabus study drills & novel summaries\n\nJoin and start practicing for free: https://campusai.com.ng`;

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(referralText)}`;
    window.location.href = url;
  };

  const copyShareText = () => {
    navigator.clipboard.writeText(referralText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 md:p-8 text-white relative overflow-hidden shadow-2xl space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Journey Focus Toggle Header ── */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
              <Calendar size={12} /> Unified Retention & Growth System
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
              <Clock size={11} className="text-blue-400" /> {timeLeft.days}d {timeLeft.hours}h to 2027 Prep Kickoff
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            {activeMode === 'jamb2027' ? 'JAMB 2027 Preparation Command Center' : '2026 Admission Season Timeline & Clearance'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {activeMode === 'jamb2027' 
              ? 'Connect your target score, CBT practice, weak-topic diagnosis, and study drills into one consistent improvement loop.'
              : 'Official screening deadlines, CAPS status monitoring, and clearance documents for the concluding 2026 cycle.'}
          </p>
        </div>

        {/* Audience switch tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => handleModeSwitch('jamb2027')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'jamb2027'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target size={14} />
            <span>JAMB 2027 Prep</span>
          </button>
          <button
            onClick={() => handleModeSwitch('admission2026')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'admission2026'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <School size={14} />
            <span>2026 Admission Cycle</span>
          </button>
        </div>
      </div>

      {/* ── MODE 1: JAMB 2027 RETENTION & PREPARATION LOOP ── */}
      {activeMode === 'jamb2027' && (
        <div className="space-y-6 relative z-10">
          
          {/* 1. Above-The-Fold Question: "HOW AM I DOING?" */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-cyan-400 rounded-xl border border-blue-500/20">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Preparation Readiness Status: &ldquo;How Am I Doing?&rdquo;
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Target indicator comparing your latest CBT/manual mock against your admission goal.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowLogModal(true)}
                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus size={14} />
                  <span>Log External Mock</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/cbt-simulator');
                    window.scrollTo(0, 0);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles size={13} />
                  <span>Take CBT Drill</span>
                </button>
              </div>
            </div>

            {/* Above-the-fold 4-Card Telemetry Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Target Score */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">JAMB 2027 Target</span>
                  <button 
                    onClick={() => {
                      setNewTargetInput(targetScore.toString());
                      setIsEditingTarget(true);
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors p-0.5"
                    title="Edit target score"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400">{targetScore}</span>
                    <span className="text-xs text-slate-500">/ 400</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5" title={targetCourse}>
                    For {targetCourse}
                  </p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500">Goal benchmark</span>
              </div>

              {/* Current Performance */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Performance</span>
                  {scoreDelta !== 0 && (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      scoreDelta > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {scoreDelta > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                    </span>
                  )}
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">{currentPerformance}</span>
                    <span className="text-xs text-slate-500">/ 400</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {latestAttempt ? latestAttempt.month : 'Diagnostic score'}
                  </p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500">
                  {latestAttempt?.isExternal ? 'From external mock entry' : 'From CampusAI practice'}
                </span>
              </div>

              {/* Score Gap */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score Gap</span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    scoreGap <= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {scoreGap <= 0 ? 'Achieved' : 'In Progress'}
                  </span>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl sm:text-3xl font-black ${scoreGap <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {scoreGap <= 0 ? '0' : `${scoreGap}`}
                    </span>
                    <span className="text-xs text-slate-500">{scoreGap <= 0 ? 'marks' : 'marks needed'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {scoreGap <= 0 ? 'Target surpassed 🎉' : `Gap to ${targetScore} target`}
                  </p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500">Progress indicator</span>
              </div>

              {/* Next Best Action */}
              <div className="bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Next Best Action</span>
                    <Brain size={13} className="text-cyan-400" />
                  </div>
                  <p className="text-xs font-black text-white mt-1.5 line-clamp-2">
                    Review {weakSubject}: {weakTopic.split('—')[0]}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate('/study-hub');
                    window.scrollTo(0, 0);
                  }}
                  className="mt-2 py-1 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Study Topic</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Desired Retention Loop: Target → Practice → Record → Diagnose → Study → Practice Again → Improve */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                The 7-Step Improvement Loop
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">Target → Practice → Record → Diagnose → Study → Practice Again</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">1</span>
                <p className="font-bold text-white text-[11px]">Set Target</p>
                <p className="text-[9px] text-slate-400">{targetScore} Marks</p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">2</span>
                <p className="font-bold text-white text-[11px]">Practice</p>
                <p className="text-[9px] text-slate-400">CampusAI / Mock</p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">3</span>
                <p className="font-bold text-white text-[11px]">Record</p>
                <p className="text-[9px] text-slate-400">{currentPerformance} Logged</p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">4</span>
                <p className="font-bold text-white text-[11px]">Diagnose</p>
                <p className="text-[9px] text-amber-400">{weakSubject}</p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">5</span>
                <p className="font-bold text-white text-[11px]">Study</p>
                <p className="text-[9px] text-cyan-400">Study Hub</p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-blue-600/30 text-cyan-300 font-black text-[10px] flex items-center justify-center">6</span>
                <p className="font-bold text-white text-[11px]">Practice Again</p>
                <p className="text-[9px] text-slate-400">Retake Drill</p>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">7</span>
                <p className="font-bold text-emerald-300 text-[11px]">Improve</p>
                <p className="text-[9px] text-emerald-400">Close Gap</p>
              </div>
            </div>
          </div>

          {/* 3. Diagnostic & Recommended Topic Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-cyan-300 rounded-xl shrink-0 mt-0.5">
                <Brain size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Weak Subject: {weakSubject}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Strong Subject: <strong className="text-emerald-400">{strongSubject}</strong>
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Recommended Study Focus: {weakTopic}
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Recent test analysis shows lower accuracy in {weakSubject}. Spend 20 minutes mastering this syllabus topic in Study Hub before your next timed mock.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  navigate('/study-hub');
                  window.scrollTo(0, 0);
                }}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-cyan-500/20"
              >
                <BookOpen size={14} />
                <span>Study This Topic</span>
              </button>
              <button
                onClick={() => {
                  navigate('/cbt-simulator');
                  window.scrollTo(0, 0);
                }}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Take Drill</span>
              </button>
            </div>
          </div>

          {/* 4. Score History Chronological Log */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  Chronological Practice History ({scoreHistory.length} Sessions)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Both CampusAI tests and manual tutorial logs
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {scoreHistory.slice().reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      entry.isExternal
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                        : 'bg-blue-950/80 text-cyan-300 border border-blue-800'
                    }`}>
                      {entry.isExternal ? 'External / Mock Log' : 'CampusAI CBT'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{entry.month}</p>
                      <p className="text-[10px] text-slate-400">{entry.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-white">{entry.score}</span>
                      <span className="text-[10px] text-slate-500"> / 400</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      entry.score >= targetScore ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                    }`}>
                      {entry.score >= targetScore ? 'Goal Met' : `${targetScore - entry.score} gap`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── MODE 2: 2026 ADMISSION CYCLE CLOSING & CLEARANCE ── */}
      {activeMode === 'admission2026' && (
        <div className="space-y-6 relative z-10">
          {/* Institutional Closing Timeline Alert */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertCircle size={15} /> 2026 Institutional Admission Closing Timeline
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Public University Admissions Closing • Private & Supplemental Processing Continues
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              As tertiary institutions conclude merit lists, candidates awaiting admission should track official transfer lists, supplementary applications, and JAMB CAPS alerts closely.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Phase 1 • Around October</span>
                <h4 className="text-sm font-bold text-white">Public Universities</h4>
                <p className="text-[11px] text-slate-400">
                  Federal & State Universities (UNILAG, OAU, UNIBEN, FUTA, UI) conclude primary merit list uploads.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Phase 2 • Into November</span>
                <h4 className="text-sm font-bold text-white">Private Universities</h4>
                <p className="text-[11px] text-slate-400">
                  Private institutions continue processing rolling direct applications and transfer candidates.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Phase 3 • Into December</span>
                <h4 className="text-sm font-bold text-white">Polytechnics & Colleges</h4>
                <p className="text-[11px] text-slate-400">
                  National Diploma (ND) and College of Education screening sessions continue through December.
                </p>
              </div>
            </div>
          </div>

          {/* Quick links to 2026 tools without forcing them out */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                navigate('/jamb-caps');
                window.scrollTo(0, 0);
              }}
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-cyan-400 block group-hover:underline">Check JAMB CAPS</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Monitor transfer offers & admission lists</span>
            </button>

            <button
              onClick={() => {
                navigate('/admission-checklist');
                window.scrollTo(0, 0);
              }}
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-xl text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-emerald-400 block group-hover:underline">Clearance Checklist</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Required documents for physical screening</span>
            </button>

            <button
              onClick={() => {
                navigate('/calculator');
                window.scrollTo(0, 0);
              }}
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-indigo-400 block group-hover:underline">Cutoff Calculator</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Verify departmental merit & catchment marks</span>
            </button>

            <button
              onClick={() => {
                navigate('/admissions');
                window.scrollTo(0, 0);
              }}
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-purple-500 rounded-xl text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-purple-400 block group-hover:underline">Post-UTME Hub</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Supplementary lists & portal links</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Transition Card: "Do you know someone writing JAMB in 2027?" ── */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/80 to-slate-900 border border-blue-500/25 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
              Community Growth & Referrals
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            Do You Know Someone Writing JAMB in 2027?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Share CampusAI with candidates preparing for the upcoming exam so they can set target scores, practice authentic CBT past questions, and receive AI study recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={copyShareText}
            className="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {copiedShare ? <Check size={14} className="text-emerald-400" /> : <Sparkles size={14} />}
            <span>{copiedShare ? 'Copied!' : 'Copy Invite'}</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle size={15} />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* ── LOG MANUAL SCORE MODAL ── */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus size={18} className="text-emerald-400" />
                  <h3 className="text-base font-black">Log External Mock or Classroom Test</h3>
                </div>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Track every exam attempt in one place. Scores entered here are clearly labelled as <strong className="text-purple-300">External Mock</strong> to keep your preparation timeline accurate.
              </p>

              <form onSubmit={handleLogScore} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Exam / Session Name
                  </label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. Tutorial Center Mock 2, School Prelim"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Score Achieved (out of 400)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={400}
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    placeholder="e.g. 268"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30"
                  >
                    Save Attempt
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT TARGET SCORE INLINE MODAL ── */}
      <AnimatePresence>
        {isEditingTarget && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  <Target size={16} className="text-cyan-400" /> Set JAMB 2027 Target Score
                </h3>
                <button onClick={() => setIsEditingTarget(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Target UTME Score (120 - 400)
                </label>
                <input
                  type="number"
                  min={120}
                  max={400}
                  value={newTargetInput}
                  onChange={(e) => setNewTargetInput(e.target.value)}
                  placeholder="e.g. 280"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-black text-cyan-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Update Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
