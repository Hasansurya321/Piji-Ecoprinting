import { useNavigate, useLocation } from 'react-router';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Daftar Produk',
  '/admin/products/create': 'Tambah Produk',
  '/admin/gallery': 'Daftar Galeri',
  '/admin/gallery/create': 'Tambah Foto',
};

function getPageTitle(pathname) {
  // Edit pages: /admin/products/:id/edit → "Edit Produk"
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) {
    return 'Edit Produk';
  }
  if (/^\/admin\/gallery\/[^/]+\/edit$/.test(pathname)) {
    return 'Edit Foto';
  }
  return pageTitles[pathname] ?? 'Admin EcoPrint';
}

function AdminTopbar() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__title">{getPageTitle(location.pathname)}</div>
      <div className="admin-topbar__right">
        <span className="admin-topbar__user">{user?.email ?? 'Admin (placeholder)'}</span>
        <button type="button" className="admin-topbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminTopbar;
