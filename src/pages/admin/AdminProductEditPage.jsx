import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ProductForm from '../../components/admin/ProductForm';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminLoadingState from '../../components/admin/AdminLoadingState';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import { getProductById, updateProduct, getCategories } from '../../services/productAdminService';
import { uploadImage, buildStoragePath, deleteImage, deleteImages } from '../../services/storageService';

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
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
        const [productData, categoryData] = await Promise.all([getProductById(id), getCategories()]);
        if (cancelled) return;

        if (!productData) {
          setNotFound(true);
          return;
        }

        setProduct(productData);
        setCategories(categoryData);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Gagal memuat data produk.');
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
    const uploaded = []; // { bucket, path }

    try {
      // 1. Upload gambar baru (jika ada)
      let newImageUrl = product?.image_url ?? '';
      let newImagePath = product?.image_path ?? '';

      const primaryFile = payload.images?.find((img) => img.is_primary)?.file;
      if (primaryFile) {
        const path = buildStoragePath('product-images', `product-${id}`, primaryFile);
        const result = await uploadImage('product-images', path, primaryFile);
        uploaded.push({ bucket: 'product-images', path: result.path });
        newImageUrl = result.publicUrl;
        newImagePath = result.path;
      }

      // 2. Upload gambar tambahan baru (jika ada)
      const extraFiles = (payload.images ?? []).filter((img) => !img.is_primary);
      const extraImages = [];
      for (const img of extraFiles) {
        const path = buildStoragePath('product-images', `product-${id}`, img.file);
        // eslint-disable-next-line no-await-in-loop
        const result = await uploadImage('product-images', path, img.file);
        uploaded.push({ bucket: 'product-images', path: result.path });
        extraImages.push({ is_primary: false, image_url: result.publicUrl, image_path: result.path });
      }

      // 3. Update database
      const payloadWithImages = {
        ...payload,
        image_url: newImageUrl,
        image_path: newImagePath,
        images: extraImages,
      };

      const result = await updateProduct(id, payloadWithImages);

      if (!result.success) {
        // Rollback: hapus file baru yang diunggah
        await deleteImages(
          'product-images',
          uploaded.map((u) => u.path),
        );
        setFeedback(result.error || 'Gagal memperbarui produk.');
        return;
      }

      // 4. Update berhasil → hapus gambar utama lama (jika diganti)
      if (primaryFile && product?.image_path) {
        await deleteImage('product-images', product.image_path);
      }

      setFeedback('Produk berhasil diperbarui.');
      navigate('/admin/products');
    } catch (err) {
      await deleteImages(
        'product-images',
        uploaded.map((u) => u.path),
      );
      setFeedback(err.message || 'Gagal memperbarui produk.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoadingState message="Memuat data produk..." />;
  }

  if (notFound) {
    return <AdminEmptyState title="Produk tidak ditemukan" description="Produk yang Anda cari tidak ada atau telah dihapus." />;
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="admin-page">
      <AdminPageHeader title="Edit Produk" description={`Perbarui produk: ${product.name}`} />
      {feedback && <div className="admin-feedback admin-feedback--error">{feedback}</div>}
      <ProductForm initialData={product} categories={categories} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AdminProductEditPage;
