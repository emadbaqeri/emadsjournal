import { type AlgoStep, type ParseResult, parseIntList } from './types';

export const VS_SAMPLE = {
  array: [5, 1, 22, 25, 6, -1, 8, 10],
  sequence: [1, 6, -1, 10],
};

export interface VsInput {
  array: number[];
  sequence: number[];
}

export function parseValidateSubsequence(fields: {
  array: string;
  sequence: string;
}): ParseResult<VsInput> {
  const array = parseIntList(fields.array);
  if (!array.ok) return array;
  const sequence = parseIntList(fields.sequence);
  if (!sequence.ok) return sequence;
  if (array.value.length === 0 || sequence.value.length === 0) {
    return { ok: false, error: 'array and sequence both need at least one number.' };
  }
  return { ok: true, value: { array: array.value, sequence: sequence.value } };
}

export function validateSubsequenceSteps(input: VsInput): AlgoStep[] {
  const { array, sequence } = input;
  const n = array.length;
  const m = sequence.length;
  let s = 0;
  const steps: AlgoStep[] = [
    {
      narration: `Array ${JSON.stringify(array)}, sequence ${JSON.stringify(sequence)}. Press next ▸`,
      array,
      sequence,
      sequenceIndex: 0,
      matchedSeq: 0,
    },
  ];

  for (let i = 0; i < n; i++) {
    if (s === m) {
      steps.push({
        narration: 'Sequence is already complete, so we can stop walking the array.',
        array,
        sequence,
        pointers: { i },
        sequenceIndex: s,
        matchedSeq: s,
        marks: { [i]: 'dim' },
        vars: { i, sequenceIndex: s },
      });
      break;
    }
    const match = array[i] === sequence[s];
    steps.push({
      narration: match
        ? `array[${i}] = ${array[i]} matches sequence[${s}]. Move the sequence index.`
        : `array[${i}] = ${array[i]} is not sequence[${s}] (${sequence[s]}). Leave the sequence index where it is.`,
      array,
      sequence,
      pointers: { i },
      sequenceIndex: s,
      matchedSeq: s,
      marks: { [i]: match ? 'found' : 'compare' },
      vars: { i, sequenceIndex: s, 'array[i]': array[i], 'sequence[s]': sequence[s] },
    });
    if (match) s += 1;
  }

  const ok = s === m;
  steps.push({
    narration: ok
      ? `sequenceIndex is ${s} of ${m}: the sequence is a subsequence.`
      : `sequenceIndex is ${s} of ${m}: we never found the rest of the sequence.`,
    array,
    sequence,
    sequenceIndex: s,
    matchedSeq: s,
    vars: { sequenceIndex: s },
    result: ok,
  });
  return steps;
}
