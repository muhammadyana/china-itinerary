---
name: "Musim Gugur di China"
description: "An autumn photographic field guide for an Indonesian-speaking traveler in Sichuan and Yunnan."
colors:
  autumn: "#713f2d"
  autumn-hover: "#8b5136"
  on-autumn: "#fff5e4"
  on-autumn-muted: "#ebd4b5"
  gold: "#f2cd8a"
  gold-hover: "#f9dfad"
  accent: "#9c4826"
  rust-wash: "#f3dfcb"
  focus: "#a34824"
  paper: "#fbf6ed"
  paper-2: "#f1e6d5"
  paper-3: "#e7d8bf"
  ink: "#39291f"
  ink-2: "#604a38"
  muted: "#766453"
  rule: "#e1d3be"
  rule-2: "#a18b70"
  photo-caption: "#3d281ee6"
  backdrop: "#302218c4"
  hero-clear: "#251b1200"
  hero-mid: "#251b128f"
  hero-base: "#251b12f5"
  dock-shadow: "#39291f29"
typography:
  display:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 6.5vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 54px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Bodoni Moda', Georgia, serif"
    fontSize: "35px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  section-label:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  section-title:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 58px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  highlight-title:
    fontFamily: "'Bodoni Moda', Georgia, serif"
    fontSize: "clamp(26px, 2.7vw, 38px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  label:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  small: "2px"
  control: "12px"
  card: "16px"
  dialog: "8px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.gold-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  button-quiet-hover:
    backgroundColor: "{colors.paper-2}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.sm}"
  date-choice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "12px 8px"
  date-choice-current:
    backgroundColor: "{colors.autumn}"
    textColor: "{colors.on-autumn}"
  state-conditional:
    backgroundColor: "{colors.rust-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.small}"
    padding: "2px 8px"
  state-confirmed:
    backgroundColor: "{colors.paper-3}"
    textColor: "{colors.autumn}"
  essentials-panel:
    backgroundColor: "{colors.autumn}"
    textColor: "{colors.on-autumn}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  practical-panel:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  manual-copy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.sm}"
  date-dock:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "22px"
    padding: "8px 8px calc(8px + env(safe-area-inset-bottom))"
  gallery-frame:
    rounded: "{rounded.card}"
    height: "350px"
    width: "100%"
  hero-slider:
    backgroundColor: "{colors.autumn}"
    textColor: "{colors.on-autumn}"
    rounded: "24px"
    height: "560px"
  route-highlight:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
---

# Design System: Musim Gugur di China

## Overview

**Creative North Star: "The Autumn Field Guide"**

The Autumn Field Guide opens as a photographic travel journal. Six photographs of destinations on the route lead into a compact arrival summary, a varied set of clickable destination highlights, and the full day-by-day itinerary. Geist gives the trip and day headings a contemporary voice; Bodoni Moda carries destination names and numbered stops.

Warm parchment, chestnut, terracotta, and gold keep the autumn identity. Large, naturally colored photographs alternate with text instead of sitting inside repeated boxed rows. Overnight and transport information stays prominent in a chestnut panel. Photography remains evidence-bound: capture dates and publication dates are distinct, and unknown dates stay unknown.

**Key Characteristics:**

- Six manually controlled route photographs in the hero, without autoplay.
- An arrival summary before clickable route highlights and the full itinerary.
- Varied desktop image proportions and photo-first stops on phones.
- Geist main headings, Bodoni Moda destination names, and numbered journal stops.
- Chestnut essentials, warm parchment reading surfaces, and persistent date navigation.

The current source is `src/style.css`, with shared foundations in `tokens.css` and `base.css`. Later rules in the app stylesheet override earlier versions. Frontmatter is normative; sidecar tonal ramps are generated previews rather than extra shipped CSS tokens.

## Colors

Chestnut and brown ink sit on parchment. Gold attracts the main action; terracotta organizes useful metadata.

### Primary

- **Chestnut (`autumn`)** fills selected dates and the overnight/transport panel. **Warm Chestnut (`autumn-hover`)** separates information within the dark panel and supports dark-surface hover.
- **Autumn Ivory (`on-autumn`)** and **Wheat (`on-autumn-muted`)** distinguish primary and supporting text on dark surfaces.

### Secondary

- **Harvest Gold (`gold`)** and **Light Gold (`gold-hover`)** define the main action and its hover.
- **Terracotta (`accent`)**, **Terracotta Wash (`rust-wash`)**, and **Focus Terracotta (`focus`)** distinguish dates, numbered stops, status, and keyboard focus.

### Neutral

