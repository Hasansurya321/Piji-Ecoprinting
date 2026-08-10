import './ProductFilter.css';

const categories = ['Semua', 'Fashion', 'Tas', 'Aksesoris', 'Home Decor', 'Kain Meteran', 'Souvenir'];

function ProductFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="product-filter" role="group" aria-label="Filter kategori produk">
      {categories.map((cat) => (
        <button key={cat} type="button" className={`product-filter__btn${selectedCategory === cat ? ' product-filter__btn--active' : ''}`} onClick={() => onCategoryChange(cat)} aria-pressed={selectedCategory === cat}>
          {cat}
        </button>
      ))}
    </div>
  );
}

export default ProductFilter;
