PANDUAN STRUKTUR FILE APLIKASI PKH
===================================

File sudah dipisah agar mudah dijelaskan saat sidang skripsi.

0. index.html
   - File pembuka otomatis yang mengarahkan ke login.html.

1. login.html
   - Halaman login aplikasi.
   - Berisi form login untuk petugas dan admin.
   - Setelah login berhasil, pengguna diarahkan ke app.html.

2. app.html
   - Halaman utama setelah login.
   - Berisi dashboard, input data, pencarian, hasil rekomendasi, bobot, aturan sistem, dan modal verifikasi.
   - Tampilan menu dibatasi sesuai role pengguna.

3. css/style.css
   - Mengatur seluruh tampilan aplikasi.
   - Dipisahkan agar HTML lebih bersih dan mudah dibaca.

4. js/auth.js
   - Mengatur akun demo, proses login, logout, dan hak akses role.
   - Role petugas hanya dapat membuka Dashboard dan Input Data.
   - Role admin dapat membuka Dashboard, Cari Data, Hasil Rekomendasi, Bobot Penilaian, dan Aturan Sistem.

5. js/login.js
   - Mengatur aksi tombol login pada login.html.
   - Jika username dan password benar, pengguna masuk ke app.html.

6. js/data.js
   - Berisi bobot penilaian, aturan forward chaining, dan informasi halaman.
   - Bagian ini bisa dijelaskan sebagai basis pengetahuan sistem.

7. js/rekomendasi.js
   - Berisi fungsi inferensi forward chaining.
   - Data warga diubah menjadi fakta, lalu sistem menghitung skor dan menentukan rekomendasi sistem.

8. js/app.js
   - Mengatur fungsi aplikasi utama.
   - Contoh: simpan data warga, tampilkan hasil, cari data, verifikasi manual admin, export CSV.

ALUR ROLE
=========

Petugas:
- Login menggunakan petugas / pkh123.
- Petugas hanya menginput data warga.
- Setelah data disimpan, sistem otomatis menghasilkan rekomendasi awal.
- Petugas tidak bisa melakukan verifikasi manual.

Admin:
- Login menggunakan admin / admin123.
- Admin melihat data yang sudah diinput petugas.
- Admin mengisi rekomendasi manual dan keterangan.
- Setelah admin menyimpan verifikasi, sistem menampilkan hasil akhir.

KALIMAT PENJELASAN SAAT SIDANG
==============================

"Pada revisi ini, program saya pisahkan menjadi beberapa file agar struktur aplikasi lebih jelas. Halaman login dibuat sendiri di login.html, halaman utama ada di app.html, tampilan ada di css/style.css, sedangkan fungsi JavaScript dipisah berdasarkan tugasnya. File auth.js mengatur login dan hak akses, data.js berisi bobot serta aturan, rekomendasi.js berisi proses forward chaining, dan app.js mengatur interaksi aplikasi. Dengan pemisahan ini, petugas hanya bertugas menginput data warga, sedangkan admin bertugas melakukan verifikasi manual dan menentukan hasil akhir."
