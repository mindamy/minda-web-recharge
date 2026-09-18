import type { Metadata } from "next";

import { Moments } from "@/components/sections/Moments";
import { Start } from "@/components/sections/Start";
import { routeMetadata } from "@/lib/i18n/metadata";

/**
 * Standalone route for the nav's `How It Works`.
 *
 * Mapped to the Moments section by the deck's own eyebrow — page 2 reads
 * `RECOGNISE YOUR MOMENT`, which is where the product's flow starts. The
 * closing CTA is repeated so a deep-linked visitor still has somewhere to go.
 */
export function generateMetadata(): Promise<Metadata> {
  return routeMetadata("howItWorks", "/how-it-works");
}

export default function HowItWorksPage() {
  return (
    <main>
      <Moments />
      <Start />
    </main>
  );
}
