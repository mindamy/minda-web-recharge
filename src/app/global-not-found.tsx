import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Link from "next/link";

import { Logo } from "@/components/chrome/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n/config";
import enGB from "@/messages/en-GB.json";

import "./globals.css";

/**
 * The global 404.
 *
 * Required because the root layout now sits under a top-level dynamic segment
 * (`app/[locale]/layout.tsx`), so there is no single layout left from which to
 * compose a consistent 404. Enabled by `experimental.globalNotFound` in
 * `next.config.ts`.
 *
 * **This file bypasses the app's normal rendering**, which is the trap: it
 * gets no layout, so `globals.css` and *both* typefaces have to be imported
 * again right here. Omit them and the branded 404 ships in Times New Roman
 * with no Tailwind — it compiles, it builds, and it looks broken. Unlike
 * `not-found.js`, it must also return a complete HTML document.
 *
 * The copy is read from the `en-GB` catalogue by a plain static import rather
 * than through `getDictionary()`. That is deliberate: this file sits *outside*
 * `[locale]`, so there is no root parameter to resolve and no locale to
 * resolve it to. It is a Server Component, so the import never reaches the
 * browser bundle, and keeping it synchronous keeps `metadata` a plain object.
 *
 * Next injects `<meta name="robots" content="noindex">` for 404s itself.
 */

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const m = enGB.notFound;

export const metadata: Metadata = {
  title: `${enGB.meta.notFound.title} — ${enGB.common.brand.wordmark}`,
};

/**
 * Every link here lands in the default locale. A request that reached this
 * page matched no locale segment at all, so there is nothing to preserve.
 */
const HOME = localePath(DEFAULT_LOCALE, "/");
const PLANS = localePath(DEFAULT_LOCALE, "/plans");

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        {/* No `Header` here: it is a Client Component wired to the locale
            routing that this page, by definition, has fallen outside of. A
            plain brand lockup keeps the page recognisably Recharge without
            dragging that graph in. */}
        <header className="border-b border-hairline-faint">
          <Container width="wide" className="flex items-center py-6">
            <Link
              href={HOME}
              aria-label={enGB.common.brand.homeLabel}
              className="inline-block rounded-lg"
            >
              <Logo />
            </Link>
          </Container>
        </header>

        <main className="flex min-h-[70svh] items-center py-24">
          <Container width="narrow">
            <div className="max-w-xl">
              <Eyebrow>{m.eyebrow}</Eyebrow>

              {/* The headline is catalogue rich text: an array of lines, each
                  an array of `{ text, mark? }` segments. Resolved inline
                  because this page shares no component graph with the rest of
                  the site. */}
              <h1 className="text-h2 mt-5 text-ink-900">
                {m.headline.map((line, lineIndex) => (
                  <span key={lineIndex} className="block">
                    {line.map((segment, segmentIndex) =>
                      "mark" in segment && segment.mark === "grad" ? (
                        <GradText key={segmentIndex}>{segment.text}</GradText>
                      ) : (
                        <span key={segmentIndex}>{segment.text}</span>
                      ),
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lead mt-6 text-ink-600">{m.body}</p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Button href={HOME} variant="primary" size="md">
                  {m.backHome}
                </Button>
                <Button href={PLANS} variant="outlineBlue" size="md">
                  {enGB.common.cta.tryFree}
                </Button>
              </div>
            </div>
          </Container>
        </main>
      </body>
    </html>
  );
}
