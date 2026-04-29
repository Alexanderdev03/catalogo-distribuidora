import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Minus, Plus, ShoppingCart, X, Package, Tag, Layers, Share2, ZoomIn, Heart } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import '../pages/client/Client.css';

const ProductModal = ({ product, isOpen, onClose, onSelectProduct }) => {
  const [quantity, setQuantity] = useState(1);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  const { products, favorites, toggleFavorite } = useProductStore();

  const isFavorite = product ? favorites.includes(product.id) : false;

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsZoomed(false);
      setImageLoaded(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const unitLabel = product.unit === 'pieza' ? 'piezas' : product.unit + 's';

  let currentPrice = product.retailPrice;
  let activeTier = 'retail';

  if (product.boxQuantity && quantity >= product.boxQuantity) {
    currentPrice = product.wholesalePrice;
    activeTier = 'box';
  } else if (product.halfWholesaleMinQuantity && quantity >= product.halfWholesaleMinQuantity) {
    currentPrice = product.halfWholesalePrice;
    activeTier = 'half';
  }

  const total = currentPrice * quantity;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?pd=${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Mira este producto en la Distribuidora: ${product.name}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="premium-modal-content bottom-sheet" onClick={e => e.stopPropagation()}>
        
        <button className="premium-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="premium-modal-scroll-area">
          <div className="premium-modal-hero" onClick={() => setIsZoomed(true)}>
            {!imageLoaded && <div className="skeleton-box image-placeholder-hero"></div>}
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              onLoad={() => setImageLoaded(true)}
              className={imageLoaded ? 'loaded' : 'loading'}
            />
            <div className="hero-actions">
              <button 
                className={`modal-action-btn fav-action ${isFavorite ? 'active' : ''}`} 
                onClick={handleToggleFav}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button className="modal-action-btn" onClick={handleShare}>
                <Share2 size={18} />
              </button>
              <button className="modal-action-btn">
                <ZoomIn size={18} />
              </button>
            </div>
            {showShareToast && <div className="share-toast">Enlace copiado</div>}
          </div>

          <div className="premium-modal-body">
            <div className="title-row">
              <h2 className="premium-modal-title">{product.name}</h2>
              <span className="stock-status">Disponible</span>
            </div>
            
            <div className="pricing-tiers-container">
              <h4 className="tiers-title">Escala de precios</h4>
              
              <div className={`pricing-tier ${activeTier === 'retail' ? 'active' : ''}`} onClick={() => setQuantity(1)}>
                <div className="tier-icon"><Tag size={18} /></div>
                <div className="tier-info">
                  <span className="tier-name">Menudeo (1+)</span>
                  <span className="tier-price">${product.retailPrice.toFixed(2)} <small>/ud</small></span>
                </div>
              </div>

              {product.halfWholesaleMinQuantity && (
                <div className={`pricing-tier ${activeTier === 'half' ? 'active-success' : ''}`} onClick={() => setQuantity(product.halfWholesaleMinQuantity)}>
                  <div className="tier-icon"><Layers size={18} /></div>
                  <div className="tier-info">
                    <span className="tier-name">Medio Mayoreo ({product.halfWholesaleMinQuantity}+)</span>
                    <span className="tier-price">${product.halfWholesalePrice.toFixed(2)} <small>/ud</small></span>
                  </div>
                </div>
              )}

              {product.boxQuantity && (
                <div className={`pricing-tier ${activeTier === 'box' ? 'active-primary' : ''}`} onClick={() => setQuantity(product.boxQuantity)}>
                  <div className="tier-icon"><Package size={18} /></div>
                  <div className="tier-info">
                    <span className="tier-name">Caja Completa ({product.boxQuantity}+)</span>
                    <span className="tier-price">${product.wholesalePrice.toFixed(2)} <small>/ud</small></span>
                  </div>
                </div>
              )}
            </div>

            <div className="premium-modal-controls">
              <div className="quantity-control-wrapper">
                <span className="control-label">Cantidad a pedir</span>
                <div className="quantity-control xl-control">
                  <button onClick={handleDecrement} className="qty-btn" disabled={quantity <= 1}>
                    <Minus size={22} />
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button onClick={handleIncrement} className="qty-btn text-primary">
                    <Plus size={22} />
                  </button>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="premium-related-section">
                <h3 className="related-title">Sugerencias</h3>
                <div className="related-scroll">
                  {relatedProducts.map(related => (
                    <div key={related.id} className="related-card-minimal" onClick={() => onSelectProduct(related)}>
                      <img src={related.imageUrl} alt={related.name} />
                      <p className="related-name">{related.name}</p>
                      <p className="related-price">${related.retailPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ height: '80px' }}></div>
          </div>
        </div>

        <div className="premium-modal-footer">
          <div className="footer-total">
            <span className="footer-total-label">Total estimado</span>
            <span className="footer-total-price">${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary footer-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} />
            Añadir al Pedido
          </button>
        </div>
      </div>

      {isZoomed && (
        <div className="zoom-overlay animate-fade-in" onClick={() => setIsZoomed(false)}>
          <img src={product.imageUrl} alt={product.name} className="animate-scale-in" />
          <button className="zoom-close"><X size={30} /></button>
        </div>
      )}
    </div>
  );
};

export default ProductModal;
