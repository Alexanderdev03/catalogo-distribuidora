import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';
import { Heart } from 'lucide-react';
import './Client.css';

const Favorites = () => {
  const { products, favorites } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productId = searchParams.get('pd') || '';

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [productId, products]);

  const favItems = useMemo(() => 
    products.filter(p => favorites.includes(p.id)), 
  [products, favorites]);

  const handleOpenProduct = (product) => {
    setSearchParams({ pd: product.id });
  };

  const handleCloseProduct = () => {
    setSearchParams({});
  };

  if (favItems.length === 0) {
    return (
      <div className="favorites-page empty animate-fade-in">
        <div className="empty-state">
          <div className="empty-icon"><Heart size={48} strokeWidth={1} /></div>
          <h2>No tienes favoritos aún</h2>
          <p>Marca con un corazón los productos que compras con frecuencia para tenerlos siempre a la mano.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page animate-fade-in">
      <div className="category-header">
        <h2 className="category-view-title">❤️ Mis Favoritos</h2>
      </div>
      
      <div className="search-results-info">
        <span>{favItems.length} artículos guardados</span>
      </div>

      <div className="products-list-container">
        {favItems.map((product, idx) => (
          <div key={product.id} style={{ animationDelay: `${idx * 40}ms` }} className="animate-slide-up">
            <ProductCard product={product} onClick={() => handleOpenProduct(product)} />
          </div>
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseProduct}
        onSelectProduct={handleOpenProduct}
      />
    </div>
  );
};

export default Favorites;
