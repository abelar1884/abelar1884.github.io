# Referral page — image assets manifest

Source Figma file: `XdAhG8GZn0xGN8CBWwATKB`

Status: **COMPLETE.** Figma Starter-plan quota upgrade confirmed working 2026-08-19; all outstanding
units (02-10) exported this session. No node was called more than once, and every `download_assets`
call is logged below with its `rawImages`/`svgAssets` counts to prove no silent truncation (the one
node that DID truncate, unit 07's parent, was subdivided into per-card calls — see unit 07 notes).

🔴 **The four hero collage files are `.png`.** The SPEC originally suggested `.jpg` names —
that was wrong, `png` is what Figma actually returns for these fills. The markup correctly
references `.png`. **Do not "fix" these to `.jpg`.**

🔴 **FORMAT CORRECTIONS NEEDED IN MARKUP** — Figma returned `png` (or in one case a plain raster
export) where the SPEC/markup assumed `jpg`/`svg`. The markup at `referral.html` currently references
the old extensions and **must be updated** by whoever owns CSS/markup (out of scope for this asset
export worker, which only writes into `assets/images/referral/`):

| markup currently references | actual file saved | fix needed |
|---|---|---|
| `card-2pct-placeholder.jpg` | `card-2pct-placeholder.png` | change `.jpg` → `.png` in referral.html:127 |
| `card-15pct-placeholder.jpg` | `card-15pct-placeholder.png` | change `.jpg` → `.png` in referral.html:139 |
| `partner-portrait-placeholder.jpg` | `partner-portrait-placeholder.png` | change `.jpg` → `.png` in referral.html:238 |
| `industry-energy-placeholder.jpg` | `industry-energy-placeholder.png` | change `.jpg` → `.png` in referral.html:387 |
| `industry-trade-placeholder.jpg` | `industry-trade-placeholder.jpg` | **no change** — Figma returned real `jpeg` for this one |
| `cta-bg-placeholder.jpg` | `cta-bg-placeholder.png` | change `.jpg` → `.png` in referral.html:494 |
| `icon-automation.svg` | `icon-automation.png` | change `.svg` → `.png` in referral.html:474 — Figma has no vector layer for this icon (chip badge + "API" glyph), only a raster export exists |

🔴 Five of the outstanding assets are watermarked stock and carry a `-placeholder` suffix by
design. Those must be replaced with licensed files **before production**, tracked separately from
this export.

🔴 **Unit 06 (steps) has NO exportable asset.** The Figma node `14086:111174` contains 3 SVGs, but
they are all named "Ellipse 390" — plain circle/ellipse decorations for the step-number badges. The
built markup's `.referral-steps__circle` already reimplements these in pure CSS (dashed/solid
circles with numbers). Nothing was written for this unit; do not invent a file for it.

🟡 **Unit 10 (FAQ chevron) is exported but UNUSED.** `icon-chevron.svg` was saved from node
`467:1790` ("vuesax/bold/arrow-down") since it was trivially available, but `referral.html`'s FAQ
section uses a pure-CSS chevron already. No markup change needed unless the lead wants to swap it in.

## Exported assets

