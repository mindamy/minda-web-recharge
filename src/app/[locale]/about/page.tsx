import type { Metadata } from "next";

import { Connected } from "@/components/sections/Connected";
import { Rhythm } from "@/components/sections/Rhythm";
import { Start } from "@/components/sections/Start";
import { routeMetadata } from "@/lib/i18n/metadata";

/**
 * Standalone route for the nav's `About`.
 *
 * The deck has no About page. The two sections that actually describe what
 * Recharge *is* are Connected (`MORE CONNECTED`) and Rhythm (`PERSONAL TO
 * YOUR RHYTHM`), so this route composes those rather than inventing copy.
 * Connected is the section the nav highlights while scrolling the home page.
 */
export function generateMetadata(): Promise<Metadata> {
  return routeMetadata("about", "/about");
}

export default function AboutPage() {
  return (
    <main>
      <Connected />
      <Rhythm />
      <Start />
    </main>
  );
}
