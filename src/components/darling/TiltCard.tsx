import { useRef, useState, type ReactNode } from "react";

import { useDarlingAudio } from "./audio";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Sound played on click. */
  tone?: "tick" | "pat" | "mood";
  /** Rendered element tag. */
  as?: "div" | "li" | "article";
  onActivate?: () => void;
};

/**
 * A card that leans toward the pointer, springs on hover and gives a little
 * squish plus a chime when tapped. Used for every box on the page.
 */
export function TiltCard({ children, className = "", tone = "tick", as = "div", onActivate }: Props) {
  const reduced = usePrefersReducedMotion();
  const { play } = useDarlingAudio();
  const [t, setT] = useState({ x: 0, y: 0 });
  const [press, setPress] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Tag = as;

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ x: -py * 8, y: px * 10 });
  };

  const activate = () => {
    play(tone);
    onActivate?.();
    setPress(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPress(false), 420);
  };

  return (
    <Tag
      onPointerMove={onMove}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      onClick={activate}
      className={`transition-[transform,box-shadow] duration-300 ease-out hover:shadow-glow ${press && !reduced ? "animate-squish" : ""} ${className}`}
      style={{
        transform: reduced
          ? undefined
          : `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg) translateY(${t.x || t.y ? -4 : 0}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Tag>
  );
}
