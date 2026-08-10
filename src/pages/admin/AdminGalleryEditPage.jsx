import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import GalleryForm from '../../components/admin/GalleryForm';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import { getGalleryById, updateGallery, getGalleryCategories } from '../../services/galleryAdminService';
import { uploadImage, buildStoragePath, deleteImage } from '../../services/storageService';

function AdminGalleryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [galleryData, categoryData] = await Promise.all([getGalleryById(id), getGalleryCategories()]);
        if (cancelled) return;

        if (!galleryData) {
          setNotFound(true);
          return;
        }

        setGallery(galleryData);
        setCategories(categoryData);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Gagal memuat data galeri.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFeedback('');
    let uploadedPath = '';

    try {
      // 1. Upload gambar baru (jika ada)
      let newImageUrl = gallery?.image_url ?? '';
      let newImagePath = gallery?.image_path ?? '';

      if (payload.image) {
        const path = buildStoragePath('gallery-images', `gallery-${id}`, payload.image);
        const result = await uploadImage('gallery-images', path, payload.image);
        uploadedPath = result.path;
        newImageUrl = result.publicUrl;
        newImagePath = result.path;
      }

      // 2. Update database
      const result = await updateGallery(id, {
        ...payload,
        image_url: newImageUrl,
        image_path: newImagePath,
      });

      if (!result.success) {
        // Rollback: hapus file baru yang diunggah
        if (uploadedPath) {
          await deleteImage('gallery-images', uploadedPath);
        }
        setFeedback(result.error || 'Gagal memperbarui foto galeri.');
        return;
      }

      // 3. Update berhasil → hapus gambar lama (jika diganti)
      if (payload.image && gallery?.image_path) {
        await deleteImage('gallery-images', gallery.image_path);
      }

      setFeedback('Foto galeri berhasil diperbarui.');
      navigate('/admin/gallery');
    } catch (err) {
      if (uploadedPath) {
        await deleteImage('gallery-images', uploadedPath);
      }
      setFeedback(err.message || 'Gagal memperbarui foto galeri.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoadingState message="Memuat data galeri..." />;
  }

  if (notFound) {
    return <AdminEmptyState title="Foto tidak ditemukan" description="Foto galeri yang Anda cari tidak ada atau telah dihapus." />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader title="Edit Foto" description={`Perbarui foto galeri: ${gallery.title}`} />
      {feedback && <div className="admin-feedback admin-feedback--error">{feedback}</div>}
      <GalleryForm initialData={gallery} categories={categories} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AdminGalleryEditPage;
