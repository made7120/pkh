// login.js
// Mengatur proses login lalu mengarahkan pengguna ke halaman utama aplikasi.

const el = id => document.getElementById(id);

if (Auth.getCurrentUser()) {
  window.location.href = "app.html";
}

el("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const username = el("username").value.trim();
  const password = el("password").value.trim();

  if (!Auth.login(username, password)) {
    alert("Username atau password salah.");
    return;
  }

  window.location.href = "app.html";
});
