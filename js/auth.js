// auth.js
// Bagian ini khusus autentikasi login dan pembagian hak akses role.
// Saat sidang, jelaskan bahwa petugas dan admin dipisah melalui roleAccess.

const Auth = (() => {
  const accounts = {
    petugas: "pkh123",
    admin: "admin123"
  };

  const roleLabels = {
    petugas: "Petugas Input",
    admin: "Admin Verifikasi"
  };

  const roleAccess = {
    petugas: ["dashboard", "input"],
    admin: ["dashboard", "search", "result", "weight", "rule"]
  };

  function getCurrentUser() {
    return localStorage.getItem("pkhCurrentUser") || "";
  }

  function getCurrentRole() {
    return getCurrentUser() === "admin" ? "admin" : "petugas";
  }

  function isAdmin() {
    return getCurrentRole() === "admin";
  }

  function isPetugas() {
    return getCurrentRole() === "petugas";
  }

  function login(username, password) {
    if (accounts[username] !== password) {
      return false;
    }

    localStorage.setItem("pkhCurrentUser", username);
    return true;
  }

  function logout() {
    localStorage.removeItem("pkhCurrentUser");
  }

  function canAccessPage(page) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    return (roleAccess[getCurrentRole()] || []).includes(page);
  }

  function getDefaultPage() {
    return isAdmin() ? "result" : "input";
  }

  function getRoleLabel() {
    return roleLabels[getCurrentRole()] || "Pengguna";
  }

  function requireLogin() {
    if (getCurrentUser()) return true;
    window.location.href = "login.html";
    return false;
  }

  function requireAdmin(actionText = "melakukan verifikasi manual") {
    if (isAdmin()) return true;
    alert(`Akses ditolak. Hanya admin yang dapat ${actionText}.`);
    return false;
  }

  function requirePetugas(actionText = "menginput data warga") {
    if (isPetugas()) return true;
    alert(`Akses ditolak. Hanya petugas yang dapat ${actionText}.`);
    return false;
  }

  return {
    login,
    logout,
    getCurrentUser,
    getCurrentRole,
    getRoleLabel,
    isAdmin,
    isPetugas,
    canAccessPage,
    getDefaultPage,
    requireLogin,
    requireAdmin,
    requirePetugas
  };
})();
