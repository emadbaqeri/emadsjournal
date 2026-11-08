#include "solution.h"

#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int *copy_array(const int *list, size_t len) {
    int *copy = malloc(len * sizeof *copy);
    if (copy == NULL) {
        return NULL;
    }

    memcpy(copy, list, len * sizeof *copy);

    return copy;
}

static int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

typedef struct {
    int *keys;
    bool *used;
    size_t cap;
} IntSet;

static bool set_new(IntSet *s, size_t cap) {
    s->cap = cap;
    s->keys = calloc(cap, sizeof *s->keys);
    s->used = calloc(cap, sizeof *s->used);

    if (s->keys == NULL || s->used == NULL) {
        fprintf(stderr, "could not allocate set\n");
        free(s->keys);
        free(s->used);
        return false;
    }

    return true;
}

static size_t hash(int x, size_t cap) { return (size_t)(unsigned)x % cap; }

static void set_insert(IntSet *s, int x) {
    size_t i = hash(x, s->cap);
    while (s->used[i]) {
        if (s->keys[i] == x) {
            return;
        }
        i = (i + 1) % s->cap;
    }

    s->keys[i] = x;
    s->used[i] = true;
}

static bool set_contains(const IntSet *s, int x) {
    size_t i = hash(x, s->cap);
    while (s->used[i]) {
        if (s->keys[i] == x) {
            return true;
        }
        i = (i + 1) % s->cap;
    }
    return false;
}

static void set_free(IntSet *s) {
    free(s->keys);
    free(s->used);
    s->keys = NULL;
    s->used = NULL;
    s->cap = 0;
}

bool two_number_sum_brute_force(const int *list, size_t len, int target, int out[2]) {
    for (size_t i = 0; i < len; i++) {
        for (size_t j = i + 1; j < len; j++) {
            if (list[i] + list[j] == target) {
                out[0] = list[i];
                out[1] = list[j];
                return true;
            }
        }
    }

    return false;
}

bool two_number_sum_hash_set(const int *list, size_t len, int target, int out[2]) {
    if (len < 2) {
        return false;
    }
    IntSet store;
    if (!set_new(&store, len * 2)) {
        return false;
    }
    for (size_t i = 0; i < len; i++) {
        if (set_contains(&store, target - list[i])) {
            out[0] = target - list[i];
            out[1] = list[i];

            return true;
        }
        set_insert(&store, list[i]);
    }

    set_free(&store);
    return false;
}

bool two_number_sum_two_pointers(const int *list, size_t len, int target, int out[2]) {
    if (len < 2) {
        return false;
    }

    int *sorted = copy_array(list, len);

    if (sorted == NULL) {
        return false;
    }

    qsort(sorted, len, sizeof *sorted, cmp_int);

    size_t left = 0;
    size_t right = len - 1;

    while (left < right) {
        int sum = sorted[left] + sorted[right];
        if (sum == target) {
            out[0] = sorted[left];
            out[1] = sorted[right];
            free(sorted);
            return true;
        } else if (sum < target) {
            left += 1;
        } else {
            right -= 1;
        }
    }

    free(sorted);
    return false;
}
