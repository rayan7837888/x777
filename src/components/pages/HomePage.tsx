import React from 'react';
import { NavigationPage } from '../../types';
import { DURANGO_IMAGES, V8_ENGINES, DURANGO_TRIMS } from '../../data/durangoData';
import { DodgeLogo } from '../DodgeLogo';
import { ExhaustSoundPlayer } from '../ExhaustSoundPlayer';
import { DodgePoemSection } from '../DodgePoemSection';
import { 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Flame, 
  Award, 
  ChevronLeft, 
  ArrowLeft,
  Sliders, 
  Maximize2,
  Volume2,
  Phone,
  Mail,
  Ghost
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenTestDriveModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenTestDriveModal
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section 
        id="durango-hero-section" 
        className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden pt-4"
      >
        {/* Background Image with Dark Vignette and Red Gradient Highlights */}
        <div className="absolute inset-0 z-0">
          <img
            src={DURANGO_IMAGES.hero}
            alt="Dodge Durango 2025 SRT Hellcat V8"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
          {/* Dodge brand red glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          
          <div className="max-w-3xl space-y-6">
            
            {/* Dodge logo badge with the word دوج and two red stripes */}
            <div className="inline-flex items-center gap-3 bg-neutral-950/80 border border-neutral-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
              <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
              <span className="text-neutral-500 text-xs">|</span>
              <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase">
                MODEL YEAR 2025 // V8
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15]">
                دودج دورانجو <span className="text-red-600 font-num">2025</span>
                <span className="block text-2xl sm:text-4xl lg:text-5xl text-neutral-200 font-extrabold mt-2">
                  وحش العضلات الأمريكية بمحركات <span className="text-red-500 font-num">V8 HEMI®</span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed pt-2">
                السيارة الرياضية متعددة الاستخدامات الوحيدة ذات الـ 7 مقاعد التي تجمع بين إثارة سيارات العضلات الأسطورية وقوة تصل إلى <strong className="text-white">710 أحصنة</strong> مع صوت هيمي هادر وقدرة سحب تصل إلى <strong className="text-white">8,700 رطل</strong>.
              </p>
            </div>

            {/* Key Quick Performance Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl">
                <span className="text-[11px] text-neutral-400 block font-bold">القوة القصوى</span>
                <span className="text-2xl sm:text-3xl font-black text-red-500 font-num">710</span>
                <span className="text-xs text-neutral-400 mr-1">حصان (HP)</span>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl">
                <span className="text-[11px] text-neutral-400 block font-bold">التسارع 0-100</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-num">3.5</span>
                <span className="text-xs text-neutral-400 mr-1">ثوانٍ</span>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl">
                <span className="text-[11px] text-neutral-400 block font-bold">عزم الدوران</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-num">875</span>
                <span className="text-xs text-neutral-400 mr-1">نيوتن.متر</span>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl">
                <span className="text-[11px] text-neutral-400 block font-bold">قدرة القطر</span>
                <span className="text-2xl sm:text-3xl font-black text-red-500 font-num">8,700</span>
                <span className="text-xs text-neutral-400 mr-1">رطل قياسي</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenTestDriveModal}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-5 h-5 text-white animate-pulse" />
                <span>احجز تجربة قيادة دورانجو 2025 (2,000 ريال)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('configurator')}
                className="bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-red-500 font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <Sliders className="w-5 h-5 text-red-500" />
                <span>تخصيص سيارتك 3D واللون</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('engines')}
                className="text-neutral-300 hover:text-red-400 font-bold text-sm px-4 py-2 flex items-center gap-1 transition-colors"
              >
                <span>مواصفات محركات هيمي V8</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* INTERACTIVE EXHAUST SOUND EXPERIENCE BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <ExhaustSoundPlayer engineType="hellcat62" />
      </section>

      {/* DODGE LOGO & BRAND IDENTITY STRIPES HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          {/* Big Dodge watermark in background */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-9xl font-black font-dodge">
            DODGE //
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-xl text-right">
              
              {/* Badge with Arabic "دوج" and the two signature red lines */}
              <div className="flex items-center gap-2">
                <DodgeLogo size="md" showArabic={true} showEnglish={true} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                شعار العضلات الأمريكية: خطّان أحمران لا يعرفان التراجع
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                يمثل خطّا شعار دودج الأحمران التوأم (Dodge Twin Red Stripes) شغف حلبات السباق والجرأة الأمريكية الأصيلة. في دودج دورانجو 2025، يتجسد هذا الحمض النووي في أداء عالي وهيكل عريض ونغمة عادم تهز الأبدان.
              </p>
            </div>

            {/* Brand Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/40 text-red-500 border border-red-900/40">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">3 خيارات لمحركات V8</h4>
                  <p className="text-neutral-400 text-xs mt-1">من 5.7 لتر حتى 6.2 لتر هيلكات سوبرتشارج</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/40 text-red-500 border border-red-900/40">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">أداء حلبات SRT</h4>
                  <p className="text-neutral-400 text-xs mt-1">مكابح بريمبو 6 مكابس ونظام تحكم بالانطلاق</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/40 text-red-500 border border-red-900/40">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">قدرة سحب 8,700 رطل</h4>
                  <p className="text-neutral-400 text-xs mt-1">الأفضل والأقوى بلا منازع بين سيارات الـ SUV</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/40 text-red-500 border border-red-900/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">3 صفوف و7 مقاعد</h4>
                  <p className="text-neutral-400 text-xs mt-1">فخامة جلد لاجونا أحمر وسعة رحبة لجميع العائلة</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2025 V8 TRIMS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
              <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
              <span className="text-red-500 text-xs font-bold uppercase tracking-wider font-dodge">LINEUP 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              فئات دودج دورانجو 2025 بمحركات هيمي V8
            </h2>
          </div>
          <button
            onClick={() => onNavigate('trims')}
            className="text-red-500 hover:text-red-400 font-bold text-sm flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>عرض ومقارنة جميع الفئات والأسعار</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Trims Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DURANGO_TRIMS.slice(0, 3).map((trim) => (
            <div
              key={trim.id}
              className="bg-neutral-900/90 border border-neutral-800 hover:border-red-600/70 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Trim Image */}
                <div className="relative h-56 overflow-hidden bg-neutral-950">
                  <img
                    src={trim.image}
                    alt={trim.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-neutral-950/90 border border-neutral-800 text-red-500 font-mono text-xs font-black px-3 py-1 rounded-full backdrop-blur-md">
                    {trim.engineBadge}
                  </div>
                </div>

                {/* Trim Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">
                      {trim.nameAr}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{trim.name}</p>
                    <p className="text-sm text-neutral-300 mt-2 line-clamp-2">{trim.taglineAr}</p>
                  </div>

                  {/* Quick specs grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-800 text-center">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">القوة</span>
                      <span className="text-base font-black text-white font-num">{trim.horsepower}</span>
                      <span className="text-[10px] text-neutral-400 block">حصان</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">العزم</span>
                      <span className="text-base font-black text-white font-num">{trim.torque}</span>
                      <span className="text-[10px] text-neutral-400 block">نيوتن.م</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">0 - 100</span>
                      <span className="text-base font-black text-red-500 font-num">{trim.acceleration}</span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    {trim.highlightsAr.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 border-t border-neutral-850 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[11px] text-neutral-500 block">يبدأ السعر التقديري من:</span>
                  <span className="text-lg font-black text-white font-num">
                    {trim.priceSAR.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">ريال</span>
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('configurator')}
                  className="bg-neutral-800 hover:bg-red-600 text-white p-3 rounded-xl transition-all cursor-pointer"
                  title="تخصيص هذه الفئة"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Special 2025 Last Call Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-red-950/40 to-neutral-900 border border-red-900/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              إصدارات توديعية حصرية LAST CALL 2025
            </span>
            <h3 className="text-2xl font-black text-white">
              وداعية محركات V8 الأسطورية: إصدارات دورانجو الخاصة 2025
            </h3>
            <p className="text-neutral-300 text-sm max-w-2xl">
              تحتفل دودج بآخر عام لمحركات هيمي V8 الخارقة مع إصدارات محدودة مذهلة مثل Hammerhead و Silver Bullet و Brass Monkey مع طلاءات حصرية وتطعيمات تيتانيوم مرقمة.
            </p>
          </div>

          <button
            onClick={() => onNavigate('trims')}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>استكشف الإصدارات التوديعية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* DESIGN & INTERIOR SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src={DURANGO_IMAGES.interior}
              alt="Dodge Durango 2025 Interior Cockpit"
              referrerPolicy="no-referrer"
              className="w-full h-[400px] sm:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 left-6 text-right">
              <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase block">
                مقصورة القيادة SRT //
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                جلد لاجونا ديمونيك ريد مع ألياف الكربون
              </h4>
            </div>
          </div>

          <div className="space-y-6 text-right">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
                <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider font-dodge">INTERIOR & TECH</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-snug">
                قمرة قيادة رياضية متمحورة حول السائق مع رحابة لـ 7 ركاب
              </h2>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              تجمع مقصورة دودج دورانجو 2025 بين الأناقة الفارهة وروح سيارات السباق. يتميز الكونسول الأوسط بميله نحو السائق بنسبة 7 درجات لتوفير تحكم كامل، مع شاشة Uconnect 5 اللمسية قياس 10.1 بوصة ونظام صوتي هارمن كاردون يضم 19 مكبراً للصوت بقوة 825 واط.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <h5 className="text-white font-bold text-sm mb-1">صفحات أداء SRT Performance Pages</h5>
                <p className="text-neutral-400 text-xs">شاشات تفاعلية فورية لقياس قوة التسارع G-Force وأوقات ربع الميل ومؤشرات المحرك الحية.</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <h5 className="text-white font-bold text-sm mb-1">3 صفوف ومقاعد مرنة كلياً</h5>
                <p className="text-neutral-400 text-xs">أكثر من 50 تركيبة مختلفة لطي المقاعد وتوفير مساحة تحميل تتجاوز 2,400 لتر للأمتعة.</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('gallery')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>مشاهدة المعرض الكامل للصور</span>
              <ChevronLeft className="w-4 h-4 text-red-500" />
            </button>

          </div>

        </div>
      </section>

      {/* DODGE POEM & ANTHEM SECTION (شعر وقصيدة دودج بالخطين الحمر) */}
      <DodgePoemSection onOpenTestDrive={onOpenTestDriveModal} />

      {/* DIRECT CONTACT CHANNELS (قنوات التواصل المباشر) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="text-right space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
                <span className="text-neutral-600">|</span>
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                  VIP CONCIERGE SERVICE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                تواصل مباشرة مع استشاري ومبيعات دودج دورانجو
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                هل تبحث عن تسعيرة فئة معينة، تجربة تسارع هيمي، أو استفسار حول المواصفات والتمويل؟ تواصل معنا فوراً عبر الهاتف أو البريد أو سناب شات:
              </p>
            </div>

            {/* The 3 Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              
              {/* Phone Card */}
              <a
                href="tel:0540773208"
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-all text-right group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all mb-2.5">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-400 block font-bold">رقم التواصل / واتساب</span>
                <span className="text-base font-black text-white font-mono dir-ltr block mt-0.5">0540773208</span>
                <span className="text-[10px] text-emerald-400 block mt-1">متاح للاتصال المباشر ↗</span>
              </a>

              {/* Email Card */}
              <a
                href="mailto:meliods7777x@gmail.com"
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-all text-right group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:bg-red-600 group-hover:text-white transition-all mb-2.5">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-400 block font-bold">بريد التواصل</span>
                <span className="text-xs font-bold text-white font-mono truncate block mt-0.5" title="meliods7777x@gmail.com">
                  meliods7777x@gmail.com
                </span>
                <span className="text-[10px] text-red-400 block mt-1">رد سريع خلال ساعات ↗</span>
              </a>

              {/* Snapchat Card */}
              <a
                href="https://www.snapchat.com/add/o.oorayan"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-yellow-500/60 transition-all text-right group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-all mb-2.5">
                  <Ghost className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-400 block font-bold">سناب التواصل</span>
                <span className="text-sm font-black text-yellow-400 font-mono block mt-0.5">o.oorayan</span>
                <span className="text-[10px] text-yellow-400/80 block mt-1">إضافة على سناب شات ↗</span>
              </a>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
