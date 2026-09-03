import React from 'react';
import { NavigationPage } from '../types';
import { DodgeLogo } from './DodgeLogo';
import { Shield, Phone, Mail, Award, CheckCircle2, ChevronLeft, MessageSquare, Send, ExternalLink, Ghost } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenTestDriveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTestDriveModal }) => {
  return (
    <footer id="dodge-official-footer" className="bg-neutral-950 border-t border-neutral-850 text-neutral-400 pt-16 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Info Banner: Phone, Email, Snapchat */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider font-mono">DODGE OFFICIAL DIRECT CONTACT</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                قنوات التواصل المباشر مع استشاري دودج دورانجو
              </h4>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                لأي استفسار، حجز سيارة، طلب تسعيرة فورية أو متابعة التخصيص:
              </p>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              
              {/* Phone / WhatsApp */}
              <a
                href="tel:0540773208"
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">رقم التواصل / واتساب</span>
                  <span className="text-sm font-black text-white font-mono dir-ltr block">0540773208</span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:meliods7777x@gmail.com"
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-neutral-400 block font-bold">بريد التواصل</span>
                  <span className="text-xs font-bold text-white font-mono truncate block" title="meliods7777x@gmail.com">
                    meliods7777x@gmail.com
                  </span>
                </div>
              </a>

              {/* Snapchat */}
              <a
                href="https://www.snapchat.com/add/o.oorayan"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-yellow-500/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-all shrink-0">
                  <Ghost className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">سناب التواصل</span>
                  <span className="text-sm font-black text-yellow-400 font-mono block">o.oorayan</span>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* Top brand grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <DodgeLogo size="lg" showArabic={true} showEnglish={true} />
            <p className="text-sm leading-relaxed text-neutral-400 max-w-sm mt-3">
              دودج دورانجو 2025 V8: سيارة العضلات الأمريكية ثلاثية الصفوف الأكثر قوة وقدرة في العالم. متوفرة بمحركات هيمي الأسطورية سعة 5.7L و6.4L SRT و6.2L هيلكات سوبرتشارج بقوة تصل حتى 710 أحصنة.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex gap-1 transform -skew-x-[24deg]">
                <span className="w-2 h-4 bg-red-600 block rounded-[1px]" />
                <span className="w-2 h-4 bg-red-600 block rounded-[1px]" />
              </span>
              <span className="text-xs font-bold text-neutral-300 font-dodge tracking-wider uppercase">
                DOMESTIC. NOT DOMESTICATED. // غير مروّض
              </span>
            </div>
          </div>

          {/* Col 3: Sections */}
          <div>
            <h5 className="text-white font-black text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              أقسام الموقع
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  <span>الرئيسية ونظرة عامة</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('engines')} 
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  <span>محركات هيمي V8 الخارقة</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('trims')} 
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  <span>فئات وأسعار دورانجو 2025</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('gallery')} 
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  <span>معرض الصور والتفاصيل</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('configurator')} 
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  <span>استوديو التخصيص 3D</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Engine Highlights */}
          <div>
            <h5 className="text-white font-black text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              أساطير هيمي 2025
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <span className="text-white font-bold block">5.7L HEMI V8 (R/T)</span>
                <span className="text-neutral-400">360 حصان • سحب 8,700 رطل</span>
              </li>
              <li className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <span className="text-white font-bold block">6.4L (392) HEMI V8 (SRT)</span>
                <span className="text-neutral-400">475 حصان • 0-100 في 4.4 ث</span>
              </li>
              <li className="p-2 rounded bg-red-950/20 border border-red-900/40">
                <span className="text-red-400 font-bold block">6.2L Hellcat Supercharged</span>
                <span className="text-neutral-400">710 أحصنة • 0-100 في 3.5 ث</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Guarantee & CTA */}
          <div className="space-y-3">
            <h5 className="text-white font-black text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              ضمان دودج وخدمة العملاء
            </h5>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>ضمان المصنع المعتمد 5 سنوات أو 100,000 كم</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <Award className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>خدمة المساعدة على الطريق مجاناً على مدار الساعة 24/7</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTestDriveModal}
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-red-900/50 hover:border-red-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>طلب تجربة قيادة أو تسعيرة</span>
                <ChevronLeft className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© 2025 شركة دودج (Dodge) • جميع الحقوق محفوظة لعلامة دورانجو V8 الأسطورية.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">سياسة الخصوصية</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">شروط الاستخدام</span>
            <span>•</span>
            <span 
              onClick={() => onNavigate('employee')}
              className="text-red-500 font-bold font-mono select-none cursor-pointer"
            >
              DODGE // HEMI POWER
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
