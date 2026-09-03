import { V8Engine, DurangoTrim, GalleryItem, ColorOption, WheelOption, StripeOption, InteriorOption, TestDriveAddon } from '../types';

import heroImg from '../assets/images/datsun_hero_2012_1788465716510.jpg';
import sideImg from '../assets/images/datsun_side_2012_1788465731009.jpg';
import singleCabImg from '../assets/images/datsun_singlecab_2012_1788465750225.jpg';

export const DATSUN_IMAGES = {
  hero: heroImg,
  side: sideImg,
  singleCab: singleCabImg,
  interior: sideImg,
  engine: heroImg,
  track: singleCabImg,
};

// Aliased for backward compatibility with components that import DURANGO_IMAGES
export const DURANGO_IMAGES = DATSUN_IMAGES;

export const DATSUN_ENGINES: V8Engine[] = [
  {
    id: 'ka24de-standard',
    name: '2.4L DOHC 16-Valve KA24DE',
    nameAr: '2.4 لتر نيسان KA24DE بخاخ 16 صمام',
    displacement: '2,389 cc',
    horsepower: 160,
    torque: 209,
    acceleration0to100: 9.8,
    topSpeed: 185,
    towingCapacityKg: 1800,
    towingCapacityLbs: 3968,
    quarterMileSec: 16.9,
    aspiration: 'Naturally Aspirated Multi-Point Fuel Injection (EGI)',
    aspirationAr: 'تنفس طبيعي بنظام حقن إلكتروني متعدد النقاط EGI متطور',
    transmission: '5-Speed Manual Heavy-Duty RS5W71C',
    transmissionAr: 'قير عادي 5 سرعات شديد التحمل مع شعور ميكانيكي نقي وعصا كلاسيكية',
    soundType: 'hemi57', // triggers sound simulator
    descriptionAr: 'محرك نيسان KA24DE الأسطوري سعة 2.4 لتر، رأس ألمنيوم مزدوج الكامات DOHC بـ 16 صماماً. يعتبر قلب الددسن النابض الذي صنع مجدها في صحاري وطرقات الخليج بقوته، بساطته الميكانيكية، وتحمله الشديد لأعلى درجات الحرارة مع استجابة فورية ونغمة شكمان لا تخطئها الأذن.',
    featuresAr: [
      '160 حصان صافي مع عزم دوران 209 نيوتن.متر عند 3600 دورة بالدقيقة',
      'عمود كامات علوي مزدوج DOHC مع 4 صمامات لكل أسطوانة',
      'نظام تبريد جبار ومروحة ميكانيكية مخصصة لأجواء الصيف اللاهب',
      'دفرنس خلفي متين بنسب تروس توفر عزماً هائلاً في الرمال وصعود المرتفعات'
    ]
  },
  {
    id: 'ka24de-4x4',
    name: '2.4L KA24DE 4WD Off-Road Edition',
    nameAr: '2.4 لتر ددسن دبل دفرنسين 4WD',
    displacement: '2,389 cc',
    horsepower: 160,
    torque: 212,
    acceleration0to100: 10.4,
    topSpeed: 175,
    towingCapacityKg: 2200,
    towingCapacityLbs: 4850,
    quarterMileSec: 17.5,
    aspiration: 'High-Torque Tuned EGI with Dual Air-Intake',
    aspirationAr: 'تنفس طبيعي مبرمج للعزم المنخفض مع فلتر هواء صحراوي مزدوج',
    transmission: '5-Speed Manual with 2-Speed Transfer Case (4H/4L)',
    transmissionAr: 'قير عادي 5 سرعات مع قير دبل أرضي خفيف وثقيل وفرارات يدوية',
    soundType: 'hemi392',
    descriptionAr: 'نسخة الدفع الرباعي دبل فرارات لددسن 2012، مزودة بدفرنس أمامي صلب وقير دبل مع نسبة تخفيض 4L لاقتحام أعتى الكثبان الرملية والنفود، مع نظام تعليق مقوى بيايات ومساعدات غازية تتحمل أقسى وعورات التضاريس.',
    featuresAr: [
      'دفع رباعي حقيقي 4x4 مع خيارات الدفع الثنائي 2H والدبل الخفيف 4H والثقيل 4L',
      'فرارات دبل أمامية يدوية لقفل الدفرنس عند الدخول في الرمال',
      'ارتفاع خلوص أرضي 215 مم لتجاوز الصخور والطعوس بسهولة',
      'صفائح حماية سفلية مصفحة من الفولاذ لحماية الكارتير والدبل'
    ]
  },
  {
    id: 'ka24de-headers-tuned',
    name: '2.4L KA24DE Headers & Sound Tuned',
    nameAr: '2.4 لتر نيسان مع هدرز وتفتفة رياضية',
    displacement: '2,389 cc',
    horsepower: 175,
    torque: 225,
    acceleration0to100: 8.9,
    topSpeed: 195,
    towingCapacityKg: 1800,
    towingCapacityLbs: 3968,
    quarterMileSec: 16.2,
    aspiration: 'Performance Tuned Headers + High-Flow Intake',
    aspirationAr: 'هدرز ستانلس ستيل مفرغ مع فلتر رياضي وبرمجة نغمة شكمان طربية',
    transmission: '5-Speed Manual Short-Throw Shifter',
    transmissionAr: 'قير عادي 5 سرعات مع تعشيقات سريعة ونغمة تفريغ شكمان نارية',
    soundType: 'hellcat62',
    descriptionAr: 'نسخة الهواة والمطوفين التراثية! محرك KA24DE مزود بهدرز بحريني متناسق، دبة شكمان رياضية تعطي نغمة الددسن الحادة المشهورة في ساحات التطعيس، مع استجابة شرسة لخنق الهواء وصوت تفتفة تطرب كل من يسمعها.',
    featuresAr: [
      '175 حصان معدل مع تدفق عادم حر بدون كتمة',
      'نغمة شكمان ددسن أيقونية بصوت صافي وحاد عند الوصول لـ 5500 RPM',
      'صمام إلكتروني Exhaust Cutout للتبديل بين صوت الوكالة الهادئ ونغمة الهدرز الصاخبة',
      'عزم دوران سريع الاستجابة مناسب للمقاومات وتحديات النفود'
    ]
  }
];

