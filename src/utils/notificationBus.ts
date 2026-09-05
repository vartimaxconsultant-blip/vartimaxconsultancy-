import { AgentNotification } from '../types';

type NotificationListener = (notification: AgentNotification) => void;

const listeners: Set<NotificationListener> = new Set();

let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('vartimax_agent_channel');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_CLIENT_INQUIRY') {
        listeners.forEach((listener) => listener(event.data.notification));
      }
    };
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

export const notificationBus = {
  subscribe(listener: NotificationListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emit(notification: AgentNotification) {
    // Notify local listeners
    listeners.forEach((listener) => listener(notification));

    // Broadcast across other open browser tabs
    if (channel) {
      try {
        channel.postMessage({ type: 'NEW_CLIENT_INQUIRY', notification });
      } catch (e) {
        console.warn('Channel postMessage error:', e);
      }
    }
  }
};
