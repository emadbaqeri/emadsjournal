// Two Number Sum
// Each function returns the pair that sums to target (any order), or undefined.

// 1. Brute force
// Time: O(n^2)  Space: O(1)
export function twoNumberSumBruteForce(
  list: Array<number>,
  target: number,
): [number, number] | undefined {
  for (let i = 0; i < list.length; i++) {
    const iValue = list[i];
    for (let j = i + 1; j < list.length; j++) {
      const jValue = list[j];
      if (iValue + jValue === target) {
        return [iValue, jValue];
      }
    }
  }
  return undefined;
}

// 2. Hash set
// Time: O(n)  Space: O(n)
export function twoNumberSumHashSet(
  list: Array<number>,
  target: number,
): [number, number] | undefined {
  const store: Set<number> = new Set();

  for (let i = 0; i < list.length; i++) {
    if (store.has(target - list[i])) {
      return [target - list[i], list[i]];
    }
    store.add(list[i]);
  }
  return undefined;
}

// 3. Sort + two pointers
// Time: O(n log n)  Space: O(n)
export function twoNumberSumTwoPointers(
  list: Array<number>,
  target: number,
): [number, number] | undefined {
  const sorted = [...list].sort((a, b) => a - b);
  let left = 0;
  let right = list.length - 1;

  while (left < right) {
    const sideSum = sorted[left] + sorted[right];
    if (sideSum === target) {
      return [sorted[left], sorted[right]];
    } else if (sideSum < target) {
      left += 1;
    } else if (sideSum > target) {
      right -= 1;
    }
  }
  return undefined;
}
