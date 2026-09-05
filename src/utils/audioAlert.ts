// Web Audio API Chime & Desktop Notification Utility for VartiMax Agent Alerts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn('Web Audio not supported or blocked:', err);
    return null;
  }
}

/**
 * Plays an alert chime for newly received client queries.
 * A 3-tone ascending chord: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
 */
export function playNotificationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0.0, duration: 0.18 }, // C5
      { freq: 659.25, time: 0.14, duration: 0.20 }, // E5
      { freq: 783.99, time: 0.28, duration: 0.45 }, // G5
      { freq: 1046.5, time: 0.42, duration: 0.60 }  // C6 (bright bell finish)
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth attack and pleasant exponential decay
      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.05);
    });
  } catch (e) {
    console.warn('Audio alert error:', e);
  }
}

/**
 * Request desktop notification permission from browser
 */
export async function requestDesktopNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Show a native system desktop notification if tab is in background
 */
export function showDesktopNotification(title: string, body: string, onClickUrl?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'vartimax-lead-alert'
    });

    notif.onclick = () => {
      window.focus();
      if (onClickUrl) {
        window.location.hash = onClickUrl;
      }
      notif.close();
    };
  } catch (err) {
    console.warn('Desktop notification error:', err);
  }
}
