import { useState } from "react";

import { DarlingFace, type Mood } from "./DarlingFace";

const moods: { id: Mood; label: string; caption: string; description: string }[] = [
  {
    id: "curious",
    label: "Curious",
    caption: "Something caught its attention",
    description:
      "One eye widens a little more than the other and Darling leans its gaze toward whatever just moved nearby.",
  },
  {
    id: "focus",
    label: "Focus",
    caption: "Settled in with you",
    description:
      "Eyes narrow into calm steady lines. Darling goes quiet while a focus session runs, and brightens again on the break.",
  },
  {
    id: "sleepy",
    label: "Sleepy",
    caption: "Winding down",
    description:
      "Lids drift low and blinks get slower and longer. Left alone for a while, Darling drifts into a soft resting state.",
  },
  {
    id: "surprised",
    label: "Surprised",
    caption: "Whoa — you moved me",
    description:
      "Eyes snap wide open. A sudden lift, tilt, or tap gives Darling a small startle before it settles back down.",
  },
  {
    id: "happy",
    label: "Happy",
    caption: "Glad you're here",
    description:
      "Eyes curve into warm arcs and the cheeks glow. This is what a pat on the head usually looks like.",
  },
  {
    id: "excited",
    label: "Excited",
    caption: "Full of beans",
    description:
      "Tall bright eyes and quick little sparkles. Darling gets like this after a game or a win on the focus timer.",
  },
];

export function MoodDemo() {
  const [active, setActive] = useState<Mood>("curious");
  const current = moods.find((m) => m.id === active)!;

  return (
    <section id="moods" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-mauve uppercase">
            Face and moods
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-charcoal sm:text-4xl">
            Say hello. Pick a mood.
          </h2>
          <p className="mt-4 text-lg text-charcoal/70">
            Darling's whole personality lives in its eyes. Tap a mood to see how the face changes —
            this is the same expression system planned for the physical device.
          </p>
        </div>

        <div className="mt-10 grid gap-6 rounded-[2.5rem] bg-milk p-6 shadow-soft sm:p-8 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-center">
          <div className="relative mx-auto aspect-square w-full max-w-xs">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,var(--blush)_0%,transparent_70%)] transition-opacity duration-500"
              style={{ opacity: active === "sleepy" ? 0.35 : 0.85 }}
            />
            <DarlingFace mood={active} className="absolute inset-x-[8%] top-[12%] w-[84%]" />
          </div>

          <div>
            <div
              role="group"
              aria-label="Choose a mood for Darling"
              className="flex flex-wrap gap-2"
            >
              {moods.map((m) => {
                const selected = m.id === active;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActive(m.id)}
                    aria-pressed={selected}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-milk focus-visible:outline-none ${
                      selected
                        ? "bg-coral text-milk shadow-glow"
                        : "bg-cream text-charcoal/70 hover:text-coral"
                    }`}
                  >
                    {selected ? <span aria-hidden>♥</span> : null}
                    {m.label}
                    {selected ? <span className="sr-only">(selected)</span> : null}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="mt-6 rounded-3xl bg-cream p-5">
              <p className="font-display text-xl font-extrabold text-charcoal">
                {current.label} — {current.caption}
              </p>
              <p className="mt-2 leading-relaxed text-charcoal/70">{current.description}</p>
            </div>

            <p className="mt-4 text-sm text-mauve">
              Works with taps, clicks and the keyboard. Darling has no arms, legs, or antenna — every
              reaction you see is the face itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
