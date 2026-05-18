/* =========================================================
   3Debate — tiny interactions
   Kept deliberately simple and dependency-free so it's easy
   to read and modify as you learn web dev.
   ========================================================= */

(function () {
  'use strict';

  // ----- 1. Stamp the current year in the footer -----------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- 2. Fade sections in as they scroll into view ------------
  // Uses IntersectionObserver — a built-in browser API that tells us
  // when an element is on screen. We add a CSS class; styles.css
  // handles the actual animation.
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Older browsers: just show everything.
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ----- 3. Subtle parallax on the hero scene --------------------
  // The hero scene reads --px / --py CSS variables and translates
  // a few pixels in response to the cursor. Disabled if the user
  // prefers reduced motion, or on touch-only devices.
  const scene = document.querySelector('.hero-scene');
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchOnly =
    window.matchMedia('(hover: none)').matches;

  if (scene && !prefersReducedMotion && !isTouchOnly) {
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    function update() {
      pending = false;
      scene.style.setProperty('--px', lastX.toFixed(3));
      scene.style.setProperty('--py', lastY.toFixed(3));
    }

    window.addEventListener('mousemove', (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Map cursor to a -1..1 range relative to the viewport center.
      lastX = (e.clientX / w) * 2 - 1;
      lastY = (e.clientY / h) * 2 - 1;
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    // Reset when the cursor leaves the window.
    window.addEventListener('mouseleave', () => {
      lastX = 0;
      lastY = 0;
      requestAnimationFrame(update);
    });
  }
})();

