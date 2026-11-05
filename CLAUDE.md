# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static travel guide (Vite + TypeScript + plain CSS, no UI framework, no client router) for an 8–21 November 2026 Sichuan/Yunnan trip, deployed to https://china.muhammadyana.me. `README.md`, `DESIGN.md` and `SOURCE-NOTES.md` describe behavior, visual system and evidence limits in detail.

## Language

- Code identifiers, comments, test descriptions, developer docs: English.
- User-facing interface copy: Bahasa Indonesia.
- Preserve source place names and Chinese characters.

## Commands

```sh
npm run dev                       # Vite dev server; /print/ and the PDF are generated on request
npm run build                     # tsc && vite build && node ops/generate-pdf.mjs
npx tsc                           # typecheck only (covers src/ only, not tests/, vite.config.ts or ops/)
npm run test:e2e                  # Playwright; builds + previews on 127.0.0.1:4173 unless a server is already there
npx playwright test tests/guides.spec.ts          # one file
npx playwright test tests/guides.spec.ts -g "…"   # one test by title
PLAYWRIGHT_PORT=4180 npm run test:e2e             # when 4173 is taken
python3 -m unittest discover -s ops -p 'test_*.py' -v   # deploy handler/packaging tests
npm run build:ask                 # bundle the trip assistant service to ops/ask/dist/ask-server.mjs
npm run check:ask                 # typecheck ops/ask/ (npx tsc does not cover it)
```

- Build and tests need local Google Chrome (Playwright `channel: 'chrome'` outside CI; CI uses installed Chromium).
- Outside CI, Playwright reuses any server already on the port. A reused `vite preview` serves the old `dist/`: rebuild after source changes.
- Tests run serially (`workers: 1`) and write JSON results to `artifacts/test-results.json` (gitignored).
- No linter or formatter is configured. Match the file's existing style (some files, e.g. `vite.config.ts`, use 1-space indentation).

## Architecture

**HTML is rendered from strings by the same modules at build time and in the browser.** `vite.config.ts` imports `src/render.ts`, `src/guide-render.ts`, `src/print-render.ts` and `src/guides.ts` in Node. These modules and everything they import must not touch `document`/`window` at module top level; DOM wiring lives in `initialize*` functions.

**Components:** build UI from small named render functions, one per component, each returning one HTML string. `src/site-navigation.ts` is the reference: data arrays (`topLinks`, `itineraryLinks`) are mapped through components (`topLink`, `panelLink`, `destinationItem`, `regionGroup`); `navMenu()` builds each dropdown, and `itineraryMenu()`, `placeMenu()` and `renderSiteNavigation()` compose them. Trip-planning pages (stays, route map, preparation, costs, trains) belong in `planningPages` (`src/site-search.ts`), which feeds both `itineraryLinks` and search, not the Tempat menu. Join lists with `''` (whitespace between inline elements shows up as gaps). Do not write a whole menu, card or section as one long template literal; split it into named pieces. Escape every interpolated text and attribute with `escapeHtml`.

**Search:** `src/site-search.ts` builds the index (place pages, itinerary days, planning pages) and renders the nav trigger and the `<dialog>` that `renderSiteNavigation()` appends; `initializeSiteSearch()` wires it from `main.ts`. Without JavaScript the trigger is a plain link to `/places/`.

**Prerender plugin (`vite.config.ts`, `prerender-itinerary`):**
- Homepage: `transformIndexHtml` replaces `<!--app-->` in `index.html` with `shell()`.
- `generateBundle` emits `places/index.html`, one `places/<slug>/index.html` per entry in `placePages`, and the script-free `print/index.html`. Per-page title, description, Open Graph, canonical and body are swapped into the `index.html` template by regex (`<!--page-start-->…<!--page-end-->`), so keep those markers and meta tag shapes intact.
- Adds `data-cfasync="false"` to module scripts (Cloudflare Rocket Loader exclusion).
- Dev middleware serves `/print/` through `ssrLoadModule` and the PDF on demand.

**Single entry `src/main.ts`:** imports all CSS, then runs the itinerary UI if `#day-view` exists, otherwise `initializeGuide()` (destination pages). Weather, currency, navigation and photo loading initialize on both.

