import { useState, useEffect } from 'react';
import './FooterSection.css';

// ===== SOCIAL MEDIA SVG ICONS =====
const InstagramIcon = () => (
  <svg className="footer-section__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="footer-section__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="footer-section__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

function FooterSection() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-section" id="footer">
      <div className="footer-section__container">
        {/* ===== GRID ===== */}
        <div className="footer-section__grid">
          {/* ===== KOLOM 1: BRAND ===== */}
          <div className="footer-section__column footer-section__column--brand">
            <div className="footer-section__brand-logo">EcoPrint</div>
            <div className="footer-section__brand-tagline">Nature Leaves & Mark</div>
            <p className="footer-section__brand-desc">Eco printing dengan pewarna alami dari tumbuhan. Setiap karya unik, berkelanjutan, dan ramah lingkungan.</p>
            <div className="footer-section__social">
              <a href="https://instagram.com" className="footer-section__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" className="footer-section__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/6281234567890" className="footer-section__social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* ===== KOLOM 2: NAVIGASI ===== */}
          <div className="footer-section__column">
            <h4 className="footer-section__column-title">Navigasi</h4>
            <ul className="footer-section__link-list">
              <li>
                <a href="#hero" className="footer-section__link">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang-kami" className="footer-section__link">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#produk" className="footer-section__link">
                  Produk
                </a>
              </li>
              <li>
                <a href="#galeri" className="footer-section__link">
                  Galeri
                </a>
              </li>
              <li>
                <a href="/blog" className="footer-section__link">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* ===== KOLOM 3: PRODUK ===== */}
          <div className="footer-section__column">
            <h4 className="footer-section__column-title">Produk</h4>
            <ul className="footer-section__link-list">
              <li>
                <a href="/produk/scarf-shawl" className="footer-section__link">
                  Scarf & Shawl
                </a>
              </li>
              <li>
                <a href="/produk/tote-bag" className="footer-section__link">
                  Tote Bag
                </a>
              </li>
              <li>
                <a href="/produk/kain-meteran" className="footer-section__link">
                  Kain Meteran
                </a>
              </li>
              <li>
                <a href="/produk/pouch" className="footer-section__link">
                  Pouch
                </a>
              </li>
              <li>
                <a href="/produk/pakaian" className="footer-section__link">
                  Pakaian
                </a>
              </li>
            </ul>
          </div>

          {/* ===== KOLOM 4: INFORMASI ===== */}
          <div className="footer-section__column">
            <h4 className="footer-section__column-title">Informasi</h4>
            <ul className="footer-section__link-list">
              <li>
                <a href="/faq" className="footer-section__link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/kebijakan-pengembalian" className="footer-section__link">
                  Kebijakan Pengembalian
                </a>
              </li>
              <li>
                <a href="/syarat-ketentuan" className="footer-section__link">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="/kebijakan-privasi" className="footer-section__link">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== FOOTER BOTTOM ===== */}
        <div className="footer-section__bottom">
          <p className="footer-section__copyright">&copy; 2024 EcoPrint. All rights reserved.</p>
        </div>
      </div>

      {/* ===== BACK TO TOP ===== */}
      {showBackToTop && (
        <button className="footer-section__back-to-top" onClick={handleBackToTop} aria-label="Kembali ke atas" title="Kembali ke atas">
          <ArrowUpIcon />
        </button>
      )}
    </footer>
  );
}

export default FooterSection;
