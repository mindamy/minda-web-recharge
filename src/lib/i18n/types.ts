/**
 * Catalogue types.
 *
 * `Messages` is derived **structurally** from the `en-GB` catalogue rather
 * than hand-written. That is the whole reason this project carries no i18n
 * dependency: every other locale file is checked against this shape by the
 * loader map in `./dictionaries`, so a key that is missing, misspelt or the
 * wrong kind (string where the catalogue wants an array) is a
 * `tsc --noEmit` failure at build time — not a blank string discovered by a
 * reader of the site.
 *
 * The `import type` below is erased at compile time, so importing this module
 * never pulls catalogue JSON into a bundle. It is safe from a Client
 * Component; `./dictionaries` is not.
 */

import type enGB from "@/messages/en-GB.json";

/** The canonical catalogue shape. Every locale file must satisfy it. */
export type Messages = typeof enGB;

/**
 * Rich text — one representation for all of it.
 *
 * A value is an array of **lines**; each line is an array of **segments**.
 * Line boundaries are the deck's unconditional breaks (a bare `<br />` or a
 * `<span className="block">`). Responsive breaks — `hidden sm:inline` and
 * friends — are layout, not copy, and are *not* represented here: those
 * strings are stored flat and the component re-breaks them.
 *
 * `mark` selects a renderer-owned treatment (a gradient run, `<strong>`, the
 * `R³` superscript). The catalogue never carries colours or class names: the
 * Hero's three hand-tuned gradient stop sets stay in `Hero.tsx`, keyed by
 * `grad-1` / `grad-2` / `grad-3`. A segment may carry `mark` with no `text`
 * (the `rcubed` case), which is why `text` is optional.
 */
export type RichSegment = { readonly text?: string; readonly mark?: string };
export type RichLine = readonly RichSegment[];
export type RichText = readonly RichLine[];

/**
 * The slice that crosses the server/client boundary.
 *
 * Anything a Client Component needs is serialised into the RSC flight payload
 * embedded in the HTML, so this stays deliberately small — nav, CTA and brand
 * labels, not section prose. A server parent selects it and passes it to
 * `MessagesProvider`; no `"use client"` file may import a catalogue directly,
 * because a static JSON import from the client graph bundles **all three**
 * locales with no warning.
 */
export type ClientMessages = {
  readonly nav: Messages["chrome"]["nav"];
  readonly localeSwitcher: Messages["chrome"]["localeSwitcher"];
  readonly cta: Messages["common"]["cta"];
  readonly brand: Messages["common"]["brand"];
};
