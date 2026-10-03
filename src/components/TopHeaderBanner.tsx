import React, { useState, useEffect, useMemo } from 'react';
import { Megaphone, Sparkles, ArrowRight, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { SponsoredAd } from '../types';
import { getActiveSponsoredAds, recordAdClick, recordAdImpression } from '../services/adPartnerService';

interface TopHeaderBannerProps {
  showImportantBanner?: boolean;
  onNavigate?: (tab: string) => void;
}

export const TopHeaderBanner: React.FC<TopHeaderBannerProps> = ({
  showImportantBanner = true,
  onNavigate
}) => {
  const [adsList, setAdsList] = useState<SponsoredAd[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('campusai_ad_banner_speed');
    return saved ? parseInt(saved, 10) : 60; // Default: smooth 60s for top ad banner
  });

  useEffect(() => {
    let isMounted = true;

    const handleSpeedUpdate = () => {
      const saved = localStorage.getItem('campusai_ad_banner_speed');
      if (saved) setTickerSpeed(parseInt(saved, 10));
    };

    window.addEventListener('campusai_ad_speed_updated', handleSpeedUpdate);

    const loadBannerAds = () => {
      getActiveSponsoredAds('banner').then(ads => {
        if (!isMounted) return;
        if (ads && ads.length > 0) {
          setAdsList(ads);
          ads.forEach(ad => recordAdImpression(ad.id));
        } else {
          setAdsList([]);
        }
      });
    };

    loadBannerAds();

    const handleUpdate = () => {
      loadBannerAds();
    };

    window.addEventListener('campusai_ad_updated', handleUpdate);
    window.addEventListener('campusai_config_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('campusai_ad_updated', handleUpdate);
      window.removeEventListener('campusai_config_updated', handleUpdate);
      window.removeEventListener('campusai_ad_speed_updated', handleSpeedUpdate);
    };
  }, []);

  const baseAdItems = useMemo(() => {
    if (!adsList || adsList.length === 0) return [];
    let items = [...adsList];
    while (items.length < 6) {
      items = [...items, ...adsList];
    }
    return items;
  }, [adsList]);

  const announcementItems = useMemo(() => {
    const message = "Official Post-UTME screening forms, cut-off marks, CAPS updates and aggregate tools are now active across all Nigerian universities.";
    return [message, message, message, message];
  }, []);

  if (isDismissed) return null;

  const handleBannerClick = (e: React.MouseEvent, ad: SponsoredAd) => {
    recordAdClick(ad.id);
  };

  // 1. If an active sponsored ad targeting 'banner' or 'all' exists:
  if (adsList.length > 0) {
    const firstBadge = adsList[0]?.badgeText || 'VERIFIED SPONSOR';

    return (
      <aside 
        aria-label="Sponsored Announcement"
        className="w-full bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white border-b border-amber-500/20 px-3 sm:px-6 py-2 min-h-[38px] flex items-center justify-between shadow-sm select-none overflow-hidden relative z-30 leading-normal"
      >
        {/* Pinned Badge on the Left */}
        <div className="shrink-0 bg-amber-950 pr-2 z-10 flex items-center">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded border border-amber-500/30 shadow-sm font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            {firstBadge}
          </span>
        </div>

        {/* Moving Marquee Viewport */}
        <div 
          className="relative flex-1 overflow-hidden flex items-center min-h-[1.75rem] px-3 sm:px-4 outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded"
          tabIndex={0}
          role="region"
          aria-label="Sponsored Announcement Marquee (Press tab to pause)"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div 
            className="flex w-max animate-marquee cursor-pointer select-none py-0.5 leading-normal"
            style={{ 
              animationDuration: `${Math.max(25, tickerSpeed)}s`,
              animationPlayState: (isPaused || isFocused) ? 'paused' : 'running'
            }}
          >
            {/* Track 1 */}
            <div className="flex shrink-0 items-center gap-12 pr-12">
              {baseAdItems.map((ad, idx) => (
                <a
                  key={`ad-track1-${ad.id || idx}-${idx}`}
                  href={ad.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleBannerClick(e, ad)}
                  className="inline-flex items-center gap-2 text-slate-100 hover:text-amber-300 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
                  title="Click to open sponsored link"
                >
                  <span className="text-amber-400 font-bold">•</span>
                  {ad.brandName && (
                    <strong className="font-bold text-amber-300 mr-1">
                      {ad.brandName}:
                    </strong>
                  )}
                  <span className="hover:underline underline-offset-2 whitespace-nowrap">
                    {ad.title} {ad.description ? `— ${ad.description}` : ''}
                  </span>
                  <ExternalLink size={11} className="text-amber-400 shrink-0 ml-1" />
                </a>
              ))}
            </div>

            {/* Track 2 (Identical twin for seamless loop) */}
            <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden="true">
              {baseAdItems.map((ad, idx) => (
                <a
                  key={`ad-track2-${ad.id || idx}-${idx}`}
                  href={ad.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleBannerClick(e, ad)}
                  className="inline-flex items-center gap-2 text-slate-100 hover:text-amber-300 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
                  title="Click to open sponsored link"
                >
                  <span className="text-amber-400 font-bold">•</span>
                  {ad.brandName && (
                    <strong className="font-bold text-amber-300 mr-1">
                      {ad.brandName}:
                    </strong>
                  )}
                  <span className="hover:underline underline-offset-2 whitespace-nowrap">
                    {ad.title} {ad.description ? `— ${ad.description}` : ''}
                  </span>
                  <ExternalLink size={11} className="text-amber-400 shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tiny Dismiss Button */}
        <div className="shrink-0 bg-indigo-950 pl-2 z-10 flex items-center">
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-amber-300/70 hover:text-white hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Dismiss top banner"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </aside>
    );
  }

  // 2. If no active ad, but the Admin has toggled "Top Important Update Banner" ON:
  if (showImportantBanner) {
    return (
      <aside 
        aria-label="Important Admission Update"
        className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 text-white border-b border-cyan-500/20 px-3 sm:px-6 py-2 min-h-[38px] flex items-center justify-between shadow-sm select-none overflow-hidden relative z-30 leading-normal"
      >
        {/* Pinned Badge on the Left */}
        <div className="shrink-0 bg-blue-950 pr-2 z-10 flex items-center">
          <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded border border-cyan-500/30 font-mono shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            ANNOUNCEMENT
          </span>
        </div>

        {/* Moving Marquee Viewport */}
        <div 
          className="relative flex-1 overflow-hidden flex items-center min-h-[1.75rem] px-3 sm:px-4 outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 rounded"
          tabIndex={0}
          role="region"
          aria-label="Important Admission Update Marquee (Press tab to pause)"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div 
            className="flex w-max animate-marquee cursor-pointer select-none py-0.5 leading-normal"
            style={{ 
              animationDuration: `${Math.max(25, tickerSpeed)}s`,
              animationPlayState: (isPaused || isFocused) ? 'paused' : 'running'
            }}
          >
            {/* Track 1 */}
            <div className="flex shrink-0 items-center gap-12 pr-12">
              {announcementItems.map((text, idx) => (
                <div
                  key={`ann-track1-${idx}`}
                  onClick={() => onNavigate ? onNavigate('calculator') : (window.location.href = '/calculator')}
                  className="inline-flex items-center gap-2 text-slate-100 hover:text-cyan-300 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
                  title="Click to check 2026/2027 Cut-Off marks"
                >
                  <span className="text-cyan-400 font-bold">•</span>
                  <strong className="text-cyan-300 font-bold mr-1">2026/2027 Admissions:</strong>
                  <span className="hover:underline underline-offset-2 whitespace-nowrap">{text}</span>
                  <ArrowRight size={11} className="text-cyan-400 shrink-0 ml-1" />
                </div>
              ))}
            </div>

            {/* Track 2 (Identical twin for seamless loop) */}
            <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden="true">
              {announcementItems.map((text, idx) => (
                <div
                  key={`ann-track2-${idx}`}
                  onClick={() => onNavigate ? onNavigate('calculator') : (window.location.href = '/calculator')}
                  className="inline-flex items-center gap-2 text-slate-100 hover:text-cyan-300 font-medium text-[11px] sm:text-xs transition-colors shrink-0"
                  title="Click to check 2026/2027 Cut-Off marks"
                >
                  <span className="text-cyan-400 font-bold">•</span>
                  <strong className="text-cyan-300 font-bold mr-1">2026/2027 Admissions:</strong>
                  <span className="hover:underline underline-offset-2 whitespace-nowrap">{text}</span>
                  <ArrowRight size={11} className="text-cyan-400 shrink-0 ml-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tiny Dismiss Button */}
        <div className="shrink-0 bg-cyan-950 pl-2 z-10 flex items-center">
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-cyan-300/70 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer"
            title="Dismiss top banner"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </aside>
    );
  }

  return null;
};

export default TopHeaderBanner;
