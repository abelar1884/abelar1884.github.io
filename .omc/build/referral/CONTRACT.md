# Unit 00 contract — read before writing unit 01 (hero) or any other unit

## Hero wrapper (unit 01 — binding)

`shell-head.html` opens the hero section itself and leaves it **open (unclosed)**:

```html
<section class="referral-hero" aria-labelledby="referral-hero-title">
  <header class="site-header referral-hero__header"> ... </header>
  <div id="mobile-nav-dialog" class="js-mobile-nav ..."> ... </div>
```

This mirrors the existing `about.css`/`about.html` pattern exactly (`.about-hero` is one
`position:relative` section containing header + mobile dialog + hero content, with
`.about-hero__header` absolutely overlaid inside it). The chrome header must share the
same positioned ancestor as the hero content for the absolute overlay to land inside the
teal panel instead of floating relative to the viewport.

**Unit 01 must NOT open its own `<section class="referral-hero">`.** Its fragment
(`01-hero.html`) is the *inner content only* — H1, subtitle, CTA, photo collage, teal
panel background, etc. — and it **must close the section itself**: the last line of
`01-hero.html` must be `</section>`.

Unit 01's `<h1>` must carry `id="referral-hero-title"` — the `aria-labelledby` on the
`<section>` (set in shell-head.html) already points at that id. Do not add
`aria-labelledby` again on unit 01's fragment; the section tag already has it.

Every other unit (02–10) follows the normal rule: your fragment is one full,
self-contained `<section>`, open and close, with your own `aria-labelledby`.

## Heading helper classes (defined once in `sections/00-base.css`)

- `.referral__h2` — CoFo Kak 900, 48px/1.1, letter-spacing 1px, color `var(--rf-teal)`.
  Responsive: 36px at ≤768px, 31px at ≤480px.
- `.referral__h2-accent` — wraps the coloured second half of a heading
  (`<span class="referral__h2-accent">`). It does **not** set a color itself — set
  `color: var(--rf-pink)` (light sections) or `color: var(--rf-lemon)` (dark sections)
  in your own section's CSS fragment, scoped to your section's accent span, e.g.
  `.referral-benefits__h2-accent { color: var(--rf-lemon); }` if you need a
  section-specific hook, or just use `.referral__h2-accent` directly with a local
  override selector — your call, but don't redefine `.referral__h2-accent`'s base rule.
- `.referral__h3` — CoFo Kak 900, 32px/1.25, letter-spacing 2px, color `var(--rf-teal)`.
  Responsive: 26px at ≤480px.

Use these on every section heading. Do not invent parallel `h2`/`h3` styling per unit.

## Container class

`.referral__container` — `max-width:1440px; margin-inline:auto; padding-inline:56px;
box-sizing:border-box`. Responsive: 24px padding at ≤768px, 16px at ≤480px. Wrap your
section's content in a child element with this class (the `<section>` itself stays
full-bleed for background colour/imagery; the container constrains content width).

## Tokens

All `--rf-*` custom properties are defined on `.referral` (the `<main>` element) in
`sections/00-base.css`. They cascade to every descendant section — do not redefine them.

## Body background

`body { background-color: #f4f4f6; }` is set in `sections/00-base.css`. Verified it wins
over `template.css:6623` (`body{background:#05070e}`): both are bare `body` selectors
(specificity 0,0,0,1, identical), so cascade order decides — `referral.css` (which
`00-base.css` becomes part of, via assembly) loads last per `shell-head.html`'s
stylesheet order (`template.css` → `about.css` → `referral.css`). `about.css:5` also sets
the same `#f4f4f6` value, so there is no visible flash either way — belt and suspenders.

## Navbar overlay

`.referral-hero__header` (own rule, not borrowed from `.about-hero__header`) is defined
in `sections/00-base.css`: `position:absolute; top:0; left:0; right:0; z-index:2;
padding:32px 56px 16px`. This requires `.referral-hero` (unit 01's section, opened by
shell-head) to be `position:relative` — **unit 01 must set `position:relative` on
`.referral-hero`** in its own CSS fragment (00-base.css does not set it, since the hero
panel's box model — background, min-height, corner radius — belongs to unit 01).

## Verified facts (unit 00)

- `index.html` lines 21-46 = `<header class="site-header about-hero__header">…</header>`
  (26 lines) — confirmed via `grep -n`, matches the plan's estimate exactly.
- `index.html` lines 47-74 = `<div id="mobile-nav-dialog" …>…</div>` (28 lines) —
  confirmed balanced (8 `<div>` / 8 `</div>` inside shell-head.html's copy of it).
- `index.html` footer: **465–515**, not 465-501 as the plan estimated. `<footer
  class="site-footer">` opens at 465, `</footer>` closes at 515 (51 lines total).
  Copied verbatim into `shell-foot.html`; div-balance checked (6/6), footer tag (1/1).
- GSAP script tag copied byte-for-byte from `index.html:9`, including the SRI
  `integrity="sha512-Qrpii3NEFZ02RN6ZqpTu6pS/5PEq7EzBYJLki3AKBd8IncrlAwQdZHzExYwS0+b1NM0/qfxI1GOhqWLVosocDA=="` hash — not retyped, copied via grep/sed.
- Zero `about-` classes leaked into shell files (checked with grep; the only hit is the
  required HTML comment noting about.css's role). Zero `js-faq-`/`about-faq` classes.
