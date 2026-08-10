import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminTable from '../../components/admin/AdminTable';
import { getAllGalleries, deleteGallery, getGalleryCategories } from '../../services/galleryAdminService';

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

function AdminGalleryListPage() {
  const [galleries, setGalleries] = useState([]);
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
      const [galleryData, categoryData] = await Promise.all([getAllGalleries(), getGalleryCategories()]);
      setGalleries(galleryData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar galeri.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return galleries.filter((gallery) => {
      const title = (gallery.title ?? '').toLowerCase();
      const categoryId = gallery.category_id;
      const matchSearch = title.includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'all' || String(categoryId) === String(filterCategory);
      const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? !!gallery.is_active : !gallery.is_active);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [galleries, searchQuery, filterCategory, filterStatus]);

  const handleDeleteRequest = (gallery) => {
    setDeleteTarget(gallery);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setFeedback('');
    try {
      const result = await deleteGallery(deleteTarget.id);
      if (!result.success) {
        setFeedback(result.error || 'Gagal menghapus foto galeri.');
        return;
      }
      setFeedback('Foto galeri berhasil dihapus.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setFeedback(err.message || 'Gagal menghapus foto galeri.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Foto',
      render: (row) => (row.image_url ? <img src={row.image_url} alt={row.title} className="admin-table__thumb" /> : <span className="admin-table__thumb-placeholder">—</span>),
    },
    { key: 'title', label: 'Judul', render: (row) => <strong>{row.title ?? '—'}</strong> },
    { key: 'category', label: 'Kategori', render: (row) => row.gallery_categories?.name ?? '—' },
    { key: 'position', label: 'Urutan', render: (row) => row.position ?? 0 },
    { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={!!row.is_active} /> },
    { key: 'created_at', label: 'Tanggal Dibuat', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="admin-table__actions">
          <Link to={`/admin/gallery/${row.id}/edit`} className="admin-btn admin-btn--small admin-btn--secondary">
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
    return <AdminLoadingState message="Memuat daftar galeri..." />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Galeri"
        description="Kelola foto galeri kegiatan EcoPrint"
        actions={
          <Link to="/admin/gallery/create" className="admin-btn admin-btn--primary">
            + Tambah Foto
          </Link>
        }
      />

      {feedback && <div className="admin-feedback">{feedback}</div>}

      <div className="admin-toolbar">
        <input type="text" className="admin-input" placeholder="Cari judul foto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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

      {filtered.length === 0 ? <AdminEmptyState title="Belum ada foto" description="Foto galeri akan muncul di sini setelah ditambahkan." /> : <AdminTable columns={columns} rows={filtered} />}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Hapus Foto"
        message={`Yakin ingin menghapus "${deleteTarget?.title}"? Gambar terkait juga akan dihapus.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default AdminGalleryListPage;
