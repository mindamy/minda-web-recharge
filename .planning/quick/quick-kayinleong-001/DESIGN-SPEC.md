# Recharge marketing page — implementation-ready design specification

Extracted from rendered mockups. Every colour is sampled from actual pixels; every copy
string is transcribed verbatim from zoomed crops.

## Sources and measurement basis

| Source | Native size | Role |
|---|---|---|
| `.docs/First Page.jpeg` | 1448 × 1086 | **Canonical hero.** Supersedes deck page 1 entirely. |
| deck `p-1.png` | 1107 × 738 | Superseded hero variant. Retained only for shared chrome + Appendix A. |
| deck `p-2.png` | 1107 × 738 | Section 2 — Moments |
| deck `p-3.png` | 1107 × 623 | Section 3 — R³ Loop |
| deck `p-4.png` | 1107 × 623 | Section 4 — Connected |
| deck `p-5.png` | 1107 × 623 | Section 5 — Rhythm |
| deck `p-6.png` | 1107 × 830 | Section 6 — Trust |
| deck `p-7.png` | 1107 × 830 | Section 7 — Plans |
| deck `p-8.png` | 1107 × 738 | Section 8 — Final CTA |

**Reference viewport for all px values in this document: 1448 px wide.** The hero JPEG is
native at that width. Deck PNGs are 1107 px wide, so every measurement taken from a PNG has
been multiplied by **1.3080** (= 1448 / 1107) before being quoted. Values normalised this way
are marked `≈`.

**How colours were obtained.** Flat fills: modal (most frequent) RGB of a rect sampled inside
the fill. Text and 1–2 px strokes: the most chromatic / darkest-plateau pixel within the glyph
body, because antialiasing against a near-white ground lightens every edge pixel. Where a
1 px hairline was measured, the true colour is slightly darker than the sample and the quoted
token is adjusted; those cases are flagged.

**Confidence flags** used below: `[measured]` = sampled directly, high confidence.
`[derived]` = computed from cap-height / string-width fitting. `[inferred]` = a judgement call
where the render is ambiguous; an implementer may adjust.

---

# 1. Design tokens

## 1.1 Colour palette

All values `[measured]` unless noted. The sample location is given so any value can be re-checked.

### Brand blue

| Token | Hex | Sampled from | Used for |
|---|---|---|---|
| `blue-fill` | **#2B5FD9** | p-8 hero button interior; p-7 nav pill interior (identical modal in both) | Every filled primary button, play button, filled pill |
| `blue-ink` | **#1450DF** | p-8 `Explore Plans →`, eyebrows, `Ask Recharge` links (range #0F4CE0–#1451E4) | Link text, eyebrow text, active-nav underline, arrow glyphs |
| `blue-icon` | **#3D80E1** | p-2 crosshair + compass icon strokes; p-6 shield stroke #2F7EDD | 1.5–2 px icon strokes on light tints |
| `blue-300` | **#7DB6F9** | p-8 decorative arc, lower-left terminus | Arc strokes, gradient start, soft outlines |
| `blue-200` | **#A3ACE9** | p-7 Rhythm plan-card border | Emphasised card border |
| `blue-100` | **#B5C0EC** | p-8 / hero `See How It Works` pill border (1 px; raw sample #B0B9DA) | Outlined-pill border, blue variant |
| `blue-tint-50` | **#EEF5FD** | p-2 card-1 icon circle fill | Icon circle backgrounds |
| `blue-tint-100` | **#E6EEF7** | p-6 shield icon circle fill | Icon circle backgrounds, stronger |
| `blue-wash` | **#EDF2FE** | p-3 `Right now: I need a reset` pill | Inline status pills |
| `blue-banner` | **#F0F3FC** | p-2 `Ask Recharge` banner ground | Full-width tinted banners |
| `blue-banner-faint` | **#F8F9FC** | p-7 7-day-trial banner ground | Tinted banner, lowest contrast |

### Teal / green accent

| Token | Hex | Sampled from | Used for |
|---|---|---|---|
| `green-ink` | **#1F8A55** | p-2 `It's normal to have ups and downs.` title; p-4 `AI-guided Coaching` label | Green label/title text |
| `green-500` | **#3EA876** | p-3 `REALIGN` label; p-7 Rhythm check icons; p-7 Rhythm wave icon #45946E | Check marks, eyebrow labels, icon strokes |
| `green-icon` | **#62B291** | p-2 refresh icon; p-2/p-5 heart outlines; hero padlock #5EAC8E | 1.5–2 px icon strokes |
| `teal-400` | **#6ABDB9** | gradient mid-stop; p-8 arc apex #7ACBB7 | Gradient text, arcs |
| `green-300` | **#82BEA2** | p-6 arc left terminus dot | Arc endpoint dots |
| `green-tint-50` | **#EDF4EF** | p-7 Rhythm icon circle | Icon circle backgrounds |
| `green-tint-100` | **#E8F4ED** | p-6 handshake-heart icon circle | Icon circle backgrounds, stronger |

### Pink / rose accent

| Token | Hex | Sampled from | Used for |
|---|---|---|---|
| `rose-ink` | **#E12A5E** | p-7 star stroke #E22D60; p-6 `More relevant, not more intrusive.` #EB2655 | Rose emphasis text, deep icon strokes |
| `rose-500` | **#E8467C** | p-7 Essential/Plus check icons #E8567D | Check marks, `Choose Essential` / `Choose Plus` labels (#E92758) |
| `rose-400` | **#F5538C** | p-3 `RECHARGE` label, `Reset` label, gradient end-stop | Gradient text terminus, bright rose labels |
| `rose-300` | **#E278A7** | p-2 battery icon stroke; p-3 waveform icon #FA86B2 | Soft icon strokes |
| `rose-200` | **#FAAFB0** | p-6 arc right terminus dot | Arc endpoint dots, node rings |
| `rose-tint-50` | **#FCF4F7** | p-3 `Reset · 8 min` inner card ground | Tinted inner cards |
| `rose-tint-100` | **#FBEAEB** | p-6 person-heart icon circle; p-7 Essential/Plus circles #FDEEF0 | Icon circle backgrounds |

### Purple / violet accent

| Token | Hex | Sampled from | Used for |
|---|---|---|---|
| `violet-ink` | **#6C4FA6** | p-6 head-with-brain icon stroke #6642A2 | Deep violet icon strokes |
| `violet-500` | **#8172D8** | p-2 moon icon #826FD6, atom icon #8576E3; p-4 heart icon | Icon strokes |
| `violet-400` | **#9C88B4** | gradient mauve stop (#8880B0 / #A07CAC) | Gradient text mid-late stop |
| `violet-tint-50` | **#F2F2FC** | p-2 moon icon circle; p-2 atom circle #F4F3FC | Icon circle backgrounds |
| `violet-tint-100` | **#F0ECF4** | p-6 brain icon circle | Icon circle backgrounds, stronger |

### Ink (text)

| Token | Hex | Sampled from | Used for |
|---|---|---|---|
| `ink-900` | **#0F2648** | serif display headline plateau across p-2/p-5/p-6/p-7/p-8 (modal of sub-60-luminance pixels; stroke cores reach #0A1F3C) | All serif display headlines, serif closing lines |
| `ink-800` | **#0B1B3C** | p-2 card titles, p-7 plan names, nav links, bold section leads | Sans headings, card titles, nav links |
| `ink-600` | **#4A5872** | p-3/p-5/p-7 body copy (cluster #3E4B60 – #566273) | Default body copy |
| `ink-500` | **#566273** | p-6 card body, p-2 card body | Secondary body inside cards |
| `ink-400` | **#7C859C** | hero `7 days · No credit card required` (#7B8499 / #818A9D) | Meta rows, captions, `Website guide` |

### Surfaces

| Token | Value | Sampled from | Notes |
|---|---|---|---|
| `surface-card` | **#FEFEFE** | p-2 moment cards, p-3 side card, p-6 trust cards | The standard card is *not* pure white; it sits 1 unit below it |
| `surface-card-elevated` | **#FFFFFF** | p-7 Rhythm card interior | Reserved for the one elevated card |
| `surface-card-warm` | **#FDFCFA** | p-7 Essential / Plus card interiors | Warm-cast sections only |
| `surface-translucent` | **rgba(255,255,255,0.70)** + `backdrop-filter: blur(12px)` | hero trust strip | `[derived]` — alpha solved from the aurora wave visible through the card: backdrop #E0ECFC reads #F6F9FE through the card ⇒ α ≈ 0.71 |
| `surface-inner-rose` | **#FCF4F7** | p-3 suggested-experience row | |
| `surface-inner-blue` | **#EDF2FE** | p-3 status pill | |

### Page background

The page ground is a very light, very low-saturation wash that shifts **cool → warm → cool**.
Measured stops:

| Stop | Hex | Where |
|---|---|---|
| cool top-left | **#F7F8FD** | hero (8,108); p-8 (4,70) = #F7F8FB |
| neutral centre | **#F8F9FC** | p-7 (540,400); p-2 mid-field |
| warm right / lower-right | **#FDFCFA** | p-7 top-left & bottom-right; p-6 field |
| cool bottom-left | **#F5F6FB** | p-8 (4,720) |

Prescribed implementation:

```css
--bg-base: #F8F9FC;
background:
  radial-gradient(120% 90% at 78% 30%, #FDFCFA 0%, rgba(253,252,250,0) 60%),
  linear-gradient(160deg, #F7F8FD 0%, #F8F9FC 55%, #F5F6FB 100%);
```

### Borders, hairlines, tracks

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `hairline` | **#E6E8EC** | p-7 in-card divider above `Price coming soon` | Horizontal dividers inside cards |
| `hairline-faint` | **#EFF2F9** | hero trust-strip column dividers (raw #E8EAF0/#F1F2F6) | Vertical column dividers in strips |
| `border-neutral` | **#C6D0E6** | hero `Sign In` pill (1 px; raw core #A4B3D4 — token darkened to compensate for AA) | Neutral outlined pill |
| `border-blue` | **#B5C0EC** | hero `See How It Works` pill | Blue outlined pill |
| `border-blue-strong` | **#A3ACE9** | p-7 Rhythm card | Emphasised card |
| `border-rose` | **#EB8BA5** | p-7 `Choose Essential` / `Choose Plus` pill | Rose outlined pill |
| `border-blue-cta` | **#6B8BEC** | p-7 `Choose Rhythm` pill (raw #5F81E5) | Blue outlined pill, higher contrast |
| `track` | **#E7E8EC** | p-3 audio progress track | Progress / slider tracks |

### Named accessibility check

| Pair | Ratio | Verdict |
|---|---|---|
| `ink-900` #0F2648 on `bg-base` #F8F9FC | ≈ 14.6:1 | pass AAA |
| `ink-600` #4A5872 on #F8F9FC | ≈ 6.9:1 | pass AA (body) |
| `ink-400` #7C859C on #F8F9FC | ≈ 3.5:1 | **fails AA for body text.** Restrict to ≥ 16 px or non-essential meta; prefer `ink-500` for anything load-bearing |
| white on `blue-fill` #2B5FD9 | ≈ 5.6:1 | pass AA |
| `blue-ink` #1450DF on #F8F9FC | ≈ 6.3:1 | pass AA |
| `rose-500` #E8467C on #FEFEFE | ≈ 3.6:1 | **fails AA for body.** Acceptable for ≥ 18.66 px bold labels only (`Choose Essential` at 17 px semibold is marginal — darken to `rose-ink` #E12A5E, ≈ 4.6:1) |
| `green-ink` #1F8A55 on #FEFEFE | ≈ 4.0:1 | marginal; use at ≥ 17 px semibold, as the deck does |

## 1.2 Gradient text

Highlighted phrases are **not** per-word solid colours. Each highlighted phrase carries a
single left-to-right linear gradient drawn from one shared "aurora" ramp. This was confirmed by
column-scanning the glyph cores: within the word `are.` on p-8 the ink moves continuously
#79C3AE → #B1C5BD → #DAA5B2 → #F89BB6 across 110 px, i.e. a gradient, not a colour change at a
word boundary.

### The shared ramp (measured across p-2, p-3, p-5, p-6, p-7, p-8)

| Stop | Hex | Evidence |
|---|---|---|
| 0 % | **#2F6BEE** | p-3 `R` of Recharge #2160EF; p-5 `y` of your #0B4DFD; p-8 `y` of you #4D8EFB |
| 20 % | **#5AA2D8** | p-3 #5599D6; p-6 #569AC1; p-8 #68B5D8 |
| 40 % | **#6ABDB9** | p-3 #6ABDB9; p-5 #49A3C2; p-7 #69A6AD |
| 55 % | **#79C3AE** | p-8 #79C3AE; p-6 #6DA597; p-7 #5A9D8F |
| 72 % | **#9C88B4** | p-3 #ABA0B2; p-5 #736F9B; p-7 #8C829F |
| 100 % | **#F5538C** | p-3 #F8538C; p-5 #EB89AC; p-8 #F69AB4; p-6 #E25B84 |

