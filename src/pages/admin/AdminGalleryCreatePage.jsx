import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GalleryForm from '../../components/admin/GalleryForm';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import { getGalleryCategories, createGallery } from '../../services/galleryAdminService';
import { uploadImage, buildStoragePath, deleteImage } from '../../services/storageService';

function AdminGalleryCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getGalleryCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setCategoriesError(err.message || 'Gagal memuat kategori galeri.');
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFeedback('');
    let uploadedPath = '';

    try {
      // 1. Upload gambar
      let imageUrl = '';
      let imagePath = '';

      if (payload.image) {
        const path = buildStoragePath('gallery-images', 'temp', payload.image);
        const result = await uploadImage('gallery-images', path, payload.image);
        uploadedPath = result.path;
        imageUrl = result.publicUrl;
        imagePath = result.path;
      }

      // 2. Simpan record galeri
      const result = await createGallery({
        ...payload,
        image_url: imageUrl,
        image_path: imagePath,
      });

      if (!result.gallery) {
        // Rollback: jika upload sukses tapi insert gagal, hapus file
        if (uploadedPath) {
          await deleteImage('gallery-images', uploadedPath);
        }
        setFeedback(result.error || 'Gagal menyimpan foto galeri.');
        return;
      }

      setFeedback('Foto galeri berhasil dipublikasikan.');
      navigate('/admin/gallery');
    } catch (err) {
      if (uploadedPath) {
        await deleteImage('gallery-images', uploadedPath);
      }
      setFeedback(err.message || 'Gagal menyimpan foto galeri.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <AdminLoadingState message="Memuat kategori galeri..." />;
  }

  if (categoriesError) {
    return <AdminErrorState message={categoriesError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader title="Tambah Foto" description="Tambahkan foto baru ke galeri" />
      {feedback && <div className="admin-feedback admin-feedback--error">{feedback}</div>}
      <GalleryForm categories={categories} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AdminGalleryCreatePage;
