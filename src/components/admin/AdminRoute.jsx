import { Navigate, Outlet, useLocation } from 'react-router';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import AdminLoadingState from './AdminLoadingState';
import AdminErrorState from './AdminErrorState';

function AccessDenied() {
  return (
    <div className="admin-state">
      <div className="admin-state__icon" aria-hidden="true">
        !
      </div>
      <p className="admin-state__title">Akses Ditolak</p>
      <p className="admin-state__text">Akun Anda tidak memiliki izin admin untuk membuka halaman ini.</p>
    </div>
  );
}

function AdminRoute() {
  const { isLoading, isAuthReady, isAdmin, session, error } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return <AdminLoadingState message="Memeriksa sesi admin..." />;
  }

  // Ada error nyata saat memuat session/profile → tampilkan apa adanya
  if (error) {
    return <AdminErrorState message={error} />;
  }

  // Belum login → redirect ke halaman login
  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Login tetapi bukan admin → tolak akses
  if (!isAdmin || !isAuthReady) {
    return <AccessDenied />;
  }

  return <Outlet />;
}

export default AdminRoute;
