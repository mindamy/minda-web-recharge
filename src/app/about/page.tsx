import type { Metadata } from "next";

import { Connected } from "@/components/sections/Connected";
import { Rhythm } from "@/components/sections/Rhythm";
import { Start } from "@/components/sections/Start";

/**
 * Standalone route for the nav's `About`.
 *
 * The deck has no About page. The two sections that actually describe what
 * Recharge *is* are Connected (`MORE CONNECTED`) and Rhythm (`PERSONAL TO
 * YOUR RHYTHM`), so this route composes those rather than inventing copy.
 * Connected is the section the nav highlights while scrolling the home page.
 */
export const metadata: Metadata = {
  title: "About",
  description:
    "Recharge brings personal insights, AI-guided coaching and Recharge Experiences together around you.",
};

export default function AboutPage() {
  return (
    <main>
      <Connected />
      <Rhythm />
      <Start />
    </main>
  );
}
