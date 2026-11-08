# Progress

## Decisions from Emad (2026-11-07)

- Footer GitHub: https://github.com/emadbaqeri
- Footer contact email: contact@emaaad.com
- Start Phase 0 now in `/Users/emad/Projects/emadsjournal`

## Phase 0

- Status: complete pending review
- `create-astro@latest` installed Astro 7. The handover asked for Astro 5; pinning 5.18.2 pulled published CVEs (including a critical image-optimizer RCE fixed in later majors). Phase 0 ships Astro 7 with the same static/MDX/sitemap setup. Content-collection snippets stay as written unless an Astro 7 API change forces a later note.
- Theme bootstrap is `public/theme-init.js`, loaded as `<script is:inline src="/theme-init.js">`. `is:inline` is required so Astro does not try to bundle a `public/` script.
- Node: latest 22 via fnm (handover: Node 22). `.node-version` is `22`.
- Font preload links are in `BaseLayout`; the `woff2` files landed in Phase 1.

## Phase 1

- Status: complete pending review
- Tokens dumped from Figma file `EZlPgKhKhlL4g3AJOuDPBp` (Emad Journal - Design System) on 2026-11-07. Retired Color/Dark and Color/Light collections were not exported. `src/tokens/tokens.css` is generated from `src/tokens/tokens.json` via `node scripts/generate-tokens.mjs` (also `npm run tokens`).
- Semantic color tokens alias primitives (`var(--primitives-…)`). Track mode tokens alias semantic color tokens so they follow dark/light automatically. Alpha primitives use the Figma hex + alpha as `rgba(...)`.
- Fonts: self-hosted Latin `woff2` for Inter (400, 400 italic, 500, 600, 700) and JetBrains Mono (400, 500, 700) in `public/fonts/`, with SIL OFL notices. No Google Fonts CDN.
- Theme toggle on `/dev/kitchen-sink`. Sitemap filter drops `/dev/` URLs.

## Phase 2

- Status: complete pending review
- SiteHeader and SiteFooter wrap every page via BaseLayout. Wordmark is `emad/journal` with the slash in `--color-accent-default`; `emad` is primary and `journal` is secondary, matching the component.
- Nav is `posts · series · about · rss` plus `◐ theme`. `/dev/kitchen-sink` is not in the nav. Footer tagline and `rss · github · email` use https://github.com/emadbaqeri and mailto:contact@emaaad.com.
- Stub routes so the nav works before collections land: `/posts`, `/series`, `/about` (placeholder line only), and an empty `/rss.xml` channel. Phase 3 will fill RSS from posts.
- Track glyphs remain in `src/lib/tracks.ts` (λ / §). They are not applied on `<html>`.

## Phase 3

- Status: complete pending review
- `src/content.config.ts` matches the handover schema, plus `series` and `seriesOrder` on algorithms. Collections: posts, series, algorithms.
- Fixtures: 3 series-posts, 3 TILs, 2 essays, 2 build-logs, 1 draft TIL, 2 series, and 3 algorithm pages (`two-number-sum`, `validate-subsequence`, `tournament-winner`) with `listInFeed: false`. Emad did not supply a real draft, so the draft is a fixture.
- `src/lib/content.ts` sorts by `publishedAt` descending and filters drafts. `/rss.xml` lists published posts only.
- Thin post pages exist so production `npm run build` can prove the draft has no HTML page and is absent from RSS and the sitemap.
- `z` is imported from `astro/zod` (Astro 7 deprecates `z` on `astro:content`). Production build: 0 errors, 0 warnings, 0 hints. Draft title “Fixture draft: unpublished notes” is absent from `dist/rss.xml`, the sitemap, and `dist/posts/`.

## Phase 4

- Status: complete pending review
- Designed templates and the home feed from Figma file `EZlPgKhKhlL4g3AJOuDPBp` (PostCard `50:253`, PageIntro `20:50`, Post Type Label `48:26`, Tag `1:508`, home `52:543`).
- Layout measures recorded in `src/styles/layout.css`: `--column-article: 680px`, `--column-main: 718px`, `--column-aside: 400px`.
- `PostLayout` variants for `series-post`, `til`, `essay`, and `build-log`. `SeriesLayout` is the Track variant (fixture series have no books kind). `BookCard`, `ReadingLogEntry`, and `ChapterNote` are available as MDX components.
- `PageLayout` is used by `/about`. The home feed is static `PostCard`s with a bundled filter script (Type AND Track via `?type=` and `?track=`). Without JS, all cards stay visible and chips are plain links.
- Section indexes: `/posts` (tag filter), `/tils` `/essays` `/build-logs` (track + topic, grouped by month), `/series` (track filter), `/series/[slug]`, `/track/[track]` (home feed with that track preselected).
- Build-log cards and headers use `publishedAt` as the started date. The schema has no repo, status, or entry-count fields, so those are omitted rather than invented.
- Featured series on the home aside is the ongoing series whose latest published part is newest. Published series parts always link; progress marks the current part (or the last part on the series page).
- MDX components passed through `<Content components={…} />`: Callout, Footnote, Figure, CodeBlock, RunnableCodeBlock (static; worker playground is Phase 6), DemoFrame (conceptual before/after strings), BuildLogEntry, and the book components.
- Series progress rail uses flex segments, no inline `style` widths (CSP-safe).
- `/algorithms` is not added in this phase.

## Phase 5

- Status: complete pending review
- Algorithm pages at `/algorithms` and `/algorithms/[slug]` using `AlgorithmLayout` (Prototype B order). Motion player omitted until clip files exist.
- Shared `viz/` primitives plus steppers for Two Number Sum, Validate Subsequence, and Tournament Winner. Models are pure TypeScript; apply-to-recompute; hash-set table capacity is `max(n * 2, 2)` (sample n=8 → 16 slots).
- Default TNS approach is hash set. Solution tabs are TS, Rust, and C (no Zig). Code snapshots live in `src/content/algorithms/code/<slug>/`.
- SeriesNav now takes generic `{ id, title, href, order }` parts so algorithm pages can sit in a series (Two Number Sum is part 3 of cs-foundations).
- Playwright model tests in `tests/algorithms/models.spec.ts` step traces and assert parse errors plus final results, not pixels. `npm test` runs those; `npm test:e2e` is reserved for later UI specs.
- Production draft fixture stays absent from the feed, indexes, RSS, and sitemap. Algorithm pages are in the sitemap and not listed on the home feed (`listInFeed: false`).
