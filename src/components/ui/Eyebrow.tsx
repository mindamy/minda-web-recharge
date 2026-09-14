import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The uppercase kicker above every section headline.
 *
 * 14px / 600 / +0.16em tracking, measured from the deck. Most eyebrows are
 * solid `blue-ink`; two are gradient instead — `MORE CONNECTED` runs the
 * aurora ramp forwards, and `TRUST & APPROACH` runs it backwards then wraps,
 * which is what `gradient="reverse"` renders.
 */
export function Eyebrow({
  children,
  gradient,
  className,
  style,
  as: Tag = "p",
}: {
  children: ReactNode;
  gradient?: "forward" | "reverse";
  className?: string;
  style?: CSSProperties;
  as?: "p" | "span" | "h2";
}) {
  return (
    <Tag
      style={style}
      className={cn(
        "text-eyebrow uppercase",
        gradient === "forward" && "grad-text",
        gradient === "reverse" && "grad-text-reverse",
        !gradient && "text-blue-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The smaller in-card eyebrow — 12px / 600 / +0.14em. Used by `RECHARGE`,
 * `WHY CONNECTION MATTERS` and `7-DAY FREE TRIAL`.
 */
export function MicroEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("text-micro uppercase", className)}>{children}</p>;
}
