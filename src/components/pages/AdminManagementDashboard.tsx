import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Check, Trash2, Search, Building2, 
  Phone, Mail, Calendar, Hash, ArrowLeft, X, Flame, Sparkles, 
  RefreshCw, CheckCircle2, AlertTriangle, Key, ArrowRight, UserCheck, 
  UserX, Shield, Lock, ExternalLink, UserMinus, Ban, AlertOctagon,
  FileWarning, ShieldAlert, FileDown, MessageSquare, Radio
} from 'lucide-react';
import { Employee } from '../../types';
import { 
  getEmployees, saveEmployee, updateEmployee, deleteEmployee, 
  generateUnique3DigitCode, isCodeTaken, resetEmployeesToDefaults,
  terminateEmployee, restoreEmployee
} from '../../services/employeeStorage';
import { staffChatClient } from '../../services/staffChatService';
import { DodgeLogo } from '../DodgeLogo';
import { AdminExportPdfModal } from '../AdminExportPdfModal';
import { StaffChatView } from '../StaffChatView';

interface AdminManagementDashboardProps {
  onExit: () => void;
  onGoToEmployeePortal: () => void;
}

export const AdminManagementDashboard: React.FC<AdminManagementDashboardProps> = ({
  onExit,
  onGoToEmployeePortal
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'terminated'>('all');
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatOnlineCount, setChatOnlineCount] = useState(0);
  const [terminateModalEmployee, setTerminateModalEmployee] = useState<Employee | null>(null);
  const [terminationReason, setTerminationReason] = useState('مخالفة معايير قيادة هيلكات SRT والحلبات والسلامة');
  const [customReason, setCustomReason] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Employee Form State
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('استشاري مبيعات أول - هيلكات وهيمي V8');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('الرياض - طريق خريص');
  const [employeeCode, setEmployeeCode] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const list = getEmployees();
    setEmployees(list);
  };

  useEffect(() => {
    loadData();

    // Subscribe to staff chat presence
    const unsub = staffChatClient.subscribe((state) => {
      setChatOnlineCount(state.onlineStaff.length);
    });

    return () => {
      unsub();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleOpenHireModal = () => {
    const generatedCode = generateUnique3DigitCode();
    setEmployeeCode(generatedCode);
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setRole('استشاري مبيعات أول - هيلكات وهيمي V8');
    setBranch('الرياض - طريق خريص');
    setFormError(null);
    setIsHireModalOpen(true);
  };

  const handleGenerateNewCode = () => {
    const newCode = generateUnique3DigitCode();
    setEmployeeCode(newCode);
    setFormError(null);
  };

  const handleSaveNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanCode = employeeCode.trim();
    if (!/^\d{3}$/.test(cleanCode)) {
      setFormError('يجب أن يتكون الرقم الوظيفي بدقة من 3 أرقام فقط (مثال: 105، 707، 990)');
      return;
    }

    if (isCodeTaken(cleanCode)) {
      setFormError(`الرقم الوظيفي [${cleanCode}] مستخدم بالفعل لموظف آخر! يرجى اختيار رقم آخر أو توليد رقم تلقائي.`);
      return;
    }

    if (!fullName.trim()) {
      setFormError('يرجى كتابة اسم الموظف كاملاً.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const created = saveEmployee({
      employeeCode: cleanCode,
      fullName: fullName.trim(),
      role: role.trim(),
      phone: phone.trim() || '05XXXXXXXX',
      email: email.trim() || `staff.${cleanCode}@dodge-ksa.com`,
      branch: branch,
      hireDate: todayStr,
      status: 'active',
      notes: notes.trim() || 'تم التوظيف واعتماد الصلاحيات عبر لوحة الإدارة العليا',
      ordersHandled: 0
    });

    loadData();
    setIsHireModalOpen(false);
    showToast(`تم توظيف الموظف (${created.fullName}) بنجاح! وتم إصدار الرقم الوظيفي الرسمي [${created.employeeCode}].`);
  };

  const handleToggleStatus = (emp: Employee) => {
    const nextStatus = emp.status === 'active' ? 'suspended' : 'active';
    updateEmployee(emp.id, { status: nextStatus });
    loadData();
    showToast(
      nextStatus === 'active' 
        ? `تم تفعيل حساب الموظف [${emp.fullName}] برقم وظيفي [${emp.employeeCode}].`
        : `تم تعليق حساب الموظف [${emp.fullName}] مؤقتاً ومنعه من الدخول.`,
      nextStatus === 'active' ? 'success' : 'error'
    );
  };

  const handleDeleteEmployee = (emp: Employee) => {
    if (window.confirm(`هل أنت متأكد من حذف الموظف (${emp.fullName}) وإلغاء الرقم الوظيفي [${emp.employeeCode}] نهائياً؟`)) {
      deleteEmployee(emp.id);
      loadData();
      showToast(`تم حذف الموظف (${emp.fullName}) وإلغاء الرقم الوظيفي.`);
    }
  };

  const handleOpenTerminateModal = (emp: Employee) => {
    setTerminateModalEmployee(emp);
    setTerminationReason('مخالفة معايير قيادة هيلكات SRT والحلبات والسلامة');
    setCustomReason('');
  };

  const handleConfirmTerminate = (permanentDelete: boolean = false) => {
    if (!terminateModalEmployee) return;

    const finalReason = customReason.trim() || terminationReason;

    if (permanentDelete) {
      deleteEmployee(terminateModalEmployee.id);
      loadData();
      showToast(`تم طرد الموظف (${terminateModalEmployee.fullName}) وحذف سجله وإلغاء الرقم الوظيفي [${terminateModalEmployee.employeeCode}] نهائياً.`, 'error');
    } else {
      terminateEmployee(terminateModalEmployee.id, finalReason);
      loadData();
      showToast(`تم إصدار قرار طرد الموظف (${terminateModalEmployee.fullName}) وسحب الصلاحيات وإدراج الواقعة في السجل التأديبي.`, 'error');
    }

    setTerminateModalEmployee(null);
  };

  const handleRestoreEmployee = (emp: Employee) => {
    restoreEmployee(emp.id);
    loadData();
    showToast(`تم رفع قرار الطرد وإعادة تفعيل الموظف (${emp.fullName}) برقم وظيفي [${emp.employeeCode}].`, 'success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast(`تم نسخ الرقم الوظيفي [${code}] للحافظة`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة قائمة الموظفين الافتراضية المعتمدة؟')) {
      resetEmployeesToDefaults();
      loadData();
      showToast('تمت استعادة الكادر الوظيفي الافتراضي بنجاح');
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.terminationReason && emp.terminationReason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch = selectedBranchFilter === 'all' || emp.branch.includes(selectedBranchFilter);
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const activeCount = employees.filter(e => e.status === 'active').length;
  const suspendedCount = employees.filter(e => e.status === 'suspended').length;
  const terminatedCount = employees.filter(e => e.status === 'terminated').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 border-2 ${
            notification.type === 'success' 
              ? 'bg-neutral-900 border-emerald-500 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
              : 'bg-neutral-900 border-red-500 text-red-300 shadow-[0_0_30px_rgba(220,38,38,0.4)]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <DodgeLogo size="md" showArabic={true} showEnglish={true} />
                <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  HQ ADMIN & HR SYSTEM
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                لوحة تحكم الإدارة العليا وإدارة التوظيف
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                مركز إدارة وتوظيف الكادر الوظيفي لدودج دورانجو 2025. يتم إصدار <strong className="text-white">رقم وظيفي معتمد من 3 أرقام</strong> لكل موظف لاستخدامه في التحقق وتسجيل الدخول.
              </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsChatModalOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-600 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-lg group relative"
                title="فتح شات تواصل الموظفين المباشر وإصدار التوجيهات"
              >
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping" />
                </div>
                <span>شات الموظفين (أونلاين)</span>
                {chatOnlineCount > 0 && (
                  <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full">
                    {chatOnlineCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenHireModal}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>توظيف موظف جديد (+3 أرقام)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-600 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-lg group"
                title="تصدير قائمة الموظفين المسجلين أو تقرير حجوزات العملاء بصيغة PDF"
              >
                <FileDown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>تصدير كـ PDF</span>
              </button>

              <button
                type="button"
                onClick={onGoToEmployeePortal}
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                title="الانتقال إلى بوابة موظفي المبيعات والحجوزات"
              >
                <Key className="w-4 h-4 text-red-400" />
                <span>بوابة الموظفين</span>
              </button>

              <button
                type="button"
                onClick={onExit}
                className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة لمعرض السيارات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informative Workflow Step Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-red-950/30 to-neutral-900 border border-red-900/40 rounded-3xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">نظام اعتماد وتوثيق موظفي دودج دورانجو</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  يتم إصدار <strong className="text-white">رقم وظيفي معتمد (3 أرقام)</strong> لكل موظف بعد تعيينه لتمكينه من إدارة حجوزات وتجارب قيادة سيارات SRT ومتابعة طلبات العملاء.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleResetDefaults}
                type="button"
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-xl cursor-pointer transition-colors"
                title="استعادة الموظفين الافتراضيين"
              >
                <RefreshCw className="w-3 h-3" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold">إجمالي الكادر</span>
              <Users className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-num">
              {employees.length}
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">موظف مسجل بالنظام</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold">الموظفون المفعّلون</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-num">
              {activeCount}
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">مخول لهم بالدخول فوراً</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold">الحسابات المعلقة</span>
              <UserX className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-num">
              {suspendedCount}
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">تم إيقاف دخولهم مؤقتاً</span>
          </div>

          <div className="bg-neutral-900 border border-red-900/60 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-red-950/30 to-neutral-900">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-xs font-bold">المطرودون / المفصولون</span>
              <UserMinus className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-400 font-num">
              {terminatedCount}
            </div>
            <span className="text-[10px] text-neutral-400 block mt-1">سحب الصلاحيات وإنهاء الخدمة</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-xs font-bold">صيغة الرقم الوظيفي</span>
              <Hash className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              [###] <span className="text-xs text-neutral-400 font-sans">3 أرقام</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">معيار أمان دودج المعتمد</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              الجميع ({employees.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow'
                  : 'text-neutral-400 hover:text-emerald-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              النشطون ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'suspended'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 shadow'
                  : 'text-neutral-400 hover:text-amber-300'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              المعلقون ({suspendedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('terminated')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'terminated'
                  ? 'bg-red-950 text-red-300 border border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'text-red-400/80 hover:text-red-300'
              }`}
            >
              <UserMinus className="w-3.5 h-3.5" />
              المطرودون ({terminatedCount})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم أو سبب الطرد..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400 shrink-0">الفرع:</span>
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
              >
                <option value="all">جميع الفروع</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
              </select>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-red-600 text-neutral-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="تصدير التقارير كـ PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">تصدير PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Employees Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const isActive = emp.status === 'active';
            const isTerminated = emp.status === 'terminated';
            return (
              <div
                key={emp.id}
                className={`bg-neutral-900 border rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between gap-4 ${
                  isTerminated
                    ? 'border-red-600/80 bg-gradient-to-b from-red-950/25 to-neutral-900 shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                    : isActive 
                      ? 'border-neutral-800 hover:border-neutral-700' 
                      : 'border-amber-900/40 bg-neutral-950/60 opacity-85'
                }`}
              >
                {/* Employee Header with 3-Digit Badge */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner shrink-0 ${
                        isTerminated
                          ? 'bg-red-950 border-red-800 text-red-500'
                          : 'bg-neutral-950 border-neutral-800 text-red-500'
                      }`}>
                        {isTerminated ? <Ban className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                          {emp.fullName}
                          {isTerminated && (
                            <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                              مطرود
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-neutral-400 block mt-0.5">
                          {emp.role}
                        </span>
                      </div>
                    </div>

                    {/* 3-Digit Badge Highlight */}
                    <div 
                      onClick={() => handleCopyCode(emp.employeeCode)}
                      className={`text-center border px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${
                        isTerminated
                          ? 'bg-neutral-950 border-red-900/80 text-neutral-500 hover:border-red-600 opacity-60'
                          : 'bg-gradient-to-br from-red-950/80 to-neutral-950 border-red-800/80 hover:border-red-600'
                      }`}
                      title="انقر لنسخ الرقم الوظيفي"
                    >
                      <span className="text-[9px] text-neutral-400 block uppercase font-mono tracking-wider">
                        الرقم الوظيفي
                      </span>
                      <span className={`text-lg font-black font-mono tracking-wider ${
                        isTerminated ? 'text-red-500 line-through' : 'text-red-400'
                      }`}>
                        #{emp.employeeCode}
                      </span>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-neutral-300 text-[11px]">{emp.branch}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isTerminated
                        ? 'bg-red-950 text-red-400 border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : isActive 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}>
                      {isTerminated ? (
                        <>
                          <Ban className="w-3 h-3" />
                          <span>مطرود ومنهى خدماته</span>
                        </>
                      ) : isActive ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>نشط ومصرح له</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          <span>معلّق مؤقتاً</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Details info */}
                  <div className="space-y-1.5 bg-neutral-950 rounded-2xl p-3 border border-neutral-850/70 text-[11px] text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> الجوال:
                      </span>
                      <span className="font-mono text-white" dir="ltr">{emp.phone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> البريد:
                      </span>
                      <span className="font-mono text-neutral-300 text-[10px]">{emp.email}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> تاريخ التعيين:
                      </span>
                      <span className="font-mono text-neutral-300">{emp.hireDate}</span>
                    </div>

                    {/* If Terminated: Show Termination Reason Box */}
                    {isTerminated && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-red-950/70 border border-red-900/80 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-red-300 font-bold">
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span>تاريخ قرار الطرد:</span>
                          </span>
                          <span className="font-mono text-red-200">{emp.terminationDate || 'تم الطرد فوراً'}</span>
                        </div>
                        <div className="text-red-200 text-[10px] leading-relaxed pt-1 border-t border-red-900/60">
                          <span className="text-red-400 font-bold block mb-0.5">سبب الطرد وسحب الصلاحيات:</span>
                          {emp.terminationReason || 'مخالفة معايير العمل وسحب الصلاحيات الإدارية'}
                        </div>
                      </div>
                    )}

                    {emp.notes && !isTerminated && (
                      <p className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-900 leading-relaxed">
                        {emp.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-neutral-850 flex items-center justify-between gap-2">
                  {isTerminated ? (
                    <>
                      {/* Restore / Rehire Button */}
                      <button
                        type="button"
                        onClick={() => handleRestoreEmployee(emp)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                        title="إلغاء قرار الطرد وإعادة تفعيل الموظف"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>إلغاء الطرد وإعادة التعيين</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(emp)}
                        className="p-2 rounded-xl bg-neutral-950 hover:bg-red-950 text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-800 transition-all cursor-pointer"
                        title="حذف الموظف وسجله نهائياً"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Toggle Active / Suspended Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(emp)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700'
                            : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>تعليق</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>تفعيل</span>
                          </>
                        )}
                      </button>

                      {/* Prominent Terminate / Fire Employee Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenTerminateModal(emp)}
                        className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/80 hover:border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.2)]"
                        title="طرد الموظف وسحب صلاحيات الدخول"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-red-400" />
                        <span>طرد الموظف</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(emp)}
                        className="p-2 rounded-xl bg-neutral-950 hover:bg-red-950/60 text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-800/60 transition-all cursor-pointer"
                        title="حذف الموظف نهائياً"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-16 text-center bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-4">
              <Users className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">لم يتم العثور على أي موظف بهذا البحث</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                تأكد من كتابة الاسم أو الرقم الوظيفي بشكل صحيح، أو أضف موظفاً جديداً للفرع.
              </p>
              <button
                type="button"
                onClick={handleOpenHireModal}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>توظيف موظف جديد الآن</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* HIRE NEW EMPLOYEE MODAL (نافذة تسجيل وتوظيف موظف جديد)                     */}
      {/* ========================================================================= */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Top Accent line */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900" />

            <button
              onClick={() => setIsHireModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 border border-red-800/80 text-red-400">
                  NEW RECRUITMENT
                </span>
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-500" />
                توظيف واعتماد موظف جديد
              </h3>
              <p className="text-xs text-neutral-400">
                أدخل بيانات الموظف ليتم تسجيله فوراً وتوليد رقمه الوظيفي المكون من 3 أرقام لتمكينه من دخول لوحة التحكم.
              </p>
            </div>

            {formError && (
              <div className="bg-red-950/60 border border-red-600 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2 font-bold animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewEmployee} className="space-y-4">
              
              {/* Employee 3-Digit Badge Code Field (Crucial!) */}
              <div className="bg-gradient-to-r from-red-950/40 via-neutral-950 to-neutral-900 border border-red-800/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-red-500" />
                    الرقم الوظيفي المعتمد (3 أرقام فقط):
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewCode}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    توليد رقم عشوائي
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    required
                    value={employeeCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setEmployeeCode(val);
                      setFormError(null);
                    }}
                    placeholder="مثال: 105"
                    className="w-32 bg-neutral-950 border-2 border-red-600 rounded-xl px-4 py-2.5 text-center font-mono font-black text-xl text-red-400 tracking-widest focus:outline-none shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  />
                  <div className="text-[11px] text-neutral-400 leading-tight">
                    هذا هو الرقم الوظيفي المعتمد المخصص للموظف للتحقق وتأكيد هويته في النظام.
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  اسم الموظف الكامل:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: عبد العزيز المنصور"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  المسمى الوظيفي والرتبة:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="استشاري مبيعات أول - هيلكات وهيمي V8">استشاري مبيعات أول - هيلكات وهيمي V8</option>
                  <option value="مسؤول تجارب القيادة والحلبات السريعة">مسؤول تجارب القيادة والحلبات السريعة</option>
                  <option value="مدير مبيعات المعرض وكبار العملاء VIP">مدير مبيعات المعرض وكبار العملاء VIP</option>
                  <option value="كبير أخصائيي تجهيز وأداء دودج SRT">كبير أخصائيي تجهيز وأداء دودج SRT</option>
                  <option value="أخصائي تسليم واستلام مركبات V8">أخصائي تسليم واستلام مركبات V8</option>
                </select>
              </div>

              {/* Branch and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    الفرع / المدينة:
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="الرياض - طريق خريص">الرياض - طريق خريص</option>
                    <option value="الرياض - الدائري الشمالي">الرياض - الدائري الشمالي</option>
                    <option value="جدة - طريق الكورنيش">جدة - طريق الكورنيش</option>
                    <option value="الدمام - طريق الملك فهد">الدمام - طريق الملك فهد</option>
                    <option value="الخبر - طريق الملك خالد">الخبر - طريق الملك خالد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    رقم الجوال:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none text-left font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  البريد الإلكتروني للعمل:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@dodge-ksa.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  ملاحظات الإدارة والصلاحيات الممنوحة:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="صلاحية قبول طلبات تجارب القيادة، التواصل المباشر مع العملاء..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsHireModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>اعتماد التوظيف وتفعيل الرقم الوظيفي</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TERMINATE / FIRE EMPLOYEE MODAL (نافذة قرار طرد الموظف وإنهاء الخدمات)       */}
      {/* ========================================================================= */}
      {terminateModalEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-red-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_0_50px_rgba(220,38,38,0.35)] overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Top Red Accent line */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-red-800 via-red-600 to-red-950 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />

            <button
              onClick={() => setTerminateModalEmployee(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 border border-red-700 text-red-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  DISCIPLINARY ACTION
                </span>
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2 pt-1">
                <UserMinus className="w-6 h-6 text-red-500" />
                <span>قرار طرد موظف وإنهاء الخدمات</span>
              </h3>
              <p className="text-xs text-neutral-400">
                إصدار قرار إداري رسمي بفصل الموظف وسحب اعتماده وصلاحيات الرقم الوظيفي فوراً.
              </p>
            </div>

            {/* Target Employee Summary Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 font-bold shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {terminateModalEmployee.fullName}
                  </h4>
                  <span className="text-xs text-neutral-400 block">
                    {terminateModalEmployee.role}
                  </span>
                  <span className="text-[11px] text-neutral-500 block">
                    الفرع: {terminateModalEmployee.branch}
                  </span>
                </div>
              </div>

              <div className="text-center bg-red-950/80 border border-red-800 px-3 py-1.5 rounded-xl shrink-0">
                <span className="text-[9px] text-neutral-400 block font-mono">الرقم الوظيفي</span>
                <span className="text-base font-black text-red-400 font-mono">#{terminateModalEmployee.employeeCode}</span>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-900/60 text-xs text-red-200/90 flex items-start gap-2.5 leading-relaxed">
              <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 font-bold block mb-1">التبعات الإدارية للقرار:</strong>
                سيتم إيقاف وإلغاء صلاحية الدخول لبوابة الموظفين فوراً لهذا الرقم، وإذا حاول الدخول سيظهر له إشعار صريح بالطرد والسبب المدوّن أدناه مع توثيق الحالة في سجلات الإدارة.
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-300">
                اختر سبب الطرد المعتمد:
              </label>

              <div className="space-y-2">
                {[
                  'مخالفة معايير قيادة هيلكات SRT والحلبات والسلامة المرورية',
                  'سوء التعامل مع عملاء المعرض وتكرار الشكاوى',
                  'التخلف غير المبرر عن مواعيد تجارب القيادة للعملاء',
                  'إفشاء معلومات حصرية عن الأسعار أو تخصيصات السيارات',
                  'مخالفة لائحة العمل الداخلية وسحب الثقة بقرار إداري',
                  'أخرى (سبب مخصص)'
                ].map((reasonOption) => (
                  <label
                    key={reasonOption}
                    onClick={() => setTerminationReason(reasonOption)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      terminationReason === reasonOption
                        ? 'bg-red-950/60 border-red-700 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="terminationReason"
                      checked={terminationReason === reasonOption}
                      onChange={() => setTerminationReason(reasonOption)}
                      className="accent-red-600 w-4 h-4"
                    />
                    <span>{reasonOption}</span>
                  </label>
                ))}
              </div>

              {/* Custom reason or additional notes textarea */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  تفاصيل إضافية أو نص القرار الإداري (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="اكتب تفاصيل إضافية عن سبب الفصل والقرار الإداري هنا..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setTerminateModalEmployee(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء التراجع
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleConfirmTerminate(true)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-red-950 border border-red-900/60 text-red-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title="طرد مع حذف السجل نهائياً"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>طرد مع مسح السجل</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmTerminate(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>تأكيد طرد الموظف وسحب الصلاحيات</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Export as PDF Modal */}
      <AdminExportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        employees={employees}
      />

      {/* Staff Live Chat Modal for Administration */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="w-full max-w-4xl relative">
            <StaffChatView
              currentEmployee={{
                id: 'emp-admin',
                employeeCode: '001',
                fullName: 'إدارة المعرض والعمليات',
                role: 'الإدارة العليا - المركز الإقليمي',
                phone: '0112345678',
                email: 'operations@dodge-ksa.com',
                branch: 'المقر الإقليمي - الرياض',
                hireDate: '2020-01-01',
                status: 'active',
                ordersHandled: 99
              }}
              onClose={() => setIsChatModalOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
