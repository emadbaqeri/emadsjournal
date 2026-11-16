const EDGE = 2;

function fadeState(el: HTMLElement): '' | 'start' | 'end' | 'both' {
  const max = el.scrollWidth - el.clientWidth;
  if (max <= 1) return '';
  const start = el.scrollLeft > EDGE;
  const end = el.scrollLeft < max - EDGE;
  if (start && end) return 'both';
  if (start) return 'start';
  if (end) return 'end';
  return '';
}

function scrollers(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('pre, [data-code-scroll]'));
}

function refresh(): void {
  const seen = new Set<HTMLElement>();
  scrollers().forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    const overflowX = getComputedStyle(el).overflowX;
    const canScroll = overflowX === 'auto' || overflowX === 'scroll';
    if (!canScroll) return;
    const overflowing = el.scrollWidth > el.clientWidth + 1;
    if (overflowing) {
      if (!el.hasAttribute('tabindex')) {
        el.tabIndex = 0;
        el.dataset.tabindexAdded = 'true';
      }
      el.dataset.fade = fadeState(el);
    } else {
      delete el.dataset.fade;
      if (el.dataset.tabindexAdded === 'true') {
        el.removeAttribute('tabindex');
        delete el.dataset.tabindexAdded;
      }
    }
    if (el.dataset.codeScrollBound === 'true') return;
    el.dataset.codeScrollBound = 'true';
    el.addEventListener(
      'scroll',
      () => {
        const over = el.scrollWidth > el.clientWidth + 1;
        if (over) el.dataset.fade = fadeState(el);
        else delete el.dataset.fade;
      },
      { passive: true },
    );
  });
}

let listening = false;

export function bindCodeScrollers(): void {
  refresh();
  if (listening) return;
  listening = true;
  window.addEventListener('resize', refresh);
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-lang], [data-solution-tabs]')) {
      requestAnimationFrame(refresh);
    }
  });
  document.fonts?.ready.then(refresh).catch(() => {});
}
