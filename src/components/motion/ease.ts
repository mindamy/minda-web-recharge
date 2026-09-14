/**
 * The single easing curve for this site.
 *
 * An ease-out curve: fast to start, settling at the end. Entrances must never
 * use ease-in — it delays the visible response and reads as sluggish.
 *
 * Kept as a typed tuple so Motion's `Easing` type accepts it without a cast,
 * and mirrored as `--ease-soft` in globals.css for the CSS-driven animations.
 */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/** Durations in seconds, for Motion's `transition.duration`. */
export const DURATION = {
  /** Hover and press feedback — must feel instant. */
  fast: 0.18,
  /** The default for a scroll reveal. */
  reveal: 0.7,
  /** Deliberate, explanatory motion such as the loop diagram drawing itself. */
  draw: 1.2,
} as const;
