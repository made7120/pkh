# Penjelasan Penggunaan Database Supabase

## Posisi Database dalam Sistem

Database pada aplikasi ini digunakan sebagai tempat penyimpanan data warga, hasil rekomendasi sistem, hasil verifikasi manual admin, dan hasil akhir kelayakan. Dengan adanya database, data tidak hanya tersimpan di browser pengguna, tetapi tersimpan secara online di Supabase.

## Alur Kerja Sistem

1. Petugas login menggunakan akun demo petugas.
2. Petugas mengisi data warga pada halaman Input Data.
3. Sistem menjalankan metode forward chaining untuk menghitung skor dan menentukan rekomendasi sistem.
4. Data hasil input dan hasil rekomendasi dikirim ke tabel `warga_pkh` di Supabase.
5. Admin login menggunakan akun demo admin.
6. Admin membaca data dari database, lalu melakukan verifikasi manual.
7. Hasil verifikasi manual dan keterangan admin diperbarui ke database.
8. Halaman Hasil Rekomendasi menampilkan data terbaru dari database.

## Bagian Kode yang Menghubungkan Database

File `js/supabase-config.js` berisi alamat project Supabase dan publishable key. File ini membuat koneksi awal ke Supabase.

File `js/app.js` berisi fungsi utama untuk:

- mengambil data dari database dengan `select()`;
- menyimpan data baru dengan `insert()`;
- memperbarui hasil verifikasi manual dengan `update()`;
- menghapus data dengan `delete()` jika fitur hapus digunakan.

## Kalimat Siap Pakai untuk Sidang

Aplikasi ini menggunakan Supabase sebagai database online untuk menyimpan data hasil input warga. Pada saat petugas mengisi form, data terlebih dahulu diproses oleh sistem forward chaining untuk menghasilkan skor dan rekomendasi awal. Setelah itu, data dikirim ke database Supabase melalui JavaScript Supabase Client dan disimpan pada tabel `warga_pkh`. Admin kemudian dapat membuka data tersebut, melakukan verifikasi manual, mengisi keterangan, dan memperbarui hasil akhir. Perubahan yang dilakukan admin juga tersimpan kembali ke database, sehingga data tidak lagi bergantung pada localStorage browser.

## Batasan Sistem

Login pada sistem ini masih menggunakan akun demo di file `js/auth.js`. Karena itu, penggunaan database pada versi ini difokuskan untuk penyimpanan data warga dan hasil rekomendasi, bukan untuk autentikasi pengguna. Untuk pengembangan lebih lanjut, autentikasi dapat dipindahkan ke Supabase Auth agar role petugas dan admin lebih aman.
