#include "solution.h"

#include <stdlib.h>
#include <string.h>

const char *tournament_winner(const Match *matches, const int *results, size_t len) {
    const char **names = calloc(2 * len, sizeof *names);
    int *points = calloc(2 * len, sizeof *points);
    size_t count = 0;
    const char *best = NULL;
    int best_pts = 0;

    for (size_t i = 0; i < len; i++) {
        const char *w = NULL;

        if (results[i] == 1) {
            w = matches[i].home;
        } else {
            w = matches[i].away;
        }

        size_t k = 0;
        while (k < count && strcmp(names[k], w) != 0) {
            k++;
        }

        if (k == count) {
            names[count] = w;
            count++;
        }

        points[k] += 3;

        if (points[k] > best_pts) {
            best_pts = points[k];
            best = w;
        }
    }

    free(names);
    free(points);
    return best;
}
