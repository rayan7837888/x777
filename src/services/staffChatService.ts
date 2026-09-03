import { StaffChatMessage, StaffPresence, StaffChatChannelId, Employee } from '../types';

export interface ChatState {
  isConnected: boolean;
  messages: StaffChatMessage[];
  onlineStaff: StaffPresence[];
  typingUsers: { employeeCode: string; fullName: string; channelId: string }[];
  unreadCount: number;
}

type MessageListener = (message: StaffChatMessage) => void;
type PresenceListener = (onlineStaff: StaffPresence[]) => void;
type StateListener = (state: ChatState) => void;

class StaffChatClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private pollInterval: any = null;
  private currentEmployee: Employee | null = null;
  private activeChannel: StaffChatChannelId = 'general';
  private messageListeners = new Set<MessageListener>();
  private presenceListeners = new Set<PresenceListener>();
  private stateListeners = new Set<StateListener>();

  public state: ChatState = {
    isConnected: false,
    messages: [],
    onlineStaff: [],
    typingUsers: [],
    unreadCount: 0
  };

  constructor() {
    // Initial fetch via REST to ensure fast render
    this.fetchInitialRestData();
  }

  public setEmployee(employee: Employee | null) {
    this.currentEmployee = employee;
    if (this.ws && this.ws.readyState === WebSocket.OPEN && employee) {
      this.sendWs({
        type: 'join',
        employee,
        channelId: this.activeChannel
      });
    }
  }

  public setActiveChannel(channelId: StaffChatChannelId) {
    this.activeChannel = channelId;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendWs({
        type: 'channel:switch',
        channelId
      });
    }
  }

  public connect(employee?: Employee | null) {
    if (employee) {
      this.currentEmployee = employee;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/api/staff-ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.updateState({ isConnected: true });
        
        // Join if employee is present
        if (this.currentEmployee) {
          this.sendWs({
            type: 'join',
            employee: this.currentEmployee,
            channelId: this.activeChannel
          });
        }

        // Start ping interval
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          this.sendWs({ type: 'ping' });
        }, 20000);

        // Clear fallback polling if WS is live
        if (this.pollInterval) {
          clearInterval(this.pollInterval);
          this.pollInterval = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init') {
            this.updateState({
              messages: data.messages || [],
              onlineStaff: data.onlineStaff || []
            });
            this.notifyPresence(data.onlineStaff || []);
          } else if (data.type === 'message:new') {
            const newMsg: StaffChatMessage = data.message;
            // Prevent duplicates
            const exists = this.state.messages.some((m) => m.id === newMsg.id);
            if (!exists) {
              const updated = [...this.state.messages, newMsg];
              this.updateState({
                messages: updated,
                unreadCount: this.state.unreadCount + 1
              });
              this.notifyMessage(newMsg);
              this.playMessageSound();
            }
          } else if (data.type === 'message:reaction_update') {
            const updated = this.state.messages.map((m) =>
              m.id === data.messageId ? { ...m, reactions: data.reactions } : m
            );
            this.updateState({ messages: updated });
          } else if (data.type === 'presence:update') {
            this.updateState({ onlineStaff: data.onlineStaff || [] });
            this.notifyPresence(data.onlineStaff || []);
          } else if (data.type === 'typing:update') {
            const { employeeCode, fullName, channelId, isTyping } = data;
            let currentTyping = [...this.state.typingUsers];
            if (isTyping) {
              if (!currentTyping.some((t) => t.employeeCode === employeeCode)) {
                currentTyping.push({ employeeCode, fullName, channelId });
              }
            } else {
              currentTyping = currentTyping.filter((t) => t.employeeCode !== employeeCode);
            }
            this.updateState({ typingUsers: currentTyping });
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.updateState({ isConnected: false });
        this.cleanupWs();
        // Schedule auto reconnect
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, 3000);
        }
        // Start fallback REST polling
        this.startFallbackPolling();
      };

      this.ws.onerror = (err) => {
        console.warn('WS connection encountered error, falling back to REST sync', err);
        this.ws?.close();
      };
    } catch (e) {
      console.warn('Failed to initialize WebSocket, enabling REST polling', e);
      this.startFallbackPolling();
    }
  }

  public sendMessage(content: string, options?: { isUrgent?: boolean; isAnnouncement?: boolean; pinned?: boolean }) {
    if (!content.trim()) return;

    const sender = this.currentEmployee || {
      id: 'guest-staff',
      employeeCode: '100',
      fullName: 'مستشار مبيعات المعرض',
      role: 'مستشار مبيعات V8 SRT',
      branch: 'صالة العرض - الرياض'
    };

    const payload = {
      type: 'message:send',
      message: {
        channelId: this.activeChannel,
        senderId: sender.id,
        senderCode: sender.employeeCode,
        senderName: sender.fullName,
        senderRole: sender.role,
        senderBranch: sender.branch,
        content: content.trim(),
        isUrgent: options?.isUrgent || false,
        isAnnouncement: options?.isAnnouncement || false,
        pinned: options?.pinned || false
      }
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendWs(payload);
    } else {
      // Fallback via HTTP POST
      fetch('/api/staff-chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: payload.message })
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.message) {
            const updated = [...this.state.messages, resData.message];
            this.updateState({ messages: updated });
          }
        })
        .catch((err) => console.error('REST message send failed:', err));
    }
  }

  public reactToMessage(messageId: string, emoji: string) {
    const senderCode = this.currentEmployee ? this.currentEmployee.employeeCode : '100';
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendWs({
        type: 'message:react',
        messageId,
        emoji,
        employeeCode: senderCode
      });
    }
  }

  public sendTyping(isTyping: boolean) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendWs({
        type: 'typing',
        channelId: this.activeChannel,
        isTyping
      });
    }
  }

  public resetUnread() {
    this.updateState({ unreadCount: 0 });
  }

  private sendWs(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private async fetchInitialRestData() {
    try {
      const [msgRes, presRes] = await Promise.all([
        fetch('/api/staff-chat/messages').then((r) => (r.ok ? r.json() : { messages: [] })),
        fetch('/api/staff-chat/presence').then((r) => (r.ok ? r.json() : { onlineStaff: [] }))
      ]);

      this.updateState({
        messages: msgRes.messages || [],
        onlineStaff: presRes.onlineStaff || []
      });
    } catch (e) {
      console.warn('Initial REST chat sync failed (dev server booting)', e);
    }
  }

  private startFallbackPolling() {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/staff-chat/messages');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > this.state.messages.length) {
            this.updateState({ messages: data.messages });
          }
        }
      } catch (err) {
        // silent
      }
    }, 4000);
  }

  private cleanupWs() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private updateState(partial: Partial<ChatState>) {
    this.state = { ...this.state, ...partial };
    this.stateListeners.forEach((listener) => listener(this.state));
  }

  private notifyMessage(msg: StaffChatMessage) {
    this.messageListeners.forEach((l) => l(msg));
  }

  private notifyPresence(staff: StaffPresence[]) {
    this.presenceListeners.forEach((l) => l(staff));
  }

  public subscribe(listener: StateListener) {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  // Web Audio Chime for Luxury Dodge Staff Radio click
  private playMessageSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5 note

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Audio playback might be restricted before interaction
    }
  }
}

export const staffChatClient = new StaffChatClient();
