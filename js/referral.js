/**
 * js/referral.js — behaviour for referral.html. IIFE, no globals, no
 * dependencies beyond the DOM (GSAP is loaded on the page but unused here).
 * Every feature early-returns safely if its root markup is absent, so this
 * file is safe to load before every section has landed.
 *
 * ---------------------------------------------------------------------------
 * FEATURE 1 — FAQ accordion (unit 10, .referral-faq)
 * ---------------------------------------------------------------------------
 * Contract (already built, see sections/10-faq.html):
 *   <button class="referral-faq__question" aria-expanded="false"
 *           aria-controls="ID-of-panel">...</button>
 *   <div id="ID-of-panel" class="referral-faq__answer" hidden>...</div>
 * Independent toggles — opening one item never closes another. Real
 * <button>s give keyboard support (Enter/Space) for free.
 * Deliberately does NOT touch `.js-faq-item` / `.js-faq-trigger` (js/about.js
 * binds those at document scope with exclusive-open behaviour, which would
 * fight this accordion if the classes ever collided).
 *
 * ---------------------------------------------------------------------------
 * FEATURE 2 — Paged carousel (generic; TWO instances)
 * ---------------------------------------------------------------------------
 * One implementation, parameterised by BEM block name:
 *   initCarousel("referral-stories")  — unit 05, 6 testimonial cards
 *   initCarousel("referral-steps")    — unit 06, 3 steps (mobile comp 14132:113931
 *                                       shows one step + a dot rail below 768)
 *
 * Required structure per block (BLOCK = referral-stories | referral-steps):
 *   <div class="BLOCK__carousel">
 *     <div class="BLOCK__track">            <- may be a <ul>/<ol>; steps use <ol>
 *       <div class="BLOCK__card">...</div>  <- N of them, in paging order
 *     </div>
 *     <!-- BLOCK__dots is injected here at runtime; do not author it -->
 *   </div>
 *
 * Requirements on BLOCK__track:
 *   - Horizontally scrollable row (`overflow-x: auto`) whose direct children are
 *     exactly the BLOCK__card elements, in paging order.
 *   - `scroll-snap-type: x` is optional polish; the script drives scroll position
 *     itself and does not depend on native snap.
 *
 * NO BREAKPOINT LOGIC LIVES HERE. The script measures how many cards fit the
 * track and derives pageCount = ceil(cards / visible), re-measuring on debounced
 * resize. CSS card widths therefore fully determine behaviour:
 *   - steps at desktop: 3 fit -> 1 page -> rail emptied and hidden -> static row
 *   - steps below 768:  1 fits -> 3 pages -> 3 dots
 *   - stories: 3/2/1 visible -> 2/3/6 dots across the ladder
 *   NOTE: CSS must also carry `BLOCK__dots:empty { display: none }` — when the
 *   rail is emptied it stays in flow and the carousel's gap leaves dead space.
 *
 * Behaviour:
 *   - Dots index PAGES, not cards. A dot scrolls to page * track.clientWidth,
 *     clamped to max scroll so the last page never overshoots.
 *   - Dots are real <button>s; the active one carries `aria-current="true"`
 *     (NOT `aria-selected`, which is invalid ARIA outside tab/option roles).
 *   - ArrowLeft/ArrowRight page when focus is anywhere inside BLOCK__carousel.
 *   - `prefers-reduced-motion: reduce` switches scrolling to `behavior:"auto"`.
 *   - Active page is recomputed from scroll position on a debounced `scroll`
 *     listener, so touch/manual scrolling keeps the dots in sync.
 *
 * ---------------------------------------------------------------------------
 * FEATURE 3 — Income calculator (unit 02, .referral-calc)
 * ---------------------------------------------------------------------------
 * See RATES_PER_CLIENT below — all business rules live in that one constant.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------------ */
  /* Feature 1 — FAQ accordion                                          */
  /* ------------------------------------------------------------------ */

  function initFaqAccordion() {
    var triggers = document.querySelectorAll(".referral-faq__question");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panelId = trigger.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        trigger.setAttribute("aria-expanded", String(!isOpen));
        if (isOpen) {
          panel.hidden = true;
        } else {
          panel.hidden = false;
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Feature 2 — Paged carousel (generic)                               */
  /* ------------------------------------------------------------------ */
  /*
   * Used by TWO blocks, so it takes a BEM block name rather than hard-coding
   * selectors:
   *   initCarousel("referral-stories")  — unit 05, 6 testimonial cards
   *   initCarousel("referral-steps")    — unit 06, 3 steps
   *
   * No breakpoint logic lives here. The script measures how many cards fit the
   * track and derives pageCount = ceil(cards / visible). At desktop the steps
   * row fits all three, so pageCount is 1, the rail is emptied and hidden, and
   * the block behaves as a static row. Below 768 the CSS makes each card full
   * width, so visible drops to 1 and the rail appears. The card-width rules in
   * CSS therefore fully determine the behaviour.
   */

  function initCarousel(block) {
    var sel = function (part) { return "." + block + "__" + part; };

    var carousel = document.querySelector(sel("carousel"));
    if (!carousel) return; // block not present — no-op

    var track = carousel.querySelector(sel("track"));
    var cards = track
      ? Array.prototype.slice.call(track.querySelectorAll(sel("card")))
      : [];
    if (!track || !cards.length) return;

    var dotsRail = carousel.querySelector(sel("dots"));
    if (!dotsRail) {
      dotsRail = document.createElement("div");
      dotsRail.className = block + "__dots";
      carousel.appendChild(dotsRail);
    }

    var currentPage = 0;
    var pageCount = 1;
    var resizeTimer = null;
    var scrollTimer = null;
    var isProgrammaticScroll = false;

    function measureVisibleCount() {
      var trackWidth = track.clientWidth;
      if (!trackWidth || !cards[0]) return 1;
      var cardWidth = cards[0].getBoundingClientRect().width;
      if (!cardWidth) return 1;
      var visible = Math.round(trackWidth / cardWidth);
      return Math.max(1, Math.min(visible, cards.length));
    }

    function maxScrollLeft() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function scrollToPage(pageIndex, behavior) {
      var clampedPage = Math.max(0, Math.min(pageIndex, pageCount - 1));
      var target = Math.min(
        clampedPage * track.clientWidth,
        maxScrollLeft()
      );
      isProgrammaticScroll = true;
      track.scrollTo({
        left: target,
        behavior: prefersReducedMotion ? "auto" : behavior || "smooth",
      });
      currentPage = clampedPage;
      updateDots();
      // Native smooth scroll is async; release the guard shortly after.
      window.setTimeout(function () {
        isProgrammaticScroll = false;
      }, 400);
    }

    function updateDots() {
      var buttons = dotsRail.querySelectorAll(sel("dot"));
      buttons.forEach(function (dot, index) {
        if (index === currentPage) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function buildDots() {
      dotsRail.innerHTML = "";
      if (pageCount <= 1) {
        dotsRail.hidden = true;
        return;
      }
      dotsRail.hidden = false;

      for (var i = 0; i < pageCount; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = block + "__dot";
        dot.setAttribute(
          "aria-label",
          "Страница " + (i + 1) + " из " + pageCount
        );
        (function (pageIndex) {
          dot.addEventListener("click", function () {
            scrollToPage(pageIndex);
          });
        })(i);
        dotsRail.appendChild(dot);
      }
      updateDots();
    }

    function recompute() {
      var visible = measureVisibleCount();
      var nextPageCount = Math.max(1, Math.ceil(cards.length / visible));
      if (nextPageCount !== pageCount) {
        pageCount = nextPageCount;
        currentPage = Math.min(currentPage, pageCount - 1);
        buildDots();
      }
      // Re-clamp scroll position in case a resize changed page geometry.
      scrollToPage(currentPage, "auto");
    }

    function handleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(recompute, 150);
    }

    function handleScroll() {
      if (isProgrammaticScroll) return;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        var pageWidth = track.clientWidth || 1;
        var estimatedPage = Math.round(track.scrollLeft / pageWidth);
        currentPage = Math.max(0, Math.min(estimatedPage, pageCount - 1));
        updateDots();
      }, 100);
    }

    function handleKeydown(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToPage(currentPage + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToPage(currentPage - 1);
      }
    }

    window.addEventListener("resize", handleResize);
    track.addEventListener("scroll", handleScroll, { passive: true });
    carousel.addEventListener("keydown", handleKeydown);

    // Initial measure.
    recompute();
  }

  /* ------------------------------------------------------------------ */
  /* Feature 3 — Income calculator (unit 02, .referral-calc)            */
  /* ------------------------------------------------------------------ */
  /*
   * 🔴 BUSINESS RULES LIVE IN ONE PLACE — edit RATES_PER_CLIENT below and
   * nothing else needs touching.
   *
   * Provenance of these numbers:
   *   - `large` (Крупный) = 500 000 is DERIVED FROM THE DESIGN and verified:
   *     the comp (Figma node 14086:112456) shows 5 clients + Крупный selected
   *     producing "2 500 000 ₽", and 5 × 500 000 = 2 500 000. This one is solid.
   *   - `small`, `medium`, `holding` are NOT specified anywhere in the Figma
   *     file. They were chosen with the user so that no tier exceeds 500 000
   *     per client, which keeps the hero's «до 500 000 ₽ за каждого нового
   *     клиента» claim literally true. Holding is intentionally capped equal
   *     to large for that reason.
   *   - Replace all four with the real commercial rates when they are known.
   *
   * Monthly figure: the comp shows "≈208 500 ₽ в месяц" against a yearly
   * 2 500 000. A plain /12 gives 208 333.33, so the design rounds to the
   * nearest 500. Reproduced here so the default state matches the comp exactly.
   */
  var RATES_PER_CLIENT = {
    small: 100000,
    medium: 250000,
    large: 500000, // verified against the comp
    holding: 500000, // capped so nothing exceeds the hero's "до 500 000 ₽"
  };

  var MONTHLY_ROUND_TO = 500;

  /* 1234567 -> "1 234 567" using U+00A0, matching the page's typography rule
     (literal NBSP, never &nbsp;, never an ASCII space between digit groups). */
  function formatRubles(amount) {
    var digits = String(Math.round(amount));
    var out = "";
    for (var i = 0; i < digits.length; i++) {
      if (i > 0 && (digits.length - i) % 3 === 0) out += " ";
      out += digits.charAt(i);
    }
    return out;
  }

  function initCalculator() {
    var root = document.querySelector(".referral-calc");
    if (!root) return;

    var slider = root.querySelector(".referral-calc__slider");
    var clientsOut = root.querySelector("#referral-calc-clients-value");
    var yearOut = root.querySelector("#referral-calc-year");
    var monthOut = root.querySelector("#referral-calc-month");
    var radios = Array.prototype.slice.call(
      root.querySelectorAll(".referral-calc__radio")
    );
    if (!slider || !clientsOut || !yearOut || !monthOut || !radios.length) return;

    function selectedRate() {
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          var rate = RATES_PER_CLIENT[radios[i].value];
          if (typeof rate === "number") return rate;
        }
      }
      return RATES_PER_CLIENT.large;
    }

    function recompute() {
      var clients = parseInt(slider.value, 10);
      if (isNaN(clients)) clients = parseInt(slider.min, 10) || 1;

      var perYear = clients * selectedRate();
      var perMonth =
        Math.round(perYear / 12 / MONTHLY_ROUND_TO) * MONTHLY_ROUND_TO;

      clientsOut.textContent = String(clients);
      yearOut.textContent = formatRubles(perYear) + " ₽";
      monthOut.textContent =
        "/ ≈" + formatRubles(perMonth) + " ₽ в месяц";

      // Paint the filled portion of the track (WebKit has no ::-moz-range-progress
      // equivalent, so the fill is a gradient stop driven from here).
      var min = parseFloat(slider.min) || 1;
      var max = parseFloat(slider.max) || 100;
      var pct = ((clients - min) / (max - min)) * 100;
      slider.style.setProperty("--rf-calc-fill", pct + "%");
    }

    slider.addEventListener("input", recompute);
    radios.forEach(function (radio) {
      radio.addEventListener("change", recompute);
    });

    recompute();
  }

  function init() {
    initFaqAccordion();
    initCarousel("referral-stories");
    initCarousel("referral-steps");
    initCalculator();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
