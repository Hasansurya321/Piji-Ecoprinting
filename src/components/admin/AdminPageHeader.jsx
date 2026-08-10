function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__text">
        <h1 className="admin-page-header__title">{title}</h1>
        {description && <p className="admin-page-header__description">{description}</p>}
      </div>
      {actions && <div className="admin-page-header__actions">{actions}</div>}
    </div>
  );
}

export default AdminPageHeader;
