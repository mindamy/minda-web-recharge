import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { locale as rootLocale } from "next/root-params";

import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary, selectClientMessages } from "@/lib/i18n/dictionaries";
import { MessagesProvider } from "@/lib/i18n/MessagesProvider";
import { localisedMetadata } from "@/lib/i18n/metadata";

import "../globals.css";

/**
 * Playfair Display carries the headlines. The design's display type is a
 * high-contrast Didone serif — thick/thin stroke modulation, tight optical
 * sizing — which low-contrast book serifs such as Lora do not reproduce.
 * Italic is loaded because the Trust section sets its second line in italic.
 *
 * Neither face covers Han characters; the CJK stacks are a globals.css
 * concern, not a font-loader one.
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

/**
 * An unlisted locale 404s at the router instead of being rendered on demand.
 * Left at its permissive default, `/fr/plans` would quietly add a
 * request-time render path to a site that is otherwise entirely prerendered.
 */
export const dynamicParams = false;

/**
 * One declaration here covers all six pages in all seven locales — 42
 * prerendered routes — because `generateStaticParams` is valid on a layout,
 * not only on a page.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * The static `metadata` object this file used to export is gone: a segment
 * may export `metadata` **or** `generateMetadata`, never both, and the titles
 * now come from the catalogue. Reading the locale from root params is not
 * dynamic behaviour, so the result still lands in the prerendered HTML.
 */
export async function generateMetadata(): Promise<Metadata> {
  const messages = await getDictionary();
  const base = await localisedMetadata({ path: "/" });

  return {
    ...base,
    title: {
      default: messages.meta.default.title,
      template: messages.meta.default.titleTemplate,
    },
    description: messages.meta.default.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const lang = await rootLocale();
  const messages = await getDictionary();

  return (
    <html lang={lang} className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        {/* Only the nav/CTA/brand slice crosses into the client graph — one
            locale, never three. Everything else stays server-side. */}
        <MessagesProvider messages={selectClientMessages(messages)}>
          <MotionProvider>
            <ScrollProgress />
            <Header />
            {children}
            <Footer />
          </MotionProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
