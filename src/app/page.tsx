import { Header } from "@/components/chrome/Header";
import { Hero } from "@/components/sections/Hero";

/**
 * The home route renders the full eight-section scrolling narrative.
 *
 * Sections are added here as they land. Each is self-contained so it can also
 * be mounted on its own standalone route — see src/lib/nav.ts.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
