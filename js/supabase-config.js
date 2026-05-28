// supabase-config.js
// Konfigurasi koneksi database online Supabase.
// URL memakai base URL project, bukan URL /rest/v1/.
// Publishable key boleh dipakai di frontend, tetapi data tetap harus diamankan dengan RLS policy.

const SUPABASE_URL = "https://zvzaxyxeqpbymjzpdubx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5VBUMdfV61o5jgMHdVx9mA_u-pmCCRS";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
