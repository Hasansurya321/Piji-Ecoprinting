import './ProductSearch.css';

function ProductSearch({ searchQuery, onSearchChange }) {
  return (
    <div className="product-search">
      <svg className="product-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input type="text" className="product-search__input" placeholder="Cari produk..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} aria-label="Cari produk" />
    </div>
  );
}

export default ProductSearch;
