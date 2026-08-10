import { useCallback, useEffect, useState } from 'react';
import { login as authLogin, logout as authLogout, getSession, getCurrentUser, getCurrentAdminProfile, onAuthStateChange } from '../../services/authService';

/**
 * ===== USE ADMIN AUTH (SUPABASE) =====
 * Hook terpusat untuk verifikasi session & role admin.
 *
 * Alur:
 *   Aplikasi mulai → ambil session → jika ada, ambil profile →
 *   isAdmin = profile?.role === 'admin'
 */
export function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    // Query profile; jika gagal, biarkan error mengalir ke pemanggil.
    const adminProfile = await getCurrentAdminProfile();
    setProfile(adminProfile);
    setIsAdmin(adminProfile?.role === 'admin');
  }, []);

  // Inisialisasi session + pasang listener auth
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { session: currentSession } = await getSession();
        const { user: currentUser } = await getCurrentUser();

        if (cancelled) return;

        setSession(currentSession);
        setUser(currentUser);
        await refreshProfile(currentUser);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Gagal memeriksa sesi.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    // Listener perubahan auth; muat ulang profile saat sesi berubah
    const unsubscribe = onAuthStateChange(async (nextSession) => {
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      try {
        await refreshProfile(nextUser);
      } catch (err) {
        setError(err.message || 'Gagal memeriksa profil.');
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [refreshProfile]);

  const handleLogin = useCallback(
    async (email, password) => {
      setError('');
      const result = await authLogin(email, password);
      setSession(result.session);
      setUser(result.user);
      try {
        await refreshProfile(result.user);
      } catch (err) {
        setError(err.message || 'Gagal memeriksa profil.');
        throw err;
      }
      if (!result.user) {
        throw new Error('Login gagal. Coba lagi.');
      }
      return result.user;
    },
    [refreshProfile],
  );

  const handleLogout = useCallback(async () => {
    await authLogout();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setError('');
  }, []);

  // ===== LOGGING SEMENTARA (DEBUG AKSES DITOLAK) — hapus setelah bug ditemukan =====
  // eslint-disable-next-line no-console
  console.log('useAdminAuth state:', {
    sessionUserId: session?.user?.id ?? null,
    userId: user?.id ?? null,
    profile,
    isAdmin,
    error,
  });
  // ===== END LOGGING SEMENTARA =====

  return {
    session,
    user,
    profile,
    isAdmin,
    isAuthReady: !!session && isAdmin,
    isLoading: loading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };
}
