# Musim Gugur di China

Panduan perjalanan statis dalam Bahasa Indonesia untuk 8–21 November 2026. Dibangun dengan Vite, TypeScript, HTML semantik, dan CSS biasa.

Alamat publik: [china.muhammadyana.me](https://china.muhammadyana.me). Rilis dengan slider dan highlight destinasi sudah diverifikasi pada URL publik ini, termasuk tampilan ponsel 360 dan 390 px.

## Jalankan

```sh
git clone https://github.com/muhammadyana/china-itinerary.git
cd china-itinerary
npm install
npm run dev
```

## Build dan pratinjau produksi

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Buka <http://127.0.0.1:4173/>. Untuk langsung ke 20 November: <http://127.0.0.1:4173/#2026-11-20>.

Unggah isi `dist/` ke hosting statis. Aset memakai path relatif; tidak ada backend, API key, pemuatan font dari layanan pihak ketiga, atau layanan gambar saat halaman dipakai. PDF hanya diunduh ketika tautannya dibuka.

## Ubah itinerary

`src/itinerary.ts` adalah satu sumber data untuk tanggal, tempat ber-ID stabil, caption, foto, kredit, perpindahan, catatan praktis, dan tempat menginap. Pemilih hari, ringkasan rute, enam sorotan destinasi, foto pembuka, serta tampilan harian memakai data ini. `src/render.ts` merender HTML yang sama saat build dan saat tanggal dipilih. `src/main.ts` menangani interaksi DOM, dialog, clipboard, dan riwayat URL.

Halaman awal diprarender sehingga hari pertama dan tautan PDF tetap terbaca saat JavaScript tidak tersedia. Pemilihan hari memerlukan JavaScript. Setiap tanggal memakai fragment `#YYYY-MM-DD`; Back/Forward mengembalikan tanggal sebelumnya.

## Pengujian

```sh
npm run test:e2e
```

Playwright memakai Google Chrome lokal dan Chromium terpasang di GitHub Actions. Perintah ini menjalankan build dan production preview jika belum ada server pada port 4173. Cakupan pengujian mencakup 360, 390, dan 1440 px, seluruh tanggal dan malam, dua ketukan ke 20 November, reload/Back, fokus dialog, clipboard dan fallback, aksesibilitas aXe, aset WebP, serta jaringan seluler yang dibatasi.

Bukti pengujian ada di `artifacts/`: screenshot, hasil pengujian JSON, hasil aXe, dan catatan jaringan. File sumber dan batas bukti tercatat di `SOURCE-NOTES.md`. Hasil review desain ada di `artifacts/finish-review.md`.

Bukti lokal dihasilkan dalam folder `artifacts/` yang tidak dimasukkan ke Git. GitHub Actions menyimpan hasil tes sebagai artifact. Sistem visual: [DESIGN.md](DESIGN.md), dengan komponen dan token pada `.impeccable/design.json`.

## Batas informasi

Waktu dan harga mengikuti PDF, bukan jadwal real-time. Kedatangan TFU pada 8 November pukul 12.20 dikonfirmasi oleh sumber. Kereta, jemputan, akses taman, masjid setempat, serta jam penerbangan pulang perlu konfirmasi sebagaimana dijelaskan di halaman. Nama penginapan yang dibukukan tidak diberikan, sehingga halaman menampilkan area menginap.

Foto tanpa bukti izin pakai yang memadai tidak diterbitkan sebagai aset web. Tempatnya tetap ada sebagai teks; daftar gap dan asal pengganti ada di `SOURCE-NOTES.md` serta bagian sumber pada halaman. Foto berlisensi CC BY / CC BY-SA tetap memiliki atribusi, tautan lisensi, dan pemberitahuan resize/crop. Tidak ada gambar buatan AI.

Pemeriksaan tautan: 12306 dan dua halaman Jiuzhaigou merespons HTTP 200. Tiga tautan Klook asli menolak akses otomatis dengan HTTP 403; ketersediaan paket belum terverifikasi. Rincian tersimpan di `artifacts/external-links.json`.

## Beranda dan jurnal perjalanan

Beranda dibuka dengan enam foto destinasi di rute: Jiuzhaigou, Siguniangshan, Tagong, Yading, Blue Moon Valley, dan Danau Erhai. Geser foto atau gunakan tombol sebelumnya/berikutnya; foto tidak berganti otomatis. Nama destinasi pada foto dan enam kartu di bawahnya membuka tanggal perjalanan yang sesuai.

Ringkasan kedatangan muncul tepat setelah foto pembuka, sebelum pilihan destinasi: mulai dari Chengdu dan menginap di Jiuzhaigou. Itinerary lengkap berada setelah bagian pilihan destinasi. Tautan seperti `#2026-11-20` tetap langsung memilih dan menampilkan hari tersebut. Catatan harian memakai foto yang bergantian sisi pada desktop; pada ponsel, foto muncul sebelum uraian tempat. Ringkasan menginap dan transportasi ditampilkan dekat judul hari.

Galeri terpisah menyimpan 12 foto kiriman pengguna. Tombol **Galeri** membuka bagian yang semula tertutup. Tiga foto Bipenggou tetap diberi kredit kapongbeer berdasarkan tangkapan layar pengguna dan ditandai sebagai inspirasi di luar rute PDF. Tanggal pengambilan foto pengguna belum diketahui. Manifest asalnya ada di `source/user-photos/manifest.json`.

Enam foto destinasi pada beranda terdiri atas empat aset baru dan dua foto arsip. Hanya foto Siguniangshan yang memiliki tanggal pengambilan terverifikasi pada Oktober 2026, yaitu 14 Oktober. Foto Jiuzhaigou diambil 6 November 2025, Erhai 20 Februari 2026, Tagong pada Juni 2018, dan Luorong pada Oktober 2012. Tanggal pengambilan Blue Moon Valley tidak tersedia. Rincian sumber, lisensi, dan tanggal terbit ada di `source/highlight-photos/manifest.json` serta `SOURCE-NOTES.md`.

Tampilan mempertahankan Geist, Bodoni Moda, palet kastanye/krem/terakota/emas, dan navigasi tanggal mengambang. Bukti revisi terbaru ada di `artifacts/highlights-verification.md`; bukti deployment publik ada di `artifacts/deployment/receipt.json`.

## Deployment terverifikasi

Versi highlight dan slider sudah live di [china.muhammadyana.me](https://china.muhammadyana.me). Build dan 10 tes lulus; pemeriksaan publik 360/390 px juga lulus. Rincian HTTPS, aset, bukti, dan rollback: [panduan deployment](ops/README.md).

## GitHub Actions dan Nginx

Workflow [Test and deploy](.github/workflows/deploy.yml) berjalan pada pull request dan push ke `main`. CI memasang Node 24, menjalankan build serta tes browser, lalu membuat arsip statis terverifikasi. Hanya push ke `main` atau manual run pada `main` yang boleh deploy ke environment `production`.

Nginx melayani folder `current/public` di server. Kunci deployment khusus dibatasi ke handler `ops/deploy.py`; tidak dapat menjalankan shell bebas. Handler memeriksa arsip dan hash, mengaktifkan release secara atomik, memeriksa HTTPS origin, dan mengembalikan release sebelumnya jika pemeriksaan gagal. Workflow juga memeriksa penanda commit melalui HTTPS publik.

Konfigurasi yang digunakan: [ops/nginx.conf](ops/nginx.conf). Instalasi, rahasia environment, dan rollback: [ops/README.md](ops/README.md). File mentah foto, arsip build, bukti lokal, dan kredensial tidak dimasukkan ke Git; seluruh aset WebP yang dibutuhkan build ada di `public/`.
