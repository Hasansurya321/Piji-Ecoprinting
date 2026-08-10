function AdminEmptyState({ title = 'Belum ada data', description = 'Data akan muncul di sini setelah ditambahkan.' }) {
  return (
    <div className="admin-state">
      <div className="admin-state__icon" aria-hidden="true">
        ∅
      </div>
      <p className="admin-state__title">{title}</p>
      <p className="admin-state__text">{description}</p>
    </div>
  );
}

export default AdminEmptyState;
