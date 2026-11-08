import type { AlgoStep } from './types';
import {
  parseTwoNumberSum,
  twoNumberSumSteps,
  type TnsApproach,
} from './two-number-sum';
import { parseValidateSubsequence, validateSubsequenceSteps } from './validate-subsequence';
import { parseTournamentWinner, tournamentWinnerSteps } from './tournament-winner';

type Kind = 'two-number-sum' | 'validate-subsequence' | 'tournament-winner';

function fieldValue(root: HTMLElement, name: string): string {
  const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${name}"]`);
  return field?.value ?? '';
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function computeSteps(root: HTMLElement): { ok: true; steps: AlgoStep[] } | { ok: false; error: string } {
  const kind = root.dataset.kind as Kind;
  if (kind === 'two-number-sum') {
    const parsed = parseTwoNumberSum({
      array: fieldValue(root, 'array'),
      target: fieldValue(root, 'target'),
    });
    if (!parsed.ok) return parsed;
    const approach = (root.dataset.approach as TnsApproach) || 'hashSet';
    return { ok: true, steps: twoNumberSumSteps(approach, parsed.value) };
  }
  if (kind === 'validate-subsequence') {
    const parsed = parseValidateSubsequence({
      array: fieldValue(root, 'array'),
      sequence: fieldValue(root, 'sequence'),
    });
    if (!parsed.ok) return parsed;
    return { ok: true, steps: validateSubsequenceSteps(parsed.value) };
  }
  const parsed = parseTournamentWinner({
    competitions: fieldValue(root, 'competitions'),
    results: fieldValue(root, 'results'),
  });
  if (!parsed.ok) return parsed;
  return { ok: true, steps: tournamentWinnerSteps(parsed.value) };
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderCells(
  values: Array<string | number>,
  marks: AlgoStep['marks'] = {},
  extra?: Array<Partial<{ probe: boolean; hit: boolean; used: boolean }>>,
): HTMLElement {
  const row = el('div', { class: 'viz-row' });
  values.forEach((value, index) => {
    const cell = el('div', { class: 'viz-cell' }, value === null || value === undefined ? '' : String(value));
    const mark = marks[index];
    if (mark) cell.dataset.mark = mark;
    const meta = extra?.[index];
    if (meta?.probe) cell.dataset.probe = 'true';
    if (meta?.hit) cell.dataset.hit = 'true';
    row.append(cell);
  });
  return row;
}

function renderStep(stage: HTMLElement, step: AlgoStep): void {
  stage.replaceChildren();

  if (step.array) {
    const labels = step.arrayLabels ?? step.array.map((_, index) => index);
    const indexRow = el('div', { class: 'viz-index' });
    labels.forEach((label) => indexRow.append(el('span', {}, String(label))));
    stage.append(indexRow);

    if (step.pointers) {
      const pointerRow = el('div', { class: 'viz-pointers' });
      const byIndex = new Map<number, string[]>();
      for (const [name, index] of Object.entries(step.pointers)) {
        const list = byIndex.get(index) ?? [];
        list.push(name);
        byIndex.set(index, list);
      }
      for (let i = 0; i < step.array.length; i++) {
        const names = byIndex.get(i) ?? [];
        pointerRow.append(el('span', {}, names.join(' ')));
      }
      stage.append(pointerRow);
    }

    stage.append(renderCells(step.array, step.marks));
  }

  if (step.sequence) {
    const wrap = el('div', { class: 'viz-seq' });
    wrap.append(el('p', { class: 'text-mono-eyebrow' }, 'Sequence'));
    const marks: NonNullable<AlgoStep['marks']> = {};
    if (step.matchedSeq) {
      for (let i = 0; i < step.matchedSeq; i++) marks[i] = 'found';
    }
    if (step.sequenceIndex !== undefined && step.sequenceIndex < step.sequence.length) {
      marks[step.sequenceIndex] = marks[step.sequenceIndex] ?? 'active';
    }
    wrap.append(renderCells(step.sequence, marks));
    stage.append(wrap);
  }

  if (step.hashSlots) {
    const wrap = el('div', { class: 'viz-hash' });
    wrap.append(el('p', { class: 'text-mono-eyebrow' }, `Hash set · ${step.hashSlots.length} slots`));
    const indexRow = el('div', { class: 'viz-index' });
    step.hashSlots.forEach((_, index) => indexRow.append(el('span', {}, String(index))));
    wrap.append(indexRow);
    wrap.append(
      renderCells(
        step.hashSlots.map((slot) => (slot.used && slot.value !== null ? slot.value : '')),
        {},
        step.hashSlots,
      ),
    );
    stage.append(wrap);
  }

  if (step.points) {
    const wrap = el('div', { class: 'viz-points' });
    wrap.append(el('p', { class: 'text-mono-eyebrow' }, 'Scoreboard'));
    const table = el('table');
    const body = el('tbody');
    if (step.points.length === 0) {
      const row = el('tr');
      row.append(el('td', {}, 'empty'));
      body.append(row);
    }
    for (const entry of step.points) {
      const row = el('tr');
      const name = el('th', {}, entry.name);
      if (step.bestTeam === entry.name) name.dataset.kind = 'output';
      row.append(name, el('td', {}, String(entry.points)));
      body.append(row);
    }
    table.append(body);
    wrap.append(table);
    stage.append(wrap);
  }

  if (step.vars) {
    const wrap = el('div', { class: 'viz-vars' });
    wrap.append(el('p', { class: 'text-mono-eyebrow' }, 'Variables'));
    const table = el('table');
    const body = el('tbody');
    for (const [key, value] of Object.entries(step.vars)) {
      const row = el('tr');
      row.append(el('th', {}, key), el('td', {}, String(value)));
      body.append(row);
    }
    table.append(body);
    wrap.append(table);
    stage.append(wrap);
  }

  if (step.eq) {
    stage.append(el('p', { class: 'viz-eq' }, step.eq.text));
  }

  if (step.result !== undefined) {
    stage.append(el('p', { class: 'viz-eq' }, `result ${JSON.stringify(step.result)}`));
  }
}

function bind(root: HTMLElement): void {
  if (root.dataset.bound === 'true') return;
  root.dataset.bound = 'true';
  root.dataset.enhanced = 'true';
  if (!root.dataset.approach) root.dataset.approach = 'hashSet';

  const initial = JSON.parse(root.dataset.initial || '{}') as Record<string, string>;
  const stage = root.querySelector<HTMLElement>('[data-stage]');
  const narration = root.querySelector<HTMLElement>('[data-narration]');
  const error = root.querySelector<HTMLElement>('[data-error]');
  const counter = root.querySelector<HTMLElement>('[data-counter]');
  const scrubber = root.querySelector<HTMLInputElement>('[data-scrubber]');
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]');
  const editor = root.querySelector<HTMLElement>('[data-editor]');
  if (!stage || !narration || !error || !counter || !scrubber) return;

  let steps: AlgoStep[] = [];
  let index = 0;
  let playing: number | undefined;

  const stop = () => {
    if (playing !== undefined) window.clearInterval(playing);
    playing = undefined;
    if (playBtn) playBtn.textContent = 'play';
  };

  const show = () => {
    const step = steps[index];
    if (!step) return;
    renderStep(stage, step);
    narration.textContent = step.narration;
    counter.textContent = `step ${index + 1} / ${steps.length}`;
    scrubber.max = String(Math.max(steps.length - 1, 0));
    scrubber.value = String(index);
    root.dataset.stepIndex = String(index);
  };

  const load = (keepError = false) => {
    const result = computeSteps(root);
    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error;
      root.dataset.error = result.error;
      return false;
    }
    if (!keepError) {
      error.hidden = true;
      error.textContent = '';
      delete root.dataset.error;
    }
    steps = result.steps;
    index = 0;
    show();
    return true;
  };

  const restoreInitial = () => {
    for (const [name, value] of Object.entries(initial)) {
      const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${name}"]`);
      if (field) field.value = value;
    }
  };

  restoreInitial();
  load();

  root.querySelector('[data-next]')?.addEventListener('click', () => {
    stop();
    if (index < steps.length - 1) {
      index += 1;
      show();
    }
  });
  root.querySelector('[data-prev]')?.addEventListener('click', () => {
    stop();
    if (index > 0) {
      index -= 1;
      show();
    }
  });
  root.querySelector('[data-skip]')?.addEventListener('click', () => {
    stop();
    index = Math.max(steps.length - 1, 0);
    show();
  });
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    stop();
    restoreInitial();
    load();
  });
  root.querySelector('[data-edit]')?.addEventListener('click', () => {
    if (editor) editor.hidden = !editor.hidden;
  });
  root.querySelector('[data-apply]')?.addEventListener('click', () => {
    stop();
    const previous = steps;
    const previousIndex = index;
    if (!load()) {
      steps = previous;
      index = previousIndex;
      show();
    }
  });
  playBtn?.addEventListener('click', () => {
    if (prefersReducedMotion()) return;
    if (playing !== undefined) {
      stop();
      return;
    }
    playBtn.textContent = 'pause';
    playing = window.setInterval(() => {
      if (index >= steps.length - 1) {
        stop();
        return;
      }
      index += 1;
      show();
    }, 750);
  });
  scrubber.addEventListener('input', () => {
    stop();
    index = Number(scrubber.value);
    show();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-approach]').forEach((button) => {
    button.addEventListener('click', () => {
      stop();
      root.dataset.approach = button.dataset.approach;
      root.querySelectorAll<HTMLButtonElement>('[data-approach]').forEach((item) => {
        item.dataset.selected = item === button ? 'true' : 'false';
      });
      load();
    });
  });

  editor?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      root.querySelector<HTMLButtonElement>('[data-apply]')?.click();
    }
  });

  root.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      root.querySelector<HTMLButtonElement>('[data-next]')?.click();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      root.querySelector<HTMLButtonElement>('[data-prev]')?.click();
    } else if (event.key === ' ') {
      event.preventDefault();
      playBtn?.click();
    }
  });
}

export function bindSteppers(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-stepper]').forEach(bind);
}
