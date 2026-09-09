import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type Mood =
  | "curious"
  | "focus"
  | "sleepy"
  | "surprised"
  | "happy"
  | "excited"
  | "playful"
  | "love";

type Props = {
  mood?: Mood;
  className?: string;
  /** Disables the idle blink/glance loop (used for tiny static marks). */
  still?: boolean;
  /** -1..1 on each axis: where the eyes should look. */
  lookAt?: { x: number; y: number } | undefined;
  /** Replaces the eyes with a clock readout. */
  clock?: string | null | undefined;
  /** Forces the eyes shut, e.g. peek-a-boo. */
  eyesClosed?: boolean;
  title?: string | undefined;
};

/**
 * Darling's physical form: a compact rounded casing with a glossy screen face.
 * No arms, no legs, no antenna — the personality lives entirely in the eyes.
 */
export function DarlingFace({
  mood = "happy",
  className,
  still = false,
  lookAt,
  clock = null,
  eyesClosed = false,
  title,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [idleGlance, setIdleGlance] = useState(0);
  const reduced = usePrefersReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (still || reduced || clock) return;
    let cancelled = false;
    const loop = () => {
      const wait = mood === "sleepy" ? 3000 + Math.random() * 2000 : 2200 + Math.random() * 3600;
      timer.current = setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        setTimeout(() => !cancelled && setBlink(false), mood === "sleepy" ? 320 : 130);
        if (!lookAt && Math.random() > 0.55) {
          setIdleGlance(Math.random() > 0.5 ? 5 : -5);
          setTimeout(() => !cancelled && setIdleGlance(0), 900);
        }
        loop();
      }, wait);
    };
    loop();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [still, reduced, mood, lookAt, clock]);

  const lidClosed = eyesClosed || blink || mood === "sleepy";
  const offsetX = lookAt ? clamp(lookAt.x, -1, 1) * 9 : idleGlance;
  const offsetY = lookAt ? clamp(lookAt.y, -1, 1) * 6 : 0;

  return (
    <svg
      viewBox="0 0 320 260"
      className={className}
      role="img"
      aria-label={title ?? `Darling looking ${mood}`}
    >
      <defs>
        <linearGradient id="df-casing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--milk-white)" />
          <stop offset="100%" stopColor="var(--cream-deep)" />
        </linearGradient>
        <linearGradient id="df-screen" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3a323c" />
          <stop offset="45%" stopColor="var(--charcoal)" />
          <stop offset="100%" stopColor="#171317" />
        </linearGradient>
        <radialGradient id="df-cheek">
          <stop offset="0%" stopColor="var(--blush)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--blush)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* side casing discs (part of the shell, not limbs) */}
      <g>
        <ellipse cx="42" cy="126" rx="24" ry="34" fill="url(#df-casing)" />
        <ellipse cx="42" cy="126" rx="12" ry="18" fill="var(--blush)" opacity="0.55" />
        <ellipse cx="278" cy="126" rx="24" ry="34" fill="url(#df-casing)" />
        <ellipse cx="278" cy="126" rx="12" ry="18" fill="var(--blush)" opacity="0.55" />
      </g>

      {/* body shell */}
      <rect x="46" y="26" width="228" height="206" rx="72" fill="url(#df-casing)" />
      <rect
        x="46"
        y="26"
        width="228"
        height="206"
        rx="72"
        fill="none"
        stroke="var(--charcoal)"
        strokeOpacity="0.08"
        strokeWidth="2"
      />

      {/* screen face */}
      <rect x="70" y="50" width="180" height="146" rx="56" fill="url(#df-screen)" />
      <path
        d="M92 74c18-16 46-22 74-20-30 6-52 18-66 38-6 8-12 4-8-18z"
        fill="var(--milk-white)"
        opacity="0.14"
      />

      {/* cheeks — brighter when Darling is feeling loved */}
      <g style={{ transition: reduced ? "none" : "opacity 400ms ease" }} opacity={mood === "love" ? 1 : 0.75}>
        <ellipse cx="104" cy="152" rx={mood === "love" ? 20 : 16} ry={mood === "love" ? 13 : 10} fill="url(#df-cheek)" />
        <ellipse cx="216" cy="152" rx={mood === "love" ? 20 : 16} ry={mood === "love" ? 13 : 10} fill="url(#df-cheek)" />
      </g>

      {clock ? (
        <text
          x="160"
          y="136"
          textAnchor="middle"
          fill="var(--milk-white)"
          fontFamily="var(--font-display), monospace"
          fontSize="42"
          fontWeight="700"
          letterSpacing="2"
        >
          {clock}
        </text>
      ) : (
        <g
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            transition: reduced ? "none" : "transform 420ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <Eye side="left" mood={mood} closed={lidClosed} reduced={reduced} />
          <Eye side="right" mood={mood} closed={lidClosed} reduced={reduced} />
        </g>
      )}

      {mood === "excited" || mood === "playful" ? (
        <g fill="var(--blush)" opacity="0.9">
          <path d="M258 62l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
          <path d="M66 176l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        </g>
      ) : null}
    </svg>
  );
}

