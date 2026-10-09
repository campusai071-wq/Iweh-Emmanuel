import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';
import { getCloudNews } from '../services/dbService';
import { MOCK_NEWS } from '../constants';
import { slugify } from '../services/utils';

interface TopNewsCarouselProps {
  onReadArticle?: (article: NewsItem) => void;
  className?: string;
}

const AUTO_ADVANCE_MS = 5000;

// Curated authentic Nigerian academic & campus event imagery for verified visual presence
const FALLBACK_CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80', // University track & field / campus games
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80', // Students celebrating / convocation
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80', // Examination / lecture hall
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80', // University auditorium & facade
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80', // Campus assembly / student forum
];

export const TopNewsCarousel: React.FC<TopNewsCarouselProps> = ({ 
  onReadArticle,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch 5 most recent verified news items
  useEffect(() => {
    let isMounted = true;
    const fetchTopNews = async () => {
      try {
        setLoading(true);
        const raw = await getCloudNews(false, false, undefined, null, 10);
        if (!isMounted) return;
        
        const validNews = raw && raw.length > 0 ? raw : MOCK_NEWS;
        setNewsList(validNews.slice(0, 5));
      } catch (err) {
        console.warn("TopNewsCarousel: Falling back to mock news", err);
        if (isMounted) {
          setNewsList(MOCK_NEWS.slice(0, 5));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopNews();
    return () => { isMounted = false; };
  }, []);

  const total = newsList.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance timer: moves to next slide every 5 seconds, pauses on hover
  useEffect(() => {
    if (total <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, handleNext]);

  const currentArticle = newsList[currentIndex];

  const handleArticleClick = (article: NewsItem) => {
    if (onReadArticle) {
      onReadArticle(article);
    } else {
      const slug = article.slug || slugify(article.title);
      navigate(`/news/${slug}`, { state: { article } });
      window.scrollTo(0, 0);
    }
  };

  if (loading && newsList.length === 0) {
    return (
      <div className={`w-full max-w-4xl mx-auto rounded-3xl bg-neutral-900/60 border border-white/10 overflow-hidden animate-pulse shadow-2xl ${className}`}>
        <div className="h-64 sm:h-80 md:h-96 w-full bg-neutral-800" />
        <div className="p-6 sm:p-8 space-y-4 bg-neutral-950">
          <div className="h-3 w-28 bg-neutral-800 rounded" />
          <div className="h-7 w-4/5 bg-neutral-800 rounded-lg" />
          <div className="h-4 w-32 bg-neutral-800 rounded" />
        </div>
        <div className="grid grid-cols-2 border-t border-neutral-800 bg-neutral-950 h-14" />
      </div>
    );
  }

  if (!currentArticle) return null;

  // Resolve hero image with index fallback
  const heroImage = currentArticle.image || (currentArticle as any).imageUrl || FALLBACK_CAMPUS_IMAGES[currentIndex % FALLBACK_CAMPUS_IMAGES.length];
  const categoryLabel = (currentArticle.category || 'CAMPUS NEWS').toUpperCase();

  return (
    <div 
      className={`relative w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-[#0d0e12] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="CampusAI Headline News Slide"
    >
      {/* ── Top Half: Large Visual Image Banner ── */}
      <div 
        onClick={() => handleArticleClick(currentArticle)}
        className="relative w-full h-56 sm:h-72 md:h-96 overflow-hidden bg-neutral-950 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentArticle.id || currentIndex}
            src={heroImage} 
            alt={currentArticle.title}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            onError={(e) => {
              // Graceful fallback to guaranteed academic asset
              (e.currentTarget as HTMLImageElement).src = FALLBACK_CAMPUS_IMAGES[0];
            }}
          />
        </AnimatePresence>

        {/* Subtle dark gradient overlay to anchor image to bottom card */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-black/25 pointer-events-none" />

        {/* Top Floating Slide Counter Pill */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold tracking-wider">
            0{currentIndex + 1} / 0{total}
          </span>
        </div>
      </div>

      {/* ── Bottom Half: Headline Card Body ── */}
      <div className="p-6 sm:p-8 md:p-9 bg-[#0d0e12] text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id || currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-3.5 sm:space-y-4"
          >
            {/* Category tag */}
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">
              {categoryLabel}
            </p>

            {/* Bold Headline */}
            <h2 
              onClick={() => handleArticleClick(currentArticle)}
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {currentArticle.title}
            </h2>

            {/* —— READ MORE Link Button */}
            <div className="pt-2 sm:pt-3">
              <button
                type="button"
                onClick={() => handleArticleClick(currentArticle)}
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest text-white hover:text-cyan-400 transition-all cursor-pointer group/read active:scale-95"
              >
                <span className="w-8 sm:w-10 h-[2px] bg-white group-hover/read:bg-cyan-400 transition-colors inline-block" />
                <span>READ MORE</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer Navigation Bar: 50/50 Split PREV / NEXT Buttons ── */}
      <div className="grid grid-cols-2 border-t border-white/10 bg-[#0d0e12]">
        <button
          type="button"
          onClick={handlePrev}
          className="w-full py-4 sm:py-4.5 text-xs font-black uppercase tracking-[0.2em] text-neutral-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors border-r border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
          aria-label="Previous headline"
        >
          <ChevronLeft size={16} /> PREV
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 sm:py-4.5 text-xs font-black uppercase tracking-[0.2em] text-neutral-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          aria-label="Next headline"
        >
          NEXT <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopNewsCarousel;
