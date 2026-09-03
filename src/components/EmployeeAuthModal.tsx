import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, CheckCircle2, AlertTriangle, X, ArrowLeft, Key, Hash, UserCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { DodgeLogo } from './DodgeLogo';
import { Employee } from '../types';
import { findEmployeeByCode, getEmployees, getEmployeeByCodeAnyStatus } from '../services/employeeStorage';

interface EmployeeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (employee?: Employee) => void;
}

export const EmployeeAuthModal: React.FC<EmployeeAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Step 1: 'passcode' (x7), Step 2: 'badge' (3-digit employee code)
  const [step, setStep] = useState<'passcode' | 'badge'>('passcode');
  const [passcode, setPasscode] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [badgeError, setBadgeError] = useState<string | null>(null);
  const [verifiedEmployee, setVerifiedEmployee] = useState<Employee | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showActiveEmployeesHint, setShowActiveEmployeesHint] = useState(false);

  const passcodeInputRef = useRef<HTMLInputElement>(null);
  const badgeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('passcode');
      setPasscode('');
      setEmployeeCode('');
      setPasscodeError(false);
      setBadgeError(null);
      setVerifiedEmployee(null);
      setIsSuccess(false);
      setShowActiveEmployeesHint(false);

      setTimeout(() => {
        passcodeInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Step 1: Verification of passcode x7
  const handlePasscodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim().toLowerCase() === 'x7') {
      setPasscodeError(false);
      setStep('badge');
      setTimeout(() => {
        badgeInputRef.current?.focus();
      }, 100);
    } else {
      setPasscodeError(true);
      setPasscode('');
      passcodeInputRef.current?.focus();
    }
  };

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasscode(val);
    setPasscodeError(false);

    if (val.trim().toLowerCase() === 'x7') {
      setPasscodeError(false);
      setStep('badge');
      setTimeout(() => {
        badgeInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle Step 2: Verification of 3-digit employee badge number
  const handleBadgeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = employeeCode.trim();

    if (!cleanCode || cleanCode.length !== 3) {
      setBadgeError('يرجى إدخال الرقم الوظيفي المكون من 3 أرقام بدقة (مثال: 101، 202، 707).');
      return;
    }

    const employee = findEmployeeByCode(cleanCode);

    if (employee) {
      setBadgeError(null);
      setVerifiedEmployee(employee);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(employee);
        onClose();
      }, 800);
    } else {
      const anyStatusEmployee = getEmployeeByCodeAnyStatus(cleanCode);
      if (anyStatusEmployee && anyStatusEmployee.status === 'terminated') {
        setBadgeError(`⛔ تم طرد هذا الموظف (${anyStatusEmployee.fullName}) وإنهاء خدماته رسمياً بقرار إداري! السبب: "${anyStatusEmployee.terminationReason || 'سحب الصلاحيات وفصل مباشر'}" - تم سحب اعتماده نهائياً.`);
      } else if (anyStatusEmployee && anyStatusEmployee.status === 'suspended') {
        setBadgeError(`⚠️ حساب الموظف (${anyStatusEmployee.fullName}) معلق مؤقتاً من قبل الإدارة. يرجى مراجعة إدارة الفرع.`);
      } else {
        setBadgeError(`الرقم الوظيفي [${cleanCode}] غير مسجل بالنظام! تأكد من الرقم أو راجع الإدارة لتسجيله.`);
      }
      setEmployeeCode('');
      badgeInputRef.current?.focus();
    }
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // digits only
    setEmployeeCode(val);
    setBadgeError(null);

    // If 3 digits are entered, auto check
    if (val.length === 3) {
      const employee = findEmployeeByCode(val);
      if (employee) {
        setBadgeError(null);
        setVerifiedEmployee(employee);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(employee);
          onClose();
        }, 800);
      } else {
        const anyStatusEmployee = getEmployeeByCodeAnyStatus(val);
        if (anyStatusEmployee && anyStatusEmployee.status === 'terminated') {
          setBadgeError(`⛔ تم طرد هذا الموظف (${anyStatusEmployee.fullName}) وإنهاء خدماته رسمياً بقرار إداري! السبب: "${anyStatusEmployee.terminationReason || 'سحب الصلاحيات وفصل مباشر'}"`);
        } else if (anyStatusEmployee && anyStatusEmployee.status === 'suspended') {
          setBadgeError(`⚠️ حساب الموظف (${anyStatusEmployee.fullName}) معلق مؤقتاً من قبل الإدارة.`);
        }
      }
    }
  };

  const activeEmployees = getEmployees().filter(e => e.status === 'active');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-right overflow-hidden transition-all"
        style={{
          boxShadow: isSuccess 
            ? '0 0 45px rgba(16, 185, 129, 0.4)' 
            : (passcodeError || badgeError)
              ? '0 0 45px rgba(220, 38, 38, 0.4)' 
              : '0 0 40px rgba(0,0,0,0.8)'
        }}
      >
        {/* Top Dodge Signature Red Accent Line */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Dodge Logo and Step Badge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                STAFF VERIFICATION
              </span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 pt-1">
            <div className={`flex-1 h-1.5 rounded-full transition-all ${
              step === 'passcode' ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-emerald-500'
            }`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${
              step === 'badge' ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-neutral-800'
            }`} />
          </div>

          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              {step === 'passcode' 
                ? 'تسجيل دخول موظفي دودج دورانجو' 
                : 'التحقق من الرقم الوظيفي المعتمد'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {step === 'passcode' ? (
                <>يرجى إدخال رمز التحقق السري للمتابعة للوصول إلى لوحة الموظفين:</>
              ) : (
                <>تم قبول رمز التحقق بنجاح. أدخل الآن <strong className="text-white">رقمك الوظيفي المعتمد (المكون من 3 أرقام)</strong> الصادر من الإدارة:</>
              )}
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: Passcode x7 Form                                           */}
        {/* =================================================================== */}
        {step === 'passcode' && (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                <label>1. رمز الموظفين السري (كلمة المرور مخفية):</label>
                <span className="text-[11px] font-mono text-neutral-500">STAFF AUTH</span>
              </div>
              
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={passcodeInputRef}
                  type="password"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  placeholder="أدخل رمز الموظفين..."
                  autoComplete="off"
                  className={`w-full bg-neutral-950 border rounded-xl pr-10 pl-4 py-3 text-white text-base tracking-[0.3em] font-mono focus:outline-none transition-all ${
                    passcodeError 
                      ? 'border-red-600 bg-red-950/20 text-red-300 ring-2 ring-red-600/30 animate-pulse' 
                      : 'border-neutral-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20'
                  }`}
                />
              </div>

              {passcodeError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 font-bold pt-1 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>رمز الدخول غير صحيح! يرجى إدخال الرمز المعتمد للموظفين.</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>المتابعة للرقم الوظيفي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* =================================================================== */}
        {/* STEP 2: 3-Digit Employee ID Verification Form                      */}
        {/* =================================================================== */}
        {step === 'badge' && (
          <form onSubmit={handleBadgeSubmit} className="space-y-4">
            
            {/* Step 1 Passed Badge */}
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>رمز الموظفين (<strong className="font-mono">x7</strong>) معتمد بنجاح</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('passcode')}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
              >
                تغيير
              </button>
            </div>

            {/* 3-Digit Employee ID Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                <label className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-red-500" />
                  2. رقمك الوظيفي المعتمد من الإدارة (3 أرقام فقط):
                </label>
                <span className="text-[11px] font-mono text-neutral-500">ID // ###</span>
              </div>

              <div className="relative">
                <input
                  ref={badgeInputRef}
                  type="text"
                  maxLength={3}
                  value={employeeCode}
                  onChange={handleBadgeChange}
                  placeholder="مثال: 101 أو 707"
                  autoComplete="off"
                  disabled={isSuccess}
                  className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] font-mono font-black focus:outline-none transition-all ${
                    badgeError
                      ? 'border-red-600 bg-red-950/20 text-red-300 ring-2 ring-red-600/30'
                      : isSuccess
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                        : 'border-neutral-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20'
                  }`}
                />
              </div>

              {/* Error Message */}
              {badgeError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 space-y-1 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{badgeError}</span>
                  </div>
                </div>
              )}

              {/* Success Card with Employee Details */}
              {isSuccess && verifiedEmployee && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-600 text-xs text-emerald-300 space-y-2 shadow-lg animate-in zoom-in-95">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span>تم التحقق واعتماد الصلاحيات بنجاح!</span>
                  </div>
                  <div className="bg-neutral-950/80 p-2.5 rounded-xl border border-emerald-900/60 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">اسم الموظف:</span>
                      <strong className="text-white">{verifiedEmployee.fullName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">الرقم الوظيفي:</span>
                      <span className="font-mono text-emerald-400 font-bold">#{verifiedEmployee.employeeCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">المسمى الوظيفي:</span>
                      <span className="text-neutral-200">{verifiedEmployee.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 block text-center">
                    جاري توجيهك إلى لوحة التحكم الآن...
                  </span>
                </div>
              )}
            </div>

            {/* Hint / Sample Badges Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowActiveEmployeesHint(!showActiveEmployeesHint)}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                <span>نسيت رقمك الوظيفي؟ استعرض الأرقام النشطة أو راجع الإدارة</span>
              </button>

              {showActiveEmployeesHint && (
                <div className="mt-2 p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-[11px] text-neutral-300 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-1.5">
                    <span className="text-neutral-400 font-bold">الموظفون المسجلون حالياً بالنظام:</span>
                    <span className="text-[10px] font-mono text-neutral-500">DODGE STAFF</span>
                  </div>
                  <div className="space-y-1">
                    {activeEmployees.slice(0, 4).map((emp) => (
                      <div 
                        key={emp.id}
                        onClick={() => {
                          setEmployeeCode(emp.employeeCode);
                          setBadgeError(null);
                        }}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-neutral-900 cursor-pointer transition-colors"
                      >
                        <span>{emp.fullName} ({emp.role})</span>
                        <span className="font-mono font-bold text-red-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                          #{emp.employeeCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('passcode')}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لرمز x7</span>
              </button>

              <button
                type="submit"
                disabled={isSuccess}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>التحقق وتأكيد الدخول</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Security Note */}
        <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>نظام حماية موظفي دودج دورانجو V8</span>
          <span className="font-mono text-neutral-600">AUTH // LEVEL-2 // DODGE-HQ</span>
        </div>
      </div>
    </div>
  );
};

