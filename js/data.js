// data.js
// Berisi data tetap untuk bobot, aturan, dan judul halaman.
// File ini memudahkan dosen penguji melihat basis pengetahuan sistem.

const weights = [
  { code: "B1", name: "Penghasilan kurang dari Rp800.000", value: 25 },
  { code: "B2", name: "Penghasilan Rp800.000 sampai Rp1.000.000", value: 20 },
  { code: "B3", name: "Rumah tidak layak", value: 20 },
  { code: "B4", name: "Tanggungan keluarga 4 orang atau lebih", value: 15 },
  { code: "B5", name: "Tanggungan keluarga 3 orang", value: 10 },
  { code: "B6", name: "Tidak memiliki aset produktif", value: 15 },
  { code: "B7", name: "Tidak memiliki kendaraan atau hanya sepeda", value: 10 },
  { code: "B8", name: "Terdaftar DTKS", value: 10 },
  { code: "B9", name: "Memiliki komponen PKH", value: 20 },
  { code: "B10", name: "Indikator ekonomi kuat: mobil, rumah layak, dan penghasilan tinggi", value: -30 }
];

const rules = [
  "IF penghasilan kurang dari Rp800.000 THEN bobot ekonomi sangat rentan +25",
  "IF penghasilan Rp800.000 sampai Rp1.000.000 THEN bobot ekonomi rentan +20",
  "IF rumah tidak layak THEN bobot kondisi hunian +20",
  "IF tanggungan keluarga minimal 4 orang THEN bobot beban keluarga +15",
  "IF tanggungan keluarga 3 orang THEN bobot beban keluarga +10",
  "IF tidak memiliki aset produktif THEN bobot kepemilikan aset +15",
  "IF tidak memiliki kendaraan atau hanya sepeda THEN bobot akses kendaraan +10",
  "IF terdaftar DTKS THEN bobot validasi data +10",
  "IF memiliki komponen PKH THEN bobot komponen bantuan +20",
  "IF mobil AND rumah layak AND penghasilan tinggi THEN bobot ekonomi kuat -30",
  "IF skor >= 70 AND DTKS terdaftar AND komponen PKH ada THEN rekomendasi sistem layak diusulkan",
  "IF rekomendasi manual diisi oleh admin THEN sistem menampilkan hasil akhir"
];

const pageInfo = {
  dashboard: ["Dashboard", "Informasi aplikasi rekomendasi PKH"],
  input: ["Input Data", "Khusus petugas untuk memasukkan data warga"],
  search: ["Cari Data", "Khusus admin untuk menemukan data warga"],
  result: ["Hasil Rekomendasi", "Khusus admin untuk verifikasi manual"],
  weight: ["Bobot Penilaian", "Daftar bobot setiap kriteria"],
  rule: ["Aturan Sistem", "Basis aturan forward chaining dan hasil akhir"]
};