export const V8_ENGINES = DATSUN_ENGINES;

export const DATSUN_TRIMS: DurangoTrim[] = [
  {
    id: 'datsun-double-cab-gle',
    name: 'Datsun 2012 Double Cab GL-E',
    nameAr: 'ددسن 2012 غمارتين سوبر جي إل (GL-E)',
    engineBadge: '2.4L KA24DE 16V',
    engineNameAr: '2.4 لتر بخاخ إلكتروني بقوة 160 حصان',
    priceSAR: 68500,
    priceUSD: 18260,
    horsepower: 160,
    torque: 209,
    acceleration: '9.8 ثانية (0-100 كم/س)',
    image: sideImg,
    isSpecialEdition: true,
    editionBadgeAr: 'الفئة الأكثر طلباً ومبيعاً',
    taglineAr: 'أسطورة البيك أب الخليجي.. الفخامة والاعتمادية والخطوط التراثية الأصلية',
    highlightsAr: [
      'خط ددسن 2012 الأصلي الأحمر والرمادي ممتد على الجوانب والحوض',
      'صدام أمامي وخلفي ومرايا ومقابض نيكل كروم براقة',
      'طيس كروم أصلية مع شمعات كريستال وكشافات ضباب',
      'مكيف ثلج، زجاج كهربائي، وتكاية وسطية مع مقاعد مخمل مفصولة'
    ],
    specs: {
      engine: '2.4L KA24DE DOHC 16V EGI - 160 حصان',
      transmission: 'يدوي 5 سرعات مع دفرنس خلفي صلب',
      drivetrain: 'دفع خلفي RWD (دفرنس 4x2)',
      wheels: 'جنوط حديد 15 إنش مع طيس كروم ددسن وكالة الأصلية',
      brakes: 'ديسكات أمامية مهواة مع طنابير خلفية قوية',
      interior: 'مقصورة مخمل كلاسيكية بيج، قزاز كهرباء، مسجل سيدي، تكاية وسطية'
    }
  },
  {
    id: 'datsun-single-cab-gle',
    name: 'Datsun 2012 Single Cab Long-Bed',
    nameAr: 'ددسن 2012 غمّارة شاص طويل سوبر جي إل',
    engineBadge: '2.4L Long-Bed Workhorse',
    engineNameAr: '2.4 لتر بخاخ 160 حصان - حوض طويل 2.22 متر',
    priceSAR: 61900,
    priceUSD: 16500,
    horsepower: 160,
    torque: 209,
    acceleration: '9.2 ثانية (0-100 كم/س)',
    image: singleCabImg,
    isSpecialEdition: false,
    taglineAr: 'وحش الحمولات والبر.. عزم سريع، حوض عملاق، واعتمادية لا تفنى',
    highlightsAr: [
      'حوض شاص طويل يتسع لكافة المعدات وعزب الرحلات البرية بحمولة 1,050 كجم',
      'وزن أخف وتسارع أنشط بفضل هيكل الغمارة الواحدة الديناميكي',
      'خط ددسن 2012 الأصلي يمتد بجمال على طول الحوض الطويل',
      'دركسون هواء باور ستيرنج، مكيف نيسان البارد، وتجهيزات شاقة'
    ],
    specs: {
      engine: '2.4 لتر KA24DE بنزين 4 أسطوانات - 160 حصان',
      transmission: 'يدوي 5 سرعات بنسب تروس قصيرة للعزم العالي',
      drivetrain: 'دفع خلفي مع سست تعليق خلفية مقواة للحمولة',
      wheels: 'جنوط هلل مقاس 15 إنش مع كفرات حجرية',
      brakes: 'نظام كبح هيدروليكي مع صمام موازنة الحمولة LSPV',
      interior: 'مقعد متصل مريح ومفروش بمخمل متين، مكيف هواء جبار، طبلون كلاسيكي'
    }
  },
  {
    id: 'datsun-4x4-double-cab',
    name: 'Datsun 2012 Double Cab 4x4 Off-Road',
    nameAr: 'ددسن 2012 غمارتين دبل 4x4 للنفود والبر',
    engineBadge: '2.4L 4WD Dual Diff',
    engineNameAr: '2.4 لتر مع دبل أرضي وفرارات ودفرنسين',
    priceSAR: 78900,
    priceUSD: 21040,
    horsepower: 160,
    torque: 212,
    acceleration: '10.4 ثانية (0-100 كم/س)',
    image: heroImg,
    isSpecialEdition: true,
    editionBadgeAr: 'ملك الطعوس والنفود',
    taglineAr: 'ددسن دبل مجهزة لقطع الفيافي والرمال العميقة بدون تردد',
    highlightsAr: [
      'قير دبل أرضي 4H و4L مع فرارات يدوية على الجنوط الأمامية',
      'خلوص أرضي مرتفع 215 مم مع رفارف بارزة لحماية الهيكل',
      'خطوط ددسن 2012 دبل الرياضية الأصلية',
      'صفائح حماية سفلية فولاذية، ونظام تعليق مخصص للمناطق الوعرة'
    ],
    specs: {
      engine: '2.4L KA24DE مبرمج للتحمل الشاق والعزم المنخفض',
      transmission: 'يدوي 5 سرعات + صندوق تحويل تروس دبل 2-Speed Transfer Case',
      drivetrain: 'دفع رباعي 4WD حقيقي مع دفرنس أمامي وخلفي صلبين',
      wheels: 'جنوط ألمنيوم 16 إنش مضلعة مع كفرات دنلوب رملية',
      brakes: 'أقراص فرامل أمامية مزدوجة مع نظام مانع انغلاق ABS',
      interior: 'مقصورة عملية مع موزع دفع رباعي، بوصلة ودرجة حرارة، وقماش معالج'
    }
  },
  {
    id: 'datsun-heritage-gold-edition',
    name: 'Datsun 2012 Heritage Special Edition',
    nameAr: 'ددسن 2012 الإصدار التراثي المذهب الخاص',
    engineBadge: 'KA24DE Heritage Tuned',
    engineNameAr: '2.4 لتر مع هدرز نغمة وشراع حوض تراثي',
    priceSAR: 74500,
    priceUSD: 19860,
    horsepower: 175,
    torque: 225,
    acceleration: '8.9 ثانية (0-100 كم/س)',
    image: heroImg,
    isSpecialEdition: true,
    editionBadgeAr: 'إصدار الذكرى التراثية المحدود',
    taglineAr: 'التحفة التي يبحث عنها هواة التراث والمقتنون في المملكة والخليج',
    highlightsAr: [
      'شعار داتسون DATSUN التراثي الكلاسيكي وخطوط 2012 المذهبة',
      'هدرز بحريني ستانلس ستيل مع نغمة شكمان طربية وكتمة إلكترونية',
      'شراع حوض أصلي تنزاني مقاوم للحرارة مع شد عوارض ألمنيوم',
      'جنوط مرسيدس ددسن كلاسيكية مكحلة بلمعان ساحر'
    ],
    specs: {
      engine: '2.4L KA24DE Tuned مع فلتر رياضي وهدرز عادم حر',
      transmission: 'يدوي 5 سرعات مع كلتش رياضي وسرعة تعشيق',
      drivetrain: 'دفع خلفي مع قفل دفرنس خلفي محدود الانزلاق LSD',
      wheels: 'جنوط مرسيدس ددسن مقاس 15 إنش بنجمة فضية',
      brakes: 'فرامل رياضية مهواة عالية الكفاءة',
      interior: 'فرش جلد ومخمل مذهب، تطريزات داتسون، شاشة أندرويد مع مسجل الوكالة الأصلي'
    }
  }
];

