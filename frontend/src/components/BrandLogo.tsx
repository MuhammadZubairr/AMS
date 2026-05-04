'use client';

import React, { memo, useId } from 'react';

type BrandLogoTone = 'brand' | 'inverse';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  subtitle?: string;
  tone?: BrandLogoTone;
}

const toneStyles: Record<BrandLogoTone, { wordmark: string; subtitle: string }> = {
  brand: {
    wordmark: 'text-[#2563EB]',
    subtitle: 'text-slate-500',
  },
  inverse: {
    wordmark: 'text-white',
    subtitle: 'text-blue-100',
  },
};

/**
 * BrandLogo Component - Memoized
 * Prevents unnecessary re-renders when parent updates
 */
export const BrandLogo = memo(function BrandLogo({ className = '', compact = false, subtitle, tone = 'brand' }: BrandLogoProps) {
  const styles = toneStyles[tone];
  const gradientId = useId();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="DevFlx">
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="10" y1="9" x2="38" y2="39" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2F80FF" />
            <stop offset="1" stopColor="#1E5BFF" />
          </linearGradient>
        </defs>
        <path d="M12 13.5L24 9.5L36 13.5V24L24 38.5L12 24V13.5Z" fill={`url(#${gradientId})`} />
        <path d="M15.5 15.9L24 13L32.5 15.9V23L24 34.9L15.5 23V15.9Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        <path d="M18 19.5L24 18L30 19.5V23.2L24 30.5L18 23.2V19.5Z" fill="white" opacity="0.95" />
      </svg>

      {!compact ? (
        <div className="flex flex-col leading-none">
          <span className={`text-[1.05rem] font-bold tracking-[-0.03em] ${styles.wordmark}`}>DevFlx</span>
          {subtitle ? <span className={`mt-1 text-[0.72rem] font-medium uppercase tracking-[0.22em] ${styles.subtitle}`}>{subtitle}</span> : null}
        </div>
      ) : null}
    </div>
  );
});

export default BrandLogo;
