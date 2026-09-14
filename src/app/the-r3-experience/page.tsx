import type { Metadata } from "next";

import { R3Loop } from "@/components/sections/R3Loop";
import { Start } from "@/components/sections/Start";

/**
 * Standalone route for the nav's `The R³ Experience`.
 *
 * Mapped to the R³ Loop section, whose eyebrow reads `THE R³ RECHARGE LOOP` —
 * an exact match rather than an inference.
 */
export const metadata: Metadata = {
  title: "The R³ Experience",
  description:
    "One connected loop to help you understand yourself, find what you need and feel better in the moment.",
};

export default function R3ExperiencePage() {
  return (
    <main>
      <R3Loop />
      <Start />
    </main>
  );
}
