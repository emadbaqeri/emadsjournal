import {
  type AlgoStep,
  type HashSlot,
  type ParseResult,
  firstDuplicate,
  parseIntList,
  parseIntToken,
  unsignedMod,
} from './types';

export const TNS_SAMPLE = {
  array: [3, 5, -4, 8, 11, 1, -1, 6],
  target: 10,
};

export type TnsApproach = 'bruteForce' | 'hashSet' | 'twoPointers';

export const TNS_APPROACHES: { id: TnsApproach; title: string }[] = [
  { id: 'bruteForce', title: 'Brute force' },
  { id: 'hashSet', title: 'Hash set' },
  { id: 'twoPointers', title: 'Sort + two pointers' },
];

export interface TnsInput {
  array: number[];
  target: number;
}

const show = (v: number) => (v < 0 ? `(${v})` : String(v));

export function parseTwoNumberSum(fields: {
  array: string;
  target: string;
}): ParseResult<TnsInput> {
  const array = parseIntList(fields.array);
  if (!array.ok) return array;
  const target = parseIntToken(fields.target.trim());
  if (!target.ok) return target;
  const duplicate = firstDuplicate(array.value);
  if (duplicate !== undefined) {
    return {
      ok: false,
      error: `${duplicate} appears twice. This problem needs distinct integers.`,
    };
  }
  return { ok: true, value: { array: array.value, target: target.value } };
}

function marksDimBefore(i: number, n: number): NonNullable<AlgoStep['marks']> {
  const marks: NonNullable<AlgoStep['marks']> = {};
  for (let k = 0; k < i && k < n; k++) marks[k] = 'dim';
  return marks;
}

function allDim(n: number): NonNullable<AlgoStep['marks']> {
  const marks: NonNullable<AlgoStep['marks']> = {};
  for (let k = 0; k < n; k++) marks[k] = 'dim';
  return marks;
}

function outside(left: number, right: number, n: number): NonNullable<AlgoStep['marks']> {
  const marks: NonNullable<AlgoStep['marks']> = {};
  for (let k = 0; k < n; k++) {
    if (k < left || k > right) marks[k] = 'dim';
  }
  return marks;
}

function hashSlotsFrom(seen: number[], cap: number, lookup?: number, hit?: number): HashSlot[] {
  const slots: HashSlot[] = Array.from({ length: cap }, () => ({ value: null, used: false }));
  for (const value of seen) {
    let i = unsignedMod(value, cap);
    while (slots[i].used) i = (i + 1) % cap;
    slots[i] = { value, used: true };
  }
  if (lookup !== undefined && cap > 0) {
    let i = unsignedMod(lookup, cap);
    let guard = 0;
    while (guard < cap) {
      slots[i] = { ...slots[i], probe: true, hit: slots[i].used && slots[i].value === lookup };
      if (!slots[i].used || slots[i].value === lookup) break;
      i = (i + 1) % cap;
      guard += 1;
    }
  }
  if (hit !== undefined && cap > 0) {
    let i = unsignedMod(hit, cap);
    let guard = 0;
    while (guard < cap) {
      if (slots[i].used && slots[i].value === hit) {
        slots[i] = { ...slots[i], hit: true, probe: true };
        break;
      }
      if (!slots[i].used) break;
      i = (i + 1) % cap;
      guard += 1;
    }
  }
  return slots;
}

function intro(input: TnsInput): AlgoStep {
  return {
    narration: `Array ${JSON.stringify(input.array)}, target ${input.target}. Press next ▸`,
    array: input.array,
  };
}

function bruteForce(input: TnsInput): AlgoStep[] {
  const { array, target } = input;
  const steps: AlgoStep[] = [intro(input)];
  let checks = 0;
  const n = array.length;
  for (let i = 0; i < n; i++) {
    steps.push({
      narration: `Outer loop: fix i = ${i}.`,
      array,
      pointers: { i },
      marks: marksDimBefore(i, n),
      vars: { i, iValue: array[i], 'pair checks': checks },
    });
    for (let j = i + 1; j < n; j++) {
      steps.push({
        narration: `Inner loop: j = ${j} (only positions after i, so no pair twice).`,
        array,
        pointers: { i, j },
        marks: { ...marksDimBefore(i, n), [i]: 'active', [j]: 'compare' },
        vars: { i, j, iValue: array[i], jValue: array[j], 'pair checks': checks },
      });
      checks += 1;
      const sum = array[i] + array[j];
      const ok = sum === target;
      steps.push({
        narration: ok ? 'Match!' : 'Not the target, keep going.',
        array,
        pointers: { i, j },
        marks: { ...marksDimBefore(i, n), [i]: 'active', [j]: 'compare' },
        vars: { i, j, iValue: array[i], jValue: array[j], 'pair checks': checks },
        eq: {
          text: `${array[i]} + ${show(array[j])} = ${sum}${ok ? ' === ' : ' ≠ '}${target}`,
          ok,
        },
      });
      if (ok) {
        steps.push({
          narration: `Return the pair after ${checks} checks.`,
          array,
          pointers: { i, j },
          marks: { [i]: 'found', [j]: 'found' },
          vars: { i, j, 'pair checks': checks },
          result: [array[i], array[j]],
        });
        return steps;
      }
    }
  }
  steps.push({
    narration: `Checked all ${checks} pairs (n(n−1)/2). No match.`,
    array,
    marks: allDim(n),
    vars: { 'pair checks': checks },
    result: null,
  });
  return steps;
}

