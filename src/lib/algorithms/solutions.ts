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
