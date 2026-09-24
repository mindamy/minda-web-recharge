"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_LABELS,
  LOCALES,
  localePath,
  type Locale,
} from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/MessagesProvider";
import { splitLocalePath } from "@/lib/nav";

import { FlagIcon } from "./FlagIcon";

/**
 * The language switcher.
 *
 * ---------------------------------------------------------------------------
 * LINKS, NOT A `<select>`.
 *
 * Every locale is a real, prerendered, crawlable URL — `/zh-Hant/plans` is a
 * page, not a client-side state change. So each option is an anchor. That is
 * what makes middle-click, cmd-click and "open in new tab" work, what lets a
 * bilingual reader keep two locales open side by side, and what lets a
 * crawler find the other six locales from any page. A `<select>` would need
 * JavaScript to navigate at all, would expose no href to anything, and on iOS
 * would open a native wheel picker that hides the page it is meant to switch.
 *
 * The desktop trigger is therefore a **disclosure** (button + `aria-expanded`
 * + `aria-controls`) wrapping a list of links — not `role="menu"`. A menu is
 * for commands; these are navigations, and `role="menu"` would make a screen
 * reader announce links as menu items and suppress the "link" role that tells
 * the reader they can be opened in a new tab.
 * ---------------------------------------------------------------------------
 *
 * LABELS ARE AUTONYMS, NEVER TRANSLATED. `简体中文` reads as `简体中文` on the
 * English page. A reader who cannot read the current locale must still be
 * able to find their own language, which is impossible if the options are
 * translated into a language they do not speak. They come from
 * `LOCALE_LABELS`, not from the catalogue, for exactly that reason — the only
 * catalogue string here is the control's own accessible name.
 *
 * THE FLAG IS DECORATION ON TOP OF THE AUTONYM, NEVER INSTEAD OF IT. It is
 * `aria-hidden` (see `FlagIcon`) and adds no accessible text, so nothing is
 * announced twice and nothing depends on it. It earns its place by making the
 * seven-item list scannable at a glance — a shape is found faster than a word
 * in a script you do not read — but a flag is a country and a country is not
 * a language, so it cannot be the label. Two of the seven tags carry no
 * region at all (`zh-Hans`, `zh-Hant` are script subtags), which is the
 * clearest possible demonstration of why.
 *
 * NEVER IMPORT A CATALOGUE FROM THIS FILE. It is `"use client"`: a static
 * `import … from "@/messages/…"` would bundle all seven locales into the
 * browser chunk with no error and no warning. The label arrives through
 * `useMessages()`, from the slice the layout already selected.
 */

type Variant =
  /** Desktop header bar — a compact disclosure. */
  | "menu"
  /** Mobile sheet — a flat, always-open row of pills. */
  | "sheet"
  /** Footer — a flat row of quiet text links. */
  | "footer";

export function LanguageSwitcher({
  variant = "menu",
  className,
  onNavigate,
}: {
  variant?: Variant;
  className?: string;
  /** Lets the mobile sheet close itself when a locale is chosen. */
  onNavigate?: () => void;
}) {
  if (variant === "menu") return <MenuSwitcher className={className} />;
  return <InlineSwitcher variant={variant} className={className} onNavigate={onNavigate} />;
}