function hashSet(input: TnsInput): AlgoStep[] {
  const { array, target } = input;
  const cap = Math.max(array.length * 2, 2);
  const seen: number[] = [];
  const steps: AlgoStep[] = [
    intro(input),
    {
      narration: 'Start with an empty set of numbers seen so far.',
      array,
      hashSlots: hashSlotsFrom(seen, cap),
      vars: { lookups: 0, 'set size': 0 },
    },
  ];
  let lookups = 0;
  const n = array.length;
  for (let i = 0; i < n; i++) {
    const x = array[i];
    const need = target - x;
    steps.push({
      narration: `Look at list[${i}] = ${x}. Its partner would be ${target} − ${show(x)} = ${need}.`,
      array,
      pointers: { i },
      marks: { ...marksDimBefore(i, n), [i]: 'active' },
      hashSlots: hashSlotsFrom(seen, cap),
      vars: { i, 'list[i]': x, 'target − list[i]': need, lookups, 'set size': seen.length },
    });
    lookups += 1;
    const hit = seen.includes(need);
    steps.push({
      narration: hit ? `${need} is already in the set: found the pair.` : `${need} hasn't been seen yet.`,
      array,
      pointers: { i },
      marks: { ...marksDimBefore(i, n), [i]: 'compare' },
      hashSlots: hashSlotsFrom(seen, cap, need, hit ? need : undefined),
      vars: { i, 'list[i]': x, 'target − list[i]': need, lookups, 'set size': seen.length },
    });
    if (hit) {
      const j = array.indexOf(need);
      steps.push({
        narration: `Return [${need}, ${x}] after ${lookups} lookups.`,
        array,
        pointers: { i },
        marks: { [j]: 'found', [i]: 'found' },
        hashSlots: hashSlotsFrom(seen, cap, undefined, need),
        vars: { lookups, 'set size': seen.length },
        result: [need, x],
      });
      return steps;
    }
    seen.push(x);
    steps.push({
      narration: `Remember ${x} for later numbers.`,
      array,
      pointers: { i },
      marks: { ...marksDimBefore(i, n), [i]: 'active' },
      hashSlots: hashSlotsFrom(seen, cap),
      vars: { i, lookups, 'set size': seen.length },
    });
  }
  steps.push({
    narration: 'One pass, no partner found.',
    array,
    marks: allDim(n),
    hashSlots: hashSlotsFrom(seen, cap),
    vars: { lookups, 'set size': seen.length },
    result: null,
  });
  return steps;
}

function twoPointers(input: TnsInput): AlgoStep[] {
  const { array, target } = input;
  const n = array.length;
  const order = array.map((value, index) => [value, index] as const).sort((a, b) => a[0] - b[0]);
  const sorted = order.map((pair) => pair[0]);
  const labels = order.map((pair) => pair[1]);
  const steps: AlgoStep[] = [
    intro(input),
    {
      narration: 'Sort (a copy) ascending: O(n log n). Small numbers left, big numbers right.',
      array: sorted,
      arrayLabels: labels,
      vars: { 'sum checks': 0 },
    },
  ];
  if (n < 2) {
    steps.push({
      narration: 'Fewer than two numbers, so there is no pair.',
      array: sorted,
      arrayLabels: labels,
      result: null,
    });
    return steps;
  }
  let left = 0;
  let right = n - 1;
  let sums = 0;
  steps.push({
    narration: 'left starts at the smallest, right at the biggest.',
    array: sorted,
    arrayLabels: labels,
    pointers: { left, right },
    vars: { left, right, 'sum checks': 0 },
  });
  while (left < right) {
    sums += 1;
    const sum = sorted[left] + sorted[right];
    const cmp = sum === target ? 0 : sum < target ? -1 : 1;
    steps.push({
      narration:
        cmp === 0
          ? 'Match!'
          : cmp < 0
            ? 'Too small: only a bigger left number can help.'
            : 'Too big: only a smaller right number can help.',
      array: sorted,
      arrayLabels: labels,
      pointers: { left, right },
      marks: {
        ...outside(left, right, n),
        [left]: cmp === 0 ? 'found' : 'compare',
        [right]: cmp === 0 ? 'found' : 'compare',
      },
      vars: { left, right, currentSum: sum, 'sum checks': sums },
      eq: {
        text: `${sorted[left]} + ${show(sorted[right])} = ${sum}${cmp === 0 ? ' === ' : cmp < 0 ? ' < ' : ' > '}${target}`,
        ok: cmp === 0,
      },
    });
    if (cmp === 0) {
      steps.push({
        narration: `Return the pair after ${sums} sum checks.`,
        array: sorted,
        arrayLabels: labels,
        pointers: { left, right },
        marks: { [left]: 'found', [right]: 'found' },
        vars: { left, right, 'sum checks': sums },
        result: [sorted[left], sorted[right]],
      });
      return steps;
    }
    if (cmp < 0) left += 1;
    else right -= 1;
  }
  steps.push({
    narration: 'Pointers met: no pair adds up to the target.',
    array: sorted,
    arrayLabels: labels,
    marks: allDim(n),
    vars: { left, right, 'sum checks': sums },
    result: null,
  });
  return steps;
}

export function twoNumberSumSteps(approach: TnsApproach, input: TnsInput): AlgoStep[] {
  if (approach === 'bruteForce') return bruteForce(input);
  if (approach === 'hashSet') return hashSet(input);
  return twoPointers(input);
}

export function twoNumberSumAllTraces(input: TnsInput): Record<TnsApproach, AlgoStep[]> {
  return {
    bruteForce: bruteForce(input),
    hashSet: hashSet(input),
    twoPointers: twoPointers(input),
  };
}
