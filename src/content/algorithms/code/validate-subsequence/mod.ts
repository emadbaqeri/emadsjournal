// Validate Subsequence
// Is `sequence` a subsequence of `array`? (same order, not necessarily adjacent)

// Time: O(n)  Space: O(1)
export function isValidSubsequence(array: number[], sequence: number[]): boolean {
  let sequenceIndex = 0;

  for (const arrayValue of array) {
    if (sequenceIndex === sequence.length) {
      break;
    }

    if (arrayValue === sequence[sequenceIndex]) {
      sequenceIndex += 1;
    }
  }

  return sequenceIndex === sequence.length;
}
