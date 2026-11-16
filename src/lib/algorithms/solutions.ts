import { pairChoices, sliceFromMarkers, type SolutionChoice } from './solution-choices';
import tnsTs from '../../content/algorithms/code/two-number-sum/mod.ts?raw';
import tnsRs from '../../content/algorithms/code/two-number-sum/main.rs?raw';
import tnsC from '../../content/algorithms/code/two-number-sum/solution.c?raw';
import vsTs from '../../content/algorithms/code/validate-subsequence/mod.ts?raw';
import vsRs from '../../content/algorithms/code/validate-subsequence/main.rs?raw';
import vsC from '../../content/algorithms/code/validate-subsequence/solution.c?raw';
import twTs from '../../content/algorithms/code/tournament-winner/mod.ts?raw';
import twRs from '../../content/algorithms/code/tournament-winner/main.rs?raw';
import twC from '../../content/algorithms/code/tournament-winner/solution.c?raw';

export interface SolutionSet {
  ts: string;
  rust: string;
  c: string;
}

const SOLUTIONS: Record<string, SolutionSet> = {
  'two-number-sum': { ts: tnsTs, rust: tnsRs, c: tnsC },
  'validate-subsequence': { ts: vsTs, rust: vsRs, c: vsC },
  'tournament-winner': { ts: twTs, rust: twRs, c: twC },
};

export function getSolutions(slug: string): SolutionSet | undefined {
  return SOLUTIONS[slug];
}

const LANGUAGES = [
  { id: 'ts', label: 'TS', lang: 'ts', filename: 'mod.ts' },
  { id: 'rust', label: 'Rust', lang: 'rust', filename: 'main.rs' },
  { id: 'c', label: 'C', lang: 'c', filename: 'solution.c' },
] as const;

function langCode(set: SolutionSet, id: string): string {
  if (id === 'ts') return set.ts;
  if (id === 'rust') return set.rust;
  return set.c;
}

function markedCode(source: string, markers: { id: string; start: string }[]): Record<string, string> {
  const slices = sliceFromMarkers(
    source,
    markers.map((marker) => ({ ...marker, label: marker.id })),
  );
  return Object.fromEntries(slices.map((slice) => [slice.id, slice.code]));
}

export function getSolutionChoices(slug: string): SolutionChoice[] {
  const set = SOLUTIONS[slug];
  if (!set) return [];

  if (slug === 'two-number-sum') {
    const ts = markedCode(set.ts, [
      { id: 'brute-force', start: '// 1. Brute force' },
      { id: 'hash-set', start: '// 2. Hash set' },
      { id: 'two-pointers', start: '// 3. Sort + two pointers' },
    ]);
    const rust = markedCode(set.rust, [
      { id: 'brute-force', start: '/// 1. Brute force' },
      { id: 'hash-set', start: '/// 2. Hash set' },
      { id: 'two-pointers', start: '/// 3. Sort + two pointers' },
    ]);
    const c = markedCode(set.c, [
      { id: 'brute-force', start: 'two_number_sum_brute_force' },
      { id: 'hash-set', start: 'two_number_sum_hash_set' },
      { id: 'two-pointers', start: 'two_number_sum_two_pointers' },
    ]);
    const by = (id: string) => ({
      ts: ts[id] || set.ts,
      rust: rust[id] || set.rust,
      c: c[id] || set.c,
    });
    return pairChoices(
      [
        { id: 'hash-set', label: 'Hash set', byLang: by('hash-set') },
        { id: 'two-pointers', label: 'Sort + two pointers', byLang: by('two-pointers') },
        { id: 'brute-force', label: 'Brute force', byLang: by('brute-force') },
      ],
      [...LANGUAGES],
    );
  }

  const label = slug === 'validate-subsequence' ? 'One pass' : slug === 'tournament-winner' ? 'Scoreboard' : 'Solution';
  return pairChoices(
    [
      {
        id: 'solution',
        label,
        byLang: Object.fromEntries(LANGUAGES.map((lang) => [lang.id, langCode(set, lang.id)])),
      },
    ],
    [...LANGUAGES],
  );
}
