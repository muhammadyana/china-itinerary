import { calmBookingGroups, calmDays, calmItineraryPath, calmPath, calmTrainSources, type CalmBooking } from './calm-route.ts';
import { calmSharedBookings } from './calm-costs.ts';
import { calmDayBookings } from './calm-prepare.ts';
import { sourcesSection, type Booking } from './prepare.ts';
import { cnyRange } from './costs.ts';
import { currencyText } from './currency.ts';
import { escapeHtml as e } from './render.ts';
import {
  jiuzhaigouSlots, luggageSection, luggageSources, mainTrainCard, perPerson, slotsSection, ticketsSection, timelineSection, trainBookings, trainsView,
  type TrainCard, type TrainsPage,
} from './trains.ts';

export const calmTrainsPath = '/places/calm-trains/';

// The calm option's own trains from calm-route.ts, then the main plan's trains on the days the two plans share.
const calmTrainCard = (item: CalmBooking): TrainCard => ({
  date: item.date, price: item.cost && perPerson(item.cost), title: item.item,
  facts: [['Dibuka', currencyText(item.opens)], ['Harga', currencyText(item.price)], ['Cara pesan', currencyText(item.channel)]], link: item.link,
});
const ownTrains = calmBookingGroups.flatMap(group => group.items).filter(item => item.mode === 'train');
const sharedTrains = calmSharedBookings.filter(item => trainBookings.includes(item));
const cards = [...ownTrains.map(calmTrainCard), ...sharedTrains.map(mainTrainCard)].sort((a, b) => a.date.localeCompare(b.date));
const trainDays = calmDays.filter(day => cards.some(card => card.date === day.date));

const weekdayDate = (date: string) => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Shanghai' }).format(new Date(`${date}T12:00:00+08:00`));
const list = (items: string[]) => `<ul class="prepare-list" role="list">${items.map(item => `<li>${currencyText(item)}</li>`).join('')}</ul>`;

function parkTicket(date: string) {
  const ticket = calmBookingGroups.find(group => group.id === 'tickets')?.items.find(item => item.date === date && item.item.startsWith('Jiuzhaigou'));
  if (!ticket?.cost) throw new Error(`calm-route.ts: no priced Jiuzhaigou ticket on ${date}`);
  return currencyText(cnyRange(ticket.cost));
}

// C5772's arrival and gate times are the main plan's row; the calm option enters the park the next morning.
const lateSlot = jiuzhaigouSlots[1];
const calmSlots = [
  { ...lateSlot, trains: 'C5772 07.30, lalu bus 团子出行 10.00', slot: 'Masuk 10 November, 08:00–10:00' },
];

// A calm day's own step or risk, rendered again here so each fact stays in calm-route.ts only.
const calmDay = (date: string) => {
  const day = calmDays.find(item => item.date === date);
  if (!day) throw new Error(`calm-route.ts has no day ${date}`);
  return day;
};
function stepText(date: string, time: string) {
  const step = calmDay(date).steps.find(([at]) => at === time);
  if (!step) throw new Error(`calm-route.ts: no ${time} step on ${date}`);
  return step[1];
}
function riskText(date: string, word: string) {
  const risk = calmDay(date).risks.find(text => text.includes(word));
  if (!risk) throw new Error(`calm-route.ts: no risk about ${word} on ${date}`);
  return risk;
}

// Station-to-gate facts the day plan does not carry, from the 团子出行 timetable, 12306 and OSRM, re-checked 5 November 2026.
const gateNotes = [
  stepText('2026-11-09', '10.00'),
  'Bus 10.00 juga berhenti di kawasan hotel: 千古情, 星宇大酒店, 月亮湾停车场, dan 鲁能小镇. OSRM memberi 67 menit tanpa macet untuk 91,5 km.',
  riskText('2026-11-09', '团子出行'),
  'Stasiun juga punya area ride-hail resmi. Sepakati harga mobil sebelum naik, dan jangan ikut sopir yang menghampiri di area kedatangan. Shuttle stasiun Trip.com 104850127 mengikuti jadwal kereta, tetapi harga dan jamnya belum terlihat.',
];

