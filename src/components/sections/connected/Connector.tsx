/**
 * The vertical connector that stands in for the curve fan below `lg`.
 *
 * DESIGN-SPEC §4.2 calls for a 2px, 56px blue->rose rule between the stacked
 * zones once the diagram collapses. It reuses the `grad-rule` token (the same
 * blue -> teal -> rose ramp as the two dividers inside the diagram) rotated a
 * quarter turn, so there is only ever one definition of that gradient. The
 * rotation happens inside a fixed-height flex box, which keeps the rotated
 * element's layout box from leaking a 56px-wide gap into the column.
 */
export function Connector() {
  return (
    <div className="flex h-14 items-center justify-center lg:hidden" aria-hidden>
      <div className="grad-rule h-0.5 w-14 rotate-90 rounded-full" />
    </div>
  );
}
