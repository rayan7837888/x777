import { V8Engine, DurangoTrim, GalleryItem, ColorOption, WheelOption, StripeOption, InteriorOption, TestDriveAddon } from '../types';

import heroImg from '../assets/images/durango_hero_v8_1788405774637.jpg';
import interiorImg from '../assets/images/durango_interior_v8_1788405792300.jpg';
import engineImg from '../assets/images/durango_engine_v8_1788405808356.jpg';
import trackImg from '../assets/images/durango_track_v8_1788405821536.jpg';

export const DURANGO_IMAGES = {
  hero: heroImg,
  interior: interiorImg,
  engine: engineImg,
  track: trackImg,
};

export const V8_ENGINES: V8Engine[] = [
  {
    id: 'hemi-57',
    name: '5.7L HEMI® V8',
    nameAr: '5.7 لتر هيمي® V8',
    displacement: '5,654 cc',
    horsepower: 360,
    torque: 529,
    acceleration0to100: 6.2,
    topSpeed: 235,
    towingCapacityKg: 3946,
    towingCapacityLbs: 8700,
    quarterMileSec: 14.7,
    aspiration: 'Naturally Aspirated',
    aspirationAr: 'تنفس طبيعي مع تقنية توفير الوقود MDS',
    transmission: 'TorqueFlite® 8-Speed Automatic',
    transmissionAr: 'أوتوماتيكي تورك فلايت بـ 8 سرعات مع عتلات تبديل',
    soundType: 'hemi57',
    descriptionAr: 'محرك هيمي V8 الأسطوري سعة 5.7 لتر يجمع بين القوة الأمريكية العضلية والاعتمادية الفائقة، مع تقنية إلغاء تنشيط الأسطوانات (MDS) للتبديل بين 4 و8 أسطوانات لتحقيق أفضل كفاءة وقود.',
    featuresAr: [
      '360 حصان عضلات نقية مع هدير عادم رياضي مميز',
      'قدرة سحب رائدة في فئتها تصل إلى 8,700 رطل (3,946 كجم)',
      'نظام توقيت الصمامات المتغير (VVT) لعزم دوران فوري',
      'دفع رباعي مستمر AWD عالي الأداء مع نظام توزيع العزم'
    ]
  },
  {
    id: 'hemi-392',
    name: '6.4L (392) HEMI® V8',
    nameAr: '6.4 لتر (392) هيمي® SRT V8',
    displacement: '6,417 cc',
    horsepower: 475,
    torque: 637,
    acceleration0to100: 4.4,
    topSpeed: 250,
    towingCapacityKg: 3946,
    towingCapacityLbs: 8700,
    quarterMileSec: 12.9,
    aspiration: 'Naturally Aspirated SRT High-Output',
    aspirationAr: 'تنفس طبيعي عالي الإخراج SRT هيمي',
    transmission: 'TorqueFlite® 8-Speed with Track Mode',
    transmissionAr: 'ناقل حركة تورك فلايت 8 سرعات مع برمجة حلبات خاصة',
    soundType: 'hemi392',
    descriptionAr: 'المحرك الأسطوري 392 المستعار من قسم الأداء العالي SRT. محرك تنفس طبيعي عملاق يولد 475 حصاناً ويطلق سيارة الدفع الرباعي ذات الـ 7 مقاعد إلى سرعة 100 كم/س في 4.4 ثوانٍ فقط مع صوت هيمي زائر لا يُنسى.',
    featuresAr: [
      '475 حصان و637 نيوتن.متر من العزم المتفجر',
      'تسارع خاطف من 0 إلى 100 كم/س خلال 4.4 ثوانٍ',
      'مكابح بريمبو Brembo فائقة الأداء بستة مكابس في الأمام',
      'نظام تعليق بيلشتاين النشط Bilstein مع وضعيات قيادة SRT المخصصة'
    ]
  },
  {
    id: 'hellcat-62',
    name: '6.2L Supercharged HEMI® V8 Hellcat',
    nameAr: '6.2 لتر سوبرتشارج هيمي® هيلكات V8',
    displacement: '6,166 cc',
    horsepower: 710,
    torque: 875,
    acceleration0to100: 3.5,
    topSpeed: 290,
    towingCapacityKg: 3946,
    towingCapacityLbs: 8700,
    quarterMileSec: 11.5,
    aspiration: '2.4L Twin-Screw Supercharger',
    aspirationAr: 'سوبرتشارجر حلزوني مزدوج 2.4 لتر مبرد بالماء',
    transmission: 'Heavy-Duty 8HP95 8-Speed Automatic',
    transmissionAr: 'ناقل حركة أوتوماتيكي شديد التحمل 8HP95 بـ 8 سرعات',
    soundType: 'hellcat62',
    descriptionAr: 'أقوى سيارة دفع رباعي عائلية على وجه الأرض! محرك هيلكات الخارق يضم سوبرتشارجر ضخم سعة 2.4 لتر يضخ هواءً مضغوطاً بقوة 11.6 PSI ليولد 710 أحصنة وحشية مع صفير السوبرتشارجر الأيقوني وهدير العادم الثنائي المزلزل.',
    featuresAr: [
      '710 أحصنة وعزم دوران هائل 875 نيوتن.متر',
      'تسارع خارق من 0 إلى 100 كم/س في 3.5 ثانية فقط (ربع ميل في 11.5 ثانية)',
      'نظام تحكم في الانطلاق Launch Control مع مسجل بيانات الأداء SRT Pages',
      'تبريد فائق مع مدخل هواء مدمج في غطاء المحرك ومبرد مائي مزدوج'
    ]
  }
];

