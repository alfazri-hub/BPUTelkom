# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primer — staf unit kerja internal Telkom (BPU).** Mengambil arsip bukti potong
pajak untuk administrasi dan pelaporan unitnya. Mencari berdasarkan nama unit
kerja atau nomor akun, biasanya sudah tahu persis dokumen apa yang dicari.
Mayoritas mengakses dari komputer kantor (layar lebar), bukan ponsel.

**Sekunder — admin pengelola arsip.** Menginput data administrasi pajak,
mengunggah PDF bukti potong, serta mengoreksi dan menghapus data yang tersimpan.
Bekerja di balik login.

## Product Purpose

Portal arsip bukti potong pajak: menggantikan alur "minta dokumen ke bagian
keuangan lalu menunggu" dengan pencarian mandiri yang langsung membuka file PDF
aslinya. Berhasil ketika staf menemukan dan membuka dokumen yang benar dalam
hitungan detik, dan ketika admin bisa menambah arsip tanpa pelatihan khusus.

## Positioning

Pencarian arsip tanpa login di sisi publik, sementara seluruh kendali data
(input, koreksi, hapus) tetap terkunci di balik autentikasi admin. Nilainya ada
pada kecepatan temu-balik dokumen internal, bukan pada fitur perpajakan.

## Operating Context

- Pencarian berulang sepanjang hari kerja dari desktop kantor.
- Kata kunci yang dipakai adalah nama unit kerja atau nomor akun — keduanya
  sudah dipegang pengguna sebelum membuka portal.
- Hasil akhir selalu berupa file PDF yang dibuka di tab baru.
- Sisi admin: form input data + unggah PDF, lalu kelola daftar dokumen
  (buka, edit, hapus).

## Capabilities and Constraints

- Pencarian publik memakai pencocokan `ilike` pada `nama_unit_kerja` dan
  `nomor_akun` (substring, tanpa paginasi).
- Field dokumen: `nomor_referensi`, `tanggal_bukti_potong`,
  `dasar_pengenaan_pajak` (DPP), `pph_terhutang`, `nama_unit_kerja`,
  `nomor_akun`, `pdf_url`.
- Data dan berkas berada di Supabase (tabel `documents`, bucket storage `pdfs`).
- Sesi admin disimpan di `sessionStorage`; pengecekan kredensial dilakukan lewat
  query tabel `users` dari sisi klien. **Catatan teknis:** password dibandingkan
  sebagai teks biasa di klien — ini utang keamanan yang berada di luar cakupan
  pekerjaan desain, tetapi tidak boleh diperparah.
- Belum ditetapkan: volume dokumen yang realistis, kebutuhan paginasi, retensi
  arsip, dan peran admin berjenjang.

## Brand Commitments

- Nama **BPU** dan afiliasi Telkom wajib tampil.
- Merah Telkom `#D93A46` mengikat sebagai warna identitas resmi.
- Bahasa Indonesia formal, sesuai konteks instansi.

## Evidence on Hand

Data dokumen asli tersimpan di Supabase. Logo resmi Telkom Indonesia disediakan
pengguna dan tersimpan di `public/telkom-indonesia.png` (250×138, PNG beralfa) —
inilah identitas yang dipakai di sidebar dan halaman login. Lambang instansi
lain atau klaim sertifikasi tidak boleh direkayasa selama belum ada asetnya.

## Product Principles

1. **Temu-balik di atas persuasi.** Pengguna datang dengan tujuan yang sudah
   pasti; tugas antarmuka adalah memperpendek jarak ke dokumen, bukan menjelaskan
   nilai produk.
2. **Angka pajak harus terbaca tanpa ragu.** Nominal, tanggal, dan nomor
   referensi adalah data resmi — keterbacaan mengalahkan gaya.
3. **Formal, bukan kaku.** Nada instansi resmi yang tetap nyaman dipakai berulang
   kali sepanjang hari.
4. **Kepadatan desktop.** Layar lebar dimanfaatkan untuk memindai banyak hasil
   sekaligus, bukan dikosongkan demi estetika.
5. **Tindakan merusak harus disengaja.** Hapus dan koreksi data selalu meminta
   konfirmasi yang jelas.

## Accessibility & Inclusion

Tidak ada standar formal yang ditetapkan pengguna. Sebagai portal instansi,
kontras teks dan target klik mengikuti WCAG 2.1 AA sebagai dasar minimum.
