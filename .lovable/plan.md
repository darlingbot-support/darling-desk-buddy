# Project Darling — Early Access Landing Page

A warm, mobile-first single page introducing Darling, the small screen-faced desk companion. Tone: gentle, personal, honest about being in development. "Small in Size. Big in Heart."

## Brand foundation

Palette applied as the page's design tokens:

| Colour | Use |
| --- | --- |
| Warm Cream `#F5E8E0` | Page canvas, calm sections |
| Darling Blush `#F5A5B8` | Hearts, selected states, soft accents |
| Coral Glow `#FF758F` | Primary buttons, active focus |
| Glossy Charcoal `#211C22` | Robot face, headings, body text |
| Milk White `#FFFDFC` | Cards, eye highlights |
| Soft Mauve `#B88391` | Secondary text, quiet labels |

Typography: a rounded, soft display face for headlines paired with a clear humanist sans for body copy. Motifs used sparingly — heart marks, a luminous circular halo behind the robot, and glossy-black face surfaces as the language for interactive states.

Darling is always drawn as a rounded body with a front screen face. No hands, no legs, no antenna, anywhere on the page.

## Sections

**1. Header** — Darling mark, links to Why Darling, Moods, Features, Early Access, plus a persistent "Join early access" button. Collapses to a simple menu on phones.

**2. Hero** — Headline "A little companion for your everyday space." with the supporting line about a small expressive desk companion with a big heart. Primary "Join early access" button that scrolls gently to the form, plus a quieter "See how it feels" link. A small "in development" label. The robot sits inside a soft glowing halo, blinking and glancing on its own. No price or date here.

**3. Why Darling** — Short narrative, not a grid: the desk that is purely functional versus the desk with a small presence on it. States plainly that Darling needs no app, no account, and no internet.

**4. Interactive mood demo** — The centrepiece. Five mood buttons: Curious, Focus, Sleepy, Surprised, Happy. Picking one changes the eyes (shape, position, blink rhythm), the halo colour, the caption, and a short description of what Darling is doing. Works by tap, click, and keyboard, with the selected mood named in text so colour is never the only signal.

**5. Feature story** — Offset editorial cards, each with a small face cue and one plain explanation: Expressive Face, Mood System, Touch Reaction, Motion Reaction, Clock Mode, Focus Mode, Mini-Games, Local Wake Word, 100% Offline.

**6. Early access** — The strongest moment on the page. Email field only, gentle validation, then the form is replaced with "You're on Darling's early list. We'll keep you close to the first drop." Shows the ₹3,999 target offer and the 23 October 2026 planned first drop, worded so nothing implies a purchase or guaranteed stock.

**7. Footer** — Instagram, YouTube, Facebook, X, and darlingbot.support@gmail.com as a clickable mail link, plus a short project-status note.

## Behaviour notes

- Motion stays calm: short upward fades on scroll, small press states, occasional blinks. Everything respects a reduced-motion preference.
- No sound anywhere.
- Single column on phones with thumb-sized buttons and no sideways scrolling; asymmetric two-column composition on larger screens.
- The robot visual is drawn in code (rounded shapes and animated eyes), so it stays crisp, reacts live, and can be swapped for real prototype photos later.

## Technical details

- One page at `/`, built as sections in `src/components/darling/`, with brand colours added as semantic tokens in `src/styles.css`.
- Darling's face is an inline SVG component driven by a mood prop; eye geometry, blink timing, and halo intensity animate via CSS transitions.
- The early-access form is client-side only for now and shows the confirmation state locally. Emails are not yet delivered anywhere.
- Page metadata (title, description, social preview text) set on the route.

## Open item

Email delivery to darlingbot.support@gmail.com needs a relay. I can wire this up with Lovable Cloud so signups are stored and forwarded — say the word and I'll add it after the page is up.
