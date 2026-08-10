import { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import FooterSection from '../sections/footer/FooterSection';
import { Leaf, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveGalleries } from '../services/galleryService';
import './GalleryPage.css';

const ITEMS_PER_PAGE = 8;

function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // ===== AMBIL GALERI AKTIF DARI SUPABASE =====
  useEffect(() => {
    let cancelled = false;

    async function loadGalleries() {
      try {
        setLoading(true);
        setErrorMessage('');

        const data = await getActiveGalleries();

        // LOGGING SEMENTARA — hapus setelah foto tampil di /galeri
        // eslint-disable-next-line no-console
        console.log('PUBLIC GALLERY DATA:', data);

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

  // ===== KATEGORI DINAMIS DARI DATA SUPABASE =====
  const categories = ['semua', ...new Set(galleries.map((item) => item.gallery_categories?.slug).filter(Boolean))];

  // ===== SEARCH + FILTER =====
  const filtered = galleries.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'semua' || item.gallery_categories?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
    setLightboxIndex(null);
  };

  const handleSearchChange = (query) => {
    setSearchTerm(query);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filtered.length));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
  }, [filtered.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goPrev, goNext]);

  const getCategoryLabel = (item) => item.gallery_categories?.name ?? 'Tanpa Kategori';

  return (
    <>
      <Header />
      <main className="gallery-page">
        {/* ===== HERO ===== */}
        <section className="gp-hero">
          <div className="gp-container">
            <div className="gp-hero__content">
              <div className="gp-hero__badge">
                <Leaf size={14} strokeWidth={1.8} />
                <span>GALERI KEGIATAN</span>
              </div>
              <h1 className="gp-hero__title">Galeri Kegiatan Ecoprint Desa Piji</h1>
              <p className="gp-hero__desc">Lihat berbagai momen, proses, pelatihan, karya, dan perjalanan UMKM Ecoprint Desa Piji dalam membangun ekonomi kreatif yang berkelanjutan bersama masyarakat.</p>
              <a href="#gallery-grid" className="gp-hero__btn">
                <Leaf size={18} strokeWidth={1.6} />
                <span>Jelajahi Galeri</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== FILTER ===== */}
        <section className="gp-filter-section">
          <div className="gp-container">
            <div className="gp-toolbar">
              <div className="gp-categories" role="group" aria-label="Filter kategori galeri">
                {categories.map((cat) => (
                  <button key={cat} type="button" className={`gp-cat-btn ${selectedCategory === cat ? 'gp-cat-btn--active' : ''}`} onClick={() => handleCategoryChange(cat)} aria-pressed={selectedCategory === cat}>
                    {cat === 'semua' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
              <div className="gp-search">
                <Search size={18} className="gp-search__icon" />
                <input type="text" className="gp-search__input" placeholder="Cari dokumentasi..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} aria-label="Cari dokumentasi" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== GALLERY GRID ===== */}
        <section className="gp-grid-section" id="gallery-grid">
          <div className="gp-container">
            {loading ? (
              <div className="gp-loading">
                <p className="gp-loading__text">Memuat dokumentasi...</p>
              </div>
            ) : errorMessage ? (
              <div className="gp-empty">
                <p className="gp-empty__text">{errorMessage}</p>
                <p className="gp-empty__subtext">Silakan coba muat ulang halaman.</p>
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="gp-grid">
                  {visibleItems.map((item, index) => (
                    <div key={item.id} className="gp-card" onClick={() => openLightbox(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}>
                      <div className="gp-card__image">
                        <img src={item.image_url} alt={item.alt_text || item.title} loading="lazy" />
                        <div className="gp-card__overlay">
                          <span className="gp-card__overlay-category">{getCategoryLabel(item)}</span>
                          <h3 className="gp-card__overlay-title">{item.title}</h3>
                          <span className="gp-card__overlay-btn">Lihat Foto</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="gp-loadmore">
                    <button className="gp-loadmore__btn" onClick={handleLoadMore}>
                      Muat Lebih Banyak ({filtered.length - visibleCount} tersisa)
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="gp-empty">
                <svg className="gp-empty__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
                <p className="gp-empty__text">Belum ada foto galeri.</p>
                <p className="gp-empty__subtext">Konten akan tampil setelah ditambahkan oleh admin.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ===== LIGHTBOX ===== */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="gp-lightbox" onClick={closeLightbox} role="dialog" aria-label="Pratinjau foto" aria-modal="true">
          <div className="gp-lightbox__backdrop" />
          <div className="gp-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="gp-lightbox__close" onClick={closeLightbox} aria-label="Tutup">
              <X size={24} />
            </button>

            <button className="gp-lightbox__nav gp-lightbox__nav--prev" onClick={goPrev} disabled={lightboxIndex === 0} aria-label="Sebelumnya">
              <ChevronLeft size={28} />
            </button>

            <div className="gp-lightbox__image-wrapper">
              <img src={filtered[lightboxIndex].image_url} alt={filtered[lightboxIndex].alt_text || filtered[lightboxIndex].title} className="gp-lightbox__image" />
            </div>

            <button className="gp-lightbox__nav gp-lightbox__nav--next" onClick={goNext} disabled={lightboxIndex === filtered.length - 1} aria-label="Selanjutnya">
              <ChevronRight size={28} />
            </button>

            <div className="gp-lightbox__info">
              <span className="gp-lightbox__category">{getCategoryLabel(filtered[lightboxIndex])}</span>
              <h3 className="gp-lightbox__title">{filtered[lightboxIndex].title}</h3>
              <p className="gp-lightbox__desc">{filtered[lightboxIndex].description}</p>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </>
  );
}

export default GalleryPage;
