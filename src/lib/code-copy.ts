const COPIED_MS = 1200;

export function bindCodeCopyTiming(): void {
  if (document.documentElement.dataset.codeCopyTiming === 'true') return;
  document.documentElement.dataset.codeCopyTiming = 'true';
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('.expressive-code .copy button');
    if (!button) return;
    window.setTimeout(() => {
      button.parentElement?.querySelector('.feedback.show')?.classList.remove('show');
    }, COPIED_MS);
  });
}