export const DURANGO_TRIMS = DATSUN_TRIMS;

export const DATSUN_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'datsun-gal-1',
    titleAr: 'ددسن 2012 في قلب النفود الذهبي عند الغروب',
    category: 'exterior',
    categoryAr: 'الهيكل والخطوط',
    imageUrl: heroImg,
    descriptionAr: 'ددسن 2012 غمارتين تتباهى بخطوطها التراثية الأصلية وشبك الكروم الناصع وسط رمال الدهناء ونفود الثمامة.',
    specsHighlight: 'خط ددسن 2012 الأصلي • لون أبيض لؤلؤي • صدامات كروم'
  },
  {
    id: 'datsun-gal-2',
    titleAr: 'الجانب الأيقوني لددسن 2012 سوبر جي إل',
    category: 'exterior',
    categoryAr: 'الهيكل والخطوط',
    imageUrl: sideImg,
    descriptionAr: 'التصميم الجانبي المتناسق الذي خلد اسم الددسن، مع طيس الوكالة الكروم والمرايا النيكل والعوارض المتينة.',
    specsHighlight: 'غمارتين GL-E • طيس وكالة • خطوط متناسقة من الصدام للحوض'
  },
  {
    id: 'datsun-gal-3',
    titleAr: 'ددسن 2012 غمّارة شاص طويل في قفار الصحراء',
    category: 'track',
    categoryAr: 'البر والتحمل',
    imageUrl: singleCabImg,
    descriptionAr: 'الغمّارة الشاص الطويل وهي تشق طريقها بين الكثبان وتثير ذرات الرمال الذهبية بقوة محرك KA24DE.',
    specsHighlight: 'حوض شاص 2.22م • تسارع خفيف • قدرة حمولة 1 طن'
  },
  {
    id: 'datsun-gal-4',
    titleAr: 'المحرك الأسطوري نيسان KA24DE سعة 2.4 لتر',
    category: 'engine',
    categoryAr: 'المحرك والميكانيك',
    imageUrl: heroImg,
    descriptionAr: 'محرك الكامات المزدوجة DOHC 16 صمام بخاخ، المعروف بأنه المحرك الأكثر اعتمادية وسهولة في الصيانة.',
    specsHighlight: '160 حصان • 209 نيوتن.متر • حقن EGI • نظام تبريد استوائي'
  },
  {
    id: 'datsun-gal-5',
    titleAr: 'المقصورة الداخلية والراحة الكلاسيكية',
    category: 'interior',
    categoryAr: 'المقصورة الداخلية',
    imageUrl: sideImg,
    descriptionAr: 'مقصورة ددسن 2012 الواسعة، مكيف نيسان المعروف ببرودته الثلجية، عصا القير الكلاسيكية، وتكاية وسطية عملية.',
    specsHighlight: 'مكيف ثلج • قزاز كهرب • مخمل ياباني متين • مسجل MP3'
  }
];

