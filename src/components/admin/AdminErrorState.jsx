function AdminErrorState({ message = 'Terjadi kesalahan.', onRetry }) {
  return (
    <div className="admin-state">
      <div className="admin-state__icon" aria-hidden="true">
        !
      </div>
      <p className="admin-state__text">{message}</p>
      {onRetry && (
        <button type="button" className="admin-btn admin-btn--secondary" onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export default AdminErrorState;
