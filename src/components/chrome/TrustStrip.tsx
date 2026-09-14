import { Heart, Padlock, ShieldCheck } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The three-column reassurance strip beneath the hero.
 *
 * The translucency is load-bearing, not styling: the aurora waves are meant
 * to be faintly visible through the card. The alpha was solved from the
 * render rather than guessed — a backdrop measuring #E0ECFC reads #F6F9FE
 * through the card, giving roughly 0.70.
 *
 * Copy is taken from the supplied hero JPEG, not deck page 1: the deck
 * renders column one's body with a stray trailing period.
 *
 * Column three reads "personalisation" where the deck has "personalization" —
 * the build standardises on the deck's own British body voice.
 */
const ITEMS = [
  {
    Icon: ShieldCheck,
    tint: "text-[#1F58D8]",
    title: "Support, not diagnose.",
    body: ["Everyday wellbeing support and reflection,", "not diagnosis, treatment or cure."],
  },
  {
    Icon: Padlock,
    tint: "text-[#5EAC8E]",
    title: "Your privacy matters.",
    body: ["We handle your information with care", "and give you control."],
  },
  {
    Icon: Heart,
    tint: "text-[#E66A96]",
    title: "Built with care.",
    body: ["AI, personalisation and human insight", "working together for you."],
  },
] as const;

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "surface-translucent rounded-card grid grid-cols-1 gap-y-8 px-7 py-8 sm:px-10 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-hairline-faint",
        className,
      )}
    >
      {ITEMS.map(({ Icon, tint, title, body }) => (
        <div
          key={title}
          className="flex items-start gap-6 md:px-7 md:first:pl-0 md:last:pr-0"
        >
          <Icon className={cn("mt-0.5 size-11 shrink-0 md:size-13", tint)} strokeWidth={1.4} />
          <div>
            <p className="text-card-title text-ink-800">{title}</p>
            <p className="text-body-sm mt-2 text-ink-500">
              {body[0]}
              <br className="hidden sm:inline" />{" "}
              {body[1]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
