function AdminLoadingState({ message = 'Memuat data...' }) {
  return (
    <div className="admin-state">
      <div className="admin-state__spinner" aria-hidden="true" />
      <p className="admin-state__text">{message}</p>
    </div>
  );
}

export default AdminLoadingState;
