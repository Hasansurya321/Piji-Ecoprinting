import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import FooterSection from '../sections/footer/FooterSection';
import { Leaf, Search } from 'lucide-react';
import { getProducts } from '../services/productService';
import './ProductPage.css';

const ITEMS_PER_PAGE = 8;

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Load products from Supabase
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setProducts(data);
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

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build category list dynamically from products
  const categories = ['Semua', ...Array.from(new Set(products.map((product) => product.categories?.name ?? 'Umum')))];

  // Filter products
  const filtered = products.filter((product) => {
    const categoryName = product.categories?.name ?? 'Umum';
    const matchCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;
    const matchSearch = (product.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price ?? 0);
  };

  return (
    <>
      <Header />
      <main className="product-page">
        {/* ===== HERO ===== */}
        <section className="pp-hero">
          <div className="pp-container">
            <div className="pp-hero__content">
              <div className="pp-hero__badge">
                <Leaf size={14} strokeWidth={1.8} />
                <span>PRODUK UMKM</span>
              </div>
              <h1 className="pp-hero__title">Produk Ecoprint Desa Piji</h1>
              <p className="pp-hero__desc">Temukan berbagai produk ecoprint hasil karya UMKM Desa Piji yang dibuat secara handmade menggunakan bahan alami dan teknik ramah lingkungan.</p>
              <a href="#product-grid" className="pp-hero__btn">
                <Leaf size={18} strokeWidth={1.6} />
                <span>Lihat Produk</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== FILTER + SEARCH ===== */}
        <section className="pp-filter-section">
          <div className="pp-container">
            <div className="pp-toolbar">
              {/* Category Pills */}
              <div className="pp-categories" role="group" aria-label="Filter kategori produk">
                {categories.map((cat) => (
                  <button key={cat} type="button" className={`pp-cat-btn ${selectedCategory === cat ? 'pp-cat-btn--active' : ''}`} onClick={() => handleCategoryChange(cat)} aria-pressed={selectedCategory === cat}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="pp-search">
                <Search size={18} className="pp-search__icon" />
                <input type="text" className="pp-search__input" placeholder="Cari produk..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} aria-label="Cari produk" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCT GRID ===== */}
        <section className="pp-grid-section" id="product-grid">
          <div className="pp-container">
            {loading ? (
              <div className="pp-empty">
                <p className="pp-empty__text">Memuat produk...</p>
              </div>
            ) : errorMessage ? (
              <div className="pp-empty">
                <p className="pp-empty__text">{errorMessage}</p>
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="pp-grid">
                  {paginatedProducts.map((product) => (
                    <article key={product.id} className="pp-card">
                      {/* Image */}
                      <div className="pp-card__image">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} loading="lazy" className="pp-card__image-img" />
                        ) : (
                          <div className="pp-card__image-placeholder">
                            <svg className="pp-card__image-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21,15 16,10 5,21" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="pp-card__body">
                        <span className="pp-card__badge">{product.categories?.name ?? 'Umum'}</span>
                        <h3 className="pp-card__name">{product.name}</h3>
                        <p className="pp-card__price">{formatPrice(product.price)}</p>
                        <p className="pp-card__desc">{product.description}</p>
                        <Link to={`/produk/${product.slug}`} className="pp-card__btn">
                          Lihat Detail
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pp-pagination">
                    <button className="pp-pagination__btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Halaman sebelumnya">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15,18 9,12 15,6" />
                      </svg>
                      Sebelumnya
                    </button>

                    <span className="pp-pagination__info">
                      Halaman {currentPage} dari {totalPages}
                    </span>

                    <button className="pp-pagination__btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Halaman selanjutnya">
                      Selanjutnya
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9,6 15,12 9,18" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="pp-empty">
                <svg className="pp-empty__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
                <p className="pp-empty__text">Produk yang Anda cari belum tersedia.</p>
                <p className="pp-empty__subtext">Silakan coba kata kunci lain atau pilih kategori yang berbeda.</p>
                <button
                  className="pp-empty__btn"
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                >
                  Lihat Semua Produk
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default ProductPage;
