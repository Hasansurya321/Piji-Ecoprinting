import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Header from '../components/layout/Header';
import FooterSection from '../sections/footer/FooterSection';
import productDetailData from '../data/productDetailData';
import { getProductBySlug, getProducts } from '../services/productService';
import './ProductDetailPage.css';

// ===== DEFAULT FALLBACK DATA (used while DB schema is not yet extended) =====
const DEFAULT_IMAGES = ['https://placehold.co/900x900/f6f0e6/9a917f?text=Ecoprint'];

const DEFAULT_PERAWATAN = [
  { icon: 'cuci-manual', judul: 'Cuci Manual', deskripsi: 'Cuci dengan tangan menggunakan deterjen lembut.' },
  { icon: 'tanpa-pemutih', judul: 'Jangan Pakai Pemutih', deskripsi: 'Jangan direndam terlalu lama, hindari pemutih.' },
  { icon: 'jemur-teduh', judul: 'Jemur Teduh', deskripsi: 'Jemur di tempat teduh, hindari sinar matahari langsung.' },
  { icon: 'setrika-suhu-rendah', judul: 'Setrika Suhu Rendah', deskripsi: 'Setrika dengan suhu rendah untuk menjaga serat kain.' },
];

const TESTIMONIAL_SKELETONS = [{ id: 1 }, { id: 2 }, { id: 3 }];

// ===== HELPERS =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

function fallbackSpecValue(label) {
  const map = {
    'Bahan / Material': 'Katun primisima',
    'Sumber Motif (Tanaman)': 'daun jati, eukaliptus, jarak wulung',
    'Dimensi dan Berat': '200 cm x 115 cm',
    'Teknik dan Proses': 'kukus/rebus (steaming/roasting)',
  };
  return map[label] ?? '-';
}

function buildSpecRows(specs = {}) {
  const pick = (...keys) => {
    for (const k of keys) {
      if (specs[k] && String(specs[k]).trim()) return String(specs[k]).trim();
    }
    return null;
  };

  const dims = [];
  const ukuran = pick('Ukuran', 'Dimensi', 'Dimensi dan Berat');
  const berat = pick('Berat');
  if (ukuran) dims.push(ukuran);
  if (berat) dims.push(berat);

  const rows = [
    { label: 'Bahan / Material', value: pick('Bahan', 'Material', 'Bahan / Material') },
    { label: 'Sumber Motif (Tanaman)', value: pick('Sumber Motif', 'Sumber Motif (Tanaman)', 'Motif', 'Warna') },
    {
      label: 'Dimensi dan Berat',
      value: dims.length ? dims.join(' / ') : pick('Dimensi dan Berat'),
    },
    { label: 'Teknik dan Proses', value: pick('Teknik', 'Teknik dan Proses', 'Proses') },
  ];

  return rows.map((row) => ({
    ...row,
    value: row.value || fallbackSpecValue(row.label),
  }));
}

// ===== MERGE SUPABASE DATA WITH FALLBACK =====
function mergeProduct(supabaseProduct, fallback) {
  const fallbackData = fallback ?? {};

  const images = fallbackData.gambar && fallbackData.gambar.length > 0 ? fallbackData.gambar : supabaseProduct?.image_url ? [supabaseProduct.image_url] : DEFAULT_IMAGES;

  const kategori = supabaseProduct?.categories?.name ?? fallbackData.kategori ?? 'Umum';

  const tentang = fallbackData.tentang ?? supabaseProduct?.description ?? '';

  const spesifikasi = fallbackData.spesifikasi ?? {
    Kategori: kategori,
    Stok: `${supabaseProduct?.stock ?? 0} pcs`,
  };

  const perawatan = fallbackData.perawatan && fallbackData.perawatan.length > 0 ? fallbackData.perawatan : DEFAULT_PERAWATAN;

  return {
    // From Supabase (authoritative where available)
    id: supabaseProduct?.id ?? fallbackData.id,
    slug: supabaseProduct?.slug ?? fallbackData.slug,
    name: supabaseProduct?.name ?? fallbackData.nama_produk,
    price: supabaseProduct?.price ?? fallbackData.harga ?? 0,
    stock: supabaseProduct?.stock ?? 0,
    description: supabaseProduct?.description ?? fallbackData.deskripsi ?? '',
    image_url: supabaseProduct?.image_url ?? '',
    categories: supabaseProduct?.categories ?? null,

    // Legacy/dummy fields (UI compatibility while DB schema is extended)
    nama_produk: fallbackData.nama_produk ?? supabaseProduct?.name,
    kategori,
    harga: supabaseProduct?.price ?? fallbackData.harga ?? 0,
    deskripsi: supabaseProduct?.description ?? fallbackData.deskripsi ?? '',
    gambar: images,
    tentang,
    spesifikasi,
    perawatan,
  };
}

