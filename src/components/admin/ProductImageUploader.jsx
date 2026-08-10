import { useState } from 'react';
import { validateFile } from '../../services/storageService';

function ProductImageUploader({ primaryImage, primaryPreview, additionalImages = [], onChangePrimary, onChangeAdditional }) {
  const [error, setError] = useState('');

  const handlePrimaryFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'], maxSize: 2 * 1024 * 1024 });
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError('');
    onChangePrimary({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleAdditionalFiles = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const validated = [];
    for (const file of files) {
      const validation = validateFile(file, { allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'], maxSize: 2 * 1024 * 1024 });
      if (!validation.valid) {
        setError(validation.message);
        return;
      }
      validated.push({ file, preview: URL.createObjectURL(file) });
    }

    setError('');
    onChangeAdditional([...additionalImages, ...validated]);
  };

  const handleRemoveAdditional = (index) => {
    onChangeAdditional(additionalImages.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-uploader">
      <div className="admin-field__label">Gambar Utama</div>
      <div className="admin-uploader__primary">
        <label className="admin-uploader__dropzone">
          {primaryPreview || primaryImage ? <img src={primaryPreview || primaryImage} alt="Gambar utama" className="admin-uploader__preview" /> : <span className="admin-uploader__placeholder">Klik untuk upload gambar utama</span>}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePrimaryFile} className="admin-uploader__input" />
        </label>
      </div>

      <div className="admin-field__label" style={{ marginTop: 16 }}>
        Gambar Tambahan
      </div>
      <div className="admin-uploader__additional">
        {additionalImages.map((img, idx) => (
          <div key={idx} className="admin-uploader__thumb">
            <img src={img.preview} alt={`Gambar tambahan ${idx + 1}`} className="admin-uploader__thumb-img" />
            <button type="button" className="admin-uploader__remove" onClick={() => handleRemoveAdditional(idx)} aria-label={`Hapus gambar ${idx + 1}`}>
              ✕
            </button>
          </div>
        ))}
        <label className="admin-uploader__add">
          <span>+</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleAdditionalFiles} className="admin-uploader__input" />
        </label>
      </div>

      {error && <p className="admin-field__error">{error}</p>}
    </div>
  );
}

export default ProductImageUploader;
