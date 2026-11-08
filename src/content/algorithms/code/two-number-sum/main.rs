//! Two Number Sum
//! Each function returns the pair that sums to `target` (any order), or None.

use std::collections::HashSet;

/// 1. Brute force. Time: O(n^2)  Space: O(1)
pub fn two_number_sum_brute_force(list: &[i32], target: i32) -> Option<(i32, i32)> {
    for (i, &a) in list.iter().enumerate() {
        for &b in &list[i + 1..] {
            if a + b == target {
                return Some((a, b));
            }
        }
    }
    None
}

/// 2. Hash set (std::collections::HashSet). Time: O(n)  Space: O(n)
pub fn two_number_sum_hash_set(list: &[i32], target: i32) -> Option<(i32, i32)> {
    let mut store: HashSet<i32> = HashSet::new();

    for &x in list {
        if store.contains(&(target - x)) {
            return Some((target - x, x));
        }

        store.insert(x);
    }

    None
}

/// 3. Sort + two pointers. Time: O(n log n)  Space: O(n)
pub fn two_number_sum_two_pointers(list: &[i32], target: i32) -> Option<(i32, i32)> {
    if list.is_empty() {
        return None;
    }
    let mut sorted = list.to_vec();
    sorted.sort_unstable();
    let mut left = 0;
    let mut right = list.len() - 1;

    while left < right {
        let side_sum = sorted[left] + sorted[right];
        if side_sum == target {
            return Some((sorted[left], sorted[right]));
        } else if side_sum > target {
            right -= 1;
        } else {
            left += 1;
        }
    }
    None
}

fn main() {
    let list = [3, 5, -4, 8, 11, 1, -1, 6];
    println!("{:?}", two_number_sum_hash_set(&list, 10));
}

#[cfg(test)]
mod tests {
    use super::*;

    type Impl = fn(&[i32], i32) -> Option<(i32, i32)>;
    const IMPLS: [(&str, Impl); 3] = [
        ("brute_force", two_number_sum_brute_force),
        ("hash_set", two_number_sum_hash_set),
        ("two_pointers", two_number_sum_two_pointers),
    ];

    fn sorted(p: Option<(i32, i32)>) -> Option<(i32, i32)> {
        p.map(|(a, b)| (a.min(b), a.max(b)))
    }

    #[test]
    fn finds_the_pair() {
        for (name, f) in IMPLS {
            assert_eq!(
                sorted(f(&[3, 5, -4, 8, 11, 1, -1, 6], 10)),
                Some((-1, 11)),
                "{name}"
            );
        }
    }

    #[test]
    fn no_pair_returns_none() {
        for (name, f) in IMPLS {
            assert_eq!(f(&[1, 2, 3], 100), None, "{name}");
        }
    }

    #[test]
    fn does_not_reuse_same_element() {
        for (name, f) in IMPLS {
            assert_eq!(f(&[5, 1], 10), None, "{name}");
        }
    }
}