export const DURANGO_TRIMS: DurangoTrim[] = [
  {
    id: 'durango-rt',
    name: 'Durango R/T',
    nameAr: 'دورانجو R/T هيمي V8',
    engineBadge: '5.7L HEMI® V8',
    engineNameAr: '5.7 لتر هيمي V8 بقوة 360 حصان',
    priceSAR: 228900,
    priceUSD: 60900,
    horsepower: 360,
    torque: 529,
    acceleration: '6.2 ثوانٍ',
    image: heroImg,
    taglineAr: 'المدخل الحقيقي إلى عالم العضلات الأمريكية V8',
    highlightsAr: [
      'محرك 5.7L HEMI V8 مع نظام عادم رياضي ثنائي النغمة',
      'عجلات ألومنيوم سوداء داكنة قياس 20 بوصة',
      'شاشة ملاحة Uconnect 5 تعمل باللمس قياس 10.1 بوصة تدعم أبل كاربلاي وأندرويد أوتو لاسلكياً',
      'مقاعد رياضية قابلة للتعديل كهربائياً مع تبريد وتدفئة',
      'قدرة قطر وسحب قياسية تصل إلى 8,700 رطل'
    ],
    specs: {
      engine: '5.7L HEMI V8 MDS VVT',
      transmission: 'TorqueFlite 8 سرعات',
      drivetrain: 'دفع رباعي ذكي مستمر AWD',
      wheels: '20" Satin Carbon أو Fine Silver',
      brakes: 'أقراص مهواة عالية الأداء للأمام والخلف',
      interior: 'جلد نابا أسود أو بني مع تطريزات رياضية'
    }
  },
  {
    id: 'durango-rt-plus',
    name: 'Durango R/T Plus & Premium',
    nameAr: 'دورانجو R/T بلس / بريميوم',
    engineBadge: '5.7L HEMI® V8 Premium',
    engineNameAr: '5.7 لتر هيمي V8 مع باقة الفخامة والأمان',
    priceSAR: 259000,
    priceUSD: 68900,
    horsepower: 360,
    torque: 529,
    acceleration: '6.2 ثوانٍ',
    image: heroImg,
    taglineAr: 'الفخامة الرياضية القصوى لجميع الركاب في 3 صفوف',
    highlightsAr: [
      'نظام صوتي فاخر Harman Kardon بقوة 825 واط مع 19 مكبر صوت ومضخم صوتي',
      'فتحة سقف كهربائية وتطعيمات من ألياف الكربون الحقيقية',
      'حزمة Tow N Go لزيادة التحكم بالقطر ونظام تعليق نشط',
      'حزمة الأمان النشط الكاملة: رادار كشف المشاة ومراقبة النقطة العمياء ومثبت السرعة التفاعلي',
      'بطانة سقف من قماش الشامواه الرياضي الفاخر'
    ],
    specs: {
      engine: '5.7L HEMI V8 مع نظام Tow N Go',
      transmission: 'TorqueFlite 8 سرعات مع وضعيات Track/Tow',
      drivetrain: 'دفع رباعي ذكي متطور مع قفل ترس تفاضلي',
      wheels: '20" Lights Out Black مسبوكة',
      brakes: 'مكابح بريمبو برتقالية أو سوداء 4 مكابس',
      interior: 'جلد نابا مخرم مع شعار R/T مطرز'
    }
  },
  {
    id: 'durango-srt-392',
    name: 'Durango SRT® 392',
    nameAr: 'دورانجو SRT 392 هيمي الخارق',
    engineBadge: '6.4L 392 HEMI® V8',
    engineNameAr: '6.4 لتر هيمي SRT بقوة 475 حصان',
    priceSAR: 339000,
    priceUSD: 90400,
    horsepower: 475,
    torque: 637,
    acceleration: '4.4 ثوانٍ',
    image: trackImg,
    taglineAr: 'وحش الحلبات ذو التنفس الطبيعي والصوت الهادر',
    highlightsAr: [
      'محرك 392 هيمي بقوة 475 حصاناً وصوت عادم هادر لا يُعلى عليه',
      'مكابح بريمبو Brembo حمراء بـ 6 مكابس مع أقراص مهواة قياس 15 بوصة',
      'نظام تعليق بيلشتاين المتكيف بنظام التخميد المتغير النشط (Active Damping)',
      'صفحات أداء SRT Performance Pages لقياس الجاذبية، التسارع، والتوقيت',
      'مقاعد سباق SRT من جلد لاجونا Laguna الأحمر الداكن (Demonic Red)'
    ],
    specs: {
      engine: '6.4L SRT HEMI V8 (392 cu.in)',
      transmission: 'TorqueFlite 8 سرعات مبرمجة للحلبات',
      drivetrain: 'دفع رباعي SRT AWD مع توزيع عزم 70% للخلف في وضع Track',
      wheels: '20" × 10" Forged Hyper Black ألمنيوم مقوى',
      brakes: 'مكابح بريمبو 6 مكابس أمامية / 4 مكابس خلفية',
      interior: 'جلد لاجونا ديمونيك ريد مع ألياف كربون حقيقية'
    }
  },
  {
    id: 'durango-hellcat',
    name: 'Durango SRT® Hellcat 2025',
    nameAr: 'دورانجو SRT هيلكات سوبرتشارج 2025',
    engineBadge: '6.2L Supercharged V8',
    engineNameAr: '6.2 لتر هيلكات سوبرتشارج بقوة 710 أحصنة',
    priceSAR: 435000,
    priceUSD: 116000,
    horsepower: 710,
    torque: 875,
    acceleration: '3.5 ثوانٍ',
    image: heroImg,
    taglineAr: 'أسرع وأقوى سيارة دفع رباعي بثلاثة صفوف مقاعد في العالم',
    highlightsAr: [
      'محرك هيلكات سوبرتشارج 6.2 لتر يولد 710 أحصنة و875 نيوتن.متر عزم',
      'انطلاق صاروخي من 0 إلى 100 كم/س في 3.5 ثوانٍ وسرعة قصوى 290 كم/س',
      'شعار رأس الهيلكات Hellcat المعدني المنقوش على الرفارف والمقاعد والمفتاح',
      'غطاء محرك هجومي بفتحات تبريد مركزية ومداخل هواء تبريد للسوبرتشارجر',
      'نظام تحكم في الانطلاق Launch Control ونظام حماية خط التماسك Line Lock'
    ],
    specs: {
      engine: '6.2L Supercharged HEMI V8 Hellcat',
      transmission: 'TorqueFlite 8HP95 عالية التحمل بـ 8 سرعات',
      drivetrain: 'دفع رباعي هيلكات عالي الأداء بنسب عزم متغيرة',
      wheels: '20" × 10" برونزية أو سوداء مطفية خفيفة الوزن',
      brakes: 'بريمبو عالية الأداء بـ 6 مكابس مع أقراص 15.7 بوصة',
      interior: 'مقصورة حصرية من جلد لاجونا أحمر ديمون مع جلد سويدي شمواه'
    }
  },
  {
    id: 'durango-last-call-hammerhead',
    name: 'Durango SRT Hellcat "Hammerhead" 2025',
    nameAr: 'دورانجو هيلكات 2025 الإصدار التوديعي Last Call "هامر هيد"',
    engineBadge: 'Special Edition 710 HP',
    engineNameAr: 'إصدار توديعي حصري فائق الندرة لعام 2025',
    priceSAR: 479000,
    priceUSD: 127500,
    horsepower: 710,
    torque: 875,
    acceleration: '3.5 ثوانٍ',
    image: heroImg,
    isSpecialEdition: true,
    editionBadgeAr: 'إصدار توديعي محدود Last Call 2025',
    taglineAr: 'تحفة توديعية نادرة تحتفي بآخر عهد محركات V8 الأسطورية',
    highlightsAr: [
      'طلاء خارجي حصري Night Moves الأزرق الليلي الداكن مع غطاء محرك كربون أسود مطفي',
      'مقصورة داخلية من جلد Hammerhead Grey الحصري مع خياطة تباين فضية',
      'لوحة أرقام تذكارية معدنية Last Call تحت غطاء المحرك تشير لرقم النسخة',
      'عجلات سبيكة Satin Carbon قياس 20 بوصة مع مكابح بريمبو برونزية خاصة',
      'أغطية مرايا ومشتت هواء خلفي وعوادم سوداء من التيتانيوم'
    ],
    specs: {
      engine: '6.2L Supercharged V8 Hellcat Special Edition',
      transmission: 'TorqueFlite 8HP95 8 سرعات مع عتلات تيتانيوم',
      drivetrain: 'دفع رباعي SRT AWD دائم',
      wheels: '20" Hammerhead Special Satin Carbon',
      brakes: 'بريمبو برونزية 6 مكابس حصرية',
      interior: 'جلد هامر هيد رمادي ناعم مع ألياف كربون مطفية'
    }
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    titleAr: 'دودج دورانجو SRT هيلكات 2025 الهجومية مع خطين حمر دودج',
    category: 'exterior',
    categoryAr: 'المظهر الخارجي',
    imageUrl: heroImg,
    descriptionAr: 'واجهة أمامية مفتولة العضلات مع شبك تهوية علوي وسفلي أسود مفتوح لتبريد هيمي، ومصابيح LED ثاقبة مع خطي دودج الرياضيين.',
    specsHighlight: 'طول 5.1 متر | عرض 1.95 متر'
  },
  {
    id: 'g-2',
    titleAr: 'مقصورة القيادة SRT الفاخرة بجلد لاجونا ديمونيك ريد',
    category: 'interior',
    categoryAr: 'المقصورة الداخلية',
    imageUrl: interiorImg,
    descriptionAr: 'شاشة Uconnect 5 مقاس 10.1 بوصة، مقود مسطح القاع مع عتلات تبديل من الألمنيوم، وتطعيمات ألياف الكربون الحقيقية.',
    specsHighlight: 'نظام صوت هارمن كاردون 19 سماعة'
  },
  {
    id: 'g-3',
    titleAr: 'محرك هيلكات 6.2 لتر سوبرتشارج هيمي V8 الأسطوري',
    category: 'engine',
    categoryAr: 'محركات V8',
    imageUrl: engineImg,
    descriptionAr: 'قلب الوحش النابض بقوة 710 أحصنة، سوبرتشارجر حلزوني مزدوج سعة 2.4 لتر، وغطاء صمامات برتقالي دودج الأصيل.',
    specsHighlight: '710 حصان | 875 نيوتن.متر عزم'
  },
  {
    id: 'g-4',
    titleAr: 'دورانجو 2025 على مضمار الحلبة مع إضاءة Racetrack LED',
    category: 'track',
    categoryAr: 'الحلبة والأداء',
    imageUrl: trackImg,
    descriptionAr: 'انعطاف فائق الدقة وثبات مذهل بفضل نظام التعليق النشط بيلشتاين وتوزيع العزم الرباعي AWD.',
    specsHighlight: '0-100 كم/س في 3.5 ثوانٍ'
  }
];

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'destroyer-gray',
    nameAr: 'رمادي المدمّرة (Destroyer Gray)',
    nameEn: 'Destroyer Gray',
    hex: '#5A6268',
    carTint: 'rgba(90, 98, 104, 0.4)',
    finishAr: 'صلب غير لامع'
  },
  {
    id: 'pitch-black',
    nameAr: 'أسود فحمي قاتم (Pitch Black)',
    nameEn: 'Pitch Black',
    hex: '#121214',
    carTint: 'rgba(18, 18, 20, 0.5)',
    finishAr: 'لميع عميق'
  },
  {
    id: 'octane-red',
    nameAr: 'أحمر أوكتان لؤلؤي (Octane Red)',
    nameEn: 'Octane Red',
    hex: '#800000',
    carTint: 'rgba(128, 0, 0, 0.45)',
    finishAr: 'لؤلؤي متعدد الطبقات'
  },
  {
    id: 'white-knuckle',
    nameAr: 'أبيض ناصع (White Knuckle)',
    nameEn: 'White Knuckle',
    hex: '#F8F9FA',
    carTint: 'rgba(248, 249, 250, 0.35)',
    finishAr: 'لامع ناصع'
  },
  {
    id: 'f8-green',
    nameAr: 'أخضر حربي F8 Green',
    nameEn: 'F8 Green',
    hex: '#3B4D3C',
    carTint: 'rgba(59, 77, 60, 0.45)',
    finishAr: 'ميتاليك عسكري'
  },
  {
    id: 'vapor-blue',
    nameAr: 'أزرق فابور (Vapor Blue Metallic)',
    nameEn: 'Vapor Blue',
    hex: '#1E3A5F',
    carTint: 'rgba(30, 58, 95, 0.45)',
    finishAr: 'ميتاليك أزرق عميق'
  }
];

