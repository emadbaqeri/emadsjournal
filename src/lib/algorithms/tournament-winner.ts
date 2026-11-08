import { type AlgoStep, type ParseResult } from './types';

export const TW_SAMPLE = {
  competitions: [
    ['Tigers', 'Owls'],
    ['Owls', 'Wolves'],
    ['Wolves', 'Tigers'],
  ] as [string, string][],
  results: [0, 0, 1],
};

export interface TwInput {
  competitions: [string, string][];
  results: number[];
}

function parseCompetitions(raw: string): ParseResult<[string, string][]> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: 'competitions needs at least one match.' };

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(parsed)) {
        return { ok: false, error: 'Couldn\'t read competitions as a list of [home, away] pairs.' };
      }
      const pairs: [string, string][] = [];
      for (const item of parsed) {
        if (!Array.isArray(item) || item.length !== 2) {
          return { ok: false, error: 'Couldn\'t read competitions as a list of [home, away] pairs.' };
        }
        pairs.push([String(item[0]).trim(), String(item[1]).trim()]);
      }
      return { ok: true, value: pairs };
    } catch {
      return { ok: false, error: 'Couldn\'t read competitions as a list of [home, away] pairs.' };
    }
  }

  const pairs: [string, string][] = [];
  for (const line of trimmed.split(/\n|;/)) {
    const text = line.trim();
    if (!text) continue;
    const vs = text.split(/\s+vs\.?\s+|\s*,\s+|\s+v\s+/i);
    if (vs.length !== 2 || !vs[0] || !vs[1]) {
      return { ok: false, error: `Couldn't read "${text}" as a home, away pair.` };
    }
    pairs.push([vs[0].trim(), vs[1].trim()]);
  }
  if (pairs.length === 0) {
    return { ok: false, error: 'competitions needs at least one match.' };
  }
  return { ok: true, value: pairs };
}

function parseResults(raw: string): ParseResult<number[]> {
  const trimmed = raw.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!trimmed) return { ok: true, value: [] };
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  const values: number[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!/^-?\d+$/.test(part)) {
      return { ok: false, error: `Couldn't read "${part}" as an integer.` };
    }
    const value = Number(part);
    if (value !== 0 && value !== 1) {
      return {
        ok: false,
        error: `results[${i}] is ${value}. Each result must be 0 (away) or 1 (home).`,
      };
    }
    values.push(value);
  }
  return { ok: true, value: values };
}

export function parseTournamentWinner(fields: {
  competitions: string;
  results: string;
}): ParseResult<TwInput> {
  const competitions = parseCompetitions(fields.competitions);
  if (!competitions.ok) return competitions;
  const results = parseResults(fields.results);
  if (!results.ok) return results;
  if (competitions.value.length !== results.value.length) {
    return {
      ok: false,
      error: `competitions has ${competitions.value.length} matches but results has ${results.value.length}.`,
    };
  }
  return { ok: true, value: { competitions: competitions.value, results: results.value } };
}

export function formatCompetitions(competitions: [string, string][]): string {
  return competitions.map(([home, away]) => `${home}, ${away}`).join('\n');
}

export function tournamentWinnerSteps(input: TwInput): AlgoStep[] {
  const { competitions, results } = input;
  const labels = competitions.map(([home, away]) => `${home} v ${away}`);
  const pts = new Map<string, number>();
  const order: string[] = [];
  let best = '';
  const board = (): NonNullable<AlgoStep['points']> =>
    order.map((name) => ({ name, points: pts.get(name) ?? 0 }));

  const steps: AlgoStep[] = [
    {
      narration: `Play ${competitions.length} matches. A win is 3 points. Press next ▸`,
      array: labels,
      points: [],
      bestTeam: '',
      vars: { leader: '""' },
    },
    {
      narration: 'Start with an empty scoreboard and no leader yet.',
      array: labels,
      points: [],
      bestTeam: '',
      vars: { leader: '""' },
    },
  ];

  for (let i = 0; i < competitions.length; i++) {
    const [home, away] = competitions[i];
    steps.push({
      narration: `Match ${i}: ${home} (home) vs ${away} (away).`,
      array: labels,
      pointers: { i },
      marks: { [i]: 'active' },
      points: board(),
      bestTeam: best,
      vars: { i, home, away, 'results[i]': results[i], leader: best || '""' },
    });
    const winner = results[i] === 1 ? home : away;
    steps.push({
      narration: `${winner} won this one. Remember: 1 means home, which is index 0 of the pair.`,
      array: labels,
      pointers: { i },
      marks: { [i]: 'compare' },
      points: board(),
      bestTeam: best,
      vars: { i, home, away, winner, 'results[i]': results[i], leader: best || '""' },
      eq: {
        text: `results[i] = ${results[i]} → ${results[i] === 1 ? 'home' : 'away'} won`,
      },
    });
    const newPts = (pts.get(winner) ?? 0) + 3;
    if (!pts.has(winner)) order.push(winner);
    pts.set(winner, newPts);
    const tookLead = newPts > (pts.get(best) ?? 0);
    if (tookLead) best = winner;
    steps.push({
      narration: tookLead
        ? `${winner} now has ${newPts} and becomes the leader.`
        : `${winner} now has ${newPts}. ${best} is still ahead.`,
      array: labels,
      pointers: { i },
      marks: { [i]: tookLead ? 'found' : 'active' },
      points: board(),
      bestTeam: best,
      vars: { i, winner, points: newPts, leader: best },
    });
  }

  steps.push({
    narration: `Return ${best}.`,
    array: labels,
    points: board(),
    bestTeam: best,
    vars: { leader: best },
    result: best,
  });
  return steps;
}
