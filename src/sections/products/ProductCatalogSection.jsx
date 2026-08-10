import { useState, useRef, useEffect, useCallback } from 'react';
import ProductFilter from './components/ProductFilter';
import ProductSearch from './components/ProductSearch';
import ProductCard from './components/ProductCard';
import { getProducts } from '../../services/productService';
import './ProductCatalogSection.css';

// Chunk array into groups of `size`
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function ProductCatalogSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const trackRef = useRef(null);

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

  // Filter products
  const filtered = products.filter((product) => {
    const categoryName = product.categories?.name ?? 'Umum';
    const matchCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;
    const matchSearch = (product.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Group products
  const productGroups = chunkArray(filtered, itemsPerView);
  const totalPages = productGroups.length;

  // Determine itemsPerView from container width
  const updateItemsPerView = useCallback(() => {
    if (trackRef.current) {
      const w = trackRef.current.offsetWidth;
      let count = 4;
      if (w < 900) count = 2;
      if (w < 600) count = 1;
      setItemsPerView(count);
    }
  }, []);

  // Clamp currentPage when products or itemsPerView change
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  // Reset to page 0 on filter/search change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery]);

  // Observe resize
  useEffect(() => {
    requestAnimationFrame(updateItemsPerView);
    const observer = new ResizeObserver(updateItemsPerView);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [updateItemsPerView]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const goPrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const goNext = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <section className="product-catalog" id="produk">
      <div className="product-catalog__container">
        <div className="product-catalog__badge">PRODUK UMKM</div>

        <h2 className="product-catalog__heading">Temukan Karya Ecoprint Pilihan</h2>

        <p className="product-catalog__description">
          Jelajahi berbagai produk ecoprint hasil karya UMKM yang dibuat menggunakan pewarna alami dari daun dan bunga. Setiap produk memiliki motif unik sehingga tidak ada dua karya yang benar-benar sama.
        </p>

        <div className="product-catalog__toolbar">
          <ProductFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          <ProductSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        </div>

        {loading ? (
          <div className="product-catalog__empty">
            <p className="product-catalog__empty-text">Memuat produk...</p>
          </div>
        ) : errorMessage ? (
          <div className="product-catalog__empty">
            <p className="product-catalog__empty-text">{errorMessage}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="product-catalog__carousel">
            {/* Left Arrow */}
            <button type="button" className="carousel__arrow carousel__arrow--left" onClick={goPrev} disabled={currentPage === 0} aria-label="Halaman sebelumnya">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>

            {/* Track */}
            <div className="carousel__track" ref={trackRef}>
              <div className="carousel__inner" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
                {productGroups.map((group, i) => (
                  <div key={i} className="carousel__page">
                    {group.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button type="button" className="carousel__arrow carousel__arrow--right" onClick={goNext} disabled={currentPage >= totalPages - 1} aria-label="Halaman selanjutnya">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9,6 15,12 9,18" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="product-catalog__empty">
            <svg className="product-catalog__empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <p className="product-catalog__empty-text">Belum ada produk tersedia.</p>
            <p className="product-catalog__empty-subtext">Produk akan muncul setelah ditambahkan oleh admin.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCatalogSection;
