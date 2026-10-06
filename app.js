const SUPABASE_URL = "https://hpmcxbmpdoubpommxnko.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nWgCEuMQZ4sQ8Jr8-08HxQ_3rvGtesh";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tabelUser = document.getElementById("tabel-user");
const statusEl = document.getElementById("status");
const form = document.getElementById("form-tambah");

async function muatUser() {
  const { data, error } = await supabase
    .from("users")
    .select("nama, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    tabelUser.innerHTML = `<tr><td colspan="3">Gagal memuat data: ${error.message}</td></tr>`;
    return;
  }

  if (!data.length) {
    tabelUser.innerHTML = `<tr><td colspan="3">Belum ada user.</td></tr>`;
    return;
  }

  tabelUser.innerHTML = data
    .map(
      (user) => `
    <tr>
      <td>${user.nama}</td>
      <td>${user.email}</td>
      <td>${new Date(user.created_at).toLocaleString("id-ID")}</td>
    </tr>
  `
    )
    .join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("input-nama").value.trim();
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value;

  statusEl.textContent = "Menyimpan...";

  const { error } = await supabase.from("users").insert({ nama, email, password });

  if (error) {
    statusEl.textContent = `Gagal menyimpan: ${error.message}`;
    return;
  }

  form.reset();
  statusEl.textContent = "User berhasil ditambahkan.";
  muatUser();
});

muatUser();