- **Parchment (`paper`)**, **Inset Parchment (`paper-2`)**, and **Oat Paper (`paper-3`)** layer the page, practical notes, image fallbacks, and confirmed status.
- **Brown Ink (`ink`)**, **Secondary Brown (`ink-2`)**, and **Muted Umber (`muted`)** separate primary, descriptive, and supporting text.
- **Soft Rule (`rule`)** and **Strong Rule (`rule-2`)** divide content and define quiet controls or transfer connectors.
- **Photo Caption (`photo-caption`)**, **Modal Backdrop (`backdrop`)**, and **Hero Clear/Mid/Base (`hero-clear`, `hero-mid`, `hero-base`)** protect overlaid content. **Dock Shadow (`dock-shadow`)** supplies functional depth.

**The Autumn Anchor Rule.** Use chestnut for selected dates and overnight/transport essentials, gold for the main action, and terracotta for dates, stop numbers, uncertainty, and text-link hover.

## Typography

**Main and body font:** self-hosted Geist, with system-ui and sans-serif fallbacks.
**Editorial font:** self-hosted Bodoni Moda, with Georgia and serif fallbacks.

Both variable fonts use `font-display: swap`. Main headings use Geist semibold. Destination names and stop numbers use Bodoni Moda at normal weight; directions and controls remain Geist.

| Role | Application |
| --- | --- |
| `display` | Overlaid trip title, limited to 12 characters per line. It becomes 45 pixels on phones, retaining 1.02 leading. |
| `headline` | Selected-day heading, limited to 20 characters per line. It becomes 44 pixels below 960 pixels and 34 pixels with 1.08 leading below 600. |
| `title` | Journal stop headings: 35 pixels on desktop and 32 on phones. Text-only stops use 28/27 pixels on desktop/phone. |
| `section-title` | The highlights and full-itinerary introductions; 36 pixels on phones. |
| `highlight-title` | Destination names below home-page photographs; 30 pixels on tablet and 31 pixels on phones. |
| `body` | Geist reading text, with introductions and unclassified paragraphs limited to 65 characters per line. |
| `section-label` | “Cerita hari ini” and “Info praktis”; 20 pixels on phones. |
| `label` | Dates, compact links, and supporting utility information. |

**The Modern Editorial Rule.** Geist leads the trip, selected day, and practical controls. Bodoni Moda gives destination names, date numerals, stop numbers, dialogs, and the footer their editorial voice.

## Layout

The centered container remains at most 1280 pixels wide, including 40-pixel gutters. Home order is the hero slider, first-day arrival summary, nine clickable highlights grouped by Sichuan and Yunnan, full-itinerary introduction, selected-day journal, and optional user gallery. Direct date fragments scroll to the selected journal rather than requiring a pass through the home sections.

The hero is 560 pixels high on desktop, 520 below 960 pixels, and 440 below 600. Each slide fills the frame; the trip title and action stay anchored at the bottom. A linked destination/date caption sits at the upper left; the counter and previous/next buttons sit at the upper right.

Highlights are grouped under explicit Sichuan and Yunnan headings, with four destinations in Sichuan and five in Yunnan. Two prominent region buttons scroll to and focus the matching heading. Each group uses two equal desktop columns with landscape photographs; below 600 pixels it becomes a native horizontal track with 86%-width cards and proximity scroll snapping.

The full itinerary retains its sticky desktop date sidebar. On smaller screens the floating date dock replaces the sidebar. Desktop stops alternate image and text sides; the image column is wider. Phones always put the image before the stop description. Stop numbers and dashed transfer connectors provide chronology without a border around every stop.

Gutters remain 28 pixels at compact desktop widths, 24 pixels below 960, and 16 below 600. The reused spacing scale now includes 64- and 96-pixel section intervals. The arrival row keeps the first night's base visible before the highlights. The selected day's chestnut essentials panel appears immediately after its heading, ahead of the introduction and route.

## Elevation & Depth

Each hero slide has its own graduated dark overlay: translucent brown at the top, clear at 32%, translucent at 60%, and nearly opaque brown at the bottom. This protects the destination link and fixed trip copy while preserving the photograph. Captions and controls use a separate translucent surface. Native dialogs retain a translucent brown backdrop.

### Shadow Vocabulary

- **Floating dock:** `0 8px 30px var(--color-dock-shadow)` separates persistent navigation from the page.

**The Functional Lift Rule.** Use the soft dock shadow to distinguish persistent navigation from scrolling content. Reading panels and dialogs remain shadow-free.

## Shapes

The hero uses 24-pixel corners on desktop and 20 on phones. Photo frames, date rows, the essentials panel, and practical notes use `card`; controls and overlaid date labels use `control`. The date dock uses 22-pixel corners and a 14-pixel central picker. The small direction marker below a highlight is circular.

