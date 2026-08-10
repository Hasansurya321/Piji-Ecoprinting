import { useState } from 'react';
import { validateFile } from '../../services/storageService';

function GalleryImageUploader({ imageUrl, preview, onChange }) {
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'], maxSize: 2 * 1024 * 1024 });
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError('');
    onChange({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  return (
    <div className="admin-uploader">
      <div className="admin-field__label">Gambar</div>
      <label className="admin-uploader__dropzone">
        {preview || imageUrl ? <img src={preview || imageUrl} alt="Preview galeri" className="admin-uploader__preview" /> : <span className="admin-uploader__placeholder">Klik untuk upload gambar</span>}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="admin-uploader__input" />
      </label>
      {error && <p className="admin-field__error">{error}</p>}
    </div>
  );
}

export default GalleryImageUploader;
