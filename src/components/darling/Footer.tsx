import { Instagram, Youtube, Facebook, Mail } from "lucide-react";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/_darling.bot?stkn=MWNicnUxYnB1dzhnNQ==",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@darlingbot-yt?si=bIp_dsuxgPrIFQg1",
    icon: Youtube,
  },
  { label: "Facebook", href: "https://www.facebook.com/share/1Bwbf9D6d8/", icon: Facebook },
  { label: "X", href: "https://x.com/Darlingbot_", icon: XIcon },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.5l7.6-8.7L1 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-charcoal/8 px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="font-display text-2xl font-extrabold text-charcoal">Darling</p>
          <p className="mt-1 text-mauve">Small in Size. Big in Heart.</p>
          <p className="mt-4 max-w-md text-sm text-charcoal/60">
            Darling is in development. Visuals on this page are concept material and will be replaced
            with real prototype photos once testing is complete.
          </p>
          <a
            href="mailto:darlingbot.support@gmail.com"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-charcoal transition-colors hover:text-coral"
          >
            <Mail className="size-4" aria-hidden />
            darlingbot.support@gmail.com
          </a>
        </div>

        <ul className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Darling on ${s.label} (opens in a new tab)`}
                className="grid size-12 place-items-center rounded-full bg-milk text-charcoal shadow-soft transition-colors hover:bg-coral hover:text-milk"
              >
                <s.icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-mauve">
        © {new Date().getFullYear()} Project Darling. Early access only — no purchase, stock, or
        delivery date is implied.
      </p>
    </footer>
  );
}
