import React, { useState, useEffect } from 'react';
import { CustomerOrder, Employee } from '../../types';
import { 
  getStoredOrders, 
  updateOrderStatus, 
  deleteOrder, 
  saveOrder 
} from '../../services/orderStorage';
import { staffChatClient } from '../../services/staffChatService';
import { StaffChatView } from '../StaffChatView';
import { DodgeLogo } from '../DodgeLogo';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Flame, 
  AlertCircle, 
  RefreshCw, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Trash2, 
  Plus, 
  Eye, 
  MessageSquare, 
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Award,
  Hash,
  Settings
} from 'lucide-react';

interface EmployeeDashboardProps {
  onExit: () => void;
  currentEmployee?: Employee | null;
  onSwitchAccount?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ 
  onExit, 
  currentEmployee,
  onSwitchAccount
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'test_drive' | 'custom_order'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Modals
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('السيارة محجوزة بالكامل للفترة الحالية');
  const [showAcceptModal, setShowAcceptModal] = useState<string | null>(null);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState(
    currentEmployee ? `${currentEmployee.fullName} (#${currentEmployee.employeeCode})` : 'مسؤول مبيعات دودج الرياض'
  );
  const [acceptNote, setAcceptNote] = useState('تم التواصل مع العميل وتأكيد الحجز مبدئياً');
  const [showAddManualModal, setShowAddManualModal] = useState(false);

