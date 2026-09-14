import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { CTA } from "@/lib/nav";

/**
 * Branded 404.
 *
 * NOT IN THE DESIGN DECK. It exists because several affordances the deck
 * draws point at screens the deck never designs — `Sign In`, and the
 * `Ask Recharge` link that recurs seven times. Those links are left pointing
 * at their eventual destinations rather than being stripped out or pointed
 * somewhere misleading, so this is what a visitor meets in the meantime. It
 * reuses the deck's own type, palette and CTA rather than inventing a voice.
 */
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70svh] items-center py-24">
      <Container width="narrow">
        <div className="max-w-xl">
          <Eyebrow>Not quite here</Eyebrow>
          <h1 className="text-h2 mt-5 text-ink-900">
            This page is <GradText>still on its way.</GradText>
          </h1>
          <p className="text-lead mt-6 text-ink-600">
            The link you followed points somewhere we have not built yet. Start where you are
            &mdash; everything else is a scroll away.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button href="/" variant="primary" size="md">
              Back to Recharge
            </Button>
            <Button href="/plans" variant="outlineBlue" size="md">
              {CTA.tryFree}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
