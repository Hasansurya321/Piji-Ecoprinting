import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Leaf, ArrowRight } from 'lucide-react';
import { getActiveGalleries } from '../../services/galleryService';
import './GalleryHomeSection.css';

function GalleryHomeSection() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGalleries() {
      try {
        const data = await getActiveGalleries();
        if (!cancelled) {
          setGalleries(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGalleries();

    return () => {
      cancelled = true;
    };
  }, []);

  // Loop/infinite hanya dibutuhkan jika ada lebih dari 1 item.
  // Dengan 1 item, array TIDAK digandakan agar tidak tampil 2 foto sama.
  const shouldLoop = galleries.length > 1;
  const marqueeSlides = shouldLoop ? [...galleries, ...galleries] : galleries;

  return (
    <section className="gallery-home" id="galeri">
      <div className="gallery-home__container">
        {/* ===== HEADER ===== */}
        <div className="gallery-home__header">
          <span className="gallery-home__eyebrow">GALERI KEGIATAN</span>
          <h2 className="gallery-home__title">Dokumentasi Kegiatan Ecoprint</h2>
          <div className="gallery-home__ornament" aria-hidden="true">
            <span className="gallery-home__ornament-line" />
            <Leaf size={14} strokeWidth={2} />
            <span className="gallery-home__ornament-line" />
          </div>
        </div>

        {/* ===== AUTO-SLIDING CAROUSEL ===== */}
        <div className="gallery-home__carousel">
          {loading ? (
            <p className="gallery-home__state">Memuat dokumentasi...</p>
          ) : errorMessage ? (
            <p className="gallery-home__state">{errorMessage}</p>
          ) : marqueeSlides.length > 0 ? (
            <div className={`gallery-home__track ${shouldLoop ? '' : 'gallery-home__track--static'}`}>
              {marqueeSlides.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className={`gallery-home__slide ${idx % 4 === 1 || idx % 4 === 3 ? 'gallery-home__slide--wide' : 'gallery-home__slide--tall'}`}>
                  <img src={item.image_url} alt={item.alt_text || item.title} loading="lazy" />
                  <div className="gallery-home__slide-overlay">
                    <span className="gallery-home__slide-category">{item.gallery_categories?.name ?? 'Tanpa Kategori'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="gallery-home__state">Belum ada foto galeri.</p>
          )}
        </div>

        {/* ===== CTA ===== */}
        <div className="gallery-home__cta">
          <Link to="/galeri" className="gallery-home__btn">
            Lihat Galeri
            <ArrowRight size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryHomeSection;
