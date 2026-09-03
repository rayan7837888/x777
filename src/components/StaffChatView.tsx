import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Radio, MessageSquare, AlertTriangle, 
  Flame, Check, Sparkles, Pin, Bell, Volume2, VolumeX,
  Search, ShieldCheck, ChevronDown, CheckCheck, RefreshCw,
  Clock, Hash, Car, Flag, Info, User, HelpCircle, X,
  FileText, CornerDownLeft, Lock
} from 'lucide-react';
import { StaffChatMessage, StaffPresence, StaffChatChannelId, Employee } from '../types';
import { staffChatClient, ChatState } from '../services/staffChatService';
import { getEmployees } from '../services/employeeStorage';
import { DodgeLogo } from './DodgeLogo';

interface StaffChatViewProps {
  currentEmployee?: Employee | null;
  onClose?: () => void;
  isFloating?: boolean;
}

const CHANNELS: { id: StaffChatChannelId; nameAr: string; icon: string; desc: string }[] = [
  { 
    id: 'general', 
    nameAr: 'صالة العرض العامة', 
    icon: '💬', 
    desc: 'محادثات التنسيق اليومي والعمليات بين مستشاري صالات العرض' 
  },
  { 
    id: 'sales', 
    nameAr: 'مبيعات وحجوزات SRT', 
    icon: '🏎️', 
    desc: 'متابعة حجوزات هيلكات 710 حصان ودورانجو 392 وأسعار العملاء' 
  },
  { 
    id: 'track', 
    nameAr: 'تجارب القيادة والحلبات', 
    icon: '🏁', 
    desc: 'جاهزية سيارات التجربة ومسار الحلبة وأنظمة الفرامل والتسارع' 
  },
  { 
    id: 'management', 
    nameAr: 'الإدارة والتعاميم العليا', 
    icon: '🛡️', 
    desc: 'التعليمات الإدارية وتوجيهات المقر الإقليمي وتقارير الأداء' 
  }
];

const QUICK_REPLIES = [
  'جاهزية دورانجو هيلكات في صالة العرض ✓',
  'وصل عميل تجربة القيادة ومعه موعد معتمد',
  'تم فحص ضغط الإطارات وأنظمة Launch Control',
  'مطلوب مراجعة حجز معلق في لوحة الطلبات',
  'تم تسليم مفتاح السيارة للمشرف الفني'
];

const EMOJIS = ['🔥', '👍', '🏁', '⚡', '👏', '🚨'];

