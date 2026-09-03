import React, { useState } from 'react';
import { DurangoTrim, NavigationPage } from '../../types';
import { DURANGO_TRIMS } from '../../data/durangoData';
import { DodgeLogo } from '../DodgeLogo';
import { 
  Check, 
  Flame, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  Car, 
  Gauge, 
  Award,
  ChevronDown
} from 'lucide-react';

interface TrimsPageProps {
  onOpenTestDriveModal: (trimId?: string) => void;
  onNavigateToConfigurator: (trimId?: string) => void;
}

export const TrimsPage: React.FC<TrimsPageProps> = ({
  onOpenTestDriveModal,
  onNavigateToConfigurator
}) => {
  const [currency, setCurrency] = useState<'SAR' | 'USD'>('SAR');
  const [filterEngine, setFilterEngine] = useState<string>('all');
  const [expandedTrimId, setExpandedTrimId] = useState<string | null>(null);

  const filteredTrims = DURANGO_TRIMS.filter(trim => {
    if (filterEngine === 'all') return true;
    if (filterEngine === '5.7') return trim.id.includes('rt');
    if (filterEngine === '6.4') return trim.id.includes('392');
    if (filterEngine === '6.2') return trim.id.includes('hellcat');
    return true;
  });

  const formatPrice = (sar: number, usd: number) => {
    if (currency === 'SAR') {
      return `${sar.toLocaleString()} ريال سعودي`;
    }
    return `$${usd.toLocaleString()} USD`;
  };

  const toggleExpand = (id: string) => {
    setExpandedTrimId(expandedTrimId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" dir="rtl">
      
      {/* Page Title & Currency Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8 text-right">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <span className="text-neutral-500 text-xs">|</span>
            <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase">
              2025 TRIMS & PRICING
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            فئات وأسعار دودج دورانجو <span className="text-red-600 font-num">2025</span> V8
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            اختر الفئة التي تناسب شغفك ومستوى الأداء الذي تتطلع إليه، من دورانجو R/T العملية حتى إصدارات هيلكات الخارقة وإصدارات Last Call التوديعية لعام 2025.
          </p>
        </div>

        {/* Currency & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Currency toggle */}
          <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setCurrency('SAR')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === 'SAR' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ريال (SAR)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              دولار (USD)
            </button>
          </div>

          {/* Engine filter pills */}
          <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setFilterEngine('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterEngine === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterEngine('5.7')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterEngine === '5.7' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              5.7L V8
            </button>
            <button
              onClick={() => setFilterEngine('6.4')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterEngine === '6.4' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              6.4L (392)
            </button>
            <button
              onClick={() => setFilterEngine('6.2')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterEngine === '6.2' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Hellcat (710 HP)
            </button>
          </div>

        </div>
      </div>

      {/* TRIMS CARDS */}
      <div className="space-y-8">
        {filteredTrims.map((trim) => {
          const isExpanded = expandedTrimId === trim.id;

          return (
            <div
              key={trim.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                trim.isSpecialEdition
                  ? 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-amber-600/50 shadow-[0_0_25px_rgba(217,119,6,0.15)]'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 shadow-xl'
              }`}
            >
              <div className="p-6 sm:p-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Image Column */}
                  <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 h-56 sm:h-64">
                    <img
                      src={trim.image}
                      alt={trim.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-neutral-950/90 border border-neutral-800 text-red-500 font-mono text-xs font-black px-3 py-1 rounded-full">
                      {trim.engineBadge}
                    </div>

                    {trim.isSpecialEdition && (
                      <div className="absolute bottom-3 left-3 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                        {trim.editionBadgeAr}
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="lg:col-span-5 space-y-3 text-right">
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                        <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                        <span className="text-xs font-mono text-neutral-400">{trim.engineNameAr}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        {trim.nameAr}
                      </h3>
                      <p className="text-xs font-mono text-neutral-400">{trim.name}</p>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {trim.taglineAr}
                    </p>

                    {/* Quick Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-800/80 text-center">
                      <div className="bg-neutral-950/60 p-2 rounded-xl">
                        <span className="text-[10px] text-neutral-500 block">القوة</span>
                        <span className="text-sm font-black text-white font-num">{trim.horsepower} حصان</span>
                      </div>
                      <div className="bg-neutral-950/60 p-2 rounded-xl">
                        <span className="text-[10px] text-neutral-500 block">العزم</span>
                        <span className="text-sm font-black text-white font-num">{trim.torque} نيوتن.م</span>
                      </div>
                      <div className="bg-neutral-950/60 p-2 rounded-xl">
                        <span className="text-[10px] text-neutral-500 block">0-100 كم/س</span>
                        <span className="text-sm font-black text-red-500 font-num">{trim.acceleration}</span>
                      </div>
                    </div>

                    {/* Highlights bullet points */}
                    <div className="space-y-1.5 text-xs text-neutral-400">
                      {trim.highlightsAr.slice(0, 3).map((hl, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Pricing & CTA Column */}
                  <div className="lg:col-span-3 flex flex-col justify-center space-y-4 text-center lg:text-left bg-neutral-950/80 p-5 rounded-2xl border border-neutral-850">
                    <div>
                      <span className="text-xs text-neutral-400 block mb-1">السعر المبدئي المقترح:</span>
                      <div className="text-2xl sm:text-3xl font-black text-white font-num">
                        {formatPrice(trim.priceSAR, trim.priceUSD)}
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-1">
                        * يشمل ضريبة القيمة المضافة ورسوم النقل المعتمدة
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => onOpenTestDriveModal(trim.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Flame className="w-4 h-4" />
                        <span>طلب تجربة قيادة (2,000 ريال)</span>
                      </button>

                      <button
                        onClick={() => onNavigateToConfigurator(trim.id)}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-red-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-red-500" />
                        <span>تخصيص الفئة واللون</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(trim.id)}
                        className="w-full text-neutral-400 hover:text-white text-xs py-1 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'إخفاء المواصفات الفنية' : 'عرض المواصفات الفنية الكاملة'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                  </div>

                </div>

                {/* EXPANDABLE DETAILED SPECS TABLE */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-neutral-800 text-right animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                      المواصفات الهندسية والميكانيكية الكاملة لفئة {trim.nameAr}:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">المحرك:</span>
                        <span className="font-bold text-white">{trim.specs.engine}</span>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">ناقل الحركة:</span>
                        <span className="font-bold text-white">{trim.specs.transmission}</span>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">نظام الدفع:</span>
                        <span className="font-bold text-white">{trim.specs.drivetrain}</span>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">العجلات والإطارات:</span>
                        <span className="font-bold text-white">{trim.specs.wheels}</span>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">نظام الفرامل:</span>
                        <span className="font-bold text-white">{trim.specs.brakes}</span>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                        <span className="text-neutral-500 block mb-1">تجهيزات المقصورة:</span>
                        <span className="font-bold text-white">{trim.specs.interior}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-850">
                      <span className="text-neutral-400 block font-bold mb-2">كافة التجهيزات القياسية:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                        {trim.highlightsAr.map((hl, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-500 font-bold">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Special Warranty and Financing note */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <div className="space-y-1">
          <h5 className="text-white font-bold text-sm">ضمان المصنع المعتمد</h5>
          <p className="text-xs text-neutral-400">ضمان 5 سنوات أو 100,000 كم على مجموعة نقل الحركة والمحرك.</p>
        </div>
        <div className="space-y-1">
          <h5 className="text-white font-bold text-sm">باقات صيانة دودج الشاملة</h5>
          <p className="text-xs text-neutral-400">صيانة دورية مجانية حتى 60,000 كم لدى شبكة مراكز الخدمة المعتمدة.</p>
        </div>
        <div className="space-y-1">
          <h5 className="text-white font-bold text-sm">حلول تمويل وتقسيط ميسرة</h5>
          <p className="text-xs text-neutral-400">برامج تمويلية مرنة بالتعاون مع كبرى البنوك وشركات التمويل المحلية.</p>
        </div>
      </div>

    </div>
  );
};
