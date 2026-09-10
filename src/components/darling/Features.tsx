import {
  Eye,
  Sparkles,
  Hand,
  Move3d,
  Clock,
  Timer,
  Gamepad2,
  Mic,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Eye,
    title: "Expressive face",
    text: "Darling talks through animated eyes — blinks, glances, widening, narrowing, and gentle shifts in expression.",
  },
  {
    icon: Sparkles,
    title: "Mood system",
    text: "Calm, curious, sleepy, happy, surprised, or excited. The mood carries over between moments, so it feels like the same little character all day.",
  },
  {
    icon: Hand,
    title: "Touch reaction",
    text: "A tap or a pat gets a short, visible response. Closer to playing with a small toy than pressing a button.",
  },
  {
    icon: Move3d,
    title: "Motion awareness",
    text: "Pick Darling up, tilt it, or move it suddenly and it reacts — startled, confused, or delighted.",
  },
  {
    icon: Clock,
    title: "Clock mode",
    text: "When idle, Darling settles into a clean ambient clock so the time becomes part of its personality instead of a flat display.",
  },
  {
    icon: Timer,
    title: "Focus timer",
    text: "A local focus-and-break rhythm, guided by visual cues. A gentle shared ritual rather than an alarm that nags.",
  },
  {
    icon: Gamepad2,
    title: "Mini-games",
    text: "Short offline games for the gaps between study or work sessions. Small and quick by design.",
  },
  {
    icon: Mic,
    title: "Local wake word",
    text: "A wake word handled on the device to get Darling's attention, with a touch fallback. Not a voice assistant, and no conversation.",
  },
  {
    icon: ShieldCheck,
    title: "100% offline privacy",
    text: "Reactions and modes run locally. Nothing is uploaded, because there's no account, app, or cloud service behind it.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-mauve uppercase">
            What Darling does
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-charcoal sm:text-4xl">
            Nine small things that add up to a presence.
          </h2>
          <p className="mt-4 text-lg text-charcoal/70">
            Everything below is the planned Version 1 experience. We'll swap these notes for real
            footage once the first prototype is tested.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {features.map((f, i) => (
            <TiltCard
              as="article"
              key={f.title}
              tone={i % 2 === 0 ? "tick" : "mood"}
              className={`group grid cursor-pointer gap-4 rounded-[2rem] bg-milk p-6 shadow-soft sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:p-8 ${
                i % 2 === 1 ? "lg:ml-16" : "lg:mr-16"
              }`}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream text-coral transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-coral group-hover:text-milk">
                <f.icon className="size-5.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-extrabold text-charcoal">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-charcoal/70">{f.text}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
