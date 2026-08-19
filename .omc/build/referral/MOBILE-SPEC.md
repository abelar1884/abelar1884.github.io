# Mobile build — shared worker contract

**Read `SPEC.md` first — everything in it still applies.** This file adds the mobile rules.
The mobile comp is in the SAME file we already use: `XdAhG8GZn0xGN8CBWwATKB`,
root frame **`14132:112911`** (375 × 12144). Do NOT use the `FG20BPnZyUi9v5jGqOhrCT`
link — that file is not accessible to the MCP (edit access required, we have none).

> Correction to earlier project notes: I previously reported "no mobile comp exists".
> That was wrong — the sweep only covered the *Wireframes* page and never dumped the
> *UI Kit* page. Any `/* NO COMP — inferred */` marker in a section you touch should be
> REPLACED with real values from this comp, and the marker deleted.

## Breakpoint policy (decided with the user)

- The mobile comp governs **≤768px**.
- Four content blocks exist ONLY in the mobile comp. They are **mobile-only**: rendered
  below 768 and `display:none` at ≥769. Do not invent desktop layouts for them.
- «Истории партнеров» and «Начать зарабатывать» are **one-card carousels with dots** below 768.
  Stories already behaves this way. Steps must be converted (the lead handles the JS).

## Mobile canvas facts

- Frame width **375**; content width **343** → **16px side gutters** (desktop uses 56px).
- Section cards keep radius 24; the hero panel keeps its bottom-corner radius.
- Type: display headings are centred on mobile in most sections (desktop is often left-aligned).
  Take exact sizes from `get_design_context` per node — do not scale desktop values by eye.

## Node map — mobile frame `14132:112911`

| y | node | w×h | What it is | Maps to |
|---|---|---|---|---|
| 0 | `14132:112913` | 375×612 | Hero (title, subcopy, CTA, photo collage) | unit 01 |
| 644 | **`14132:112977`** | 344×666 | **NEW — 4 dark feature cards** | mobile-only block A |
| — | `14132:112998` | — | HIDDEN — do not build | — |
| 1390 | `14132:113005` | 375×900 | Calculator + 2%/15% commission cards | units 02 + 02b |
| 2370 | `14136:120872` | 343×1439 | «Почему это выгодно» — stacked, centred | unit 03 |
| 3889 | `14163:121761` | 343×1630 | «Кто может стать партнером?» — list, portrait BELOW | unit 04 |
| 5599 | `14132:113835` | 375×350 | «Истории партнеров» — 1 card + 3 dots | unit 05 |
| 6029 | `14132:113931` | 343×366 | «Начать зарабатывать» — 1 step + 3 dots | unit 06 |
| 6475 | `14154:121720` | 343×1058 | «Кому рекомендовать GATE» — ⚠ RENDERS NEARLY EMPTY | unit 07 |
| 7613 | **`14132:114004`** | 375×1222 | **NEW — «Экспертная живая поддержка 24/7»** | mobile-only block C |
| 8835 | **`14132:114060`** | 375×940 | **NEW — «Все тревел-услуги в одном сервисе»** | mobile-only block D |
| 9855 | **`14132:114111`** | 1440×93 | **NEW — «Нам доверяют» logo marquee** | mobile-only block B |
| 10028 | `14132:114130` | 375×2646 | FAQ | unit 10 |

⚠ `14154:121720` renders as a heading plus a blank white card. Before building it, check
whether the content is genuinely absent in the comp or merely failed to render. If it is
genuinely empty, **do not invent it** — keep the existing desktop markup and just restyle
for narrow widths, and report the finding.

## Mobile-only blocks — how to gate them

Give each a `referral-m` prefix and a single shared visibility rule (the lead puts this in
`00-base.css`; do not duplicate it):

```css
.referral-m { display: none; }
@media (max-width: 768px) { .referral-m { display: block; } }
```

So a block's root is e.g. `<section class="referral-m referral-m-trust">`.
Never use inline styles or a second visibility mechanism.

## Fragment naming for mobile-only blocks

Same fragment protocol as SPEC.md, into `.omc/build/referral/sections/`. Use the numbering
that places each block at its comp position:

- `01b-mfeatures.html/.css` — block A, the 4 feature cards (sits right after the hero)
- `07b-msupport.html/.css` — block C, поддержка 24/7
- `07c-mservices.html/.css` — block D, тревел-услуги
- `09b-mtrust.html/.css`   — block B, «Нам доверяют» marquee

(Assembly is `sort`-ordered by filename; these slot in at the right places.)

## Assets

New blocks need their own assets. Export per node with `download_assets` (never on the
mobile root — it would truncate at the 20-item cap). Save under
`assets/images/referral/` with an `m-` prefix so mobile-only assets are obvious:
`m-trust-logo-*.svg`, `m-support-photo.png`, `m-service-*.svg`, `m-feature-*.svg`.
Watermarked stock keeps the `-placeholder` suffix. Update `ASSETS.md`.

## Non-negotiables (repeat of SPEC.md, because these keep biting)

- 🔴 NBSP (U+00A0) between digit groups and before `₽`. **Never** an ASCII space, never `&nbsp;`.
  Verify with explicit escapes (` `), not by eyeballing a source literal — a literal
  NBSP in your own editor is indistinguishable from a space and has caused three bugs so far.
- 🔴 BEM only. `template.css`'s Tailwind is pre-compiled with no build step; a novel utility
  class silently does nothing.
- 🔴 CoFo Kak only at weight 500 or 900.
- 🔴 Never touch `referral.html` / `css/referral.css` — the lead assembles those from fragments.
- Real interactive elements (`<button>`, `<a>`, `<input>`), never a `div` with a handler.
