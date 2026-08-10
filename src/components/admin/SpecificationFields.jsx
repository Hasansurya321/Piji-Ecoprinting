function SpecificationFields({ value = [], onChange }) {
  const handleChange = (index, field, fieldValue) => {
    const next = value.map((item, i) => (i === index ? { ...item, [field]: fieldValue } : item));
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...value, { label: '', value: '', position: value.length }]);
  };

  const handleRemove = (index) => {
    const next = value.filter((_, i) => i !== index).map((item, i) => ({ ...item, position: i }));
    onChange(next);
  };

  const handleMove = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, i) => ({ ...item, position: i })));
  };

  return (
    <div className="admin-specs">
      <div className="admin-specs__header">
        <span className="admin-field__label">Spesifikasi Produk</span>
        <button type="button" className="admin-btn admin-btn--small admin-btn--secondary" onClick={handleAdd}>
          + Tambah Baris
        </button>
      </div>

      {value.length === 0 ? (
        <p className="admin-specs__empty">Belum ada spesifikasi. Klik "Tambah Baris" untuk menambahkan.</p>
      ) : (
        <div className="admin-specs__list">
          {value.map((item, index) => (
            <div key={index} className="admin-specs__row">
              <div className="admin-specs__move">
                <button type="button" className="admin-btn admin-btn--small" onClick={() => handleMove(index, -1)} disabled={index === 0} aria-label="Naikkan">
                  ↑
                </button>
                <button type="button" className="admin-btn admin-btn--small" onClick={() => handleMove(index, 1)} disabled={index === value.length - 1} aria-label="Turunkan">
                  ↓
                </button>
              </div>
              <input type="text" className="admin-input" placeholder="Label (contoh: Bahan)" value={item.label} onChange={(e) => handleChange(index, 'label', e.target.value)} />
              <input type="text" className="admin-input" placeholder="Nilai (contoh: Katun Premium)" value={item.value} onChange={(e) => handleChange(index, 'value', e.target.value)} />
              <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => handleRemove(index)} aria-label="Hapus">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpecificationFields;
