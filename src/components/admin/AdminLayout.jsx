import { Outlet } from 'react-router';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import '../../styles/admin/admin.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminTopbar />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
