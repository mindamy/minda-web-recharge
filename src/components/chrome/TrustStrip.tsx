import { Heart, Padlock, ShieldCheck } from "@/components/icons";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/types";

/**
 * The three-column reassurance strip beneath the hero.
 *
 * The translucency is load-bearing, not styling: the aurora waves are meant
 * to be faintly visible through the card. The alpha was solved from the
 * render rather than guessed — a backdrop measuring #E0ECFC reads #F6F9FE
 * through the card, giving roughly 0.70.
 *
 * Copy is taken from the supplied hero JPEG, not deck page 1: the deck
 * renders column one's body with a stray trailing period.
 *
 * Column three reads "personalisation" where the deck has "personalization" —
 * the build standardises on the deck's own British body voice, and the
 * catalogue preserves that spelling byte-exact.
 *
 * ---------------------------------------------------------------------------
 * The `ITEMS` array that used to live here carried the copy inline. What is
 * left is the part that is genuinely local and not translatable: which icon
 * and which measured hue belongs to each column. The strings now come from
 * `chrome.trustStrip`, and the columns are assembled at render time so the
 * catalogue is read once, in a Server Component, and never reaches the
 * browser.
 *
 * Column one's body is the exception: it reads `common.disclaimer.medical`,
 * the *same key* the footer reads. It is the product's medical disclaimer —
 * legal copy that must be identical everywhere it appears — so it is stored
 * once and never reworded at a call site. Copying it into
 * `chrome.trustStrip.support.body` would let the two drift in translation,
 * which is why that key deliberately does not exist.
 *
 * Bodies are stored flat, not as the hard-wrapped pairs they used to be. The
 * old `body.join(" ")` proved the line breaks were never honoured anyway, and
 * a Chinese translation wraps at entirely different points.
 * ---------------------------------------------------------------------------
 */

/** Everything about a column that is not copy: its icon and its measured hue. */
const COLUMNS = [
  { key: "support", Icon: ShieldCheck, tint: "text-[#1F58D8]" },
  { key: "privacy", Icon: Padlock, tint: "text-[#5EAC8E]" },
  { key: "care", Icon: Heart, tint: "text-[#E66A96]" },
] as const;

function bodyFor(key: (typeof COLUMNS)[number]["key"], m: Messages): string {
  // Not a lookup with a fallback — an explicit branch, so that the shared
  // disclaimer is visible in the source rather than hidden behind a `??`.
  return key === "support" ? m.common.disclaimer.medical : m.chrome.trustStrip[key].body;
}

export async function TrustStrip({ className }: { className?: string }) {
  const m = await getDictionary();

  return (
    <div
      className={cn(
        "surface-translucent rounded-card grid grid-cols-1 gap-y-7 px-7 py-7 md:grid-cols-[433fr_361fr_368fr] md:gap-y-0 md:px-8 md:divide-x md:divide-hairline-faint",
        className,
      )}
    >
      {COLUMNS.map(({ key, Icon, tint }) => (
        <div key={key} className="flex items-start gap-7 md:px-4 md:first:pl-0 md:last:pr-4">
          <Icon className={cn("mt-0.5 size-11 shrink-0 md:size-10", tint)} strokeWidth={1.4} />
          <div>
            <p className="text-card-title text-ink-800">{m.chrome.trustStrip[key].title}</p>
            <p className="text-body-sm mt-2 text-ink-500">{bodyFor(key, m)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
