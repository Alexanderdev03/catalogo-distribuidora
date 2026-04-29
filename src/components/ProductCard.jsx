import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import '../pages/client/Client.css';

const ProductCard = ({ product, onClick }) => {
  const { favorites, toggleFavorite } = useProductStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFavorite = favorites.includes(product.id);

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div className="product-list-card" onClick={onClick}>
      <div className="list-card-image">
        {!imageLoaded && <div className="skeleton-box image-placeholder"></div>}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          onLoad={() => setImageLoaded(true)}
          className={imageLoaded ? 'loaded' : 'loading'}
        />
        {product.isOffer && (
          <div className="product-badge offer-badge">🔥 Oferta</div>
        )}
        {product.isNew && !product.isOffer && (
          <div className="product-badge new-badge">✨ Nuevo</div>
        )}
        <button 
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`} 
          onClick={handleToggleFav}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="list-card-details">
        <h3 className="list-product-title">{product.name}</h3>

        <div className="list-product-pricing">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="list-price-main">${product.wholesalePrice?.toFixed(2)}*</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              precio por caja:{' '}
              <strong style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}>
                ${(product.wholesalePrice * (product.boxQuantity || 1)).toFixed(2)}
              </strong>
            </span>
          </div>
          {product.halfWholesaleMinQuantity && (
            <span className="list-price-hint text-success" style={{ marginTop: '2px' }}>
              *Precio a partir de {product.halfWholesaleMinQuantity}{' '}
              {product.unit === 'pieza' ? 'piezas' : product.unit + 's'}: ${product.halfWholesalePrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
