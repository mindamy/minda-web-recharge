import { Connected } from "@/components/sections/Connected";
import { Hero } from "@/components/sections/Hero";
import { Moments } from "@/components/sections/Moments";
import { Plans } from "@/components/sections/Plans";
import { R3Loop } from "@/components/sections/R3Loop";
import { Rhythm } from "@/components/sections/Rhythm";
import { Start } from "@/components/sections/Start";
import { Trust } from "@/components/sections/Trust";

/**
 * The home route renders the full eight-section scrolling narrative, in deck
 * order. Each section is self-contained so the same component can also be
 * mounted on its own standalone route — see src/lib/nav.ts for the mapping.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Moments />
      <R3Loop />
      <Connected />
      <Rhythm />
      <Trust />
      <Plans />
      <Start />
    </main>
  );
}
