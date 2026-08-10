/**
 * ===== AUTH SERVICE (SUPABASE AUTH) =====
 * Implementasi nyata Supabase Auth untuk Panel Admin EcoPrint.
 *
 * CATATAN:
 * - Verifikasi role admin melalui tabel `profiles`, BUKAN localStorage.
 * - Admin user harus terdaftar di Supabase Auth dan punya row di `profiles`
 *   dengan role = 'admin' (dibuat via migration/dashboard/backend, bukan frontend).
 * - Jangan pernah memasukkan service role key ke frontend.
 */
import { supabase } from '../lib/supabase';

/**
 * Login dengan email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ session: object, user: object }>}
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(getFriendlyAuthError(error));
  }

  return { session: data.session, user: data.user };
}

/**
 * Logout — hentikan session.
 * @returns {Promise<void>}
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Gagal logout: ${error.message}`);
  }
}

/**
 * Ambil session saat ini.
 * @returns {Promise<{ session: object|null }>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(`Gagal membaca session: ${error.message}`);
  }
  return { session: data.session ?? null };
}

/**
 * Ambil user saat ini.
 * @returns {Promise<{ user: object|null }>}
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Gagal membaca user: ${error.message}`);
  }
  return { user: data.user ?? null };
}

/**
 * Daftarkan listener perubahan state auth.
 * @param {(session: object|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription.unsubscribe;
}

/**
 * Ambil profil admin untuk user saat ini.
 * Mengembalikan `null` jika belum login.
 * Tidak menganggap semua user sebagai admin.
 * @returns {Promise<object|null>}
 */
export async function getCurrentAdminProfile() {
  // Ambil user aktif langsung dari Supabase Auth
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Gagal membaca user: ${userError.message}`);
  }

  const user = userData.user;
  if (!user) return null;

  // Query profil berdasarkan ID user aktif
  const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at, updated_at').eq('id', user.id).maybeSingle();

  if (error) {
    // PGRST116 = row tidak ditemukan → bukan admin (bukan error fatal)
    if (error.code === 'PGRST116') {
      return null;
    }
    // Error lain (mis. RLS menolak) dilempar agar tidak disamarkan
    throw new Error(`Gagal membaca profil admin: ${error.message}`);
  }

  return data ?? null;
}

/**
 * Terjemahkan pesan error Supabase Auth menjadi pesan ramah pengguna.
 * @param {object} error
 * @returns {string}
 */
function getFriendlyAuthError(error) {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Email atau password salah. Silakan coba lagi.';
    case 'user_not_found':
      return 'Email tidak terdaftar.';
    case 'email_not_confirmed':
      return 'Email belum dikonfirmasi. Periksa kotak masuk Anda.';
    case 'too_many_requests':
      return 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
    default:
      return error.message || 'Gagal login. Silakan coba lagi.';
  }
}
