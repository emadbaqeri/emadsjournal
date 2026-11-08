type WorkerResult =
  | { id: number; ok: true; output: string }
  | { id: number; ok: false; error: string };

export function bindPlaygrounds(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-playground]');
  if (roots.length === 0) return;

  const worker = new Worker(new URL('./playground-worker.ts', import.meta.url), {
    type: 'module',
  });
  let nextId = 1;
  const pending = new Map<
    number,
    { result: HTMLElement; error: HTMLElement }
  >();

  worker.addEventListener('message', (event: MessageEvent<WorkerResult>) => {
    const job = pending.get(event.data.id);
    if (!job) return;
    pending.delete(event.data.id);
    if (event.data.ok) {
      job.result.hidden = false;
      job.result.textContent = event.data.output;
      job.error.hidden = true;
      job.error.textContent = '';
    } else {
      job.result.hidden = true;
      job.error.hidden = false;
      job.error.textContent = event.data.error;
    }
  });

  for (const root of roots) {
    if (root.dataset.bound) continue;
    root.dataset.bound = 'true';
    root.dataset.enhanced = '';
    const button = root.querySelector<HTMLButtonElement>('[data-playground-run]');
    const source = root.querySelector('[data-source]');
    const result = root.querySelector<HTMLElement>('[data-live-output]');
    const error = root.querySelector<HTMLElement>('[data-live-error]');
    const label = root.querySelector<HTMLElement>('[data-live-label]');
    if (!button || !source || !result || !error) continue;
    button.hidden = false;
    button.addEventListener('click', () => {
      const id = nextId;
      nextId += 1;
      if (label) label.hidden = false;
      pending.set(id, { result, error });
      worker.postMessage({ id, code: source.textContent ?? '' });
    });
  }
}
