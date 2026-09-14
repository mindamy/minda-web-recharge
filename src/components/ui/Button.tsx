import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Buttons and pills.
 *
 * Every button in the deck is fully rounded. Measured geometry: the hero
 * primary is 225x52, the nav pills are 45px tall, and the larger outlined
 * pills (Ask Recharge, plan CTAs) are 62px.
 *
 * The press state is deliberate, not decoration. A button that does not
 * visibly respond to being pressed reads as unresponsive, so every variant
 * scales to 0.97 on `:active`. Transitions name their properties — never
 * `all`, which would animate colour and layout alongside the transform.
 */
const button = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full",
    "font-sans whitespace-nowrap select-none",
    "transition-[transform,background-color,border-color,color,box-shadow]",
    "duration-150 ease-soft",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Filled primary. The only solid-fill button in the design. */
        primary: [
          "bg-blue-fill text-white shadow-pill",
          "hover:bg-blue-ink hover:shadow-[0_2px_6px_rgb(43_95_217/0.22),0_10px_22px_rgb(43_95_217/0.18)]",
        ],
        /** Neutral outline — the `Sign In` pill. */
        outline: [
          "border border-border-neutral bg-transparent text-ink-800",
          "hover:border-ink-400 hover:bg-white/60",
        ],
        /** Blue outline — `See How It Works`, `Ask Recharge`. */
        outlineBlue: [
          "border border-border-blue bg-transparent text-blue-ink",
          "hover:border-border-blue-cta hover:bg-blue-tint-50",
        ],
        /** Higher-contrast blue outline — the `Choose Rhythm` plan CTA. */
        outlineBlueCta: [
          "border border-border-blue-cta bg-transparent text-blue-ink",
          "hover:bg-blue-tint-50",
        ],
        /**
         * Rose outline — `Choose Essential` / `Choose Plus`.
         * The label uses rose-ink rather than the deck's rose-500: at this
         * size rose-500 on white measures 3.6:1 and fails AA, while rose-ink
         * reaches 4.6:1 and is visually indistinguishable.
         */
        outlineRose: [
          "border border-border-rose bg-transparent text-rose-ink",
          "hover:bg-rose-tint-50",
        ],
        /** Text-only link with an arrow. */
        ghost: ["text-blue-ink hover:text-blue-fill", "active:scale-100"],
      },
      size: {
        /** Nav pills — 45px. */
        sm: "h-[45px] px-5 text-btn-sm",
        /** Hero and section CTAs — 52px. */
        md: "h-[52px] px-7 text-btn",
        /** Ask Recharge and plan CTAs — 62px. */
        lg: "h-[62px] px-8 text-btn",
        /** Link-style: no box. */
        none: "h-auto p-0 text-btn-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof button>;

type CommonProps = ButtonVariants & {
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: never };

/**
 * Renders a `next/link` when given an `href`, otherwise a `<button>`.
 * Most "buttons" in this design are navigation, so the link case is the
 * common one and needs to stay a real anchor for middle-click and
 * open-in-new-tab to work.
 */
export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  const classes = cn(button({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
