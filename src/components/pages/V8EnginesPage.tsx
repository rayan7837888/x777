import React, { useState } from 'react';
import { V8Engine } from '../../types';
import { V8_ENGINES, DURANGO_IMAGES } from '../../data/durangoData';
import { DodgeLogo } from '../DodgeLogo';
import { ExhaustSoundPlayer } from '../ExhaustSoundPlayer';
import { 
  Zap, 
  Gauge, 
  Flame, 
  Disc, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Layers,
  ChevronLeft
} from 'lucide-react';

interface V8EnginesPageProps {
  onOpenTestDriveModal: () => void;
  onNavigateToConfigurator: () => void;
}

export const V8EnginesPage: React.FC<V8EnginesPageProps> = ({
  onOpenTestDriveModal,
  onNavigateToConfigurator
}) => {
  const [selectedEngineId, setSelectedEngineId] = useState<string>('hellcat-62');

  const activeEngine = V8_ENGINES.find(e => e.id === selectedEngineId) || V8_ENGINES[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16" dir="rtl">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 p-6 sm:p-12 text-right">
        {/* Ambient red glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <span className="text-neutral-500 text-xs">|</span>
            <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase">
              HEMI® V8 POWERTRAIN
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            محركات هيمي <span className="text-red-600 font-num">V8</span> في دورانجو 2025: هندسة القوة المفرطة
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            تمثل محركات هيمي ثمانية الأسطوانات القلب النابض لسيارة دودج دورانجو. من محرك 5.7 لتر العملي إلى محرك 392 الجبار وصولاً إلى وحش الـ 710 أحصنة 6.2L هيلكات سوبرتشارج، نقدم لك تجربة ميكانيكية لا تُضاهى.
          </p>
        </div>
      </div>

      {/* Engine Switcher Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
            <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              اختر محرك هيمي V8 لاستعراض تفاصيله
            </h2>
          </div>
          <span className="text-xs text-neutral-400">انقر على أي محرك لتحديث المقارنة والصوت الحي</span>
        </div>

        {/* Engine Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {V8_ENGINES.map((engine) => {
            const isSelected = engine.id === selectedEngineId;
            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngineId(engine.id)}
                className={`p-5 rounded-2xl border text-right transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-neutral-900 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.35)] scale-[1.02]' 
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-red-600" />
                )}

                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-neutral-900 text-neutral-500'}`}>
                    {engine.name}
                  </span>
                  <span className="text-lg font-black text-white font-num">
                    {engine.horsepower} <span className="text-xs text-neutral-400 font-normal">حصان</span>
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mt-1">
                  {engine.nameAr}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {engine.aspirationAr}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-num">
                  <span className="text-neutral-400">0-100 كم/س: <strong className="text-white">{engine.acceleration0to100}ث</strong></span>
                  <span className="text-neutral-400">العزم: <strong className="text-red-400">{engine.torque} نيوتن.م</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE ENGINE DEEP DIVE SECTION */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Engine Real Photo */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 group">
            <img
              src={DURANGO_IMAGES.engine}
              alt={activeEngine.name}
              referrerPolicy="no-referrer"
              className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 left-4 bg-neutral-950/90 border border-neutral-800 backdrop-blur-md p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono">ENGINE ARCHITECTURE</span>
                <span className="text-sm font-bold text-white">{activeEngine.displacement} • 90° V8 HEMI</span>
              </div>
              <span className="text-xs bg-red-600/20 text-red-400 border border-red-800/60 font-bold px-2.5 py-1 rounded-lg">
                صناعة أمريكية أصلية
              </span>
            </div>
          </div>

          {/* Detailed Info & Specs */}
          <div className="space-y-5 text-right">
            <div>
              <span className="text-red-500 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
                HEMI SPECIFICATIONS // 2025
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {activeEngine.nameAr}
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed mt-2">
                {activeEngine.descriptionAr}
              </p>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 block">القوة الحصانية</span>
                <span className="text-xl font-black text-red-500 font-num">{activeEngine.horsepower}</span>
                <span className="text-[10px] text-neutral-400 mr-1">HP</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 block">عزم الدوران</span>
                <span className="text-xl font-black text-white font-num">{activeEngine.torque}</span>
                <span className="text-[10px] text-neutral-400 mr-1">نيوتن.م</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 block">التسارع 0-100</span>
                <span className="text-xl font-black text-white font-num">{activeEngine.acceleration0to100}</span>
                <span className="text-[10px] text-neutral-400 mr-1">ثوانٍ</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 block">السرعة القصوى</span>
                <span className="text-xl font-black text-red-500 font-num">{activeEngine.topSpeed}</span>
                <span className="text-[10px] text-neutral-400 mr-1">كم/س</span>
              </div>
            </div>

            {/* Additional Engineering Specs */}
            <div className="bg-neutral-950/90 rounded-2xl p-4 border border-neutral-850 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-850">
                <span className="text-neutral-500">نوع التنفس والشحن:</span>
                <span className="font-bold text-neutral-200">{activeEngine.aspirationAr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-850">
                <span className="text-neutral-500">ناقل الحركة المعتمد:</span>
                <span className="font-bold text-neutral-200">{activeEngine.transmissionAr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-850">
                <span className="text-neutral-500">توقيت ربع الميل (1/4 Mile):</span>
                <span className="font-bold text-red-400 font-num">{activeEngine.quarterMileSec} ثانية</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">القدرة القصوى لسحب المقطورات:</span>
                <span className="font-bold text-white font-num">{activeEngine.towingCapacityLbs.toLocaleString()} رطل ({activeEngine.towingCapacityKg.toLocaleString()} كجم)</span>
              </div>
            </div>

            {/* Key Features bullet points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">أبرز المزايا التقنية:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                {activeEngine.featuresAr.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Live exhaust sound simulator for this specific engine */}
        <div className="pt-4 border-t border-neutral-800">
          <ExhaustSoundPlayer engineType={activeEngine.soundType} />
        </div>

      </div>

      {/* PERFORMANCE HARDWARE: BRAKES, SUSPENSION, LAUNCH CONTROL */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
          <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            عتاد الأداء الخارق: مكابح بريمبو ونظام تعليق بيلشتاين
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Disc className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">مكابح بريمبو Brembo بـ 6 مكابس</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              أقراص مكابح مهواة ومخرومة قياس 15.7 بوصة في الأمام مع ملاقط بستة مكابس مطلية باللون الأحمر أو البرونزي، تضمن توقفاً استثنائياً وثباتاً حرارياً فائقاً على الحلبات وأقسى المنعطفات.
            </p>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">تعليق بيلشتاين المتكيف Bilstein</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              مخمدات صدمات نشطة تراقب حالة الطريق وسرعة العجلات مئات المرات في الثانية لضبط قساوة التعليق حسب وضعيات القيادة (Track للحلبات، Sport للتحكم الحاد، Auto للراحة الفارهة).
            </p>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">نظام التحكم في الانطلاق Launch Control</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              نظام إلكتروني متقدم يثبت دورات المحرك عند أفضل نقطة عزم ويتحكم في انزلاق العجلات الأربع لحظة إفلات المكابح لتحقيق انطلاقة صاروخية وتسارع 0-100 في 3.5 ثانية.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            ترغب في تجربة قوة هيمي V8 على أرض الواقع؟
          </h3>
          <p className="text-neutral-400 text-sm mt-1">
            احجز موعداً لتجربة القيادة وسماع هدير المحرك في صالة عرض دودج.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTestDriveModal}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            احجز تجربة قيادة
          </button>
          <button
            onClick={onNavigateToConfigurator}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-5 py-3 rounded-xl transition-all cursor-pointer"
          >
            تخصيص سيارتك
          </button>
        </div>
      </div>

    </div>
  );
};