// ===== SVG ICONS =====
const WhisperIcon = () => (
  <svg className="product-detail__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ShopeeIcon = () => (
  <svg className="product-detail__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="20" r="2" />
    <circle cx="18" cy="20" r="2" />
    <path d="M2 2h2l.84 4.56A3 3 0 0 0 7.7 9h9.44a3 3 0 0 0 2.84-2.02L22 6" />
    <path d="M6 12h12" />
  </svg>
);

const CartIcon = () => (
  <svg className="product-detail__related-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 7h12l-1.2 8.6a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

const LeafMini = ({ className = 'product-detail__leaf-mini' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

const WashIcon = () => (
  <svg className="product-detail__perawatan-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V6" />
    <path d="M8 6V4c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const NoBleachIcon = () => (
  <svg className="product-detail__perawatan-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const ShadeIcon = () => (
  <svg className="product-detail__perawatan-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9" />
    <path d="M12 2v10l7 4" />
  </svg>
);

const IronIcon = () => (
  <svg className="product-detail__perawatan-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 10H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14" />
    <path d="M19 18h2a2 2 0 0 0 2-2v-4a4 4 0 0 0-4-4h-1" />
    <path d="M7 14h.01" />
  </svg>
);

const iconMap = {
  'cuci-manual': <WashIcon />,
  'tanpa-pemutih': <NoBleachIcon />,
  'jemur-teduh': <ShadeIcon />,
  'setrika-suhu-rendah': <IronIcon />,
};

// ===== BOTANICAL DECORATION SVGS =====
const BotanicalBranch = () => (
  <svg className="product-detail__hero-branch" viewBox="0 0 220 220" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M48 200c30-40 56-84 76-132 8-20 12-32 16-44" />
    <path d="M96 128c-20-18-42-24-66-20-16 3-28 10-36 20" />
    <path d="M88 128c-6-24 2-44 22-58" />
    <path d="M118 90c-16-16-36-24-58-22" />
    <path d="M140 52c-18-6-30-18-36-36" />
    <path d="M156 108c16-16 36-24 60-22" />
  </svg>
);

const BotanicalDesc = () => (
  <svg className="product-detail__desc-botanical" viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M24 148c24-30 40-66 48-106 3-14 6-24 8-32" />
    <path d="M54 100c-14-16-32-22-52-18" />
    <path d="M70 72c-12-14-28-20-46-18" />
    <path d="M30 58c8-12 18-18 30-18" />
    <path d="M96 150c10-26 22-46 38-62 8-8 14-12 22-14" />
    <path d="M124 106c12-10 26-14 40-12" />
  </svg>
);

const CareSilhouette = () => (
  <svg className="product-detail__care-botanical" viewBox="0 0 220 220" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M40 190c26-38 46-82 58-132 5-20 8-34 10-46" />
    <path d="M84 116c-22-18-46-26-72-24" />
    <path d="M108 78c-16-18-38-28-66-30" />
    <path d="M78 58c10-16 24-26 42-30" />
    <path d="M168 196c8-34 18-62 32-84 8-12 14-18 22-20" />
    <path d="M190 140c16-4 30-2 42 6" />
  </svg>
);

const ThanksLine = () => (
  <svg className="product-detail__thanks-botanical" viewBox="0 0 120 180" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 170c12-36 22-76 28-118 2-16 4-28 6-40" />
    <path d="M40 110c-12-10-26-14-40-12" />
    <path d="M48 78c-10-12-22-18-36-20" />
    <path d="M30 48c6-10 16-16 28-18" />
  </svg>
);

const PanelLeaf = ({ className = 'product-detail__panel-leaf' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 34c5-10 9-20 12-31 1-4 2-6 3-8" />
    <path d="M14 22c-5-4-10-5-16-4" />
    <path d="M17 14c-4-5-9-7-14-7" />
  </svg>
);

const renderGoldStars = (count = 5) =>
  Array.from({ length: count }, (_, i) => (
    <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  ));

function ProductDetailPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  // Load product detail (Supabase) + fallback + related products
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [supabaseData, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);

        if (cancelled) return;

        // Merge Supabase data with local dummy fallback (same slug)
        const fallback = productDetailData.find((p) => p.slug === slug);
        const merged = mergeProduct(supabaseData, fallback);
        setProduct(merged);

        // Related products: from Supabase, excluding current product
        const related = (allProducts || []).filter((p) => p.slug !== slug).slice(0, 5);
        setRelatedProducts(related);
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

    setLoading(true);
    setErrorMessage('');
    setActiveImage(0);
    loadData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="product-detail">
          <div className="product-detail__container product-detail__status">
            <p>Memuat detail produk...</p>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="product-detail">
          <div className="product-detail__container product-detail__status">
            <h2>Produk tidak ditemukan</h2>
            {errorMessage && <p className="product-detail__status-error">{errorMessage}</p>}
            <Link to="/produk" className="product-detail__status-link">
              Kembali ke Produk
            </Link>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  const images = product.gambar && product.gambar.length > 0 ? product.gambar : DEFAULT_IMAGES;
  const specs = product.spesifikasi || {};
  const specRows = buildSpecRows(specs);
  const perawatan = product.perawatan || [];

  const handleThumbPrev = () => {
    if (images.length > 1) setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbNext = () => {
    if (images.length > 1) setActiveImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="product-detail-page">
      <Header />
      <main className="product-detail">
        <div className="product-detail__container">
          {/* ===== HERO / MAIN PRODUCT DETAIL ===== */}
          <section className="product-detail__hero">
            <div className="product-detail__composition">
              {/* ===== L-SHAPE BRAND (grid row 1 / row 2 col 1, flat children) ===== */}
              <div className="product-detail__brand-horizontal">PREMIUM QUALITY</div>
              <div className="product-detail__brand-vertical">
                <span className="product-detail__brand-vertical-text">PIJI ECOPRINTING</span>
                <PanelLeaf className="product-detail__brand-vertical-leaf" />
              </div>

              {/* ===== MAIN PRODUCT PANEL #F1E7DA ===== */}
              <div className="product-detail__panel">
                <div className="product-detail__main-grid">
                  {/* ===== LEFT GALLERY ===== */}
                  <div className="product-detail__gallery">
                    <div className="product-detail__gallery-main">
                      <div className="product-detail__preview">
                        <img src={images[activeImage]} alt={product.nama_produk} />
                      </div>

                      <div className="product-detail__thumb-row">
                        <button type="button" className="product-detail__thumb-arrow" onClick={handleThumbPrev} disabled={images.length <= 1} aria-label="Gambar sebelumnya">
                          <ChevronLeft />
                        </button>

                        {images.slice(0, 3).map((img, i) => (
                          <div
                            key={i}
                            className={`product-detail__thumbnail ${i === activeImage ? 'product-detail__thumbnail--active' : ''}`}
                            onClick={() => setActiveImage(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setActiveImage(i)}
                          >
                            <img src={img} alt={`${product.nama_produk} ${i + 1}`} />
                          </div>
                        ))}

                        <button type="button" className="product-detail__thumb-arrow" onClick={handleThumbNext} disabled={images.length <= 1} aria-label="Gambar selanjutnya">
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ===== RIGHT PRODUCT INFORMATION ===== */}
                  <div className="product-detail__info">
                    <span className="product-detail__category">{product.kategori}</span>

                    <h1 className="product-detail__name">{product.nama_produk}</h1>

                    <p className="product-detail__price">{formatPrice(product.harga)}</p>

                    <p className="product-detail__stock">
                      Stok : <strong>{product.stock ?? 0}</strong>
                    </p>

                    <h2 className="product-detail__spec-title">
                      <LeafMini /> Spesifikasi Produk
                    </h2>

                    <table className="product-detail__spec-table">
                      <tbody>
                        {specRows.map((row) => (
                          <tr key={row.label}>
                            <td className="product-detail__spec-label">{row.label}</td>
                            <td className="product-detail__spec-value">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="product-detail__actions">
                      <a href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20produk%20Ecoprint" className="product-detail__btn product-detail__btn--wa" target="_blank" rel="noopener noreferrer">
                        <WhisperIcon />
                        Chat via WhatsApp
                      </a>
                      <a href="https://shopee.co.id" className="product-detail__btn product-detail__btn--shopee" target="_blank" rel="noopener noreferrer">
                        <ShopeeIcon />
                        Beli di Shopee
                      </a>
                    </div>
                  </div>
                </div>
                <BotanicalBranch />
              </div>
            </div>
          </section>

          {/* ===== DIVIDER — DETAIL PRODUK ===== */}
          <div className="product-detail__divider">
            <span className="product-detail__divider-line" />
            <span className="product-detail__divider-dot" />
            <span className="product-detail__divider-badge">
              <LeafMini /> Detail Produk
            </span>
            <span className="product-detail__divider-dot" />
            <span className="product-detail__divider-line product-detail__divider-line--right" />
          </div>

          {/* ===== DESCRIPTION CARD ===== */}
          <section className="product-detail__description">
            <span className="product-detail__quote-icon" aria-hidden="true">
              “
            </span>
            <div className="product-detail__description-text">{product.tentang ? product.tentang.split('\n\n').map((paragraph, pIdx) => <p key={pIdx}>{paragraph}</p>) : <p>{product.deskripsi}</p>}</div>
            <BotanicalDesc />
          </section>

          {/* ===== CARE + THANK YOU ===== */}
          <section className="product-detail__care-thanks">
            <div className="product-detail__care-card">
              <h2 className="product-detail__care-title">
                <LeafMini /> Cara Merawat Produk Ecoprinting
              </h2>
              <div className="product-detail__care-list">
                {perawatan.map((item, idx) => (
                  <div className="product-detail__care-item" key={idx}>
                    <span className="product-detail__care-icon">{iconMap[item.icon] || <WashIcon />}</span>
                    <p className="product-detail__care-text">{item.deskripsi}</p>
                  </div>
                ))}
              </div>
              <CareSilhouette />
            </div>

            <div className="product-detail__thanks-wrap">
              <div className="product-detail__thanks-card">
                <p className="product-detail__thanks-script">Terimakasih</p>
                <p className="product-detail__thanks-caption">
                  Atas Kunjungan Para Pelanggan
                  <br />
                  Yang Terhormat
                </p>
                <div className="product-detail__thanks-divider">
                  <span />
                  <LeafMini />
                  <span />
                </div>
                <ThanksLine />
              </div>
            </div>

            <div className="product-detail__testimonial-label">
              <span className="product-detail__testimonial-label-horizontal">Apa Kata Mereka ?</span>
              <span className="product-detail__testimonial-label-vertical">PIJI ECOPRINTING</span>
            </div>
          </section>

          {/* ===== TESTIMONIAL CARDS ===== */}
          <section className="product-detail__testimonials">
            {TESTIMONIAL_SKELETONS.map((t) => (
              <div className="product-detail__testimonial" key={t.id}>
                <div className="product-detail__testimonial-avatar" />
                <div className="product-detail__testimonial-body">
                  <div className="product-detail__testimonial-bars">
                    <span className="product-detail__testimonial-bar product-detail__testimonial-bar--w90" />
                    <span className="product-detail__testimonial-bar product-detail__testimonial-bar--w70" />
                  </div>
                  <div className="product-detail__testimonial-stars">{renderGoldStars()}</div>
                </div>
              </div>
            ))}
          </section>

          {/* ===== DIVIDER — PRODUK TERKAIT ===== */}
          <div className="product-detail__related-divider">
            <span className="product-detail__related-divider-line" />
            <LeafMini className="product-detail__related-leaf" />
            <span className="product-detail__related-badge">Produk Terkait</span>
            <LeafMini className="product-detail__related-leaf" />
            <span className="product-detail__related-divider-line product-detail__related-divider-line--right" />
          </div>

          {/* ===== RELATED PRODUCTS ===== */}
          {relatedProducts.length > 0 && (
            <section className="product-detail__related-grid">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/produk/${rp.slug}`} className="product-detail__related-card">
                  <div className="product-detail__related-img">
                    {rp.image_url ? (
                      <img src={rp.image_url} alt={rp.name} loading="lazy" />
                    ) : (
                      <div className="product-detail__related-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Ecoprint</span>
                      </div>
                    )}
                  </div>
                  <div className="product-detail__related-info">
                    <div className="product-detail__related-text">
                      <h3 className="product-detail__related-name">{rp.name}</h3>
                      <p className="product-detail__related-price">{formatPrice(rp.price)}</p>
                    </div>
                    <span className="product-detail__related-btn">
                      <CartIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

export default ProductDetailPage;
