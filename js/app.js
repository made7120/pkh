// app.js
// Mengatur halaman utama, input data, tabel hasil read-only untuk petugas, verifikasi admin, pencarian, dan export CSV.

if (!Auth.requireLogin()) {
  throw new Error("Pengguna belum login.");
}

let results = JSON.parse(localStorage.getItem("pkhResultsStepManual")) || [];
let editIndex = null;
let manualIndex = null;
let currentPage = Auth.getDefaultPage();

const el = id => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function saveLocal() {
  localStorage.setItem("pkhResultsStepManual", JSON.stringify(results));
}

function labelFromValue(value, map) {
  return map[value] || value;
}

function statusClass(status) {
  if (["Layak Diusulkan", "Layak", "Layak Diusulkan Setelah Verifikasi Manual"].includes(status)) return "status success";
  if (["Perlu Verifikasi", "Perlu Verifikasi Lanjutan", "Menunggu Verifikasi Manual", "Menunggu Verifikasi Lanjutan"].includes(status)) return "status warning";
  return "status danger";
}

function isDesktop() {
  return window.innerWidth >= 1024;
}

function closeSidebar() {
  const sidebar = el("sidebar");
  if (isDesktop()) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("open");
    el("overlay").classList.remove("show");
  }
}

function openSidebar() {
  const sidebar = el("sidebar");
  if (isDesktop()) {
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.add("open");
    el("overlay").classList.add("show");
  }
}

function toggleSidebar() {
  const sidebar = el("sidebar");
  if (isDesktop()) {
    sidebar.classList.toggle("collapsed");
  } else {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  }
}

function applyRoleAccess() {
  document.querySelectorAll("[data-page]").forEach(button => {
    const page = button.dataset.page;
    if (!page) return;
    button.classList.toggle("hidden", !Auth.canAccessPage(page));
  });

  el("btnExport").classList.toggle("hidden", !Auth.isAdmin());
}

function logout() {
  if (!confirm("Keluar dari aplikasi?")) return;
  Auth.logout();
  window.location.href = "login.html";
}

function showPage(page) {
  if (!Auth.canAccessPage(page)) {
    page = Auth.getDefaultPage();
  }

  currentPage = page;
  applyRoleAccess();

  document.querySelectorAll(".page-section").forEach(section => section.classList.add("hidden"));
  el(`page-${page}`).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  el("pageTitle").textContent = pageInfo[page][0];
  el("pageSubtitle").textContent = pageInfo[page][1];

  if (!isDesktop()) closeSidebar();
  renderAll();
}

function getFormData() {
  return {
    nama: el("nama").value.trim(),
    nik: el("nik").value.trim(),
    rt: el("rt").value.trim(),
    umur: Number(el("umur").value || 0),
    penghasilan: el("penghasilan").value,
    tanggungan: Number(el("tanggungan").value || 0),
    kondisiRumah: el("kondisiRumah").value,
    asetProduktif: el("asetProduktif").value,
    kendaraan: el("kendaraan").value,
    dtks: el("dtks").value,
    ibuHamil: el("ibuHamil").checked,
    balita: el("balita").checked,
    anakSekolah: el("anakSekolah").checked,
    disabilitas: el("disabilitas").checked
  };
}

function setFormData(data) {
  el("nama").value = data.nama;
  el("nik").value = data.nik;
  el("rt").value = data.rt;
  el("umur").value = data.umur;
  el("penghasilan").value = data.penghasilan;
  el("tanggungan").value = data.tanggungan;
  el("kondisiRumah").value = data.kondisiRumah;
  el("asetProduktif").value = data.asetProduktif;
  el("kendaraan").value = data.kendaraan;
  el("dtks").value = data.dtks;
  el("ibuHamil").checked = data.ibuHamil;
  el("balita").checked = data.balita;
  el("anakSekolah").checked = data.anakSekolah;
  el("disabilitas").checked = data.disabilitas;
}

function resetForm() {
  el("formWarga").reset();
  editIndex = null;
  el("formWarga").querySelector("button[type='submit']").textContent = "Simpan Data & Lihat Rekomendasi Sistem";
}

