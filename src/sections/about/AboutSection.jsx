import './AboutSection.css';

// Placeholder — replace with actual image import when available
const aboutImage = null;

function AboutSection() {
  return (
    <section className="about-section" id="tentang-kami">
      <div className="about-section__container">
        {/* ===== LEFT COLUMN: TEXT ===== */}
        <div className="about-section__text-col">
          <span className="about-section__eyebrow">TENTANG KAMI</span>

          <h2 className="about-section__title">
            Menggabungkan Tradisi,
            <br />
            Kreativitas & Kepedulian
            <br />
            terhadap Alam
          </h2>

          <p className="about-section__description">Kami percaya bahwa keindahan sejati berasal dari alam. EcoPrint adalah wujud harmoni antara kreativitas manusia dan kelestarian lingkungan.</p>

          <a href="/tentang-kami" className="about-section__btn">
            Selengkapnya
          </a>

          {/* Ornamen daun dekoratif */}
          <div className="about-section__ornament" aria-hidden="true">
            <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10 C35 40 15 80 20 110 C25 140 45 160 60 170 C75 160 95 140 100 110 C105 80 85 40 60 10Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
              <path d="M60 30 C45 55 35 85 38 105 C41 125 52 145 60 150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: IMAGE ===== */}
        <div className="about-section__image-col">
          {aboutImage ? (
            <img src={aboutImage} alt="Proses penyusunan daun pada kain ecoprint" className="about-section__image" />
          ) : (
            <div className="about-section__image-placeholder">
              <svg className="about-section__placeholder-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              <span className="about-section__placeholder-text">Image Proses</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
