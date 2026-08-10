import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import { getAllProducts } from '../../services/productAdminService';
import { getAllGalleries } from '../../services/galleryAdminService';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalGalleries: 0,
    activeGalleries: 0,
    inactiveGalleries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const [products, galleries] = await Promise.all([getAllProducts(), getAllGalleries()]);

        if (cancelled) return;

        const activeProducts = products.filter((p) => p.is_active).length;
        const activeGalleries = galleries.filter((g) => g.is_active).length;

        setStats({
          totalProducts: products.length,
          activeProducts,
          inactiveProducts: products.length - activeProducts,
          totalGalleries: galleries.length,
          activeGalleries,
          inactiveGalleries: galleries.length - activeGalleries,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Gagal memuat statistik dashboard.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <AdminLoadingState message="Memuat statistik dashboard..." />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const shortcuts = [
    { label: 'Tambah Produk', to: '/admin/products/create' },
    { label: 'Tambah Foto Galeri', to: '/admin/gallery/create' },
    { label: 'Lihat Semua Produk', to: '/admin/products' },
    { label: 'Lihat Semua Galeri', to: '/admin/gallery' },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader title="Dashboard" description="Ringkasan konten EcoPrint" />

      <div className="admin-stat-grid">
        <AdminStatCard label="Total Produk" value={stats.totalProducts} tone="primary" />
        <AdminStatCard label="Produk Aktif" value={stats.activeProducts} tone="success" />
        <AdminStatCard label="Produk Non-aktif" value={stats.inactiveProducts} tone="muted" />
        <AdminStatCard label="Total Foto Galeri" value={stats.totalGalleries} tone="primary" />
        <AdminStatCard label="Foto Galeri Aktif" value={stats.activeGalleries} tone="success" />
        <AdminStatCard label="Foto Galeri Non-aktif" value={stats.inactiveGalleries} tone="muted" />
      </div>

      <div className="admin-dashboard__shortcuts">
        {shortcuts.map((item) => (
          <Link key={item.to} to={item.to} className="admin-dashboard__shortcut">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