Standard dialogs retain `dialog`; compact status labels use `small`. Expanded images use `contain`. Hero crops use `cover` with a vertical focal position of 45%; journal images use aspect ratios of 1.12 on larger screens and 1.3 on phones. Highlight proportions are 1.5 on desktop and 1.04 on phones. Fine rules appear where they clarify a boundary; transfer connectors are dashed. Icons are inline rounded-stroke SVGs.

## Components

### Buttons

The main action uses gold with brown ink, semibold Geist, and a 54-pixel minimum height, reduced to 48 on phones. Quiet actions remain outlined and at least 48 pixels high; icon targets remain at least 44 pixels. Hover changes the surface color. Enabled pressed controls shift down one pixel; disabled controls lower opacity and busy controls use a progress cursor.

Keyboard focus is a three-pixel terracotta outline with a four-pixel offset. Hero controls use ivory; the hero track uses a gold outline inset into the frame. Slider buttons scroll smoothly unless reduced motion is requested, when they switch instantly. There is no automatic slide timer.

### Chips

Status is written explicitly beside its color. Conditional labels use terracotta wash; confirmed labels use chestnut on oat paper. The selected-day count uses a rounded terracotta-wash label. Highlight photographs carry a parchment date label; it is an itinerary date, not a capture date.

### Cards / Containers

The essentials panel is chestnut with ivory text and wheat metadata. A warm-chestnut rule divides sleep and transport information. Practical notes remain inset parchment, now with the shared image/panel radius. Journal stops are unboxed compositions with larger photography, numbered metadata, and notes separated by a fine rule. Missing images retain text stops with a left rule.

### Inputs / Fields

The read-only copy fallback uses parchment, brown ink, a strong one-pixel rule, and a minimum height of 48 pixels. It shares the visible-focus treatment. No validation-field style is established.

### Navigation

The header remains quiet and edge-aligned. The date sidebar, floating dock, and native day picker retain their current-date state. The arrival summary, hero captions, and highlight cards all link to dated itinerary views. Browser history and direct date fragments continue to select the correct day.

The floating dock stays inset 16 pixels from the sides and 12 from the bottom, with safe-area padding. Native dialogs restore focus. Practical notes remain native disclosures with large summary targets and rotating SVG chevrons.

### Hero Slider and Route Highlights

The hero and highlights share nine destinations from the route. Sichuan contains Jiuzhaigou, Siguniangshan, Tagong, and Yading. Yunnan contains Shangri-La, Lijiang Old Town, Blue Moon Valley, Erhai, and Dali Old Town. Hero slides alternate regions before ending in Dali, identify their region in the caption, and show Shangri-La immediately after Jiuzhaigou. The hero supports native swipe/scroll and previous/next buttons; its counter updates with the active slide. Inactive slide content is inert, and only the first image is eager. Highlight cards open the matching date. They are destination navigation, not booking or live-availability controls.

Photographs are tied to source metadata. A park-level Jiuzhaigou photograph does not prove a named lake; a Siguniangshan panorama does not prove Maobiliang or Shuangqiao. Photo source and capture-date details belong in the image/source information, separate from the itinerary date.

### User Photo Gallery

The 12-image user gallery remains below the itinerary in a native disclosure, closed by default. The header's “Galeri” control opens and scrolls to it. Lazy images sit in a horizontal track with a 16-pixel gap, 280-pixel button basis, 350-pixel-high portrait crops, and proximity scroll snapping. Images open in the accessible full-image dialog and retain natural colors.

Bipenggou images 08–10 retain “Inspirasi di luar rute” and the supplied `kapongbeer` attribution. Their presence does not add Bipenggou to the itinerary. User-photo capture dates remain unspecified. The user gallery is separate from the route-matched hero photographs.

## Do's and Don'ts

### Do:

- **Do** use route-matched photographs for the hero and highlights, with natural colors and descriptive Indonesian alt text.
- **Do** keep the arrival summary before highlights and overnight/transport essentials near the selected-day heading.
- **Do** let photographs vary in scale while preserving chronological stop order and clear transfer connections.
- **Do** preserve visible focus, at least 44-pixel interactive targets, manual slider controls, and reduced-motion behavior.
- **Do** keep capture dates separate from publication dates and retain source, license, and uncertainty notes.

### Don't:

- **Don't** add autoplay to the manually controlled hero.
- **Don't** present a publication date as a photo capture date or imply every image shows October 2026.
- **Don't** use an unspecified user-gallery image as proof of a named route destination.
- **Don't** flatten the journal into identical boxed rows or spread the dock shadow to every panel.
- **Don't** replace source gaps or conditional itinerary information with invented certainty.
