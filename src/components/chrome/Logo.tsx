import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * The Recharge brand mark.
 *
 * This is a vector trace of the asset supplied by the design owner
 * (`.docs/logo-mark.webp`) — not a hand reconstruction. The earlier version of
 * this component approximated the mark with uniform-width SVG strokes, which
 * could not reproduce the tapering crescents the real mark is built from.
 *
 * The trace segments the source into its four flat fills, takes the modal
 * colour of each (blue #36A9D8, grey #8E949B, pink #E86E92, green #63B792) and
 * fits smooth cubic Béziers to the region contours. Note those values are more
 * saturated and more cyan than the ones DESIGN-SPEC §2.1 records for the logo —
 * the spec measured them off the soft, low-resolution deck render.
 *
 * Served as one cached file rather than inlined, because the lockup appears in
 * the header, the footer and the Connected section, and inlining ~16 KB of path
 * data three times into the HTML costs more than a single same-origin request.
 * `width`/`height` are set so it reserves its box and cannot shift layout.
 */
function RechargeMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    /* An SVG needs no resizing or format negotiation, so next/image would add
       a wrapper and a build step without changing a single delivered byte. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.svg"
      alt=""
      width={64}
      height={64}
      aria-hidden
      className={cn("shrink-0", className)}
      style={style}
    />
  );
}

/**
 * The full lockup: mark plus the serif wordmark.
 *
 * The wordmark is live text in the display serif rather than part of the image,
 * so it stays selectable, translatable and searchable, and tracks the page's
 * own type scale.
 *
 * `markClassName` and `wordmarkClassName` exist so callers size the parts
 * explicitly. The Connected section previously reached in with
 * `[&>svg]:size-[78px]`, which silently depended on the mark being a direct
 * child `<svg>` — a coupling that broke the moment the mark stopped being
 * inline SVG.
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <RechargeMark className={cn("size-11 lg:size-[54px]", markClassName)} />
      <span className={cn("text-wordmark font-display text-ink-900", wordmarkClassName)}>
        Recharge
      </span>
    </span>
  );
}