export const GALLERY_ITEMS = DATSUN_GALLERY_ITEMS;

export const DATSUN_COLORS: ColorOption[] = [
  {
    id: 'color-white',
    nameAr: 'أبيض وكالة لؤلؤي',
    nameEn: 'Pure Pearl White',
    hex: '#F8F9FA',
    carTint: 'brightness(1.05) contrast(1.02)',
    finishAr: 'اللون الرسمي الكلاسيكي لددسن 2012'
  },
  {
    id: 'color-beige',
    nameAr: 'بيج صحراوي رملي',
    nameEn: 'Sahara Sand Beige',
    hex: '#D2B48C',
    carTint: 'sepia(0.3) saturate(1.2) hue-rotate(-10deg)',
    finishAr: 'لون البر وعشاق الكشتات والمقناص'
  },
  {
    id: 'color-silver',
    nameAr: 'فضي ميتاليك لامع',
    nameEn: 'Liquid Silver Metallic',
    hex: '#C0C0C0',
    carTint: 'contrast(1.1) brightness(0.95)',
    finishAr: 'لمعان معدني براق مع لمعة شمس الخليج'
  },
  {
    id: 'color-maroon',
    nameAr: 'عنابي ميتاليك ملكي',
    nameEn: 'Royal Maroon Burgundy',
    hex: '#6B1D2F',
    carTint: 'hue-rotate(320deg) saturate(1.4) brightness(0.85)',
    finishAr: 'لون فخم ونادر على فئة سوبر جي إل'
  }
];

