import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, ChevronRight, ChevronDown, ChevronUp, 
  ExternalLink, Sparkles, Clock, X, Eye, BookOpen, 
  Calculator, GraduationCap, CheckCircle2, Award
} from 'lucide-react';
import { NewsItem } from '../types';
import { getCloudNews } from '../services/dbService';
import { MOCK_NEWS } from '../constants';
import { formatNewsPostTime } from '../utils/dateUtils';
import { slugify } from '../services/utils';

interface ContextConfig {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: any;
  categories: string[];
  keywords: string[];
}

const CONTEXT_MAPPINGS: Record<string, ContextConfig> = {
  calculator: {
    title: 'Cut-off & Screening Wire',
    subtitle: 'Aggregate formulas & institutional cutoffs',
    badge: 'Admission Cutoffs',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: Calculator,
    categories: ['JAMB', 'Federal', 'State', 'Polytechnic'],
    keywords: ['cutoff', 'cut-off', 'aggregate', 'screening', 'merit', 'post-utme', 'departmental', 'catchment']
  },
  cbt: {
    title: 'JAMB 2027 & CBT Radar',
    subtitle: 'Syllabus changes, CBT drill tips & syllabus',
    badge: 'Exam Prep',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: BookOpen,
    categories: ['JAMB', 'WAEC', 'NECO'],
    keywords: ['jamb', 'cbt', 'target', 'syllabus', 'score', 'mock', 'utme', 'practice', 'physics', 'chemistry', 'biology']
  },
  universities: {
    title: 'Campus & Senate Dispatches',
    subtitle: 'Faculty updates, accreditation & calendars',
    badge: 'Institutions',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: GraduationCap,
    categories: ['Federal', 'State', 'Private', 'Polytechnic', 'COE'],
    keywords: ['university', 'senate', 'polytechnic', 'accreditation', 're-opening', 'calendar', 'faculty', 'resumption']
  },
  caps: {
    title: 'CAPS & Clearance Bulletins',
    subtitle: 'JAMB CAPS acceptance & verification alerts',
    badge: 'CAPS & Screening',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: CheckCircle2,
    categories: ['JAMB', 'National'],
    keywords: ['caps', 'clearance', 'acceptance', 'admission list', 'matriculation', 'transfer', 'o-level upload']
  },
  opportunities: {
    title: 'Scholarships & Career',
    subtitle: 'Bursaries, NYSC dispatches & grants',
    badge: 'Opportunities',
    badgeColor: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    icon: Award,
    categories: ['Scholarships', 'Jobs', 'NYSC'],
    keywords: ['scholarship', 'nysc', 'internship', 'bursary', 'grant', 'fellowship']
  },
  default: {
    title: 'Trending Academic Wire',
    subtitle: 'Curated national tertiary education updates',
    badge: 'CampusAI News',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    icon: Newspaper,
    categories: ['JAMB', 'Federal', 'State', 'National'],
    keywords: ['admission', 'education', 'tertiary', 'nigeria', 'students']
  }
};

const getContextKey = (pathname: string): string => {
  const p = pathname.toLowerCase();
  if (p.includes('calculator') || p.includes('screening') || p.includes('cutoff') || p.includes('aggregate')) {
    return 'calculator';
  }
  if (p.includes('cbt') || p.includes('target') || p.includes('study') || p.includes('quiz') || p.includes('ai-coach')) {
    return 'cbt';
  }
  if (p.includes('universities') || p.includes('directory') || p.includes('schools') || p.includes('course-finder')) {
    return 'universities';
  }
  if (p.includes('caps') || p.includes('checklist') || p.includes('admission-status') || p.includes('admissions')) {
    return 'caps';
  }
  if (p.includes('scholarship') || p.includes('job') || p.includes('nysc')) {
    return 'opportunities';
  }
  return 'default';
};

interface ContextualNewsRailProps {
  onReadArticle?: (article: NewsItem) => void;
}

