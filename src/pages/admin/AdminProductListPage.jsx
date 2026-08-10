import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminTable from '../../components/admin/AdminTable';
import { getAllProducts, deleteProduct, getCategories } from '../../services/productAdminService';

const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return 'Rp0';
  return `Rp${num.toLocaleString('id-ID')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

function StatusBadge({ active }) {
  return <span className={`admin-badge ${active ? 'admin-badge--success' : 'admin-badge--muted'}`}>{active ? 'Aktif' : 'Tidak aktif'}</span>;
}

function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([getAllProducts(), getCategories()]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const name = (product.name ?? '').toLowerCase();
      const categoryId = product.category_id;
      const matchSearch = name.includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'all' || String(categoryId) === String(filterCategory);
      const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? !!product.is_active : !product.is_active);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchQuery, filterCategory, filterStatus]);

  const handleDeleteRequest = (product) => {
    setDeleteTarget(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setFeedback('');
    try {
      const result = await deleteProduct(deleteTarget.id);
      if (!result.success) {
        setFeedback(result.error || 'Gagal menghapus produk.');
        return;
      }
      setFeedback('Produk berhasil dihapus.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setFeedback(err.message || 'Gagal menghapus produk.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Gambar',
      render: (row) => (row.image_url ? <img src={row.image_url} alt={row.name} className="admin-table__thumb" /> : <span className="admin-table__thumb-placeholder">—</span>),
    },
    { key: 'name', label: 'Nama Produk', render: (row) => <strong>{row.name ?? '—'}</strong> },
    { key: 'category', label: 'Kategori', render: (row) => row.categories?.name ?? '—' },
    { key: 'price', label: 'Harga', render: (row) => formatPrice(row.price) },
    { key: 'stock', label: 'Stok', render: (row) => row.stock ?? 0 },
    { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={!!row.is_active} /> },
    { key: 'created_at', label: 'Tanggal Dibuat', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="admin-table__actions">
          <Link to={`/produk/${row.slug}`} className="admin-btn admin-btn--small admin-btn--secondary" target="_blank" rel="noopener noreferrer">
            Lihat
          </Link>
          <Link to={`/admin/products/${row.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">
            Edit
          </Link>
          <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => handleDeleteRequest(row)}>
            Hapus
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <AdminLoadingState message="Memuat daftar produk..." />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Produk"
        description="Kelola produk promosi EcoPrint"
        actions={
          <Link to="/admin/products/create" className="admin-btn admin-btn--primary">
            + Tambah Produk
          </Link>
        }
      />

      {feedback && <div className="admin-feedback">{feedback}</div>}

      <div className="admin-toolbar">
        <input type="text" className="admin-input" placeholder="Cari nama produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select className="admin-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select className="admin-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak aktif</option>
        </select>
      </div>

      {filtered.length === 0 ? <AdminEmptyState title="Belum ada produk" description="Produk akan muncul di sini setelah ditambahkan." /> : <AdminTable columns={columns} rows={filtered} />}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Gambar terkait juga akan dihapus.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default AdminProductListPage;
