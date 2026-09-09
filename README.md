# Portal Dokumen Pajak

Sistem manajemen dan pencarian dokumen bukti potong pajak yang dibangun menggunakan Next.js (App Router) dan Supabase. Memiliki antarmuka modern dengan gaya *vibrant glassmorphism*.

## 🚀 Fitur Utama

**Akses Publik (User)**
- Pencarian dokumen instan berdasarkan Nama Unit Kerja atau Nomor Akun.
- Akses dan pratinjau langsung file PDF bukti potong pajak.

**Akses Privat (Admin)**
- Autentikasi login admin yang terhubung ke database Supabase.
- Input data administrasi pajak (Nomor Referensi, Tanggal, DPP, PPh, dll).
- Upload file PDF bukti fisik langsung ke Supabase Storage.
- Kelola data (Lihat dan Hapus) dokumen dari tabel database.

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Storage:** [Supabase](https://supabase.com/)
- **Bahasa:** TypeScript

## ⚙️ Persiapan & Instalasi

### 1. Instalasi Dependensi
Pastikan Node.js sudah terinstal, kemudian jalankan perintah berikut di terminal:
```bash
npm install
npm install @supabase/supabase-js