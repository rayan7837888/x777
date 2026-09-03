import React from 'react';

interface DodgeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showArabic?: boolean;
  showEnglish?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export const DodgeLogo: React.FC<DodgeLogoProps> = ({
  size = 'md',
  showArabic = true,
  showEnglish = true,
  className = '',
  variant = 'light'
}) => {
  // Sizing styles
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-7xl'
  };

  const stripeHeights = {
    sm: 'h-4 w-1.5',
    md: 'h-6 sm:h-7 w-2 sm:w-2.5',
    lg: 'h-9 sm:h-11 w-3 sm:w-3.5',
    xl: 'h-12 sm:h-16 w-3.5 sm:w-5'
  };

  const gapSizes = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
    xl: 'gap-2.5'
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-900';

  return (
    <div 
      id="dodge-official-logo" 
      className={`inline-flex items-center gap-2 sm:gap-3 select-none tracking-wider ${className}`}
      dir="ltr"
    >
      <div className="flex items-baseline gap-1.5 font-dodge font-extrabold uppercase leading-none">
        {/* Arabic Brand Name "دوج" */}
        {showArabic && (
          <span 
            id="dodge-arabic-word"
            className={`${textSizes[size]} ${textColor} font-black font-sans tracking-normal`}
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            دوج
          </span>
        )}

        {/* Separator if both are shown */}
        {showArabic && showEnglish && (
          <span className={`opacity-40 ${textColor} ${textSizes[size]}`}>•</span>
        )}

        {/* English Brand Name "DODGE" */}
        {showEnglish && (
          <span 
            id="dodge-english-word" 
            className={`${textSizes[size]} ${textColor} tracking-widest font-black`}
            style={{ fontFamily: "'Chakra Petch', 'Teko', sans-serif" }}
          >
            DODGE
          </span>
        )}
      </div>

      {/* The Iconic Two Red Slashes // (خطي شعار دوج الحمر) */}
      <div 
        id="dodge-twin-red-stripes"
        className={`inline-flex ${gapSizes[size]} items-center transform -skew-x-[24deg]`}
        title="شعار خطين حمر دوج الأيقونيين"
      >
        <span 
          className={`${stripeHeights[size]} bg-red-600 rounded-[1px] shadow-[0_0_12px_rgba(220,38,38,0.7)] block transition-transform hover:scale-110`} 
        />
        <span 
          className={`${stripeHeights[size]} bg-red-600 rounded-[1px] shadow-[0_0_12px_rgba(220,38,38,0.7)] block transition-transform hover:scale-110`} 
        />
      </div>
    </div>
  );
};
