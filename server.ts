import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface StaffPresenceData {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  role: string;
  branch: string;
  status: 'online' | 'busy' | 'away';
  lastActive: string;
  activeChannel?: string;
}

interface StaffMessageData {
  id: string;
  channelId: string;
  senderId: string;
  senderCode: string;
  senderName: string;
  senderRole: string;
  senderBranch: string;
  content: string;
  timestamp: string;
  isUrgent?: boolean;
  isAnnouncement?: boolean;
  pinned?: boolean;
  reactions?: Record<string, string[]>;
}

// In-Memory Staff Chat Storage with initial realistic communications
const staffMessages: StaffMessageData[] = [
  {
    id: 'msg-seed-1',
    channelId: 'general',
    senderId: 'emp-101',
    senderCode: '101',
    senderName: 'سلطان القحطاني',
    senderRole: 'كبير مسؤولي المبيعات',
    senderBranch: 'الرياض - خريص',
    content: 'صباح الخير جميعاً! تم تجهيز صالة العرض لوصول شحنة دورانجو هيلكات 2025 بلون Destroyer Gray.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    reactions: { '🔥': ['102', '103'], '👍': ['104'] }
  },
  {
    id: 'msg-seed-2',
    channelId: 'general',
    senderId: 'emp-102',
    senderCode: '102',
    senderName: 'محمد الشهري',
    senderRole: 'استشاري مبيعات V8 SRT',
    senderBranch: 'جدة - طريق الملك',
    content: 'تم تأكيد حجز تجربة قيادة لعميل VIP لطراز SRT 392 بقوة 475 حصان اليوم عصراً.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    reactions: { '🏁': ['101', '105'] }
  },
  {
    id: 'msg-seed-3',
    channelId: 'sales',
    senderId: 'emp-103',
    senderCode: '103',
    senderName: 'فهد الدوسري',
    senderRole: 'أخصائي تجارب القيادة والحلبات',
    senderBranch: 'الرياض - خريص',
    content: 'تنبيه لفريق المبيعات: تم فحص إطارات وبطانات فرامل بريمبو لسيارة التجربة هيلكات جاهزة للحلبة بالكامل.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    reactions: { '⚡': ['101', '102'] }
  },
  {
    id: 'msg-seed-4',
    channelId: 'management',
    senderId: 'emp-admin',
    senderCode: '001',
    senderName: 'إدارة المعرض والعمليات',
    senderRole: 'الإدارة العليا - المركز الإقليمي',
    senderBranch: 'الرياض - المقر الإقليمي',
    content: 'تعميم إداري: تم تفعيل ميزة تصدير التقارير الرسمية كـ PDF، ويرجى من جميع المستشارين متابعة حجوزات العملاء بشكل فوري.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isAnnouncement: true,
    pinned: true,
    reactions: { '👏': ['101', '102', '103', '104'] }
  }
];

