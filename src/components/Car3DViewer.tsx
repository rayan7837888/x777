import React, { useState, useRef, useEffect } from 'react';
import { DURANGO_IMAGES } from '../data/durangoData';
import { DodgeLogo } from './DodgeLogo';
import { 
  Rotate3d, 
  Eye, 
  Sun, 
  Moon, 
  Maximize2, 
  Layers, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause,
  Compass,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Car3DViewerProps {
  currentColorHex: string;
  currentColorName: string;
  currentColorTint: string;
  stripeColor: string;
  hasStripes: boolean;
  isDodgeSignatureStripe: boolean;
  trimName: string;
  engineBadge: string;
  wheelName: string;
}

type CameraAnglePreset = 'perspective' | 'front' | 'side' | 'rear' | 'hood';
type LightingEnv = 'studio' | 'sunset' | 'track' | 'neon';

export const Car3DViewer: React.FC<Car3DViewerProps> = ({
  currentColorHex,
  currentColorName,
  currentColorTint,
  stripeColor,
  hasStripes,
  isDodgeSignatureStripe,
  trimName,
  engineBadge,
  wheelName,
}) => {
  // 3D rotation state
  const [yaw, setYaw] = useState<number>(-12); // horizontal angle in degrees
  const [pitch, setPitch] = useState<number>(4); // vertical tilt
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [activeAngle, setActiveAngle] = useState<CameraAnglePreset>('perspective');
  const [lightingEnv, setLightingEnv] = useState<LightingEnv>('studio');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + 1.2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Handle Drag / Touch rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setYaw((prev) => (prev + deltaX * 0.4) % 360);
    setPitch((prev) => Math.max(-15, Math.min(25, prev - deltaY * 0.2)));
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;
    setYaw((prev) => (prev + deltaX * 0.4) % 360);
    setPitch((prev) => Math.max(-15, Math.min(25, prev - deltaY * 0.2)));
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const setPresetAngle = (preset: CameraAnglePreset) => {
    setActiveAngle(preset);
    setIsAutoRotating(false);
    switch (preset) {
      case 'perspective':
        setYaw(-15);
        setPitch(5);
        setZoom(1);
        break;
      case 'front':
        setYaw(0);
        setPitch(2);
        setZoom(1.05);
        break;
      case 'side':
        setYaw(38);
        setPitch(0);
        setZoom(0.95);
        break;
      case 'rear':
        setYaw(165);
        setPitch(4);
        setZoom(1);
        break;
      case 'hood':
        setYaw(-8);
        setPitch(18);
        setZoom(1.15);
        break;
    }
  };

  // Calculate dynamic lighting gradient based on yaw
  const lightAngle = (yaw + 45) % 360;

  // Environment styling
  const envStyles: Record<LightingEnv, { bg: string; glow: string; name: string }> = {
    studio: {
      bg: 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950',
      glow: 'rgba(220, 38, 38, 0.25)',
      name: 'استوديو سباقات دودج'
    },
    sunset: {
      bg: 'bg-gradient-to-b from-neutral-950 via-amber-950/40 to-neutral-950',
      glow: 'rgba(245, 158, 11, 0.25)',
      name: 'غروب المسار الصحراوي'
    },
    track: {
      bg: 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950',
      glow: 'rgba(59, 130, 246, 0.25)',
      name: 'حلبة نوربورغرينغ'
    },
    neon: {
      bg: 'bg-gradient-to-b from-neutral-950 via-purple-950/30 to-neutral-950',
      glow: 'rgba(168, 85, 247, 0.25)',
      name: 'نيون دايتونا ليلي'
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl space-y-3" dir="rtl">
      
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-3">
          <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
          <span className="text-neutral-600">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-500">
            <Rotate3d className="w-4 h-4 animate-spin-slow" />
            <span>عرض 3D تفاعلي مجسم بزاوية 360°</span>
          </div>
        </div>

        {/* 3D Angle Presets */}
        <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setPresetAngle('perspective')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeAngle === 'perspective' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            منظور 3/4
          </button>
          <button
            onClick={() => setPresetAngle('hood')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeAngle === 'hood' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الكبوت والخطين
          </button>
          <button
            onClick={() => setPresetAngle('side')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeAngle === 'side' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            جانبية
          </button>
          <button
            onClick={() => setPresetAngle('front')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeAngle === 'front' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            مقدمة هيمي
          </button>
          <button
            onClick={() => setPresetAngle('rear')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeAngle === 'rear' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            عوادم خلفية
          </button>
        </div>

        {/* Action buttons (Auto-Rotate, Zoom, Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
              isAutoRotating 
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.5)]' 
                : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={isAutoRotating ? 'إيقاف الدوران 360' : 'تشغيل الدوران التلقائي 360'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">دوران 360°</span>
          </button>

          <button
            onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(0.75, prev - 0.1))}
            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MAIN 3D CAR STAGE */}
      <div 
        className={`relative h-[380px] sm:h-[480px] w-full flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing ${envStyles[lightingEnv].bg}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ perspective: '1200px' }}
      >
        
        {/* Dynamic 3D Grid Floor with Dodge Track markings */}
        <div 
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none opacity-40"
          style={{
            transform: `perspective(600px) rotateX(75deg) translateZ(-40px) rotateZ(${yaw * 0.3}deg)`,
            background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.4) 0%, rgba(20, 20, 20, 0.8) 50%, transparent 80%), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 30px)'
          }}
        />

        {/* Ambient Specular Shadow beneath car */}
        <div 
          className="absolute bottom-12 w-[340px] sm:w-[480px] h-12 bg-black/85 rounded-full blur-xl pointer-events-none transition-transform duration-300"
          style={{
            transform: `scale(${zoom}) rotate(${yaw * 0.2}deg)`,
            boxShadow: `0 0 40px ${envStyles[lightingEnv].glow}`
          }}
        />

        {/* THE 3D CAR TRANSFORMATION CONTAINER */}
        <div 
          className="relative w-full max-w-[620px] aspect-[16/9] flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateY(${yaw}deg) rotateX(${pitch}deg)`,
          }}
        >

          {/* BASE CAR RENDER (DURANGO 2025 HIGH RESOLUTION) */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            
            <img
              src={DURANGO_IMAGES.hero}
              alt="Dodge Durango 2025 3D"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* DYNAMIC 3D COLOR TINT LAYER */}
            <div 
              className="absolute inset-0 mix-blend-color transition-all duration-300 pointer-events-none"
              style={{ 
                backgroundColor: currentColorHex, 
                opacity: 0.42
              }}
            />

            {/* DYNAMIC 3D METALLIC SHEEN SHADER (reacts to yaw & light angle) */}
            <div 
              className="absolute inset-0 mix-blend-screen pointer-events-none transition-all duration-150"
              style={{
                background: `linear-gradient(${lightAngle}deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)`,
                opacity: 0.6
              }}
            />

            {/* DYNAMIC DODGE TWIN RED STRIPES 3D LAYER */}
            {hasStripes && (
              <div 
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden transition-all duration-300"
                style={{
                  transform: `translateX(${yaw * -0.5}px) skewX(${20 + pitch * 0.5}deg)`,
                  opacity: 0.9
                }}
              >
                <div className="flex gap-2.5 transform rotate-6 scale-125">
                  <div 
                    className="w-4 sm:w-6 h-[600px] shadow-[0_0_18px_rgba(220,38,38,0.7)] transition-all duration-300"
                    style={{ backgroundColor: stripeColor }}
                  />
                  <div 
                    className="w-4 sm:w-6 h-[600px] shadow-[0_0_18px_rgba(220,38,38,0.7)] transition-all duration-300"
                    style={{ backgroundColor: stripeColor }}
                  />
                </div>
              </div>
            )}

            {/* Dodge Official Watermark Overlay inside car rendering */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-70 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-white/90">DODGE // 3D REAL-TIME</span>
              <div className="flex gap-0.5 transform -skew-x-[24deg]">
                <div className="w-1 h-3 bg-red-600" />
                <div className="w-1 h-3 bg-red-600" />
              </div>
            </div>

          </div>

        </div>

        {/* Floating 3D Interaction Compass / Hint */}
        <div className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-neutral-300 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>اسحب بالماوس أو اللمس للتدوير 3D</span>
          <span className="text-neutral-500 font-mono">({Math.round(yaw)}°)</span>
        </div>

        {/* Selected Paint Chip Indicator */}
        <div className="absolute top-4 left-4 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-2xl p-2.5 flex items-center gap-3 text-xs">
          <span 
            className="w-5 h-5 rounded-full border border-white/30 shadow-md block"
            style={{ backgroundColor: currentColorHex }}
          />
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block font-mono">الطلاء ثلاثي الأبعاد المطبق</span>
            <span className="font-bold text-white">{currentColorName}</span>
          </div>
        </div>

        {/* Environment Lighting Switcher */}
        <div className="absolute bottom-4 right-4 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-2xl p-1.5 flex items-center gap-1">
          <span className="text-[10px] text-neutral-400 px-2 font-mono">بيئة الإضاءة:</span>
          {(['studio', 'sunset', 'track', 'neon'] as LightingEnv[]).map((env) => (
            <button
              key={env}
              onClick={() => setLightingEnv(env)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                lightingEnv === env 
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {env === 'studio' && 'استوديو'}
              {env === 'sunset' && 'غروب'}
              {env === 'track' && 'حلبة'}
              {env === 'neon' && 'نيون'}
            </button>
          ))}
        </div>

      </div>

      {/* Footer Info Bar of 3D Model */}
      <div className="p-3 bg-neutral-900/60 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">{trimName}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-red-500 font-mono font-bold">{engineBadge}</span>
          <span className="text-neutral-600">•</span>
          <span>{wheelName}</span>
        </div>

        <div className="flex items-center gap-2">
          {hasStripes && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              مُجهز بخطين دوج الحمر
            </span>
          )}
          <span className="text-neutral-500 text-[10px] font-mono">RENDER: 2025 3D ENGINE</span>
        </div>
      </div>

    </div>
  );
};
