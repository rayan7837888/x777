import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, CheckCircle2, AlertTriangle, X, Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { DodgeLogo } from './DodgeLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(null);
      setIsSuccess(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = passcode.trim().toLowerCase();

    if (cleanCode === 'meilods') {
      setError(null);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } else {
      setError('رمز الإدارة غير صحيح! الصلاحية مخصصة لمسؤولي دودج دورانجو المعتمدين فقط.');
      setPasscode('');
      inputRef.current?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(220,38,38,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Racing Accent line */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-900 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              SECURITY CHECKPOINT
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              <span>تسجيل دخول الإدارة العليا</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              يرجى إدخال رمز الإدارة المعتمد للوصول إلى لوحة التحكم والتوظيف وإدارة الكادر:
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
              <label>رمز الإدارة السري:</label>
              <span className="text-[11px] font-mono text-neutral-500">ADMIN PASSCODE</span>
            </div>

            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(null);
                }}
                placeholder="أدخل رمز الإدارة..."
                autoComplete="off"
                className={`w-full bg-neutral-950 border rounded-xl pr-10 pl-11 py-3 text-white text-base tracking-widest font-mono focus:outline-none transition-all ${
                  error 
                    ? 'border-red-600 bg-red-950/20 text-red-300 ring-2 ring-red-600/30' 
                    : 'border-neutral-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                title={showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 font-bold pt-1 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم التحقق من رمز الإدارة بنجاح! جاري فتح لوحة التحكم...</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSuccess || !passcode.trim()}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تأكيد الدخول</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
