# Panduan Upload ke GitHub dan Publish ke Vercel

## Struktur Folder
Pastikan struktur folder tetap seperti ini:

```text
.
├── index.html
├── login.html
├── app.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── login.js
│   ├── data.js
│   ├── rekomendasi.js
│   └── app.js
├── README.md
├── .gitignore
└── vercel.json
```

## Upload ke GitHub
1. Ekstrak ZIP ini.
2. Buka GitHub.
3. Buat repository baru.
4. Upload semua isi folder ke repository.
5. Pastikan `index.html` berada di root repository, bukan di dalam folder tambahan.

## Deploy ke Vercel
1. Masuk ke Vercel.
2. Pilih **Add New Project**.
3. Hubungkan repository GitHub.
4. Framework preset pilih **Other**.
5. Build command kosongkan.
6. Output directory kosongkan atau isi `.`
7. Klik **Deploy**.

## Catatan
Versi ini masih menggunakan penyimpanan lokal browser jika kode JavaScript belum diubah ke database online.
Untuk database online, gunakan Supabase/Firebase atau backend lain.
