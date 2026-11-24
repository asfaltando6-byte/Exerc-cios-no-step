"use strict";
(() => {
  const track = document.getElementById('step-carousel');
  if (!track) return;
  const controls = document.querySelector('.sample-controls');
  const dots = controls.querySelector('.sample-dots');
  const pause = controls.querySelector('.sample-pause');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let points = [], current = 0, timer = null;
  let paused = false, focused = false, touching = false, visible = false;
  function active() {
    if (!points.length) return;
    current = points.reduce((best, x, i) => Math.abs(x - track.scrollLeft) < Math.abs(points[best] - track.scrollLeft) ? i : best, 0);
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
  }
  function move(index) {
    if (!points.length) return;
    current = (index + points.length) % points.length;
    track.scrollTo({left: points[current], behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  function schedule() {
    clearInterval(timer);
    timer = null;
    if (!paused && !focused && !touching && visible && !document.hidden && !reduced.matches && points.length > 1) {
      timer = setInterval(() => move(current + 1), 3000);
    }
  }
  function positions() {
    const max = track.scrollWidth - track.clientWidth;
    const cards = [...track.querySelectorAll('.sample-card')];
    if (!cards.length) return;
    points = [...new Set(cards.map(card => Math.round(Math.max(0, Math.min(max, card.offsetLeft - cards[0].offsetLeft)))))];
    dots.replaceChildren(...points.map((_, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Ver posição ' + (i + 1) + ' do carrossel');
      button.addEventListener('click', () => {move(i); schedule();});
      return button;
    }));
    active(); schedule();
  }
  controls.querySelector('[data-slide=previous]').addEventListener('click', () => {move(current - 1); schedule();});
  controls.querySelector('[data-slide=next]').addEventListener('click', () => {move(current + 1); schedule();});
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Reproduzir' : 'Pausar';
    schedule();
  });
  track.addEventListener('scroll', active, {passive: true});
  track.addEventListener('focusin', () => {focused = true; schedule();});
  track.addEventListener('focusout', () => {focused = false; schedule();});
  track.addEventListener('pointerdown', () => {touching = true; schedule();});
  window.addEventListener('pointerup', () => {touching = false; schedule();});
  track.addEventListener('pointercancel', () => {touching = false; schedule();});
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  new ResizeObserver(positions).observe(track);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, {threshold: 0.01, rootMargin: '120px 0px'}).observe(track);
  positions();
})();