export const STRIPE_OPTIONS: StripeOption[] = [
  {
    id: 'dual-red',
    nameAr: 'خطين حمر دودج الأيقونيين (Dodge Red Dual Stripes)',
    color: '#E50914',
    stripeClass: 'bg-red-600',
    isDodgeSignature: true
  },
  {
    id: 'dual-gunmetal',
    nameAr: 'خطين بلون الرصاصي المعدني (Gunmetal Gray)',
    color: '#4B5563',
    stripeClass: 'bg-neutral-600',
    isDodgeSignature: false
  },
  {
    id: 'dual-black',
    nameAr: 'خطين بلون الأسود المطفأ (Matte Black)',
    color: '#18181B',
    stripeClass: 'bg-neutral-900',
    isDodgeSignature: false
  },
  {
    id: 'no-stripes',
    nameAr: 'بدون خطوط سباق (Clean Solid Body)',
    color: 'transparent',
    stripeClass: 'bg-transparent',
    isDodgeSignature: false
  }
];

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: 'brass-monkey',
    nameAr: 'عجلات برونزية براس مونكي Brass Monkey مقاس 20 بوصة',
    size: '20" × 10"',
    finish: 'برونز داكن مطفي',
    priceSAR: 4500
  },
  {
    id: 'lights-out',
    nameAr: 'عجلات سوداء قاتمة Lights Out Black مقاس 20 بوصة',
    size: '20" × 10"',
    finish: 'أسود مطفأ رياضي',
    priceSAR: 3200
  },
  {
    id: 'satin-carbon',
    nameAr: 'عجلات كربون ساتان Satin Carbon مقاس 20 بوصة',
    size: '20" × 10"',
    finish: 'فضي كربوني نصف لامع',
    priceSAR: 0
  }
];

