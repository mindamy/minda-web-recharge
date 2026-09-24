import { RCubed } from "@/components/ui/GradText";

/** The brand token the catalogue spells with a real superscript character. */
const R_CUBED = "R³";

/**
 * Renders a nav label, drawing the `R³` of "The R³ Experience".
 *
 * ---------------------------------------------------------------------------
 * R³ — ONE RENDERING, NOT THREE.
 *
 * There were three representations of the same mark before this: the `RCubed`
 * component in `@/components/ui/GradText` (used by `R3Loop`'s eyebrow and
 * exposed to the catalogue as `defaultMarks.rcubed`), a second, separately
 * hand-tuned `<sup>` that lived right here, and the ASCII `r3` route slug.
 *
 * The slug stays ASCII — it is a URL, not copy. The two *copy* cases are now
 * the same component, so they cannot drift again: this file no longer owns a
 * superscript implementation, it delegates to `RCubed`.
 *
 * The literal `³` stays in the catalogue string rather than being modelled as
 * a rich-text segment array. Three reasons:
 *
 *   1. `chrome.nav.items` is a flat `sectionId -> string` map and is the one
 *      thing a translator reads. `³` is a real character there, so the
 *      catalogue stays legible prose; a `{ mark: "rcubed" }` segment would
 *      make it carry presentation for no gain.
 *   2. The map crosses into the client graph through `ClientMessages`, where
 *      a flat string costs a fraction of a segment array's flight payload.
 *   3. `R³` is a brand token and stays Latin in every locale, so splitting on
 *      it is locale-proof — checked against all seven catalogues, not
 *      assumed. Japanese is the one that would have caught a lazier
 *      implementation: `R³体験` has no prefix at all, so `markIndex` is 0 and
 *      the leading slice is the empty string. That renders correctly here,
 *      and would not have under an `indexOf(...) > 0` guard.
 *
 * Be aware of what the split costs, because the comment this replaced claimed
 * the opposite: once `RCubed` has run, the rendered subtree is `R` plus a
 * `<sup>3</sup>`, so the document text and the accessible name are "The R3
 * Experience" — the `³` does **not** survive into the DOM. That was already
 * true of the `<sup>` this file used to hand-roll, and it is equally true of
 * `RCubed` in `R3Loop`'s eyebrow, so it is a property of the mark rather than
 * a regression. Verified in a browser, not inferred: both `<sup>`s resolve to
 * the same computed geometry, because Tailwind's preflight gives `sup`
 * `position: relative` and `vertical-align: baseline`, which is what makes
 * `top-[-0.42em]` the single applied offset rather than a second one stacked
 * on the browser's default `vertical-align: super`.
 *
 * If a future catalogue entry does drop the token, the label renders verbatim
 * with its literal `³` intact. That degrades to correct-but-unstyled text
 * rather than to a blank, which is the only acceptable failure here.
 * ---------------------------------------------------------------------------
 */
export function NavLabel({ label }: { label: string }) {
  const markIndex = label.indexOf(R_CUBED);
  if (markIndex === -1) return <>{label}</>;

  return (
    <>
      {label.slice(0, markIndex)}
      <RCubed />
      {label.slice(markIndex + R_CUBED.length)}
    </>
  );
}
