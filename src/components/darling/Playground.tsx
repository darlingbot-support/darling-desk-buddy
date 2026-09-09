import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Gamepad2, Pause, Play, RotateCcw, Sparkles, Timer } from "lucide-react";

import { DarlingStage } from "./DarlingStage";
import { type Mood } from "./DarlingFace";
import { useDarlingAudio } from "./audio";

type Tab = "focus" | "clock" | "game" | "wake";

const tabs: { id: Tab; label: string; icon: typeof Timer }[] = [
  { id: "focus", label: "Focus mode", icon: Timer },
  { id: "clock", label: "Clock mode", icon: Clock },
  { id: "game", label: "Mini-game", icon: Gamepad2 },
  { id: "wake", label: "Wake word", icon: Sparkles },
];

const FOCUS_SECONDS = 25 * 60;

export function Playground() {
  const [tab, setTab] = useState<Tab>("focus");
  const { play } = useDarlingAudio();

  // ---- focus timer -------------------------------------------------------
  const [left, setLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          play("win");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, play]);
  const done = left === 0;

  // ---- clock mode --------------------------------------------------------
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ---- reflex mini-game --------------------------------------------------
  type GameState = "idle" | "waiting" | "go" | "result" | "early";
  const [game, setGame] = useState<GameState>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startedAt = useRef(0);
  const goTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (goTimer.current) clearTimeout(goTimer.current); }, []);

  const startGame = useCallback(() => {
    setMs(null);
    setGame("waiting");
    if (goTimer.current) clearTimeout(goTimer.current);
    goTimer.current = setTimeout(
      () => {
        startedAt.current = performance.now();
        play("tick");
        setGame("go");
      },
      1200 + Math.random() * 2600,
    );
  }, [play]);

  const tapGame = useCallback(() => {
    if (game === "waiting") {
      if (goTimer.current) clearTimeout(goTimer.current);
      setGame("early");
      return;
    }
    if (game === "go") {
      const took = Math.round(performance.now() - startedAt.current);
      setMs(took);
      setBest((b) => (b === null || took < b ? took : b));
      play("win");
      setGame("result");
    }
  }, [game, play]);

  // ---- wake word ---------------------------------------------------------
  const [awake, setAwake] = useState(false);
  const wakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (wakeTimer.current) clearTimeout(wakeTimer.current); }, []);
  const callDarling = () => {
    play("wake");
    setAwake(true);
    if (wakeTimer.current) clearTimeout(wakeTimer.current);
    wakeTimer.current = setTimeout(() => setAwake(false), 2600);
  };

  // ---- what the face should do ------------------------------------------
  let mood: Mood = "happy";
  let eyesClosed = false;
  let clock: string | null = null;
  if (tab === "focus") mood = done ? "excited" : running ? "focus" : "curious";
  if (tab === "clock") clock = now;
  if (tab === "game") {
    mood = game === "go" ? "surprised" : game === "result" ? "excited" : "playful";
    eyesClosed = game === "waiting";
  }
  if (tab === "wake") mood = awake ? "excited" : "sleepy";

  return (
    <section id="playground" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-mauve uppercase">Try it here</p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-charcoal sm:text-4xl">
            Play with what Darling can do.
          </h2>
          <p className="mt-4 text-lg text-charcoal/70">
            These are working previews of the modes planned for the device. Run a focus session,
            flip it into clock mode, test your reflexes, or call its name.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2.5rem] bg-milk shadow-soft">
          <div className="flex gap-2 overflow-x-auto border-b border-charcoal/5 p-3 sm:p-4">
            {tabs.map((t) => {
              const Icon = t.icon;
              const on = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  aria-pressed={on}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none ${
                    on ? "bg-coral text-milk shadow-glow" : "bg-cream text-charcoal/70 hover:text-coral"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_1.05fr] lg:items-center">
            <DarlingStage
              mood={mood}
              clock={clock}
              eyesClosed={eyesClosed}
              className={`mx-auto aspect-square w-full max-w-xs ${awake ? "animate-perk" : ""}`}
              title="Darling responding to the demo you picked"
            />

            <div key={tab} className="animate-rise">
              {tab === "focus" ? (
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-charcoal">
                    25-minute focus session
                  </h3>
                  <p className="mt-2 text-charcoal/70">
                    Darling dims into a steady focus face and stays quiet until the session ends,
                    then celebrates with you.
                  </p>
                  <p className="mt-6 font-display text-6xl font-extrabold tabular-nums text-charcoal">
                    {fmt(left)}
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-coral transition-[width] duration-1000 ease-linear"
                      style={{ width: `${((FOCUS_SECONDS - left) / FOCUS_SECONDS) * 100}%` }}
                    />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setRunning((r) => !r);
                        play("tick");
                      }}
                      disabled={done}
                      className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-40"
                    >
                      {running ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                      {running ? "Pause" : left === FOCUS_SECONDS ? "Start focus" : "Resume"}
                    </button>
                    <button
                      onClick={() => {
                        setRunning(false);
                        setLeft(FOCUS_SECONDS);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-charcoal/12 px-6 py-3 font-semibold text-charcoal transition-colors hover:border-coral/40 hover:text-coral"
                    >
                      <RotateCcw className="size-4" aria-hidden />
                      Reset
                    </button>
                  </div>
                  <p aria-live="polite" className="mt-4 text-sm text-mauve">
                    {done
                      ? "Session complete. Darling is thrilled with you."
                      : running
                        ? "Deep focus mode — quiet face, no interruptions."
                        : "Press start whenever you're ready."}
                  </p>
                </div>
              ) : null}

              {tab === "clock" ? (
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-charcoal">Retro clock mode</h3>
                  <p className="mt-2 text-charcoal/70">
                    The face turns into a soft glowing clock showing your actual local time — handy
                    on a bedside table or the corner of a desk.
                  </p>
                  <p className="mt-6 rounded-3xl bg-cream p-5 text-charcoal/70">
                    Right now it reads{" "}
                    <span className="font-display text-xl font-extrabold text-charcoal">{now ?? "--:--"}</span>. Switch
                    to any other tab to give Darling its eyes back.
                  </p>
                </div>
              ) : null}

              {tab === "game" ? (
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-charcoal">Peek-a-boo reflex test</h3>
                  <p className="mt-2 text-charcoal/70">
                    Darling closes its eyes. The instant they snap open, tap. This is the same reflex
                    engine behind the built-in mini-games.
                  </p>
                  <div className="mt-6 rounded-3xl bg-cream p-5">
                    <p aria-live="polite" className="min-h-12 text-charcoal/80">
                      {game === "idle" && "Ready when you are."}
                      {game === "waiting" && "Eyes closed… wait for it."}
                      {game === "go" && "Now! Tap!"}
                      {game === "early" && "Too early — Darling was still hiding."}
                      {game === "result" && ms !== null && `${ms} ms. ${verdict(ms)}`}
                    </p>
                    {best !== null ? (
                      <p className="mt-1 text-sm text-mauve">Your best: {best} ms</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={game === "waiting" || game === "go" ? tapGame : startGame}
                        className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:scale-[.98]"
                      >
                        <Gamepad2 className="size-4" aria-hidden />
                        {game === "waiting" || game === "go" ? "Tap!" : game === "idle" ? "Start game" : "Play again"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "wake" ? (
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-charcoal">Try calling "Hey Darling"</h3>
                  <p className="mt-2 text-charcoal/70">
                    On the device the wake word is recognised on-chip — nothing is recorded and
                    nothing leaves the room. Here's how it perks up.
                  </p>
                  <button
                    onClick={callDarling}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-7 py-4 text-base font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:scale-[.98]"
                  >
                    <Sparkles className="size-4" aria-hidden />
                    Say "Hey Darling"
                  </button>
                  <p aria-live="polite" className="mt-4 text-sm text-mauve">
                    {awake
                      ? "Darling woke up and is waiting for you."
                      : "Turn sound on in the header to hear the chime."}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function verdict(ms: number) {
  if (ms < 250) return "Lightning quick.";
  if (ms < 400) return "Nice and sharp.";
  return "Darling got you that time.";
}
