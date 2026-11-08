#include "solution.h"

#include <stddef.h>

// Time: O(n) Space: O(1)
bool is_valid_subsequence(const int *arr, size_t arr_len, const int *seq, size_t seq_len) {
    size_t seq_idx = 0;

    for (size_t i = 0; i < arr_len; i++) {
        if (seq_idx == seq_len) {
            break;
        }

        if (arr[i] == seq[seq_idx]) {
            seq_idx += 1;
        }
    }

    return seq_idx == seq_len;
}
