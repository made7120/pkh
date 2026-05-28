# Panduan Deploy GitHub + Vercel + Supabase

## 1. Jalankan SQL di Supabase

Buka Supabase Dashboard > SQL Editor, lalu jalankan isi file:

```text
supabase-setup.sql
```

Setelah berhasil, akan muncul tabel `warga_pkh`.

## 2. Cek Konfigurasi Supabase

Buka file:

```text
js/supabase-config.js
```

Pastikan URL memakai bentuk base URL seperti ini:

```js
const SUPABASE_URL = "https://zvzaxyxeqpbymjzpdubx.supabase.co";
```

Jangan gunakan URL yang ada `/rest/v1/` untuk `supabase.createClient()`.

## 3. Upload ke GitHub

Upload seluruh isi folder ini ke repository GitHub. Struktur folder harus tetap seperti ini:

```text
index.html
login.html
app.html
css/style.css
js/auth.js
js/login.js
js/data.js
js/rekomendasi.js
js/supabase-config.js
js/app.js
supabase-setup.sql
```

## 4. Deploy ke Vercel

- Import repository dari GitHub.
- Framework Preset: Other.
- Build Command: kosongkan.
- Output Directory: kosongkan atau isi titik (`.`).
- Klik Deploy.

## 5. Tes

1. Login sebagai petugas.
2. Input data warga.
3. Cek tabel `warga_pkh` di Supabase.
4. Login sebagai admin.
5. Verifikasi manual.
6. Cek kembali data di Supabase.
