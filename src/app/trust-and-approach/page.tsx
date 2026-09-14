import type { Metadata } from "next";

import { Start } from "@/components/sections/Start";
import { Trust } from "@/components/sections/Trust";

/** Standalone route for the nav's `Trust & Approach` — deck page 6. */
export const metadata: Metadata = {
  title: "Trust & approach",
  description:
    "Recharge is built around care, clarity and clear boundaries. Support, not diagnosis.",
};

export default function TrustAndApproachPage() {
  return (
    <main>
      <Trust />
      <Start />
    </main>
  );
}
