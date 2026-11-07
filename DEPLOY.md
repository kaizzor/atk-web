# Deploy ulang (Node + MySQL + Cloudinary)

App ini butuh 3 hal: server Node, database MySQL, dan akun Cloudinary (upload foto). Kode tidak berisi secret, semua lewat environment variable (lihat `.env.example`).

## 1. Database (MySQL gratis)
Pakai provider MySQL gratis (mis. Aiven atau TiDB Cloud). Buat database, lalu import berurutan:
1. `insert.sql` (kategori, produk, supplier, user lama)
2. `schema-fix.sql` (tabel `transactions`, `transaction_details`, `stocklog`, kolom `users.foto`, akun demo)

Akun demo: username `demo`, password `Demo@12345`.
User lama di `insert.sql` tidak bisa login karena password-nya plaintext, sedangkan backend pakai bcrypt. Daftar user baru lewat halaman register, atau pakai akun demo.

## 2. Cloudinary
Buat akun gratis, ambil Cloud name, API key, API secret.

## 3a. Server di Vercel (disarankan)
Project sudah disiapkan (`api/index.js`, `vercel.json`).
1. Push folder ini ke GitHub (`.env` sudah di-ignore).
2. Di Vercel: Add New > Project > pilih repo. Framework preset: Other. Biarkan build/output kosong.
3. Isi Environment Variables sesuai `.env.example`, lalu Deploy.
4. Buka URL-nya, otomatis ke halaman login.
Pool MySQL otomatis dibatasi 2 koneksi per function di Vercel (ubah lewat `DB_POOL_LIMIT`).

## 3b. Server di Render/Railway (alternatif)
- Build command: `npm install`
- Start command: `npm start`
- Isi env var sesuai `.env.example` (DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_SSL=true, CLOUDINARY_*)
- `dist/style.css` sudah ter-build, jadi tidak perlu build Tailwind.

Buka URL service, otomatis redirect ke halaman login.

## Catatan
- Foto produk lama (`/uploads/item-*.jpg`) tidak ikut di zip, jadi tampil kosong. Upload ulang lewat Edit Product (masuk ke Cloudinary).
- Free tier Render tidur kalau idle, request pertama bisa lambat ~30-60 detik.

## Kalau database tidak nyambung
Buka `https://<domain-kamu>/health/db`. Hasilnya menunjukkan env var mana yang kosong dan pesan error dari MySQL.
- `ENOTFOUND` / `ECONNREFUSED`: DB_HOST atau DB_PORT salah.
- `ER_ACCESS_DENIED_ERROR`: DB_USER / DB_PASS salah. Nama variabelnya harus `DB_PASS` (bukan `DB_PASSWORD`).
- `self-signed certificate` / SSL error (umum di Aiven): isi `DB_SSL_CA` dengan isi file CA (copy-paste seluruh teks PEM), dan `DB_SSL=true`.
- `ER_BAD_DB_ERROR`: database `DB_NAME` belum dibuat.
- `ER_NO_SUCH_TABLE`: import `insert.sql` lalu `schema-fix.sql` belum dilakukan di database yang sama.
