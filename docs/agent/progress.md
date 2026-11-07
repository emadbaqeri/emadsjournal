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