```css
.grad-text {
  background: linear-gradient(90deg,
    #2F6BEE 0%, #5AA2D8 20%, #6ABDB9 40%,
    #79C3AE 55%, #9C88B4 72%, #F5538C 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
```

### Per-headline gradient mapping (every headline in the deck)

The gradient's 0–100 % span is applied to the highlighted run only; where a headline wraps, the
gradient continues across the wrap in reading order.

| # | Headline | Ink-coloured (`ink-900`) | Gradient run | Measured colours along the run |
|---|---|---|---|---|
| 1 | `What if better sleep, a calmer mind, and relief from migraine discomfort were within reach?` | `What if`, `a`, `and relief from`, `were within reach?` | three runs sharing one continuous ramp | `better sleep,` #1663DA → #0F8FCB · `calmer mind,` #0A81B9 → #295A9D → #46397E · `migraine` #7A4B81 → #C56F97 · `discomfort` #82458C. **Hero ramp is blue → cyan → indigo → purple → magenta — warmer/more violet than the deck ramp above.** `[measured, JPEG]` — compression may have muted saturation; treat as ±8 % |
| 2 | `What do you need right now?` / `Your moment matters.` | line 1 entirely | line 2 `Your moment matters.` entirely | blue #3470F0 (`Your`) → teal #6FC0B6 (`moment`) → mauve #B08FB4 → rose #E8608C (`matters.`) |
| 3 | `How Recharge helps` | `How`, `helps` | `Recharge` only (8 letters, ~190 px) | `R` #2160EF · `e` #5599D6 · `c` #54A2D8 · `h` #53ABC7 · `a` #6ABDB9 · `r` #ABA0B2 · `g` #E66390 · `e` #F8538C |
| 4a | `Wellbeing support shouldn't feel fragmented.` | whole headline | none | — |
| 4b | `One person.` / `One connected experience.` | `One person.`, `One`, `experience.` | `connected` | #3F86EE → #9B8FC8 → #E5709C |
| 4c | `One connected experience` (inside the right circle) | `One`, `experience` | `connected` | #4B8DEF → #8E8AC6 → #B87FC0 |
| 5 | `Meets you where you are.` / `Gets to know your rhythm over time.` | line 1 entirely; `Gets to know`, `over time.` | `your rhythm` | `your` #0B4DFD → #3A75F9 · `rhythm` #49A3C2 → #5085AD → #736F9B → #AB6DA1 → #EB89AC |
| 6 | `Support you can trust,` / *`every step of the way.`* | line 1 entirely | line 2 (serif **italic**) entirely | #3F92D7 → #569AC1 → #5E9AAD → #69A39A → #78A697 → (tail) #C56A8E → #E25B84 on `way.` |
| 7 | `Choose the Recharge that fits you.` | `Choose the Recharge that` | `fits you.` | `fits` #5591D5 → #69A6AD → #5A9D8F · `you.` #8C829F → #B2799C → #D66E8C → #E25B84 |
| 8 | `Start where` / `you are.` | `Start where` | `you are.` | `you` #4D8EFB → #63A0F6 → #68B5D8 · `are.` #79C3AE → #A7BDB3 → #C2B1B2 → #F290AB → `.` #F89BB6 |

### Gradient eyebrows

Two eyebrows are gradient rather than solid blue:

- **p-4 `MORE CONNECTED`** — `MORE` blue → `CONNECTED` violet → rose. Measured #3B7BE8 → #9B7FC4 → #E2548A.
- **p-6 `TRUST & APPROACH`** — measured left-to-right #579D86 (green) → #5B97AD (sky) → #6E6B8D (mauve) → #E56A96 / #D05C83 (rose) → #BB689C → #8880B0 (violet) → #5884CC (blue). i.e. the ramp run **backwards then wrapped**; treat as `linear-gradient(90deg,#3EA876,#5AA2D8,#9C88B4,#E8467C,#9C88B4,#2F6BEE)`.

All other eyebrows are solid `blue-ink` #1450DF.

### Gradient rules

- Never apply the gradient to more than one run per headline visual group.
- The gradient always terminates on rose at its right edge; never end on blue.
- Serif italic + gradient is used exactly once (headline 6, line 2).
- A 2 px gradient rule (blue → rose, ~46 px wide) appears twice on p-4 as a divider under
  `One connected experience` and `One person. / One connected experience.` — measured
  `linear-gradient(90deg,#3B82F0,#6ABDB9,#F5538C)`.

## 1.3 Typography

### Families

**Serif (display).** High-contrast transitional serif: fine hairline serifs, vertical stress,
double-storey `g` with a small lower bowl and an ear, `y` with a **curved** descender ending in
a hook (not a flat-cut tail), splayed `R` leg, teardrop `r` terminal, circular full stop.
Measured metrics: **cap-height ≈ 0.70 em, x-height ≈ 0.48 em.**
`[inferred]` Closest widely available matches, in order: **Playfair Display**, Newsreader,
Source Serif 4, Lora. Confirm the exact face with the design owner before locking — the
curved `y` descender argues against Playfair, the contrast level argues against Lora.
Fallback stack: `"Playfair Display", Newsreader, "Source Serif 4", Georgia, serif`.

**Sans (UI + body).** Geometric-humanist: near-circular `o`/`e`/`c`, **double-storey `a`** with
no tail, **single-storey `g`** with an open hook descender, flat angle-cut `t` with no bottom
curve, straight-diagonal `y` descender, short `r` arm.
Measured metrics: **cap-height ≈ 0.71 em, x-height ≈ 0.51 em.**
`[inferred]` Closest matches: **Outfit**, Questrial, Hanken Grotesk, Figtree, Jost.
Fallback stack: `Outfit, Questrial, "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif`.

### Type roles (all at the 1448 px reference width)

Sizes are `[derived]` from cap-height ÷ 0.71 (sans) or ÷ 0.70 (serif), cross-checked against
measured string width ÷ character count. Measured cap-height is given so any value can be
re-verified against a running build.

| Role | Family | Size | Weight | Line-height | Letter-spacing | Colour | Measured basis |
|---|---|---|---|---|---|---|---|
| Eyebrow / kicker | sans | **14 px** | 600 | 1.2 (17 px) | **+0.16 em** (≈ 2.2 px) | `blue-ink` (or gradient) | cap 10–11 px; inter-letter gap a flat 4 px; string `YOUR PERSONAL WELLBEING COMPANION` = 388 px over 33 chars |
| H1 display | serif | **56 px** | 400 | **1.10 (62 px)** | 0 | `ink-900` + gradient run | cap 40 px, x-height 27 px, baseline-to-baseline 61.5 px (5 lines: 253/315/376/437/499) |
| H2 section headline | serif | **44 px** | 400 | **1.15 (50 px)** | 0 | `ink-900` + gradient run | p-2/p-6 cap ≈ 31 px ⇒ 44 px `≈` |
| H3 / in-card display | serif | **31 px** | 400 | 1.22 (38 px) | 0 | `ink-900` | p-3 `Feel better in the moment.` |
| Section lead (serif) | serif | **30 px** | 400 | **1.22 (37 px)** | 0 | `ink-900` | hero subhead: cap 22 px, x-height 15 px, baselines 561/598 |
| Section lead (sans) | sans | **20 px** | 400 | 1.5 (30 px) | 0 | `ink-600` | hero `Give yourself the rest…`: cap 16 px, x-height 11 px |
| Body | sans | **17 px** | 400 | **1.62 (28 px)** | 0 | `ink-600` | p-2/p-5/p-6 leads; p-6 card body baseline pitch ≈ 21 px raw ⇒ 27 px `≈` |
| Body small | sans | **14 px** | 400 | 1.55 (22 px) | 0 | `ink-500` | hero trust-strip body: x-height 7 px, 42 chars over 262 px; baseline pitch 19 px |
| Card title (sans) | sans | **17 px** | 600 | 1.3 (22 px) | 0 | `ink-800` | hero `Support, not diagnose.`: cap 13 px, x-height 9 px, 22 chars over 180 px |
| Card body | sans | **14 px** | 400 | 1.55 (22 px) | 0 | `ink-500` | p-2 / p-6 card bodies |
| Caption / meta | sans | **13 px** | 400 | 1.4 (18 px) | 0 | `ink-400` | hero meta: x-height 6 px, ascender 9 px, 32 chars over 193 px |
| Nav link | sans | **16 px** | 400 | 1 | 0 | `ink-800` | cap 11 px, x-height 8 px |
| Button label (large) | sans | **17 px** | 500 | 1 | 0 | `#FFFFFF` on `blue-fill`; `blue-ink` on outline | hero primary: x-height 9 px, cap 14 px, `Try Recharge Free` = 146 px over 17 chars (8.6 px/char) |
| Button label (nav) | sans | **15 px** | 500 | 1 | 0 | `#FFFFFF` / `ink-800` | nav pill: cap 11 px, `Try Recharge Free` = 124 px over 17 chars (7.3 px/char) |
| Wordmark | serif | **38 px** | 400 | 1 | −0.005 em | `ink-900` | cap 24 px, x-height 19 px, `Recharge` spans x 112→271 |
| Micro-eyebrow (in-card) | sans | **12 px** | 600 | 1.2 | **+0.14 em** | role colour | p-3 `RECHARGE`, p-4 `WHY CONNECTION MATTERS`, p-7 `7-DAY FREE TRIAL` |
| Scroll label | sans | **13 px** | 600 | 1 | **+0.14 em** | `blue-ink` | cap 10 px, `SCROLL TO EXPLORE` = 174 px over 17 chars, inter-letter gap 3 px |

Only **two weights** appear anywhere in the deck: **400 regular** and **600 semibold**
(button labels read as 500 but are within measurement noise of 600 — ship 500 for buttons,
600 for titles/eyebrows). No italics except the one serif-italic headline line on p-6.

## 1.4 Radii

| Token | Value | Measured from |
|---|---|---|
| `radius-pill` | `9999px` (full) | every button and pill; hero primary 225 × 52 with a 26 px end cap |
| `radius-card` | **20 px** | p-2 moment card (raw 16 px ⇒ ≈ 21); hero trust strip (~20 px) |
| `radius-card-lg` | **24 px** | p-7 plan cards, p-6 trust cards |
| `radius-media` | **14 px** | p-2 card photo inset (raw 11 px ⇒ ≈ 14) |
| `radius-inner` | **16 px** | p-3 `Reset · 8 min` inner card |
| `radius-node` | `9999px` | all icon circles, node circles, photo circles |
| `radius-squircle` | **28 px top / 28 px bottom-left+right** | p-3 `You` node is a *squircle* — a 105 × 105 rounded shape with a near-semicircular top and softly rounded bottom, not a circle |

## 1.5 Shadows

Measured on p-2: the card interior reads #FEFEFE (lum 254) at its bottom edge; immediately
below the card the ground dips to #F5F6F9 (lum 246) for ~3 px, then returns to the page ground
#F8F9FB (lum 249). The shadow is therefore **≈ 3 luminance units deep — roughly 1 % darkening
at its peak.** Extremely soft and low-opacity.

| Token | Value |
|---|---|
| `shadow-card` | `0 1px 2px rgba(15,38,72,0.03), 0 4px 12px rgba(15,38,72,0.04), 0 12px 32px rgba(15,38,72,0.035)` |
| `shadow-card-elevated` | `0 2px 4px rgba(15,38,72,0.04), 0 10px 28px rgba(15,38,72,0.06), 0 24px 56px rgba(15,38,72,0.05)` (p-7 Rhythm card) |
| `shadow-node` | `0 2px 10px rgba(15,38,72,0.05)` (icon circles, timeline nodes) |
| `shadow-pill` | `0 1px 3px rgba(43,95,217,0.18), 0 6px 16px rgba(43,95,217,0.14)` (filled blue buttons — `[inferred]`, the render shows only a faint blue-tinted halo) |
| `shadow-none` | hairline dividers, outlined pills, trust-strip translucent card (no shadow measurable) |

No shadow anywhere in the deck exceeds ~6 % opacity. **Never use a grey shadow** — every
shadow is tinted with the navy `ink-900` hue.

## 1.6 Spacing rhythm

The hero's vertical gaps, measured baseline-to-cap-top:

| Gap | px |
|---|---|
| header bottom → eyebrow cap | 54 |
| eyebrow baseline → H1 cap | 40 |
| H1 last baseline → serif-lead cap | 40 |
| serif-lead last baseline → sans-body cap | 32 |
| sans-body baseline → CTA row top | 42 |
| CTA row bottom → meta cap | 28 |
| meta baseline → trust card top | 60 |
| trust card bottom → scroll label cap | 26 |

Prescribed scale (4 px base, 8-point friendly):

```
4  8  12  16  20  24  32  40  48  56  64  80  96  120  160
```