export const INTERIOR_OPTIONS: InteriorOption[] = [
  {
    id: 'demonic-red',
    nameAr: 'جلد لاجونا ديمونيك ريد (Demonic Red Laguna)',
    materialAr: 'جلد طبيعي ناعم فائق الجودة مع تطريز Hellcat',
    accentColor: 'أحمر قرمزي ناري',
    accentHex: '#991B1B'
  },
  {
    id: 'ebony-black',
    nameAr: 'جلد نابا أسود إيبوني مع ألياف كربون (Ebony Nappa & Carbon)',
    materialAr: 'جلد نابا مخرم فاخر مع درزات بيضاء فضية',
    accentColor: 'أسود داكن مع كربون',
    accentHex: '#18181B'
  },
  {
    id: 'hammerhead-grey',
    nameAr: 'جلد هامر هيد رمادي خاص (Hammerhead Grey Special)',
    materialAr: 'جلد رمادي صلب حصري لفئة الإصدارات التوديعية Last Call',
    accentColor: 'رمادي لؤلؤي أنيق',
    accentHex: '#64748B'
  }
];

// Test Drive VIP Experience Pricing
// Base price is 2000 SAR, and add-ons are in increments of hundreds (مئات: +100, +200, +300, +400, +500)
export const TEST_DRIVE_BASE_PRICE_SAR = 2000;

