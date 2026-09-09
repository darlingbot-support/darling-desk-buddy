import { Heart, ArrowDown } from "lucide-react";

import { DarlingFace } from "./DarlingFace";
import { scrollToId } from "./scroll";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-blush/35 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-milk px-3.5 py-1.5 text-xs font-semibold tracking-wide text-mauve uppercase shadow-soft">
            <span className="size-1.5 rounded-full bg-coral" aria-hidden />
            In development
          </span>

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            A little companion for your everyday space.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal/70">
            Darling is a small expressive desk companion with a big heart—designed to make ordinary
            moments feel a little more alive.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => scrollToId("early-access")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 text-base font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]"
            >
              <Heart className="size-4.5 fill-current" aria-hidden />
              Join early access
            </button>
            <button
              onClick={() => scrollToId("moods")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/12 bg-milk px-7 py-4 text-base font-semibold text-charcoal transition-colors hover:border-coral/40 hover:text-coral"
            >
              Meet its moods
              <ArrowDown className="size-4" aria-hidden />
            </button>
          </div>

          <p className="mt-6 text-sm text-mauve">
            No app. No account. No internet needed. Launching soon.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--milk-white)_0%,var(--blush)_58%,transparent_72%)] opacity-80"
            />
            <div
              aria-hidden
              className="absolute inset-6 animate-halo rounded-full border border-milk/70 shadow-[0_0_80px_-10px_var(--blush)]"
            />
            <DarlingFace
              className="absolute inset-x-[12%] top-[20%] w-[76%] drop-shadow-[0_24px_40px_rgba(33,28,34,0.18)]"
              title="Darling, a small rounded desk companion with a glossy screen face"
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-medium text-milk">
              Concept visual · prototype in progress
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
