import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Hand, RefreshCw, RotateCw } from "lucide-react";

import { DarlingFace, type Mood } from "./DarlingFace";
import { useDarlingAudio } from "./audio";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Zone = "head" | "left" | "right" | "belly";
type Reaction = Zone | "dizzy" | "sick" | null;

const zoneCopy: Record<Zone, { mood: Mood; line: string; tone: "pat" | "cry" | "grumpy" }> = {
  head: { mood: "love", line: "Gentle pats are okay! *soft purr*", tone: "pat" },
  left: { mood: "crying", line: "Not the cheeks… *sniffle* waaah!", tone: "cry" },
  right: { mood: "crying", line: "Waaah! Sides are far too ticklish.", tone: "cry" },
  belly: { mood: "angry", line: "Hmph! Down pats make me cross. *steam*", tone: "grumpy" },
};

const ROBOT = 210;

export function SensorLab() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { play } = useDarlingAudio();

  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [dragging, setDragging] = useState(false);
  const [landed, setLanded] = useState(false);
  const [spin, setSpin] = useState(0);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [line, setLine] = useState("Drag Darling around, then try its sensors.");

  const grab = useRef({ dx: 0, dy: 0, moved: 0, zone: null as Zone | null });
  const timers = useRef<ReturnType<typeof setTimeout>[] | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current = [...(timers.current ?? []), id];
  }, []);

  const clearTimers = useCallback(() => {
    (timers.current ?? []).forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => (timers.current ?? []).forEach(clearTimeout), []);

  // centre Darling once the stage is measured
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: Math.max(12, (r.width - ROBOT) / 2), y: Math.max(12, (r.height - ROBOT) / 2 - 10) });
  }, []);

  const trigger = useCallback(
    (zone: Zone) => {
      console.log("TRIGGER", zone);
      clearTimers();
      play(zoneCopy[zone].tone);
      setReaction(zone);
      setLine(zoneCopy[zone].line);
      later(() => {
        setReaction(null);
        setLine("Phew. Try another sensor.");
      }, 2600);
    },
    [clearTimers, later, play],
  );

  const spinHim = useCallback(() => {
    clearTimers();
    play("spin");
    setSpin((s) => s + 360);
    setReaction("dizzy");
    setLine("Wheee— wait, wait, too fast…");
    later(() => {
      play("sick");
      setReaction("sick");
      setLine("Bleeeurgh! Motion sickness. *green pixels everywhere*");
    }, 1400);
    later(() => {
      setReaction("dizzy");
      setLine("Whoa… shaking it off…");
    }, 4000);
    later(() => {
      setReaction(null);
      setLine("All better. Let's never do that again.");
    }, 5400);
  }, [clearTimers, later, play]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const target = e.target as HTMLElement;
    const zoneAttr = target.closest<HTMLElement>("[data-zone]")?.dataset["zone"];
    grab.current = {
      dx: e.clientX - r.left - pos.x,
      dy: e.clientY - r.top - pos.y,
      moved: 0,
      zone: (zoneAttr as Zone | undefined) ?? null,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setLanded(false);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const nx = e.clientX - r.left - grab.current.dx;
    const ny = e.clientY - r.top - grab.current.dy;
    grab.current.moved += Math.abs(nx - pos.x) + Math.abs(ny - pos.y);
    setPos({
      x: Math.min(Math.max(nx, 6), Math.max(6, r.width - ROBOT - 6)),
      y: Math.min(Math.max(ny, 6), Math.max(6, r.height - ROBOT - 6)),
    });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    setLanded(true);
    setTimeout(() => setLanded(false), 700);
    if (grab.current.moved < 10 && grab.current.zone) trigger(grab.current.zone);
    else if (grab.current.moved >= 10) setLine("Set down safely. Sensors ready.");
  };

  const mood: Mood =
    reaction === null
      ? dragging
        ? "surprised"
        : "happy"
      : reaction === "dizzy" || reaction === "sick"
        ? reaction
        : zoneCopy[reaction].mood;

  return (
    <div>
      <div
        ref={stageRef}
        className="relative h-[400px] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,var(--milk-white),var(--cream-deep))] sm:h-[440px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(var(--mauve)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        {/* contact shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-[50%] bg-charcoal/25 blur-md transition-all duration-200"
          style={{
            width: ROBOT * (dragging ? 0.55 : 0.7),
            height: 18,
            left: pos.x + ROBOT / 2 - (ROBOT * (dragging ? 0.55 : 0.7)) / 2,
            top: pos.y + ROBOT - 6,
            opacity: dragging ? 0.35 : 0.55,
          }}
        />

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="button"
          tabIndex={0}
          aria-label="Drag Darling around, or tap its head, sides and base to test the sensors"
          onKeyDown={(e) => {
            const step = 24;
            if (e.key === "ArrowLeft") setPos((p) => ({ ...p, x: Math.max(6, p.x - step) }));
            if (e.key === "ArrowRight") setPos((p) => ({ ...p, x: p.x + step }));
            if (e.key === "ArrowUp") setPos((p) => ({ ...p, y: Math.max(6, p.y - step) }));
            if (e.key === "ArrowDown") setPos((p) => ({ ...p, y: p.y + step }));
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              trigger("head");
            }
          }}
          className={`absolute touch-none select-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            left: pos.x,
            top: pos.y,
            width: ROBOT,
            height: ROBOT,
            transform: `rotate(${spin}deg) scale(${dragging ? 1.06 : 1})`,
            transition: dragging
              ? "transform 200ms ease-out"
              : "transform 1200ms cubic-bezier(.22,1,.36,1), left 220ms cubic-bezier(.22,1,.36,1), top 220ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div
            className={`size-full ${landed && !reduced ? "animate-land" : ""} ${
              reaction === "dizzy" && !reduced ? "animate-wobble" : ""
            }`}
          >
            <DarlingFace
              mood={mood}
              className="pointer-events-none size-full drop-shadow-[0_16px_26px_rgba(33,28,34,0.2)]"
              title={`Darling in the sensor lab, feeling ${mood}`}
            />
          </div>

          {/* sensor zones */}
          <span data-zone="head" className="absolute inset-x-[22%] top-0 h-[26%] rounded-t-full" />
          <span data-zone="left" className="absolute top-[26%] left-0 h-[42%] w-[26%] rounded-l-full" />
          <span data-zone="right" className="absolute top-[26%] right-0 h-[42%] w-[26%] rounded-r-full" />
          <span data-zone="belly" className="absolute inset-x-[22%] bottom-[8%] h-[26%] rounded-b-full" />
        </div>
      </div>

      <p aria-live="polite" className="mt-4 min-h-6 font-display text-lg font-bold text-charcoal">
        {line}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <SensorButton icon={ArrowUp} label="Pat the head" hint="okay" onClick={() => trigger("head")} />
        <SensorButton icon={Hand} label="Pat the sides" hint="cries" onClick={() => trigger("left")} />
        <SensorButton icon={ArrowDown} label="Pat the base" hint="angry" onClick={() => trigger("belly")} />
        <SensorButton icon={RotateCw} label="Spin 360°" hint="dizzy" onClick={spinHim} />
        <SensorButton
          icon={RefreshCw}
          label="Reset"
          onClick={() => {
            clearTimers();
            setReaction(null);
            setSpin(0);
            setLine("Drag Darling around, then try its sensors.");
          }}
        />
      </div>
    </div>
  );
}

function SensorButton({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: typeof Hand;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:bg-coral hover:text-milk hover:shadow-glow active:scale-95 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
    >
      <Icon className="size-4" aria-hidden />
      {label}
      {hint ? <span className="text-xs font-normal opacity-70">({hint})</span> : null}
    </button>
  );
}
