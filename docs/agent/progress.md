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
- Font preload links are in `BaseLayout`; the `woff2` files land in Phase 1, so those URLs 404 until then.
