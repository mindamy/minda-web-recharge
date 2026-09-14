import type { NavItem } from "@/lib/nav";

/**
 * Renders a nav label, lifting the `3` of "R³" into a superscript.
 *
 * The literal superscript character stays in the label string so the
 * accessible name and the document text remain correct; only the rendering is
 * special-cased. `align-baseline` resets the browser's own `vertical-align:
 * super` so the measured offset (0.62em size, raised 0.42em) is applied once
 * rather than twice.
 */
export function NavLabel({ item }: { item: NavItem }) {
  if (!item.superscript) return <>{item.label}</>;

  const [before, after] = item.label.split("R³");
  return (
    <>
      {before}R
      <sup className="relative -top-[0.42em] align-baseline text-[0.62em] leading-none">3</sup>
      {after}
    </>
  );
}
