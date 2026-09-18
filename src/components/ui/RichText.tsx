import { Fragment, type ReactNode } from "react";

import { GradText, RCubed } from "@/components/ui/GradText";
import type { RichSegment, RichText as RichTextValue } from "@/lib/i18n/types";

/**
 * Renders catalogue rich text.
 *
 * The catalogue stores a value as lines of segments (see `RichText` in
 * `@/lib/i18n/types`) and carries **no colours and no class names** — only a
 * `mark` naming a treatment. The treatment itself is supplied here by the
 * consuming component, which is what keeps the Hero's three hand-tuned
 * gradient stop sets in `Hero.tsx` where they were measured, while the
 * translator only ever sees text.
 *
 * A segment may carry a `mark` with no `text` — that is the `R³` case, where
 * the glyph is drawn rather than spelled.
 */

/** Maps a `mark` name to the treatment that wraps that segment's text. */
export type MarkRenderers = Readonly<Record<string, (text: string | undefined) => ReactNode>>;

/**
 * The marks every section can rely on. Spread and extend rather than replace:
 *
 * ```tsx
 * <RichText value={m.sections.hero.headline} marks={{ ...defaultMarks, "grad-1": …}} />
 * ```
 */
export const defaultMarks: MarkRenderers = {
  /** The shared deck ramp — teal -> mauve -> rose, terminating on rose. */
  grad: (text) => <GradText>{text}</GradText>,
  /** The warmer, more violet ramp measured from the hero JPEG. */
  "grad-hero": (text) => <GradText ramp="hero">{text}</GradText>,
  strong: (text) => <strong className="font-medium">{text}</strong>,
  /** Textless by design: the superscript is drawn, not spelled. */
  rcubed: () => <RCubed />,
};

function renderSegment(segment: RichSegment, marks: MarkRenderers, where: string): ReactNode {
  if (segment.mark === undefined) return segment.text;

  const render = marks[segment.mark];
  if (render === undefined) {
    // Loud on purpose. Every route is prerendered, so an unregistered mark
    // fails the build rather than quietly dropping a headline's emphasis —
    // or, for a textless segment such as `rcubed`, dropping the glyph
    // altogether. This codebase has shipped invisible content twice before
    // from exactly this class of silent fallback.
    throw new Error(
      `RichText: no renderer for mark "${segment.mark}" at ${where}. ` +
        `Registered marks: ${Object.keys(marks).join(", ") || "(none)"}.`,
    );
  }

  return render(segment.text);
}

export function RichText({
  value,
  marks = defaultMarks,
  separator,
  where = "unknown",
}: {
  value: RichTextValue;
  /** Defaults to {@link defaultMarks}. */
  marks?: MarkRenderers;
  /**
   * Placed between lines. Lines in the catalogue are the deck's
   * *unconditional* breaks; responsive breaks are layout, live in the
   * component, and are deliberately not represented in the catalogue.
   */
  separator?: ReactNode;
  /** Catalogue path, used only to make a mark error locatable. */
  where?: string;
}) {
  const gap = separator ?? <br />;

  return (
    <>
      {value.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 ? gap : null}
          {line.map((segment, segmentIndex) => (
            <Fragment key={segmentIndex}>
              {renderSegment(segment, marks, `${where}[${lineIndex}][${segmentIndex}]`)}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Renders a hard-wrapped block: an array of paragraphs, each an array of
 * lines broken exactly where the deck breaks them.
 *
 * Distinct from {@link RichText} because these carry no emphasis at all —
 * the Trust cards' bodies are the main consumers.
 */
export function HardLines({
  value,
  paragraphClassName,
}: {
  value: readonly (readonly string[])[];
  paragraphClassName?: string;
}) {
  return (
    <>
      {value.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex} className={paragraphClassName}>
          {paragraph.map((line, lineIndex) => (
            <Fragment key={lineIndex}>
              {lineIndex > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
