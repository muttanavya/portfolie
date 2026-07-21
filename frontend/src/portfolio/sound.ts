// Web Audio API-based UI sound engine. Works on RN Web out of the box.
// On native (iOS/Android) it silently no-ops — recruiters mostly test on web anyway.
import { Platform } from "react-native";

type SoundName = "click" | "whoosh" | "success" | "open" | "close";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = false;

const getContext = () => {
  if (Platform.OS !== "web") return null;
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.35;
      masterGain.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  return ctx;
};

export const setSoundEnabled = (v: boolean) => {
  enabled = v;
  if (v) getContext();
};

export const isSoundEnabled = () => enabled;

const beep = (
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.25,
  freqEnd?: number
) => {
  const c = getContext();
  if (!c || !masterGain) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const now = c.currentTime;
  o.frequency.setValueAtTime(freq, now);
  if (typeof freqEnd === "number") {
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
  }
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.connect(g);
  g.connect(masterGain);
  o.start(now);
  o.stop(now + duration + 0.02);
};

export const playSound = (name: SoundName) => {
  if (!enabled) return;
  if (Platform.OS !== "web") return;
  const c = getContext();
  if (!c) return;
  // resume on user gesture (browsers auto-suspend)
  if (c.state === "suspended") {
    c.resume().catch(() => {});
  }
  switch (name) {
    case "click":
      // short crisp tick
      beep(2200, 0.05, "triangle", 0.18);
      break;
    case "whoosh":
      // downward sweep — feels like transitioning between sections
      beep(900, 0.28, "sine", 0.14, 220);
      break;
    case "open":
      // upward sweep
      beep(400, 0.22, "sine", 0.16, 1100);
      break;
    case "close":
      // downward soft
      beep(700, 0.18, "sine", 0.12, 260);
      break;
    case "success":
      // two-note chime
      beep(880, 0.12, "triangle", 0.18);
      setTimeout(() => beep(1320, 0.18, "triangle", 0.18), 100);
      break;
  }
};
