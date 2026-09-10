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
  | "love"
  | "crying"
  | "angry"
  | "dizzy"
  | "sick";

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

  const noBlink = mood === "dizzy" || mood === "sick" || mood === "angry" || mood === "crying";

  useEffect(() => {
    if (still || reduced || clock || noBlink) return;
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
  }, [still, reduced, mood, lookAt, clock, noBlink]);

  const lidClosed = eyesClosed || (blink && !noBlink) || mood === "sleepy";
  const offsetX = lookAt && !noBlink ? clamp(lookAt.x, -1, 1) * 9 : noBlink ? 0 : idleGlance;
  const offsetY = lookAt && !noBlink ? clamp(lookAt.y, -1, 1) * 6 : 0;

  const angry = mood === "angry";
  const crying = mood === "crying";
  const sick = mood === "sick";

  return (
    <svg
      viewBox="0 0 320 300"
      className={className}
      role="img"
      aria-label={title ?? `Darling looking ${mood}`}
    >
      <defs>
        <linearGradient id="df-casing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--milk-white)" />
          <stop offset="100%" stopColor="var(--cream-deep)" />
        </linearGradient>
        <linearGradient id="df-casing-hot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--blush)" />
          <stop offset="100%" stopColor="var(--coral)" />
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
        <linearGradient id="df-goo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ede6b" />
          <stop offset="100%" stopColor="#5fb83f" />
        </linearGradient>
      </defs>

      {/* side casing discs (part of the shell, not limbs) */}
      <g>
        <ellipse cx="42" cy="126" rx="24" ry="34" fill={angry ? "url(#df-casing-hot)" : "url(#df-casing)"} />
        <ellipse cx="42" cy="126" rx="12" ry="18" fill="var(--blush)" opacity="0.55" />
        <ellipse cx="278" cy="126" rx="24" ry="34" fill={angry ? "url(#df-casing-hot)" : "url(#df-casing)"} />
        <ellipse cx="278" cy="126" rx="12" ry="18" fill="var(--blush)" opacity="0.55" />
      </g>

      {/* body shell */}
      <rect
        x="46"
        y="26"
        width="228"
        height="206"
        rx="72"
        fill={angry ? "url(#df-casing-hot)" : "url(#df-casing)"}
        style={{ transition: reduced ? "none" : "fill 400ms ease" }}
      />
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

      {/* steam puffs when Darling is cross */}
      {angry ? (
        <g fill="var(--milk-white)" opacity="0.85">
          <circle className={reduced ? undefined : "animate-steam"} cx="86" cy="34" r="9" />
          <circle className={reduced ? undefined : "animate-steam"} style={{ animationDelay: "300ms" }} cx="234" cy="34" r="9" />
          <circle className={reduced ? undefined : "animate-steam"} style={{ animationDelay: "600ms" }} cx="110" cy="24" r="6" />
        </g>
      ) : null}

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

      {/* tears */}
      {crying ? (
        <g fill="#8fd3f4">
          {[0, 1, 2].map((i) => (
            <g key={`tl${i}`}>
              <path
                className={reduced ? undefined : "animate-tear"}
                style={{ animationDelay: `${i * 420}ms` }}
                d={tearPath(126, 150)}
              />
              <path
                className={reduced ? undefined : "animate-tear"}
                style={{ animationDelay: `${i * 420 + 210}ms` }}
                d={tearPath(194, 150)}
              />
            </g>
          ))}
        </g>
      ) : null}

      {/* cartoon sick stream */}
      {sick ? (
        <g>
          <path
            className={reduced ? undefined : "animate-vomit"}
            d="M148 190 q12 30 -2 56 q16 14 26 0 q-12 -28 0 -56z"
            fill="url(#df-goo)"
          />
          <g fill="#7ccf55" className={reduced ? undefined : "animate-vomit"} style={{ animationDelay: "260ms" }}>
            <circle cx="140" cy="252" r="7" />
            <circle cx="176" cy="262" r="5" />
            <circle cx="160" cy="272" r="9" />
          </g>
        </g>
      ) : null}

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

  if (mood === "dizzy") {
    return (
      <g style={{ transition }}>
        <path
          d={spiralPath(cx, cy, 22)}
          fill="none"
          stroke="var(--milk-white)"
          strokeWidth="5"
          strokeLinecap="round"
          className={reduced ? undefined : "animate-swirl"}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </g>
    );
  }

  if (mood === "sick") {
    return (
      <path
        d={`M${cx - 22} ${cy} q11 -12 22 0 q11 12 22 0`}
        fill="none"
        stroke="#9ede6b"
        strokeWidth="7"
        strokeLinecap="round"
        style={{ transition }}
      />
    );
  }

  if (mood === "angry") {
    const inner = side === "left" ? 1 : -1;
    return (
      <g style={{ transition }}>
        <ellipse cx={cx} cy={cy + 4} rx="20" ry="16" fill="var(--coral)" />
        <circle cx={cx} cy={cy + 4} r="7" fill="var(--charcoal)" opacity="0.55" />
        <path
          d={`M${cx - 22 * inner} ${cy - 20} L${cx + 20 * inner} ${cy - 6}`}
          stroke="var(--milk-white)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (mood === "crying") {
    return (
      <g style={{ transition }}>
        <ellipse cx={cx} cy={cy + 2} rx="20" ry="23" fill="var(--milk-white)" />
        <circle cx={cx} cy={cy + 6} r="9" fill="#8fd3f4" opacity="0.85" />
        <path
          d={`M${cx - 20} ${cy - 22} q20 -12 40 2`}
          stroke="var(--milk-white)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>
    );
  }

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
    crying: { rx: 20, ry: 23, dy: 2 },
    angry: { rx: 20, ry: 16, dy: 4 },
    dizzy: { rx: 20, ry: 20, dy: 0 },
    sick: { rx: 20, ry: 20, dy: 0 },
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

function tearPath(cx: number, cy: number) {
  return `M${cx} ${cy} c6 8 9 12 9 17 a9 9 0 0 1 -18 0 c0 -5 3 -9 9 -17z`;
}

function spiralPath(cx: number, cy: number, maxR: number) {
  const points: string[] = [];
  const turns = 2.4;
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const r = t * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