  // Form for manual order
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCity, setManualCity] = useState('الرياض');
  const [manualTrim, setManualTrim] = useState('durango-hellcat');

  // Staff Chat State
  const [activeTab, setActiveTab] = useState<'orders' | 'chat'>('orders');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [chatOnlineCount, setChatOnlineCount] = useState(0);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  // Load orders
  const loadOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    loadOrders();

    const handleNewOrder = () => loadOrders();
    const handleUpdatedOrders = () => loadOrders();

    window.addEventListener('dodge_order_created', handleNewOrder);
    window.addEventListener('dodge_orders_updated', handleUpdatedOrders);

    // Subscribe to real-time chat presence and unread messages
    const unsubChat = staffChatClient.subscribe((state) => {
      setChatOnlineCount(state.onlineStaff.length);
      setChatUnreadCount(state.unreadCount);
    });

    return () => {
      window.removeEventListener('dodge_order_created', handleNewOrder);
      window.removeEventListener('dodge_orders_updated', handleUpdatedOrders);
      unsubChat();
    };
  }, []);

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.type === filterType;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.code.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query) ||
      order.trimNameAr.toLowerCase().includes(query);

    return matchesStatus && matchesType && matchesSearch;
  });

  // KPI Calculations
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const acceptedCount = orders.filter(o => o.status === 'accepted').length;
  const rejectedCount = orders.filter(o => o.status === 'rejected').length;
  const totalPotentialValueSAR = orders
    .filter(o => o.status !== 'rejected')
    .reduce((sum, o) => sum + (o.totalPriceSAR || 0), 0);

  // Action handlers
  const handleConfirmAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted', {
      employeeName: assignedEmployeeName,
      notes: acceptNote
    });
    setShowAcceptModal(null);
  };

  const handleConfirmReject = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected', {
      rejectionReason: rejectionReason,
      notes: `تم الرفض بواسطة الموظف: ${rejectionReason}`
    });
    setShowRejectModal(null);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب من السجل؟')) {
      deleteOrder(orderId);
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    saveOrder({
      code: 'DODGE-MAN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'custom_order',
      customerName: manualName,
      phone: manualPhone,
      city: manualCity,
      trimId: manualTrim,
      trimNameAr: manualTrim === 'durango-hellcat' ? 'دورانجو SRT هيلكات (710 حصان)' : 'دورانجو SRT 392 (475 حصان)',
      colorId: 'destroyer-gray',
      colorNameAr: 'رمادي المدمرة',
      colorHex: '#52565E',
      stripeId: 'dual-red',
      stripeNameAr: 'خطين حمر دودج الأيقونيين',
      hasDodgeRedStripes: true,
      totalPriceSAR: manualTrim === 'durango-hellcat' ? 429900 : 329900,
      staffNotes: 'طلب مسجل يدوياً عبر لوحة الموظفين.'
    });

    setManualName('');
    setManualPhone('');
    setShowAddManualModal(false);
  };

  return (
    <div id="employee-dashboard-root" className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8" dir="rtl">
      
      {/* Top Secret Security Header */}
      <div className="bg-neutral-900 border-2 border-red-700/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(220,38,38,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <DodgeLogo size="md" showArabic={true} showEnglish={true} />
            <span className="text-neutral-600 text-lg">|</span>
            <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-600 rounded-full px-3 py-1 text-xs font-mono font-bold text-red-400">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>نظام إدارة طلبات الموظفين (DODGE STAFF PORTAL)</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            لوحة تحكم وإدارة طلبات دورانجو <span className="text-red-600 font-num">2025</span> V8
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            متابعة فورية لطلبات حجز تجارب القيادة وبناء وتخصيص دورانجو، مع إمكانية القبول والرفض وتكليف الموظفين.
          </p>

          {/* Current Verified Employee Badge */}
          {currentEmployee && (
            <div className="mt-4 inline-flex flex-wrap items-center gap-2.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl px-4 py-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-400">الموظف المسجل:</span>
              <strong className="text-white font-bold">{currentEmployee.fullName}</strong>
              <span className="bg-red-950 text-red-400 font-mono font-bold px-2 py-0.5 rounded border border-red-800 text-[11px]">
                #{currentEmployee.employeeCode}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300">{currentEmployee.role}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{currentEmployee.branch}</span>
              {onSwitchAccount && (
                <button
                  type="button"
                  onClick={onSwitchAccount}
                  className="mr-2 text-[11px] text-red-400 hover:text-red-300 underline font-bold cursor-pointer transition-colors"
                  title="تسجيل خروج أو التحقق والدخول بحساب موظف آخر"
                >
                  (تبديل الحساب)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'chat' ? 'orders' : 'chat');
              staffChatClient.resetUnread();
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'chat'
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                : 'bg-neutral-800 hover:bg-neutral-750 border-neutral-700 text-neutral-200 hover:border-red-600'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span>شات الموظفين (أونلاين)</span>
            {chatOnlineCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-[10px]">
                {chatOnlineCount} متواجد
              </span>
            )}
          </button>

          <button
            onClick={() => setShowAddManualModal(true)}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-red-500" />
            <span>تسجيل طلب عميل يدوي</span>
          </button>

          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للموقع العام</span>
          </button>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/70 p-2.5 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>طلبات وحجوزات العملاء ({totalOrdersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('chat');
              staffChatClient.resetUnread();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer relative ${
              activeTab === 'chat'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
            </div>
            <span>شات تواصل الموظفين المباشر</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{chatOnlineCount > 0 ? `${chatOnlineCount} متصل` : 'أونلاين'}</span>
            </span>
          </button>
        </div>

        <div className="text-xs text-neutral-400 px-3 hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>قنوات اتصال فورية مشفرة لموظفي المعرض عبر WebSockets</span>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="animate-in fade-in duration-200">
          <StaffChatView currentEmployee={currentEmployee} />
        </div>
      ) : (
        <>
      {/* KPI METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Orders */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>إجمالي الطلبات</span>
            <FileText className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-num">
            {totalOrdersCount}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">كل الطلبات المسجلة بالنظام</span>
        </div>

        {/* Pending Requests (High Priority) */}
        <div className="bg-amber-950/20 border border-amber-600/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
          <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
            <span className="font-bold">بانتظار الموافقة</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-num">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber-300/70 mt-1 block">تتطلب إجراء سريع من الموظف</span>
        </div>

        {/* Accepted Orders */}
        <div className="bg-emerald-950/20 border border-emerald-600/40 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
            <span className="font-bold">طلبات مقبولة ومؤكدة</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-num">
            {acceptedCount}
          </div>
          <span className="text-[10px] text-emerald-300/70 mt-1 block">تم تأكيد الموعد والتواصل</span>
        </div>

        {/* Rejected Orders */}
        <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-red-400 text-xs mb-2">
            <span>طلبات مرفوضة</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-num">
            {rejectedCount}
          </div>
          <span className="text-[10px] text-red-300/70 mt-1 block">تم الاعتذار وتحديد السبب</span>
        </div>

        {/* Potential Pipeline Value */}
        <div className="col-span-2 lg:col-span-1 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>قيمة المبيعات المحتملة</span>
            <DollarSign className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-red-500 font-num truncate">
            {totalPotentialValueSAR.toLocaleString()} <span className="text-xs">ريال</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">للطلبات النشطة والمؤكدة</span>
        </div>

      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميل، رقم الجوال، كود الحجز، الفئة، أو المدينة..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 flex items-center gap-1 font-bold">
            <Filter className="w-3.5 h-3.5" />
            الحالة:
          </span>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'pending' ? 'bg-amber-600 text-white font-bold' : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              معلقة ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'accepted' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-emerald-400'
              }`}
            >
              مقبولة ({acceptedCount})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'rejected' ? 'bg-red-900 text-white font-bold' : 'text-neutral-400 hover:text-red-400'
              }`}
            >
              مرفوضة ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث</span>
          </button>
        </div>

      </div>

      {/* ORDERS LIST / CARDS */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">لا توجد طلبات مطابقة للبحث أو التصفية</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              عندما يقوم أي عميل بإرسال طلب تجربة قيادة أو تخصيص سيارة دورانجو، ستظهر تفاصيله هنا فوراً.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isAccepted = order.status === 'accepted';
            const isRejected = order.status === 'rejected';

            return (
              <div 
                key={order.id}
                className={`bg-neutral-900/90 border rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${
                  isPending 
                    ? 'border-amber-600/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-neutral-900' 
                    : isAccepted 
                    ? 'border-emerald-700/40 bg-neutral-900/95' 
                    : 'border-red-900/40 bg-neutral-950/90 opacity-80'
                }`}
              >
                {/* Card Top Row: Code, Type, Status, and Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-red-400 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-800/40">
                      {order.code}
                    </span>
                    
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                      order.type === 'test_drive'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-purple-950 text-purple-400 border border-purple-800'
                    }`}>
                      <Car className="w-3.5 h-3.5" />
                      {order.type === 'test_drive' ? 'حجز تجربة قيادة' : 'طلب بناء وشراء دورانجو'}
                    </span>

                    <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')} - {new Date(order.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-950/80 border border-amber-500 text-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        بانتظار مراجعة وقبول الموظف
                      </span>
                    )}

                    {isAccepted && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        تم القبول وتأكيد الحجز ✓
                      </span>
                    )}

                    {isRejected && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-red-950/80 border border-red-700 text-red-400 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        طلب مرفوض
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Middle: Customer Details + Car Spec Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Customer Info (5 cols) */}
                  <div className="md:col-span-5 space-y-2.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                      <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-500" />
                        اسم العميل:
                      </span>
                      <span className="text-sm font-black text-white">{order.customerName}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                      <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        رقم الجوال:
                      </span>
                      <a href={`tel:${order.phone}`} className="font-mono font-bold text-emerald-400 hover:underline" dir="ltr">
                        {order.phone}
                      </a>
                    </div>

                    {order.email && (
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                        <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          البريد:
                        </span>
                        <span className="font-mono text-neutral-300">{order.email}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        المدينة والمعرض:
                      </span>
                      <span className="font-bold text-white">{order.city}</span>
                    </div>

                    {order.preferredDate && (
                      <div className="pt-2 border-t border-neutral-850 text-neutral-300 flex items-center justify-between">
                        <span className="text-neutral-500">الموعد المفضل:</span>
                        <span className="font-bold text-amber-400 font-num">{order.preferredDate} ({order.preferredTimeSlot})</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Specs & Customization (7 cols) */}
                  <div className="md:col-span-7 space-y-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                      <div>
                        <span className="text-neutral-500 text-[10px] block">الفئة المطلوبة:</span>
                        <span className="text-sm font-black text-white">{order.trimNameAr}</span>
                      </div>
                      
                      <div className="text-left">
                        <span className="text-neutral-500 text-[10px] block">
                          {order.type === 'test_drive' ? 'سعر تجربة القيادة:' : 'السعر التقديري:'}
                        </span>
                        <span className="text-base font-black text-red-500 font-num">
                          {order.totalPriceSAR.toLocaleString()} ريال
                        </span>
                        {order.type === 'test_drive' && (
                          <span className="text-[10px] text-neutral-400 block font-num">
                            (الأساسي: 2,000 ريال {order.testDriveAddonsTotalSAR ? `+ ${order.testDriveAddonsTotalSAR} ريال إضافات` : ''})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Test Drive Add-ons if present */}
                    {order.type === 'test_drive' && order.testDriveAddons && order.testDriveAddons.length > 0 && (
                      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-bold">الإضافات المشمولة في التجربة (زيادة مئات):</span>
                          {order.testDriveAddonsTotalSAR && (
                            <span className="text-emerald-400 font-bold font-num">+{order.testDriveAddonsTotalSAR} ريال</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {order.testDriveAddons.map((addon, idx) => (
                            <span key={idx} className="text-[10px] bg-red-950/60 border border-red-800/40 text-red-200 px-2 py-0.5 rounded-md">
                              ✓ {addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Paint Color & Stripes Preview */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex items-center gap-2.5 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                        <span 
                          className="w-5 h-5 rounded-full border border-neutral-600 block shadow-inner shrink-0"
                          style={{ backgroundColor: order.colorHex || '#52565E' }}
                        />
                        <div>
                          <span className="text-[10px] text-neutral-400 block">اللون الخارجي:</span>
                          <span className="font-bold text-neutral-200 line-clamp-1">{order.colorNameAr || 'رمادي المدمرة'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                        <div className="flex gap-1 transform -skew-x-[22deg] shrink-0">
                          <div className="w-1.5 h-4 bg-red-600" />
                          <div className="w-1.5 h-4 bg-red-600" />
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 block">خطوط السباق:</span>
                          <span className="font-bold text-neutral-200 line-clamp-1">
                            {order.hasDodgeRedStripes !== false ? 'خطين حمر دودج الأيقونيين' : 'بدون خطوط'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Staff Notes & Reason if any */}
                    {order.staffNotes && (
                      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2.5 text-neutral-300">
                        <span className="text-[10px] text-neutral-400 block font-bold mb-0.5">ملاحظات الطلب:</span>
                        <p className="text-xs">{order.staffNotes}</p>
                      </div>
                    )}

                    {order.rejectionReason && (
                      <div className="bg-red-950/50 border border-red-900/60 rounded-xl p-2.5 text-red-300">
                        <span className="text-[10px] text-red-400 block font-bold mb-0.5">سبب الرفض:</span>
                        <p className="text-xs font-bold">{order.rejectionReason}</p>
                      </div>
                    )}

                    {order.assignedEmployee && (
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>الموظف المسؤول المكلّف:</span>
                        <span className="text-white font-bold">{order.assignedEmployee}</span>
                      </div>
                    )}

                  </div>

                </div>

                {/* Card Bottom: EMPLOYEE ACTION CONTROLS (Accept / Reject / Notes / Delete) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
                  
                  <div className="flex items-center gap-2">
                    {/* Accept Order Button */}
                    {!isAccepted && (
                      <button
                        onClick={() => setShowAcceptModal(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>قبول وتأكيد الطلب</span>
                      </button>
                    )}

                    {/* Reject Order Button */}
                    {!isRejected && (
                      <button
                        onClick={() => setShowRejectModal(order.id)}
                        className="bg-neutral-850 hover:bg-red-950 border border-red-900/60 hover:border-red-600 text-red-400 hover:text-red-300 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>رفض الطلب</span>
                      </button>
                    )}

                    {/* Re-open pending */}
                    {!isPending && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>إعادة إلى قيد الانتظار</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً بك أستاذ ${order.customerName}، نتواصل معك بخصوص طلبك لسيارة دودج دورانجو 2025 V8 رقم ${order.code}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>مراسلة واتساب</span>
                    </a>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>
      </>
      )}

      {/* Floating Quick Chat Toggle Button (Available when browsing orders) */}
      {activeTab === 'orders' && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            type="button"
            onClick={() => setIsChatDrawerOpen(!isChatDrawerOpen)}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.7)] flex items-center gap-2.5 font-bold text-xs sm:text-sm cursor-pointer transition-all hover:scale-105"
            title="فتح شات الموظفين الفوري"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-red-600 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span>شات الموظفين</span>
            {chatOnlineCount > 0 && (
              <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded-full">
                {chatOnlineCount} أونلاين
              </span>
            )}
            {chatUnreadCount > 0 && (
              <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {chatUnreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Drawer Modal */}
      {isChatDrawerOpen && activeTab === 'orders' && (
        <div className="fixed bottom-20 left-6 z-50 animate-in slide-in-from-bottom-5">
          <StaffChatView 
            currentEmployee={currentEmployee} 
            onClose={() => setIsChatDrawerOpen(false)}
            isFloating={true}
          />
        </div>
      )}

      {/* ACCEPT MODAL */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
          <div className="w-full max-w-md bg-neutral-900 border border-emerald-600/50 rounded-3xl p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-lg">
              <CheckCircle className="w-6 h-6" />
              <span>قبول وتأكيد طلب العميل</span>
            </div>

            <p className="text-xs text-neutral-400">
              سيتم تغيير حالة الطلب إلى «مقبول ومؤكد» وتسجيل بيانات الموظف المسؤول لمتابعة الحجز.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">اسم الموظف المسؤول:</label>
                <input
                  type="text"
                  value={assignedEmployeeName}
                  onChange={(e) => setAssignedEmployeeName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">ملاحظة التأكيد:</label>
                <textarea
                  value={acceptNote}
                  onChange={(e) => setAcceptNote(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAcceptModal(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleConfirmAccept(showAcceptModal)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                تأكيد القبول الآن ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
          <div className="w-full max-w-md bg-neutral-900 border border-red-700/60 rounded-3xl p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-2 text-red-400 font-black text-lg">
              <XCircle className="w-6 h-6" />
              <span>رفض طلب العميل</span>
            </div>

            <p className="text-xs text-neutral-400">
              يرجى تحديد سبب الرفض ليتم تسجيله في سجل الموظفين وإخطار العميل بالاعتذار.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">سبب الرفض:</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="السيارة محجوزة بالكامل للفترة الحالية">السيارة محجوزة بالكامل للفترة الحالية</option>
                  <option value="تعذر التواصل مع العميل هاتفياً">تعذر التواصل مع العميل هاتفياً</option>
                  <option value="الفئة المختارة غير متوفرة في معرض المدينة">الفئة المختارة غير متوفرة في معرض المدينة</option>
                  <option value="طلب مكرر من نفس العميل">طلب مكرر من نفس العميل</option>
                  <option value="العميل تراجع عن الطلب">العميل تراجع عن الطلب</option>
                  <option value="عدم استيفاء شروط تجربة القيادة">عدم استيفاء شروط تجربة القيادة</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleConfirmReject(showRejectModal)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
              >
                تأكيد الرفض ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL ORDER MODAL */}
      {showAddManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
          <form onSubmit={handleCreateManualOrder} className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <Plus className="w-5 h-5 text-red-500" />
              <span>تسجيل طلب عميل يدوي (من المعرض/الهاتف)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">اسم العميل:</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="مثال: عبدالمحسن الحربي"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">رقم الجوال:</label>
                <input
                  type="tel"
                  required
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">المدينة والمعرض:</label>
                <select
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="الرياض">الرياض - فرع خريص الرئيسي</option>
                  <option value="جدة">جدة - فرع طريق المدينة</option>
                  <option value="الدمام / الخبر">الدمام / الخبر - طريق الكباري</option>
                  <option value="دبي">دبي - شارع الشيخ زايد</option>
                  <option value="أبوظبي">أبوظبي</option>
                  <option value="الكويت">الكويت - الشويخ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">فئة دورانجو:</label>
                <select
                  value={manualTrim}
                  onChange={(e) => setManualTrim(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="durango-hellcat">دورانجو SRT هيلكات (710 حصان سوبرتشارج)</option>
                  <option value="durango-srt-392">دورانجو SRT 392 (475 حصان تنفس طبيعي)</option>
                  <option value="durango-rt">دورانجو R/T هيمي 5.7L (360 حصان)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddManualModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
              >
                حفظ الطلب بالنظام
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
