//! Validate Subsequence
//! Is `sequence` a subsequence of `array`? (same order, not necessarily adjacent)

/// Time: O(n)  Space: O(1)
pub fn is_valid_subsequence(array: &[i32], sequence: &[i32]) -> bool {
    let mut want = sequence.iter().peekable();
    for &value in array {
        if want.peek() == Some(&&value) {
            want.next();
        }
    }

    want.peek().is_none()
}

fn main() {
    println!(
        "{}",
        is_valid_subsequence(&[5, 1, 22, 25, 6, -1, 8, 10], &[1, 6, -1, 10])
    );
}

#[cfg(test)]
mod tests {
    use super::*;
    const ARRAY: [i32; 8] = [5, 1, 22, 25, 6, -1, 8, 10];

    #[test]
    fn valid_in_order_not_adjacent() {
        assert!(is_valid_subsequence(&ARRAY, &[1, 6, -1, 10]));
    }
    #[test]
    fn valid_whole_array() {
        assert!(is_valid_subsequence(&ARRAY, &ARRAY));
    }
    #[test]
    fn invalid_wrong_order() {
        assert!(!is_valid_subsequence(&ARRAY, &[1, 6, 10, -1]));
    }
    #[test]
    fn invalid_element_used_twice() {
        assert!(!is_valid_subsequence(&ARRAY, &[22, 22]));
    }
    #[test]
    fn invalid_longer_than_array() {
        assert!(!is_valid_subsequence(&[1, 2], &[1, 2, 3]));
    }
}
