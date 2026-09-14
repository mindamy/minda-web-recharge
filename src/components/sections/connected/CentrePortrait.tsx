import Image from "next/image";

import { GradText } from "@/components/ui/GradText";
import { cn } from "@/lib/cn";

/**
 * Zone C — the centre portrait and the `One person.` caption.
 *
 * The asset is a 544x544 square, but only its *inscribed* region is clean
 * photo: the square's corners carry the design's soft white oval edge and a
 * strip of page ground. Rendered unmasked it shows those artefacts, so the
 * mask is not a stylistic choice — it is load-bearing.
 *
 * Masked to an **ellipse**, not a circle. Measured off the render, the deck's
 * shape is ~320 x 276 (aspect 1.16), noticeably wider than tall, and the
 * ellipse is safe here for a geometric reason: `object-cover` on a
 * wider-than-tall box scales the square so its clean inscribed circle spans
 * the box width, and an ellipse whose semi-axes are both no larger than that
 * circle's radius lies entirely inside it. The one place the two curves meet
 * is the horizontal extreme, so the image also carries a 5% scale-up to hold
 * a clear margin there.
 *
 * The mask is a radial gradient rather than a hard clip so the edge feathers
 * over ~10px, matching the deck, where the photo dissolves into the ground
 * with no ring.
 *
 * No `priority`: deprecated in Next 16, and this section sits well below the
 * fold, so the default lazy load is what we want.
 */

const OVAL_MASK = "radial-gradient(closest-side, #000 94%, transparent 100%)";

export function CentrePortrait({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div
        className="relative aspect-[320/276] w-[240px] lg:w-[320px]"
        style={{ maskImage: OVAL_MASK, WebkitMaskImage: OVAL_MASK }}
      >
        <Image
          src="/images/connected-portrait.jpg"
          alt="A woman sitting indoors beside a houseplant, looking up into soft window light."
          fill
          sizes="(min-width: 1024px) 320px, 240px"
          className="scale-105 object-cover"
        />
      </div>

      <h3 className="mt-2 text-h3">
        <span className="block">One person.</span>
        <span className="block">
          One <GradText>connected</GradText> experience.
        </span>
      </h3>

      <div className="grad-rule mt-4 h-0.5 w-12 rounded-full" aria-hidden />

      <p className="mt-4 text-body-sm text-ink-500">Recharge connects the journey.</p>
    </div>
  );
}
