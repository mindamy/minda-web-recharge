import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import { MotionProvider } from "@/components/motion/MotionProvider";

import "./globals.css";

/**
 * Playfair Display carries the headlines. The design's display type is a
 * high-contrast Didone serif — thick/thin stroke modulation, tight optical
 * sizing — which low-contrast book serifs such as Lora do not reproduce.
 * Italic is loaded because the Trust section sets its second line in italic.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

/** DM Sans carries body and UI text: geometric, large x-height, legible small. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Recharge — Your personal wellbeing companion",
    template: "%s — Recharge",
  },
  description:
    "Recharge brings personal insights, AI-guided coaching and personalised experiences together in one connected wellbeing experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
