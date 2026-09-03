import React, { useState } from 'react';
import { X, CheckCircle2, Flame, Calendar, Clock, MapPin, User, Phone, Mail, Car, ShieldCheck, Ghost, Plus, Check, Sparkles, AlertCircle } from 'lucide-react';
import { DodgeLogo } from './DodgeLogo';
import { saveOrder } from '../services/orderStorage';
import { DURANGO_TRIMS, TEST_DRIVE_BASE_PRICE_SAR, TEST_DRIVE_ADDONS } from '../data/durangoData';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrimId?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  defaultTrimId = 'durango-hellcat'
}) => {
  const [selectedTrim, setSelectedTrim] = useState(defaultTrimId);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('الرياض');
  const [date, setDate] = useState('2025-10-15');
  const [timeSlot, setTimeSlot] = useState('المساء (4:00 - 7:00 م)');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  if (!isOpen) return null;

  // Pricing calculations: Base 2,000 SAR + addons in hundreds
  const basePriceSAR = TEST_DRIVE_BASE_PRICE_SAR; // 2,000 SAR
  const addonsTotalSAR = selectedAddons.reduce((sum, addonId) => {
    const addon = TEST_DRIVE_ADDONS.find(a => a.id === addonId);
    return sum + (addon ? addon.priceSAR : 0);
  }, 0);
  const totalPriceSAR = basePriceSAR + addonsTotalSAR;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId) 
        : [...prev, addonId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'DODGE-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(code);

    const foundTrim = DURANGO_TRIMS.find(t => t.id === selectedTrim) || DURANGO_TRIMS[3];
    const chosenAddons = selectedAddons.map(id => TEST_DRIVE_ADDONS.find(a => a.id === id)).filter(Boolean);

    // Persist to central staff orders system
    saveOrder({
      code,
      type: 'test_drive',
      customerName: fullName,
      phone: phone,
      email: email || undefined,
      city: city,
      trimId: selectedTrim,
      trimNameAr: foundTrim.nameAr,
      totalPriceSAR: totalPriceSAR,
      testDriveBasePriceSAR: basePriceSAR,
      testDriveAddonsTotalSAR: addonsTotalSAR,
      testDriveAddons: chosenAddons.map(a => a!.nameAr),
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      colorNameAr: 'رمادي المدمرة',
      colorHex: '#52565E',
      hasDodgeRedStripes: true,
      staffNotes: `طلب تجربة قيادة فئة ${foundTrim.nameAr} في فرع ${city}. السعر الأساسي: 2,000 ريال. الإضافات المختارة: ${chosenAddons.length > 0 ? chosenAddons.map(a => `${a!.nameAr} (+${a!.priceSAR} ريال)`).join('، ') : 'بدون إضافات'}. الإجمالي: ${totalPriceSAR.toLocaleString()} ريال.`
    });

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedAddons([]);
    onClose();
  };

  const cities = ['الرياض', 'جدة', 'الدمام / الخبر', 'دبي', 'أبوظبي', 'الكويت', 'الدوحة', 'مسقط', 'المنامة'];

  return (
    <div 
      id="test-drive-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      dir="rtl"
    >
      <div 
        id="test-drive-modal-card"
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl my-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Top Dodge Red Stripe Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-red-950/60 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              <CheckCircle2 className="w-8 h-8 text-red-500" />
            </div>

            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">
                تأكيد حجز تجربة قيادة دورانجو 2025 V8
              </span>
              <h3 className="text-2xl font-black text-white">
                تم استلام طلبك بنجاح يا {fullName || 'عاشق دورانجو'}!
              </h3>
            </div>

            {/* Price & Summary Breakdown */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 text-sm text-neutral-300 space-y-3 max-w-lg mx-auto text-right">
              <div className="flex justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">رقم الحجز المرجعي:</span>
                <span className="font-mono font-bold text-red-400">{bookingCode}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">المدينة والمعرض:</span>
                <span className="font-bold text-white">{city}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">الموعد المحدد:</span>
                <span className="font-bold text-white">{date} ({timeSlot})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">فئة السيارة المطلوبة:</span>
                <span className="font-bold text-red-500">
                  {selectedTrim === 'durango-hellcat' ? 'دورانجو هيلكات 710 حصان' : selectedTrim === 'durango-srt-392' ? 'دورانجو SRT 392' : 'دورانجو R/T 5.7L'}
                </span>
              </div>

              {/* Price Details */}
              <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800 space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>سعر تجربة القيادة الأساسي:</span>
                  <span className="font-bold text-white font-num">2,000 ريال</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>إجمالي الإضافات المختارة ({selectedAddons.length}):</span>
                    <span className="font-bold font-num">+{addonsTotalSAR} ريال</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                  <span className="text-red-400">المبلغ الإجمالي المستحق:</span>
                  <span className="text-red-500 font-num text-base">{totalPriceSAR.toLocaleString()} ريال فقط</span>
                </div>
              </div>

              {/* Selected Add-ons List if any */}
              {selectedAddons.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] text-neutral-400 font-bold block mb-1.5">الإضافات المشمولة في تجربتك:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAddons.map(addonId => {
                      const item = TEST_DRIVE_ADDONS.find(a => a.id === addonId);
                      if (!item) return null;
                      return (
                        <span key={addonId} className="text-[11px] bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-neutral-200">
                          ✓ {item.nameAr} <strong className="text-red-400 font-num">(+{item.priceSAR} ريال)</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3 text-xs text-neutral-300 max-w-lg mx-auto flex items-center gap-2.5 text-right">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>تم التوجيه الفوري:</strong> تم إرسال طلبك مباشرة إلى لوحة تحكم موظفي مبيعات دودج دورانجو للمراجعة والقبول وتأكيد الموعد.
              </span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300 max-w-lg mx-auto space-y-2 text-right">
              <span className="text-neutral-400 font-bold block mb-1">قنوات التواصل المباشر مع استشاري المعرض:</span>
              <div className="flex flex-wrap items-center gap-3">
                <a href="tel:0540773208" className="flex items-center gap-1.5 text-white font-mono font-bold hover:text-red-400">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>0540773208</span>
                </a>
                <a href="mailto:meliods7777x@gmail.com" className="flex items-center gap-1.5 text-neutral-300 font-mono text-[11px] hover:text-white">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>meliods7777x@gmail.com</span>
                </a>
                <a href="https://www.snapchat.com/add/o.oorayan" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-yellow-400 font-mono font-bold">
                  <Ghost className="w-3.5 h-3.5 text-yellow-400" />
                  <span>o.oorayan</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-neutral-400 max-w-lg mx-auto">
              سيتواصل معك مستشار مبيعات وتجارب أداء دودج خلال ساعتين لتأكيد الاستلام وتجهيز مفتاح السيارة مع هدير محرك هيمي V8 في انتظارك!
            </p>

            <button
              onClick={handleReset}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              تم، العودة إلى الموقع
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                احجز تجربة قيادة دودج دورانجو 2025 V8
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                عش تجربة قوة هيمي الجبارة وصوت العادم الرياضي على أرض الواقع لدى أقرب صالة عرض أو حلبة معتمدة.
              </p>
            </div>

            {/* Official Pricing Notice Banner: 2000 SAR Base + Extra Hundreds Add-ons */}
            <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/50 via-neutral-900 to-neutral-950 border border-red-800/60 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider">
                    DODGE VIP TEST DRIVE EXPERIENCE
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  سعر تجربة القيادة الأساسي: <span className="text-red-500 font-black text-base sm:text-lg font-num">2,000 ريال فقط</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  يمكنك إضافة ميزات وحزم خاصة لتجربتك أدناه (زيادة مئات الريالات حسب اختيارك).
                </p>
              </div>

              <div className="shrink-0 bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl text-center">
                <span className="text-[10px] text-neutral-500 block">السعر الأساسي</span>
                <span className="text-sm font-black text-white font-mono">2,000 SAR</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Select Trim */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  1. اختر فئة دورانجو 2025 للتجربة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrim('durango-rt')}
                    className={`p-2.5 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                      selectedTrim === 'durango-rt'
                        ? 'bg-red-950/40 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold block text-white">Durango R/T</span>
                    <span className="text-[10px] text-neutral-500">5.7L V8 (360 HP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTrim('durango-srt-392')}
                    className={`p-2.5 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                      selectedTrim === 'durango-srt-392'
                        ? 'bg-red-950/40 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold block text-white">SRT 392</span>
                    <span className="text-[10px] text-neutral-500">6.4L V8 (475 HP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTrim('durango-hellcat')}
                    className={`p-2.5 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                      selectedTrim === 'durango-hellcat'
                        ? 'bg-red-950/40 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold block text-white">SRT Hellcat</span>
                    <span className="text-[10px] text-red-400 font-mono">6.2L (710 HP)</span>
                  </button>
                </div>
              </div>

              {/* Personal info fields */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  2. بيانات الحاجز:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">الاسم الكامل:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="مثال: سلطان القحطاني"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">رقم الجوال:</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="05XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* City and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">المدينة / المعرض:</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-neutral-900">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">الفترة المفضلة:</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                    >
                      <option value="الصباح (9:00 - 12:00 ص)">الصباح (9:00 - 12:00 ص)</option>
                      <option value="بعد الظهر (1:00 - 4:00 م)">بعد الظهر (1:00 - 4:00 م)</option>
                      <option value="المساء (4:00 - 7:00 م)">المساء (4:00 - 7:00 م)</option>
                      <option value="المساء المتأخر (7:00 - 10:00 م)">المساء المتأخر (7:00 - 10:00 م)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ================================================================ */}
              {/* TEST DRIVE ADD-ONS (الإضافات مع زيادة مئات)                      */}
              {/* ================================================================ */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <label className="text-xs font-bold text-white">
                      3. إضافات تجربة القيادة المميزة (زيادة مئات):
                    </label>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {selectedAddons.length > 0 ? `تم اختيار (${selectedAddons.length}) إضافات` : 'اختيارية'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEST_DRIVE_ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                          isSelected
                            ? 'bg-neutral-900 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                            : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'border-neutral-700 bg-neutral-900 text-transparent'
                            }`}>
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block leading-tight">
                                {addon.nameAr}
                              </span>
                              <span className="text-[10px] text-neutral-400 block mt-1 leading-relaxed">
                                {addon.descriptionAr}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price Tag (Extra Hundreds) */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-850/60 mt-1">
                          <span className="text-[10px] text-neutral-500">{addon.categoryAr}</span>
                          <span className={`text-xs font-black font-num px-2 py-0.5 rounded-md ${
                            isSelected 
                              ? 'bg-red-600 text-white' 
                              : 'bg-neutral-900 text-red-400 border border-neutral-800'
                          }`}>
                            +{addon.priceSAR} ريال
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================================================================ */}
              {/* LIVE PRICE SUMMARY (تفاصيل السعر التلقائي)                       */}
              {/* ================================================================ */}
              <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <span>سعر تجربة القيادة الأساسي:</span>
                  <span className="font-bold text-white font-num">2,000 ريال فقط</span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>إجمالي الإضافات المختارة:</span>
                  <span className={`font-bold font-num ${addonsTotalSAR > 0 ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    {addonsTotalSAR > 0 ? `+${addonsTotalSAR} ريال (${selectedAddons.length} إضافات)` : '0 ريال (بدون إضافات)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-white">
                  <div>
                    <span className="text-xs font-bold block">إجمالي سعر التجربة:</span>
                    <span className="text-[10px] text-neutral-400 block">شامل التجربة والوقود والتجهيز</span>
                  </div>
                  <div className="text-left">
                    <span className="text-xl sm:text-2xl font-black text-red-500 font-num">
                      {totalPriceSAR.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400 mr-1 font-bold">ريال سعودي</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-5 h-5" />
                  <span>تأكيد حجز تجربة دورانجو V8 — ({totalPriceSAR.toLocaleString()} ريال)</span>
                </button>
              </div>

              {/* Direct Support Contacts */}
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-bold">أو تواصل فورياً:</span>
                <div className="flex items-center gap-3">
                  <a href="tel:0540773208" className="text-white font-mono font-bold flex items-center gap-1 hover:text-red-400">
                    <Phone className="w-3 h-3 text-red-500" />
                    <span>0540773208</span>
                  </a>
                  <a href="https://www.snapchat.com/add/o.oorayan" target="_blank" rel="noreferrer" className="text-yellow-400 font-mono font-bold flex items-center gap-1">
                    <Ghost className="w-3 h-3" />
                    <span>o.oorayan</span>
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 text-center">
                * تطبق الشروط والأحكام. يشترط وجود رخصة قيادة سارية المفعول وقت التجربة.
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

