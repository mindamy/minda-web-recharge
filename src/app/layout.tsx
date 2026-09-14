import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
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

/**
 * Outfit carries body and UI text. The deck's sans was identified from its
 * letterforms rather than guessed: double-storey `a` with no tail, single-
 * storey `g` with an open hook descender, flat angle-cut `t`, measured
 * x-height 0.51em. Outfit is the closest widely available match; Questrial
 * and Hanken Grotesk are the runners-up and sit in the fallback stack.
 */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
