import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * The Recharge brand mark.
 *
 * A vector trace of `.docs/brand/logo-mark.png` from the supplied logo pack.
 * Its fills are the authoritative hexes from that pack's colour sheet —
 * blue #35C1FC, pink #FC7E9E, green #61E1A3, grey #AAABB1 — not values
 * sampled off a render.
 *
 * Worth knowing if you compare against DESIGN-SPEC §2.1: the spec's logo
 * colours are much duller, because it measured them from the soft,
 * low-resolution deck page. The brand blue is also far brighter than the UI
 * blue (`blue-fill` #2B5FD9); the two are not interchangeable.
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
 *
 * ---------------------------------------------------------------------------
 * WHY THE WORDMARK IS A PROP AND NOT A `getDictionary()` CALL.
 *
 * This is the one chrome component rendered from **both** sides of the
 * server/client boundary — `Header` is a Client Component, while `Footer`,
 * `Connected` and `global-not-found` are Server Components. Making it `async`
 * to read the catalogue itself would make it unrenderable from `Header`; and
 * it cannot read `useMessages()` either, because `global-not-found` bypasses
 * the layout and therefore has no `MessagesProvider` above it.
 *
 * So the value is injected: `Header` passes `brand.wordmark` from
 * `useMessages()`, and a Server Component passes `m.common.brand.wordmark`.
 * The default exists for `global-not-found`, which has no catalogue at all,
 * and it is safe to hard-code because `Recharge` is a brand token that stays
 * Latin in every locale — `common.brand.wordmark` is `"Recharge"` in all
 * three catalogues, by the same rule that keeps `R³` and `AI` Latin.
 *
 * The mark's `alt` is deliberately empty and `aria-hidden`, so it needs no
 * catalogue entry: the wordmark beside it already names the brand, and
 * announcing it twice is worse than not announcing the image.
 * ---------------------------------------------------------------------------
 */
export function Logo({
  wordmark = "Recharge",
  className,
  markClassName,
  wordmarkClassName,
}: {
  /** Defaults to the Latin brand token; see the note above. */
  wordmark?: string;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <RechargeMark className={cn("size-11 lg:size-[54px]", markClassName)} />
      <span className={cn("text-wordmark font-display text-brand-ink", wordmarkClassName)}>
        {wordmark}
      </span>
    </span>
  );
}
