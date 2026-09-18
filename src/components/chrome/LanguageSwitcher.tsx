"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { LOCALE_LABELS, LOCALES, localePath, type Locale } from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/MessagesProvider";
import { splitLocalePath } from "@/lib/nav";

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
 * crawler find the other two locales from any page. A `<select>` would need
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
 * NEVER IMPORT A CATALOGUE FROM THIS FILE. It is `"use client"`: a static
 * `import … from "@/messages/…"` would bundle all three locales into the
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
 * every one of the 18 prerendered routes out of static rendering (or demand a
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
          "inline-flex h-[45px] shrink-0 items-center gap-2 rounded-full border px-3.5 xl:px-4",
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
          Hidden below `xl`, and not `aria-hidden`: where it is visible it is
          part of the accessible name, so the name matches the words on screen
          rather than contradicting them.

          Measured rather than guessed. At 1024px the compact trigger leaves a
          35px gap to the Sign In pill, and the widest autonym adds 76px — so
          showing it at `lg` is a 41px overflow, in Traditional Chinese, on
          the narrowest desktop. At 1280px the gap is 110px and it fits with
          room to spare. Below `xl` the globe carries the meaning and the
          current locale is one keystroke away inside the list, stated with a
          tick and `aria-current`.
        */}
        <span className="hidden xl:inline">{LOCALE_LABELS[locale]}</span>
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
          className="absolute right-0 z-50 mt-2 min-w-[11rem] rounded-2xl border border-hairline-faint bg-white/95 p-1.5 shadow-[0_2px_6px_rgb(15_38_72/0.06),0_16px_32px_rgb(15_38_72/0.1)] backdrop-blur-xl"
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
                    onClick={() => setOpen(false)}
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
                    {LOCALE_LABELS[target]}
                    {/* A tick as well as the tint: the active option must not
                        be distinguished by colour alone. */}
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
 * Used in the mobile sheet and the footer. Three links in the tab order and a
 * group label; that is the whole component. A reader stranded in a language
 * they cannot read must not have to discover a collapsed control inside
 * another collapsed control to get out of it, which is what nesting a
 * disclosure inside the burger sheet would ask of them.
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
                onClick={onNavigate}
                className={cn(
                  "inline-flex items-center gap-1.5",
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