/**
 * The hrefs every variant navigates to — the current location with **only**
 * its first path segment swapped.
 *
 * ---------------------------------------------------------------------------
 * `<Link locale="…">` DOES NOT EXIST HERE.
 *
 * That prop belongs to the Pages Router's built-in i18n, which the App Router
 * does not implement. Passed to `next/link` in `app/`, it is neither a type
 * error nor a runtime error — it is silently forwarded to the DOM and
 * ignored, so the link navigates to the *current* locale and the switcher
 * appears to do nothing. The full href has to be built by hand.
 * ---------------------------------------------------------------------------
 *
 * The route is preserved, not discarded: a reader switching language from
 * `/en-GB/plans` lands on `/zh-Hant/plans`, not on the home page. Being
 * bounced to the top of the site is the single most common failure of a
 * language switcher and the most annoying, because the reader has to find
 * their place again in a language they were already struggling with.
 *
 * `?query` and `#hash` are preserved too, and they are read from
 * `window.location` rather than from `useSearchParams()`. That is deliberate:
 * `useSearchParams()` in a component rendered by the root layout would opt
 * every one of the 42 prerendered routes out of static rendering (or demand a
 * Suspense boundary around the whole header). Neither part is available
 * during SSR in any case, so the suffix starts empty — matching the server
 * HTML exactly, so there is no hydration mismatch — and is filled in after
 * mount. `hashchange` and `popstate` cover in-page anchor jumps and the back
 * button, which change the URL without changing `pathname`.
 *
 * One measured caveat, so it is not mistaken for a bug here later. The href
 * always carries the fragment, and a cold load of it keeps the fragment. But
 * on a *client-side* navigation the App Router drops a fragment that has no
 * element to scroll to: from `/en-GB/plans?plan=essential#compare` the
 * address bar settles on `/zh-Hant/plans?plan=essential` (3/3 trials), while
 * the query is always kept. A fragment that does point at something survives
 * intact — from `/en-GB#plans` the reader lands on `/zh-Hant#plans` at
 * scrollY 6715, four pixels from where they were (3/3 trials). Since the
 * preserved case is the one that holds the reader's place, and the dropped
 * case points at nothing, this is not worth forcing a full page load for.
 */
function useLocaleHrefs(): { locale: Locale; hrefFor: (target: Locale) => string } {
  const pathname = usePathname();
  const { locale, route } = splitLocalePath(pathname);
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const read = () => setSuffix(window.location.search + window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    window.addEventListener("popstate", read);
    return () => {
      window.removeEventListener("hashchange", read);
      window.removeEventListener("popstate", read);
    };
  }, [pathname]);

  return { locale, hrefFor: (target: Locale) => `${localePath(target, route)}${suffix}` };
}

const OPTION_TRANSITION = "transition-colors duration-150 ease-soft";

/**
 * The flag chip, shared by all three variants so they cannot drift.
 *
 * The hairline ring is not ornament. Japan is a white field with a red disc
 * and Indonesia's lower half is white, so on the menu's `bg-white/95` sheet
 * and on the footer's pale ground both flags would otherwise dissolve into
 * the background and read as a half-flag floating in space. The ring draws
 * the edge the flag itself does not have.
 *
 * `ring` rather than `border`: a border would sit inside the 21×14 box and
 * eat 2px of a 14px-tall drawing, which at this size visibly clips Japan's
 * disc and Malaysia's canton.
 */
const FLAG_CHIP = "ring-1 ring-black/10";

/**
 * Records an explicit language choice, so the proxy stops guessing.
 *
 * ---------------------------------------------------------------------------
 * THIS IS WHAT MAKES AUTO-DETECTION SAFE.
 *
 * `src/proxy.ts` redirects a visitor who arrives without a locale prefix
 * to one negotiated from their IP country, then their `Accept-Language`. Both
 * are guesses about a person. Without this cookie the guess would be re-made
 * on every visit, so an English-speaking reader in Kuala Lumpur who switches
 * to English would be thrown back into Malay the next time they opened the
 * site — and would have no way to make it stop. `negotiateLocale` therefore
 * ranks this cookie above every detected signal.
 *
 * Written from the click rather than from the proxy, deliberately. If the
 * proxy set it on any locale-prefixed request, then simply *opening*
 * a `/ja-JP` link someone shared would silently rewrite the recipient's
 * language preference for the whole site. Only a press on this control is an
 * actual decision, and only decisions are recorded.
 * ---------------------------------------------------------------------------
 *
 * No JavaScript, no cookie — and that is an acceptable degradation, not a
 * hole. The options are real links, so the switch itself still works; the
 * reader simply lands where detection puts them if they later open a URL with
 * no locale in it. Every link on the site is locale-prefixed, so that is the
 * home page on a fresh visit and nothing else.
 *
 * `SameSite=Lax` because this is read on a top-level navigation, which Lax
 * permits; there is nothing cross-site to allow and no reason to widen it.
 * Not `Secure`, because that would stop it working on `http://localhost`
 * during development — it carries a language name, not a credential.
 */
