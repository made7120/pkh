# Aplikasi PKH Forward Chaining dengan Database Supabase

Aplikasi ini adalah sistem rekomendasi awal kelayakan penerima PKH berbasis metode forward chaining. Versi ini sudah diperbaiki agar hasil input warga tidak lagi disimpan di `localStorage`, tetapi disimpan ke database online Supabase.

## Teknologi yang Digunakan

- HTML untuk struktur halaman.
- CSS untuk tampilan aplikasi.
- JavaScript untuk logika aplikasi, role pengguna, pencarian, render tabel, export CSV, dan komunikasi dengan database.
- Supabase sebagai database online berbasis PostgreSQL.
- GitHub sebagai penyimpanan kode.
- Vercel sebagai tempat publish aplikasi.

## Alur Penyimpanan Data

Sebelumnya, data warga disimpan di browser memakai `localStorage`. Pada versi ini, alurnya berubah menjadi:

```text
Form input warga → JavaScript → Supabase Client → Database Supabase → Data tampil di halaman hasil
```

Artinya, ketika petugas mengisi data warga dan menekan tombol simpan, sistem tetap menjalankan proses forward chaining di `js/rekomendasi.js`. Setelah skor dan rekomendasi sistem muncul, data tersebut dikirim oleh `js/app.js` ke tabel `warga_pkh` di Supabase.

Admin kemudian dapat membuka data yang sudah masuk, melakukan verifikasi manual, mengisi keterangan, dan menyimpan hasil akhir. Perubahan tersebut juga disimpan kembali ke database Supabase.

## File Penting

```text
index.html                  Halaman pembuka yang mengarah ke login.html
login.html                  Halaman login demo petugas dan admin
app.html                    Halaman utama aplikasi
css/style.css               Tampilan aplikasi
js/auth.js                  Login demo dan pembagian role
js/login.js                 Proses login
js/data.js                  Bobot, aturan, dan informasi halaman
js/rekomendasi.js           Proses inferensi forward chaining
js/supabase-config.js       Konfigurasi URL dan publishable key Supabase
js/app.js                   Interaksi aplikasi dan koneksi database Supabase
supabase-setup.sql          SQL untuk membuat tabel database dan RLS policy
```

## Cara Menyiapkan Database

1. Masuk ke Supabase Dashboard.
2. Buka project yang digunakan.
3. Masuk ke menu SQL Editor.
4. Jalankan isi file `supabase-setup.sql`.
5. Pastikan tabel `warga_pkh` berhasil dibuat.
6. Pastikan file `js/supabase-config.js` berisi URL dan publishable key project Supabase yang benar.

## Akun Demo

```text
petugas / pkh123
admin / admin123
```

Catatan: login pada versi ini masih login demo di sisi frontend. Database digunakan untuk menyimpan data warga, hasil rekomendasi sistem, verifikasi manual, dan hasil akhir. Untuk aplikasi produksi, login sebaiknya dipindahkan ke Supabase Auth atau backend yang lebih aman.

## Penjelasan Singkat untuk Sidang

Pada versi ini, aplikasi tidak lagi menyimpan data input warga ke penyimpanan lokal browser. Data yang diinput oleh petugas dikirim ke database online Supabase melalui JavaScript Supabase Client. Setelah data warga diproses oleh metode forward chaining, hasil skor, rekomendasi sistem, komponen PKH, dan rincian bobot disimpan ke tabel `warga_pkh`. Admin dapat membaca data tersebut dari database, melakukan verifikasi manual, mengisi keterangan, dan memperbarui hasil akhir. Dengan demikian, penyimpanan data menjadi lebih terpusat dan tidak bergantung pada satu browser saja.

## Catatan Keamanan

RLS policy pada file SQL ini dibuat longgar untuk kebutuhan demo skripsi agar aplikasi frontend dapat membaca, menyimpan, dan memperbarui data. Jangan gunakan NIK atau data warga asli pada hosting publik. Untuk penggunaan nyata, sistem harus memakai autentikasi yang lebih kuat dan policy database yang membatasi akses berdasarkan user dan role.
