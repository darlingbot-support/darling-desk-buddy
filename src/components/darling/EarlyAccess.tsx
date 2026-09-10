import { useState, type FormEvent } from "react";
import { Heart, Check } from "lucide-react";

import { DarlingFace } from "./DarlingFace";

export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("That doesn't look like an email address yet. Try something like you@example.com.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/darlingbot.support@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: value,
          _subject: "New Darling Early Access Signup!",
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error(`FormSubmit returned ${response.status}`);
      }

      setDone(true);
    } catch {
      setError("We couldn't send your signup just then. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="early-access" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-charcoal px-6 py-12 text-milk shadow-soft sm:px-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-blush uppercase">
              Early access
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold sm:text-4xl">
              Be there for the first drop.
            </h2>
            <p className="mt-4 text-lg text-milk/70">
              Leave your email and we'll write when Darling is real enough to meet. No spam, and
              joining doesn't buy anything or hold any stock.
            </p>

            {done ? (
              <div className="mt-8 flex items-start gap-3 rounded-3xl bg-milk/10 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-coral">
                  <Check className="size-5 text-milk" aria-hidden />
                </span>
                <p aria-live="polite" className="font-display text-lg font-bold text-milk">
                  You're on Darling's early list. We'll keep you close to the first drop.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-8">
                <label htmlFor="early-email" className="block text-sm font-semibold text-milk/80">
                  Your email
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="early-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "early-email-error" : undefined}
                    className="min-w-0 flex-1 rounded-full bg-milk px-5 py-4 text-charcoal placeholder:text-mauve focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 font-bold text-milk shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] disabled:opacity-70"
                  >
                    <Heart className="size-4 fill-current" aria-hidden />
                    {submitting ? "Joining…" : "Join early access"}
                  </button>
                </div>
                {error ? (
                  <p id="early-email-error" role="alert" className="mt-3 text-sm text-blush">
                    {error}
                  </p>
                ) : null}
              </form>
            )}

            <p className="mt-6 text-sm text-milk/50">
              Darling is still in development. Launching soon — early-access members hear the date
              first.
            </p>
          </div>

          <div className="mx-auto w-40 sm:w-48">
            <DarlingFace mood={done ? "excited" : "happy"} className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