export const COLOR_OPTIONS = DATSUN_COLORS;

export const DATSUN_WHEELS: WheelOption[] = [
  {
    id: 'wheel-hubcaps',
    nameAr: 'طيس وكالة نيسان ددسن 2012 الأصلية الكروم',
    size: '15 إنش',
    finish: 'كروم لامع مع شعار نيسان في المنتصف',
    priceSAR: 0
  },
  {
    id: 'wheel-halal',
    nameAr: 'جنوط هلل رملية حديد مقوى (كشتات)',
    size: '15 إنش',
    finish: 'رمادي حجري مع فتحات تهوية للمكابح',
    priceSAR: 1200
  },
  {
    id: 'wheel-mercedes',
    nameAr: 'جنوط مرسيدس ددسن الكلاسيكية المشهورة',
    size: '15 إنش',
    finish: 'فضي مكحل مع حواف كروم مصقولة',
    priceSAR: 2200
  },
  {
    id: 'wheel-4x4-alloy',
    nameAr: 'جنوط ألمنيوم دبل عريضة للطعوس',
    size: '16 إنش',
    finish: 'ألمنيوم مسبوك عالي القوة لتحمل الصدمات',
    priceSAR: 2800
  }
];

export const WHEEL_OPTIONS = DATSUN_WHEELS;

