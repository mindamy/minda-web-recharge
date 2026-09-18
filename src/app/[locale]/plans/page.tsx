import type { Metadata } from "next";

import { Plans } from "@/components/sections/Plans";
import { Start } from "@/components/sections/Start";
import { routeMetadata } from "@/lib/i18n/metadata";

/** Standalone route for the nav's `Plans` — deck page 7, `FREE TRIAL & PLANS`. */
export function generateMetadata(): Promise<Metadata> {
  return routeMetadata("plans", "/plans");
}

export default function PlansPage() {
  return (
    <main>
      <Plans />
      <Start />
    </main>
  );
}
