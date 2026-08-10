import { NavLink, useNavigate } from 'react-router';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Produk', to: '/admin/products' },
  { label: 'Tambah Produk', to: '/admin/products/create' },
  { label: 'Galeri', to: '/admin/gallery' },
  { label: 'Tambah Foto', to: '/admin/gallery/create' },
];

function AdminSidebar() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-title">EcoPrint Admin</span>
        <span className="admin-sidebar__brand-sub">Panel Pengelolaan</span>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navigasi admin">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
