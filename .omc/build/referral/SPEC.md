# Referral page — shared worker contract

**Read this fully before writing anything. Every worker follows it. Deviating breaks assembly.**

Plan of record: `C:\Users\9D20~1\AppData\Local\Temp\claude\C--projects-abelar1884-github-io\f7845d59-fa4f-4ae0-9955-1512e0c00597\scratchpad\PLAN.md`
Figma renders: same scratchpad dir, `s1_hero.png` … `s11_footer.png`
Figma: fileKey `XdAhG8GZn0xGN8CBWwATKB`

---

## 🔴 FRAGMENT PROTOCOL — the core rule

**You never touch `referral.html` or `css/referral.css`.** The lead assembles those.
You write exactly two files per assigned unit, into `.omc/build/referral/sections/`:

```
NN-slug.html    <- the <section> markup for that unit, nothing else
NN-slug.css     <- the CSS for that unit, nothing else
```

`NN` is the zero-padded unit number from your assignment. Assembly is `cat` in `NN` order,
so your fragment must be **self-contained and order-independent**.

- No `<html>`, `<head>`, `<body>`, no `<link>`, no `<script>` tags in your `.html` fragment.
- No `:root` blocks, no `@import`, no `body{}` rules in your `.css` fragment.
- Put **your unit's media queries at the bottom of your own `.css` fragment.** Do not try to
  group them globally — assembly preserves your file's internal order.
- If you need a shared helper, do **not** invent one. Use the tokens below or ask the lead.

## Naming

BEM, all prefixed `referral-`. One block per unit, named for the unit:
`.referral-hero`, `.referral-commission`, `.referral-benefits`, `.referral-who`,
`.referral-stories`, `.referral-steps`, `.referral-industries`, `.referral-easy`,
`.referral-cta`, `.referral-faq`.
Elements `__el`, modifiers `--mod`. **Never** use an `about-*` or `js-faq-*` class.

## Tokens — already defined by the lead in unit 00. Use them, don't redefine.

```
--rf-teal:#004650    --rf-pink:#FF467C     --rf-emerald:#A6E4D3
--rf-lemon:#F1F44F   --rf-bright-teal:#F2FEFB
--rf-gray-1:#414141  --rf-gray-2:#737373   --rf-gray-3:#A1A1AA
--rf-shadow-2: 0 9px 20px rgba(0,9,10,.10), 0 36px 36px rgba(0,9,10,.09),
               0 80px 48px rgba(0,9,10,.05), 0 143px 57px rgba(0,9,10,.01),
               0 223px 62px rgba(0,9,10,0)
--font-inter, --font-cofo-kak   (from template.css — already available)
```

Page background is `#f4f4f6` (set by the lead). Content container:
`max-width:1440px; margin-inline:auto; padding-inline:56px` — the design's content width is
1328px inside a 1440 frame, i.e. 56px gutters. Use `box-sizing:border-box`.

## Type scale (1440)

| Token | Font | Size / line-height |
|---|---|---|
| Display (section H2) | CoFo Kak **900** | ~40–48px / 1.1, letter-spacing ~1px |
| H3 | CoFo Kak **900** | 32 / 1.25, letter-spacing 2 |
| H4 | Inter 400 | 24 / 1.3 |
| Body XL / L / M / S / Caption | Inter 400 | 24/1.3 · 20/1.5 · 18/1.44 · 16/1.4 · 14/1.4 |

🔴 **CoFo Kak may only be used at `font-weight:500` or `900`** — both map to the same Black
`.otf`, so they render identically and any other weight synthesises badly. Body copy is Inter.

Section headings in this design are two-tone: dark teal + a coloured second half
(pink `--rf-pink` on light sections, lemon `--rf-lemon` on dark). Wrap the coloured run in
`<span class="referral-…__accent">`.

## 🔴 Russian typography — enforced by an acceptance gate

- Group digits with a **literal U+00A0**, never an ASCII space, never `&nbsp;`:
  `500 000 ₽`, `300 000 ₽`, `2 500 000 ₽`, `3 000+`.
- U+00A0 also goes **immediately before `₽`**.
- Transcribe Russian copy **exactly** from the Figma render — including `ё`, `—` (em dash),
  and `«»` quotes. Do not "improve" wording, do not fix perceived typos.
- Gate: zero `\d \d` (ASCII space between digits) anywhere in your fragment.

## Responsive — no mobile comp exists

Ladder: **1200 / 1024 / 768 / 640 / 480**. Every rule you invent for mobile gets a
`/* NO COMP — inferred */` comment on the line above. Default collapse: multi-column → single
column at 768; reduce container padding to 24px at 768 and 16px at 480; scale display type down
~35% by 480. No horizontal overflow at any width — this is gated.

## Assets

Reference as `assets/images/referral/<name>`. Worker 2 exports them; **do not export assets
yourself** and do not block on them existing. Use the exact filenames listed in your assignment.
Watermarked stock ships as `<name>-placeholder.<ext>` — use that exact name where told.
Every `<img>` needs `alt`: meaningful Russian for content images, `alt=""` for decorative.

## Accessibility

Semantic sectioning: each unit is one `<section>` with an `aria-labelledby` pointing at its
heading `id`. Exactly one `<h1>` on the page and it belongs to unit 01 — every other unit starts
at `<h2>`. Interactive controls are real `<button>`/`<a>`, never a `div` with a handler.

## Forbidden

- ❌ Any Tailwind utility class you invent. `template.css`'s Tailwind layer is **pre-compiled with
  no build step** — a class that isn't already in that file silently does nothing. BEM only.
  (The chrome markup in unit 00 uses Tailwind; that markup is copied verbatim and is already
  compiled. Do not imitate it in new markup.)
- ❌ Editing any file outside `.omc/build/referral/sections/` (assets worker excepted).
- ❌ `about-*` / `js-faq-*` classes, or loading `js/about.js`.
- ❌ Inline `style=` attributes, `!important`, and `position:absolute` for layout you could do
  with grid/flex.
- ❌ Spawning sub-agents.

## Definition of done for your unit

1. Both fragment files exist and are non-empty.
2. Russian copy matches the render exactly; NBSP rules honoured.
3. Every colour/size traceable to a token or the render — no eyeballed hex codes outside the palette.
4. Media queries present for the ladder, inferred rules marked.
5. You re-read your own fragment once against the screenshot before reporting done.
6. Report to the lead: unit number, files written, any deviation you had to make and why.
