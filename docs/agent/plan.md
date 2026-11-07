# Plan

Phases follow the Build Partner handover, one reviewable chunk at a time.

- Phase 0: scaffold
- Phase 1: tokens and theme
- Phase 2: shell
- Phase 3: collections
- Phase 4: templates and feed
- Phase 5: algorithm pages
- Phase 6: motion and playgrounds
- Phase 7: polish and Docker launch

## Builder defaults (recorded so they stay easy to change)

- Algorithm pages live at `/algorithms/<slug>` and stay out of the main feed unless `listInFeed: true`.
- Suggested algorithm slugs: `two-number-sum`, `validate-subsequence`, `tournament-winner`.
- Stepper editing is apply-to-recompute, not live-as-you-type.
- No persistence for solution-tab language: each page starts on TypeScript.
- Build-log entries, book notes, and problem cards are typed MDX components inside the post body, not extra collections.
- `/dev/kitchen-sink` is excluded from production nav and from the sitemap.
- Reduced-motion for clips: show poster and transcript, do not play.
- Stepper colours follow the drawn `--algo-*` tokens.
