import React, { useState } from 'react';
import { DodgeLogo } from './DodgeLogo';
import { Flame, Sparkles, Volume2, ShieldAlert, Award, Heart } from 'lucide-react';

interface DodgePoemSectionProps {
  onOpenTestDrive?: () => void;
}

export const DodgePoemSection: React.FC<DodgePoemSectionProps> = ({ onOpenTestDrive }) => {
  const [likes, setLikes] = useState(1328);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <section id="dodge-poem-section" className="relative py-20 bg-neutral-950 overflow-hidden border-t border-b border-neutral-850" dir="rtl">
      {/* Background glow & ambient red dodge stripes */}
      <div className="absolute inset-0 bg-radial-gradient from-red-950/25 via-neutral-950/80 to-neutral-950 pointer-events-none" />
      
      {/* Massive subtle background twin stripes */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none opacity-10">
        <div className="w-16 h-full bg-gradient-to-b from-red-600 via-red-800 to-transparent transform -skew-x-[26deg]" />
        <div className="w-16 h-full bg-gradient-to-b from-red-600 via-red-800 to-transparent transform -skew-x-[26deg]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Badge with Dodge Logo and Twin Red Stripes */}
        <div className="inline-flex items-center gap-3 bg-neutral-900/90 border border-red-850/60 rounded-full px-5 py-2 shadow-[0_0_20px_rgba(220,38,38,0.25)] backdrop-blur-md">
          <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
          <span className="text-neutral-500 text-xs">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
            <Flame className="w-4 h-4" />
            <span>معلقة وحش العضلات الأمريكية</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            قصيدة هيمي <span className="text-red-600">V8</span> وخطي دودج الحمر
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
            كلماتٌ صيغت من صهيل 710 أحصنة، وتاريخٍ لا ينحني إلا للقمة.. حيث تلتقي الهيبة بالخطين الحمر وشعار دوج الأسطوري.
          </p>
        </div>

        {/* POEM CALLIGRAPHY CARD */}
        <div className="relative bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-neutral-950 border-2 border-red-700/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(220,38,38,0.2)] backdrop-blur-xl">
          
          {/* Top Twin Red Stripes on Card Corner */}
          <div className="absolute top-0 right-8 flex gap-2 transform -skew-x-[24deg] overflow-hidden -translate-y-2">
            <div className="w-3.5 h-7 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
            <div className="w-3.5 h-7 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
          </div>

          <div className="absolute top-0 left-8 flex gap-2 transform -skew-x-[24deg] overflow-hidden -translate-y-2">
            <div className="w-3.5 h-7 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
            <div className="w-3.5 h-7 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
          </div>

          {/* Verses */}
          <div className="space-y-6 sm:space-y-8 text-neutral-200 text-lg sm:text-2xl font-bold leading-relaxed font-arabic">
            
            <div className="p-4 rounded-2xl hover:bg-neutral-800/40 transition-colors border-b border-neutral-800/60 pb-6">
              <p className="text-white">
                إِذَا زَأَرَ الهِيمِي تَراجَفَتِ القِفَارُ
                <span className="inline-block mx-3 text-red-500 font-serif">•</span>
                وَدَوَّى فِي عُرُوقِ الأَرْضِ نَارُ
              </p>
              <span className="text-xs font-mono text-neutral-400 mt-1 block">
                (قوة الهيمي الجبارة حين تنفجر في دورانجو هيلكات)
              </span>
            </div>

            <div className="p-4 rounded-2xl hover:bg-neutral-800/40 transition-colors border-b border-neutral-800/60 pb-6">
              <p className="text-white">
                تَبَاهَى وَحْشُ «دُوجٍ» فِي مَدَاهُ
                <span className="inline-block mx-3 text-red-500 font-serif">•</span>
                وَفِي صَدْرِ الحَدِيدِ <span className="text-red-500 underline decoration-red-600 decoration-2 underline-offset-8">خَطَّانِ حُمْرُ</span>
              </p>
              <span className="text-xs font-mono text-neutral-400 mt-1 block">
                (رمز السرعة الخالد: خطين حمر يعلوان الكبوت والمسار)
              </span>
            </div>

            <div className="p-4 rounded-2xl hover:bg-neutral-800/40 transition-colors border-b border-neutral-800/60 pb-6">
              <p className="text-white">
                سَبْعُمِائَةٍ وَعَشْرٌ مِنْ جِيَادٍ جَمَحَتْ
                <span className="inline-block mx-3 text-red-500 font-serif">•</span>
                إِذَا انْطَلَقَتْ فَمَا لِلرِّيحِ صَبْرُ
              </p>
              <span className="text-xs font-mono text-neutral-400 mt-1 block">
                (710 أحصنة هيلكات تتسارع من صفر إلى 100 في 3.5 ثانية)
              </span>
            </div>

            <div className="p-4 rounded-2xl hover:bg-neutral-800/40 transition-colors">
              <p className="text-white">
                شِعَارُ المَجْدِ يَلْمَعُ فِي هُدَاهَا
                <span className="inline-block mx-3 text-red-500 font-serif">•</span>
                وَتَشْهَدُ كُلُّ سَاحَاتِ المَنَايَا
              </p>
              <span className="text-xs font-mono text-neutral-400 mt-1 block">
                (شعار دودج الأيقوني بالخطين الحمر لا ينحني لأي منافس)
              </span>
            </div>

          </div>

          {/* Slogan Banner */}
          <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  hasLiked 
                    ? 'bg-red-950/60 border-red-600 text-red-400' 
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>أعجبني الشعر ({likes})</span>
              </button>
              <span className="text-xs text-neutral-400">
                #دودج_دورانجو #خطين_حمر #هيمي_V8
              </span>
            </div>

            {onOpenTestDrive && (
              <button
                onClick={onOpenTestDrive}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>جرّب قوة الوحش الآن</span>
              </button>
            )}

          </div>

        </div>

        {/* Dodge Identity Badges Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-neutral-400 text-xs">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-center gap-3">
            <div className="flex gap-1 transform -skew-x-[22deg]">
              <div className="w-2 h-4 bg-red-600" />
              <div className="w-2 h-4 bg-red-600" />
            </div>
            <span>الخطين الحمر: علامة القوة والسباقات منذ 1914</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-red-500" />
            <span>شعار دوج: عضلات أمريكية لا تروض</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>محركات HEMI V8: 2025 آخر فرصة للاقتناء</span>
          </div>
        </div>

      </div>
    </section>
  );
};
