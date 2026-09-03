import React, { useState } from 'react';
import { 
  DURANGO_TRIMS, 
  COLOR_OPTIONS, 
  STRIPE_OPTIONS, 
  WHEEL_OPTIONS, 
  INTERIOR_OPTIONS, 
} from '../../data/durangoData';
import { DodgeLogo } from '../DodgeLogo';
import { Car3DViewer } from '../Car3DViewer';
import { saveOrder } from '../../services/orderStorage';
import { 
  Sliders, 
  Check, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  Share2, 
  Calendar,
  Layers,
  ChevronLeft,
  Send,
  CheckCircle2,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Rotate3d,
  Ghost
} from 'lucide-react';

interface ConfiguratorPageProps {
  initialTrimId?: string;
  onOpenTestDriveModal: (trimId?: string) => void;
}

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({
  initialTrimId = 'durango-hellcat',
  onOpenTestDriveModal
}) => {
  const [selectedTrimId, setSelectedTrimId] = useState(initialTrimId);
  const [selectedColorId, setSelectedColorId] = useState('destroyer-gray');
  const [selectedStripeId, setSelectedStripeId] = useState('dual-red'); // Default to Dodge signature red stripes
  const [selectedWheelId, setSelectedWheelId] = useState('lights-out');
  const [selectedInteriorId, setSelectedInteriorId] = useState('demonic-red');
  const [copiedLink, setCopiedLink] = useState(false);

  // Send to staff modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCity, setCustCity] = useState('الرياض');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState('');

  const currentTrim = DURANGO_TRIMS.find(t => t.id === selectedTrimId) || DURANGO_TRIMS[3];
  const currentColor = COLOR_OPTIONS.find(c => c.id === selectedColorId) || COLOR_OPTIONS[0];
  const currentStripe = STRIPE_OPTIONS.find(s => s.id === selectedStripeId) || STRIPE_OPTIONS[0];
  const currentWheel = WHEEL_OPTIONS.find(w => w.id === selectedWheelId) || WHEEL_OPTIONS[0];
  const currentInterior = INTERIOR_OPTIONS.find(i => i.id === selectedInteriorId) || INTERIOR_OPTIONS[0];

  // Calculate total price
  const totalPriceSAR = currentTrim.priceSAR + currentWheel.priceSAR;
  const totalPriceUSD = Math.round(totalPriceSAR / 3.75);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReset = () => {
    setSelectedTrimId('durango-hellcat');
    setSelectedColorId('destroyer-gray');
    setSelectedStripeId('dual-red');
    setSelectedWheelId('lights-out');
    setSelectedInteriorId('demonic-red');
  };

  const handleSendToStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    const code = 'DODGE-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedOrderCode(code);

    // Save directly to the Employee System
    saveOrder({
      code,
      type: 'custom_order',
      customerName: custName,
      phone: custPhone,
      email: custEmail || undefined,
      city: custCity,
      trimId: currentTrim.id,
      trimNameAr: currentTrim.nameAr,
      colorId: currentColor.id,
      colorNameAr: currentColor.nameAr,
      colorHex: currentColor.hex,
      stripeId: currentStripe.id,
      stripeNameAr: currentStripe.nameAr,
      hasDodgeRedStripes: currentStripe.id === 'dual-red',
      wheelId: currentWheel.id,
      wheelNameAr: currentWheel.nameAr,
      interiorId: currentInterior.id,
      interiorNameAr: currentInterior.nameAr,
      totalPriceSAR,
      staffNotes: `طلب تخصيص وشراء دورانجو ${currentTrim.nameAr} بلون ${currentColor.nameAr} وخطوط ${currentStripe.nameAr}. السعر: ${totalPriceSAR.toLocaleString()} ريال.`
    });

    setIsOrderSuccess(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setIsOrderSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" dir="rtl">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-8 text-right">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <span className="text-neutral-500 text-xs">|</span>
            <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1">
              <Rotate3d className="w-3.5 h-3.5" />
              DURANGO 3D REAL-TIME STUDIO // 2025
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            استوديو تخصيص وتلوين دورانجو <span className="text-red-600 font-num">2025</span> V8 بتقنية 3D
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            صمم وحش العضلات ثلاثي الأبعاد بزاوية 360° كاملة. غيّر اللون الخارجي، خطين دوج الحمر الأيقونيين، العجلات والمقصورة، ثم أرسل طلبك مباشرة إلى لوحة موظفي المبيعات للمتابعة الفورية.
          </p>
        </div>

        {/* Share and reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-red-500" />
            <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة التكوين'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="إعادة تعيين إلى الإعدادات الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN CONFIGURATOR INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / TOP: LIVE 3D CAR VISUALIZER STAGE (7 Columns) */}
        <div className="lg:col-span-7 space-y-4 sticky top-24">
          
          {/* Interactive 3D Car Viewer Component */}
          <Car3DViewer
            currentColorHex={currentColor.hex}
            currentColorName={currentColor.nameAr}
            currentColorTint={currentColor.carTint}
            stripeColor={currentStripe.color}
            hasStripes={currentStripe.id !== 'no-stripes'}
            isDodgeSignatureStripe={Boolean(currentStripe.isDodgeSignature)}
            trimName={currentTrim.nameAr}
            engineBadge={currentTrim.engineBadge}
            wheelName={currentWheel.nameAr}
          />

          {/* Quick Engine Specs of Chosen Trim */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-neutral-500 block text-[10px]">المحرك</span>
              <span className="font-bold text-white">{currentTrim.engineBadge}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">القوة</span>
              <span className="font-black text-red-500 font-num">{currentTrim.horsepower} حصان</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">العزم</span>
              <span className="font-black text-white font-num">{currentTrim.torque} نيوتن.م</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">التسارع</span>
              <span className="font-black text-white font-num">{currentTrim.acceleration}</span>
            </div>
          </div>

        </div>

        {/* RIGHT: CONTROLS & SELECTIONS (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 text-right">
          
          {/* STEP 1: CHOOSE TRIM */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                1. اختر فئة دورانجو 2025:
              </h3>
              <span className="text-xs text-red-400 font-mono font-bold">{currentTrim.horsepower} HP</span>
            </div>

            <div className="space-y-2">
              {DURANGO_TRIMS.map((trim) => {
                const isSelected = trim.id === selectedTrimId;
                return (
                  <button
                    key={trim.id}
                    onClick={() => setSelectedTrimId(trim.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/30 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div>
                      <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                        {trim.nameAr}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">{trim.engineBadge}</span>
                    </div>

                    <div className="text-left">
                      <span className="text-sm font-black text-white font-num block">
                        {trim.priceSAR.toLocaleString()} ريال
                      </span>
                      {isSelected && <span className="text-[10px] text-red-500 font-bold">محدد ✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: EXTERIOR COLOR (3D COLOR CHANGE) */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                2. تغيير لون السيارة 3D (تأثير فوري على المجسم):
              </h3>
              <span className="text-xs text-neutral-400 font-bold">{currentColor.nameAr}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = c.id === selectedColorId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColorId(c.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-950 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-102'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span 
                      className="w-8 h-8 rounded-full border-2 border-white/20 block shadow-lg transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[11px] font-bold text-neutral-300 line-clamp-1">
                      {c.nameEn}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      {c.finishAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: RACING STRIPES (HIGHLIGHTING DODGE RED STRIPES) */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                3. خطوط السباق الرياضية (شعار دودج: خطين حمر):
              </h3>
            </div>

            <div className="space-y-2">
              {STRIPE_OPTIONS.map((s) => {
                const isSelected = s.id === selectedStripeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStripeId(s.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {s.id !== 'no-stripes' ? (
                        <span className="inline-flex gap-1 transform -skew-x-[24deg]">
                          <span className="w-2.5 h-5 rounded-[1px] block shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ backgroundColor: s.color }} />
                          <span className="w-2.5 h-5 rounded-[1px] block shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ backgroundColor: s.color }} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500">Ø</span>
                      )}
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                          {s.nameAr}
                        </span>
                        {s.isDodgeSignature && (
                          <span className="text-[10px] text-red-500 font-bold block">
                            ★ خيار دودج الكلاسيكي الموصى به
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: WHEELS */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                4. تصميم العجلات والألمنيوم:
              </h3>
            </div>

            <div className="space-y-2">
              {WHEEL_OPTIONS.map((w) => {
                const isSelected = w.id === selectedWheelId;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWheelId(w.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div>
                      <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                        {w.nameAr}
                      </span>
                      <span className="text-[11px] text-neutral-500">{w.finish}</span>
                    </div>

                    <div className="text-left text-xs font-num">
                      {w.priceSAR > 0 ? (
                        <span className="text-neutral-300">+{w.priceSAR.toLocaleString()} ريال</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">قياسي</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: INTERIOR LEATHER */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                5. تنجيد المقصورة والجلد:
              </h3>
            </div>

            <div className="space-y-2">
              {INTERIOR_OPTIONS.map((i) => {
                const isSelected = i.id === selectedInteriorId;
                return (
                  <button
                    key={i.id}
                    onClick={() => setSelectedInteriorId(i.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-5 h-5 rounded-full border border-neutral-700 shrink-0" 
                        style={{ backgroundColor: i.accentHex }}
                      />
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                          {i.nameAr}
                        </span>
                        <span className="text-[10px] text-neutral-500">{i.materialAr}</span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUMMARY & ORDER ACTION CARD */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-baseline border-b border-neutral-850 pb-3">
              <span className="text-sm text-neutral-400">إجمالي السعر التقديري:</span>
              <div className="text-right">
                <div className="text-2xl font-black text-white font-num">
                  {totalPriceSAR.toLocaleString()} ريال
                </div>
                <div className="text-xs text-neutral-500 font-num">
                  ≈ ${totalPriceUSD.toLocaleString()} USD
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-400 space-y-1 bg-neutral-900/60 p-3 rounded-xl border border-neutral-850">
              <p>• {currentTrim.nameAr} ({currentTrim.engineBadge})</p>
              <p>• طلاء 3D: {currentColor.nameAr}</p>
              <p>• {currentStripe.nameAr}</p>
              <p>• {currentInterior.nameAr}</p>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Button 1: Send directly to staff for order/reservation */}
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3.5 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال طلب الشراء والتخصيص للموظفين</span>
              </button>

              {/* Button 2: Test drive */}
              <button
                onClick={() => onOpenTestDriveModal(currentTrim.id)}
                className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span>احجز تجربة قيادة بهذا التكوين</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* SEND BUILD ORDER TO STAFF MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-red-700/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-right overflow-hidden">
            
            {/* Top red accent */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900" />

            <button
              onClick={closeOrderModal}
              className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isOrderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-950/60 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                    تم تحويل طلبك مباشرة إلى لوحة الموظفين
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    شكراً لك يا {custName || 'عاشق دورانجو'}!
                  </h3>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300 space-y-2 max-w-sm mx-auto text-right">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">رقم الطلب المرجعي:</span>
                    <span className="font-mono font-bold text-red-400">{generatedOrderCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">الفئة المختارة:</span>
                    <span className="font-bold text-white">{currentTrim.nameAr}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">اللون والخطين:</span>
                    <span className="font-bold text-white">{currentColor.nameAr} + {currentStripe.nameAr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">السعر التقديري:</span>
                    <span className="font-bold text-red-500 font-num">{totalPriceSAR.toLocaleString()} ريال</span>
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-300 max-w-sm mx-auto flex items-center gap-2 text-right">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>وصل الطلب إلى مكتب المبيعات، وسيتصل بك أحد موظفي دودج لمتابعة الاعتماد وتسليم السيارة.</span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 max-w-sm mx-auto space-y-1 text-right">
                  <span className="text-[10px] text-neutral-400 font-bold block">قنوات التواصل الفوري لمتابعة التخصيص:</span>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <a href="tel:0540773208" className="text-white font-mono font-bold flex items-center gap-1 hover:text-red-400">
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>0540773208</span>
                    </a>
                    <a href="mailto:meliods7777x@gmail.com" className="text-neutral-300 font-mono text-[10px] hover:text-white">
                      meliods7777x@gmail.com
                    </a>
                    <a href="https://www.snapchat.com/add/o.oorayan" target="_blank" rel="noreferrer" className="text-yellow-400 font-mono font-bold flex items-center gap-1">
                      <Ghost className="w-3.5 h-3.5" />
                      <span>o.oorayan</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={closeOrderModal}
                  className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                >
                  إغلاق ومتابعة التصفح
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    إرسال طلب تخصيص دورانجو 2025 V8 إلى الموظفين
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    أدخل بياناتك وسيتم تحويل طلب هذا التكوين مباشرة إلى لوحة تحكم الموظفين لمراجعته والتواصل معك.
                  </p>
                </div>

                <form onSubmit={handleSendToStaff} className="space-y-3.5 text-xs">
                  
                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">الاسم الكامل:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="مثال: فهد عبد الله"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">رقم الجوال:</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">البريد الإلكتروني (اختياري):</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">المدينة / المعرض المفضل:</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={custCity}
                        onChange={(e) => setCustCity(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                      >
                        <option value="الرياض">الرياض - خريص</option>
                        <option value="جدة">جدة - طريق المدينة</option>
                        <option value="الدمام / الخبر">الدمام / الخبر</option>
                        <option value="دبي">دبي</option>
                        <option value="أبوظبي">أبوظبي</option>
                        <option value="الكويت">الكويت</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-1 text-neutral-400">
                    <div className="flex justify-between text-white font-bold">
                      <span>الفئة والتكوين:</span>
                      <span>{currentTrim.nameAr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>اللون والخطين:</span>
                      <span>{currentColor.nameAr} + {currentStripe.nameAr}</span>
                    </div>
                    <div className="flex justify-between text-red-500 font-black font-num">
                      <span>السعر التقديري:</span>
                      <span>{totalPriceSAR.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeOrderModal}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال الطلب للموظفين الآن</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
