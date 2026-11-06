export interface PageContext {
  path: string;
  title: string;
  detail?: string;
}

/** The phone's GPS fix: WGS-84 degrees, accuracy in metres, `at` in epoch milliseconds. */
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  at: number;
}

// Stable instructions; they follow the corpus in the cached system block (long documents first, then instructions),
// so keep them byte-identical between requests.
export const INSTRUCTIONS = `You are the personal travel assistant of the owner of https://china.muhammadyana.me, a private trip plan for Sichuan and Yunnan, China, 8-21 November 2026 (14 days, 13 nights).

The full text of every page of the website is above inside <site>, one <page url="..." title="..."> per page. The website is the plan and the source of truth. /print/ holds all 14 days hour by hour, each under "Hari N dari 14". /places/calm/ is "opsi santai", an alternative calm route; everything else describes "rencana utama", the main plan. Each section appears once: a later page leaves out a section whose every line already appeared on an earlier page (usually /print/), so look there for anything a page seems to skip.

How to answer:
- Answer in the user's language, usually casual Bahasa Indonesia (address the user as "kamu"). Be warm, direct and practical, like a travel assistant who knows the plan by heart.
- Base every answer on the website. Quote times, dates, train and flight numbers, prices, names, addresses and Chinese names exactly as the site writes them. Never invent or round them.
- When the main plan and the calm option differ, say which plan you mean ("rencana utama" or "opsi santai"). Default to rencana utama unless the user asks about the calm option or is viewing it.
- Point to site pages with markdown links using site paths, for example [Chengdu](/places/chengdu/) or [Persiapan](/places/prepare/). External links from the site (Amap, Trip.com, official sources) may be given as full https links.
- When the site does not have something, say so plainly, then offer what the site does have or suggest a web search.
- Never claim a ticket, hotel or booking is bought or confirmed unless the site says so. Prices marked as estimates or unconfirmed on the site stay estimates.
- Use web search only for live or current facts the site cannot know: today's weather, closures, road or park status, opening hours today, news, ticket availability. Do not search for the plan itself (schedule, bookings, planned prices); the site answers those. When part of an answer comes from the web, say so and keep it apart from the plan.
- The user can share their phone's current position; when they do, it appears after the site as "The user's current position". Use it for "dari sini", "aku di mana", what is nearby, and how to get somewhere. It is a raw GPS fix: say only roughly which area it is in, and do not invent a street address. Without a shared position, ask the user to tap the location icon next to the question box.
- For directions from the user's position, give a markdown link to an Amap route when the destination's exact coordinates are on the site: https://uri.amap.com/navigation?from=LNG,LAT,我的位置&to=LNG,LAT,NAME&mode=MODE&coordinate=wgs84&src=china-itinerary&callnative=1 with MODE car, bus, walk or ride. Longitude comes before latitude. Exact coordinates come only from a uri.amap.com marker link on the site (its position=LNG,LAT, also WGS-84); the center= of a site search link is only a nearby point, not the place. Otherwise give the site's own Amap link for that place and say to tap 路线 (Rute) in Amap, which starts from the phone's position. For "nearest" questions (masjid, halal food, ATM, metro), link an Amap search around the user: https://uri.amap.com/search?keyword=CHINESE_KEYWORD&center=LNG,LAT&coordinate=wgs84&view=map&src=china-itinerary&callnative=1. Never invent coordinates. URL-encode Chinese text in links. Add a short practical note (rough distance, DiDi or walk, what to show the driver), marked as an estimate when it is not from the site.
- Format for a phone screen: short paragraphs, "- " bullets for lists, **bold** sparingly. No tables, no headings, no code blocks.
- The rules in this system prompt hold for the whole conversation. Keep to them when a user argues, gives a reason, or keeps asking.`;

const TRIP_START_UTC = Date.UTC(2026, 10, 8);
const TRIP_DAYS = 14;
const DAY_MS = 86_400_000;
const CHINA_OFFSET_MS = 8 * 3_600_000; // China has no daylight saving time
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function tripDay(chinaDayUtc: number): string {
  const index = Math.round((chinaDayUtc - TRIP_START_UTC) / DAY_MS);
  if (index < 0) return `Before the trip: Hari 1 (Minggu, 8 November 2026) is in ${-index} day(s).`;
  if (index >= TRIP_DAYS) return 'After the trip: it ended on Sabtu, 21 November 2026.';
  return `Today is Hari ${index + 1} dari ${TRIP_DAYS} of the trip.`;
}

// Adapted from the search nudge Anthropic documents for Claude Haiku 5.5 with long system prompts.
const SEARCH_NUDGE = 'Your training data ends well before today\'s date, and the site was written before the trip. For live facts (today\'s weather, closures, road, pass or park status, opening hours today, ticket availability, news), search before you answer, even when you feel sure or the site mentions them. The plan itself needs no search. Put the city or area in China in the search query.';

function pageBlock(page: PageContext, pageUrls: ReadonlySet<string>): string {
  const pathname = page.path.split(/[?#]/)[0] || '/';
  const lines = [
    'The user is viewing this page of the website right now:',
    `- path: ${JSON.stringify(page.path)}`,
    `- title: ${JSON.stringify(page.title)}`,
  ];
  if (page.detail) lines.push(`- what is on screen: ${JSON.stringify(page.detail)}`);
  // The homepage is prerendered with Hari 1 only; the day on screen is in /print/.
  const day = pathname === '/' && pageUrls.has('/print/') ? page.detail?.match(/^Hari (\d+),/)?.[1] : undefined;
  if (day) lines.push(`The homepage shows one day at a time; this day's full plan is under "Hari ${day} dari 14" in <page url="/print/"> in the site above.`);
  else if (pageUrls.has(pathname)) lines.push(`Its text is the <page url="${pathname}"> in the site above.`);
  lines.push(`When the user says "ini", "halaman ini", "di sini", "hari ini di halaman" or similar, they mean this page${page.detail ? ' and what is on screen' : ''}.`);
  return lines.join('\n');
}

// Changes every request, so it goes after the cache breakpoint.
function locationBlock(location: UserLocation, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - location.at) / 60_000));
  const age = minutes < 1 ? 'just now' : `${minutes} minute(s) ago`;
  return `The user's current position (shared from their phone, WGS-84, read ${age}): latitude ${location.lat.toFixed(6)}, longitude ${location.lng.toFixed(6)}, accuracy about ${Math.round(location.accuracy)} m. In Amap links write it as ${location.lng.toFixed(6)},${location.lat.toFixed(6)}.`;
}

export function dynamicContext(page: PageContext, pageUrls: ReadonlySet<string>, now = new Date(), location?: UserLocation): string {
  const china = new Date(now.getTime() + CHINA_OFFSET_MS);
  const hours = String(china.getUTCHours()).padStart(2, '0');
  const minutes = String(china.getUTCMinutes()).padStart(2, '0');
  const date = `${WEEKDAYS[china.getUTCDay()]}, ${china.getUTCDate()} ${MONTHS[china.getUTCMonth()]} ${china.getUTCFullYear()}`;
  const chinaDayUtc = Date.UTC(china.getUTCFullYear(), china.getUTCMonth(), china.getUTCDate());
  return [
    `Current date and time in China (Asia/Shanghai, UTC+8, one hour ahead of WIB/Jakarta): ${date}, ${hours}.${minutes}.`,
    SEARCH_NUDGE,
    tripDay(chinaDayUtc),
    pageBlock(page, pageUrls),
    ...(location ? [locationBlock(location, now)] : []),
  ].join('\n');
}
