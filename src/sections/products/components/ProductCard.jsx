import { Link } from 'react-router';
import './ProductCard.css';

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price ?? 0);
  };

  const categoryName = product.categories?.name ?? 'Umum';
  const rating = product.rating ?? 0;
  const reviewCount = product.jumlah_review ?? 0;

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;

    for (let i = 0; i < full; i++) {
      stars.push(
        <svg key={`full-${i}`} className="product-card__star" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
    if (half) {
      stars.push(
        <svg key="half" className="product-card__star" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <defs>
            <linearGradient id={`half-grad-${product.id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d4d4d4" />
            </linearGradient>
          </defs>
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={`url(#half-grad-${product.id})`}
          />
        </svg>,
      );
    }
    const empty = Math.max(0, 5 - full - half);
    for (let i = 0; i < empty; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="product-card__star product-card__star--empty" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
    return stars;
  };

  return (
    <article className="product-card">
      {/* Image */}
      <div className="product-card__image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className="product-card__image-img" />
        ) : (
          <div className="product-card__image-placeholder">
            <svg className="product-card__image-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="product-card__image-text">Image Product</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <span className="product-card__badge">{categoryName}</span>

        {/* Nama Produk */}
        <h3 className="product-card__name">{product.name}</h3>

        {/* Harga */}
        <p className="product-card__price">{formatPrice(product.price)}</p>

        {/* Deskripsi Singkat */}
        <p className="product-card__description">{product.description}</p>

        {/* Rating */}
        <div className="product-card__rating" aria-label={`Rating ${rating} dari 5, ${reviewCount} ulasan`}>
          <span className="product-card__stars">{renderStars(rating)}</span>
          <span className="product-card__review-count">({reviewCount})</span>
        </div>

        {/* Tombol */}
        <Link to={`/produk/${product.slug}`} className="product-card__btn">
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