| filename | source Figma node id | placeholder? | Adobe Stock id | notes |
|---|---|---|---|---|
| hero-collage-1.png | 14094:112499 | no | n/a | Woman, bookshelf background. png, 600x388 (350197 bytes). Highest-res of 2-3 duplicate instances found in a 10-rawImage pull. |
| hero-collage-2.png | 14094:112499 | no | n/a | Man with tattoos, red cap, home office. png, 735x949 (946864 bytes). |
| hero-collage-3.png | 14094:112499 | no | n/a | Woman, green sweater, blue backdrop. png, 1024x1024 (1336397 bytes). NOTE: rounded corners are baked into the pixels (opaque, not alpha-masked) — flagged for CSS worker in case corner radius mismatches. |
| hero-collage-4.png | 14094:112499 | no | n/a | Man, white shirt, arms crossed, office. png, 1200x800 (877976 bytes). |
| card-2pct-placeholder.png | 14086:110711 | yes | AdobeStock (watermark visible, id not legible) | Hotel reception scene, person with teal suitcase at counter. png (Figma returned png, not jpg), 1000x667 (939757 bytes). Call returned 4 rawImages (no truncation) = 2 distinct photos × 2 resolutions each; kept highest-res of each. Mapped to "2%" card by content match to SPEC description. |
| card-15pct-placeholder.png | 14086:110711 | yes | AdobeStock #211531442 | Airport lounge scene, woman seated with boarding pass/ticket and suitcase. png, 1000x558 (669523 bytes). Mapped to "15%" card by content match. |
| icon-ruble.svg | 14086:110758 | no | n/a | Pink circular badge, ruble (₽) glyph, "vuesax/bold/dollar-circle" component. svg, 141x141 viewBox (highest-res of 2 duplicate instances found among 13 svgAssets, no truncation). |
| icon-limitless.svg | 14086:110758 | no | n/a | Pink key icon ("key" layer). svg, 121.6x118 viewBox (highest-res of 3 duplicate-size instances). |
| icon-dashboard.svg | 14086:110758 | no | n/a | Teal monitor/screen icon ("monitor" layer). svg, 32.17x32.17 viewBox (highest-res of 2 duplicates). |
| icon-thumbsup.svg | 14086:110758 | no | n/a | Pink thumbs-up icon ("like" layer). svg, 32.17x32.17 viewBox (highest-res of 2 duplicates). |
| bg-ruble-pattern.svg | 14086:110758 | no | n/a | Tiled row of 5 faint ₽ glyphs, the watermark pattern strip on the dark card. svg, 644.4x88.45 viewBox. |
| partner-portrait-placeholder.png | 14140:121371 | yes | AdobeStock (watermark visible, id not legible) | Woman in tan coat, smiling, holding laptop, city backdrop. png (Figma returned png, not jpg), 1000x667 (697428 bytes). Node's 8 rawImages included 3 DIFFERENT stock photos of the same model plus an unrelated unwatermarked airport-lounge photo (2 more rawImages, likely leaked from an adjacent/decorative element in the same subtree — NOT saved, unused). Confirmed correct photo via `get_screenshot` of the node — matches the smiling/looking-up-left pose exactly as rendered in the live design. |
| story-avatar-1.png | 14086:110932 | no | n/a | Анна, HR-директор. Office scene, black blazer, red wall background. png, 656x438 (210927 bytes) — full rectangular source (design applies the circular crop via CSS), highest-res of 2 duplicate-size instances. Mapped to position 1 by cross-referencing the node's `get_screenshot` render against zoomed avatar crops. |
| story-avatar-2.png | 14086:110932 | no | n/a | Михаил, собственник бизнеса. Circular-cropped photo already, gray-haired man, dark background. png, 150x150 (38965 bytes). |
| story-avatar-3.png | 14086:110932 | no | n/a | Екатерина, бухгалтер. Woman, brown/red curly hair, black turtleneck, outdoor building backdrop. png, 220x220 (85252 bytes). |
| industry-energy-placeholder.png | 14086:111503 (photo card at 14086:111610) | yes | AdobeStock (watermark visible, id not legible) | Industrial pipeline/refinery photo, blue sky. png (Figma returned png, not jpg), 1000x500 (825218 bytes). |
| industry-trade-placeholder.jpg | 14086:111503 (photo card at 14086:111626) | yes | AdobeStock #632325277 | Shipping container with Chinese flag colouring/stars, crane. **jpeg — Figma returned actual jpeg for this one, matches the expected `.jpg` extension, no correction needed.** 4096x2731 (5428046 bytes) — full native resolution, not a downsized duplicate. |
| icon-check.svg | 14086:111503 (checkbox instance at 14086:111578) | no | n/a | Emerald/mint circle with white checkmark, "Кому подходит" checklist bullets. svg, 24x24. Picked out of 3 sibling variants (a pink 24x24, this emerald 20x20 native-but-rendered-24, and a duplicate pink) by matching "emerald check" per SPEC — the other two are pink and don't match. |
| ind-energy.svg | 14086:111503 (photo card at 14086:111610) | no | n/a | Lightning bolt in a pink droplet/shield badge, layer name "Prom" (reused/copy-pasted layer name, ignore — content is a bolt, confirmed visually). svg, 25.3x33.5 viewBox. |
| ind-industry.svg | 14086:111670 | no | n/a | Teal factory building icon. svg, 30.19x27.17 viewBox. |
| ind-it.svg | 14086:111650 | no | n/a | Pink circuit/network-nodes icon ("tech" layer). svg, 35.33x28.42 viewBox. |
| ind-construction.svg | 14086:111633 | no | n/a | Teal crane-hook icon ("Group 1520" layer). svg, 34x29.15 viewBox. |
| ind-pharma.svg | 14086:111684 | no | n/a | Teal capsule/pill icon ("farma" layer). svg, 32.7x33.2 viewBox. |
| ind-trade.svg | 14086:111503 (photo card at 14086:111626) | no | n/a | Pink globe icon ("vuesax/bold/global"). svg, 36x36 viewBox — took the higher-res pink instance over a smaller teal 24x24 duplicate found in the same pull (teal one is presumably for a different color context, unused). |
| ind-consulting.svg | 14086:111662 | no | n/a | Teal people/dots icon ("vuesax/bold/people"). svg, 32.19x32.19 viewBox. NOTE: a visually-identical "dots" glyph also appears (hidden, per metadata) inside the industry/pharma/IT/construction card subtrees as a shared template placeholder layer ("user-cirlce-add") — do not confuse those exports with this one; only this node's instance is the real visible Consulting icon. |
| ind-sport.svg | 14086:111643 | no | n/a | Pink open-book icon. svg, 35.23x35.23 viewBox — picked the pink instance over a teal 24x24 duplicate to match the live design (white icon circle on dark card renders the pink book). |
| icon-expertise.svg | 14086:111696 | no | n/a | Pink thumbs-up icon ("Экспертиза"/Expertise card). svg, 58x56.01 viewBox. |
| icon-convenience.svg | 14086:111696 | no | n/a | Layered pink/gray rounded-square group with backdrop blur ("Удобство"/Convenience card). svg, 56.46x55.1 viewBox. Renders faint/blurry in lightweight SVG previewers because of a `backdrop-filter: blur()` + `clip-path` the icon uses — verified correct by inspecting the raw markup and cross-checking against the node's `get_screenshot`. |
| icon-automation.png | 14086:111741 | no | n/a | Chip/circuit badge with "API" text ("Автоматизация"/Automation card). **PNG raster, 56x56 (3754 bytes) — Figma has no vector layer for the chip background, only a flat "API" glyph SVG (1155 bytes, saved nowhere since it's incomplete on its own) plus this full raster export. Used the raster.** Markup must reference `.png`, not `.svg` — see correction table above. |
| cta-bg-placeholder.png | 14086:111774 | no (not watermarked, no AdobeStock mark visible) | n/a | Woman in orange/rust sweater, smiling, blurred event/office background (teal color wash applied via CSS in the live design). png (Figma returned png, not jpg), 1925x672 (812084 bytes), highest-res of 2 duplicate-size instances. |
| story-avatar-placeholder.svg | 14053:110220 (Ellipse 392) | **yes — no real portrait exists** | n/a | Plain 48x48 grey circle, `#D9D9D9`. Node 14053:110220 (the full six-story set) uses this ONE shared placeholder for every avatar — there is no real photo for Алексей, Ольга or Мария anywhere in the Figma file. Used by story cards 4-6. Cards 1-3 keep their real photos from 14086:110932. Swap in real portraits when available: it is a `src` change only, no rule edits. |
| icon-chevron.svg | 467:1790 ("vuesax/bold/arrow-down") | no | n/a | Solid down-chevron, dark teal fill (#004650). svg, 24x24. **Exported but currently UNUSED** — referral.html's FAQ accordion uses a pure-CSS chevron; this file is available if the lead wants to swap it in later. |

## Mobile-only blocks C + D (worker M2, 2026-08-19)

| filename | source Figma node id | placeholder? | notes |
|---|---|---|---|
| m-support-photo.png | 14132:114004 (image 97) | no | Woman at train station, looking at phone, red train blurred in background. png, 1037x1518. `download_assets` on this node returned 2 rawImages (this + a 260x380 thumbnail duplicate); kept the higher-res one. |
| m-support-icon-heart.svg | 14132:114004 ("Heart" layer) | no | Pink/magenta gradient heart-in-hand icon for the «Поможем» block. svg, 48.72x40.84 viewBox. |
| m-support-icon-messages.svg | 14132:114004 ("Messages" layer) | no | Pink chat-bubbles icon for the «Мы всегда на связи» block. svg, 42x42.3 viewBox. Uses a `backdrop-filter: blur()` + clip-path internally (same pattern as `icon-convenience.svg` from unit 08) — renders correctly in-browser, may look soft in lightweight SVG previewers. |
| m-service-hotels.svg | 14132:114060 (Group78, Отели icon) | no | Teal building + pink door/awning icon. svg, ~60x59.4 viewBox. |
| m-service-flights.svg | 14132:114060 (Group79, Авиабилеты icon) | no | Pink airplane icon. svg, ~60.8x59.1 viewBox. |
| m-service-train.svg | 14132:114060 (Group80, Ж/д билеты icon) | no | Teal/pink train icon. svg, ~60.5x56.8 viewBox. |
| m-service-transfer.svg | 14132:114060 (Group81, Трансферы icon) | no | Pink car/transfer icon on a pink circular badge. svg, includes its own gradient badge shape + car glyph. |

A third svgAsset returned alongside the two icons above for node `14132:114004` — a generic
24x24 "book-saved" bookmark glyph — did not match anything visible in this block's
`get_screenshot` render and was not saved; likely leaked from an adjacent/hidden layer in the
same subtree (same pattern noted for unit 04's portrait pull).

## Mobile-only block A — 4 feature cards (worker M1, node `14132:112977`)

No exportable assets. `get_design_context` on `14132:112977` returned no `<img>`/icon
references — the four cards are pure gradient/text (title + body copy), no per-card icon in
the comp. Nothing to export for this block.

## Mobile-only block B — «Нам доверяют» logo marquee (worker M1, node `14132:114111`)

Logo row node `14132:114116` truncated at the 20-svgAsset cap on a single `download_assets`
call (11 logo instances × up to 2 files each = up to 22). Subdivided into one
`download_assets` call per logo instance node (`14132:114118` … `14132:114128`, 11 calls, no
further truncation) — see the mobile call log below. Two of the four "masked" logos turned
out to use a mask that is just a full-bbox rectangle (`fill="black"` covering the whole
viewBox, confirmed by inspecting the downloaded mask SVGs), so the mask contributes no visual
clipping beyond the image's own bounds; only the underlying image SVG was kept for those.

All logo marks are flat single-colour SVGs — `fill="#004650"` (dark teal) on ten of eleven,
`fill="#DFF0EB"` on one — **not** greyscale/desaturated PNGs. The grey "muted" look in the
comp comes from a wrapper `opacity:0.5`, applied in `09b-mtrust.css` on
`.referral-m-trust__viewport`; verified by re-reading the design-context Tailwind hint
(`opacity-50` on the row's wrapper div) and the raw SVG fills.

Brand identity was confirmed by literal text-path shape for АЛХИМ (path glyphs spelling the
word) and by cross-referencing the MOBILE-SPEC's named brands (АЛХИМ, Weatherford, SERVIER)
against logo width/shape (SERVIER is the widest wordmark, 192px, matching the italic text seen
in `m9-odd.png`; Weatherford is the one with a heart/drop icon fused to the wordmark). The
remaining logo marks in the comp have no legible name in the design (no layer name beyond
generic "svgexport-NN 1" / "logo") and were **not guessed** — they ship with `alt=""` and the
marquee container carries `aria-label="Логотипы клиентов: АЛХИМ, Weatherford, SERVIER и
другие"` so screen readers get a truthful, non-fabricated summary instead of invented company
names.

| filename | source Figma node id | placeholder? | notes |
|---|---|---|---|
| m-trust-alhim.svg | `14132:114118` (masked; image sub-asset used, mask was a full-bbox rect) | no | АЛХИМ wordmark, teal `#004650`. svg, 117.37×14.63 viewBox. |
| m-trust-weatherford.svg | `14132:114119` (masked; image sub-asset used) | no | Weatherford wordmark + heart/drop mark, teal `#004650`. svg, 92.92×21.86 viewBox. |
| m-trust-logo-03.svg | `14132:114120` (direct image) | no | Unnamed brand mark, teal `#004650`. svg, 118.43×21.85 viewBox. |
| m-trust-logo-04.svg | `14132:114121` (direct image) | no | Unnamed brand mark, teal `#004650`. svg, 112.05×14.63 viewBox. |
| m-trust-logo-05.svg | `14132:114122` (direct image) | no | Unnamed brand mark, teal `#004650`. svg, 70.15×29.31 viewBox. |
| m-trust-logo-06.svg | `14132:114123` (direct image) | no | Unnamed square icon mark, teal `#004650`. svg, 21.86×21.86 viewBox. |
| m-trust-logo-07.svg | `14132:114124` (direct image) | no | Unnamed brand mark, teal `#004650`. svg, 108.41×21.81 viewBox. |
| m-trust-servier.svg | `14132:114125` (direct image) | no | SERVIER wordmark (widest logo, 192px — matches the italic SERVIER text visible in `m9-odd.png`), teal `#004650`. svg, 192.22×21.87 viewBox. |
| m-trust-logo-09.svg | `14132:114126` (masked; image sub-asset used) | no | Unnamed brand mark, teal `#004650`. svg, 51.00×21.84 viewBox. |
| m-trust-logo-10.svg | `14132:114127` (direct image) | no | Unnamed brand mark, teal `#004650`. svg, 68.32×28.97 viewBox. |
| m-trust-logo-11.svg | `14132:114128` (masked; image sub-asset used) | no | Unnamed brand mark, mint `#DFF0EB` fill (only non-teal logo). svg, 85.02×16.00 viewBox. |

### Mobile call log (block B)

| node | rawImages | svgAssets | truncated? |
|---|---|---|---|
| 14132:114111 (parent — export only, not used for logos) | 0 | 20 | **T** — subdivided below |
| 14132:114118 | 0 | 5 | - |
| 14132:114119 | 0 | 5 | - |
| 14132:114120 | 0 | 3 | - |
| 14132:114121 | 0 | 3 | - |
| 14132:114122 | 0 | 3 | - |
| 14132:114123 | 0 | 3 | - |
| 14132:114124 | 0 | 3 | - |
| 14132:114125 | 0 | 3 | - |
| 14132:114126 | 0 | 5 | - |
| 14132:114127 | 0 | 3 | - |
| 14132:114128 | 0 | 4 | - |

`14132:114113` and `14132:114115` (hidden nodes, per MOBILE-SPEC) were **not** called.

## Assets NOT exported (confirmed non-existent as separate exportable fills, or intentionally skipped)

- **Unit 06 step icons** — node `14086:111174` only contains 3 plain "Ellipse 390" circle/ellipse
  vectors (the step-number badge outlines), already reimplemented in CSS by the markup
  (`.referral-steps__circle`). No image asset exists to export here.
- Two extra rawImages inside the `14140:121371` (partner portrait) subtree — an unwatermarked
  airport-lounge photo pair (high-res + thumbnail) that doesn't match the SPEC's single portrait
  requirement and isn't used anywhere visible in that node's `get_screenshot`. Left unsaved.
- Two unused duplicate stock-photo poses of the same partner-portrait model (phone-call pose,
  laptop-under-arm pose) — the design only uses the third (smiling, looking up-left) pose. Left
  unsaved, noted above.
- Small-scale duplicate icon instances superseded by a higher-resolution copy in the same
  `download_assets` pull (documented per-row above) — not saved separately, since only one file per
  expected name was requested.

## Call log (proving no silent truncation)

All `download_assets` calls, one node per call as required. `T` = truncated (hit the 20-item cap and
required subdivision), `-` = not truncated.

| node | rawImages | svgAssets | truncated? |
|---|---|---|---|
| 14086:110711 (unit 02, cards) | 4 | 0 | - |
| 14086:110758 (unit 03, benefits) | 0 | 13 | - |
| 14140:121371 (unit 04, portrait) | 8 | 3 | - |
| 14086:110932 (unit 05, avatars) | 4 | 5 | - |
| 14086:111174 (unit 06, steps) | 0 | 3 | - |
| 14086:111503 (unit 07, industries — parent) | 6 | 20 | **T (svgAssets)** — subdivided below |
| 14086:111610 (unit 07, energy card) | 2 | 3 | - |
| 14086:111626 (unit 07, trade card) | 2 | 2 | - |
| 14086:111670 (unit 07, industry card) | 0 | 3 | - |
| 14086:111650 (unit 07, IT card) | 0 | 3 | - |
| 14086:111633 (unit 07, construction card) | 0 | 3 | - |
| 14086:111684 (unit 07, pharma card) | 0 | 3 | - |
| 14086:111662 (unit 07, consulting card) | 0 | 4 | - |
| 14086:111643 (unit 07, sport card) | 0 | 2 | - |
| 14086:111578 (unit 07, check-icon instance) | 0 | 3 | - |
| 14086:111696 (unit 08, easy/why-us) | 0 | 4 | - |
| 14086:111741 (unit 08, automation icon, targeted re-pull) | 0 | 1 | - |
| 14086:111774 (unit 09, CTA banner) | 2 | 1 | - |
| 467:1790 (unit 10, FAQ chevron, optional) | 0 | 1 | - |
| 14132:114004 (mobile block C, support) | 2 | 3 | - |
| 14132:114060 (mobile block D, services) | 0 | 4 | - |

`14086:111771` (rejected CTA variant), `14086:112456` (dropped calculator), and all nodes marked
hidden in Figma metadata were **not** called, per the exclusion list.