export const TEST_DRIVE_ADDONS: TestDriveAddon[] = [
  {
    id: 'addon-video',
    nameAr: 'تصوير فيديو سينمائي احترافي 4K مع درون لتسارع هيمي V8',
    priceSAR: 200,
    descriptionAr: 'توثيق تجربة قيادتك بكاميرات 4K احترافية ولقطات درون عالية السرعة تُسلّم لك فورياً',
    categoryAr: 'التوثيق والإعلام'
  },
  {
    id: 'addon-coach',
    nameAr: 'مدرب قيادة رياضية وحلبات محترف (Track Coach & Launch)',
    priceSAR: 300,
    descriptionAr: 'مرافقة سائق حلبات معتمد لتعليمك كيفية ترويض واستخراج أقصى قوة وعزم من محرك هيمي V8',
    categoryAr: 'الأداء والتدريب'
  },
  {
    id: 'addon-launch',
    nameAr: 'تجربة انطلاق Launch Control كامل مع حرق إطارات خاضع للتحكم',
    priceSAR: 400,
    descriptionAr: 'تجربة انطلاق متفجرة بأقصى تسارع من الثبات وتفعيل أنظمة Launch Assist و Line Lock',
    categoryAr: 'الأداء العالي'
  },
  {
    id: 'addon-delivery',
    nameAr: 'توصيل واستلام دورانجو من باب بيتك أو موقعك (VIP Doorstep)',
    priceSAR: 500,
    descriptionAr: 'نحضر سيارة دورانجو V8 إلى باب منزلك أو مقر عملك ونبدأ التجربة من موقعك ونستلمها هناك',
    categoryAr: 'الراحة والـ VIP'
  },
  {
    id: 'addon-insurance',
    nameAr: 'تأمين VIP شامل الحلبة ومسار السرعة بدون أي نسبة تحمل',
    priceSAR: 200,
    descriptionAr: 'تغطية تأمينية شاملة 100% بدون أي مسؤولية أو نسبة تحمل طوال فترة تجربة القيادة',
    categoryAr: 'الأمان والحماية'
  },
  {
    id: 'addon-gift',
    nameAr: 'باقة هدايا أصلية حصرية من دودج (تيشيرت + كاب Dodge SRT أصلي)',
    priceSAR: 100,
    descriptionAr: 'حقيبة هدايا تذكارية أصلية تحمل شعارات دودج هيلكات وهيمي V8 الرسمية والمميزة',
    categoryAr: 'الهدايا التذكارية'
  }
];

