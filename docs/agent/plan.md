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

- Desktop layout from `1024px` up (`--breakpoint-desktop` in `src/styles/breakpoints.css`); below that, use the 390 mobile layout. Chosen because the drawn desktop main + aside (718 + 400 plus gap and margins) cannot sit usefully below ~1024. No tablet layout.
- Theme toggle cycles `dark` → `light` → `system` → `dark` and writes `localStorage['emaaad-theme']`. It is an Astro component with a bundled script (no UI framework yet); it runs on load, matching the `client:load` intent.
- Until the Phase 2 header exists, the toggle lives on `/dev/kitchen-sink`. Mobile placement for the real header: inside the `menu ≡` panel.
- `/dev/kitchen-sink` also sends `noindex`.

- Mobile nav uses a no-JS `details`/`summary` control labelled `menu ≡`. The open panel overlays below the header rather than pushing content. Theme toggle lives in the desktop nav and inside that mobile panel.
- Theme toggle label matches the drawing (`◐ theme`) and uses `--color-terminal-fg` (mint in dark, as drawn). Current preference is exposed via `aria-label` only.

- Phase 3 adds thin `/posts/[...slug]` pages so RSS links resolve and production builds can omit drafts. Designed PostLayout variants still land in Phase 4.
- `getFeedPosts()` always drops drafts (RSS, `/posts` list). `getPosts()` includes drafts only when `import.meta.env.PROD` is false, so local `astro dev` can preview them.
