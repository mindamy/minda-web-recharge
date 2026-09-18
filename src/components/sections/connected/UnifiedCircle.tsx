import { Logo } from "@/components/chrome/Logo";
import { HardLines, RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Zone D — the unified circle: the right-hand term of the section's argument.
 *
 * A 400px circle ringed in a soft blue -> green -> rose gradient, holding the
 * Recharge lockup and headline 4c. The interior is deliberately *not* filled:
 * the page ground shows straight through, so the ring reads as an embrace
 * rather than as a badge.
 *
 * The ring is one element, not a blurred overlay. A conic gradient supplies
 * the hue rotation and a radial-gradient mask carves the band out of it with
 * gradual alpha stops, which feathers both of its edges. Doing it with
 * `filter: blur()` instead would not work: per the CSS rendering model filter
 * is applied *before* mask, so the mask would re-crisp the edge it was meant
 * to soften.
 *
 * Hue positions are measured clockwise from 12 o'clock on the render: pale
 * rose at the top, rose down the right and across the bottom, green on the
 * left where the curve fan arrives, blue at the top-left.
 */

const RING = [
  "conic-gradient(from 0deg,",
  "#e7c6d4 0deg,",
  "#f3b2c4 100deg,",
  "#f3b2c4 196deg,",
  "#c6d7c5 248deg,",
  "#9ed3b6 276deg,",
  "#8fb4e8 318deg,",
  "#e7c6d4 360deg)",
].join(" ");

/**
 * Carves the band. The two intermediate stops on each side are what give the
 * ~16px core its soft falloff into the ground.
 */
const RING_MASK = [
  "radial-gradient(closest-side,",
  "transparent 86%,",
  "rgb(0 0 0 / 0.5) 90%,",
  "#000 94%,",
  "#000 98%,",
  "transparent 100%)",
].join(" ");

export async function UnifiedCircle({ className }: { className?: string }) {
  const m = await getDictionary();
  const copy = m.sections.connected.unifiedCircle;

  return (
    <div className={cn("relative mx-auto aspect-square w-[300px] lg:w-[400px]", className)}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: RING,
          maskImage: RING_MASK,
          WebkitMaskImage: RING_MASK,
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center lg:px-14">
        {/*
          The deck stacks the lockup — mark over wordmark, at a 78px mark and a
          30px wordmark — where `Logo` is a horizontal row by default, so the
          axis, the mark size and the gap are all retuned here rather than
          duplicating the lockup.
        */}
        <Logo
          className="flex-col"
          markClassName="size-[62px] lg:size-[78px]"
          wordmarkClassName="text-h3 -mt-2"
        />

        {/* Headline 4c — same single-word `connected` run as 4b, broken
            across the catalogue's two lines. */}
        <h3 className="mt-6 text-h3 lg:mt-7">
          <RichText value={copy.headline} where="sections.connected.unifiedCircle.headline" />
        </h3>

        <div className="grad-rule mt-4 h-0.5 w-12 rounded-full" aria-hidden />

        <HardLines value={[copy.caption]} paragraphClassName="mt-4 text-body-sm text-ink-500" />
      </div>
    </div>
  );
}
