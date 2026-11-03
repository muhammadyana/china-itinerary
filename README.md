# Autumn in China

A static travel guide with a Bahasa Indonesia interface for 8–21 November 2026. Built with Vite, TypeScript, semantic HTML, and plain CSS.

Public website: [china.muhammadyana.me](https://china.muhammadyana.me). The release with the destination slider and highlights has been verified at this public URL, including mobile layouts at 360 and 390 px.

## Run locally

```sh
git clone https://github.com/muhammadyana/china-itinerary.git
cd china-itinerary
npm install
npm run dev
```

## Build and preview production

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Open <http://127.0.0.1:4173/>. To jump directly to 20 November, open <http://127.0.0.1:4173/#2026-11-20>.

Upload the contents of `dist/` to a static host. Assets use relative paths; the site requires no backend, API keys, third-party font loading, or runtime image service. The PDF is downloaded only when its link is opened.

## Update the itinerary

`src/itinerary.ts` is the single source of truth for dates, places with stable IDs, captions, photos, credits, transfers, practical notes, and overnight stays. The date picker, route overview, nine regional highlights, hero, and daily view share this data. `src/render.ts` renders the same HTML during the build and when a date is selected. `src/main.ts` handles DOM interactions, dialogs, the clipboard, and URL history.

The initial page is prerendered so the first day and PDF link remain available without JavaScript. Selecting a day requires JavaScript. Each date uses a `#YYYY-MM-DD` fragment; Back/Forward restores the corresponding date.

## Testing

```sh
npm run test:e2e
```

Playwright uses local Google Chrome and installed Chromium in GitHub Actions. This command builds the site and starts a production preview if no server is already running on port 4173. Tests cover 360, 390, and 1440 px layouts, all dates and overnight stays, reaching 20 November in two taps, reload/Back navigation, dialog focus, clipboard copying and its fallback, aXe accessibility checks, WebP assets, and a throttled mobile network.

Test evidence is stored in `artifacts/`: screenshots, JSON test results, aXe results, and network records. Sources and evidence limitations are documented in `SOURCE-NOTES.md`. The design review is in `artifacts/finish-review.md`.

The local `artifacts/` directory is excluded from Git. GitHub Actions uploads test results as workflow artifacts. The visual system is documented in [DESIGN.md](DESIGN.md), with components and tokens in `.impeccable/design.json`.

## Information limits

Times and prices follow the PDF rather than live schedules. The source confirms arrival at TFU on 8 November at 12:20. Trains, transfers, park access, local mosques, and the return flight time require confirmation as described on the page. Booked accommodation names were not provided, so the guide displays overnight areas.

Photos without sufficient evidence of permission to reuse them are not published as web assets. Their destinations remain available as text; missing photos and replacement sources are documented in `SOURCE-NOTES.md` and the page’s source section. CC BY / CC BY-SA photos retain attribution, license links, and resize/crop notices. No AI-generated images are used.

Previous link checks: 12306 and two Jiuzhaigou pages returned HTTP 200. Three original Klook links rejected automated access with HTTP 403; package availability remains unverified. Details are stored in `artifacts/external-links.json`.

## Homepage and travel journal

The homepage has nine hero slides and two explicitly named destination groups. Sichuan includes Jiuzhaigou, Siguniangshan, Tagong, and Yading. Yunnan includes Shangri-La, Lijiang Old Town, Blue Moon Valley, Lake Erhai, and Dali Old Town. Region buttons scroll to and focus the matching heading. Each card opens its itinerary date; Shangri-La and Lijiang both link to 18 November. Hero slides alternate provinces before ending in Dali, display the region in their captions, and support swipe and previous/next controls without autoplay.

Use English for code identifiers, comments, test descriptions, and developer-facing messages. User-facing interface copy remains Bahasa Indonesia.

The arrival summary appears immediately after the hero, before the destination highlights: start in Chengdu and stay overnight in Jiuzhaigou. The full itinerary follows the highlights. Links such as `#2026-11-20` directly select and display that day. Daily journal photos alternate sides on desktop; on phones, each photo appears before its destination description. Overnight and transport summaries appear near the day heading.

A separate gallery contains 12 user-supplied photos. The **Gallery** button, labeled **Galeri** in the interface, opens this initially collapsed section. Three Bipenggou photos retain the kapongbeer attribution from the user’s screenshot and are labeled as inspiration outside the PDF route. Capture dates for user-supplied photos remain unknown. Their source manifest is at `source/user-photos/manifest.json`.

The homepage uses six sourced highlight assets and existing destination photos. Lijiang uses an archival rooftop panorama by Franklin David; Dali uses fei wang’s illuminated South Gate image. Both retain source and license credits; neither is presented as an October 2026 capture. Only the Siguniangshan photo has a verified October 2026 capture date: 14 October. The Jiuzhaigou photo was taken on 6 November 2025, Erhai on 20 February 2026, Tagong in June 2018, and Luorong in October 2012. The Blue Moon Valley capture date is unavailable. Sources, licenses, and publication dates are documented in `source/highlight-photos/manifest.json` and `SOURCE-NOTES.md`.

The design retains Geist, Bodoni Moda, the chestnut/cream/terracotta/gold palette, and floating date navigation. Highlight revision evidence is in `artifacts/highlights-verification.md`; public deployment evidence is in `artifacts/deployment/receipt.json`.

## Verified deployment

The highlights and slider are live at [china.muhammadyana.me](https://china.muhammadyana.me). The build and 11 browser tests pass; public checks at 360/390 px also pass. HTTPS, assets, evidence, and rollback details are in the [deployment guide](ops/README.md).

## GitHub Actions and Nginx

The [Test and deploy](.github/workflows/deploy.yml) workflow runs on pull requests and pushes to `main`. CI installs Node 24, runs the build and browser tests, and packages a verified static archive. Only pushes to `main` or manual runs on `main` can deploy to the `production` environment.

Nginx serves `current/public` on the server. The dedicated deployment key is restricted to the `ops/deploy.py` handler and cannot run arbitrary shell commands. The handler validates the archive and hashes, activates the release atomically, checks origin HTTPS, and restores the previous release if verification fails. The workflow also checks the commit marker over public HTTPS.

Nginx configuration: [ops/nginx.conf](ops/nginx.conf). Installation, environment secrets, and rollback: [ops/README.md](ops/README.md). Raw photos, build archives, local evidence, and credentials are excluded from Git; all WebP assets required for the build are in `public/`.
