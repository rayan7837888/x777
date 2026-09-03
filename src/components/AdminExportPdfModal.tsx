import React, { useState, useRef, useEffect } from 'react';
import { 
  FileDown, Printer, X, FileText, Users, ShoppingBag, 
  CheckCircle2, AlertCircle, Clock, Ban, Calendar, 
  Building2, Hash, Phone, Mail, Shield, Check, Loader2,
  ChevronDown, Filter, Sparkles, Car
} from 'lucide-react';
import { Employee, CustomerOrder } from '../types';
import { getStoredOrders } from '../services/orderStorage';
import { DodgeLogo } from './DodgeLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AdminExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

type ReportType = 'employees' | 'orders' | 'all';

export const AdminExportPdfModal: React.FC<AdminExportPdfModalProps> = ({
  isOpen,
  onClose,
  employees
}) => {
  const [reportType, setReportType] = useState<ReportType>('employees');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  // Filter options
  const [includeTerminated, setIncludeTerminated] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setOrders(getStoredOrders());
      setGenerationSuccess(null);
      setIsGenerating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered lists
  const filteredEmployees = employees.filter(emp => {
    if (!includeTerminated && emp.status === 'terminated') return false;
    return true;
  });

  const filteredOrders = orders.filter(ord => {
    if (orderStatusFilter === 'all') return true;
    return ord.status === orderStatusFilter;
  });

  const activeEmployeesCount = employees.filter(e => e.status === 'active').length;
  const suspendedEmployeesCount = employees.filter(e => e.status === 'suspended').length;
  const terminatedEmployeesCount = employees.filter(e => e.status === 'terminated').length;

  const totalOrdersValue = orders.reduce((sum, ord) => sum + (ord.totalPriceSAR || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const acceptedOrdersCount = orders.filter(o => o.status === 'accepted').length;

  const currentDateFormatted = new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  const documentRefCode = `DODGE-HQ-${Date.now().toString().slice(-6)}`;

  // Direct PDF Download handler using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setIsGenerating(true);
    setGenerationSuccess(null);

    try {
      const element = printAreaRef.current;
      
      // Render canvas with high resolution scale
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;

      // Handle multi-page content if the report exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
      }

      const filePrefix = reportType === 'employees' 
        ? 'تقرير_موظفي_دودج_دورانجو' 
        : reportType === 'orders'
          ? 'تقرير_حجوزات_عملاء_دودج'
          : 'تقرير_شامل_دودج_دورانجو';

      const fileName = `${filePrefix}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);

      setGenerationSuccess(`تم تحميل ملف PDF بنجاح: ${fileName}`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback: trigger print dialog if canvas generation faces obstacles
      handleNativePrint();
    } finally {
      setIsGenerating(false);
    }
  };

  // Native Print / Save-as-PDF through isolated iframe
  const handleNativePrint = () => {
    if (!printAreaRef.current) return;
    
    const printContent = printAreaRef.current.innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>تقرير دودج دورانجو 2025 الرسمي</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #111827;
              background-color: #ffffff;
              margin: 0;
              padding: 10px;
              direction: rtl;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 8px 10px;
              text-align: right;
            }
            th {
              background-color: #f9fafb;
              font-weight: bold;
              color: #111827;
            }
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: bold;
            }
            .badge-active { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
            .badge-suspended { background-color: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
            .badge-terminated { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
            .badge-code {
              font-family: monospace;
              font-weight: 900;
              background-color: #111827;
              color: #ef4444;
              padding: 2px 6px;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900 shadow-[0_0_15px_rgba(220,38,38,0.8)] shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-neutral-950/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DodgeLogo size="sm" showArabic={true} showEnglish={true} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center gap-1">
                <FileDown className="w-3 h-3" />
                OFFICIAL REPORT EXPORT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>تصدير التقارير الإدارية كـ PDF</span>
            </h2>
            <p className="text-xs text-neutral-400">
              توليد وطباعة وثائق وتقارير رسمية معتمدة لقائمة الموظفين المسجلين وحجوزات عملاء المعرض.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls and Selectors Bar */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Report Type Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-2xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setReportType('employees')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                reportType === 'employees'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>قائمة الموظفين المسجلين</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                {employees.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('orders')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                reportType === 'orders'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تقرير حجوزات العملاء</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                reportType === 'all'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>تقرير إداري شامل</span>
            </button>
          </div>

          {/* Contextual Filter Switches */}
          <div className="flex items-center gap-3">
            {reportType !== 'orders' && (
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeTerminated}
                  onChange={(e) => setIncludeTerminated(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-red-600 focus:ring-red-600 w-4 h-4 accent-red-600"
                />
                <span>تضمين الموظفين المطرودين ({terminatedEmployeesCount})</span>
              </label>
            )}

            {reportType !== 'employees' && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span>حالة الحجز:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="accepted">المؤكدة</option>
                  <option value="rejected">المرفوضة</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Live Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950/90 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-red-500" />
              معاينة التقرير الرسمي المعتمد (جاهز للتصدير كـ PDF):
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              ورق A4 قياسي معتمد للطباعة
            </span>
          </div>

          {/* Printable White Document Canvas */}
          <div className="flex justify-center">
            <div 
              ref={printAreaRef}
              className="w-full max-w-[800px] bg-white text-neutral-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-neutral-200"
              style={{ minHeight: '950px' }}
              dir="rtl"
            >
              {/* Document Letterhead */}
              <div className="border-b-2 border-red-700 pb-5 mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xl text-neutral-950 tracking-wide">
                        دودج دورانجو 2025
                      </span>
                      <span className="text-red-700 font-bold font-mono text-sm">
                        // DODGE DURANGO
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
                      {reportType === 'employees' && 'التقرير الرسمي المعتمد لكادر الموظفين'}
                      {reportType === 'orders' && 'التقرير الإداري لحجوزات وتخصيصات العملاء'}
                      {reportType === 'all' && 'التقرير الإداري الشامل - الموظفون والحجوزات'}
                    </h1>
                    <p className="text-xs text-neutral-600 mt-1">
                      المملكة العربية السعودية | شركة بترومين ستيلانتس المعتمدة
                    </p>
                  </div>

                  <div className="text-left font-mono text-[11px] text-neutral-600 space-y-1 shrink-0 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <div><strong>رقم الوثيقة:</strong> {documentRefCode}</div>
                    <div><strong>تاريخ الإصدار:</strong> {currentDateFormatted}</div>
                    <div><strong>حالة الاعتماد:</strong> <span className="text-emerald-700 font-bold">مصدق إدارياً ✓</span></div>
                  </div>
                </div>

                {/* Racing Stripes Bar */}
                <div className="mt-4 flex h-1.5 w-full">
                  <div className="w-1/2 bg-red-600" />
                  <div className="w-1/4 bg-neutral-900" />
                  <div className="w-1/4 bg-red-700" />
                </div>
              </div>

              {/* SECTION: EMPLOYEES REPORT */}
              {(reportType === 'employees' || reportType === 'all') && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span>قائمة الكادر الوظيفي المعتمد ({filteredEmployees.length} موظف)</span>
                    </h2>
                    <span className="text-xs text-neutral-500">
                      النشطين: <strong className="text-emerald-700">{activeEmployeesCount}</strong> | المعلقين: <strong className="text-amber-700">{suspendedEmployeesCount}</strong> | المطرودين: <strong className="text-red-700">{terminatedEmployeesCount}</strong>
                    </span>
                  </div>

                  {/* Employee Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs border border-neutral-200">
                      <thead>
                        <tr className="bg-neutral-100 text-neutral-800 border-b border-neutral-300 font-bold">
                          <th className="p-2 border-l border-neutral-200 w-16 text-center">الرقم</th>
                          <th className="p-2 border-l border-neutral-200">اسم الموظف</th>
                          <th className="p-2 border-l border-neutral-200">المسمى الوظيفي</th>
                          <th className="p-2 border-l border-neutral-200">الفرع</th>
                          <th className="p-2 border-l border-neutral-200">رقم الهاتف</th>
                          <th className="p-2 border-l border-neutral-200">تاريخ التعيين</th>
                          <th className="p-2 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {filteredEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-neutral-50">
                            <td className="p-2 border-l border-neutral-200 text-center font-mono font-bold text-neutral-900">
                              <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-red-400 text-xs">
                                #{emp.employeeCode}
                              </span>
                            </td>
                            <td className="p-2 border-l border-neutral-200 font-bold text-neutral-900">
                              {emp.fullName}
                            </td>
                            <td className="p-2 border-l border-neutral-200 text-neutral-700">
                              {emp.role}
                            </td>
                            <td className="p-2 border-l border-neutral-200 text-neutral-600">
                              {emp.branch}
                            </td>
                            <td className="p-2 border-l border-neutral-200 font-mono text-neutral-700 text-[11px]">
                              {emp.phone}
                            </td>
                            <td className="p-2 border-l border-neutral-200 font-mono text-neutral-600 text-[11px]">
                              {emp.hireDate}
                            </td>
                            <td className="p-2 text-center font-bold text-[11px]">
                              {emp.status === 'active' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  نشط ومصرح
                                </span>
                              )}
                              {emp.status === 'suspended' && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                  معلّق مؤقتاً
                                </span>
                              )}
                              {emp.status === 'terminated' && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-bold">
                                  مطرود (منهي الخدمة)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Disciplinary section if terminated included */}
                  {includeTerminated && terminatedEmployeesCount > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] space-y-1">
                      <strong className="text-red-900 flex items-center gap-1 font-bold">
                        <Ban className="w-3.5 h-3.5 text-red-700" />
                        سجل قرارات الفصل وسحب الصلاحيات الإدارية:
                      </strong>
                      <div className="space-y-1 text-red-800 pt-1">
                        {employees.filter(e => e.status === 'terminated').map(termEmp => (
                          <div key={termEmp.id} className="flex items-center justify-between border-b border-red-100 pb-1">
                            <span>
                              <strong>{termEmp.fullName}</strong> [#{termEmp.employeeCode}]: {termEmp.terminationReason || 'مخالفة لائحة العمل وسحب الاعتماد'}
                            </span>
                            <span className="font-mono text-[10px] text-red-700">
                              تاريخ القرار: {termEmp.terminationDate || termEmp.hireDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: CUSTOMER ORDERS REPORT */}
              {(reportType === 'orders' || reportType === 'all') && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <h2 className="text-base font-black text-neutral-900 flex items-center gap-2">
                      <Car className="w-4 h-4 text-red-600" />
                      <span>تقرير حجوزات وطلبات العملاء ({filteredOrders.length} طلب)</span>
                    </h2>
                    <span className="text-xs text-neutral-500">
                      قيد الانتظار: <strong className="text-amber-700">{pendingOrdersCount}</strong> | المؤكدة: <strong className="text-emerald-700">{acceptedOrdersCount}</strong>
                    </span>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 text-xs">
                      لا توجد حجوزات مسجلة تطابق معايير الفلترة المحددة حالياً.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs border border-neutral-200">
                        <thead>
                          <tr className="bg-neutral-100 text-neutral-800 border-b border-neutral-300 font-bold">
                            <th className="p-2 border-l border-neutral-200 w-24">رمز الحجز</th>
                            <th className="p-2 border-l border-neutral-200">العميل</th>
                            <th className="p-2 border-l border-neutral-200">رقم الاتصال</th>
                            <th className="p-2 border-l border-neutral-200">طراز السيارة</th>
                            <th className="p-2 border-l border-neutral-200">النوع</th>
                            <th className="p-2 border-l border-neutral-200">القيمة الإجمالية</th>
                            <th className="p-2 text-center">حالة الحجز</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-neutral-50">
                              <td className="p-2 border-l border-neutral-200 font-mono font-bold text-neutral-900 text-[11px]">
                                {ord.code}
                              </td>
                              <td className="p-2 border-l border-neutral-200 font-bold text-neutral-900">
                                {ord.customerName}
                                <span className="block text-[10px] text-neutral-500 font-normal">
                                  {ord.city}
                                </span>
                              </td>
                              <td className="p-2 border-l border-neutral-200 font-mono text-neutral-700 text-[11px]">
                                {ord.phone}
                              </td>
                              <td className="p-2 border-l border-neutral-200 text-neutral-800">
                                <span className="font-bold">{ord.trimNameAr}</span>
                                {ord.colorNameAr && (
                                  <span className="block text-[10px] text-neutral-500">
                                    اللون: {ord.colorNameAr}
                                  </span>
                                )}
                              </td>
                              <td className="p-2 border-l border-neutral-200 text-[11px]">
                                {ord.type === 'test_drive' ? 'تجربة قيادة' : 'تخصيص كامل'}
                              </td>
                              <td className="p-2 border-l border-neutral-200 font-mono font-bold text-neutral-900">
                                {ord.totalPriceSAR.toLocaleString()} ر.س
                              </td>
                              <td className="p-2 text-center font-bold text-[11px]">
                                {ord.status === 'accepted' && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    مؤكد ومجدول
                                  </span>
                                )}
                                {ord.status === 'pending' && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                    قيد المراجعة
                                  </span>
                                )}
                                {ord.status === 'rejected' && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                                    مرفوض / ملغي
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Document Signatures & Official Stamp */}
              <div className="mt-12 pt-6 border-t-2 border-neutral-200 flex items-end justify-between text-xs text-neutral-600">
                <div className="space-y-1">
                  <div className="font-bold text-neutral-900">إدارة مبيعات وتوظيف دودج دورانجو</div>
                  <div>المقر الإقليمي - صالة عرض هيلكات SRT</div>
                  <div className="font-mono text-[10px] text-neutral-500">VERIFIED OFFICIAL DOCUMENT • 2025 EDITION</div>
                </div>

                <div className="text-center">
                  <div className="w-28 h-20 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-neutral-50">
                    <span className="text-[10px] text-red-700 font-bold font-mono uppercase">DODGE HQ</span>
                    <span className="text-[9px] text-neutral-500">ختم الإدارة المعتمد</span>
                    <span className="text-[9px] font-mono text-emerald-700 font-black">APPROVED</span>
                  </div>
                  <span className="block text-[10px] font-mono mt-1 text-neutral-500">التوقيع الإداري</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {generationSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {generationSuccess}
              </span>
            ) : (
              <span className="text-xs text-neutral-400">
                اختر الصيغة المناسبة: تحميل ملف PDF مباشر للجهاز أو المعاينة والطباعة الفورية.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleNativePrint}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all flex items-center gap-2 border border-neutral-700 cursor-pointer"
              title="طباعة أو حفظ كـ PDF عبر نافذة المتصفح المدمجة"
            >
              <Printer className="w-4 h-4 text-neutral-300" />
              <span>طباعة / نافذة الحفظ</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white text-xs font-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>جاري إنشاء ملف PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-white" />
                  <span>تصدير وتحميل كـ PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
