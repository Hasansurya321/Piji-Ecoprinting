import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Leaf, User, Menu, X } from 'lucide-react';
import { navigationItems } from '../../data/navigationData';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import MobileMenu from './MobileMenu';
import './Header.css';

// ===== SCROLL SPY SECTION MAPPING =====
const scrollSpySections = ['beranda', 'produk', 'proses-ecoprint', 'galeri', 'tentang-kami'];
const sectionToNavigationMap = {
  beranda: 'beranda',
  produk: 'produk',
  'proses-ecoprint': 'produk',
  galeri: 'galeri',
  'tentang-kami': 'tentang-kami',
};

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isAdmin } = useAdminAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const isHome = location.pathname === '/';

  // ===== SCROLL SPY (homepage only) =====
  useEffect(() => {
    if (!isHome) {
      return undefined;
    }

    const OFFSET = 96; // header height + buffer
    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      let current = scrollSpySections[0] || null;
      let bestTop = -Infinity;
      for (const id of scrollSpySections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          // Pick the section closest to (and at/below) the header offset line,
          // regardless of section order.
          if (top <= OFFSET && top > bestTop) {
            bestTop = top;
            current = id;
          }
        }
      }
      setActiveSection(sectionToNavigationMap[current] ?? 'beranda');
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleAvatarClick = () => {
    if (session && isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleNavClick = (event, item) => {
    if (isHome) return; // di homepage: anchor hash smooth scroll, tanpa reload
    event.preventDefault();
    navigate(item.sectionId === 'beranda' ? '/' : `/${item.sectionId}`);
  };

  // Determine active menu based on current pathname or scroll position
  const isActive = (item) => {
    // On the homepage, follow scroll position (scroll spy)
    if (isHome) {
      return item.sectionId === activeSection;
    }

    // Dedicated pages (homepage-scroll based items)
    if (item.sectionId === 'beranda') return false;
    const pagePath = '/' + item.sectionId;
    return location.pathname === pagePath || (item.sectionId === 'produk' && location.pathname.startsWith('/produk/'));
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <a className="header__logo" href="/" aria-label="EcoPrint - Kembali ke Beranda">
            <Leaf className="header__logo-icon" size={38} strokeWidth={1.2} aria-hidden="true" />
            <div className="header__logo-text">
              <span className="header__logo-title">EcoPrint</span>
              <span className="header__logo-subtitle">Nature Leaves & Mark</span>
            </div>
          </a>
        </div>

        <div className="header__spacer"></div>

        <div className="header__right">
          <nav className="header__nav" aria-label="Navigasi utama">
            <ul className="header__nav-list">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={`header__nav-link ${isActive(item) ? 'header__nav-link--active' : ''}`} onClick={(event) => handleNavClick(event, item)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__icons">
            <button className="header__icon-btn" aria-label="Buka akun pengguna" onClick={handleAvatarClick}>
              <User size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <button className="header__hamburger" onClick={handleMenuToggle} aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">
          {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} activeSection={activeSection} />
    </header>
  );
}

export default Header;
