import { useLocation, useNavigate } from 'react-router';
import { navigationItems } from '../../data/navigationData';
import './MobileMenu.css';

function MobileMenu({ isOpen, onClose, activeSection }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleNavClick = (event, item) => {
    if (isHome) {
      // di homepage: anchor hash smooth scroll, lalu tutup menu
      onClose();
      return;
    }
    event.preventDefault();
    navigate(item.sectionId === 'beranda' ? '/' : `/${item.sectionId}`);
    onClose();
  };

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
    <div id="mobile-navigation" className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!isOpen}>
      <nav className="mobile-menu__nav" aria-label="Navigasi mobile">
        <ul className="mobile-menu__list">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={`mobile-menu__link ${isActive(item) ? 'mobile-menu__link--active' : ''}`} onClick={(event) => handleNavClick(event, item)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MobileMenu;
