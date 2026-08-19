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
 * FEATURE 2 — Testimonial carousel (unit 05, .referral-stories)
 * ---------------------------------------------------------------------------
 * Unit 05 is blocked on a 4th testimonial's copy at the time this file was
 * written, so its markup does not exist yet. This file defines the DOM
 * contract the unit-05 markup MUST match, and no-ops gracefully until then.
 *
 * Required structure:
 *   <div class="referral-stories__carousel">
 *     <div class="referral-stories__track">
 *       <div class="referral-stories__card">...</div>   × 4, in DOM order
 *       ...
 *     </div>
 *     <div class="referral-stories__dots"></div>        <- built dynamically by this script
 *   </div>
 *
 * Requirements on `.referral-stories__track`:
 *   - A horizontally scrollable flex/grid row (`overflow-x: auto` or similar)
 *     containing exactly the `.referral-stories__card` elements as direct
 *     children, in the order they should page through.
 *   - `scroll-snap-type: x` is recommended on the track for visual polish but
 *     not required by this script — the script drives scroll position via
 *     `scrollTo`/`scrollLeft`, it does not rely on native snap.
 *
 * What this script does NOT expect to find already in the markup:
 *   - `.referral-stories__dots` may be present empty (this script fills it)
 *     or absent entirely (this script creates and appends it as the last
 *     child of `.referral-stories__carousel`). Either is fine.
 *
 * Behaviour:
 *   - Visible-card count is MEASURED at runtime (not hard-coded from the
 *     viewport-width table below) by comparing card offsetWidth against the
 *     track's clientWidth, and is re-measured on debounced resize.
 *   - Reference table (what the measurement is expected to yield on a
 *     4-card set, per spec):
 *       >=1024px  -> 3 cards visible -> ceil(4/3) = 2 pages -> 2 dots
 *       768-1023  -> 2 cards visible -> ceil(4/2) = 2 pages -> 2 dots
 *       <768      -> 1 card  visible -> ceil(4/1) = 4 pages -> 4 dots
 *   - Dots index PAGES, not cards. Clicking a dot scrolls the track by
 *     (page index * track.clientWidth), clamped to the track's max scroll
 *     position so the last page never overshoots.
 *   - Dot rail is rebuilt whenever the measured page count changes; hidden
 *     (`hidden` attribute) when there is only 1 page.
 *   - Dots are real <button>s; the active dot carries `aria-current="true"`
 *     (NOT `aria-selected`, which is only valid ARIA under tab/option roles).
 *   - ArrowLeft/ArrowRight move one page when focus is anywhere inside
 *     `.referral-stories__carousel`.
 *   - `prefers-reduced-motion: reduce` disables smooth scrolling (uses
 *     `behavior: "auto"` instead of `"smooth"`).
 *   - The active page is also recomputed from scroll position on a
 *     debounced `scroll` listener, so manual/touch scrolling keeps the dots
 *     in sync.
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
  /* Feature 2 — Testimonial carousel                                   */
  /* ------------------------------------------------------------------ */

  function initStoriesCarousel() {
    var carousel = document.querySelector(".referral-stories__carousel");
    if (!carousel) return; // unit 05 not present yet — no-op

    var track = carousel.querySelector(".referral-stories__track");
    var cards = track
      ? Array.prototype.slice.call(
          track.querySelectorAll(".referral-stories__card")
        )
      : [];
    if (!track || !cards.length) return;

    var dotsRail = carousel.querySelector(".referral-stories__dots");
    if (!dotsRail) {
      dotsRail = document.createElement("div");
      dotsRail.className = "referral-stories__dots";
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
      var buttons = dotsRail.querySelectorAll(".referral-stories__dot");
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
        dot.className = "referral-stories__dot";
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

  function init() {
    initFaqAccordion();
    initStoriesCarousel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
