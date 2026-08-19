## Handoff: team-exec → team-verify (COMPLETE, verified)

**Decided**
- Built via a fragment protocol: 6 workers wrote numbered `.omc/build/referral/sections/NN-*.{html,css}`
  fragments; the lead assembled `referral.html` + `css/referral.css`. Zero merge conflicts across
  6 parallel workers on what would otherwise be two shared files.
- Chrome strategy A0 held: `template.css` → `about.css` (shared chrome) → `referral.css`.
- **All 12 units built.** Unit 05 (Истории партнеров) was built with the three real testimonials
  that exist in the design rather than left as a hole; the carousel measures its page count at
  runtime, so a 4th card is a copy-paste of one `<article>` block with no JS/CSS change (TODO marker
  in the markup). Note the comp's dot rail draws FOUR dots, confirming a 4th story is intended —
  its copy exists nowhere in the Figma file.

**Rejected**
- Hiding the hero collage below 1200px (worker-3's first pass). Reverted: it deleted four of the
  page's most prominent images on all tablet/phone traffic. Replaced with percentage-based
  positioning inside an `aspect-ratio: 511/412` box, so it scales instead of vanishing.
- `overflow-x: clip` to silence the residual 320px overflow. Rejected because it would make the
  overflow gate permanently pass and mask future real bugs.
- Copying index.html's GSAP SRI hash byte-for-byte, as the plan instructed. See below.

**Bugs found and fixed in this pass**
1. **GSAP SRI hash in `index.html:9` is stale** — does not match what cdnjs serves for gsap 3.15.0,
   so the browser BLOCKS the script and `js/template.js:2` throws `gsap is not loaded`. Effect: the
   mobile nav is dead. This is a PRE-EXISTING bug affecting the live `index.html`. `referral.html`
   ships the correct digest (`sha512-oJ8Qba…`) with an inline comment explaining the divergence.
   `index.html` was NOT modified — out of scope, needs the user's decision.
2. **`url()` path in unit 03** resolved to `css/assets/…` because a stylesheet under `css/` makes
   `url()` relative to itself. Fixed to `../assets/…`.
3. **Long Russian display headings forced document overflow at ≤375px.** `overflow-wrap: break-word`
   was insufficient — it does not reduce min-content size, so flex-item headings still resolved to
   380px. Fixed with `overflow-wrap: anywhere` + `min-width: 0` at ≤640.
4. **Six acceptance gates were themselves wrong** and failed on a correct build — see
   `.omc/build/referral/verify.ps1` header. Two collided with the verbatim-footer decision
   (`под капот` is real footer copy; the footer's phone number contains ASCII digit-spaces).

**Verified** (`.omc/build/referral/verify.ps1`, 33/33 pass, plus Playwright at 16 widths)
- Colours exact: hero `rgb(0,70,80)`, CTA `rgb(255,70,124)`, accent `rgb(241,244,79)`, body `#f4f4f6`.
- Both fonts load (`CoFo Kak` 900, Inter 400) after `document.fonts.ready`. GSAP loads; template.js
  does not throw; mobile nav functional.
- Header overlay correct: `position:absolute` inside the hero panel, H1 top at exactly **179px** —
  matches the design's `y=179`.
- Industries grid measured **644/453 · 453/644 · 453/644 · 548/549** — matches the Architect's
  corrected row table, including the row-2 inversion the original draft had backwards.
- FAQ: **8** items, 0 expanded on load; opening two leaves both open (independent toggles, decision 6).
- Carousel dot rail computes from measured visible count: 1440 -> 3 visible -> 1 page -> rail hidden;
  768 -> 2 visible -> 2 dots; 375 -> 1 visible -> 3 dots. Will become 2/2/4 when the 4th card lands.
- Commission heading measures **62px = exactly 2 lines**, matching Figma node 14086:110710 (1440x62).
- No horizontal overflow at 1440/1300/1200/1100/1024/950/900/800/768/700/640/560/480/414/375.
- Collage visible at every width: 511 → 380 → 420 → 320 → 273px.
- `git status`: only new paths. **Zero pre-existing tracked files modified.**

**Risks / open**
- ~~25 image assets missing~~ **RESOLVED.** User upgraded the Figma plan; all 31 assets exported.
  Verified in-browser: 40 `<img>` elements, **0 broken**, 0 HTTP failures, 0 console errors.
  Six extension mismatches (Figma returned png where the plan assumed jpg/svg) were fixed by
  `.omc/build/referral/reconcile-assets.py`, which syncs every reference to what is actually on disk
  and reports dangling refs + orphans. `icon-automation` is raster-only — Figma has no vector layer
  for it. `icon-chevron.svg` is exported but unused (the FAQ chevron is pure CSS).
- ~~8th FAQ item~~ **RESOLVED** after the Figma plan upgrade: `get_design_context` on
  `14086:111850` recovered it — «Как увеличить доход в реферальной программе?» with a 4-part answer
  including a 3-item bullet list. Built as FAQ item 8. The FAQ now has 8 items, not 7.
- **320px overflows by 23px**, entirely from the copied mobile-nav dialog, not authored content.
  Below the 375 supported floor. Note: `index.html` appears clean at 320 only because its GSAP is
  broken so the dialog transform never applies.
- **Design copy bug**: «Под**л**ючение за минуту» (missing к) in the Удобство card, reproduced
  verbatim per instruction. Client decision.
- 5 watermarked stock placeholders block production release.

**Files**
Created: `referral.html`, `css/referral.css`, `js/referral.js`, `assets/images/referral/*`,
`.omc/build/referral/**` (fragments + SPEC + CONTRACT + GEOMETRY + verify.ps1).
Rollback: `git clean` those paths. Nothing else to undo.

**Bugs found in this second pass**
5. Unit 05's currency figures (which the LEAD hand-wrote) used ASCII spaces, not NBSP — caught by
   the project's own typography gate. Fixed. The gate earning its keep against its own author.
6. The carousel dot rail stayed in the flow when empty, so the carousel's 24px gap left dead space
   under the cards at >=1024. Fixed with a `:empty` CSS guard that does not depend on the JS flag.
7. Commission heading was capped at 984px, pushing "GATE" to a third line. Widened to 1140px.

**Remaining**
- 4th testimonial copy + avatar (optional; section ships correctly with 3).
- 5 watermarked stock placeholders must be replaced before production.
- `index.html`'s stale GSAP SRI hash — one-line fix, awaiting the user's go-ahead.
