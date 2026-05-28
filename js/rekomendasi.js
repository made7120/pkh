// rekomendasi.js
// Berisi fungsi inti metode forward chaining.
// File ini adalah bagian utama yang bisa dijelaskan saat sidang sebagai proses inferensi sistem.

function infer(data) {
  let score = 0;
  const details = [];
  const components = [];

  if (data.penghasilan === "kurang_800") {
    score += 25;
    details.push("Penghasilan kurang dari Rp800.000: +25");
  } else if (data.penghasilan === "800_1000") {
    score += 20;
    details.push("Penghasilan Rp800.000 sampai Rp1.000.000: +20");
  }

  if (data.kondisiRumah === "tidak_layak") {
    score += 20;
    details.push("Rumah tidak layak: +20");
  }

  if (data.tanggungan >= 4) {
    score += 15;
    details.push("Tanggungan 4 orang atau lebih: +15");
  } else if (data.tanggungan === 3) {
    score += 10;
    details.push("Tanggungan 3 orang: +10");
  }

  if (data.asetProduktif === "tidak_ada") {
    score += 15;
    details.push("Tidak memiliki aset produktif: +15");
  }

  if (data.kendaraan === "tidak_ada" || data.kendaraan === "sepeda") {
    score += 10;
    details.push("Kendaraan terbatas: +10");
  }

  if (data.dtks === "terdaftar") {
    score += 10;
    details.push("Terdaftar DTKS: +10");
  } else {
    details.push("Belum terdaftar DTKS: +0 dan perlu verifikasi");
  }

  if (data.ibuHamil) components.push("Ibu hamil atau menyusui");
  if (data.balita) components.push("Anak usia 0 sampai 6 tahun");
  if (data.anakSekolah) components.push("Anak sekolah");
  if (data.umur >= 60) components.push("Lansia");
  if (data.disabilitas) components.push("Disabilitas berat");

  const hasComponent = components.length > 0;

  if (hasComponent) {
    score += 20;
    details.push("Memiliki komponen PKH: +20");
  } else {
    details.push("Belum memiliki komponen PKH: +0");
  }

  if (data.kendaraan === "mobil" && data.kondisiRumah === "layak" && data.penghasilan === "lebih_2000") {
    score -= 30;
    details.push("Indikator ekonomi kuat: -30");
  }

  score = Math.max(0, Math.min(100, score));

  let systemRecommendation = "Tidak Prioritas";
  if (score >= 70 && hasComponent && data.dtks === "terdaftar") {
    systemRecommendation = "Layak Diusulkan";
  } else if (score >= 50 || (hasComponent && data.dtks === "belum")) {
    systemRecommendation = "Perlu Verifikasi";
  }

  return {
    ...data,
    score,
    components: hasComponent ? components.join(", ") : "Belum ada komponen PKH",
    systemRecommendation,
    manualRecommendation: "",
    officerNote: "",
    finalResult: "Menunggu Verifikasi Manual",
    verifiedBy: "",
    verifiedAt: "",
    details: details.join("; ")
  };
}

function getFinalResult(item) {
  if (!item.manualRecommendation) return "Menunggu Verifikasi Manual";

  if (item.manualRecommendation === "Layak") {
    if (item.systemRecommendation === "Layak Diusulkan") return "Layak Diusulkan";
    return "Layak Diusulkan Setelah Verifikasi Manual";
  }

  if (item.manualRecommendation === "Tidak Layak") {
    return "Tidak Layak Diusulkan";
  }

  return "Menunggu Verifikasi Lanjutan";
}
