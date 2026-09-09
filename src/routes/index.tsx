import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/darling/Header";
import { Hero } from "@/components/darling/Hero";
import { WhyDarling } from "@/components/darling/WhyDarling";
import { MoodDemo } from "@/components/darling/MoodDemo";
import { Features } from "@/components/darling/Features";
import { EarlyAccess } from "@/components/darling/EarlyAccess";
import { Footer } from "@/components/darling/Footer";

const title = "Darling — A little companion for your everyday space";
const description =
  "Darling is a small expressive desk companion with a big heart. Offline, app-free, and full of personality. Join the early-access list.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Header />
      <main>
        <Hero />
        <WhyDarling />
        <MoodDemo />
        <Features />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