Section-level rhythm:
- **Section vertical padding:** 120 px top / 120 px bottom at desktop.
- **Eyebrow → headline:** 20 px. **Headline → lead:** 24 px. **Lead → primary content:** 48 px.
- **Content → closing line / strip:** 56 px. **Closing line → Ask Recharge block:** 24 px.
- **Card grid gutter:** 20 px (moments row), 24 px (4-up trust cards), 20 px (3-up plans).
- **Card internal padding:** 24 px (small cards), 28 px (plan/trust cards).
- **Icon circle → title:** 24 px. **Title → body:** 12 px (sans title) / 16 px (display title).

## 1.7 Containers

| Container | Width at 1448 | Evidence |
|---|---|---|
| Header / nav | full-bleed, **40 px** side padding | logo mark left edge x = 41; nav CTA right edge x = 1412 (right inset 36) |
| Hero text column | left inset **56 px**, column width ≈ **480 px** | eyebrow ink starts x 56; longest H1 line ends x 525 |
| Narrow centred container | **1152 px** (`max-w-6xl`), centred | hero trust strip x 146 → 1308; (1448 − 1152) / 2 = 148 ✓ |
| Wide content container | **1360 px**, centred | p-2 moments row spans x ≈ 43 → 1373 |
| Plans grid container | **1152 px** | p-7 three cards + gutters ≈ 1140 |

---

# 2. Shared chrome

## 2.1 Header / nav

**Band:** full-bleed, transparent over the page ground (no fill, no border, no shadow).
Height **112 px**; all items optically centred on y ≈ 56.

**Logo lockup** (left, x 41):
- Circular mark, **62 px** diameter, at x 41 → 103, y 26 → 88.
  A multi-colour swirl ring — four arcs rotating clockwise: **blue** #4E9BE0 top-left,
  **silver-grey** #9CA6B4 top, **rose** #E8608C right, **green** #6DB498 bottom-left —
  enclosing a centred human figure with arms raised: an upper grey-blue torso/head and a lower
  green body form. The ring is an open swirl (arcs overlap at the ends), not a closed circle.
- **16 px** gap, then the wordmark `Recharge` in serif 38 px / 400 / `ink-900`, x 112 → 271,
  baseline y 69.

**Nav items** (centred as a group), order is identical on all 8 pages:

1. `How It Works`
2. `The R³ Experience` — the `3` is a **superscript**, set at ~0.62 em, raised ~0.42 em
3. `Plans`
4. `Trust & Approach`
5. `About`

Sans 16 px / 400 / `ink-800`, baseline y 62, **36 px** gap between items.
Measured x spans: 447–543, 584–717, 752–790, 826–952, 987–1033.

**Active-nav treatment.** A short horizontal bar centred beneath the active label.
- p-6, active = `Trust & Approach`: bar x 671 → 714 (**≈ 57 px** wide), y 62 → 64 (**2 px**
  after normalisation ≈ 2.6 px), core colour **#366CC0**; label centre 692.5, bar centre
  692.5 — exactly centred. Label is also recoloured to `blue-ink`.
- p-7, active = `Plans`: bar x 555 → 593 (**≈ 51 px**), y 53 → 55, core **#1B57CB**; label
  spans 558 → 591 so the bar overhangs the label by ~3 px each side. Label recoloured.

Prescribed: **2 px bar, `blue-fill` #2B5FD9, centred, width 52 px (fixed), 10 px below the
label baseline; active label colour `blue-ink`.** A fixed 52 px reconciles both observations;
`width: 100%` of the label would be wrong for `Trust & Approach` (123 px label vs 57 px bar).

**`Sign In`** — outlined pill, x 1124 → 1222 (**99 × 45 px**), fully rounded,
`1px solid border-neutral` #C6D0E6, transparent fill, label sans 16 px / 500 / `ink-800`.

**`Try Recharge Free`** — filled pill, x 1242 → 1412 (**170 × 45 px**), fully rounded,
fill `blue-fill` #2B5FD9, no border, label sans 15 px / 500 / `#FFFFFF`, `shadow-pill`.
**24 px** gap between the two pills.

## 2.2 Trust strip

Appears on hero page 1 and (as a solid variant) on deck page 1. **Not present on pages 2–8.**

**Container:** x 146 → 1308 (**1163 × 131 px**), `radius-card` 20 px,
fill `surface-translucent` rgba(255,255,255,0.70) + `backdrop-filter: blur(12px)`, no border,
no shadow. Aurora waves are faintly visible through it — the translucency is load-bearing.

**Three columns** separated by two 1 px vertical hairlines at x 579.5 and x 940.5,
colour `hairline-faint` #EFF2F9, vertically inset (they run y ≈ 868 → 948, not edge to edge).
Column widths are **not** equal: 433 / 361 / 368 px.

Each column: **52 px** outline icon (stroke ≈ 2.5 px) at the left, **36 px** gap, then a
17 px/600 `ink-800` title and a 14 px/400 `ink-500` two-line body at 19 px baseline pitch.
Card padding: 55 px left, 34 px top.

| # | Icon | Icon colour | Title (verbatim) | Body (verbatim, line breaks as rendered) |
|---|---|---|---|---|
| 1 | Shield with a check mark inside | `#1F58D8` (blue) | `Support, not diagnose.` | `Everyday wellbeing support and reflection,`<br>`not diagnosis, treatment or cure.` |
| 2 | Closed padlock (rounded body, square keyhole) | `#5EAC8E` (green) | `Your privacy matters.` | `We handle your information with care`<br>`and give you control.` |
| 3 | Heart outline | `#E66A96` (pink) | `Built with care.` | `AI, personalization and human insight`<br>`working together for you.` |

Icon x-positions: 201–252, 616–654, 974–1019. Text x-starts: 288, 684, 1045.

> Note: deck page 1 renders column 1's body as `…and reflection,.` with a stray period. The
> hero JPEG is clean. **Use the hero JPEG text.**

## 2.3 `SCROLL TO EXPLORE` indicator

Centred horizontally; sits 26 px below the preceding block.
Label: sans 13 px / 600 / `+0.14 em` / uppercase / `blue-ink` #1450DF, cap-height 10 px.
Chevron sits **to the left** of the label with a 22 px gap (not above it).

Three variants across the deck:

| Variant | Where | Description |
|---|---|---|
| **A — bare chevron** | hero JPEG; deck p-1 | 18 × 10 px chevron-down, 2.5 px stroke, `blue-fill`, no container. Chevron x 622–640, label x 654–832 |
| **B — circled chevron** | p-2 | Chevron inside a **36 px** circle: `1px solid #DFE4F2`, fill `#FFFFFF`, `shadow-node`. Chevron stroke `blue-ink` |
| **C — chevron only, stacked below copy** | p-3 | A larger 22 × 12 px chevron-down in `blue-ink`, centred **below** the serif closing line `Start where you are. Move with what you need.` — no label text at all |

## 2.4 `Ask Recharge` affordance

Recurs seven times in five distinct layouts. Catalogue:

