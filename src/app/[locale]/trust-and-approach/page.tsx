import type { Metadata } from "next";

import { Start } from "@/components/sections/Start";
import { Trust } from "@/components/sections/Trust";
import { routeMetadata } from "@/lib/i18n/metadata";

/** Standalone route for the nav's `Trust & Approach` — deck page 6. */
export function generateMetadata(): Promise<Metadata> {
  return routeMetadata("trustAndApproach", "/trust-and-approach");
}

export default function TrustAndApproachPage() {
  return (
    <main>
      <Trust />
      <Start />
    </main>
  );
}
