import clsx, { type ClassValue } from "clsx";

/**
 * Conditional className joiner.
 *
 * Deliberately *not* wrapped in tailwind-merge: this project has no runtime
 * class conflicts to resolve because component variants are declared with cva,
 * which already collapses each variant axis to a single class.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
