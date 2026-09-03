import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Gauge, Zap } from 'lucide-react';

interface ExhaustSoundPlayerProps {
  engineType?: 'hemi57' | 'hemi392' | 'hellcat62';
}

export const ExhaustSoundPlayer: React.FC<ExhaustSoundPlayerProps> = ({
  engineType = 'hellcat62'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevving, setIsRevving] = useState(false);
  const [rpm, setRpm] = useState(850);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineNodeRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    subOsc: OscillatorNode;
    noiseNode: AudioBufferSourceNode | null;
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
  } | null>(null);

  const requestRef = useRef<number | null>(null);

  // Initialize or resume audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startEngine = () => {
    try {
      const ctx = getAudioContext();
      if (engineNodeRef.current) return;

      const baseFreq = engineType === 'hellcat62' ? 58 : engineType === 'hemi392' ? 52 : 48;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const subOsc = ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      subOsc.type = 'sawtooth';

      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
      subOsc.frequency.setValueAtTime(baseFreq * 0.5, ctx.currentTime);

      // Lowpass filter to simulate deep exhaust rumble
      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(260, ctx.currentTime);
      filterNode.Q.setValueAtTime(3.5, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.3);

      osc1.connect(filterNode);
      osc2.connect(filterNode);
      subOsc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      subOsc.start();

      engineNodeRef.current = {
        osc1,
        osc2,
        subOsc,
        noiseNode: null,
        gainNode,
        filterNode
      };

      setIsPlaying(true);
      setRpm(850);
    } catch (e) {
      console.error('Audio engine start failed', e);
    }
  };

  const stopEngine = () => {
    if (engineNodeRef.current && audioCtxRef.current) {
      const { gainNode, osc1, osc2, subOsc } = engineNodeRef.current;
      const ctx = audioCtxRef.current;
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          subOsc.stop();
          osc1.disconnect();
          osc2.disconnect();
          subOsc.disconnect();
        } catch {
          // ignore
        }
        engineNodeRef.current = null;
        setIsPlaying(false);
        setIsRevving(false);
        setRpm(0);
      }, 200);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopEngine();
    } else {
      startEngine();
    }
  };

  // Throttle revving
  const handleRevStart = () => {
    if (!isPlaying) {
      startEngine();
    }
    setIsRevving(true);
  };

  const handleRevEnd = () => {
    setIsRevving(false);
  };

  useEffect(() => {
    if (!isPlaying || !engineNodeRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const { osc1, osc2, subOsc, filterNode, gainNode } = engineNodeRef.current;

    const targetRpm = isRevving ? (engineType === 'hellcat62' ? 6400 : 5800) : 850;
    const currentRpm = rpm;
    const diff = targetRpm - currentRpm;
    const step = isRevving ? 220 : 120;

    const newRpm = isRevving 
      ? Math.min(targetRpm, currentRpm + step)
      : Math.max(targetRpm, currentRpm - step);

    setRpm(newRpm);

    // Map RPM to audio frequencies
    const baseFreq = (newRpm / 60) * 4; // 8 cylinders, 4 firings per rev
    osc1.frequency.setTargetAtTime(baseFreq * 0.8, ctx.currentTime, 0.05);
    osc2.frequency.setTargetAtTime(baseFreq * 1.6, ctx.currentTime, 0.05);
    subOsc.frequency.setTargetAtTime(baseFreq * 0.4, ctx.currentTime, 0.05);

    // Filter opens up as throttle opens
    const filterFreq = 180 + (newRpm / 6000) * 1400;
    filterNode.frequency.setTargetAtTime(filterFreq, ctx.currentTime, 0.05);

    // Volume increases with revs
    const targetGain = isRevving ? 0.45 : 0.22;
    gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);

    const timer = setTimeout(() => {
      // Loop update until stable
      if (isPlaying) {
        requestRef.current = requestAnimationFrame(() => {});
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [isPlaying, isRevving, rpm, engineType]);

  useEffect(() => {
    return () => {
      stopEngine();
    };
  }, []);

  const engineNameLabel = 
    engineType === 'hellcat62' ? '6.2L Hellcat Supercharged V8' :
    engineType === 'hemi392' ? '6.4L (392) SRT HEMI V8' :
    '5.7L HEMI V8';

  return (
    <div 
      id="durango-exhaust-sound-simulator"
      className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden"
      dir="rtl"
    >
      {/* Red accent line */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-neutral-900" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex gap-1 transform -skew-x-[24deg]">
              <span className="w-1.5 h-3.5 bg-red-600 block rounded-[1px]" />
              <span className="w-1.5 h-3.5 bg-red-600 block rounded-[1px]" />
            </span>
            <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              محاكي صوت عادم هيمي V8 التفاعلي
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            استمع إلى الهدير الصافي لمحرك <span className="text-red-400 font-bold">{engineNameLabel}</span>
          </p>
        </div>

        {/* Start / Stop ignition button */}
        <button
          id="btn-engine-ignition-toggle"
          type="button"
          onClick={toggleSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-white animate-pulse" />
              <span>إيقاف المحرك (STOP)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-red-500" />
              <span className="text-red-400">تشغيل المحرك (START HEMI)</span>
            </>
          )}
        </button>
      </div>

      {/* Tachometer gauge and Rev Pedal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-neutral-950/80 rounded-xl p-3 sm:p-4 border border-neutral-800/80">
        
        {/* RPM Gauge */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full border-2 border-neutral-700 flex items-center justify-center bg-neutral-900">
            <Gauge className={`w-7 h-7 ${isPlaying ? 'text-red-500 animate-spin-slow' : 'text-neutral-600'}`} />
            {isRevving && (
              <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
            )}
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <span>عداد دوران المحرك</span>
              <span className="text-neutral-500 font-mono">RPM</span>
            </div>
            <div className="text-2xl font-black font-num text-white tracking-wider">
              {isPlaying ? rpm.toLocaleString() : '0'} <span className="text-xs text-neutral-500 font-normal">د/د</span>
            </div>
          </div>
        </div>

        {/* Exhaust flame & state */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="flex items-center gap-2">
            <Flame 
              className={`w-6 h-6 transition-colors duration-200 ${
                isRevving 
                  ? 'text-orange-500 animate-bounce scale-125' 
                  : isPlaying 
                    ? 'text-red-500' 
                    : 'text-neutral-700'
              }`} 
            />
            <div className="text-xs">
              <span className="text-neutral-400 block">حالة العادم الثنائي:</span>
              <span className={`font-bold ${isRevving ? 'text-orange-400' : isPlaying ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {isRevving ? 'تسارع أقصى وعادم ناري 🔥' : isPlaying ? 'دوران خامل هادئ (Idle)' : 'المحرك مطفأ'}
              </span>
            </div>
          </div>
        </div>

        {/* Hold to Rev Button */}
        <div className="flex justify-end">
          <button
            id="btn-durango-gas-pedal"
            type="button"
            onMouseDown={handleRevStart}
            onMouseUp={handleRevEnd}
            onMouseLeave={handleRevEnd}
            onTouchStart={handleRevStart}
            onTouchEnd={handleRevEnd}
            disabled={!isPlaying}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-black text-sm tracking-wider flex items-center justify-center gap-2 transition-all select-none cursor-pointer ${
              !isPlaying 
                ? 'opacity-40 bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : isRevving 
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-95'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-red-900/60 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
            }`}
          >
            <Zap className={`w-4 h-4 ${isRevving ? 'text-yellow-300 animate-pulse' : 'text-red-500'}`} />
            <span>اضغط مطولاً لدعس البنزين (REV IT!)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
