---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/render.ts", "src/style.css", "src/main.ts", "src/itinerary.ts"]
---

# Itinerary landing page

## Strategy
Lead with destinations on the actual 14-day route, then make the daily itinerary easy to enter. Preserve the first-night answer near the top: arrival in Chengdu, overnight in Jiuzhaigou. The PDF remains authoritative for dates, transport, overnight bases, and uncertainty.

## Concept
A photographic travel journal in the established autumn palette. Nine route photographs introduce both Sichuan and Yunnan. Geist headings, Bodoni Moda destination names, clearly named regions, and alternating daily stops give the page a less rigid rhythm while preserving practical information.

## Composition
Home order is the nine-photo hero, compact arrival summary, two named regional highlight groups, full-itinerary introduction, selected-day journal, and the 12-image user gallery. Sichuan includes Jiuzhaigou, Siguniangshan, Tagong, and Yading. Yunnan includes Shangri-La, Lijiang Old Town, Blue Moon Valley, Erhai, and Dali Old Town. Each destination opens its matching itinerary date.

The hero uses native horizontal scrolling with mandatory snap, previous/next controls, and a live counter. It has no autoplay. Heights are 560 pixels desktop, 520 below 960, and 440 below 600. The title stays anchored over the photos. Each regional group uses two desktop columns and an 86%-width swipe track on phones. Region navigation scrolls to and focuses the matching heading. Hero slides alternate provinces before ending in Dali and identify the region in every caption. Daily photographs alternate sides on desktop and precede text on phones. Overnight and transport sit in a prominent chestnut panel immediately after the day heading.

## Interaction and fidelity
Date fragments and Back continue to restore the selected day; direct date links scroll to the full itinerary. Inactive hero slides are inert. Previous/next scrolling respects reduced motion. The gallery remains a closed native disclosure with lazy images and full-image dialogs. Its 12 user photos retain unknown capture dates; Bipenggou remains inspiration outside the route.

Photo metadata distinguishes capture from publication. Only the Siguniangshan highlight has a verified October 2026 capture. Jiuzhaigou is from November 2025, Erhai from February 2026, Tagong from 2018, and Luorong from 2012; Blue Moon Valley's capture date is unknown. Park-level photos do not establish named-lake or exact-viewpoint identity.

## Authority and evidence
The latest request authorizes the destination-led home, manual nine-photo slider and explicit Sichuan/Yunnan groups, and photographic journal. The existing fonts, palette, overnight data, and factual status remain. The current contract is in `index.html`; system tokens are in `DESIGN.md`. Photo evidence is in `source/highlight-photos/manifest.json` and `SOURCE-NOTES.md`. The updated release at `https://china.muhammadyana.me` passed public HTTPS and mobile checks at 360/390 px on 3 November 2026.
