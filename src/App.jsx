import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import TentangKamiPage from './pages/TentangKamiPage';
import GalleryPage from './pages/GalleryPage';

// ===== ADMIN LAZY LOADED (bundle publik lebih kecil) =====
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductListPage = lazy(() => import('./pages/admin/AdminProductListPage'));
const AdminProductCreatePage = lazy(() => import('./pages/admin/AdminProductCreatePage'));
const AdminProductEditPage = lazy(() => import('./pages/admin/AdminProductEditPage'));
const AdminGalleryListPage = lazy(() => import('./pages/admin/AdminGalleryListPage'));
const AdminGalleryCreatePage = lazy(() => import('./pages/admin/AdminGalleryCreatePage'));
const AdminGalleryEditPage = lazy(() => import('./pages/admin/AdminGalleryEditPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));

function AdminFallback() {
  return <div className="admin-state">Memuat panel admin...</div>;
}

function App() {
  return (
    <Routes>
      {/* ===== ROUTE PUBLIK ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/produk" element={<ProductPage />} />
      <Route path="/produk/:slug" element={<ProductDetailPage />} />
      <Route path="/tentang-kami" element={<TentangKamiPage />} />
      <Route path="/galeri" element={<GalleryPage />} />

      {/* ===== ROUTE ADMIN ===== */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      <Route
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminRoute />
          </Suspense>
        }
      >
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminDashboardPage />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProductListPage />
              </Suspense>
            }
          />
          <Route
            path="products/create"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProductCreatePage />
              </Suspense>
            }
          />
          <Route
            path="products/:id/edit"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProductEditPage />
              </Suspense>
            }
          />
          <Route
            path="gallery"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGalleryListPage />
              </Suspense>
            }
          />
          <Route
            path="gallery/create"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGalleryCreatePage />
              </Suspense>
            }
          />
          <Route
            path="gallery/:id/edit"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGalleryEditPage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
