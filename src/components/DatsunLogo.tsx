import React from 'react';

interface DatsunLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showArabic?: boolean;
  showEnglish?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export const DatsunLogo: React.FC<DatsunLogoProps> = ({
  size = 'md',
  showArabic = true,
  showEnglish = true,
  className = '',
  variant = 'light'
}) => {
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-6xl'
  };

  const badgeSizes = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-11 h-11 text-xs',
    xl: 'w-14 h-14 text-sm'
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-900';

  return (
    <div 
      id="datsun-official-logo" 
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none tracking-wider ${className}`}
      dir="rtl"
    >
      {/* The Classic Datsun Heritage Emblem Badge */}
      <div 
        className={`relative ${badgeSizes[size]} rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 border-2 border-white/90 shadow-[0_0_15px_rgba(220,38,38,0.6)] flex items-center justify-center overflow-hidden flex-shrink-0`}
        title="شعار داتسون التراثي الدائري"
      >
        <div className="absolute inset-x-0 h-2.5 sm:h-3 bg-blue-900 border-t border-b border-white/80 flex items-center justify-center shadow-inner">
          <span className="text-white font-black tracking-widest text-[7px] sm:text-[9px] font-mono transform scale-90">
            DATSUN
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 leading-none font-bold" dir="rtl">
        {/* Arabic Brand Name "ددسن 2012" */}
        {showArabic && (
          <div className="flex items-baseline gap-1.5">
            <span 
              className={`${textSizes[size]} ${textColor} font-black font-sans tracking-normal`}
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              ددسن
            </span>
            <span className="text-red-500 font-mono font-black text-sm sm:text-lg">
              2012
            </span>
          </div>
        )}

        {/* Separator if both are shown */}
        {showArabic && showEnglish && (
          <span className={`opacity-40 ${textColor} ${textSizes[size]}`}>•</span>
        )}

        {/* English Brand Name "DATSUN PICKUP" */}
        {showEnglish && (
          <span 
            className={`${textSizes[size]} ${textColor} tracking-widest font-black uppercase text-xs sm:text-sm font-mono opacity-90`}
          >
            PICKUP D22
          </span>
        )}
      </div>

      {/* 2012 Signature Side Stripe Accent // */}
      <div 
        className="hidden sm:inline-flex gap-1 items-center transform -skew-x-[20deg]"
        title="خطوط ددسن 2012 الأيقونية"
      >
        <span className="h-5 w-1.5 bg-red-600 rounded-[1px] shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
        <span className="h-5 w-1 bg-neutral-300 rounded-[1px]" />
        <span className="h-5 w-1.5 bg-red-600 rounded-[1px] shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
      </div>
    </div>
  );
};