export const ContextualNewsRail: React.FC<ContextualNewsRailProps> = ({ onReadArticle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // Default collapsed on smaller screens, expanded on very wide desktops
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusai_news_rail_collapsed');
      if (saved !== null) return saved === 'true';
      return window.innerWidth < 1440; // collapsed on screens < 1440px by default
    }
    return true;
  });

  const pathname = location.pathname;

  // Don't show on admin, auth, or full screen exam modes
  const shouldHide = useMemo(() => {
    if (pathname.startsWith('/admin')) return true;
    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth')) return true;
    if (pathname === '/news' || pathname.startsWith('/news/')) return true; // already on news page
    return false;
  }, [pathname]);

  // Load news
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const raw = await getCloudNews(false, false, undefined, null, 25);
        if (isMounted) {
          setAllNews(raw && raw.length > 0 ? raw : MOCK_NEWS);
        }
      } catch (e) {
        if (isMounted) {
          setAllNews(MOCK_NEWS);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const contextKey = useMemo(() => getContextKey(pathname), [pathname]);
  const config = CONTEXT_MAPPINGS[contextKey] || CONTEXT_MAPPINGS.default;
  const ContextIcon = config.icon;

  // Filter 3 to 4 news items that are specifically relevant to this page context
  const contextualArticles = useMemo(() => {
    if (allNews.length === 0) return [];

    // Score articles based on category match + keyword match
    const scored = allNews.map((article, originalIdx) => {
      let score = 0;
      const titleLower = (article.title || '').toLowerCase();
      const excerptLower = (article.excerpt || '').toLowerCase();
      const cat = article.category;

      if (config.categories.includes(cat)) {
        score += 3;
      }

      config.keywords.forEach(kw => {
        if (titleLower.includes(kw)) score += 4;
        if (excerptLower.includes(kw)) score += 2;
      });

      // For default page, skip first 5 (which are shown in the top carousel) to avoid repetition!
      if (contextKey === 'default') {
        if (originalIdx < 5) score -= 10;
      }

      return { article, score, originalIdx };
    });

    // Sort by score descending, then by original order
    scored.sort((a, b) => b.score - a.score || a.originalIdx - b.originalIdx);

    const selected = scored.slice(0, 3).map(s => s.article);
    // If fewer than 3 matched, backfill with unique items
    if (selected.length < 3) {
      for (const item of allNews) {
        if (!selected.some(s => s.id === item.id)) {
          selected.push(item);
          if (selected.length === 3) break;
        }
      }
    }

    return selected;
  }, [allNews, config, contextKey]);

  const handleToggle = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('campusai_news_rail_collapsed', String(next));
      return next;
    });
  };

  const handleOpenArticle = (article: NewsItem) => {
    if (onReadArticle) {
      onReadArticle(article);
    } else {
      const slug = article.slug || slugify(article.title);
      navigate(`/news/${slug}`, { state: { article } });
      window.scrollTo(0, 0);
    }
  };

  if (shouldHide || contextualArticles.length === 0) {
    return null;
  }

  return (
    <aside 
      aria-label="Contextual Campus Updates"
      className="fixed bottom-20 md:bottom-8 right-3 md:right-6 z-40 flex flex-col items-end pointer-events-none"
    >
      <div className="pointer-events-auto">
        {/* Minimized Pill Button */}
        {isCollapsed && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 dark:bg-slate-800/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer group"
            title="Expand contextual campus news"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <ContextIcon size={14} className="text-cyan-400" />
            <span className="text-xs font-bold tracking-tight">
              {config.badge} ({contextualArticles.length})
            </span>
            <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          </motion.button>
        )}

        {/* Expanded Floating News Rail Card */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-80 sm:w-88 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-100 via-slate-50 to-blue-50/40 dark:from-slate-850 dark:via-slate-900 dark:to-blue-950/30 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <ContextIcon size={16} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {config.title}
                      </h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggle}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Minimize news rail"
                  aria-label="Minimize"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* List of 3-4 contextual articles */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-96 overflow-y-auto">
                {contextualArticles.map((article) => {
                  const time = formatNewsPostTime(article);
                  return (
                    <div
                      key={article.id}
                      onClick={() => handleOpenArticle(article)}
                      className="p-3 sm:p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group text-left"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                          <Clock size={10} /> {time.timeAgo}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {article.title}
                      </h5>

                      <div className="mt-1 flex items-center justify-between text-[11px] text-blue-600 dark:text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Read update</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    navigate('/news');
                    window.scrollTo(0, 0);
                  }}
                  className="font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Newspaper size={12} /> View Complete Wire
                </button>

                <button
                  onClick={handleToggle}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
                >
                  Hide
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default ContextualNewsRail;
