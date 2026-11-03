---
name: "Musim Gugur di China"
description: "A photographic Sichuan and Yunnan field guide with Liquid Glass-inspired web navigation."
---

# Design System: Musim Gugur di China

## Direction

The photographs supply the autumn colors. Warm cream reading surfaces keep route details legible, while translucent navigation floats over the content. This is a CSS interpretation of Apple's Liquid Glass material, not a native Apple component or an Apple-branded product.

The interface stays in Bahasa Indonesia. Code identifiers, comments, tests, and developer documentation use English. Dates, destinations, overnight bases, and conditional itinerary branches remain sourced from the supplied PDF.

## Tokens and typography

`src/style.css` defines the fixed light color tokens. `tokens.css` supplies the spacing scale and locally hosted fonts; `base.css` provides the reset. `src/glass.css` contains the shared glass material and destination-page layout.

Geist is the active display and body face, at weights 400, 500, and 600. Headings are sentence case with compact tracking. Body text is 16px with comfortable leading; supporting labels stay readable on phones. Colors use role-based CSS variables. Warm autumn accents reconnect the destination guides with the original homepage palette.

| Role | Value |
| --- | --- |
| Page | `#fbf7ef` |
| Reading surface | `#fffcf6` |
| Primary ink | `#382d25` |
| Secondary ink | `#5a493c` |
| Link / focus accent | `#884827` |
| Glass | `#fffaf2a8` |
| Primary amber action | `#f2ce8d` |

## Material and interaction

Glass is reserved for navigation, buttons, badges, the floating date dock, and controls over photographs. A shared material combines backdrop blur, saturation, a diagonal light reflection, a bright upper rim, and a soft lower shadow. Amber glass marks the primary date action. Toolbar children stay clear to avoid stacking blur layers. Information panels use solid cream reading surfaces. Unsupported browsers receive the solid fallback first. Reduced-transparency and increased-contrast preferences remove blur and reflection. The site remains light regardless of the device color-scheme setting; the document and browser theme metadata declare only light.

Focus rings appear immediately. Interactive targets are at least 44px. The hero is manually controlled, never autoplaying. Reduced motion removes animated scrolling. Native dialogs contain focus and restore the opening control after Escape or close.

## Homepage

Nine photographs rotate through Sichuan and Yunnan in the hero. The first-night arrival summary remains directly below it. Region sections lead to destination guides; hero captions and the date picker still select itinerary days. The original 14-day journal and all overnight summaries remain available.

Desktop highlights use two columns. Phone highlights retain native horizontal scrolling. The desktop date sidebar collapses into the existing mobile picker and floating dock.

## Destination pages

A real destination photograph, title, and itinerary date lead the page. The overnight link follows immediately. A glass section navigation jumps to directions, costs, gallery, and tips.

Directions and ticket rows occupy the main desktop column; timing, tips, and cautions form the side column. They stack in reading order on phones. Costs distinguish published rates, estimates, and unconfirmed amounts in text, not color alone. Sources and the check date stay visible alongside the practical information. Route references are expanded; the source section is always visible and linked near the page introduction. Publication dates are distinct from the date information was checked.

Individual stops inherit shared park or town logistics and show their own final approach. Shared entrance charges are labeled so a traveler does not add the same ticket once per stop. Every guide links back to its actual itinerary date and overnight base.

The gallery shows locally hosted responsive photographs and opens the full frame with source and license information. Photo capture dates are separate from itinerary dates. Unknown dates and uncertain locations remain explicit. PDF reference images are labeled as user-provided document material, not newly verified field photographs.

## Preservation and verification

The redesign preserves the manual hero, every date, all 13 overnight stays, route overview, clipboard fallback, PDF download, optional user gallery, native dialog focus, and history behavior. Destination-card navigation intentionally changes from a date jump to a guide page; guide links return to the matching travel day.

Verification includes mobile widths 320, 360, and 390px, desktop 1440px, fixed light appearance under both system color preferences, reduced transparency, no-JavaScript documents, direct nested-route reloads, source/asset coverage, and aXe checks. Local evidence belongs in ignored `artifacts/`; Hallmark comparisons belong in `.hallmark/`.
