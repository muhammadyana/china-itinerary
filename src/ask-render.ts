import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { renderSiteNavigation } from './site-navigation.ts';

export const askPath = '/places/ask/';

type Variant = 'page' | 'dialog';

const suggestions = ['Besok jadwalnya apa?', 'Tiket apa yang harus dibeli sekarang?', 'Jelaskan halaman ini'];
const locationHint = 'Ketuk ikon lokasi di samping kolom tanya, lalu tanya rute, misalnya "ke hotel naik apa dari sini?". Nanti gue bikinin link Amap-nya.';

const suggestionChip = (text: string) => `<li><button type="button" class="ask-chip" data-ask-suggestion>${e(text)}</button></li>`;

const emptyState = () => `<div class="ask-empty" data-ask-empty>
  <p>Tanya apa aja soal trip lo, bro. Gue hafal jadwal 14 hari, tiap tempat, penginapan, biaya, kereta, sampe persiapannya. Bisa juga cek halal, tips foto, sama cara ngomong Mandarin.</p>
  <ul class="ask-suggestions" role="list" aria-label="Contoh pertanyaan">${suggestions.map(suggestionChip).join('')}</ul>
  <p class="ask-hint">${e(locationHint)}</p>
</div>`;

// The hidden username lets password managers store the password under a name.
function loginForm(variant: Variant) {
  const id = `ask-password-${variant}`;
  return `<form class="ask-login" data-ask-login data-ask-when="login" hidden>
    <input type="text" name="username" value="Tanya AI" autocomplete="username" hidden>
    <label for="${id}">Kata sandi</label>
    <div class="ask-login-row"><input id="${id}" name="password" type="password" autocomplete="current-password" aria-describedby="${id}-error"><button type="submit" class="primary-button">Buka</button></div>
    <p class="ask-login-error" id="${id}-error" data-ask-login-error aria-live="polite"></p>
  </form>`;
}

function composer(variant: Variant) {
  const id = `ask-input-${variant}`;
  return `<form class="ask-composer" data-ask-composer>
    <button type="button" class="ask-locate" data-ask="locate" aria-pressed="false" aria-label="Kirim lokasiku ke Tanya AI">${icon('pin')}</button>
    <label class="visually-hidden" for="${id}">Pertanyaanmu</label>
    <textarea id="${id}" name="question" rows="1" maxlength="4000" placeholder="Tanya soal perjalananmu…" enterkeyhint="send"></textarea>
    <button type="submit" class="ask-send" aria-label="Kirim pertanyaan">${icon('send')}</button>
    <button type="button" class="ask-stop" data-ask="stop" aria-label="Hentikan jawaban" hidden>${icon('stop')}</button>
  </form>`;
}

const conversation = (variant: Variant) => `<div class="ask-conversation" data-ask-when="chat" hidden>
  <div class="ask-scroll" data-ask-scroll>${emptyState()}<div class="ask-log" role="log" aria-label="Percakapan dengan Tanya AI" data-ask-log></div></div>
  <p class="ask-status" data-ask-status role="status"></p>
  ${composer(variant)}
</div>`;

const askChat = (variant: Variant) => `<div class="ask-chat">${loginForm(variant)}${conversation(variant)}</div>`;

const actionButton = (action: string, symbol: string, label: string) =>
  `<button type="button" class="quiet-button ask-action" data-ask="${action}" data-ask-when="chat" hidden>${icon(symbol)}<span>${e(label)}</span></button>`;

// Hidden until the script runs, so a visitor without JavaScript never sees a form that cannot work.
const askPanel = () => `<div class="ask-panel" data-ask-root hidden>
  <div class="ask-panel-bar">${actionButton('new', 'plus', 'Percakapan baru')}${actionButton('lock', 'lock', 'Kunci perangkat ini')}</div>
  ${askChat('page')}
</div>`;

export function askView() {
  return `<a class="skip-link" href="#ask-title">Langsung ke Tanya AI</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container prepare-page ask-page" data-ask-page>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<span>Tanya AI</span></nav>
    <div class="prepare-intro">
      <h1 id="ask-title">Tanya AI</h1>
      <p class="lead">Asisten perjalanan pribadimu. Ia membaca seluruh isi situs ini, dari jadwal 14 hari sampai opsi santai, lalu mencari di web kalau butuh info terbaru.</p>
      <p class="ask-note">Khusus pemilik perjalanan, jadi perlu kata sandi. Cukup sekali per perangkat; setelah itu tombol Tanya AI muncul di setiap halaman.</p>
    </div>
    <noscript><p class="no-script">Tanya AI memerlukan JavaScript. Aktifkan JavaScript di browser, lalu muat ulang halaman ini.</p></noscript>
    ${askPanel()}
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}

export const askWidget = () => `<button type="button" class="ask-fab" data-ask="open" aria-haspopup="dialog" aria-controls="ask-dialog">${icon('chat')}<span>Tanya AI</span></button>
<dialog id="ask-dialog" class="ask-dialog" aria-labelledby="ask-dialog-title" data-ask-root>
  <header class="ask-dialog-header">
    <div class="ask-dialog-heading"><h2 id="ask-dialog-title">Tanya AI</h2><p class="ask-context" data-ask-context></p></div>
    ${actionButton('new', 'plus', 'Percakapan baru')}
    <button type="button" class="icon-button" data-ask="close" aria-label="Tutup Tanya AI">${icon('close')}</button>
  </header>
  ${askChat('dialog')}
</dialog>`;
