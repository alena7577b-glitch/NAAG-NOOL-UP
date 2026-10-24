'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { SiteBanner } from '@/lib/actions/admin-banners';

interface TopAnnouncementRibbonProps {
  initialBanner?: SiteBanner | null;
}

export function TopAnnouncementRibbon({ initialBanner }: TopAnnouncementRibbonProps) {
  const pathname = usePathname();
  const [banner, setBanner] = useState<SiteBanner | null>(initialBanner ?? null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // If no initial banner passed, fetch active banner client-side
    if (initialBanner === undefined) {
      let isMounted = true;
      fetch('/api/banners/active')
        .then((res) => (res.ok ? res.json() : { banner: null }))
        .then((data) => {
          if (!isMounted) return;
          if (data?.banner) {
            setBanner(data.banner);
          }
        })
        .catch(() => {});

      return () => {
        isMounted = false;
      };
    }
  }, [initialBanner]);

  // Do not render on admin console or when dismissed
  if (pathname?.startsWith('/admin') || isDismissed || !banner || !banner.isActive) {
    return null;
  }

  // Only render if position is top_ribbon
  if (banner.position !== 'top_ribbon') {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative z-50 text-xs py-2 px-4 transition-all duration-300 shadow-xs"
      style={{
        backgroundColor: banner.bgColor || '#182821',
        color: banner.textColor || '#F9F6F0',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Banner content */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 text-center">
          {banner.badge && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-white/20 shrink-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: banner.textColor || '#FFFFFF',
              }}
            >
              {banner.badge}
            </span>
          )}

          <span className="font-medium">{banner.text}</span>

          {banner.linkUrl && (
            <Link
              href={banner.linkUrl}
              className="font-semibold underline underline-offset-4 hover:opacity-85 transition-opacity inline-flex items-center gap-1 ps-1"
              style={{ color: banner.textColor || '#FFFFFF' }}
            >
              <span>{banner.linkText || 'Learn More'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-full hover:bg-black/15 transition-colors text-current shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
