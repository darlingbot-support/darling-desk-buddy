import { useCallback, useEffect, useRef, useState } from "react";

import { DarlingFace, type Mood } from "./DarlingFace";
import { useDarlingAudio } from "./audio";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  mood: Mood;
  className?: string;
  /** Eyes follow the pointer anywhere on the page. */
  track?: boolean;
  /** Clicking Darling triggers the affectionate reaction. */
  pattable?: boolean;
  /** 3D tilt as the pointer moves over the card. */
  tilt?: boolean;
  clock?: string | null;
  eyesClosed?: boolean;
  glow?: boolean;
  title?: string;
  onPat?: () => void;
};

type Heart = { id: number; x: number; delay: number };

export function DarlingStage({
  mood,
  className = "",
  track = true,
  pattable = true,
  tilt = true,
  clock = null,
  eyesClosed = false,
  glow = true,
  title,
  onPat,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { play } = useDarlingAudio();
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tiltXY, setTiltXY] = useState({ x: 0, y: 0 });
  const [patted, setPatted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const patTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!track || reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = (e.clientX - cx) / Math.max(r.width, 240);
      const ny = (e.clientY - cy) / Math.max(r.height, 240);
      setLook({ x: Math.max(-1, Math.min(1, nx * 1.6)), y: Math.max(-1, Math.min(1, ny * 1.6)) });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [track, reduced]);

  useEffect(() => () => { if (patTimer.current) clearTimeout(patTimer.current); }, []);

  const pat = useCallback(() => {
    if (!pattable) return;
    play("pat");
    onPat?.();
    setPatted(true);
    const base = Date.now();
    setHearts((h) => [
      ...h,
      { id: base, x: 46, delay: 0 },
      { id: base + 1, x: 24, delay: 120 },
      { id: base + 2, x: 68, delay: 220 },
    ]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id < base || x.id > base + 2)), 1600);
    if (patTimer.current) clearTimeout(patTimer.current);
    patTimer.current = setTimeout(() => setPatted(false), 1800);
  }, [pattable, play, onPat]);

  const onTiltMove = (e: React.PointerEvent) => {
    if (!tilt || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTiltXY({ x: -py * 14, y: px * 16 });
  };

  const shownMood: Mood = patted ? "love" : mood;

  return (
    <div ref={wrapRef} className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <div
        onPointerMove={onTiltMove}
        onPointerLeave={() => setTiltXY({ x: 0, y: 0 })}
        onClick={pat}
        onKeyDown={(e) => {
          if (pattable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            pat();
          }
        }}
        role={pattable ? "button" : undefined}
        tabIndex={pattable ? 0 : undefined}
        aria-label={pattable ? "Pat Darling" : undefined}
        className={`relative size-full rounded-[2rem] transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-4 focus-visible:ring-offset-transparent focus-visible:outline-none ${
          pattable ? "cursor-pointer" : ""
        }`}
        style={{
          transform: `rotateX(${tiltXY.x}deg) rotateY(${tiltXY.y}deg) scale(${patted && !reduced ? 1.03 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {glow ? (
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_48%,var(--milk-white)_0%,var(--blush)_58%,transparent_72%)] transition-opacity duration-500"
            style={{ opacity: mood === "sleepy" ? 0.4 : patted ? 1 : 0.82 }}
          />
        ) : null}

        <DarlingFace
          mood={shownMood}
          clock={clock}
          eyesClosed={eyesClosed}
          lookAt={track && !reduced ? look : undefined}
          title={title}
          className={`absolute inset-x-[10%] top-[16%] w-[80%] drop-shadow-[0_24px_40px_rgba(33,28,34,0.18)] ${
            patted && !reduced ? "animate-pat-bounce" : ""
          }`}
        />

        {hearts.map((h) => (
          <span
            key={h.id}
            aria-hidden
            className="animate-heart-float pointer-events-none absolute bottom-[26%] text-2xl"
            style={{ left: `${h.x}%`, animationDelay: `${h.delay}ms` }}
          >
            💗
          </span>
        ))}
      </div>
    </div>
  );
}
