import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { GALLERY_ITEMS } from '../../data/durangoData';
import { DodgeLogo } from '../DodgeLogo';
import { 
  Maximize2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'كافة الصور' },
    { id: 'exterior', label: 'المظهر الخارجي' },
    { id: 'interior', label: 'المقصورة الداخلية' },
    { id: 'engine', label: 'محرك هيمي V8' },
    { id: 'track', label: 'الحلبة والأداء' },
  ];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8 text-right">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <span className="text-neutral-500 text-xs">|</span>
            <span className="text-red-500 text-xs font-mono font-bold tracking-wider uppercase">
              GALLERY & DESIGN
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            معرض صور دودج دورانجو <span className="text-red-600 font-num">2025</span> V8
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            استكشف تفاصيل التصميم العضلي الجريء، خطوط دودج الرياضية المزدوجة، مقصورة القيادة الفاخرة بجلد لاجونا الأحمر، وهندسة محرك هيمي الخارق.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-900/90 border border-neutral-800 p-1.5 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-red-600/70 transition-all duration-300 shadow-xl cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.titleAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />

              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-neutral-300 text-xs font-bold px-3 py-1 rounded-full">
                {item.categoryAr}
              </div>

              {/* Zoom prompt icon */}
              <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-red-500" />
              </div>

              {/* Bottom text info inside card */}
              <div className="absolute bottom-4 right-4 left-4 text-right">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                  <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                  <span className="text-xs font-mono text-red-400 font-bold">{item.specsHighlight}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-red-400 transition-colors">
                  {item.titleAr}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 mt-1">
                  {item.descriptionAr}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* DESIGN DNA HIGHLIGHTS */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 sm:p-12 space-y-8 text-right">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
            <span className="w-2 h-4 bg-red-600 transform -skew-x-[24deg] block" />
            <span className="text-red-500 text-xs font-bold uppercase tracking-wider font-dodge">DODGE DNA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            فلسفة التصميم: خطوط القوة الأمريكية وحضور لا يمكن تجاهله
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
            <div className="text-red-500 font-bold text-xs uppercase font-mono">01 // الخطوط المزدوجة</div>
            <h4 className="text-white font-bold text-base">خطي شعار دوج الحمر</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              تمتد الخطوط الرياضية المزدوجة من الصدام الأمامي عبر غطاء المحرك والسقف وصولاً للباب الخلفي لتمنح دورانجو هوية متفردة بين سيارات الـ SUV.
            </p>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
            <div className="text-red-500 font-bold text-xs uppercase font-mono">02 // التبريد الهوائي</div>
            <h4 className="text-white font-bold text-base">غطاء المحرك المزدوج الفتحات</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              فتحة سحب هواء مركزية مع فتحتين جانبيتين لتفريغ الهواء الساخن والحفاظ على حرارة مثالية لمحرك هيمي والسوبرتشارجر.
            </p>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
            <div className="text-red-500 font-bold text-xs uppercase font-mono">03 // إضاءة الحلبات</div>
            <h4 className="text-white font-bold text-base">مصابيح Racetrack LED</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              شريط إضاءة خلفي متصل بالكامل بتقنية LED مستوحى من مسارات حلبات السباق، يضيء ليل الطرقات بتوقيع دودج البصري المميز.
            </p>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
            <div className="text-red-500 font-bold text-xs uppercase font-mono">04 // مقصورة لاجونا</div>
            <h4 className="text-white font-bold text-base">جلد ديمونيك ريد الفاخر</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              مقاعد جلدية طبيعية باللون الأحمر الداكن مع تطريز شعارات هيلكات وتطعيمات ألياف الكربون الحقيقية لراحة فائقة في الرحلات الطويلة.
            </p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative h-[360px] sm:h-[460px] bg-neutral-950">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.titleAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal details */}
            <div className="p-6 sm:p-8 text-right space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                <span className="w-1.5 h-3 bg-red-600 transform -skew-x-[24deg] block" />
                <span className="text-xs font-mono text-red-500 font-bold">{selectedItem.categoryAr}</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {selectedItem.titleAr}
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {selectedItem.descriptionAr}
              </p>
              {selectedItem.specsHighlight && (
                <div className="pt-2">
                  <span className="inline-block bg-neutral-950 border border-neutral-800 text-red-400 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
                    {selectedItem.specsHighlight}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