function rememberLocale(target: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/** Globe, drawn to the same 1.6 stroke as the header's burger. */
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <circle cx="12" cy="12" r="8.4" />
        <path d="M3.6 12h16.8" />
        <path d="M12 3.6c2.2 2.3 3.4 5.3 3.4 8.4s-1.2 6.1-3.4 8.4c-2.2-2.3-3.4-5.3-3.4-8.4S9.8 5.9 12 3.6Z" />
      </g>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" aria-hidden focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Desktop disclosure.
 *
 * Keyboard contract, all of it hand-wired because a disclosure over links has
 * no native equivalent:
 *
 *   Enter / Space  toggle (native `<button>` behaviour)
 *   ArrowDown/Up   from the trigger: open and land on the current locale;
 *                  inside the list: move between options, wrapping
 *   Home / End     first / last option
 *   Escape         close and return focus to the trigger
 *   Tab            leaves the control, which closes it (focusout)
 *
 * The options stay in the natural tab order while open — they are links, and
 * a reader who tabs through them rather than arrowing should reach them.
 */
function MenuSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const { localeSwitcher } = useMessages();
  const { locale, hrefFor } = useLocaleHrefs();

  const listId = useId();
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  /** Set when the menu is opened from the keyboard, so focus follows it in. */
  const focusOnOpen = useRef<number | null>(null);

  const activeIndex = Math.max(
    LOCALES.findIndex((l) => l === locale),
    0,
  );

  // Close on route change. Adjusting state during render is the documented
  // pattern for reacting to a changed input — an effect would paint the stale
  // open menu over the newly navigated page for a frame first. Same shape as
  // the mobile sheet in `Header`.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open || focusOnOpen.current === null) return;
    const index = focusOnOpen.current;
    focusOnOpen.current = null;
    optionRefs.current[index]?.focus();
  }, [open]);

  // Click outside closes. `pointerdown` rather than `click` so the menu is
  // gone before the outside target reacts, and so a drag that starts outside
  // dismisses it too.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const focusOption = (index: number) => {
    const wrapped = (index + LOCALES.length) % LOCALES.length;
    optionRefs.current[wrapped]?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      // Tabbing (or clicking) away from the whole control closes it. Checked
      // against `currentTarget`, so moving between the trigger and an option
      // does not.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            close(false);
            return;
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const target =
              event.key === "ArrowDown" ? activeIndex : (activeIndex + LOCALES.length - 1) % LOCALES.length;
            if (open) {
              focusOption(target);
            } else {
              focusOnOpen.current = target;
              setOpen(true);
            }
          }
        }}
        className={cn(
          "inline-flex h-[45px] shrink-0 items-center gap-2 rounded-full border px-3.5 2xl:px-4",
          "text-nav font-sans whitespace-nowrap select-none",
          "transition-[background-color,border-color,color] duration-150 ease-soft",
          open
            ? "border-border-blue bg-blue-tint-50 text-blue-ink"
            : "border-border-neutral text-ink-800 hover:border-ink-400 hover:bg-white/60",
        )}
      >
        <GlobeIcon />
        {/*
          The accessible name is computed from these contents: "Language
          English". The catalogue word is always in it, so the control is
          announced as a language picker even where the autonym is hidden for
          width; and where the autonym *is* visible it is part of the name, so
          voice control can address the control by the words on screen
          (WCAG 2.5.3 Label in Name).
        */}
        <span className="sr-only">{localeSwitcher.label}</span>
        {/*
          ---------------------------------------------------------------------
          THE FLAG IS THE COMPACT FORM OF THE AUTONYM. Exactly one of these two
          is ever on screen: the flag below `2xl`, the word at `2xl` and above.

          The previous measurement here was of the wrong thing. It compared the
          autonym against the gap between this trigger and the Sign In pill and
          concluded 1280px "fits with room to spare" — but the binding
          constraint is the *nav*, on the other side of the bar, and at 1280px
          it was already 25px short in English. The header collided: `How It
          Works` overlapped the wordmark and three labels wrapped to two lines.
          That shipped.

          Re-measured at 1280px, natural widths against the 1200px track
          (logo 223 + nav + cluster):

            en-GB   nav 570  cluster 432   25px over
            ja-JP   nav 564  cluster 399   14px spare
            zh-Hant nav 467  cluster 434   76px spare
            zh-Hans nav 467  cluster 370  140px spare
            id-ID   nav 664  cluster 465  152px over
            ms-MY   nav 693  cluster 493  209px over

          Malay and Indonesian are the widest because their nav labels are —
          `Kepercayaan & Pendekatan` against `Trust & Approach`. Those two
          labels were shortened in their catalogues at the same time as this
          change; the two fixes together are what clear 1280px, and removing
          either brings the collision back.

          The flag costs 21px where the widest autonym costs 128px
          (`繁體中文（台灣）`), so swapping them buys 91px in the locale that
          needs it most — and it is strictly *more* informative than what
          stood here before, which showed nothing but a globe below `xl`.
          ---------------------------------------------------------------------

          `aria-hidden` on the flag (see `FlagIcon`) keeps the accessible name
          at just `Language` while it is the visible form. The autonym is not
          `aria-hidden`, so where the word is on screen the name becomes
          `Language English` and matches it (WCAG 2.5.3 Label in Name).
        */}
        <FlagIcon locale={locale} className={cn(FLAG_CHIP, "2xl:hidden")} />
        <span className="hidden 2xl:inline">{LOCALE_LABELS[locale]}</span>
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "size-4 shrink-0 transition-transform duration-200 ease-soft",
            open && "rotate-180",
          )}
          fill="none"
          aria-hidden
          focusable="false"
        >
          <path
            d="M6.5 9.5l5.5 5.5 5.5-5.5"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id={listId}
          // `min-w` went from 11rem to 14rem when the list grew from three
          // options to seven: the widest row is now a 21px flag, a 10px gap
          // and `Bahasa Indonesia`, and at 11rem that row wrapped.
          //
          // The height cap is a guard, not a layout: seven rows measure 332px
          // and this menu only renders at `xl` and above, where the viewport
          // is essentially never short enough to clip them. It costs nothing
          // when the list fits, and on a 1280×500 window (docked devtools) it
          // is the difference between scrolling to Japanese and not reaching
          // it at all. Arrow-key focus scrolls the option into view either
          // way.
          className="absolute right-0 z-50 mt-2 max-h-[calc(100vh-7rem)] min-w-[14rem] overflow-y-auto rounded-2xl border border-hairline-faint bg-white/95 p-1.5 shadow-[0_2px_6px_rgb(15_38_72/0.06),0_16px_32px_rgb(15_38_72/0.1)] backdrop-blur-xl"
        >
          <ul aria-label={localeSwitcher.label} className="flex flex-col gap-0.5">
            {LOCALES.map((target, index) => {
              const current = target === locale;
              return (
                <li key={target}>
                  <Link
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    href={hrefFor(target)}
                    hrefLang={target}
                    lang={target}
                    // The current locale's href *is* the current URL, so
                    // `page` is the accurate token — not merely "selected".
                    aria-current={current ? "page" : undefined}
                    onClick={() => {
                      rememberLocale(target);
                      setOpen(false);
                    }}
                    onKeyDown={(event) => {
                      switch (event.key) {
                        case "ArrowDown":
                          event.preventDefault();
                          focusOption(index + 1);
                          break;
                        case "ArrowUp":
                          event.preventDefault();
                          focusOption(index - 1);
                          break;
                        case "Home":
                          event.preventDefault();
                          focusOption(0);
                          break;
                        case "End":
                          event.preventDefault();
                          focusOption(LOCALES.length - 1);
                          break;
                        case "Escape":
                          event.preventDefault();
                          close(true);
                          break;
                      }
                    }}
                    className={cn(
                      "text-nav flex items-center justify-between gap-3 rounded-xl px-3 py-3",
                      OPTION_TRANSITION,
                      current
                        ? "bg-blue-tint-50 text-blue-ink"
                        : "text-ink-800 hover:bg-blue-tint-50 hover:text-blue-ink",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagIcon locale={target} className={FLAG_CHIP} />
                      {LOCALE_LABELS[target]}
                    </span>
                    {/* A tick as well as the tint: the active option must not
                        be distinguished by colour alone. The flag does not
                        count towards that — it is the same flag whether or
                        not the option is current. */}
                    {current ? <CheckIcon /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Flat variant — no disclosure, nothing to open, nothing to keyboard-trap.
 *
 * Used in the mobile sheet and the footer. Seven links in the tab order and a
 * group label; that is the whole component. A reader stranded in a language
 * they cannot read must not have to discover a collapsed control inside
 * another collapsed control to get out of it, which is what nesting a
 * disclosure inside the burger sheet would ask of them.
 *
 * Seven wrapping pills is more rows than three was, and that is the right
 * trade: the alternative — collapsing them behind a disclosure once the list
 * grew — reintroduces exactly the control-inside-a-control this variant
 * exists to avoid, and it gets worse as locales are added, not better.
 */
function InlineSwitcher({
  variant,
  className,
  onNavigate,
}: {
  variant: Exclude<Variant, "menu">;
  className?: string;
  onNavigate?: () => void;
}) {
  const { localeSwitcher } = useMessages();
  const { locale, hrefFor } = useLocaleHrefs();
  const labelId = useId();

  const sheet = variant === "sheet";

  return (
    // No font size of its own: the call site sets it (`text-nav` in the
    // sheet, `text-meta` in the footer) and the options inherit, so one
    // component carries no per-caller size table.
    <div
      className={cn(
        "flex flex-wrap items-center",
        sheet ? "gap-x-3 gap-y-2" : "gap-x-4 gap-y-2",
        className,
      )}
    >
      <span id={labelId} className="text-ink-500">
        {localeSwitcher.label}
      </span>
      <ul
        aria-labelledby={labelId}
        className={cn("flex flex-wrap items-center", sheet ? "gap-2" : "gap-x-4 gap-y-1")}
      >
        {LOCALES.map((target) => {
          const current = target === locale;
          return (
            <li key={target}>
              <Link
                href={hrefFor(target)}
                hrefLang={target}
                lang={target}
                aria-current={current ? "page" : undefined}
                onClick={() => {
                  rememberLocale(target);
                  onNavigate?.();
                }}
                className={cn(
                  "inline-flex items-center gap-2",
                  OPTION_TRANSITION,
                  sheet
                    ? cn(
                        // 38px tall, measured, not the 34px that `py-2` gave:
                        // this is the one variant that is only ever touched.
                        "rounded-full border px-3.5 py-2.5",
                        current
                          ? "border-border-blue bg-blue-tint-50 text-blue-ink"
                          : "border-border-neutral text-ink-800 hover:bg-blue-tint-50 hover:text-blue-ink",
                      )
                    : cn(
                        // `py-1` for a 30px target. At `text-meta` the bare
                        // text measures 22px, which is under the 24px WCAG
                        // 2.5.8 minimum — and this row is reached by thumb on
                        // a phone as often as by cursor.
                        "rounded py-1",
                        current ? "text-blue-ink" : "text-ink-500 hover:text-blue-ink",
                      ),
                )}
              >
                <FlagIcon locale={target} className={FLAG_CHIP} />
                {LOCALE_LABELS[target]}
                {current ? <CheckIcon /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
