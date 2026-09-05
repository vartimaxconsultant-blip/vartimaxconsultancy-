import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AgentNotification } from '../types';
import { playNotificationChime, requestDesktopNotificationPermission, showDesktopNotification } from '../utils/audioAlert';
import { notificationBus } from '../utils/notificationBus';

interface AgentNotificationContextType {
  notifications: AgentNotification[];
  unreadCount: number;
  activePopup: AgentNotification | null;
  dismissPopup: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  desktopAlertsEnabled: boolean;
  requestDesktopAlerts: () => Promise<boolean>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedDetailNotif: AgentNotification | null;
  setSelectedDetailNotif: (notif: AgentNotification | null) => void;
  markAsContacted: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  simulateTestInquiry: () => Promise<void>;
  triggerIncomingAlert: (notif: AgentNotification) => void;
}

const AgentNotificationContext = createContext<AgentNotificationContextType | undefined>(undefined);

export const AgentNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [activePopup, setActivePopup] = useState<AgentNotification | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vmx_agent_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [desktopAlertsEnabled, setDesktopAlertsEnabled] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDetailNotif, setSelectedDetailNotif] = useState<AgentNotification | null>(null);

  // Sound toggle
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vmx_agent_sound', String(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Request browser desktop notifications
  const requestDesktopAlerts = async (): Promise<boolean> => {
    const granted = await requestDesktopNotificationPermission();
    setDesktopAlertsEnabled(granted);
    return granted;
  };

  // Core trigger for new alert
  const triggerIncomingAlert = useCallback((notif: AgentNotification) => {
    // 1. Update state list (avoid duplicate IDs)
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === notif.id);
      if (exists) {
        return prev.map((n) => (n.id === notif.id ? notif : n));
      }
      return [notif, ...prev];
    });

    // 2. Set active popup on screen
    setActivePopup(notif);

    // 3. Play audio chime if enabled
    if (soundEnabled) {
      playNotificationChime();
    }

    // 4. Send desktop system notification
    showDesktopNotification(
      `🚨 VartiMax Agent Alert: ${notif.clientName}`,
      `${notif.summary} - WhatsApp: ${notif.whatsapp}`,
      '#agent-inbox'
    );
  }, [soundEnabled]);

  // Fetch all existing notifications from server
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.warn('Could not fetch notifications from server:', err);
    }
  }, []);

  // Initial load + SSE connection + Polling Fallback
  useEffect(() => {
    fetchNotifications();

    // 1. Subscribe to local window / cross-tab broadcast bus
    const unsubscribeBus = notificationBus.subscribe((notif) => {
      triggerIncomingAlert(notif);
    });

    // 2. Connect to Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/notifications/stream');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.id) {
            triggerIncomingAlert(parsed);
          }
        } catch (e) {
          // Ignore keepalive comments
        }
      };
      eventSource.onerror = () => {
        // SSE closed or errored, fallback to polling
      };
    } catch (e) {
      console.warn('SSE connection failed:', e);
    }

    // 3. Regular polling fallback (every 8 seconds) to check for any new notifications
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications((prev) => {
            // Check if there are newly added notifications that weren't in prev
            const prevIds = new Set(prev.map((n) => n.id));
            const brandNew = data.notifications.filter((n: AgentNotification) => !prevIds.has(n.id));
            if (brandNew.length > 0) {
              // Trigger alert for the latest one
              const latest = brandNew[0];
              setActivePopup(latest);
              if (soundEnabled) playNotificationChime();
              showDesktopNotification(
                `🚨 VartiMax Agent Alert: ${latest.clientName}`,
                `${latest.summary} - WhatsApp: ${latest.whatsapp}`
              );
            }
            return data.notifications;
          });
        }
      } catch (err) {
        // quiet fallback
      }
    }, 8000);

    return () => {
      unsubscribeBus();
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [fetchNotifications, triggerIncomingAlert, soundEnabled]);

  const dismissPopup = () => {
    setActivePopup(null);
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const markAsContacted = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, contacted: true, read: true } : n))
    );
    if (activePopup?.id === id) {
      setActivePopup(null);
    }
    try {
      await fetch(`/api/notifications/${id}/contacted`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const simulateTestInquiry = async () => {
    try {
      const res = await fetch('/api/notifications/simulate-test', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.notification) {
        triggerIncomingAlert(data.notification);
      }
    } catch (err) {
      console.error('Failed to simulate test notification:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AgentNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activePopup,
        dismissPopup,
        soundEnabled,
        toggleSound,
        desktopAlertsEnabled,
        requestDesktopAlerts,
        isDrawerOpen,
        setIsDrawerOpen,
        selectedDetailNotif,
        setSelectedDetailNotif,
        markAsContacted,
        markAsRead,
        markAllRead,
        simulateTestInquiry,
        triggerIncomingAlert
      }}
    >
      {children}
    </AgentNotificationContext.Provider>
  );
};

export const useAgentNotifications = () => {
  const context = useContext(AgentNotificationContext);
  if (!context) {
    throw new Error('useAgentNotifications must be used within an AgentNotificationProvider');
  }
  return context;
};
