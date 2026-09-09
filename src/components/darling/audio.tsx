import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type Tone = "mood" | "pat" | "wake" | "tick" | "win";

type AudioApi = {
  soundOn: boolean;
  toggleSound: () => void;
  play: (tone: Tone) => void;
};

const AudioCtx = createContext<AudioApi | null>(null);

const notes: Record<Tone, number[]> = {
  mood: [660, 880],
  pat: [784, 1046],
  wake: [523, 784, 1046],
  tick: [440],
  win: [659, 784, 988, 1318],
};

export function DarlingAudioProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (tone: Tone) => {
      if (!soundOn) return;
      try {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AC();
        const ctx = ctxRef.current;
        void ctx.resume();
        notes[tone].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.09;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      } catch {
        /* audio is a nicety; never break the page for it */
      }
    },
    [soundOn],
  );

  const value = useMemo<AudioApi>(
    () => ({ soundOn, toggleSound: () => setSoundOn((v) => !v), play }),
    [soundOn, play],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useDarlingAudio(): AudioApi {
  const ctx = useContext(AudioCtx);
  return ctx ?? { soundOn: false, toggleSound: () => {}, play: () => {} };
}
