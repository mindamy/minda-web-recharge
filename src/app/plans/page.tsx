import type { Metadata } from "next";

import { Plans } from "@/components/sections/Plans";
import { Start } from "@/components/sections/Start";

/** Standalone route for the nav's `Plans` — deck page 7, `FREE TRIAL & PLANS`. */
export const metadata: Metadata = {
  title: "Plans",
  description:
    "Try Recharge free for 7 days, then choose the level of support that feels right for you.",
};

export default function PlansPage() {
  return (
    <main>
      <Plans />
      <Start />
    </main>
  );
}
