import { expect, test } from '@playwright/test';
import {
  TNS_SAMPLE,
  parseTwoNumberSum,
  twoNumberSumSteps,
} from '../../src/lib/algorithms/two-number-sum';
import {
  VS_SAMPLE,
  parseValidateSubsequence,
  validateSubsequenceSteps,
} from '../../src/lib/algorithms/validate-subsequence';
import {
  TW_SAMPLE,
  formatCompetitions,
  parseTournamentWinner,
  tournamentWinnerSteps,
} from '../../src/lib/algorithms/tournament-winner';

function lastResult<T>(steps: { result?: T }[]): T | undefined {
  for (let i = steps.length - 1; i >= 0; i--) {
    if ('result' in steps[i]) return steps[i].result as T;
  }
  return undefined;
}

test.describe('two number sum', () => {
  test('parses the default sample', () => {
    const parsed = parseTwoNumberSum({
      array: '3, 5, -4, 8, 11, 1, -1, 6',
      target: '10',
    });
    expect(parsed).toEqual({ ok: true, value: TNS_SAMPLE });
  });

  test('rejects a duplicate integer', () => {
    const parsed = parseTwoNumberSum({ array: '1, 2, 1', target: '3' });
    expect(parsed).toEqual({
      ok: false,
      error: '1 appears twice. This problem needs distinct integers.',
    });
  });

  test('rejects a non-integer token', () => {
    const parsed = parseTwoNumberSum({ array: '3, ten, 8', target: '10' });
    expect(parsed).toEqual({
      ok: false,
      error: 'Couldn\'t read "ten" as an integer.',
    });
  });

  test('hash-set sample finds [11, -1] in a 16-slot table', () => {
    const steps = twoNumberSumSteps('hashSet', TNS_SAMPLE);
    const withSlots = steps.find((step) => step.hashSlots);
    expect(withSlots?.hashSlots).toHaveLength(16);
    expect(lastResult(steps)).toEqual([11, -1]);
  });

  test('brute force and sort-plus-two-pointers find the same pair', () => {
    expect(lastResult(twoNumberSumSteps('bruteForce', TNS_SAMPLE))).toEqual([11, -1]);
    expect(lastResult(twoNumberSumSteps('twoPointers', TNS_SAMPLE))).toEqual([-1, 11]);
  });
});

test.describe('validate subsequence', () => {
  test('parses the default sample', () => {
    const parsed = parseValidateSubsequence({
      array: '5, 1, 22, 25, 6, -1, 8, 10',
      sequence: '1, 6, -1, 10',
    });
    expect(parsed).toEqual({ ok: true, value: VS_SAMPLE });
  });

  test('rejects an empty side', () => {
    const parsed = parseValidateSubsequence({ array: '', sequence: '1' });
    expect(parsed).toEqual({
      ok: false,
      error: 'array and sequence both need at least one number.',
    });
  });

  test('rejects a non-integer token', () => {
    const parsed = parseValidateSubsequence({ array: '1, ten', sequence: '1' });
    expect(parsed).toEqual({
      ok: false,
      error: 'Couldn\'t read "ten" as an integer.',
    });
  });

  test('sample sequence is valid', () => {
    const steps = validateSubsequenceSteps(VS_SAMPLE);
    expect(lastResult(steps)).toBe(true);
  });
});

test.describe('tournament winner', () => {
  test('parses the default sample, including bracketed results', () => {
    const parsed = parseTournamentWinner({
      competitions: formatCompetitions(TW_SAMPLE.competitions),
      results: '[0, 0, 1]',
    });
    expect(parsed).toEqual({ ok: true, value: TW_SAMPLE });
  });

  test('rejects a length mismatch', () => {
    const parsed = parseTournamentWinner({
      competitions: formatCompetitions(TW_SAMPLE.competitions),
      results: '0 0',
    });
    expect(parsed).toEqual({
      ok: false,
      error: 'competitions has 3 matches but results has 2.',
    });
  });

  test('rejects a result that is not 0 or 1', () => {
    const parsed = parseTournamentWinner({
      competitions: formatCompetitions(TW_SAMPLE.competitions),
      results: '0, 2, 1',
    });
    expect(parsed).toEqual({
      ok: false,
      error: 'results[1] is 2. Each result must be 0 (away) or 1 (home).',
    });
  });

  test('sample winner is Wolves', () => {
    const steps = tournamentWinnerSteps(TW_SAMPLE);
    expect(lastResult(steps)).toBe('Wolves');
  });
});
