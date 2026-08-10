import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';

function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from ?? '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal login. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      {/* ===== TOMBOL KEMBALI KE BERANDA ===== */}
      <Link to="/" className="admin-login__back">
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        <span>Kembali ke Beranda</span>
      </Link>

      <form className="admin-login__card" onSubmit={handleSubmit} noValidate>
        <h1 className="admin-login__title">EcoPrint Admin</h1>
        <p className="admin-login__subtitle">Masuk ke panel pengelolaan konten</p>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="login-email">
            Email
          </label>
          <input id="login-email" type="text" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ecoprint.id" autoComplete="username" />
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="login-password">
            Password
          </label>
          <div className="admin-login__password-wrap">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="admin-input admin-login__password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button type="button" className="admin-login__toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={showPassword}>
              {showPassword ? <EyeOff size={20} strokeWidth={1.8} aria-hidden="true" /> : <Eye size={20} strokeWidth={1.8} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {error && <p className="admin-field__error">{error}</p>}

        <button type="submit" className="admin-btn admin-btn--primary admin-login__submit" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
