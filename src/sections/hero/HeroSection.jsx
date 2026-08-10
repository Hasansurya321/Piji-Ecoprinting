import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero" id="beranda">
      <div className="hero__container">
        {/* ===== LEFT COLUMN (48%) ===== */}
        <div className="hero__left">
          {/* Badge */}
          <div className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true"></span>
            Eco-Friendly Printing
          </div>

          {/* Heading */}
          <h1 className="hero__heading">
            Hasil Alam Yang <span className="hero__heading-highlight">Eco Printing</span> Berkualitas Tinggi
          </h1>

          {/* Description */}
          <p className="hero__description">Setiap produk ecoprint kami dibuat dengan teknik alami menggunakan daun dan bunga pilihan. Ramah lingkungan, unik, dan penuh karakter.</p>

          {/* CTA Buttons */}
          <div className="hero__cta">
            <a href="#produk" className="hero__cta-primary">
              Lihat Koleksi
            </a>
            <a href="#proses-ecoprint" className="hero__cta-secondary">
              Pelajari Proses
            </a>
          </div>

          {/* Social Proof / Rating */}
          <div className="hero__social">
            <div className="hero__stars" aria-label="Rating 4.9 dari 5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="hero__star-icon" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="hero__rating-text">
              4.9 <span className="hero__rating-separator">|</span> <span className="hero__rating-label">500+ Pelanggan Puas</span>
            </span>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (52%) ===== */}
        <div className="hero__right">
          <div className="hero__image-wrapper">{/* Product image placeholder — removed */}</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
