function AdminConfirmDialog({ open, title = 'Konfirmasi', message, confirmLabel = 'Hapus', cancelLabel = 'Batal', onConfirm, onCancel, loading = false }) {
  if (!open) return null;

  return (
    <div className="admin-dialog-overlay" role="presentation" onClick={onCancel}>
      <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-dialog__title" id="admin-dialog-title">
          {title}
        </h3>
        <p className="admin-dialog__message">{message}</p>
        <div className="admin-dialog__actions">
          <button type="button" className="admin-btn admin-btn--secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminConfirmDialog;
