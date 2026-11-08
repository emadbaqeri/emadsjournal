export type CellMark = 'dim' | 'active' | 'found' | 'compare';

export interface HashSlot {
  value: number | null;
  used: boolean;
  probe?: boolean;
  hit?: boolean;
}

export interface PointEntry {
  name: string;
  points: number;
}

export interface AlgoStep {
  narration: string;
  array?: number[] | string[];
  arrayLabels?: Array<string | number>;
  pointers?: Record<string, number>;
  marks?: Record<number, CellMark>;
  vars?: Record<string, string | number | boolean>;
  hashSlots?: HashSlot[];
  sequence?: number[];
  sequenceIndex?: number;
  matchedSeq?: number;
  points?: PointEntry[];
  bestTeam?: string;
  result?: unknown;
  eq?: { text: string; ok?: boolean };
}

export type ParseOk<T> = { ok: true; value: T };
export type ParseErr = { ok: false; error: string };
export type ParseResult<T> = ParseOk<T> | ParseErr;

export function parseIntToken(part: string): ParseResult<number> {
  if (!/^-?\d+$/.test(part)) {
    return { ok: false, error: `Couldn't read "${part}" as an integer.` };
  }
  return { ok: true, value: Number(part) };
}

export function parseIntList(raw: string): ParseResult<number[]> {
  const trimmed = raw.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!trimmed) return { ok: true, value: [] };
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  const values: number[] = [];
  for (const part of parts) {
    const parsed = parseIntToken(part);
    if (!parsed.ok) return parsed;
    values.push(parsed.value);
  }
  return { ok: true, value: values };
}

export function firstDuplicate(values: number[]): number | undefined {
  const seen = new Set<number>();
  for (const value of values) {
    if (seen.has(value)) return value;
    seen.add(value);
  }
  return undefined;
}

export function unsignedMod(x: number, cap: number): number {
  return (x >>> 0) % cap;
}
