import React, { useState, useEffect, useMemo } from 'react';
import { Flame, ArrowRight, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCloudNews, getTickerHeadlines } from '../services/dbService';
import { NewsItem } from '../types';
import { cleanPlainText } from '../utils/seoSanitizer';

interface TopNewsTickerBarProps {
  onNavigate?: (page: string) => void;
}

const TopNewsTickerBar: React.FC<TopNewsTickerBarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [tickerNews, setTickerNews] = useState<NewsItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('campusai_news_ticker_speed');
    return saved ? parseInt(saved, 10) : 80; // Default: 80s for news ticker
  });

  useEffect(() => {
    let isMounted = true;

    const handleSpeedUpdate = () => {
      const saved = localStorage.getItem('campusai_news_ticker_speed');
      if (saved) setTickerSpeed(parseInt(saved, 10));
    };

    window.addEventListener('campusai_news_speed_updated', handleSpeedUpdate);

    const loadTickerNews = async () => {
      try {
        const [news, customHeadlines] = await Promise.all([
          getCloudNews().catch(() => [] as NewsItem[]),
          getTickerHeadlines().catch(() => [] as string[])
        ]);

        if (!isMounted) return;

        let activeItems: NewsItem[] = [];

        // 1. Convert custom admin emergency headlines to ticker items
        if (customHeadlines && customHeadlines.length > 0) {
          const headlineItems: NewsItem[] = customHeadlines.map((h, i) => ({
            id: `custom-headline-${i}`,
            title: h,
            content: h,
            excerpt: h,
            image: '',
            category: 'Announcement',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            isTicker: true
          }));
          activeItems = [...headlineItems];
        }

        // 2. Append articles prioritized by admin (isTicker) or fallbacks
        if (news && news.length > 0) {
          const tickerItems = news.filter(n => n.isTicker);
          if (tickerItems.length > 0) {
            activeItems = [...activeItems, ...tickerItems];
          } else {
            const fallbackItems = news.filter(n => n.isPinned || n.isImportant);
            activeItems = [...activeItems, ...(fallbackItems.length > 0 ? fallbackItems : news.slice(0, 8))];
          }
        }

        if (activeItems.length > 0) {
          setTickerNews(activeItems);
        }
      } catch (err) {
        console.warn('[TopNewsTickerBar] error loading news:', err);
      }
    };

    loadTickerNews();
    window.addEventListener('campusai_news_updated', loadTickerNews);

    return () => {
      isMounted = false;
      window.removeEventListener('campusai_news_speed_updated', handleSpeedUpdate);
      window.removeEventListener('campusai_news_updated', loadTickerNews);
    };
  }, []);

  // Ensure enough items in one track so that track width comfortably exceeds viewport width on all screens
  const baseItems = useMemo(() => {
    if (!tickerNews || tickerNews.length === 0) return [];
    let items = [...tickerNews];
    while (items.length < 8) {
      items = [...items, ...tickerNews];
    }
    return items;
  }, [tickerNews]);

  if (!tickerNews || tickerNews.length === 0) return null;

  const handleArticleClick = (item: NewsItem) => {
    const slugOrId = item.slug || item.id;
    if (slugOrId.startsWith('custom-headline-')) {
      if (onNavigate) onNavigate('news');
      else navigate('/news');
      return;
    }
    if (onNavigate) {
      navigate(`/news/${slugOrId}`);
    } else {
      window.location.href = `/news/${slugOrId}`;
    }
  };

  return (
    <aside 
      aria-label="Admission News Ticker" 
      className="w-full bg-slate-950 text-white border-b border-cyan-500/20 py-2 px-3 sm:px-6 overflow-hidden flex items-center justify-between gap-2.5 text-xs shadow-inner min-h-[38px] relative z-30 select-none leading-normal"
    >
      {/* Fixed Badge Zone on the Left (Text NEVER slides underneath) */}
      <div className="shrink-0 bg-slate-950 pr-2 z-10 flex items-center">
        <div className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 flex items-center gap-1.5 font-mono shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> UPDATES
        </div>
      </div>

      {/* Moving Track Viewport with Safe Padding and Keyboard Focus Support */}
      <div 
        className="relative flex-1 overflow-hidden flex items-center min-h-[1.75rem] px-3 sm:px-4 outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 rounded"
        tabIndex={0}
        role="region"
        aria-label="Admission News Headlines (Press tab to pause)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div 
          className="flex w-max animate-marquee cursor-pointer select-none py-0.5 leading-normal"
          style={{ 
            animationDuration: `${Math.max(35, tickerSpeed)}s`,
            animationPlayState: (isPaused || isFocused) ? 'paused' : 'running'
          }}
        >
          {/* Track 1 */}
          <div className="flex shrink-0 items-center gap-12 pr-12">
            {baseItems.map((item, idx) => (
              <span
                key={`track1-${item.id || idx}-${idx}`}
                onClick={() => handleArticleClick(item)}
                className="inline-flex items-center gap-2 text-slate-200 hover:text-cyan-400 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
              >
                <span className="text-cyan-500 font-bold">•</span>
                <span className="hover:underline underline-offset-2 whitespace-nowrap">{cleanPlainText(item.title)}</span>
              </span>
            ))}
          </div>

          {/* Track 2 (Identical twin for 100% seamless, zero-cut infinite loop) */}
          <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden="true">
            {baseItems.map((item, idx) => (
              <span
                key={`track2-${item.id || idx}-${idx}`}
                onClick={() => handleArticleClick(item)}
                className="inline-flex items-center gap-2 text-slate-200 hover:text-cyan-400 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
              >
                <span className="text-cyan-500 font-bold">•</span>
                <span className="hover:underline underline-offset-2 whitespace-nowrap">{cleanPlainText(item.title)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Controls Zone on the Right */}
      <div className="shrink-0 bg-slate-950 pl-2 z-10 flex items-center gap-1">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 sm:p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800/80"
          title={isPaused ? "Resume scrolling" : "Pause scrolling"}
          aria-label={isPaused ? "Resume scrolling" : "Pause scrolling"}
        >
          {isPaused ? <Play size={11} className="text-cyan-400" /> : <Pause size={11} />}
        </button>
      </div>
    </aside>
  );
};

export default TopNewsTickerBar;
