import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { bookings, preparePath, type Booking, type Link, type Urgency } from './bookings.ts';
import { cnyRange as range, costLines, costsPath, friendShare, stayTotal, sumLines, type CostLine } from './costs.ts';

export { bookings, preparePath, type Booking } from './bookings.ts';
export { stayTotal } from './costs.ts';

// Researched and adversarially re-checked on 4 November 2026; booking windows are counted from that day.
export const preparedAt = '2026-11-04';


export const doneItems = [
  { title: 'Visa China', detail: 'Sudah disetujui.' },
  { title: 'Tiket pesawat', detail: 'Juneyao HO1568 Jakarta–Shanghai Pudong (7 November 15.45 WIB), transit semalam, lalu HO1119 ke Chengdu Tianfu (8 November 08.50–12.20). Kunming ke Jakarta (21 November) juga sudah terbit.' },
  { title: 'Alipay & WeChat Pay', detail: 'Sudah terverifikasi dengan paspor; kartu Visa dan Mastercard sudah terpasang.' },
];

export const doneList = () => `<ul class="prepare-done" role="list">${doneItems.map(item => `<li>${icon('check')}<span><strong>${e(item.title)}</strong> ${e(item.detail)}</span></li>`).join('')}</ul>`;

export const bookingRules = 'Jam dalam WIB kecuali disebut lain. Penjualan tiket kereta di 12306 dibuka 15 hari sebelumnya, termasuk hari itu. Jika paspormu belum terverifikasi di 12306, verifikasi manual bisa makan 3–5 hari kerja; pakai Trip.com atau loket stasiun di Chengdu pada 8 November.';

const urgencyGroups: { id: Urgency; title: string; lead: string }[] = [
  { id: 'now', title: 'Pesan sekarang', lead: 'Sudah dibuka dan bisa habis.' },
  { id: 'week', title: 'Dibuka minggu ini', lead: 'Pasang pengingat pada jam rilisnya.' },
  { id: 'onsite', title: 'Beli di lokasi', lead: 'Tidak perlu reservasi; bawa paspor.' },
];

// The table groups the same rounded lines as the cost breakdown page, so both show one total.
const linesPer = (per: 'orang' | 'mobil', lines: CostLine[]) => sumLines(lines.filter(line => line.booking?.cost?.per === per));
export function costRows(lines = costLines) {
  const rows = [
    { label: 'Tiket, kereta, bus, dan shuttle', basis: 'per orang', ...linesPer('orang', lines) },
    { label: 'Mobil sewa, taksi, dan transfer', basis: 'bagianmu; dari 18 November dibagi dua', ...linesPer('mobil', lines) },
    { label: 'Penginapan 13 malam', basis: 'bagianmu; kamar 17–20 November dibagi dua', ...stayTotal(lines) },
  ];
  return { rows, total: { min: rows.reduce((sum, row) => sum + row.min, 0), max: rows.reduce((sum, row) => sum + row.max, 0) } };
}

