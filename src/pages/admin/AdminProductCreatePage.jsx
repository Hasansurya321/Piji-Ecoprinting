import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ProductForm from '../../components/admin/ProductForm';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import { getCategories, createProduct } from '../../services/productAdminService';
import { uploadImage, buildStoragePath, deleteImages } from '../../services/storageService';

function AdminProductCreatePage() {
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
        const data = await getCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setCategoriesError(err.message || 'Gagal memuat kategori.');
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
    const uploaded = []; // { bucket, path }

    try {
      // 1. Upload gambar utama
      let imageUrl = payload.image_url || '';
      let imagePath = payload.image_path || '';

      const primaryFile = payload.images?.find((img) => img.is_primary)?.file;
      if (primaryFile) {
        const path = buildStoragePath('product-images', 'temp', primaryFile);
        const result = await uploadImage('product-images', path, primaryFile);
        uploaded.push({ bucket: 'product-images', path: result.path });
        imageUrl = result.publicUrl;
        imagePath = result.path;
      }

      // 2. Upload gambar tambahan
      const extraFiles = (payload.images ?? []).filter((img) => !img.is_primary);
      const extraImages = [];
      for (const img of extraFiles) {
        const path = buildStoragePath('product-images', 'temp', img.file);
        // eslint-disable-next-line no-await-in-loop
        const result = await uploadImage('product-images', path, img.file);
        uploaded.push({ bucket: 'product-images', path: result.path });
        extraImages.push({ file: img.file, is_primary: false, image_url: result.publicUrl, image_path: result.path });
      }

      // 3. Simpan produk + spesifikasi + relasi gambar
      const payloadWithImages = {
        ...payload,
        image_url: imageUrl,
        image_path: imagePath,
        images: extraImages,
      };

      const result = await createProduct(payloadWithImages);

      if (!result.product) {
        // Rollback: hapus semua file yang baru diunggah
        await deleteImages(
          'product-images',
          uploaded.map((u) => u.path),
        );
        setFeedback(result.error || 'Gagal menyimpan produk.');
        return;
      }

      setFeedback('Produk berhasil ditambahkan.');
      navigate('/admin/products');
    } catch (err) {
      // Rollback dasar
      await deleteImages(
        'product-images',
        uploaded.map((u) => u.path),
      );
      setFeedback(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <AdminLoadingState message="Memuat kategori..." />;
  }

  if (categoriesError) {
    return <AdminErrorState message={categoriesError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader title="Tambah Produk" description="Buat produk promosi baru" />
      {feedback && <div className="admin-feedback admin-feedback--error">{feedback}</div>}
      <ProductForm categories={categories} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AdminProductCreatePage;
