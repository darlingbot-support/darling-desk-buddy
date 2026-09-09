import { useState } from "react";
import { Heart, Menu, Volume2, VolumeX, X } from "lucide-react";

import { DarlingFace } from "./DarlingFace";
import { scrollToId } from "./scroll";
import { useDarlingAudio } from "./audio";

const links = [
  { id: "why", label: "Why Darling" },
  { id: "moods", label: "Moods" },
  { id: "playground", label: "Try it" },
  { id: "features", label: "What it does" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { soundOn, toggleSound } = useDarlingAudio();


  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-8">
        <button
          onClick={() => scrollToId("top")}
          className="flex min-w-0 items-center gap-2 text-left"
          aria-label="Back to top"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-milk shadow-soft">
            <DarlingFace still className="size-7" title="Darling mark" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none font-extrabold tracking-tight text-charcoal">
              Darling
            </span>
            <span className="hidden text-[11px] text-mauve sm:block">Small in Size. Big in Heart.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            className="grid size-9 place-items-center rounded-full bg-milk text-charcoal shadow-soft transition-transform hover:-translate-y-0.5"
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
          {links.map((l) => (

            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-sm font-semibold text-charcoal/70 transition-colors hover:text-coral"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("early-access")}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]"
          >
            <Heart className="size-4 fill-current" aria-hidden />
            Join early access
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            className="grid size-10 place-items-center rounded-full bg-milk text-charcoal shadow-soft"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          >
            {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <button
            className="grid size-10 place-items-center rounded-full bg-milk text-charcoal shadow-soft"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {open ? (
        <div className="border-t border-charcoal/5 bg-cream px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-2xl px-3 py-3 text-left font-semibold text-charcoal/80 hover:bg-milk"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go("early-access")}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-coral px-5 py-3.5 font-bold text-milk shadow-glow"
            >
              <Heart className="size-4 fill-current" aria-hidden />
              Join early access
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
