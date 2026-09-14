import type { Metadata } from "next";

import { Moments } from "@/components/sections/Moments";
import { Start } from "@/components/sections/Start";

/**
 * Standalone route for the nav's `How It Works`.
 *
 * Mapped to the Moments section by the deck's own eyebrow — page 2 reads
 * `RECOGNISE YOUR MOMENT`, which is where the product's flow starts. The
 * closing CTA is repeated so a deep-linked visitor still has somewhere to go.
 */
export const metadata: Metadata = {
  title: "How it works",
  description:
    "Recognising how you feel is the first step to finding what can help. See how Recharge meets your moment.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Moments />
      <Start />
    </main>
  );
}
