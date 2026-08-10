import { useState } from 'react';
import GalleryImageUploader from './GalleryImageUploader';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function GalleryForm({ initialData = null, categories = [], onSubmit, submitting = false }) {
  const [form, setForm] = useState(() => ({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    category_id: initialData?.category_id ?? '',
    description: initialData?.description ?? '',
    is_active: initialData?.is_active ?? true,
  }));

  const [image, setImage] = useState({
    file: null,
    preview: initialData?.image_url ?? '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === slugify(prev.title) ? slugify(title) : prev.slug,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Judul wajib diisi.';
    }

    if (!form.slug.trim()) {
      nextErrors.slug = 'Slug wajib diisi.';
    }

    if (!initialData && !image.file) {
      nextErrors.image = 'Gambar wajib diunggah saat menambah foto.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Normalisasi payload: position & alt_text tidak diisi via UI
    onSubmit({
      title: form.title,
      slug: form.slug,
      category_id: form.category_id,
      description: form.description ?? '',
      is_active: form.is_active,
      position: 0, // otomatis 0
      alt_text: form.title.trim() || null, // otomatis dari judul
      image: image.file ?? null,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__grid">
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="gallery-title">
            Judul *
          </label>
          <input id="gallery-title" type="text" className="admin-input" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Contoh: Workshop Ecoprint Bersama PKK" />
          {errors.title && <p className="admin-field__error">{errors.title}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="gallery-slug">
            Slug
          </label>
          <input id="gallery-slug" type="text" className="admin-input" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="workshop-ecoprint-pkk" />
          {errors.slug && <p className="admin-field__error">{errors.slug}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="gallery-category">
            Kategori
          </label>
          <select id="gallery-category" className="admin-input" value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)}>
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="gallery-active">
            Status Aktif
          </label>
          <div className="admin-switch">
            <input id="gallery-active" type="checkbox" checked={form.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
            <label htmlFor="gallery-active">{form.is_active ? 'Aktif' : 'Non-aktif'}</label>
          </div>
        </div>

        <div className="admin-field admin-field--full">
          <label className="admin-field__label" htmlFor="gallery-desc">
            Deskripsi
          </label>
          <textarea id="gallery-desc" className="admin-input admin-input--textarea" rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Deskripsi singkat kegiatan/foto" />
        </div>
      </div>

      <div className="admin-form__section">
        <GalleryImageUploader imageUrl={initialData?.image_url ?? ''} preview={image.preview} onChange={setImage} />
        {errors.image && <p className="admin-field__error">{errors.image}</p>}
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
          {submitting ? 'Menyimpan...' : initialData ? 'Perbarui Foto' : 'Simpan Foto'}
        </button>
      </div>
    </form>
  );
}

export default GalleryForm;