// Transfer facts the bookings do not carry, from the same research, plus the day plan's own station steps.
const transferNotes: Record<string, string[]> = {
  '2026-11-11': [
    'Tanpa mobil sewa pagi: bus 团子出行 dari 九寨沟口长途客运站 ke 黄龙九寨高铁站 (CNY 51) berangkat 06.20, 07.50, 08.50, lalu satu sampai dua kali per jam sampai 18.40. Ke Songpan ada bus 09.05 (CNY 52, 18 kursi pada 5 November), lalu taksi sekitar 13 km ke stasiun; tarifnya belum ada, dan tempat menitip koper di Songpan belum dicek.',
    stepText('2026-11-11', '14.14'),
    'Ada juga C5774 11.05 → 11.51; semua kereta ke Maoxian hari itu kelas dua CNY 66.',
    stepText('2026-11-11', '±15.00–15.15'),
  ],
  '2026-11-15': [
    'Stasiun Chengdu South juga dilayani metro 火车南站 (jalur 1, 7, dan 18); jalur 1 ke Tianfu Square sekitar 10 menit (WanderInChina, Juli 2026). Jam kereta pertamanya belum dicek, jadi DiDi tetap pilihan utama; OSRM memberi 9 menit tanpa macet.',
    'Dari Stasiun Lijiang ke kota tua (8,4 km menurut OSRM), catatan Ctrip Desember 2022 juga menyebut bus 16 dan 18 serta minibus biru CNY 10–15 per orang; belum dicek untuk 2026.',
  ],
};

// A day's cars and its rides to or from a station: the calm option's own bookings, or the main plan's on the shared days.
type Transfer = Pick<Booking, 'item' | 'cost' | 'mode'>;
const transfersFor = (date: string): Transfer[] => [...calmDayBookings(date), ...calmSharedBookings.filter(item => item.tripDate <= date && date <= (item.until ?? item.tripDate))]
  .filter(item => item.mode === 'car' || (item.mode !== 'train' && item.item.includes('Stasiun')));
const transferText = ({ item, cost }: Transfer) => cost ? `${item}: ${cnyRange(cost)} per ${cost.per}.` : `${item}.`;

function transferDay(day: typeof calmDays[number]) {
  const items = [...transfersFor(day.date).map(transferText), ...(transferNotes[day.date] ?? [])];
  return `<div class="prepare-group"><h3>${e(weekdayDate(day.date))}</h3>
      <p class="prepare-section-lead">${currencyText(day.transport)}</p>
      ${items.length ? list(items) : ''}
    </div>`;
}

const transfersSection = () => `<section class="prepare-section" id="transfers" aria-labelledby="transfers-title"><h2 id="transfers-title">Ke dan dari stasiun</h2>
      <p class="prepare-section-lead">Transfer di setiap hari kereta. Harga taksi dan mobil adalah acuan atau perkiraan; cek DiDi atau sepakati harga sebelum naik.</p>
      ${trainDays.map(transferDay).join('')}
    </section>`;

// The luggage section lists its own sources, so the page's source list leaves them out.
const pageSources = calmTrainSources.filter(source => !luggageSources.some(item => item.url === source.url));

const calmTrainsPage: TrainsPage = {
  path: calmTrainsPath, parent: { label: 'Opsi santai', url: calmPath }, current: 'Kereta & timeline santai', title: 'Kereta opsi santai, jam demi jam.',
  intro: `Link Trip.com untuk setiap kereta opsi santai, cara dari stasiun ke gerbang Jiuzhaigou, transfer di setiap hari kereta, aturan bagasi, dan timeline jam demi jam untuk ${trainDays.length} hari kereta.`,
  sections: [
    ticketsSection('Jam rilis tiket dalam WIB; jam kereta memakai waktu China (WIB + 1 jam). Sampai 16 November kamu sendiri, jadi satu kursi; mulai 18 November temanmu ikut, jadi dua kursi atas nama paspor masing-masing. Kereta 9, 11, dan 15 November dicek di 12306 pada 5 November 2026; 18–20 November sama dengan rencana utama.', cards),
    slotsSection('Ke gerbang Jiuzhaigou', `Opsi santai memakai satu tiket <strong>Ticket + Sightseeing Bus Ticket (Adult, Non-Chinese mainland visitors)</strong> di Trip.com: ${parkTicket('2026-11-10')} untuk 10 November, slot 08.00–10.00, dipakai pagi dari penginapan. 9 November hanya perjalanan ke gerbang tanpa masuk taman, jadi batas masuk 14.00 tidak berlaku hari itu:`, calmSlots, list(gateNotes)),
    transfersSection(),
    luggageSection(),
    timelineSection('Timeline hari kereta', trainDays.map(day => ({ date: day.date, title: `${weekdayDate(day.date)} · ${day.shortTitle}`, steps: day.steps, href: `${calmItineraryPath}#${day.date}` }))),
    sourcesSection('Kereta dan transfer opsi santai diperiksa 5 November 2026 di 12306, 团子出行, dan Trip.com; kereta 18–20 November memakai pemesanan rencana utama, dicek ulang di 12306 pada hari yang sama. Harga, jadwal, dan kursi dapat berubah; ikuti 12306 saat memesan.', pageSources),
  ],
  footer: { label: 'Kembali ke itinerary santai', url: calmItineraryPath },
};

export const calmTrainsView = () => trainsView(calmTrainsPage);
