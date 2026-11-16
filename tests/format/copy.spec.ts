import { expect, test } from '@playwright/test';
import { formatShortDate, plural } from '../../src/lib/format';
import { seriesParts } from '../../src/lib/series-parts';
import { pairChoices, sliceFromMarkers } from '../../src/lib/algorithms/solution-choices';

test('plural uses the singular only for one', () => {
  expect(plural(1, 'part')).toBe('1 part');
  expect(plural(0, 'part')).toBe('0 parts');
  expect(plural(3, 'part')).toBe('3 parts');
  expect(plural(1, 'series', 'series')).toBe('1 series');
  expect(plural(2, 'series', 'series')).toBe('2 series');
});

test('short dates are month plus a zero-padded day', () => {
  expect(formatShortDate(new Date('2026-11-05T00:00:00.000Z'))).toBe('Nov 05');
  expect(formatShortDate(new Date('2026-10-21T00:00:00.000Z'))).toBe('Oct 21');
});

test('series index and post nav share one part list', () => {
  const posts = [
    { id: 'why-notes', order: 1 },
    { id: 'arrays', order: 2 },
  ];
  const algorithms = [{ id: 'two-number-sum', order: 3 }];
  const parts = seriesParts(posts, algorithms);

  expect(posts).toHaveLength(2);
  expect(parts.map((part) => part.id)).toEqual(['why-notes', 'arrays', 'two-number-sum']);
  expect(plural(parts.length, 'part')).toBe('3 parts');
  expect(plural(posts.length, 'part')).toBe('2 parts');
});

test('solution choices pair each approach with a language', () => {
  const slices = sliceFromMarkers(
    ['// 1. Brute force', 'brute', '// 2. Hash set', 'hash'].join('\n'),
    [
      { id: 'brute-force', label: 'Brute force', start: '// 1. Brute force' },
      { id: 'hash-set', label: 'Hash set', start: '// 2. Hash set' },
    ],
  );
  const byId = Object.fromEntries(slices.map((slice) => [slice.id, slice.code]));
  const choices = pairChoices(
    [
      { id: 'hash-set', label: 'Hash set', byLang: { ts: byId['hash-set'] } },
      { id: 'brute-force', label: 'Brute force', byLang: { ts: byId['brute-force'], rust: 'fn brute' } },
    ],
    [
      { id: 'ts', label: 'TS' },
      { id: 'rust', label: 'Rust' },
    ],
  );

  expect(choices.map((choice) => choice.label)).toEqual([
    'Hash set · TS',
    'Brute force · TS',
    'Brute force · Rust',
  ]);
  expect(choices[0]?.code).toContain('hash');
  expect(choices[0]?.code).not.toContain('brute');
});
