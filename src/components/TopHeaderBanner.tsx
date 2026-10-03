import React, { useState, useEffect } from 'react';
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
  const [activeAd, setActiveAd] = useState<SponsoredAd | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('campusai_ad_banner_speed');
    return saved ? parseInt(saved, 10) : 150; // Default: ultra slow 150s for top ad banner
  });

  useEffect(() => {
    let isMounted = true;
    let rotationInterval: any = null;

    const handleSpeedUpdate = () => {
      const saved = localStorage.getItem('campusai_ad_banner_speed');
      if (saved) setTickerSpeed(parseInt(saved, 10));
    };

    window.addEventListener('campusai_ad_speed_updated', handleSpeedUpdate);

    const loadBannerAd = () => {
      getActiveSponsoredAds('banner').then(ads => {
        if (!isMounted) return;
        if (ads && ads.length > 0) {
          const currentIndex = Math.floor(Math.random() * ads.length);
          const initialAd = ads[currentIndex];
          setActiveAd(initialAd);
          recordAdImpression(initialAd.id);

          if (ads.length > 1) {
            if (rotationInterval) clearInterval(rotationInterval);
            let idx = currentIndex;
            rotationInterval = setInterval(() => {
              if (!isMounted) return;
              if (typeof document !== 'undefined' && document.hidden) return;
              idx = (idx + 1) % ads.length;
              const nextAd = ads[idx];
              setActiveAd(nextAd);
              recordAdImpression(nextAd.id);
            }, 12000);
          }
        } else {
          setActiveAd(null);
        }
      });
    };

    loadBannerAd();

    const handleUpdate = () => {
      loadBannerAd();
    };

    window.addEventListener('campusai_ad_updated', handleUpdate);
    window.addEventListener('campusai_config_updated', handleUpdate);

    return () => {
      isMounted = false;
      if (rotationInterval) clearInterval(rotationInterval);
      window.removeEventListener('campusai_ad_updated', handleUpdate);
      window.removeEventListener('campusai_config_updated', handleUpdate);
      window.removeEventListener('campusai_ad_speed_updated', handleSpeedUpdate);
    };
  }, []);

  if (isDismissed) return null;

  const handleBannerClick = (e: React.MouseEvent, ad: SponsoredAd) => {
    recordAdClick(ad.id);
  };

  // 1. If an active sponsored ad targeting 'banner' or 'all' exists:
  if (activeAd) {
    return (
      <aside 
        aria-label="Sponsored Announcement"
        className="w-full bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white border-b border-amber-500/20 px-3 sm:px-6 py-2 min-h-[38px] flex items-center shadow-sm select-none"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2.5 text-[11px] sm:text-xs leading-normal">
          {/* Entire banner is clickable and opens activeAd.targetUrl directly */}
          <a
            href={activeAd.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleBannerClick(e, activeAd)}
            className="flex-1 min-w-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity gap-2"
            title="Click to open sponsored link"
          >
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shadow-sm font-mono">
              {activeAd.badgeText || 'SPONSORED AD'}
            </span>
            <div className="truncate text-center text-slate-100 font-medium">
              {activeAd.brandName && (
                <strong className="font-bold text-amber-300 mr-1.5">
                  {activeAd.brandName}:
                </strong>
              )}
              <span>{activeAd.title} {activeAd.description ? `— ${activeAd.description}` : ''}</span>
            </div>
            <ExternalLink size={12} className="text-amber-400 shrink-0 hidden sm:inline ml-0.5" />
          </a>

          {/* Tiny Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 p-1 rounded text-amber-300/70 hover:text-white hover:bg-amber-500/20 transition-colors cursor-pointer"
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
        className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 text-white border-b border-cyan-500/20 px-3 sm:px-6 py-2 min-h-[38px] flex items-center shadow-sm select-none"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2.5 text-[11px] sm:text-xs leading-normal">
          {/* Entire banner is clickable to check cutoffs / open target tool */}
          <div 
            onClick={() => onNavigate ? onNavigate('calculator') : (window.location.href = '/calculator')}
            className="flex-1 min-w-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity gap-2"
            title="Click to check 2026/2027 Cut-Off marks"
          >
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono shadow-sm">
              ANNOUNCEMENT
            </span>
            <div className="truncate text-center text-slate-100 font-medium">
              <strong className="text-cyan-300 font-bold mr-1.5">2026/2027 Admissions:</strong>
              <span>Official Post-UTME screening forms, cut-off marks, CAPS updates and aggregate tools are now active across all Nigerian universities.</span>
            </div>
            <ArrowRight size={12} className="text-cyan-400 shrink-0 hidden sm:inline ml-0.5" />
          </div>

          {/* Tiny Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 p-1 rounded text-cyan-300/70 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer"
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