function Eye({
  side,
  mood,
  closed,
  reduced,
}: {
  side: "left" | "right";
  mood: Mood;
  closed: boolean;
  reduced: boolean;
}) {
  const cx = side === "left" ? 128 : 192;
  const cy = 122;
  const transition = reduced ? "none" : "all 320ms cubic-bezier(.22,1,.36,1)";

  if (mood === "love" && !closed) {
    return (
      <path
        d={heartPath(cx, cy, 1.5)}
        fill="var(--blush)"
        style={{ transition }}
        className={reduced ? undefined : "animate-heartbeat"}
      />
    );
  }

  if (closed) {
    return (
      <path
        d={`M${cx - 22} ${cy} q22 ${mood === "sleepy" ? 16 : 12} 44 0`}
        stroke="var(--milk-white)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        style={{ transition }}
      />
    );
  }

  if (mood === "happy") {
    return (
      <path
        d={`M${cx - 22} ${cy + 8} q22 -26 44 0`}
        stroke="var(--milk-white)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ transition }}
      />
    );
  }

  if (mood === "playful") {
    // one winking arc, one wide eye
    if (side === "left") {
      return (
        <path
          d={`M${cx - 20} ${cy + 6} q20 -22 40 0`}
          stroke="var(--milk-white)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          style={{ transition }}
        />
      );
    }
  }

  if (mood === "focus") {
    return <rect x={cx - 22} y={cy - 6} width="44" height="13" rx="6.5" fill="var(--milk-white)" style={{ transition }} />;
  }

  const geometry: Record<Mood, { rx: number; ry: number; dy: number }> = {
    curious: { rx: side === "left" ? 20 : 15, ry: side === "left" ? 24 : 18, dy: -4 },
    surprised: { rx: 25, ry: 27, dy: -2 },
    excited: { rx: 19, ry: 26, dy: -2 },
    playful: { rx: 20, ry: 24, dy: -2 },
    sleepy: { rx: 18, ry: 10, dy: 4 },
    happy: { rx: 19, ry: 22, dy: 0 },
    love: { rx: 20, ry: 22, dy: 0 },
    focus: { rx: 20, ry: 8, dy: 0 },
  };
  const g = geometry[mood];

  return (
    <g style={{ transition }}>
      <ellipse cx={cx} cy={cy + g.dy} rx={g.rx} ry={g.ry} fill="var(--milk-white)" />
      <circle cx={cx - g.rx * 0.32} cy={cy + g.dy - g.ry * 0.38} r={g.rx * 0.26} fill="var(--charcoal)" opacity="0.18" />
      <circle cx={cx + g.rx * 0.34} cy={cy + g.dy + g.ry * 0.34} r={g.rx * 0.18} fill="var(--blush)" opacity="0.75" />
    </g>
  );
}

function heartPath(cx: number, cy: number, s: number) {
  const w = 14 * s;
  return `M${cx} ${cy + w * 0.75} C${cx - w * 1.5} ${cy - w * 0.25} ${cx - w * 0.6} ${cy - w * 1.35} ${cx} ${cy - w * 0.35} C${cx + w * 0.6} ${cy - w * 1.35} ${cx + w * 1.5} ${cy - w * 0.25} ${cx} ${cy + w * 0.75}Z`;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
