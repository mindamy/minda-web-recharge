import { PlayTriangle, Refresh, Waveform } from "@/components/icons";
import { MicroEyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

/**
 * The `Personalised Recharge Experiences` card — DESIGN-SPEC §3.3, right column.
 *
 * A static visual mockup. There is no audio and no backend, so nothing here
 * plays: the progress track holds at 0% and the time label holds at
 * `0:00 / 8:00`, which is also what §5 #9 asks for under reduced motion.
 *
 * The play button is still a real `<button type="button">` with an
 * `aria-label`, because a control that looks pressable must be reachable by
 * keyboard and announced as a control — and it keeps genuine hover and press
 * feedback (§5 #16, #17). Feedback is pure CSS, so this whole card stays a
 * Server Component.
 *
 * Copy is verbatim from §3.3. The agreed British standardisation covers the
 * card *title* only, so this card genuinely carries both spellings: the title
 * reads `Personalised Recharge Experiences` and the body line beneath it keeps
 * the deck's `Personalized audio experiences designed`. That looks like a typo
 * and is not one — widening the change to the body line was considered and
 * rejected, because the brief scopes the deviation to the title and says
 * everything else is unchanged. Changing the body copy is a copy decision, not
 * an implementation one.
 */

/** The one non-functional control on the card. */
function PlayButton() {
  return (
    <button
      type="button"
      aria-label="Play Reset, an 8 minute recharge experience"
      className={cn(
        "bg-blue-fill shadow-pill flex size-[50px] shrink-0 items-center justify-center rounded-full text-white",
        "transition-[background-color,box-shadow,transform] duration-150 ease-soft",
        "hover:bg-blue-ink hover:shadow-[0_2px_6px_rgb(43_95_217/0.22),0_10px_22px_rgb(43_95_217/0.18)]",
        "active:scale-[0.97]",
      )}
    >
      <PlayTriangle className="size-4" />
    </button>
  );
}

/** The suggested-experience row — inner card on `surface-inner-rose`. */
function SuggestedRow() {
  return (
    <div className="rounded-inner bg-surface-inner-rose flex items-start gap-3.5 p-4">
      <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FCEAF0]">
        <Refresh className="size-6 text-[#F71C5B]" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-btn">
          <span className="font-semibold text-rose-400">Reset</span>
          <span className="mx-1.5 text-ink-400">&middot;</span>
          <span className="font-medium text-ink-800">8 min</span>
        </p>
        <p className="text-card-body mt-1.5 text-ink-500">
          A moment to clear some mental noise <br className="hidden xl:inline" />
          and make space to reset.
        </p>
      </div>

      {/* Purely decorative, so it is the first thing to go when the row runs
          out of width. §4.2 drops it at `sm`; it also drops through the
          narrow half of the two-column range, where keeping it would force
          the body copy from the deck's two lines onto three. */}
      <span
        aria-hidden
        className="relative hidden size-20 shrink-0 items-center justify-center sm:flex lg:hidden xl:flex"
      >
        <span className="absolute inset-0 rounded-full bg-[#FBD7E4]/55" />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-linear-to-br from-[#FDC4D8] to-[#F78FB4]">
          <Waveform className="size-7 text-white" strokeWidth={1.7} />
        </span>
      </span>
    </div>
  );
}

export function ExperienceCard({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "rounded-card-lg border-hairline-faint bg-surface-card shadow-card border p-6 sm:p-[34px]",
        className,
      )}
    >
      <MicroEyebrow className="text-rose-400">RECHARGE</MicroEyebrow>

      <p className="mt-3.5 text-[0.9375rem] font-semibold text-ink-800">
        Personalised Recharge Experiences
      </p>

      <h3 className="text-h3 mt-3">Feel better in the moment.</h3>

      <p className="mt-3.5 text-[0.9375rem] leading-[1.6] text-ink-600">
        Personalized audio experiences designed <br className="hidden sm:inline" />
        to support the state you need.
      </p>

      <hr className="bg-hairline-faint my-6 h-px border-0" />

      <p className="text-body-sm font-semibold text-ink-800">Suggested for this moment</p>

      <div className="mt-3.5">
        <SuggestedRow />
      </div>

      {/* The player. The thumb sits flush to the track's left end at 0%, and
          the fill has no width yet — both are the resting state, not a bug. */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Play button and track stay one row at every width. The time label is
            what moves below the track at `sm` (§4.2), so it is the only child
            of the wrapper that reflows. */}
        <div className="flex items-center gap-4 sm:flex-1">
          <PlayButton />
          <div className="bg-track relative h-1 flex-1 rounded-full">
            <div className="bg-blue-ink h-full w-0 rounded-full" />
            <span
              aria-hidden
              className="bg-blue-ink absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full"
            />
          </div>
        </div>
        <p className="text-body-sm shrink-0 tabular-nums text-ink-500">0:00 / 8:00</p>
      </div>

      {/* waveform: <AuroraWaveform /> mounted by the page */}
      {/* Reserved at the measured 480 x 90 (§2.5 "The audio waveform"). The
          negative margins are deliberate: in the render the waveform's tails
          rise behind the play button and dissolve past the card's bottom
          padding, which is how a 520px-tall card holds a 90px field below a
          50px player. */}
      <div aria-hidden data-slot="aurora-waveform" className="-mx-1 -mt-2 -mb-4 h-[90px]" />
    </article>
  );
}