**Data (single sources of truth):**
- `src/itinerary.ts`: `places` (stable IDs), `days` with events, `highlights`, `photos`, `userPhotos`, `bookingOptions`, `pdfPath`. `src/guide-photos-*.ts` feed extra photo records into it.
- `src/guides/*.ts`: per-region `DestinationGuide` data typed by `src/guide-types.ts` (costs carry `status: 'published' | 'estimate' | 'unconfirmed'`, sources carry optional `publishedAt`, guides carry `checkedAt`).
- `src/guides.ts`: merges region guides, drops transit stops, derives `placePages` (one page per guide plus one per additional stop), `pageBySlug`, `pageForPlace`, gallery/cover selection. A new guide or `placeIds` entry automatically gets a static page.
- `src/bookings.ts`: everything to book or pay for, by `tripDate` (`until` for multi-day items, `mode` for transport legs). The preparation page groups it by urgency; each day panel and the PDF list a date's items under "Transport & pemesanan". `src/open-trips.ts`: open trips and tours per date with an honest `fit` note. `src/day-timelines.ts`: the hour-by-hour plan per date.
- `src/weather-locations.ts`: verified coordinates per guide group. `src/chengdu-evening.ts`: first-night options shared by day view, Chengdu guide and PDF.
- `source/*.json`: provenance records for photos, coordinates and the currency snapshot (not imported by code).

**Photos:** `public/photos/<id>-<width>.webp`, one file per width in the record's `sizes`; `photoImage()` in `src/render.ts` builds `srcset`. Raw originals and the local prep scripts (`scripts/`) are gitignored.

**Runtime APIs (browser only, no keys):** Open-Meteo in `src/weather.ts`, Frankfurter ECB rate in `src/currency.ts`. Prerendered pages carry a dated static CNY→IDR rate (constant in `src/currency.ts`); weather has no static reading. Tests must stub these with `page.route(...)` (existing specs abort or fulfill them); CI must not hit live APIs. `currencyText()` escapes plain text before adding conversion markup: pass it text, never HTML.

**Trip assistant (`/api/ask/`, the only same-origin backend, optional and private):** the Node service in `ops/ask/` answers with `claude-haiku-5-5` and reads the deployed HTML (every page except `/places/ask/`) as its knowledge, so content deploys update it automatically; keep page content meaningful as plain text. `src/ask*.ts` drive the unlock page `/places/ask/` (`noindex`, deliberately left out of the menus and `planningPages`/search) and the floating widget, which mounts only after a device unlocked it (`ask-unlocked` in `localStorage`); without that flag the browser sends no `/api/ask` request, so tests need no stub. Answers become DOM nodes in `src/ask-markdown.ts`, never `innerHTML`. `npm run dev` proxies `/api/ask` to `127.0.0.1:8790`; `vite preview` does not.

**PDF:** `ops/generate-pdf.mjs` opens `/print/` in Chromium, aborts every request outside the page origin and fails on any non-OK response. Print output must use local resources only. `pdfDownloadUrl` appends a `Date.now()` cache key.

## Deployment

`.github/workflows/deploy.yml`: on PRs and pushes to `main`, run the ops unit tests (blocking), `npm run test:e2e` (non-blocking: failures only warn), a clean `npm run build` (blocking), then `ops/package.py`. Only `main` deploys, over a restricted SSH key to `ops/deploy.py` on the server.

`allowed_path()` in `ops/deploy.py` (also used by `ops/package.py`) is a strict allowlist of output paths: root `index.html`/`release.json`/icons, `assets/*.{js,css,woff2}`, `photos/*.{webp,avif}`, `places/<slug>/index.html`, `social/<photo-id>.jpg` (one card per place page, made by `ops/prepare-social-images.mjs`), two exact PDF names and `print/index.html`. Any new output path fails packaging. Adding one means updating `allowed_path()` and its coverage in `ops/test_deploy.py`, and the root-owned installed copy on the server must be updated separately before deploying (see `ops/README.md`).

The trip assistant is not part of this pipeline: `ops/ask/install.sh` installs it by hand as the `china-itinerary-ask` systemd service on `127.0.0.1:8790`, and nginx proxies `/api/ask/` to it (see "Trip assistant service" in `ops/README.md`). A static deploy needs no restart: the service rebuilds its text when `current` changes.

## Content and repo rules

- Do not add new test files or test cases (owner's rule, 4 November 2026). Keep the existing suite and make it pass; adjust an existing test only when a change breaks it.
- New research: include source URLs, applicable season and the real check date (`checkedAt`). Set `publishedAt` only for a verified publication date. Never present an old quote or temporary offer as a confirmed future price; use `estimate`/`unconfirmed`.
- Photo capture dates stay distinct from itinerary dates; unknown dates/locations stay explicit.
- Pages must work without JavaScript (prerendered content, native `<details>`, `<dialog>`, popover). Theme is light-only, with solid fallbacks for reduced transparency.
- `/source/*` is gitignored except `source/highlight-photos/manifest.json`; the tracked provenance JSONs were force-added, so new ones need `git add -f`.
