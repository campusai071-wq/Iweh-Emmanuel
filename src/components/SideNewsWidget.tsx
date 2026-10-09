import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Newspaper, ChevronRight, Clock, Sparkles, BookOpen } from 'lucide-react';
import { NewsItem } from '../types';
import { getCloudNews } from '../services/dbService';
import { MOCK_NEWS } from '../constants';
import { formatNewsPostTime } from '../utils/dateUtils';
import { slugify } from '../services/utils';

export type NewsPageContext = 'calculator' | 'cbt' | 'universities' | 'target' | 'admissions' | 'general';

interface SideNewsWidgetProps {
  context?: NewsPageContext;
  institution?: string;
  limit?: number;
  title?: string;
  className?: string;
  onReadArticle?: (article: NewsItem) => void;
}

export const SideNewsWidget: React.FC<SideNewsWidgetProps> = ({
  context,
  institution,
  limit = 3,
  title,
  className = '',
  onReadArticle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Automatically infer context from URL pathname if not explicitly provided
  const resolvedContext: NewsPageContext = useMemo(() => {
    if (context) return context;
    const path = location.pathname.toLowerCase();
    if (path.includes('calculator')) return 'calculator';
    if (path.includes('cbt') || path.includes('simulator')) return 'cbt';
    if (path.includes('universit') || path.includes('school')) return 'universities';
    if (path.includes('target') || path.includes('caps')) return 'target';
    if (path.includes('admission')) return 'admissions';
    return 'general';
  }, [context, location.pathname]);

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        const cloudData = await getCloudNews(false, false, undefined, null, 25);
        if (!isMounted) return;
        const validList = cloudData && cloudData.length > 0 ? cloudData : MOCK_NEWS;
        setAllNews(validList);
      } catch (e) {
        console.warn("SideNewsWidget: falling back to mock news", e);
        if (isMounted) setAllNews(MOCK_NEWS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => { isMounted = false; };
  }, []);

  // Filter context-specific news so different pages highlight strictly relevant topics
  const contextualNews = useMemo(() => {
    if (allNews.length === 0) return [];

    let pool = [...allNews];

    // 1. If institution is specified, prioritize articles mentioning this institution
    if (institution && institution.trim().length > 2) {
      const instLower = institution.toLowerCase().trim();
      const schoolMatches = pool.filter(n => {
        const titleMatch = n.title?.toLowerCase().includes(instLower);
        const excerptMatch = n.excerpt?.toLowerCase().includes(instLower);
        const contentMatch = n.fullContent?.toLowerCase().includes(instLower);
        return titleMatch || excerptMatch || contentMatch;
      });

      if (schoolMatches.length >= limit) {
        return schoolMatches.slice(0, limit);
      }
    }

    // 2. Filter by page domain context
    let filtered: NewsItem[] = [];

    switch (resolvedContext) {
      case 'calculator':
        filtered = pool.filter(n => {
          const cat = (n.category || '').toLowerCase();
          const t = (n.title || '').toLowerCase();
          return (
            cat.includes('admission') || cat.includes('jamb') || cat.includes('federal') || 
            cat.includes('state') || t.includes('cutoff') || t.includes('cut-off') || 
            t.includes('aggregate') || t.includes('screening') || t.includes('merit')
          );
        });
        break;

      case 'cbt':
        filtered = pool.filter(n => {
          const cat = (n.category || '').toLowerCase();
          const t = (n.title || '').toLowerCase();
          return (
            cat.includes('jamb') || cat.includes('waec') || t.includes('utme') || 
            t.includes('exam') || t.includes('novel') || t.includes('syllabus') || 
            t.includes('cbt') || t.includes('registration')
          );
        });
        break;

      case 'universities':
        filtered = pool.filter(n => {
          const cat = (n.category || '').toLowerCase();
          const t = (n.title || '').toLowerCase();
          return (
            cat.includes('federal') || cat.includes('state') || cat.includes('polytechnic') || 
            cat.includes('private') || t.includes('university') || t.includes('asuu') || 
            t.includes('strike') || t.includes('accreditation') || t.includes('campus')
          );
        });
        break;

      case 'target':
      case 'admissions':
        filtered = pool.filter(n => {
          const cat = (n.category || '').toLowerCase();
          const t = (n.title || '').toLowerCase();
          return (
            cat.includes('scholarship') || cat.includes('admission') || cat.includes('jamb') || 
            t.includes('caps') || t.includes('target') || t.includes('transfer')
          );
        });
        break;

      default:
        filtered = pool;
    }

    // If not enough context-specific matches, backfill from general pool ensuring no duplicates
    if (filtered.length < limit) {
      const existingIds = new Set(filtered.map(f => f.id));
      for (const item of pool) {
        if (!existingIds.has(item.id)) {
          filtered.push(item);
          existingIds.add(item.id);
          if (filtered.length >= limit) break;
        }
      }
    }

    return filtered.slice(0, limit);
  }, [allNews, resolvedContext, institution, limit]);

  const handleArticleClick = (article: NewsItem) => {
    if (onReadArticle) {
      onReadArticle(article);
    } else {
      const slug = article.slug || slugify(article.title);
      navigate(`/news/${slug}`, { state: { article } });
      window.scrollTo(0, 0);
    }
  };

  const widgetHeaderTitle = useMemo(() => {
    if (title) return title;
    switch (resolvedContext) {
      case 'calculator': return 'Admission & Cutoff Bulletins';
      case 'cbt': return 'JAMB & Exam Wire';
      case 'universities': return 'Campus & Institutional Wire';
      case 'target': return 'Admissions & Quota Updates';
      default: return 'Live Campus Bulletins';
    }
  }, [title, resolvedContext]);

  if (loading && contextualNews.length === 0) {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4 animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-neutral-800 rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2 pb-3 border-b border-white/5 last:border-0">
              <div className="h-3 w-20 bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (contextualNews.length === 0) return null;

  return (
    <aside 
      className={`rounded-2xl sm:rounded-3xl bg-[#0e0f13] border border-white/10 p-4 sm:p-5 shadow-xl text-left space-y-4 ${className}`}
      aria-label="Relevant Campus News Feed"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={15} className="text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
            {widgetHeaderTitle}
          </h3>
        </div>
        <button
          onClick={() => { navigate('/news'); window.scrollTo(0, 0); }}
          className="text-[10px] font-bold text-gray-400 hover:text-cyan-400 uppercase tracking-wider flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          All <ChevronRight size={12} />
        </button>
      </div>

      {/* List of 2 to 4 contextual news items */}
      <div className="space-y-4">
        {contextualNews.map((article, idx) => {
          const timeInfo = formatNewsPostTime(article);
          const thumb = article.image || (article as any).imageUrl;

          return (
            <article 
              key={article.id || idx}
              onClick={() => handleArticleClick(article)}
              className="group cursor-pointer space-y-2 pb-3.5 border-b border-white/5 last:border-0 last:pb-0 transition-all"
            >
              {/* Optional compact thumbnail banner if available */}
              {thumb && (
                <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 mb-2">
                  <img 
                    src={thumb} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                    {article.category || 'NEWS'}
                  </span>
                </div>
              )}

              {/* Tag & Time */}
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                {!thumb && (
                  <span className="font-extrabold uppercase tracking-wider text-cyan-400">
                    {article.category || 'NEWS'}
                  </span>
                )}
                {!thumb && <span>•</span>}
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-neutral-500" />
                  {timeInfo.timeAgo}
                </span>
              </div>

              {/* Headline */}
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 leading-snug line-clamp-2 transition-colors">
                {article.title}
              </h4>

              {/* —— READ MORE Action */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-widest text-neutral-300 group-hover:text-cyan-400 transition-colors">
                  <span className="w-4 h-[1.5px] bg-neutral-400 group-hover:bg-cyan-400 transition-colors inline-block" />
                  READ MORE
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
};

export default SideNewsWidget;
