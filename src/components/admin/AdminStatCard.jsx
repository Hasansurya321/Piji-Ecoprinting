function AdminStatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`admin-stat-card admin-stat-card--${tone}`}>
      <span className="admin-stat-card__label">{label}</span>
      <span className="admin-stat-card__value">{value ?? 0}</span>
    </div>
  );
}

export default AdminStatCard;