function renderWeights() {
  el("weightBox").innerHTML = weights.map(item => `
    <div class="weight-card">
      <div>
        <h4>${escapeHtml(item.code)}</h4>
        <p>${escapeHtml(item.name)}</p>
      </div>
      <span class="weight-value ${item.value < 0 ? "minus" : "plus"}">${item.value > 0 ? "+" : ""}${item.value}</span>
    </div>
  `).join("");
}

function renderRules() {
  el("ruleBox").innerHTML = rules.map((rule, index) => `
    <div class="rule-card">
      <h4>R${index + 1}</h4>
      <p>${escapeHtml(rule)}</p>
    </div>
  `).join("");
}

function renderSummary() {
  el("totalData").textContent = results.length;
  el("totalLayak").textContent = results.filter(item => item.systemRecommendation === "Layak Diusulkan").length;
  el("totalVerifikasi").textContent = results.filter(item => item.systemRecommendation === "Perlu Verifikasi").length;
  el("totalBelumManual").textContent = results.filter(item => !item.manualRecommendation).length;
  el("btnExport").disabled = !Auth.isAdmin() || results.length === 0;
}

function renderPreview(item) {
  el("previewBox").classList.remove("hidden");
  el("previewContent").innerHTML = `
    <p><strong>${escapeHtml(item.nama)}</strong> memperoleh skor <strong>${item.score}</strong>.</p>
    <p>Rekomendasi Sistem: <span class="${statusClass(item.systemRecommendation)}">${escapeHtml(item.systemRecommendation)}</span></p>
    <p>Komponen: ${escapeHtml(item.components)}.</p>
    <p>Data berhasil disimpan. Petugas dapat melihat hasil pada halaman <strong>Hasil Rekomendasi</strong>, tetapi verifikasi manual tetap dilakukan oleh <strong>admin</strong>.</p>
  `;
}

function getFilteredResults() {
  const query = el("searchInput") ? el("searchInput").value.toLowerCase() : "";
  const filter = el("filterStatus") ? el("filterStatus").value : "SEMUA";

  return results.filter(item => {
    const searchable = [
      item.nama,
      item.nik,
      item.rt,
      item.systemRecommendation,
      item.manualRecommendation || "Belum Diverifikasi",
      item.officerNote,
      item.finalResult
    ].join(" ").toLowerCase();
    const matchQuery = searchable.includes(query);
    const matchStatus = filter === "SEMUA" || item.systemRecommendation === filter;
    return matchQuery && matchStatus;
  });
}

function renderSearchCards() {
  const filtered = getFilteredResults();
  el("searchCards").innerHTML = filtered.map(item => {
    const realIndex = results.indexOf(item);
    const manualText = item.manualRecommendation || "Belum Diverifikasi";
    return `
      <article class="search-card">
        <div class="search-card-head">
          <div>
            <h3>${escapeHtml(item.nama)}</h3>
            <p>NIK: ${escapeHtml(item.nik)}</p>
            <p>RT: ${escapeHtml(item.rt)} | Umur: ${escapeHtml(item.umur)} tahun</p>
          </div>
          <span class="${statusClass(item.systemRecommendation)}">${escapeHtml(item.systemRecommendation)}</span>
        </div>
        <div class="search-card-body">
          <p><strong>Skor:</strong> ${item.score}</p>
          <p><strong>Komponen:</strong> ${escapeHtml(item.components)}</p>
          <p><strong>Rekomendasi Manual:</strong> <span class="${statusClass(manualText)}">${escapeHtml(manualText)}</span></p>
          <p><strong>Keterangan:</strong> ${escapeHtml(item.officerNote || "Belum ada keterangan")}</p>
          <p><strong>Hasil Akhir:</strong> <span class="${statusClass(item.finalResult)}">${escapeHtml(item.finalResult)}</span></p>
        </div>
        <div class="card-actions">
          ${Auth.isAdmin() ? `<button onclick="openManualVerification(${realIndex})" class="btn btn-primary">Verifikasi Manual/Edit</button>` : ""}
        </div>
      </article>
    `;
  }).join("") || `<div class="empty-state">Data tidak ditemukan.</div>`;
}

