import React, { useId } from 'react';

interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ compact = false }) => {
  const gradientId = useId();

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 shadow-[0_18px_40px_rgba(14,165,233,0.28)]">
        <div className="absolute inset-[1px] rounded-2xl bg-slate-950/85" />
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-hidden="true"
        >
          <path d="M50 10L89 32.5V77.5L50 100L11 77.5V32.5L50 10Z" stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 48L22 58L35 68" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M65 48L78 58L65 68" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 73L57 34" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id={gradientId} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {!compact && (
        <div className="min-w-0">
          <div className="text-lg font-semibold tracking-tight text-white">SyntaxArena</div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Competitive Backend Training</div>
        </div>
      )}
    </div>
  );
};
