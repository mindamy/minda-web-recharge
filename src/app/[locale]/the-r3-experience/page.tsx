import type { Metadata } from "next";

import { R3Loop } from "@/components/sections/R3Loop";
import { Start } from "@/components/sections/Start";
import { routeMetadata } from "@/lib/i18n/metadata";

/**
 * Standalone route for the nav's `The R³ Experience`.
 *
 * Mapped to the R³ Loop section, whose eyebrow reads `THE R³ RECHARGE LOOP` —
 * an exact match rather than an inference.
 */
export function generateMetadata(): Promise<Metadata> {
  return routeMetadata("theR3Experience", "/the-r3-experience");
}

export default function R3ExperiencePage() {
  return (
    <main>
      <R3Loop />
      <Start />
    </main>
  );
}