export const StaffChatView: React.FC<StaffChatViewProps> = ({
  currentEmployee,
  onClose,
  isFloating = false
}) => {
  const [chatState, setChatState] = useState<ChatState>(staffChatClient.state);
  const [activeChannel, setActiveChannel] = useState<StaffChatChannelId>('general');
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineDrawer, setShowOnlineDrawer] = useState(false);

  // Authenticated Employee Identity (Locked to the logged-in staff member)
  const activeStaffUser = React.useMemo<Employee>(() => {
    if (currentEmployee) return currentEmployee;
    try {
      const saved = localStorage.getItem('dodge_logged_in_employee');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.employeeCode) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved employee:', e);
    }
    const emps = getEmployees().filter((e) => e.status !== 'terminated');
    return (
      emps[0] || {
        id: 'emp-default',
        employeeCode: '101',
        fullName: 'مستشار مبيعات المعرض',
        role: 'مستشار مبيعات SRT',
        branch: 'صالة العرض - الرياض',
        phone: '0501112233',
        email: 'sales@dodge-ksa.com',
        hireDate: '2022-01-01',
        status: 'active',
        ordersHandled: 12,
      }
    );
  }, [currentEmployee]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Connect and sync with locked employee identity
  useEffect(() => {
    staffChatClient.setEmployee(activeStaffUser);
    staffChatClient.connect(activeStaffUser);

    const unsubscribe = staffChatClient.subscribe((newState) => {
      setChatState({ ...newState });
    });

    return () => {
      unsubscribe();
    };
  }, [activeStaffUser]);

  // Scroll to bottom on new messages or channel switch
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    staffChatClient.resetUnread();
  }, [chatState.messages, activeChannel]);

  // Channel switch handler
  const handleSelectChannel = (chId: StaffChatChannelId) => {
    setActiveChannel(chId);
    staffChatClient.setActiveChannel(chId);
  };

  // Send message strictly bound to active authenticated employee
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    staffChatClient.setEmployee(activeStaffUser);
    staffChatClient.sendMessage(inputText, {
      isUrgent,
      isAnnouncement,
      pinned: isAnnouncement
    });

    setInputText('');
    setIsUrgent(false);
    setIsAnnouncement(false);
    staffChatClient.sendTyping(false);
    inputRef.current?.focus();
  };

  // Handle typing indicator
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0) {
      staffChatClient.sendTyping(true);
    } else {
      staffChatClient.sendTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter messages by current channel & optional search
  const filteredMessages = chatState.messages.filter((msg) => {
    if (msg.channelId !== activeChannel) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.content.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q) ||
      msg.senderCode.includes(q) ||
      msg.senderRole.toLowerCase().includes(q)
    );
  });

  const activeChannelMeta = CHANNELS.find((c) => c.id === activeChannel)!;

  // Typing in this channel
  const typingInChannel = chatState.typingUsers.filter(
    (u) => u.channelId === activeChannel && u.employeeCode !== activeStaffUser?.employeeCode
  );

  return (
    <div 
      className={`flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ${
        isFloating ? 'h-[620px] w-full max-w-[480px]' : 'h-[750px] w-full'
      }`}
      dir="rtl"
    >
      {/* Top Header Bar */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 p-4 shrink-0">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand & Connection Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500 shadow-inner">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
                chatState.isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>شات تواصل الموظفين المباشر</span>
                  <span className="text-red-500 font-mono text-xs">// DODGE LIVE</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${chatState.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-medium text-neutral-300">
                    {chatState.isConnected ? 'متصل أونلاين بالخادم' : 'جاري المزامنة...'}
                  </span>
                </span>
                <span>•</span>
                <button
                  onClick={() => setShowOnlineDrawer(!showOnlineDrawer)}
                  className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{chatState.onlineStaff.length || 1} متواجدون الآن</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Identity & Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Authenticated Fixed Employee Identity Badge (Locked to User) */}
            <div 
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-2.5 shadow-inner"
              title="هويتك الرسمية المعتمدة - التحدث بحسابك الموثق فقط بدون إمكانية التبديل"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-800 text-red-400 font-mono font-black flex items-center justify-center text-[11px]">
                  #{activeStaffUser.employeeCode}
                </div>
                <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black flex items-center justify-center" title="حساب موثق ومقفل">
                  <Lock className="w-2 h-2 text-black stroke-[3]" />
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white leading-none text-xs">
                    {activeStaffUser.fullName}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-full">
                    حسابك الموثق
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                  {activeStaffUser.role} • {activeStaffUser.branch}
                </div>
              </div>
            </div>

            {/* Close button if modal or drawer */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

        {/* Channels Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CHANNELS.map((ch) => {
            const isSelected = activeChannel === ch.id;
            const channelMsgsCount = chatState.messages.filter(m => m.channelId === ch.id).length;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectChannel(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-[1.02]'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-850 border border-neutral-800/80'
                }`}
              >
                <span>{ch.icon}</span>
                <span>{ch.nameAr}</span>
                {channelMsgsCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {channelMsgsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Topic Banner */}
      <div className="bg-neutral-950/90 border-b border-neutral-850 px-4 py-2 flex items-center justify-between text-xs text-neutral-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Hash className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="font-bold text-neutral-200">{activeChannelMeta.nameAr}:</span>
          <span className="truncate text-neutral-400 text-[11px]">{activeChannelMeta.desc}</span>
        </div>

        {/* Search toggle in channel */}
        <div className="relative shrink-0 mr-2">
          <input
            type="text"
            placeholder="بحث بالرسائل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-28 sm:w-36 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] text-white px-2 py-1 pr-6 focus:outline-none focus:border-red-500"
          />
          <Search className="w-3 h-3 text-neutral-500 absolute right-2 top-2" />
        </div>
      </div>

      {/* Main Body: Messages Feed + Optional Online Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="font-bold text-neutral-300 text-sm">
                لا توجد رسائل بعد في قناة #{activeChannelMeta.nameAr}
              </div>
              <p className="text-xs max-w-xs text-neutral-500">
                كن أول من يشارك زملاءه بملاحظات الصالة، حجوزات هيلكات، أو طلبات تجارب القيادة!
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMe = msg.senderCode === activeStaffUser?.employeeCode;
              const isAdmin = msg.senderCode === '001' || msg.senderRole.includes('الإدارة');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMe ? 'items-start' : 'items-start'} animate-in fade-in duration-150`}
                >
                  {/* Sender Info Line */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-red-400">
                      #{msg.senderCode}
                    </span>
                    <span className="text-xs font-black text-white">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ({msg.senderRole} • {msg.senderBranch})
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {isAdmin && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-950 border border-red-700 text-red-300">
                        إدارة معتمدة
                      </span>
                    )}

                    {msg.isUrgent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-950 border border-amber-600 text-amber-300 flex items-center gap-0.5 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        عاجل
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div 
                    className={`relative max-w-[90%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                      msg.isAnnouncement
                        ? 'bg-gradient-to-r from-red-950/80 to-neutral-900 border-2 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                        : isMe
                          ? 'bg-neutral-900 border border-red-900/60 text-white shadow-md'
                          : 'bg-neutral-900/70 border border-neutral-800 text-neutral-100'
                    }`}
                  >
                    {msg.isAnnouncement && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1 border-b border-red-800/50 pb-1">
                        <Pin className="w-3.5 h-3.5" />
                        <span>تعميم إداري معتمد</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Reactions Pill Display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2 pt-1 border-t border-neutral-800/80">
                        {Object.entries(msg.reactions).map(([emoji, usersVal]) => {
                          const users = usersVal as string[];
                          const hasReacted = users.includes(activeStaffUser?.employeeCode || '');
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => staffChatClient.reactToMessage(msg.id, emoji)}
                              className={`px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-mono transition-all cursor-pointer ${
                                hasReacted
                                  ? 'bg-red-950 border border-red-700 text-red-300'
                                  : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                              }`}
                              title={users.join(', ')}
                            >
                              <span>{emoji}</span>
                              <span className="font-bold">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Reaction Bar on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 px-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => staffChatClient.reactToMessage(msg.id, emoji)}
                        className="hover:scale-125 transition-transform p-1 text-xs cursor-pointer"
                        title={`تفاعل بـ ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Online Staff Drawer (Slide-in) */}
        {showOnlineDrawer && (
          <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-3 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-xs text-white">
                <Users className="w-4 h-4 text-red-500" />
                <span>الموظفون المتواجدون أونلاين</span>
              </div>
              <button 
                onClick={() => setShowOnlineDrawer(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 text-[10px] text-neutral-400 leading-tight">
              يتم تحديث قائمة الموظفين المتصلين بالخادم لحظياً عبر WebSockets:
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto flex-1">
              {chatState.onlineStaff.map((staff, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-xs"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-lg bg-neutral-850 flex items-center justify-center font-mono font-bold text-[10px] text-red-400">
                      #{staff.employeeCode}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-neutral-950" />
                  </div>

                  <div className="flex-1 truncate">
                    <div className="font-bold text-white truncate text-xs">
                      {staff.fullName}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {staff.branch}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 text-center font-mono">
              DODGE STAFF // NETWORK OK
            </div>
          </div>
        )}

      </div>

      {/* Typing Indicator */}
      {typingInChannel.length > 0 && (
        <div className="px-4 py-1 bg-neutral-950/80 border-t border-neutral-850 flex items-center gap-2 text-[11px] text-neutral-400">
          <span className="flex space-x-1 space-x-reverse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
          </span>
          <span>
            {typingInChannel.map((u) => u.fullName).join('، ')} يكتب الآن...
          </span>
        </div>
      )}

      {/* Quick Replies Carousel */}
      <div className="px-3 py-1.5 bg-neutral-950 border-t border-neutral-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] text-neutral-500 font-bold shrink-0">ردود سريعة:</span>
        {QUICK_REPLIES.map((rep, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputText(rep);
              inputRef.current?.focus();
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {rep}
          </button>
        ))}
      </div>

      {/* Composer Input Form */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 bg-neutral-900/90 border-t border-neutral-800 shrink-0 space-y-2"
      >
        {/* Modifier Toggles */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUrgent(!isUrgent)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isUrgent
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>تنبيه عاجل</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAnnouncement(!isAnnouncement)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isAnnouncement
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Pin className="w-3 h-3" />
              <span>تعميم إداري</span>
            </button>
          </div>

          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            اضغط Enter للإرسال مباشرة
          </span>
        </div>

        {/* Text Area + Send Button */}
        <div className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={`اكتب رسالة لزملائك في #${activeChannelMeta.nameAr}...`}
            className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-2xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-12 w-12 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer shrink-0"
            title="إرسال الرسالة"
          >
            <Send className="w-5 h-5 -rotate-90" />
          </button>
        </div>
      </form>

    </div>
  );
};