export const DATSUN_STRIPES: StripeOption[] = [
  {
    id: 'stripe-2012-red-grey',
    nameAr: 'خط ددسن 2012 الأصلي (الأحمر والرمادي الأيقوني)',
    color: 'أحمر + رمادي معدني + خط كحلي ناعم',
    stripeClass: 'bg-gradient-to-r from-red-600 via-neutral-400 to-red-600',
    isDodgeSignature: true
  },
  {
    id: 'stripe-2012-gold',
    nameAr: 'خط ددسن 2012 المذهب التراثي',
    color: 'ذهبي ميتاليك + بني صحراوي',
    stripeClass: 'bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600',
    isDodgeSignature: true
  },
  {
    id: 'stripe-sleek-silver',
    nameAr: 'خط 2012 الفضي الهادئ',
    color: 'فضي ميتاليك متدرج',
    stripeClass: 'bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400',
    isDodgeSignature: false
  },
  {
    id: 'stripe-none',
    nameAr: 'سادة بدون خطوط (وكالة خام)',
    color: 'بدون ستكر جانبي',
    stripeClass: 'bg-transparent',
    isDodgeSignature: false
  }
];

export const STRIPE_OPTIONS = DATSUN_STRIPES;

export const DATSUN_INTERIORS: InteriorOption[] = [
  {
    id: 'interior-beige-velour',
    nameAr: 'مخمل ياباني بيج كلاسيكي أصلي',
    materialAr: 'قماش مخمل أصلي مقاوم للحرارة والغبار',
    accentColor: 'بيج صحراوي دافئ',
    accentHex: '#CDB38B'
  },
  {
    id: 'interior-grey-sport',
    nameAr: 'مخمل رمادي عملي مع تطريز أحمر',
    materialAr: 'مخمل مقوى شاق ومريح للرحلات الطويلة',
    accentColor: 'رمادي غامق',
    accentHex: '#4A4A4A'
  },
  {
    id: 'interior-leather-custom',
    nameAr: 'جلد جملي فاخر تفصيل خاص',
    materialAr: 'جلد طبيعي مقاوم للبقع وسهل التنظيف',
    accentColor: 'بني عسلي جملي',
    accentHex: '#8B4513'
  }
];

export const INTERIOR_OPTIONS = DATSUN_INTERIORS;

export const DATSUN_ADDONS: TestDriveAddon[] = [
  {
    id: 'addon-shiraa',
    nameAr: 'شراع حوض تنزاني أصلي مع سحاب وعوازل',
    priceSAR: 650,
    descriptionAr: 'قماش شراع فاخر عازل للمطر والشمس لحماية الأمتعة والحوض.',
    categoryAr: 'تجهيزات الحوض'
  },
  {
    id: 'addon-shedd',
    nameAr: 'شد حوض بري ألمنيوم مع أبواب جانبية وسلة علوية',
    priceSAR: 2400,
    descriptionAr: 'شد كشتات خفيف الوزن وقوي مجهز لتركيب الخيمة وعزبة الطبخ.',
    categoryAr: 'تجهيزات الحوض'
  },
  {
    id: 'addon-headers',
    nameAr: 'هدرز ستانلس ستيل بحريني مع صمام صوت إلكتروني',
    priceSAR: 1800,
    descriptionAr: 'نغمة ددسن طربية نقية وتفتفة تطرب مع إمكانية كتم الصوت بكبسة زر.',
    categoryAr: 'الأداء ونغمة الشكمان'
  },
  {
    id: 'addon-tint',
    nameAr: 'تظليل نانو سيراميك عازل للحرارة بنسبة 85%',
    priceSAR: 800,
    descriptionAr: 'عزل حراري أمريكي لجميع النوافذ مع حماية فائقة من أشعة الشمس الصيفية.',
    categoryAr: 'الراحة والحماية'
  },
  {
    id: 'addon-seat-covers',
    nameAr: 'أغطية مقاعد مخمل كلاسيكية لحماية مقاعد الوكالة',
    priceSAR: 450,
    descriptionAr: 'تفصيل محكم بنفس نقشة قماش الوكالة 2012 الأصلي.',
    categoryAr: 'المقصورة'
  },
  {
    id: 'addon-foglights',
    nameAr: 'كشافات ضباب صفراء كلاسيكية هيلا للصدام',
    priceSAR: 550,
    descriptionAr: 'إضاءة ضباب صفراء نافذة للغبار والضباب وعواصف الرمال.',
    categoryAr: 'الإضاءة والسلامة'
  }
];

export const TEST_DRIVE_ADDONS = DATSUN_ADDONS;
