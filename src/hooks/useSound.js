import { useCallback, useEffect, useRef } from 'react';

// Tiny synthesized sounds made with the Web Audio API. No audio files needed.
const TONES = {
  x: [{ f: 523, d: 0.08 }],
  o: [{ f: 392, d: 0.08 }],
  undo: [{ f: 330, d: 0.07 }, { f: 262, d: 0.09 }],
  error: [{ f: 180, d: 0.12 }],
  win: [{ f: 523, d: 0.1 }, { f: 659, d: 0.1 }, { f: 784, d: 0.16 }],
  draw: [{ f: 392, d: 0.12 }, { f: 349, d: 0.16 }],
};

export function useSound(enabled) {
  const ctxRef = useRef(null);

  useEffect(
    () => () => {
      ctxRef.current?.close?.().catch(() => {});
      ctxRef.current = null;
    },
    []
  );

  return useCallback(
    (name) => {
      if (!enabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        const ctx = ctxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        let time = ctx.currentTime;
        for (const { f, d } of TONES[name] ?? []) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.0001, time);
          gain.gain.exponentialRampToValueAtTime(0.12, time + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + d);
          osc.connect(gain).connect(ctx.destination);
          osc.start(time);
          osc.stop(time + d + 0.02);
          time += d * 0.9;
        }
      } catch {
        // Sound is optional. Ignore any audio errors.
      }
    },
    [enabled]
  );
}