/** The cost table, the friend's share and the link to a plan's breakdown, below a section lead. */
export function costSummary(lines: CostLine[], breakdownPath: string) {
  const costs = costRows(lines);
  return `<table class="prepare-costs"><thead><tr><th scope="col">Pos</th><th scope="col">Dasar</th><th scope="col">Perkiraan</th></tr></thead><tbody>${costs.rows.map(row => `<tr><th scope="row">${e(row.label)}</th><td>${e(row.basis)}</td><td>${currencyText(range(row))}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">Total bagianmu</th><td></td><td>${currencyText(range(costs.total))}</td></tr></tfoot></table>
      <p class="prepare-section-lead">${currencyText(`Bagian temanmu mulai 17 November: tiket Yunnan, separuh kamar, dan separuh mobil atau taksi, ${range(friendShare(lines))}.`)}</p>
      <p class="prepare-link"><a href="${e(breakdownPath)}">Rincian biaya per hari${icon('right')}</a></p>
      ${renderExchangeRate()}`;
}

const shortDate = (date: string) => `${Number(date.slice(-2))} Nov`;
export const link = (target: Link) => target.url.startsWith('/') ? `<a href="${e(target.url)}">${e(target.label)}${icon('right')}</a>` : `<a href="${e(target.url)}" target="_blank" rel="noopener noreferrer">${e(target.label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;

// One card for the main plan and the calm option: `price` (plain text) sits beside the date; each fact's detail is HTML, formatted by the mapping.
export interface BookingCard { date: string; until?: string; title: string; urgency: Urgency; price?: string; facts: [string, string][]; link?: Link; id?: string }
export const mainBookingCard = (item: Booking): BookingCard => ({
  date: item.tripDate, title: item.item, urgency: item.urgency, price: item.cost ? `${range(item.cost)} / ${item.cost.per}` : undefined,
  facts: [['Cara pesan', e(item.channel)], ['Dibuka', e(item.opens)], ['Catatan', currencyText(item.note)]], link: item.link,
});
const cardDate = ({ date, until }: BookingCard) => until ? `${Number(date.slice(-2))}–${shortDate(until)}` : shortDate(date);
const fact = ([term, detail]: [string, string]) => `<div><dt>${e(term)}</dt><dd>${detail}</dd></div>`;

export function bookingCard(card: BookingCard) {
  return `<article class="prepare-booking"${card.id ? ` id="${e(card.id)}"` : ''}>
    <p class="prepare-booking-date"><time datetime="${card.date}">${cardDate(card)}</time>${card.price ? `<strong>${currencyText(card.price)}</strong>` : ''}</p>
    <h4>${e(card.title)}</h4>
    <dl>
      ${card.facts.map(fact).join('')}
    </dl>
    ${card.link ? `<p class="prepare-link">${link(card.link)}</p>` : ''}
  </article>`;
}

/** The booking cards grouped by when they can be bought; an empty group is left out. */
export const urgencySections = (cards: BookingCard[]) => urgencyGroups.map(group => {
  const items = cards.filter(card => card.urgency === group.id);
  return items.length ? `<div class="prepare-group"><h3>${group.title}<span>${group.lead}</span></h3><div class="prepare-bookings">${items.map(bookingCard).join('')}</div></div>` : '';
}).join('');

export const list = (items: string[]) => `<ul class="prepare-list" role="list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
export const section = (id: string, title: string, body: string) => `<section class="prepare-section" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2>${body}</section>`;
/** `lead` is literal interface copy. */
export const sourcesSection = (lead: string, sources: Link[]) => `<section class="guide-source-section" id="sources" aria-labelledby="prepare-sources-title"><h2 id="prepare-sources-title">Sumber</h2><p>${lead}</p><ul class="prepare-sources" role="list">${sources.map(source => `<li>${link(source)}</li>`).join('')}</ul></section>`;
export const checkedOn = (date: string) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

/** The calm option drops the Ganzi hospital, and with it this source. */
export const ganziHospitalSource: Link = { label: 'Haodf: RS Rakyat Prefektur Ganzi', url: 'https://www.haodf.com/hospital/4582614466/jieshao.html' };
export const prepareSources: Link[] = [
  { label: '12306: jam mulai penjualan per stasiun', url: 'https://www.12306.cn/index/view/infos/sale_time.html' },
  { label: '12306: jam dan tarif C984 dan C442, serta D8704 pada daftar 19 November (dicek 5 November 2026)', url: 'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc' },
  { label: 'China Railway: verifikasi paspor di 12306 (2023)', url: 'http://www.china-railway.com.cn/xwzx/ywsl/202311/t20231130_131696.html' },
  { label: 'Jiuzhaigou: pengumuman tiket habis', url: 'https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46' },
  { label: 'Xinhua Yunnan: tarif Jade Dragon dan Impression Lijiang 2026', url: 'https://www.yn.xinhuanet.com/20260702/e8f8d1a27e2845b4bf54cfc5ef8f5d36/c.html' },
  { label: 'Songzanlin: tarif shuttle internal', url: 'https://www.xgllszljq.cn/news_1/39.html' },
  { label: 'WeChat: kartu internasional di Weixin Pay', url: 'https://help.wechat.com/cgi-bin/micromsg-bin/oshelpcenter?opcode=2&id=2307252mur7f2307257zfyfe&lang=en&plat=ios&Channel=helpcenter&t=help_center/w_topic_detail' },
  { label: 'Cailian: keringanan biaya WeChat Pay 2026', url: 'https://www.cls.cn/detail/2383167' },
  { label: 'Pemerintah China: kartu asing untuk pembayaran seluler', url: 'https://www.chinaservicesinfo.com/s/202502/25/WS67bd6c5a498eec7e1f730389/using-foreign-bank-cards-for-mobile-payments-in-china.html' },
  { label: 'Bank of China: penarikan tunai kartu asing', url: 'https://www.boc.cn/english/individuals/pbk/sch/202601/t20260105_25639179.html' },
  { label: 'Travel China (MCT): kartu SIM dan jaringan', url: 'https://www.travelchina.org.cn/en/article/npJ3PCd4UDdU' },
  { label: 'GOV.UK: saran perjalanan China', url: 'https://www.gov.uk/foreign-travel-advice/china/safety-and-security' },
  { label: 'Telkomsel: katalog RoaMAX 14 September 2026', url: 'https://assets.telkomsel.com/public/2026-09/RoaMAX-Product-Catalogue-download--14092026.pdf' },
  { label: 'Selular.ID: SimpelRoam China IM3', url: 'https://selular.id/2025/12/im3-luncurkan-im3xplore-solusi-internet-simpel-untuk-liburan-akhir-tahun/' },
  { label: 'CAC: aturan koneksi internet internasional', url: 'https://www.cac.gov.cn/1996-02/02/c_126468621.htm' },
  { label: 'Pemerintah Shanghai: Amap multibahasa', url: 'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20250711/8f2fcf3c6b624a56a6b2c0d8152ea2f2.html' },
  { label: 'KBRI Beijing: FAQ dan hotline konsuler', url: 'https://kemlu.go.id/id/beijing/pelayanan-perwakilan/faq' },
  { label: 'Peduli WNI: lapor diri', url: 'https://peduliwni.kemlu.go.id/beranda.html' },
  { label: 'RRI: KJRI Chengdu masih disiapkan', url: 'https://rri.co.id/en/international/2347260/ambassador-urges-indonesians-in-chengdu-to-register-for-enhanced-protection' },
  { label: 'Travel.gc.ca: nomor darurat dan layanan kesehatan China', url: 'https://travel.gc.ca/destinations/china' },
  ganziHospitalSource,
  { label: 'China Daily: RS Rakyat Prefektur Diqing', url: 'https://chinaservicesinfo.com/s/202002/14/WS5e46a10d498ea01b9aea0fd2/designated-hospitals-and-fever-clinics-in-dechen-tibetan-autonomous-prefecture-yunnan.html' },
  { label: 'Chubb: contoh pengecualian ketinggian pada asuransi perjalanan', url: 'https://cntres-assets-ap-southeast-1-250226768838-cf675839782fd369.s3.amazonaws.com/public/2024/11/17/1731823960259-5d224036bdec9f3bf4c3929c2e8bb430.pdf' },
  { label: 'CDC: perjalanan di ketinggian', url: 'https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html' },
  { label: 'Kedutaan China: UU Keluar-Masuk Wilayah', url: 'https://us.china-embassy.gov.cn/eng/lsfw/zj/notice/201307/t20130702_4899883.htm' },
  { label: 'Pemerintah Beijing: tips sebelum berangkat (listrik)', url: 'https://english.beijing.gov.cn/travellinginbeijing/quickguideontravelservices/traveltips/202108/t20210811_2466837.html' },
];

// Payments, internet, emergency numbers, insurance and the rest hold for both plans; only these lines name the route.
export interface PlanNotes { cash: string; signal: string; hospitals: string[]; altitude: string; ascent: string }
const ganziHospital = '<div><dt>RS Rakyat Prefektur Ganzi, Kangding</dt><dd><a href="tel:+868362827682">0836-2827682</a> (gawat darurat)<span lang="zh-Hans">甘孜藏族自治州人民医院 · 康定市炉城镇西大街94号</span></dd></div>';
export const diqingHospital = '<div><dt>RS Rakyat Prefektur Diqing, Shangri-La</dt><dd><a href="tel:+868878222022">0887-8222022</a><span lang="zh-Hans">迪庆州人民医院</span></dd></div>';
const mainPlanNotes: PlanNotes = {
  cash: 'Bawa uang tunai cadangan untuk kota kecil di Ganzi dan Aba; belum ada data penerimaan kartu di Rilong, Xinduqiao, Litang atau Riwa. ATM Bank of China menerima Visa dan Mastercard, maksimal CNY 3000 per penarikan.',
  signal: ' Di 理小路 dan sebagian Yading sinyal bisa hilang.',
  hospitals: [ganziHospital, diqingHospital],
  altitude: 'Rute ini melewati Zheduo sekitar 4.300 m, tidur di Litang 4.014 m, berjalan di Yading, dan naik ke gletser Jade Dragon.',
  ascent: 'Malam 14 November naik sekitar 700 m dari Xinduqiao, jadi jangan naik bila sudah bergejala pada 13 November.',
};

export function planSections(notes: PlanNotes) {
  return `    ${section('payments', 'Membayar', list([
      'Alipay dan WeChat Pay dengan kartu asing gratis untuk transaksi sampai CNY 200; di atas itu kena biaya 3%. Penginapan di bawah CNY 183 per malam berarti satu kali bayar per malam tetap gratis biaya aplikasi; bank penerbit kartu bisa tetap mengenakan biaya kurs.',
      'WeChat Pay 2026: pengguna kartu asing yang baru pertama kali membayar bebas biaya 3% sampai CNY 1000 per hari selama 90 hari.',
      'Batas Alipay dengan kartu asing: US$5.000 per transaksi dan US$50.000 per tahun.',
      notes.cash,
    ].map(currencyText)))}
    ${section('internet', 'Internet di China', list([
      'Google (termasuk Gmail dan Maps), WhatsApp, Instagram dan YouTube tidak bisa dibuka lewat jaringan lokal China.',
      'Roaming Indonesia: Telkomsel RoaMAX China, misalnya 29+1 GB untuk 10 hari Rp370.000 atau 39+1 GB untuk 15 hari Rp470.000 (katalog 14 September 2026); IM3 SimpelRoam China sekitar 20 GB untuk 10 hari Rp320.000. Operator tidak menyatakan apakah WhatsApp dan Google terbuka lewat roaming; uji begitu mendarat di Pudong pada 7 November malam dan siapkan cadangan.',
      'Kartu SIM lokal: loket China Telecom ada di Terminal 1 Tianfu, sedangkan kamu tiba di Terminal 2. Pos layanan 24 jam di luar kedatangan internasional Terminal 2 Pudong juga menjual SIM, tetapi belum pasti buka pukul 00.30. Lebih aman pasang eSIM atau paket roaming sebelum berangkat. Nomor China berguna untuk kode SMS, tetapi tidak membuka Google atau WhatsApp.',
      'Aturan China melarang koneksi internasional lewat saluran tanpa izin, termasuk VPN tanpa izin; dendanya sampai CNY 15000.',
      `Unduh sebelum berangkat: Amap (ada bahasa Indonesia sejak Juli 2025; simpan peta offline), DiDi, Trip.com, 12306, dan Google Translate dengan bahasa Mandarin offline.${notes.signal}`,
    ].map(currencyText)))}
    ${section('emergency', 'Darurat & KBRI', `<dl class="prepare-contacts">
      <div><dt>Polisi</dt><dd><a href="tel:110">110</a></dd></div>
      <div><dt>Ambulans</dt><dd><a href="tel:120">120</a></dd></div>
      <div><dt>Kebakaran</dt><dd><a href="tel:119">119</a></dd></div>
      <div><dt>Kecelakaan lalu lintas</dt><dd><a href="tel:122">122</a></dd></div>
      <div><dt>KBRI Beijing, hotline konsuler</dt><dd><a href="tel:+8618610455488">+86 186 1045 5488</a> (juga WhatsApp/WeChat)<span>Sichuan dan Yunnan termasuk wilayah KBRI Beijing. KJRI Chengdu sudah ditetapkan Perpres 10/2026, tetapi belum beroperasi per 4 November.</span></dd></div>
      <div><dt>Kemlu, Pelindungan WNI</dt><dd><a href="tel:+6281290070027">+62 812 9007 0027</a> (WhatsApp)</dd></div>
      ${notes.hospitals.join('\n      ')}
    </dl>
    ${list([
      'Lapor diri di <a href="https://peduliwni.kemlu.go.id/beranda.html" target="_blank" rel="noopener noreferrer">Peduli WNI<span class="visually-hidden"> (buka tab baru)</span></a> sebelum berangkat.',
      'Paspor hilang: lapor ke polisi setempat dan minta surat keterangan kehilangan, lalu hubungi KBRI untuk SPLP. Surat dari polisi bisa dipakai sebagai identitas di kereta.',
      'Rumah sakit di China sering meminta deposit sebelum perawatan dan tidak langsung menerima asuransi asing; siapkan kartu kredit. Layanan gawat darurat di pedesaan Sichuan barat terbatas.',
    ])}`)}
    ${section('health', 'Asuransi & ketinggian', list([
      `Periksa polis asuransimu: contoh polis Chubb mengecualikan trekking di atas 3.000 m, berjalan di gletser, dan petualangan berkendara 4x4. ${notes.altitude} Pastikan evakuasi medis tertanggung.`,
      `Panduan CDC: di atas 3.000 m, naikkan ketinggian tidur paling banyak 500 m per malam. ${notes.ascent} Turun sekitar 300 m biasanya meredakan gejala ringan.`,
      'Bicarakan obat pencegahan mabuk ketinggian, misalnya acetazolamide, dengan dokter sebelum berangkat.',
    ]))}
    ${section('practical', 'Lain-lain', list([
      'Bawa paspor setiap saat; UU Keluar-Masuk Wilayah China mewajibkannya untuk usia 16 tahun ke atas. Hotel yang mendaftarkan tamu asing ke polisi.',
      'Stop kontak China tipe A dan I, 220 V. Steker Indonesia tipe C/F, jadi bawa adaptor.',
      'Bawa power bank di kabin dan pastikan kapasitasnya di bawah 100 Wh.',
    ]))}`;
}

export function prepareView() {
  const checked = checkedOn(preparedAt);
  return `<a class="skip-link" href="#prepare-title">Langsung ke persiapan</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(preparePath)}</header>
  <main class="container prepare-page" data-prepare>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Persiapan</span></nav>
    ${planSwitch(preparePath)}
    <div class="prepare-intro">
      <h1 id="prepare-title">Sebelum berangkat, satu halaman.</h1>
      <p class="lead">Yang sudah beres, yang harus dipesan beserta jam bukanya, perkiraan biaya, cara tetap online, dan nomor penting. Diperiksa <time datetime="${preparedAt}">${checked}</time>.</p>
      ${doneList()}
    </div>
    ${section('bookings', 'Pesan dan kapan', `<p class="prepare-section-lead">${bookingRules} Semua link kereta dan timeline 8–10 November ada di <a href="/places/trains/">Kereta & timeline</a>.</p>
      ${urgencySections(bookings.map(mainBookingCard))}`)}
    ${section('costs', 'Perkiraan biaya', `<p class="prepare-section-lead">Dijumlahkan dari harga di halaman ini dan pilihan penginapan termurah sampai termahal per malam. Dihitung untuk bagianmu: Sichuan sendiri, lalu kamar 17–20 November dibagi dua dengan temanmu. Belum termasuk makan, oleh-oleh, makan dan menginap sopir, biaya satu arah mobil, serta biaya pemesanan Trip.com.</p>
      ${costSummary(costLines, costsPath)}`)}
    ${planSections(mainPlanNotes)}
    ${sourcesSection(`Diperiksa ${checked} dan dicek ulang secara terpisah. Harga, jam rilis dan aturan dapat berubah; ikuti pengumuman resmi saat memesan.`, prepareSources)}
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