function renderTable() {
  const incomeLabels = {
    kurang_800: "< Rp800.000",
    "800_1000": "Rp800.000 sampai Rp1.000.000",
    "1000_2000": "> Rp1.000.000 sampai Rp2.000.000",
    lebih_2000: "> Rp2.000.000"
  };

  el("resultBody").innerHTML = results.map((item, index) => {
    const manualText = item.manualRecommendation || "Belum Diverifikasi";
    const noteText = item.officerNote || "Belum ada keterangan";
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <strong>${escapeHtml(item.nama)}</strong>
          <small>Umur ${escapeHtml(item.umur)} tahun</small>
          <small>Penghasilan ${escapeHtml(labelFromValue(item.penghasilan, incomeLabels))}</small>
        </td>
        <td>${escapeHtml(item.nik)}</td>
        <td>${escapeHtml(item.rt)}</td>
        <td><strong>${item.score}</strong></td>
        <td>${escapeHtml(item.components)}</td>
        <td><span class="${statusClass(item.systemRecommendation)}">${escapeHtml(item.systemRecommendation)}</span></td>
        <td><span class="${statusClass(manualText)}">${escapeHtml(manualText)}</span></td>
        <td>${escapeHtml(noteText)}</td>
        <td><span class="${statusClass(item.finalResult)}">${escapeHtml(item.finalResult)}</span></td>
        <td>${escapeHtml(item.details)}</td>
        <td>
          <div class="table-actions">
            ${Auth.isAdmin() ? `<button onclick="openManualVerification(${index})" class="btn btn-primary small-btn">Verifikasi Manual/Edit</button>` : `<span class="status warning">Read Only</span>`}
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="12" class="empty-table">Belum ada data. Silakan input data warga.</td></tr>`;
}

function renderAll() {
  renderSummary();
  renderTable();
  renderSearchCards();
}

function saveData(event) {
  event.preventDefault();
  if (!Auth.requirePetugas()) return;
  const data = getFormData();

  if (!data.nama || !data.nik || !data.rt || data.umur <= 0) {
    alert("Nama, NIK, RT, dan umur wajib diisi.");
    return;
  }

  const result = infer(data);

  if (editIndex === null) {
    results.push(result);
  } else {
    results[editIndex] = {
      ...result,
      manualRecommendation: "",
      officerNote: "",
      finalResult: "Menunggu Verifikasi Manual",
      verifiedBy: "",
      verifiedAt: ""
    };
  }

  saveLocal();
  renderPreview(result);
  renderAll();
  resetForm();
  showPage("input");
}

function editData(index) {
  if (!Auth.requirePetugas("mengubah data input warga")) return;
  const item = results[index];
  setFormData(item);
  editIndex = index;
  el("formWarga").querySelector("button[type='submit']").textContent = "Update Data & Hitung Ulang Rekomendasi Sistem";
  showPage("input");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteData(index) {
  if (!Auth.requireAdmin("menghapus data")) return;
  if (!confirm("Hapus data ini?")) return;
  results.splice(index, 1);
  saveLocal();
  renderAll();
}

function openManualVerification(index) {
  if (!Auth.requireAdmin()) return;
  manualIndex = index;
  const item = results[index];
  el("manualRecommendation").value = item.manualRecommendation || "";
  el("officerNote").value = item.officerNote || "";
  el("manualSystemInfo").innerHTML = `
    <div class="manual-info-grid">
      <div>
        <span>Nama Warga</span>
        <strong>${escapeHtml(item.nama)}</strong>
      </div>
      <div>
        <span>Skor Sistem</span>
        <strong>${item.score}</strong>
      </div>
      <div>
        <span>Rekomendasi Sistem</span>
        <strong class="${statusClass(item.systemRecommendation)}">${escapeHtml(item.systemRecommendation)}</strong>
      </div>
      <div>
        <span>Komponen</span>
        <strong>${escapeHtml(item.components)}</strong>
      </div>
    </div>
    <p><strong>Rincian Sistem:</strong> ${escapeHtml(item.details)}</p>
  `;
  el("manualModal").classList.remove("hidden");
  el("manualRecommendation").focus();
}

function closeManualModal() {
  manualIndex = null;
  el("manualModal").classList.add("hidden");
  el("manualForm").reset();
}

function saveManualVerification(event) {
  event.preventDefault();
  if (!Auth.requireAdmin()) return;
  if (manualIndex === null) return;

  const manualRecommendation = el("manualRecommendation").value;
  const officerNote = el("officerNote").value.trim();

  if (!manualRecommendation || !officerNote) {
    alert("Rekomendasi manual dan keterangan wajib diisi.");
    return;
  }

  results[manualIndex].manualRecommendation = manualRecommendation;
  results[manualIndex].officerNote = officerNote;
  results[manualIndex].verifiedBy = Auth.getCurrentUser();
  results[manualIndex].verifiedAt = new Date().toLocaleString("id-ID");
  results[manualIndex].finalResult = getFinalResult(results[manualIndex]);

  saveLocal();
  renderAll();
  closeManualModal();
  showPage("result");
}

function exportCsv() {
  if (!Auth.requireAdmin("mengekspor data")) return;
  const headers = [
    "No",
    "Nama",
    "NIK",
    "RT",
    "Umur",
    "Penghasilan",
    "Tanggungan",
    "Kondisi Rumah",
    "Aset Produktif",
    "Kendaraan",
    "DTKS",
    "Komponen",
    "Skor",
    "Rekomendasi Sistem",
    "Rekomendasi Manual",
    "Keterangan Admin",
    "Hasil Akhir",
    "Diverifikasi Oleh",
    "Waktu Verifikasi",
    "Rincian Bobot"
  ];
  const incomeLabels = {
    kurang_800: "Kurang dari Rp800.000",
    "800_1000": "Rp800.000 sampai Rp1.000.000",
    "1000_2000": "Di atas Rp1.000.000 sampai Rp2.000.000",
    lebih_2000: "Di atas Rp2.000.000"
  };
  const rows = results.map((item, index) => [
    index + 1,
    item.nama,
    item.nik,
    item.rt,
    item.umur,
    incomeLabels[item.penghasilan],
    item.tanggungan,
    item.kondisiRumah === "tidak_layak" ? "Tidak Layak" : "Layak",
    item.asetProduktif === "tidak_ada" ? "Tidak Ada" : "Ada",
    item.kendaraan,
    item.dtks === "terdaftar" ? "Terdaftar" : "Belum Terdaftar",
    item.components,
    item.score,
    item.systemRecommendation,
    item.manualRecommendation || "Belum Diverifikasi",
    item.officerNote || "Belum ada keterangan",
    item.finalResult,
    item.verifiedBy || "-",
    item.verifiedAt || "-",
    item.details
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hasil_rekomendasi_pkh_verifikasi_manual.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function initializeApp() {
  el("userBadge").textContent = `${Auth.getRoleLabel()}: ${Auth.getCurrentUser()}`;
  applyRoleAccess();
  renderWeights();
  renderRules();
  renderAll();
  showPage(currentPage);
}

document.querySelectorAll(".nav-btn, .open-page").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

el("btnLogout").addEventListener("click", logout);
el("btnMenu").addEventListener("click", toggleSidebar);
el("overlay").addEventListener("click", closeSidebar);
el("formWarga").addEventListener("submit", saveData);
el("btnResetForm").addEventListener("click", resetForm);
el("btnExport").addEventListener("click", exportCsv);
el("searchInput").addEventListener("input", renderAll);
el("filterStatus").addEventListener("change", renderAll);
el("btnCloseModal").addEventListener("click", closeManualModal);
el("btnCancelManual").addEventListener("click", closeManualModal);
el("manualForm").addEventListener("submit", saveManualVerification);

el("manualModal").addEventListener("click", event => {
  if (event.target === el("manualModal")) closeManualModal();
});

window.addEventListener("resize", () => {
  if (isDesktop()) {
    el("overlay").classList.remove("show");
    el("sidebar").classList.remove("open");
  }
});

initializeApp();