| # | Page | Layout | Verbatim copy | Detail |
|---|---|---|---|---|
| 1 | Hero (JPEG) | **Inline meta link** in the trust row, right of a 1 px divider | `Not sure where to start? Ask Recharge →` | 22 px speech-bubble-with-ellipsis outline icon (`ink-400`), 8 px gap, 13 px/400 text. Whole string one link; trailing `→` arrow glyph. Text `ink-500`, `Ask Recharge` not separately coloured here |
| 2 | p-2 | **Full-width banner** | Title `Not sure where to start?` / `Ask Recharge.` · Body `Our AI companion can help you make sense`<br>`of how you feel and find what might help.` · Button `Ask Recharge  →` | Banner x ≈ 190 → 1259, H ≈ 94 px, `radius-card` 20, fill `blue-banner` #F0F3FC. Left: a **62 px** circle (`#DEE9FB`) holding a speech-bubble-with-sparkle icon (`#2B66E7`). Title 22 px/600 `ink-800`; second line `Ask Recharge.` 22 px/600 `blue-ink`. 1 px vertical hairline, then the body at 14 px/400. Right: outlined pill (`1px #6183F2`, fully rounded, ≈ 245 × 62 px) with a 20 px bubble icon + `Ask Recharge` 17 px/500 `blue-ink` + a 20 px `→` |
| 3 | p-3 | **Two-line block, all-blue** | `Questions about the loop?` / `Ask Recharge  →` | **46 px** circle, fill `#EEF2FD`, 1 px `#DAE1FA` ring, 22 px bubble icon `blue-ink`. **Both** lines are blue here: question 13 px/400 `#2B59F0`, link 15 px/600 `blue-ink`, then a 22 px `→` |
| 4 | p-5 | **One-line block with sub-caption** | `How does Recharge become personal? Ask Recharge` / `Website guide` | **46 px** white circle, no ring, bubble icon in **green** `#62B292`. Question 14 px/400 `ink-600`; `Ask Recharge` inline 14 px/500 `blue-ink`; `Website guide` below at 12 px/400 `ink-400` |
| 5 | p-6 | **One-line block** | `Questions about our approach? Ask Recharge  →` | **46 px** circle, `1px solid #A1BDE7` ring, transparent fill, bubble icon `blue-ink`. Question 15 px/400 `ink-600`; `Ask Recharge` 15 px/600 `blue-ink`; 20 px `→` |
| 6 | p-7 | **Footer cluster, right of a divider** | `Not sure which plan fits you?` / `Help Me Choose  →` / `Ask Recharge` | **54 px** circle, `1px #C9D7F5` ring, 26 px bubble icon `blue-ink`. Question 15 px/400 `ink-600`; `Help Me Choose` 19 px/500 `blue-ink` + `→`; `Ask Recharge` beneath at 13 px/400 `ink-400` — here `Ask Recharge` is a **label**, not the link |
| 7 | p-8 | **Two-line block with inline separator** | `Still have a question before you begin?` / `Ask Recharge · Website guide` | **58 px** circle, **1 px gradient ring** (blue #7DB6F9 at top → green #82BEA2 at bottom), transparent fill, 26 px bubble icon `blue-ink`. Question 17 px/500 `ink-800`; `Ask Recharge` 17 px/500 `blue-ink`; ` · ` `ink-400`; `Website guide` 17 px/400 `ink-400` |

**Canonical icon:** a rounded speech bubble with a tail at the lower-left and **three dots**
inside, 2 px stroke, round caps. Variants: p-2 adds a second overlapping bubble + a 4-point
sparkle; p-6/p-7 use a plain (dotless) bubble.

## 2.5 Aurora wave graphics

These will be rebuilt as animated SVG, so this describes them as reproducible geometry. The
clearest reference is the audio waveform inside p-3's player card and the lower-left field of
p-8, both of which were contrast-boosted and inspected at 3×.

### Geometry

A wave field is a **bundle** of near-parallel hairline sine curves:

- **Stroke count per bundle: 28–45.** (Measured: a vertical cut through p-8's lower-left
  bundle at x = 300 crossed ~10 discrete strokes plus a 45 px densely-packed band; the 3×
  contrast-boosted crop resolves ≈ 35 strokes.)
- **Stroke weight: 0.5–1 px**, uniform, no taper, round caps, `fill: none`.
- **Per-stroke opacity: 0.10 – 0.18.** The visible ribbon is produced by *accumulation*, not by
  any single stroke. Individual strokes must stay near-invisible.
- **Bundle envelope:** each stroke is `y = A(x)·sin(k·x + φ_i) + y₀(x)` where `φ_i` advances
  linearly across the bundle (total phase spread ≈ 0.5–0.9 π). This makes the bundle **pinch to
  a bright caustic node** where the strokes converge, and **fan out to a 40–90 px ribbon**
  between nodes. Nodes are the visual signature — reproduce them.
- **Wavelength:** 320–520 px at the 1448 reference. **Amplitude:** 18–45 px, tapering toward
  the bundle's ends so each ribbon dissolves rather than stopping.
- **Bundle length:** always longer than its container — every bundle **bleeds off** at least
  one edge. Never fully contained.
- **Crossing:** 2–3 bundles per section, crossing at shallow angles (8–20°). Where two bundles
  of different hue cross, the hue transitions along the bundle (see p-8's lower band: green
  #A8D4BE on the left → ochre-neutral at the crossing → rose #EE6E9A on the right).

### Colours (measured)

| Hue | Stroke colour | Sampled from |
|---|---|---|
| blue | **#B5C1FB** (peak core #8793A6 where strokes stack) | p-8 (150,640) |
| green / teal | **#A8D4BE** (field reads #E8F1F5) | p-8 (500,690); p-2 reassurance card |
| rose | **#F4C1CF** (field reads #F9EDF4) | p-8 (950,640); p-7 lower-right |
| lavender | **#CBD3F7** | p-2 lower-left |

### Placement per section

| Section | Bundles | Position |
|---|---|---|
| 1 Hero | 2 | (a) blue, lower-left, bleeding off the left and bottom edges beneath the text column, y ≈ 780–840. (b) a large green→rose bundle across the lower-right quadrant, x ≈ 900–1448, y ≈ 560–800, bleeding off the right edge and partly *behind* the translucent trust card |
| 2 Moments | 3 | lavender+green bleeding off the **left** edge at y ≈ 560–680; a faint green bundle inside the top-right reassurance card (bleeding off its right edge); a rose bundle off the **right** edge at y ≈ 560–640 |
| 3 R³ Loop | 3 | green bundle off the bottom-left, x 0–420, y 500–580; rose bundle off the bottom-right, x 900–1107, y 500–600; **plus the waveform inside the player card** (see below) |
| 4 Connected | 2 | very faint blue off the left edge at y ≈ 480–560; rose off the right edge at y ≈ 440–560. Lowest-intensity section |
| 5 Rhythm | 3 | blue off the left edge y ≈ 280–380 and again y ≈ 480–560; a dense rose bundle off the right edge y ≈ 320–480 (the busiest single field in the deck) |
| 6 Trust | 2 | rose+blue across the full bottom edge, y ≈ 700–830, bleeding off left, right and bottom simultaneously |
| 7 Plans | 2 | blue off the lower-left y ≈ 700–830; rose off the lower-right y ≈ 620–830 |
| 8 Final CTA | 3 | **most prominent in the deck.** A blue bundle entering from the left edge at y ≈ 600 rising to y ≈ 560 at x ≈ 500; a green bundle along the bottom, x 0–700; a large rose bundle x 600–1107, y 540–700, bleeding off the right and bottom. All three cross around x ≈ 560, y ≈ 640 |

### The audio waveform (p-3) — a special case

Same primitive, but **symmetric about a horizontal axis** and horizontally bounded:
- Width ≈ 480 px, height ≈ 90 px, ~30 strokes.
- **Three lobes** with **two pinch nodes**: node 1 at ≈ 42 % of the width, node 2 at ≈ 68 %.
- Lobe colours left → right: **blue** #A9BEF2 → **rose** #F06E9A (lobes 2 and 3, the densest and
  most saturated) → **green** #8CC9AE.
- Lobes are lens/spindle shaped — maximum amplitude at the lobe centre, zero at each node.

---

# 3. Per-section specifications

Layout is given as a grid so it survives re-flow. Absolute px are quoted where the value is
load-bearing.

---

## 3.1 Hero — `#hero`

**Source: `First Page.jpeg` (canonical). Deck page 1 is superseded.**

**Eyebrow:** `YOUR PERSONAL WELLBEING COMPANION` — sans 14 px / 600 / +0.16 em / uppercase /
`blue-ink`. x 56 → 444, baseline y 173.

**Headline** (serif 56 px / 400 / 62 px line-height, 5 hard lines as rendered):

```
What if better sleep,
a calmer mind, and
relief from migraine
discomfort were
within reach?
```

Colour mapping: `What if` `ink-900` · `better sleep,` gradient #1663DA→#0F8FCB ·
`a` `ink-900` · `calmer mind,` gradient #0A81B9→#295A9D→#46397E · `and relief from` `ink-900` ·
`migraine` gradient #7A4B81→#C56F97 · `discomfort` #82458C · `were within reach?` `ink-900`.
The trailing comma of `better sleep,` and of `calmer mind,` **is** coloured (it is inside the
gradient run).

**Serif lead** (30 px / 400 / 37 px / `ink-900`), two hard lines:

```
Recharge your body. Calm your mind.
Wake up feeling refreshed.
```

**Sans lead** (20 px / 400 / `ink-600`), one line, 32 px below:

```
Give yourself the rest and recovery you deserve.
```

**CTA row** (42 px below, 25 px gap between buttons):

1. `Try Recharge Free` — filled pill, **225 × 52 px**, `blue-fill`, label 17 px/500 white,
   `shadow-pill`. x 54 → 278.
2. `See How It Works` — outlined pill, **229 × 54 px**, `1px solid border-blue` #B5C0EC,
   transparent fill, label 17 px/500 `blue-ink`, preceded by a **14 px solid right-pointing
   triangle** (play glyph, `blue-fill`) with a 12 px gap. x 303 → 531.

**Trust meta row** (28 px below the CTA row, baseline y 782):

| Item | Icon | Copy (verbatim) | Type |
|---|---|---|---|
| left | 20 px circle-with-check outline, `ink-400`, x 56–76 | `7 days · No credit card required` | 13 px/400 `ink-500` |
| divider | — | — | 1 px × 20 px `hairline-faint`, x 289 |
| right | 22 px speech-bubble-with-dots outline, `ink-400`, x 315–337 | `Not sure where to start? Ask Recharge →` | 13 px/400 `ink-500`, whole string is the link |

Note the separator is a **middle dot `·`**, not a bullet or an en dash.

**Trust strip** — see §2.2. Sits 60 px below the meta row: x 146 → 1308, y 842 → 972.

**Scroll indicator** — variant A (§2.3), centred, 26 px below the trust strip.

### Imagery

A single full-bleed **sunrise-over-water photograph**: a low sun just above a distant mountain
ridge, a broad specular sun-path on calm water, soft haze. Warm amber-peach in the sun zone,
cool blue-grey water at the frame edges.

**Bleed and masking** (measured by column luminance at y = 470):

- Photo occupies roughly **x 380 → 1448, y 0 → 840** — it bleeds off the **right** and **top**
  edges and is cut off above the trust card.
- A **wide horizontal fade** masks its left side: opacity ≈ 0 at x ≈ 420, ≈ 0.45 at x ≈ 560,
  ≈ 0.8 at x ≈ 700, full from x ≈ 1000. Luminance profile at y 470: 248 (x 400) → 238 (520) →
  221 (600) → 205 (1000+).
- A **vertical fade** at the bottom: full opacity to y ≈ 780, fading to 0 by y ≈ 840 — so the
  photo never touches the trust card.
- The top of the frame (y 0 → 200) is the photo's own pale haze, so it reads as page ground; no
  extra mask needed there.
- Sun glow centre ≈ (870, 340); warmest measured pixel #FFE4D6 at (880, 470).

Implementation: absolutely-positioned `<img>` with
`mask-image: linear-gradient(to right, transparent 28%, rgba(0,0,0,.45) 39%, #000 69%)` plus
`linear-gradient(to bottom, #000 72%, transparent 78%)`, `mask-composite: intersect`.

**Text column sits entirely in the unmasked left region** (x 56 → 531) — no text ever overlaps
photo detail. This is the constraint that must survive re-flow.

**Aurora:** two bundles, see §2.5.

**Hero height:** the mockup is 1086 px tall at 1448 wide. Target `min-height: 100vh` with a
`760px` floor; the trust strip and scroll indicator must both be above the fold.

---

## 3.2 Moments — `#moments`

**Eyebrow:** `RECOGNISE YOUR MOMENT` — solid `blue-ink`. *(British spelling — as rendered.)*

**Headline** (serif ≈ 44 px / 50 px line-height), two lines, left-aligned:

```
What do you need right now?
Your moment matters.
```

Line 1 all `ink-900`. Line 2 entirely gradient (`Your` blue → `moment` teal → `matters.` rose).

**Lead** (sans 17 px / 400 / `ink-600`), two hard lines:

```
We all move through different moments. Recognising how you feel
is the first step to finding what can help.
```

### Layout grid

Two-zone header: the eyebrow/headline/lead block occupies the **left ≈ 55 %**; the reassurance
card is pinned to the **top right**. Below, a **single row of six equal cards** spanning the
wide container (≈ 1360 px). Then a full-width banner, then the scroll indicator.

### Top-right reassurance card

Box ≈ **x 908 → 1391, y 154 → 327** (≈ 483 × 173 px), `radius-card` 20, fill `#FEFEFE`,
`shadow-card`. A faint green aurora bundle bleeds off its right edge from inside.

- **46 px** circle, fill `#F6FBF9`, holding a heart-outline icon with a small dot in its centre,
  stroke `green-icon` #62B292, 2 px.
- Title: `It's normal to have ups and downs.` — 17 px/600 `green-ink` #1F8A55.
  *(Rendered with a straight apostrophe; ship the typographic `’`.)*
- Body, two hard lines, 14 px/400 `ink-500`:
  `Recharge is here to support you, wherever`<br>`you are in your day.`

### The six moment cards

Geometry (normalised from p-2): card **≈ 212 × 336 px**, **20 px** gutter, `radius-card` 20,
fill `#FEFEFE`, `shadow-card`. Row spans x ≈ 43 → 1373.

Card anatomy, top to bottom:
1. **Photo**, inset ≈ 5 px on the left/top/right, **≈ 209 × 179 px**, `radius-media` 14.
   Aspect ≈ **7:6**.
2. **Icon circle**, **≈ 64 px**, centred horizontally, **straddling the photo's bottom edge** —
   the circle's top edge is ≈ 24 px *above* the photo's lower boundary (measured overlap
   18 px raw ⇒ ≈ 24 px). Pastel tint fill, 2 px outline icon.
3. **Title**, sans 17 px / 600 / `ink-800`, centred, baseline ≈ 42 px below the circle.
4. **Body**, sans 14 px / 400 / `ink-500`, centred, two hard lines, 25 px baseline pitch.

All six cards are **centre-aligned**. Card bottom padding ≈ 32 px.

| # | Photo subject | Icon | Icon stroke | Circle tint | Title (verbatim) | Body (verbatim) |
|---|---|---|---|---|---|---|
| 1 | Young man at a desk writing beside a laptop, bright window behind | Crosshair / target-reticle (circle + 4 ticks + centre dot) | `#3D80E1` | `#EEF5FD` | `I need to focus` | `I want to be clear,`<br>`productive and in flow.` |
| 2 | Woman reclining on a sofa in a knit throw, eyes closed | Two curved arrows in a refresh loop | `#62B291` | `#EAF5F0` | `I need a reset` | `I feel overwhelmed`<br>`and need to reset.` |
| 3 | Woman outdoors in a green jacket holding a water bottle | Battery, horizontal, low charge | `#E278A7` | `#FBF0F6` | `I'm running low` | `I feel drained and`<br>`need to recharge.` |
| 4 | Man at a table at night, warm lamp, hand at his temple | Crescent moon | `#826FD6` | `#F2F2FC` | `I can't switch off` | `My mind is busy`<br>`and I need to unwind.` |
| 5 | Woman seated indoors, chin on hand, looking away | Atom / orbital rings | `#8576E3` | `#F4F3FC` | `I feel stuck` | `I need a shift in`<br>`perspective.` |
| 6 | Man outdoors at dusk by a lake and mountains | Compass (circle + needle) | `#3D81E3` | `#F0F6FD` | `I want more clarity` | `I'm looking for direction`<br>`and inner clarity.` |

Apostrophes in cards 3, 4 and 6 render as straight quotes; ship `’`.

### Bottom banner

See §2.4 occurrence 2. Sits **48 px** below the card row; then **48 px** to the scroll
indicator (variant B).

---

## 3.3 R³ Loop — `#r3-loop`

**Eyebrow:** `THE R³ RECHARGE LOOP` — solid `blue-ink`, superscript 3.

**Headline** (serif ≈ 44 px): `How Recharge helps` — `How` and `helps` `ink-900`;
`Recharge` carries the full gradient (see §1.2, mapping 3).

**Lead** (sans 17 px / 400 / `ink-600`), two hard lines, with a **mid-sentence weight change**:

```
One connected loop to help you understand yourself,
find what you need and feel better in the moment.
```

`feel better in the moment.` is **600 semibold `ink-800`**; the rest is 400 `ink-600`.

**Second lead** (24 px below), two hard lines, **600 semibold `ink-800`** throughout:

```
There is no fixed starting point.
Start wherever you are.
```

### Layout grid

**Two columns, ≈ 52 / 48**, top-aligned, ≈ 40 px gutter.
Left: copy block, then the loop diagram beneath it.
Right: the `Personalized Recharge Experiences` card, then the Ask Recharge block beneath it.
A centred closing cluster spans the full width beneath both columns.

### Left: the loop diagram

An **ellipse** of connected arcs with four nodes. Normalised geometry:

- Ellipse centre ≈ **(421, 476)**, horizontal radius ≈ **227 px**, vertical radius ≈ **152 px**.
- **Arc stroke ≈ 2.5 px**, drawn as **four coloured segments** that blend at their joins:
  upper-left **blue** #99BFFA · upper-right **green** #9ED3B6 · lower-right **rose** #F3A9BE ·
  lower-left **lavender-to-rose** #C4B0D8 → #F09BB4. The ellipse reads as a continuous loop
  with no arrowheads at the nodes — direction is implied by colour progression only.
- The arcs are **interrupted** where they meet each node circle (the node's white disc masks
  the arc).

**Four nodes**, positioned on/inside the ellipse:

| Node | Position (normalised) | Circle | Icon | Label (micro-eyebrow) | Title | Sub |
|---|---|---|---|---|---|---|
| **RECONNECT** | left, ≈ (194, 382) | **86 px**, fill `#FEFEFE`, `shadow-node` | Person bust outline, 2 px `#164EF3` | `RECONNECT` — 12 px/600/+0.14 em, `blue-ink` | `Personal Insights` — 15 px/600 `ink-800` | `Understand yourself.` — 14 px/400 `ink-500` |
| **You** (centre) | ≈ (441, 445) | **squircle ≈ 136 × 115 px**, `radius-squircle`, fill `#FDFDFD`, `shadow-card` | Person bust outline, 2.5 px `#194BE4` | — | `You` — serif 24 px `ink-900` | inline status pill (below) |
| **REALIGN** | right, ≈ (647, 373) | **86 px**, fill `#FEFEFE`, `shadow-node` | Two overlapping speech bubbles, 2 px `#34AC6C` | `REALIGN` — `green-500` | `AI-guided Coaching` | `Find what you need.` |
| **RECHARGE** | bottom, ≈ (441, 591) | **86 px**, fill `#FFFAFC`, **2 px ring `rose-400`**, plus a soft rose glow halo | Audio waveform bars (5 vertical bars, varying heights + 2 dots), 2.5 px `#F94082` | `RECHARGE` — `rose-400` | `Personalized Recharge Experiences` | `Feel better in the moment.` |

Node labels are stacked **below** each circle, centre-aligned, in the order
`LABEL` → `Title` → `Sub`. RECONNECT's block is left-shifted to clear the ellipse;
REALIGN's is right-shifted.

**Status pill** inside the `You` node, below the `You` title:
box ≈ 106 × 42 px, `radius-pill`, fill `blue-wash` #EDF2FE, two centred lines of
12 px / 500 / `blue-ink`:

```
Right now:
I need a reset
```

### Right: `Personalized Recharge Experiences` card

Box ≈ **x 858 → 1376, y 112 → 628** (≈ 518 × 516 px), `radius-card-lg` 24,
fill `#FDFDFD`, `1px` hairline border, `shadow-card`. Internal padding ≈ 34 px.

1. Micro-eyebrow `RECHARGE` — 12 px/600/+0.14 em, `rose-400` #F31B65.
2. Kicker `Personalized Recharge Experiences` — sans 15 px / 600 / `ink-800`. *(American
   spelling here; contrast with deck page 1 — see §5 note.)*
3. Display `Feel better in the moment.` — serif 31 px / 400 / `ink-900`.
4. Body, two hard lines, 15 px / 400 / `ink-600`:
   `Personalized audio experiences designed`<br>`to support the state you need.`
5. **1 px hairline** `#F0F1F5`, full card width minus padding.
6. Label `Suggested for this moment` — 14 px / 600 / `ink-800`.
7. **Suggested-experience row** — inner card ≈ 440 × 92 px, `radius-inner` 16,
   fill `surface-inner-rose` #FCF4F7:
   - Left: **50 px** circle, fill `#FCEAF0`, refresh-loop icon 2.5 px `#F71C5B`.
   - `Reset` — 17 px / 600 / `rose-400` #F51A62 · ` · ` `ink-400` · `8 min` — 17 px / 500 /
     `ink-800`. Verbatim: `Reset` `·` `8 min`.
   - Body two lines, 14 px / 400 / `ink-500`:
     `A moment to clear some mental noise`<br>`and make space to reset.`
   - Right: **66 px** rose disc (`#FBB5CE` core with a lighter 84 px glow halo) holding a
     **white** 5-bar waveform glyph.
8. **Audio player**, 28 px below:
   - **Play button**: **50 px** filled circle, `#3767E8` (a touch lighter than `blue-fill` —
     ship `blue-fill`), centred white right-pointing triangle 16 px.
   - **Progress track**: 4 px tall, `radius-pill`, `track` #E7E8EC, width ≈ 300 px.
     **Thumb** at 0 %: 12 px `blue-ink` dot flush to the track's left end.
   - **Time**: `0:00 / 8:00` — 14 px / 400 / `ink-500`, tabular figures, right-aligned.
   - **Waveform** below, spanning the card's inner width — see §2.5 "audio waveform".

### Ask Recharge block

§2.4 occurrence 3, sitting ≈ 32 px below the card, left-aligned to the card.

### Closing cluster (full width, centred)

1. A **26 px heart outline**, stroke 2 px `#99A4B5` (neutral grey — *not* rose).
2. Serif 26 px / 400 / `ink-900`: `Start where you are. Move with what you need.`
3. Scroll indicator variant C — a bare 22 × 12 px `blue-ink` chevron-down, no label.

---

## 3.4 Connected — `#connected`

**Eyebrow:** `MORE CONNECTED` — **gradient** (blue → violet → rose), centred.

**Headline** (serif ≈ 44 px / 50 px), **centred**, two hard lines, all `ink-900` (this is the
only section headline with **no** gradient run):

```
Wellbeing support
shouldn't feel fragmented.
```

**Lead** (sans 17 px / 400 / `ink-600`), centred, two hard lines:

```
Recharge brings personal insights, AI-guided coaching and
Recharge Experiences together around you.
```

Note `AI-guided coaching` is lowercase-c here, but `AI-guided Coaching` is capital-C on p-1,
p-3 and p-4's own left stack. **As rendered — do not normalise.**

### Layout grid — a three-zone diagram

A full-width diagram band beneath the centred header, then a full-width bottom strip.
Horizontal zones, left → right:

| Zone | x span (normalised) | Content |
|---|---|---|
| A | 68 → 288 | `FRAGMENTED SUPPORT` label + 3 stacked cards |
| B | 300 → 550 | scatter of small floating mini-cards + connecting curves |
| C | 555 → 880 | centre circular portrait + caption beneath |
| D | 900 → 1390 | large circle containing the Recharge mark + `One connected experience` |

Zones B and the curves are what visually knit A → C → D. The curves are hairline aurora-family
strokes (1 px, opacity ~0.35) in blue, green and rose, fanning from zone A's cards through the
mini-card scatter into the portrait, then re-fanning out of the portrait into zone D.

### Zone A — fragmented stack

- Micro-eyebrow `FRAGMENTED SUPPORT` — 12 px/600/+0.14 em, `ink-400`.
- Sub, two hard lines, 14 px/400 `ink-500`:
  `Help can come from many`<br>`places, but rarely works together.`
- Three cards, ≈ **220 × 88 px** each, 20 px vertical gap, `radius-card` 20, fill `#FEFEFE`,
  `shadow-card`. Each: a **58 px** tinted circle on the left, then a coloured label +
  a grey sub.

| Card | Circle tint | Icon | Icon stroke | Label | Sub |
|---|---|---|---|---|---|
| 1 | `#EDECF6` (lavender) | Circle divided into 3 sectors / pie-radial | `#4A3A9E` (indigo) | `Personal Insights` — 14 px/600 `blue-ink` | `Understand yourself.` |
| 2 | `#E4F3EA` (green) | Single speech bubble | `#1F8A55` | `AI-guided Coaching` — 14 px/600 `green-ink` | `Find what you need.` |
| 3 | `#FBE9EE` (rose) | 5-bar audio waveform | `#E8467C` | `Recharge Experiences` — 14 px/600 `rose-500` | `Feel better in`<br>`the moment.` |

### Zone B — mini-card scatter

**Eight** small floating chips, 28–42 px wide, `radius` 6–8 px, fill `#FEFEFE`,
`shadow-node`, scattered at irregular positions and slight vertical offsets (no grid).
Contents are abstract glyph stand-ins, not real copy: a bar chart, a line chart, three
text-rule lines, a green speech bubble, a sun/asterisk, two more text-rule blocks, a
play triangle, a music note. Interspersed are **6–8 solid dots**, 4–6 px, in blue #3B82F0,
green #3EA876 and rose #E8467C, marking curve endpoints.

### Zone C — centre portrait

Circular photo, **≈ 290 px** diameter: a woman in a light shirt seated indoors by a plant,
looking up and to her right, soft window light. No ring; the circle's edge softly feathers into
the page ground (≈ 8 px feather).

Caption beneath, centred:
1. Serif ≈ 33 px / 38 px, two hard lines: `One person.` / `One connected experience.`
   `One person.` and `One`/`experience.` `ink-900`; `connected` gradient.
2. **2 px gradient rule**, ≈ 46 px wide, centred: `linear-gradient(90deg,#3B82F0,#6ABDB9,#F5538C)`.
3. Sans 15 px / 400 / `ink-500`, centred: `Recharge connects the journey.`

### Zone D — the unified circle

A **≈ 400 px** circle with a **thick soft gradient ring** (≈ 16 px, heavily blurred) running
blue #8FB4E8 (top-left) → green #9ED3B6 (left) → rose #F3B2C4 (right/bottom). Interior is the
page ground (not filled). Contents, centred and stacked:

1. The **Recharge circular mark**, ≈ 78 px.
2. Serif 30 px / 400 / `ink-900`: `Recharge`.
3. Serif ≈ 31 px / 38 px, two hard lines, centred: `One connected` / `experience`
   — `One` and `experience` `ink-900`, `connected` gradient.
4. **2 px gradient rule**, ≈ 46 px.
5. Sans 14 px / 400 / `ink-500`, two hard lines, centred:
   `Insights. Guidance. Experiences.`<br>`Working together around you.`

### Bottom strip — `WHY CONNECTION MATTERS`

Full-width card, ≈ **x 68 → 1380**, H ≈ 125 px, `radius-card` 20, fill `#FEFEFE` at ~70 %
opacity over the ground, `shadow-card`. **Five cells** separated by four 1 px
`hairline-faint` vertical dividers (vertically inset).

Cell 1 is a label cell (no icon); cells 2–5 each have a **44 px** tinted circle + a coloured
title + a grey body.

| Cell | Circle tint | Icon | Stroke | Title | Body (verbatim, line breaks as rendered) |
|---|---|---|---|---|---|
| 1 | — | — | — | `WHY CONNECTION MATTERS` — 11 px/600/+0.14 em `ink-400` | `Support often lives in`<br>`different places.`<br><br>`Recharge brings it`<br>`together around you.` — first 2 lines 13 px/400 `ink-500`; last 2 lines 13 px/**600** `ink-800` |
| 2 | `#E7EFFB` | Magnifying glass | `blue-icon` | `Less searching` — 13 px/600 `blue-ink` | `Insights, guidance and`<br>`experiences in one`<br>`connected place.` |
| 3 | `#E4F3EA` | Target / dartboard with an arrow | `green-ink` | `More relevant` — 13 px/600 `green-ink` | `Support shaped around`<br>`the moment and what`<br>`matters to you.` |
| 4 | `#FBE9EE` | Clock | `rose-500` | `In the moment` — 13 px/600 `rose-ink` | `Start when you need`<br>`support, without waiting`<br>`as you perfect time`<br>`or place.` |
| 5 | `#EFECF6` | Heart outline | `violet-500` | `More personal over time` — 13 px/600 `violet-ink` | `Your experience can`<br>`become more relevant`<br>`as you use Recharge.` |

> **Copy flag.** Cell 4's `as you perfect time or place.` is transcribed verbatim and is
> almost certainly a defect (intended: `…without waiting for the perfect time or place.`).
> Reproduce as-is, but raise it with the copy owner.

No scroll indicator on this section.

---

## 3.5 Rhythm — `#rhythm`

**Eyebrow:** `PERSONAL TO YOUR RHYTHM` — solid `blue-ink`, left-aligned.

**Headline** (serif ≈ 44 px / 52 px), left-aligned, two hard lines:

```
Meets you where you are.
Gets to know your rhythm over time.
```

Line 1 all `ink-900`. Line 2: `Gets to know` and `over time.` `ink-900`;
**`your rhythm`** gradient (blue #0B4DFD → teal #49A3C2 → mauve #736F9B → rose #EB89AC).

**Lead** (sans 17 px / 400 / 28 px, `ink-600`), four hard lines:

```
Your needs can change throughout the day and over time.
Recharge is designed to respond to the moment, learn from
what matters to you, and become more relevant as your
experience continues.
```

### Layout grid

Left-aligned header block (≈ 50 % width), then a **full-width horizontal wavy timeline**, a
centred serif caption, a 3-cell card strip, a centred closing line, and an Ask block.

### The wavy timeline

A single **sine-like path** crossing the full container width, **1.5 px stroke**, drawn as a
left-to-right gradient: blue #A9C6F2 → teal #8CC6C4 → green #A6D4BC → rose #F6B7CC.
Amplitude ≈ 26 px, one full period roughly every 2 nodes; nodes alternate above/below the
path's midline so the line rises and dips between them.

**Six nodes**, x-centres normalised: **182, 400, 616, 820, 1050, 1265**. Two are photo
circles; four are pastel icon circles. Each node has a **small solid dot (8 px)** on the wave
path directly beneath it, in the node's accent colour, connecting the node to the line.

Labels are stacked **below** each node, centre-aligned: a `ink-800` 17 px/600 line, then an
accent-coloured 15 px/500 line.

| # | Node type | Size | Visual | Accent | Label line 1 | Label line 2 |
|---|---|---|---|---|---|---|
| 1 | **Photo circle** | ≈ **122 px** | Woman stretching with arms raised, sitting up in bed, bright window | blue `#3877FD` | `Morning` | `Get Ready` |
| 2 | Icon circle | ≈ **81 px**, fill `#FEFEFE`, `shadow-node` | Laptop, open, front view | blue `blue-icon` | `Work` | `Focus` |
| 3 | Icon circle | ≈ **81 px** | Person's head/bust with 3 small lightning bolts above it (stress) | teal `#5FA6AD` | `Pressure` | `Reset` |
| 4 | Icon circle | ≈ **81 px** | Single lightning bolt | green `green-500` | `Energy Dip` | `Recharge` |
| 5 | **Photo circle** | ≈ **145 px**, with a **2 px rose ring** offset ≈ 5 px | Woman on a sofa holding a mug, plant and lamp behind, evening light | rose `rose-400` | `After Work` | `Unwind` |
| 6 | Icon circle | ≈ **81 px** | Crescent moon with 2 small sparkles | rose `rose-400` | `Night` | `Rest` |

Photo nodes are visually larger than icon nodes — this size contrast is intentional and should
be preserved.

**Centred serif caption** beneath the timeline, ≈ 40 px below:
serif 26 px / 400 / `ink-900`: `Everyday moments, at your own pace.`

### 3-cell card strip

Full-width card ≈ **x 190 → 1276**, H ≈ 120 px, `radius-card` 20, fill `#FEFEFE`,
`shadow-card`, with two 1 px `hairline-faint` vertical dividers (vertically inset).
Each cell: a **62 px circle with a 2 px coloured outline and no fill**, 20 px gap, then a
title + body.

| Cell | Ring / icon colour | Icon | Title | Body |
|---|---|---|---|---|
| 1 | `blue-icon` #3D80E1 | Person bust inside the ring | `Personal to the Moment` — 15 px/600 `ink-800` | `What do you need right now?` — 14 px/400 `ink-500` |
| 2 | `green-icon` #62B291 | Heart outline inside the ring | `Personal to You` | `Your preferences, patterns`<br>`and responses.` |
| 3 | `rose-400` #F5538C | Bar chart with an upward arrow | `More Personal Over Time` | `The experience can evolve`<br>`with you.` |

### Closing

1. Centred sans 17 px / 400 / `ink-800`: `No two people are the same. No two moments are either.`
2. §2.4 occurrence 4 (green-icon Ask block), centred, ≈ 28 px below.

---

## 3.6 Trust — `#trust`

Nav active state: **`Trust & Approach` underlined** (see §2.1).

**Eyebrow:** `TRUST & APPROACH` — **gradient** (green → sky → mauve → rose → violet → blue),
left-aligned. See §1.2.

**Headline** (serif ≈ 47 px / 54 px), left-aligned, two hard lines:

```
Support you can trust,
every step of the way.
```

Line 1 — serif **roman**, `ink-900`.
Line 2 — serif ***italic***, fully gradient (#3F92D7 → #69A39A → #E25B84 on `way.`).
This is the only italic in the deck.

**Lead** (sans 17 px / 400 / 28 px, `ink-600`), two hard lines:

```
Recharge is built around care, clarity and
clear boundaries. Here's what that means for you.
```

*(Rendered with a typographic `’` in `Here's` — the only place the deck gets this right.)*

### Layout grid

**Two columns, ≈ 46 / 54**, top-aligned. Left: eyebrow + headline + lead. Right: portrait photo
with an arc drawn over it. Below both, a **4-up equal card row** spanning the 1152 px
container. Then a centred closing cluster.

### Right: portrait + arc

- **Photo**: rectangular, bleeding off the **top** and **right** edges of the section, occupying
  roughly x 700 → 1448, y 90 → 530 at the reference width. Subject: a woman in a cream cable-knit
  sweater sitting on a pale sofa holding a mug in both hands, looking up and to her left; a
  bookshelf, framed picture and plants behind, warm daylight. Its lower edge is masked by a
  soft vertical fade (full at y ≈ 480, transparent by y ≈ 530) so it dissolves into the card row.
- **Arc**: a single open semicircular arc drawn **over** the photo, opening downward.
  Normalised: endpoints at **(702, 449)** and **(1373, 447)**, apex at **(1037, 122)** —
  i.e. radius ≈ 340 px, centre ≈ (1037, 450), spanning ≈ 180°.
  **Stroke ≈ 3 px**, gradient along its length: **green #82BEA2** at the left terminus →
  **sky #82B6D4** → **blue** at the apex → **rose #FAAFB0** at the right terminus.
  Each terminus is capped with a **10 px solid dot** — left dot `#82BEA2`, right dot `#FAAFB0`.

### 4-up trust cards

Four **equal** cards, ≈ **287 × 366 px** each, **24 px** gutter, spanning the 1152 px container.
`radius-card-lg` 24, fill `#FEFEFE`, `shadow-card`, internal padding 28 px.
All **left-aligned** (unlike the moment cards). Card 3 is visually taller by one line of accent
copy — cards should stretch to equal height (`align-items: stretch`).

Card anatomy: **58 px** tinted circle with a 2 px outline icon → 30 px gap → title
(sans 17 px / 600 / `ink-800`, up to 2 hard lines, 26 px line-height) → 24 px gap → body
(sans 14 px / 400 / `ink-500`, 22 px line-height) → optional accent line.

| # | Circle tint | Icon | Stroke | Title (verbatim, hard line breaks) | Body (verbatim, hard line breaks) | Accent line |
|---|---|---|---|---|---|---|
| 1 | `green-tint-100` #E8F4ED | A heart whose lower half becomes two clasped/shaking hands | `#1F8A55` | `Support, not diagnose.` | `Recharge supports everyday`<br>`wellbeing and personal reflection.`<br>`It is not intended to diagnose,`<br>`treat or cure medical or mental`<br>`health conditions, and it does not`<br>`replace professional care when`<br>`that is needed.` | — |
| 2 | `violet-tint-100` #F0ECF4 | Human head profile with a brain outline inside | `violet-ink` #6C4FA6 | `AI that guides,`<br>`not defines you.` | `AI can help you reflect, explore`<br>`perspectives and consider`<br>`possible next steps.`<br>`You remain in control of`<br>`your choices.` | — |
| 3 | `rose-tint-100` #FBEAEB | Person bust with a small heart at the lower right | `rose-ink` #E12A5E | `Personalization`<br>`with purpose.` | `Recharge is designed to become`<br>`more relevant through the`<br>`information, choices and`<br>`interactions that matter to`<br>`your experience.` | `More relevant, not more intrusive.` — 14 px/**600** `rose-ink` #EB2655, 24 px above the card's lower padding |
| 4 | `blue-tint-100` #E6EEF7 | Shield with a padlock inside | `blue-icon` #2F7EDD | `Privacy`<br>`deserves care.` | `Personal wellbeing can involve`<br>`information that matters to you.`<br>`Recharge approaches privacy,`<br>`data and user control`<br>`thoughtfully and transparently.` | — |

Note card 2's body has a **paragraph break** between `possible next steps.` and
`You remain in control of` (a blank-line gap of ~6 px in the render, not a full paragraph
space). Same in card 1 between the title and body (a ~14 px extra gap vs the other cards).

### Closing cluster (centred)

1. Sans 15 px / 400 / `ink-600`: `Recharge is designed to support you with care, clarity and respect.`
2. Serif 26 px / 400 / `ink-900`, 16 px below: `Trust should be part of the experience.`
3. §2.4 occurrence 5, 24 px below.

A strong two-bundle aurora runs across the full bottom edge (see §2.5).

---

## 3.7 Plans — `#plans`

Nav active state: **`Plans` underlined**.

**Eyebrow:** `FREE TRIAL & PLANS` — solid `blue-ink`, **centred**.

**Headline** (serif ≈ 47 px), centred, one line:
`Choose the Recharge that fits you.`
`Choose the Recharge that` `ink-900`; **`fits you.`** gradient (teal → violet → rose).

**Lead** (sans 17 px / 400 / `ink-600`), centred, one line:
`Try Recharge free for 7 days, then choose the level of support that feels right for you.`

### 7-day free-trial banner

Full-width within the 1152 px container: ≈ **x 192 → 1236, y 275 → 462** (≈ 1044 × 187 px),
`radius-card-lg` 24, fill `blue-banner-faint` #F8F9FC, `1px` faint blue border, no shadow.
Internal padding ≈ 36 px.

**Three-part row**, vertically centred:

1. **Icon** — a **78 px** circle, `1px solid #C9D7F5`, fill `#FFFFFF`, holding a calendar
   glyph with a check mark inside, 2 px stroke `#0347EA`.
2. **Copy block** (left-aligned, 42 px gap from the icon):
   - Micro-eyebrow `7-DAY FREE TRIAL` — 12 px/600/+0.14 em `blue-ink`.
   - Display `Try Recharge Free` — serif **34 px** / 400 / `ink-900`.
   - Body, three hard lines, 14 px/400 `ink-500`:
     `Experience Personal Insights, AI-guided Coaching`<br>`and Recharge Experiences together before`<br>`choosing a plan.`
3. **CTA block** (right-aligned):
   - `Try Recharge Free` — filled pill ≈ **276 × 62 px**, `blue-fill`, label **serif 22 px /
     400 / white**. *(Note: this is the one button in the deck with a **serif** label — the
     hero and nav CTAs are sans. Reproduce as rendered.)*
   - Beneath, 12 px below: `7 days · No credit card required` — 13 px/400 `ink-400`,
     right-aligned.

### Three pricing cards

Three cards in a row within the 1152 px container, ≈ **20 px** gutter.
Measured (normalised): Essential ≈ **353 px**, Rhythm ≈ **366 px**, Plus ≈ **377 px** wide.
**Ship three equal ≈ 364 px columns**; the width differences are render artefacts.
Height ≈ **392 px** for Essential/Plus.

| | Essential | Rhythm | Plus |
|---|---|---|---|
| Fill | `surface-card-warm` #FDFCFA | `surface-card-elevated` #FFFFFF | `surface-card-warm` #FDFCFA |
| Border | none (or 1 px `hairline`) | **`1px solid border-blue-strong` #A3ACE9** | none |
| Shadow | `shadow-card` | `shadow-card-elevated` | `shadow-card` |
| Elevation | flat | **`translateY(-6px)` and ~6 px taller** (measured top 373 vs 376, bottom 673 vs 670 raw) | flat |
| Badge | — | **`Most popular`** | — |
| Radius | `radius-card-lg` 24 | 24 | 24 |
| Padding | 28 px | 28 px | 28 px |

**`Most popular` badge** — a small centred pill at the top inside the Rhythm card,
≈ **92 × 22 px**, `radius-pill`, fill `#F2F6FF` (pale blue), label
**12 px / 500 / `blue-ink`**. Sits ≈ 14 px below the card's top edge, horizontally centred.

**Card anatomy** (all three):

1. **Header row**: a **62 px** tinted circle on the left holding a 2.5 px outline icon;
   24 px gap; then a right block with the plan name (**serif 30 px / 400 / `ink-900`**) and a
   tagline (**sans 14 px / 400 / `ink-500`**) beneath it.
2. **1 px `hairline` #E6E8EC divider**, full inner width, 24 px below the header.
3. **`Price coming soon`** — sans 15 px / 400 / `ink-500`, **centred**, 20 px below the divider.
4. **Feature list** — four rows, 32 px row pitch, 24 px below the price line. Each row: an
   **18 px circle-with-check outline** icon (2 px stroke) + 14 px gap + a
   **sans 15 px / 400 / `ink-600`** label. Left-aligned.
5. **CTA** — a full-inner-width **outlined pill**, ≈ **48 px** tall, `radius-pill`,
   transparent fill, 1 px border, label **17 px / 500**, centred. 28 px below the last
   feature row.

| | Essential | Rhythm | Plus |
|---|---|---|---|
| Icon | **5-point star**, outline | **Two stacked horizontal wave/tilde lines** (`≈`), outline | **Plus sign** (`+`), two crossed strokes |
| Icon stroke | `#E22D60` (rose) | `#45946E` (green) | `rose-ink` #E12A5E |
| Circle tint | `#FDEEF0` | `#EDF4EF` | `#FDEEF0` |
| Name | `Essential` | `Rhythm` | `Plus` |
| Tagline | `Start simply.` | `Build an ongoing rhythm.` | `Go deeper with more support.` |
| Price | `Price coming soon` | `Price coming soon` | `Price coming soon` |
| Check colour | `rose-500` #E8567D | `green-500` #4D8D74 | `rose-500` #E8567D |
| Feature 1 | `Core Personal Insights` | `Expanded Personal Insights` | `Deeper Personal Insights` |
| Feature 2 | `AI-guided Coaching for lighter use` | `More AI-guided Coaching` | `Highest Coaching access` |
| Feature 3 | `Core Recharge Experiences` | `Wider Recharge Experience access` | `Full Recharge Experience access` |
| Feature 4 | `Essential personalization` | `Personalization that grows with your use` | `Extended personalization` |
| CTA label | `Choose Essential` | `Choose Rhythm` | `Choose Plus` |
| CTA border | `border-rose` #EB8BA5 | `border-blue-cta` #6B8BEC | `border-rose` #EB8BA5 |
| CTA label colour | `#E92758` → **ship `rose-ink` #E12A5E** for AA | `blue-ink` #0E4AE7 | `#E92758` → ship `rose-ink` |

Note `Recharge Experiences` (plural) in Essential vs `Recharge Experience access` (singular)
in Rhythm/Plus — **as rendered**.

### Footer row

A single centred row ≈ 44 px below the cards, with a 1 px `hairline-faint` vertical divider
separating the two halves:

1. **Left**: `Compare all features` — sans 17 px / 500 / `blue-ink`, followed by a 20 px `→`
   arrow glyph with a 14 px gap.
2. **Divider**: 1 px × 44 px `hairline-faint`.
3. **Right**: §2.4 occurrence 6 — a 54 px bubble circle, then
   `Not sure which plan fits you?` (15 px/400 `ink-600`) /
   `Help Me Choose  →` (19 px/500 `blue-ink` + arrow) /
   `Ask Recharge` (13 px/400 `ink-400`).

**Disclaimer**, centred, ≈ 44 px below the footer row:
`Working plan details. Names, prices and usage limits to be confirmed.`
— sans 15 px / 400 / `ink-500`.

---

## 3.8 Final CTA — `#start`

**Eyebrow:** `START YOUR RECHARGE` — solid `blue-ink`, left-aligned, +0.16 em.

**Headline** (serif ≈ 60 px / 66 px — the largest type in the deck after the hero),
left-aligned, two hard lines:

```
Start where
you are.
```

`Start where` `ink-900`. `you are.` fully gradient — measured letter by letter:
`y` #4D8EFB, `o` #5692FC, `u` #639EFB → `a` #79C3AE, `r` #A7BDB3/#C2B1B2, `e` #F290AB,
`.` #F89BB6.

**Lead** (sans 19 px / 400 / 28 px, `ink-600`), two hard lines:

```
Try Recharge for yourself and
discover what works for you.
```

**Primary CTA** (32 px below): `Try Recharge Free` — filled pill,
≈ **333 × 62 px** (larger than the hero's), `blue-fill`, `radius-pill`,
label **sans 19 px / 500 / white**, `shadow-pill`.

**Meta line** (20 px below): `7 days  ·  No credit card required` — 15 px / 400 / `ink-400`.
Rendered with wide spaces around the middle dot (≈ 8 px each side).

**Secondary link** (20 px below): `Explore Plans` — 15 px / 500 / `blue-ink` + a 20 px `→`
arrow, 12 px gap.

**Ask Recharge block** (44 px below): §2.4 occurrence 7 — a **58 px** circle with a **1 px
gradient ring** (blue #7DB6F9 top → green #82BEA2 bottom), transparent fill, 26 px bubble
icon, then:
- `Still have a question before you begin?` — 17 px / 500 / `ink-800`
- `Ask Recharge` (17 px/500 `blue-ink`) ` · ` (`ink-400`) `Website guide` (17 px/400 `ink-400`)

### Layout grid

**Two columns, ≈ 42 / 58.** Left: the text column, x 105 → 560, vertically centred.
Right: the arc-framed portrait.

### Right: arc-framed portrait

- **Photo**: a woman in loose cream linen sitting cross-legged in a meditative pose, hands in
  her lap, looking up and to her left; behind her a calm lake, distant mountains and a hazy
  low sun. Bleeds off the **bottom** edge and softly feathers at the top; occupies roughly
  x 700 → 1310, y 150 → 738+ at the reference width.
- **Arc**: a near-complete **open ring**, centre ≈ **(1033, 451)**, radius ≈ **305 px**,
  stroke ≈ **6 px**, drawn from roughly 200° clockwise through the top to 340° —
  i.e. **open at the bottom**, with a ≈ 70° gap.
  Gradient along its length: **blue #7DB6F9** (lower-left terminus) → **sky #92C9D0** →
  **teal #7ACBB7** (apex) → **rose #FAAEC1** (lower-right terminus). Both termini taper/fade.
  Three small solid rose dots (4–6 px) trail off beyond the lower-right terminus at roughly
  (1250, 641), (1235, 671), (1258, 654) — a deliberate "dissolving" flourish.
- The ring crosses **in front of** the photo at the top and **behind** the aurora at the bottom.

**Aurora**: the most prominent in the deck — three crossing bundles across the whole lower
half (see §2.5, section 8).

---

# 4. Responsive intent

Mockups are desktop-only at ~1448 px. Breakpoints:
**`sm` < 640 · `md` 640–1023 · `lg` 1024–1279 · `xl` ≥ 1280.**
Type scales down by a factor of ~0.78 at `md` and ~0.60 at `sm` for display sizes; body type
floors at 15 px and never goes below it.

## 4.1 Global

| Element | Tablet (~768) | Mobile (~390) |
|---|---|---|
| Container padding | 32 px | 20 px |
| Container max-width | 100% | 100% |
| Section vertical padding | 88 px | 64 px |
| H1 (56 px) | 40 px / 1.14 | 34 px / 1.16 |
| H2 (44 px) | 34 px / 1.18 | 28 px / 1.2 |
| Serif lead (30 px) | 24 px / 1.3 | 21 px / 1.35 |
| Body (17 px) | 16 px / 1.6 | 16 px / 1.6 |
| Body small / card body (14 px) | 14 px | 14 px |
| Caption (13 px) | 13 px | 13 px (never smaller) |
| Eyebrow (14 px) | 13 px / +0.16 em | 12 px / +0.14 em |
| Button label | 16 px | 16 px |
| Button height | 52 px | 52 px (full-width) |
| Card radius | 20 px | 16 px |

**Nav → hamburger at `< 1024`.** The nav item row (5 items + 2 pills) needs ≈ 990 px and
collides below that.
- `md`/`sm`: logo left; a 44 × 44 px hamburger button right. `Sign In` and
  `Try Recharge Free` move **into** the drawer. Header height 72 px (mobile) / 88 px (tablet).
- Drawer: full-screen overlay, `surface-translucent` + `backdrop-blur(20px)`, nav items
  stacked at 22 px / 500 / `ink-800` with 28 px pitch, then a 1 px `hairline`, then the two
  pills full-width stacked (outlined `Sign In` above filled `Try Recharge Free`).
- The **active-nav underline becomes a 3 px left bar** in the drawer (a centred underline
  reads wrong on a left-aligned stacked list).

**All two-column sections collapse to one column, text first, imagery second**, with the
imagery losing its bleed and becoming a contained, rounded block. Exception: §3.8, where
the portrait is the emotional payload — keep it, full-bleed, *below* the text.

## 4.2 Per section

### 1 Hero
- **Tablet:** text column full-width (32 px padding). The photo moves **behind** the whole
  hero at `opacity: 0.5` with a top-to-bottom mask, so the text stays legible; the left-side
  horizontal mask is dropped. Headline breaks to 6–7 lines — accept it; do not re-write.
- **Mobile:** same, `opacity: 0.4`. Both CTAs become **full-width stacked pills**, 12 px gap.
  The meta row stacks into two rows, left-aligned, divider removed.
- **Trust strip:** 3 columns → 1 column at `sm`, 3 rows separated by **horizontal** 1 px
  hairlines (rotate the dividers). At `md` keep it as 3 columns only if ≥ 700 px available,
  otherwise stack. Each row becomes icon-left / text-right at 40 px icon size.
- **Scroll indicator:** drop below `md` — it costs vertical space and adds nothing on touch.

### 2 Moments
- **6-card row →** at `lg` **3 × 2 grid**; at `md` **2 × 3 grid**; at `sm` a
  **horizontal scroll-snap carousel**.
  **Decision: carousel on mobile, not a 2-column grid.** Rationale: a 2-col grid at 390 px
  gives ~170 px cards, which forces the two-line body to four lines and shrinks the photo below
  its 7:6 aspect usefulness; the carousel preserves the card's designed proportions and the
  icon-straddling-photo detail, which is the section's signature.
  Carousel spec: `scroll-snap-type: x mandatory`, card width `76vw` (max 300 px),
  16 px gap, 20 px leading/trailing scroll padding, `scroll-snap-align: center`,
  scrollbar hidden, plus a row of 6 **6 px dot indicators** (active = `blue-fill`,
  inactive = `#D6DCE8`) centred 20 px below. Overflow must be visible so cards peek.
- **Reassurance card:** moves from the top-right to **directly beneath the lead**, full-width,
  at `< lg`.
- **Bottom banner:** at `md` the 3 zones become 2 rows (title+body row, then a full-width
  button). At `sm` all three stack; the vertical hairline is dropped; the button goes
  full-width.

### 3 R³ Loop
- **Two columns → stacked** at `< lg`: copy, then the loop diagram, then the player card.
- **Loop diagram** at `md`: keep the ellipse but shrink to ~480 px wide and move the
  RECONNECT/REALIGN label blocks **below** their nodes (they currently sit outside the ellipse).
- **Loop diagram at `sm`: abandon the ellipse.** Render as a **vertical stack of 4 nodes**
  connected by short vertical gradient connectors (2 px, 40 px tall, the same 4-segment
  colour progression top→bottom). Order: `You` (with its status pill) first, then RECONNECT,
  REALIGN, RECHARGE. Each node becomes a horizontal row: 64 px circle left, label block right,
  left-aligned. This preserves the loop's *sequence and colour semantics* without a diagram
  that cannot survive 350 px.
- **Player card:** full-width. The suggested-experience row stacks its right-hand rose disc
  below the text at `sm`, or drops it (decorative). Progress track goes fluid; `0:00 / 8:00`
  moves below the track at `sm`.
- **Waveform:** keep — it is the section's motion anchor. Reduce to ~20 strokes at `sm`.

### 4 Connected
- The 4-zone diagram **cannot reflow**. At `< lg` replace it with a **vertical narrative**:
  1. `FRAGMENTED SUPPORT` label + the 3 stacked cards (already vertical — keep as-is, full-width).
  2. A short **vertical gradient connector** (2 px, 56 px, blue→rose) in place of the curve fan.
  3. The centre circular portrait, 240 px, centred, + its caption.
  4. Another vertical connector.
  5. The unified circle, 300 px, centred, contents unchanged.
- **Drop entirely below `lg`:** the mini-card scatter, all connecting curves, and all the
  endpoint dots. They are pure decoration and unreadable at small sizes.
- **Bottom strip:** 5 cells → at `md` a 2-column grid with the label cell spanning both;
  at `sm` a single column with 1 px horizontal hairlines between cells.

### 5 Rhythm
- **The horizontal wavy timeline goes vertical at `< lg`.**
  Spec: a **vertical** sine path down the **left** edge of the content (x ≈ 36 px),
  1.5 px, the same top-to-bottom gradient, amplitude 18 px, one period per 2 nodes.
  Nodes sit on the path, alternating their horizontal offset by ±14 px. Each node becomes a row:
  circle on the path, label block to its right, left-aligned, 64 px row pitch.
  Node sizes: photo nodes 88 px, icon nodes 60 px.
  At `sm`, drop the sine to a **straight 1.5 px vertical gradient rail** — a sine at 390 px
  reads as a rendering error.
- **3-cell strip:** 3 columns → 1 column at `< md`, horizontal hairlines between cells.
- **Closing line + Ask block:** left-align at `sm` (they are centred at desktop).

### 6 Trust
- **Two columns → stacked**; the portrait moves below the lead, becomes a contained
  `radius-card-lg` block at 16:10, losing its top/right bleed.
- **The arc**: at `md` keep it but redraw as a shallower arc over the contained photo.
  **At `sm` drop the arc entirely** — a 180° arc over a 350 px photo dominates the composition
  and its gradient becomes indistinguishable.
- **4-up cards →** `lg` 2 × 2 · `md` 2 × 2 · `sm` 1 column. Cards keep left alignment.
  Card 1's long body (7 lines) is acceptable at 1 column.

### 7 Plans
- **Trial banner:** 3-part row → at `md` two rows (icon+copy, then the CTA block full-width,
  left-aligned). At `sm` the icon circle shrinks to 56 px and sits **above** the copy; the CTA
  goes full-width; the meta line left-aligns. The banner's serif button label drops to 19 px.
- **3 pricing cards →** at `md` **1 column, Rhythm first** (so the recommended plan is seen
  first), then Essential, then Plus. At `lg` keep 3 across if ≥ 1024 px; the cards get tight but
  hold.
- **Rhythm's `translateY(-6px)` elevation is dropped when stacked** — it reads as a
  mis-alignment. Keep the blue border, the badge, and the stronger shadow.
- **Footer row:** the vertical divider becomes a horizontal one; `Compare all features` above,
  the Ask cluster below, both centred at `md`, left-aligned at `sm`.

### 8 Final CTA
- **Two columns → stacked**, text first. The portrait stays **full-bleed** and sits below,
  cropped to 4:5 on mobile, anchored to the subject's face (`object-position: 50% 28%`).
- **The ring arc:** keep at `md` (scaled to ~230 px radius); **drop at `sm`** — replace with a
  single 2 px gradient arc across the top of the photo, 120° only, so some of the motif survives.
- The trailing rose dots are dropped below `lg`.
- **CTA goes full-width.** `Explore Plans →` and the Ask block stack, left-aligned.
- **Aurora:** keep 2 of the 3 bundles at `md`, 1 at `sm`, at half stroke count.

## 4.3 Decorative elements: drop matrix

| Element | `lg` | `md` | `sm` |
|---|---|---|---|
| Aurora bundles | all | −1 per section, half stroke count | 1 per section max, ~15 strokes, only on hero + §8 |
| Hero photo left-fade mask | keep | replace with a global opacity + top mask | same |
| Decorative arcs (§6, §8) | keep | keep, scaled | **drop** (§6) / reduce to 120° (§8) |
| §4 mini-card scatter + curves | keep | **drop** | **drop** |
| §4 endpoint dots | keep | **drop** | **drop** |
| §5 sine path | keep (horizontal) | vertical sine | **straight rail** |
| §3 loop ellipse | keep | shrink | **vertical stack** |
| §8 trailing rose dots | keep | **drop** | **drop** |
| Scroll indicators | keep | keep on hero only | **drop all** |
| Gradient text | keep everywhere | keep | keep (the identity depends on it) |
| Icon-straddling-photo overlap (§2) | keep | keep | keep — signature detail |
| `backdrop-filter` on the trust strip | keep | keep | **drop to `rgba(255,255,255,0.92)` solid** — blur is expensive on mobile GPUs and the photo behind it is already faded |

---

# 5. Motion opportunities

House rules for every animation below:
- **Transform and opacity only.** Never animate `width`, `height`, `top`, `left`,
  `background-position`, `box-shadow` or `filter` on scroll.
- Default easing: **`cubic-bezier(0.22, 1, 0.36, 1)`** (a gentle decelerating ease-out) for
  entrances; **`cubic-bezier(0.4, 0, 0.2, 1)`** for state changes.
- Scroll triggers fire at **`rootMargin: '0px 0px -18% 0px'`, `threshold: 0.15`**, and
  **fire once** (no re-animation on scroll-up).
- Every element's *final* state is its resting state; nothing is left in a transformed state.
- `prefers-reduced-motion: reduce` handling is specified per item. Where it says
  "**render final state**", the element must be fully visible and correctly positioned with
  **no** transition — not merely a shortened one.

| # | Name | Trigger | Properties | Duration | Easing | Reduced-motion |
|---|---|---|---|---|---|---|
| 1 | **Section entrance (staggered reveal)** | scroll into view | `opacity 0→1`, `translateY 16px→0` | 520 ms | ease-out above | **Render final state.** |
| 2 | **Eyebrow → headline → lead cascade** | with #1 | same, children staggered **70 ms** apart, max 5 children | 520 ms each | ease-out | Render final state |
| 3 | **Moment card grid reveal** | scroll into view | `opacity 0→1`, `translateY 20px→0`, `scale 0.985→1` | 480 ms | ease-out | Render final state |
| 4 | **Moment card stagger** | with #3 | stagger **60 ms** left→right; total ≤ 360 ms for 6 cards | — | — | Render final state |
| 5 | **Icon circle pop** | 140 ms after its card's #3 | `scale 0.86→1`, `opacity 0→1` | 320 ms | `cubic-bezier(0.34,1.3,0.64,1)` (slight overshoot) | Render final state |
| 6 | **Aurora drift** | on mount, **infinite** | per-bundle `translateX` ±2.5 % and `translateY` ±1.2 %, each bundle with a different period and a phase offset | **38–56 s per bundle** (deliberately slow; must never read as "moving") | `linear` | **Freeze.** Render static. |
| 7 | **Aurora fade-in** | scroll into view | `opacity 0→1` | 1200 ms | `linear` | Render final state |
| 8 | **Audio waveform pulse** | scroll into view, then **infinite** | per-lobe `scaleY 0.88 ↔ 1.12`, transform-origin centre; lobes phase-offset by 1/3 period | **2.8 s** loop | `ease-in-out` | **Freeze at `scaleY: 1`.** |
| 9 | **Audio progress demo** | once, on the player entering view | thumb `translateX 0→100%` of the track, track fill via a `scaleX` pseudo-element; time label steps `0:00 → 8:00` | 4 s, then reset and hold at 0 | `linear` | **Do not animate.** Hold `0:00 / 8:00`. |
| 10 | **Loop diagram arc draw** | scroll into view | `stroke-dashoffset` full→0 on the 4 arc segments, sequenced RECONNECT → REALIGN → RECHARGE → back | 1400 ms total, segments overlapping by 30 % | `ease-in-out` | **Render arcs complete.** |
| 11 | **Loop node pop** | each node fires when its incoming arc reaches it | `scale 0.9→1`, `opacity 0→1` | 300 ms | slight-overshoot curve from #5 | Render final state |
| 12 | **Loop status pill** | 200 ms after the `You` node | `opacity 0→1`, `translateY 6px→0` | 280 ms | ease-out | Render final state |
| 13 | **Section 6 / 8 arc draw** | scroll into view | `stroke-dashoffset` full→0, plus the terminus dots fading in at 85 % progress | 1100 ms | `ease-in-out` | Render final state |
| 14 | **Rhythm timeline draw** | scroll into view | `stroke-dashoffset` on the sine path, then the 6 nodes pop in sequence as the line passes each | 1600 ms path + 6 × 260 ms nodes | `ease-in-out` / overshoot | **Render final state.** |
| 15 | **Gradient headline reveal** | with #1 | **`opacity` and `translateY` only** on the whole text node | 560 ms | ease-out | Render final state |
| 16 | **Button hover** | pointer hover | `translateY 0→−1px`, `box-shadow` **swapped via a pseudo-element's `opacity`** (not animated directly) | 180 ms | ease-out state curve | **Keep.** Hover feedback is an affordance, not decoration — but drop the `translateY`, keep only the shadow/opacity change. |
| 17 | **Button press** | `:active` | `scale 1→0.985` | 90 ms | `ease-out` | Keep (90 ms is below the motion-sensitivity threshold) |
| 18 | **Outlined-pill hover** | pointer hover | border colour and label colour step one shade darker; background `opacity 0→0.06` on a tinted pseudo-element | 180 ms | ease-out | Keep |
| 19 | **Link arrow nudge** | hover on any `→` link | arrow `translateX 0→3px` | 180 ms | ease-out | **Drop.** |
| 20 | **Nav underline slide** | active-route change / hover | the bar's `transform: translateX + scaleX` between items | 260 ms | ease-out state curve | **Drop the slide; snap the bar.** |
| 21 | **Scroll-indicator chevron hint** | on mount, infinite | `translateY 0 → 4px → 0` | 2.2 s loop | `ease-in-out` | **Freeze.** |
| 22 | **Card hover lift** (moment cards, plan cards) | pointer hover | `translateY 0→−4px`; shadow swap via pseudo-element opacity | 200 ms | ease-out | Drop the lift; keep the shadow change |
| 23 | **Photo parallax** | scroll | hero photo `translateY` at 0.12× scroll rate, clamped to ±40 px | scroll-linked | `linear` | **Drop entirely.** |

## Explicitly do NOT animate

- **The gradient itself.** Never animate `background-position` on a `background-clip: text`
  gradient — it repaints the text layer every frame and produces visible fringing on
  sub-pixel-antialiased serif glyphs. Gradients are static; only the text node's opacity and
  position move (#15).
- **Counting up `Price coming soon`, or any number.** There are no numbers to count.
- **The `7-day free trial` banner.** It is the conversion surface; it appears with the section
  (#1) and then holds still.
- **The trust strip.** It carries the medical/privacy disclaimer. It must be readable the
  instant it is on screen — fade it with the hero on mount, never on scroll, and never stagger
  its three columns.
- **`backdrop-filter`.** Never transition or animate it. Set it once.
- **The Recharge logo mark.** No rotation, no swirl animation. It is a trust mark.
- **Anything on `:hover` for touch devices.** Gate #16, #18, #19, #22 behind
  `@media (hover: hover) and (pointer: fine)`.
- **More than one infinite loop visible at a time.** #6, #8 and #21 must not co-occur in the
  viewport; #21 is dropped on any section that also shows #8.
- **Scroll-jacking, scroll-driven pinning, or horizontal scroll hijack** anywhere.

---

# Appendix A — Deck page 1 (superseded hero variant)

Recorded because it is the only place the deck shows the **product UI**, and because its copy
reveals a spelling inconsistency that must be resolved before build.

**Headline:** `Feel better now.` / `Learn what works for you over time.`
(line 1 `ink-900`; line 2 gradient across `Learn what works for you over time.`)

**Lead:** `Recharge brings personal insights, AI-guided coaching and personalized experiences
together in one connected wellbeing experience. It meets you where you are and getts to know
your rhythm over time.`
> **Two defects:** `getts` (typo for `gets`) and a run-on final sentence. Do not reuse.

**Centre:** a circular ring around a photo of a woman seated cross-legged, with three labelled
nodes on the ring — `Understand yourself` (person icon, blue, top-left),
`Find what you need` (speech bubbles, green, top-right),
`Feel better in the moment` (waveform, rose, bottom-centre).

**Right: app UI mockup** — a phone-frame card, ≈ 285 × 480 px, `radius-card-lg`, `shadow-card`:
- Header: `Good morning, Jamie ☀️` (sans 17 px/600 `ink-800`) with a bell and a person icon top-right.
- Row: `How are you feeling right now?` (14 px/400 `ink-500`) + a `Check In` outlined pill
  (`blue-ink` label, `border-blue`).
- Three tinted cards, each with a title, a 2-line body, an outlined button, and a large
  translucent glyph on the right:
  1. fill `#EDF3FD` · title `Personal Insights` (`blue-ink`) · `Understand what's happening`/`for you in this moment.` · button `View Insight` · glyph: a blue person bust.
  2. fill `#EBF6EF` · title `AI-guided Coaching` (`green-ink`) · `Explore, reflect and find`/`possible next steps.` · button `Start Coaching` · glyph: a green speech bubble with three dots.
  3. fill `#FCEEF2` · title `Recharge Experiences` (`rose-ink`) · **`Personalised audio experiences`**/`to support how you feel.` · button `Explore Experiences` · glyph: a rose disc with a white waveform.
- Bottom tab bar, 5 items, 1 px top hairline: `Home` (filled house, `blue-fill`, active),
  `Insights`, `Coaching`, `Experiences`, `You` — inactive icons and labels in `ink-400`,
  11 px/400.

---

# Appendix B — Copy consistency register

Transcribed verbatim; the deck is internally inconsistent. Resolve before build.

| Term | Variant A | Where | Variant B | Where |
|---|---|---|---|---|
| Recognise / Recognize | **`RECOGNISE YOUR MOMENT`**, `Recognising how you feel` (British) | §2 | — | — |
| Personalise / Personalize | **`Personalised audio experiences`** (British) | Appendix A, app card 3 | **`Personalized audio experiences`**, `Personalized Recharge Experiences` (American) | §3 card + loop node |
| personalisation / personalization | — | — | **`personalization`**, `Personalization with purpose.`, `Essential personalization`, `Extended personalization`, `Personalization that grows with your use`, `AI, personalization and human insight` (American, 6 instances) | §1 trust strip, §6, §7 |
| Wellbeing | **`Wellbeing`** / `wellbeing` (one word, no hyphen) — consistent in all 6 instances | §1, §4, §6 | — | — |
| AI-guided Coaching | **`AI-guided Coaching`** (capital C) | Appendix A, §3, §4 left stack, §7 | **`AI-guided coaching`** (lower c) | §4 lead, Appendix A lead |
| Recharge Experience(s) | **`Recharge Experiences`** (plural) | §1, §4, §7 Essential | **`Recharge Experience access`** (singular) | §7 Rhythm, §7 Plus |
| Apostrophes | straight `'` | `It's normal…`, `I'm running low`, `I can't switch off`, `shouldn't feel fragmented.` | typographic `’` | `Here's what that means for you.` |
| Middle dot separator | `·` with hair spaces | §1 meta, §3 `Reset · 8 min`, §7, §8 | — | — |
| Ellipsis / arrow | `→` (rightwards arrow U+2192), never `->` or `»` | all 7 Ask blocks, `Compare all features`, `Explore Plans` | — | — |

**Recommendation:** the deck's *body voice* is British (`Recognise`, `Recognising`,
`wellbeing`) while its *product nouns* are American (`Personalization`, `Personalized`).
Standardise on **British spelling throughout** — it is the more frequent register and matches
`Recognise`/`wellbeing` — which means changing 8 strings: the 6 `personalization` instances,
`Personalized audio experiences`, and `Personalized Recharge Experiences`. Flag for the copy
owner; do not silently change them during implementation.

**Also flag:** §4 cell 4 `as you perfect time or place.` (likely missing
`…without waiting for the…`) and Appendix A's `getts` typo.
