const COPIED_MS = 1200;

export function bindCopyButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    if (button.dataset.copyBound === 'true') return;
    button.dataset.copyBound = 'true';
    const idle = button.dataset.copyIdle ?? 'copy';
    button.addEventListener('click', async () => {
      const source = button.closest('[data-copy-root]')?.querySelector('[data-copy-source]');
      const text = source?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
        button.dataset.copied = 'true';
      } catch {
        button.textContent = 'Copy failed';
        delete button.dataset.copied;
      }
      window.setTimeout(() => {
        button.textContent = idle;
        delete button.dataset.copied;
      }, COPIED_MS);
    });
  });
}
