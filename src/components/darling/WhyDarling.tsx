import { WifiOff, Smartphone, UserRoundX } from "lucide-react";

const promises = [
  { icon: Smartphone, label: "No app to install", text: "Plug it in and it's already itself." },
  { icon: UserRoundX, label: "No account, no subscription", text: "Nothing to sign up for, ever." },
  { icon: WifiOff, label: "No internet required", text: "Everything happens on the device." },
];

export function WhyDarling() {
  return (
    <section id="why" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-mauve uppercase">Why Darling</p>
        <h2 className="mt-4 font-display text-3xl leading-tight font-extrabold text-charcoal sm:text-4xl">
          A desk can be useful and still feel empty.
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-charcoal/70">
          <p>
            A laptop, a charger, maybe a plant. Everything on the desk has a job, and none of it ever
            looks back. For people who spend long hours at one — students far from home, remote
            workers, anyone in a quiet stretch — the room can go very still.
          </p>
          <p>
            Darling is a small answer to that. It blinks, it notices when you touch it, it reacts when
            you pick it up. Not a pet, not a friend, not a fix for anything — just a bit of gentle
            presence in the corner of your desk, with nothing to feed, charge daily, or worry about.
          </p>
          <p className="font-semibold text-charcoal">
            And it asks nothing of you. No app to open, no account to make, no connection to keep.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {promises.map((p) => (
            <TiltCard as="li" key={p.label} tone="pat" className="group cursor-pointer rounded-3xl bg-milk p-5 shadow-soft">
              <p.icon className="size-5 text-coral transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden />
              <p className="mt-3 font-display font-bold text-charcoal">{p.label}</p>
              <p className="mt-1 text-sm text-mauve">{p.text}</p>
            </TiltCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