// Active Connected Staff Map (Socket -> StaffPresence)
const activeSockets = new Map<WebSocket, StaffPresenceData>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Create HTTP Server
  const httpServer = http.createServer(app);

  // Attach WebSocket Server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/staff-ws'
  });

  // Broadcast Helper
  const broadcast = (data: any, excludeSocket?: WebSocket) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== excludeSocket) {
        try {
          client.send(payload);
        } catch (e) {
          console.error('Failed to send to client:', e);
        }
      }
    });
  };

  const getOnlineStaffList = (): StaffPresenceData[] => {
    const list: StaffPresenceData[] = [];
    const seenCodes = new Set<string>();
    activeSockets.forEach((staff) => {
      if (!seenCodes.has(staff.employeeCode)) {
        seenCodes.add(staff.employeeCode);
        list.push(staff);
      }
    });
    return list;
  };

  // WebSocket Connection Lifecycle
  wss.on('connection', (ws: WebSocket) => {
    let currentStaff: StaffPresenceData | null = null;

    // Send initial snapshot on connect
    ws.send(JSON.stringify({
      type: 'init',
      messages: staffMessages,
      onlineStaff: getOnlineStaffList()
    }));

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        // 1. Employee Joined / Authenticated in chat
        if (data.type === 'join' && data.employee) {
          currentStaff = {
            employeeId: data.employee.id || `emp-${data.employee.employeeCode}`,
            employeeCode: data.employee.employeeCode,
            fullName: data.employee.fullName,
            role: data.employee.role,
            branch: data.employee.branch,
            status: 'online',
            lastActive: new Date().toISOString(),
            activeChannel: data.channelId || 'general'
          };
          activeSockets.set(ws, currentStaff);

          // Broadcast presence update
          broadcast({
            type: 'presence:update',
            onlineStaff: getOnlineStaffList(),
            joinedEmployee: currentStaff
          });
        }

        // 2. Channel Switch
        if (data.type === 'channel:switch' && currentStaff) {
          currentStaff.activeChannel = data.channelId;
          currentStaff.lastActive = new Date().toISOString();
          activeSockets.set(ws, currentStaff);
          broadcast({
            type: 'presence:update',
            onlineStaff: getOnlineStaffList()
          });
        }

        // 3. New Message
        if (data.type === 'message:send' && data.message) {
          const newMsg: StaffMessageData = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            channelId: data.message.channelId || 'general',
            senderId: currentStaff ? currentStaff.employeeId : (data.message.senderId || 'emp-unknown'),
            senderCode: currentStaff ? currentStaff.employeeCode : (data.message.senderCode || '999'),
            senderName: currentStaff ? currentStaff.fullName : (data.message.senderName || 'موظف مجهول'),
            senderRole: currentStaff ? currentStaff.role : (data.message.senderRole || 'مستشار مبيعات'),
            senderBranch: currentStaff ? currentStaff.branch : (data.message.senderBranch || 'صالة العرض'),
            content: data.message.content.trim(),
            timestamp: new Date().toISOString(),
            isUrgent: !!data.message.isUrgent,
            isAnnouncement: !!data.message.isAnnouncement,
            pinned: !!data.message.pinned,
            reactions: {}
          };

          staffMessages.push(newMsg);
          // Keep recent 500 messages
          if (staffMessages.length > 500) {
            staffMessages.shift();
          }

          // Broadcast new message to everyone
          broadcast({
            type: 'message:new',
            message: newMsg
          });
        }

        // 4. Message Reaction (e.g. 🔥, 👍, 🏁)
        if (data.type === 'message:react' && data.messageId && data.emoji && data.employeeCode) {
          const targetMsg = staffMessages.find((m) => m.id === data.messageId);
          if (targetMsg) {
            if (!targetMsg.reactions) targetMsg.reactions = {};
            const existingUsers = targetMsg.reactions[data.emoji] || [];
            if (existingUsers.includes(data.employeeCode)) {
              // Toggle off
              targetMsg.reactions[data.emoji] = existingUsers.filter((c) => c !== data.employeeCode);
              if (targetMsg.reactions[data.emoji].length === 0) {
                delete targetMsg.reactions[data.emoji];
              }
            } else {
              // Add reaction
              targetMsg.reactions[data.emoji] = [...existingUsers, data.employeeCode];
            }

            broadcast({
              type: 'message:reaction_update',
              messageId: targetMsg.id,
              reactions: targetMsg.reactions
            });
          }
        }

        // 5. Typing Indicator
        if (data.type === 'typing' && currentStaff) {
          broadcast({
            type: 'typing:update',
            employeeCode: currentStaff.employeeCode,
            fullName: currentStaff.fullName,
            channelId: data.channelId || 'general',
            isTyping: !!data.isTyping
          }, ws);
        }

        // 6. Ping / Heartbeat
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }

      } catch (err) {
        console.error('Error handling WS message:', err);
      }
    });

    ws.on('close', () => {
      if (activeSockets.has(ws)) {
        const disconnected = activeSockets.get(ws);
        activeSockets.delete(ws);
        broadcast({
          type: 'presence:update',
          onlineStaff: getOnlineStaffList(),
          leftEmployee: disconnected
        });
      }
    });

    ws.on('error', (err) => {
      console.error('WS client error:', err);
    });
  });

  // REST API Endpoints for Staff Chat
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', onlineCount: activeSockets.size });
  });

  // Get messages (optional channel filter)
  app.get('/api/staff-chat/messages', (req, res) => {
    const channelId = req.query.channel as string;
    if (channelId) {
      const filtered = staffMessages.filter((m) => m.channelId === channelId);
      return res.json({ messages: filtered });
    }
    res.json({ messages: staffMessages });
  });

  // Send message via HTTP fallback
  app.post('/api/staff-chat/messages', (req, res) => {
    const { message } = req.body;
    if (!message || !message.content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const newMsg: StaffMessageData = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      channelId: message.channelId || 'general',
      senderId: message.senderId || 'emp-api',
      senderCode: message.senderCode || '000',
      senderName: message.senderName || 'موظف النظام',
      senderRole: message.senderRole || 'مستشار مبيعات',
      senderBranch: message.senderBranch || 'صالة العرض',
      content: message.content.trim(),
      timestamp: new Date().toISOString(),
      isUrgent: !!message.isUrgent,
      isAnnouncement: !!message.isAnnouncement,
      pinned: !!message.pinned,
      reactions: {}
    };

    staffMessages.push(newMsg);
    broadcast({
      type: 'message:new',
      message: newMsg
    });

    res.json({ status: 'sent', message: newMsg });
  });

  // Get current active online staff
  app.get('/api/staff-chat/presence', (req, res) => {
    res.json({ onlineStaff: getOnlineStaffList() });
  });

  // Vite Middleware Integration (Dev vs Prod)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Dodge Durango App & Staff Live Chat Server running on http://localhost:${PORT}`);
  });
}

startServer();
