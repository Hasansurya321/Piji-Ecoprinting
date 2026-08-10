import { useState } from 'react';
import ProductImageUploader from './ProductImageUploader';
import SpecificationFields from './SpecificationFields';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function ProductForm({ initialData = null, categories = [], onSubmit, submitting = false }) {
  const [form, setForm] = useState(() => ({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    category_id: initialData?.category_id ?? '',
    price: initialData?.price ?? '',
    stock: initialData?.stock ?? '',
    short_description: initialData?.short_description ?? '',
    description: initialData?.description ?? '',
    shopee_url: initialData?.shopee_url ?? '',
    whatsapp_url: initialData?.whatsapp_url ?? '',
    is_active: initialData?.is_active ?? true,
  }));

  const [specifications, setSpecifications] = useState(() => (initialData?.product_specifications ?? []).map((spec) => ({ label: spec.label, value: spec.value, position: spec.position })));

  const [primaryImage, setPrimaryImage] = useState({
    file: null,
    preview: initialData?.image_url ?? '',
  });

  const [additionalImages, setAdditionalImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === slugify(prev.name) ? slugify(name) : prev.slug,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Nama produk wajib diisi.';
    }

    if (!form.slug.trim()) {
      nextErrors.slug = 'Slug wajib diisi.';
    }

    const priceNumber = Number(form.price);
    if (form.price === '' || Number.isNaN(priceNumber)) {
      nextErrors.price = 'Harga harus berupa angka.';
    } else if (priceNumber < 0) {
      nextErrors.price = 'Harga tidak boleh negatif.';
    }

    const stockNumber = Number(form.stock);
    if (form.stock === '' || Number.isNaN(stockNumber)) {
      nextErrors.stock = 'Stok harus berupa angka.';
    } else if (stockNumber < 0) {
      nextErrors.stock = 'Stok tidak boleh negatif.';
    }

    if (form.shopee_url) {
      try {
        const parsed = new URL(form.shopee_url);
        if (!/^https?:$/.test(parsed.protocol)) {
          nextErrors.shopee_url = 'Link Shopee harus URL valid (http/https).';
        }
      } catch {
        nextErrors.shopee_url = 'Link Shopee harus URL valid.';
      }
    }

    if (form.whatsapp_url) {
      try {
        const parsed = new URL(form.whatsapp_url);
        if (!/^https?:$/.test(parsed.protocol)) {
          nextErrors.whatsapp_url = 'Link WhatsApp harus URL valid (http/https).';
        }
      } catch {
        nextErrors.whatsapp_url = 'Link WhatsApp harus URL valid.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const images = [];
    if (primaryImage.file) {
      images.push({ file: primaryImage.file, is_primary: true });
    }
    additionalImages.forEach((img) => {
      images.push({ file: img.file, is_primary: false });
    });

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      specifications,
      images,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__grid">
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-name">
            Nama Produk *
          </label>
          <input id="product-name" type="text" className="admin-input" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Contoh: Scarf Ecoprint Daun Jati" />
          {errors.name && <p className="admin-field__error">{errors.name}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-slug">
            Slug
          </label>
          <input id="product-slug" type="text" className="admin-input" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="scarf-ecoprint-daun-jati" />
          {errors.slug && <p className="admin-field__error">{errors.slug}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-category">
            Kategori
          </label>
          <select id="product-category" className="admin-input" value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)}>
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-price">
            Harga (Rp) *
          </label>
          <input id="product-price" type="number" min="0" step="0" className="admin-input" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="150000" />
          {errors.price && <p className="admin-field__error">{errors.price}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-stock">
            Stok *
          </label>
          <input id="product-stock" type="number" min="0" step="0" className="admin-input" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="10" />
          {errors.stock && <p className="admin-field__error">{errors.stock}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="product-active">
            Status Aktif
          </label>
          <div className="admin-switch">
            <input id="product-active" type="checkbox" checked={form.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
            <label htmlFor="product-active">{form.is_active ? 'Aktif' : 'Non-aktif'}</label>
          </div>
        </div>

        <div className="admin-field admin-field--full">
          <label className="admin-field__label" htmlFor="product-short-desc">
            Deskripsi Singkat
          </label>
          <textarea
            id="product-short-desc"
            className="admin-input admin-input--textarea"
            rows={2}
            value={form.short_description}
            onChange={(e) => handleChange('short_description', e.target.value)}
            placeholder="Deskripsi singkat untuk kartu produk"
          />
        </div>

        <div className="admin-field admin-field--full">
          <label className="admin-field__label" htmlFor="product-desc">
            Deskripsi Lengkap
          </label>
          <textarea
            id="product-desc"
            className="admin-input admin-input--textarea"
            rows={5}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Deskripsi lengkap untuk halaman detail produk"
          />
        </div>

        <div className="admin-field admin-field--full">
          <label className="admin-field__label" htmlFor="product-shopee">
            Link Shopee
          </label>
          <input id="product-shopee" type="url" className="admin-input" value={form.shopee_url} onChange={(e) => handleChange('shopee_url', e.target.value)} placeholder="https://shopee.co.id/..." />
          {errors.shopee_url && <p className="admin-field__error">{errors.shopee_url}</p>}
        </div>

        <div className="admin-field admin-field--full">
          <label className="admin-field__label" htmlFor="product-whatsapp">
            Link WhatsApp
          </label>
          <input id="product-whatsapp" type="url" className="admin-input" value={form.whatsapp_url} onChange={(e) => handleChange('whatsapp_url', e.target.value)} placeholder="https://wa.me/628..." />
          {errors.whatsapp_url && <p className="admin-field__error">{errors.whatsapp_url}</p>}
        </div>
      </div>

      <div className="admin-form__section">
        <ProductImageUploader primaryImage={initialData?.image_url ?? ''} primaryPreview={primaryImage.preview} additionalImages={additionalImages} onChangePrimary={(img) => setPrimaryImage(img)} onChangeAdditional={setAdditionalImages} />
      </div>

      <div className="admin-form__section">
        <SpecificationFields value={specifications} onChange={setSpecifications} />
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
          {submitting ? 'Menyimpan...' : initialData ? 'Perbarui Produk' : 'Simpan Produk'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
