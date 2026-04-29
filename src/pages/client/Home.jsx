import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';
import { Filter, SlidersHorizontal, Heart, Star, Sparkles, Flame, Loader2 } from 'lucide-react';
import Fuse from 'fuse.js';
import './Client.css';

const DEPARTMENTS = [
  { key: 'Abarrotes',   label: 'Abarrotes',  emoji: '🛒', color: '#fff7ed' },
  { key: 'Bebidas',     label: 'Bebidas',     emoji: '🥤', color: '#eff6ff' },
  { key: 'Desechables', label: 'Desechables', emoji: '🥡', color: '#f0fdf4' },
  { key: 'Lacteos',     label: 'Lácteos',     emoji: '🧀', color: '#fefce8' },
  { key: 'Limpieza',    label: 'Limpieza',    emoji: '🧹', color: '#f0f9ff' },
  { key: 'Botanas',     label: 'Botanas',     emoji: ' popcorn', color: '#fff1f2' },
  { key: 'Higiene',     label: 'Higiene',     emoji: '🧴', color: '#faf5ff' },
  { key: 'Carnicos',    label: 'Cárnicos',    emoji: '🥩', color: '#fef2f2' },
  { key: 'Panaderia',   label: 'Panadería',   emoji: '🍞', color: '#fffbeb' },
  { key: 'Conservas',   label: 'Conservas',   emoji: '🥫', color: '#f0fdf4' },
  { key: 'Condimentos', label: 'Condimentos', emoji: '🧂', color: '#fff7ed' },
  { key: 'Golosinas',   label: 'Golosinas',   emoji: '🍬', color: '#fdf4ff' },
  { key: 'Cereales',    label: 'Cereales',    emoji: '🥣', color: '#eff6ff' },
  { key: 'Hogar',       label: 'Hogar',       emoji: '🏠', color: '#f8fafc' },
  { key: 'Mascotas',    label: 'Mascotas',    emoji: '🐾', color: '#fef9ee' },
];

const SkeletonCard = () => (
  <div className="product-list-card skeleton">
    <div className="list-card-image skeleton-box"></div>
    <div className="list-card-details">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line price"></div>
      <div className="skeleton-line badge"></div>
    </div>
  </div>
);

const Home = () => {
  const { products } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);
  const observerRef = useRef();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || '';
  const productId = searchParams.get('pd') || '';
  const brandFilter = searchParams.get('brand') || '';
  const priceFilter = searchParams.get('price') || '';
  const specialFilter = searchParams.get('sp') || '';

  // Configuración de Fuse.js
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category'],
    threshold: 0.3,
    distance: 100,
    ignoreLocation: true
  }), [products]);

  // Reset de límite al cambiar búsqueda o categoría
  useEffect(() => {
    setDisplayLimit(20);
    if (query || category || specialFilter) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [query, category, specialFilter]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayLimit(prev => prev + 20);
      }
    }, { threshold: 0.1 });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [productId, products]);

  const handleOpenProduct = (product) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pd', product.id);
    setSearchParams(newParams);
  };

  const handleCloseProduct = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('pd');
    setSearchParams(newParams);
  };

  const brands = useMemo(() => {
    const set = new Set(products.map(p => p.name.split(' ')[0]));
    return Array.from(set).sort();
  }, [products]);

  const offers    = useMemo(() => products.filter(p => p.isOffer), [products]);
  const newProds  = useMemo(() => products.filter(p => p.isNew), [products]);
  const featured  = useMemo(() => products.slice(0, 6), [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (specialFilter === 'offers') {
      result = result.filter(p => p.isOffer);
    } else if (specialFilter === 'new') {
      result = result.filter(p => p.isNew);
    } else if (query) {
      // Búsqueda inteligente con Fuse.js
      const fuseResults = fuse.search(query);
      result = fuseResults.map(r => r.item);
    } else if (category) {
      result = result.filter(p => p.category === category);
    } else {
      return [];
    }

    if (brandFilter) {
      result = result.filter(p => p.name.startsWith(brandFilter));
    }

    if (priceFilter === 'low') {
      result = [...result].sort((a, b) => a.retailPrice - b.retailPrice);
    } else if (priceFilter === 'high') {
      result = [...result].sort((a, b) => b.retailPrice - a.retailPrice);
    }
    
    return result;
  }, [products, query, category, brandFilter, priceFilter, specialFilter, fuse]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  const handleSetCategory = (catKey) => setSearchParams({ cat: catKey });
  const handleSetSpecial = (spKey) => setSearchParams({ sp: spKey });
  
  const handleSetBrand = (brand) => {
    const newParams = new URLSearchParams(searchParams);
    if (brand) newParams.set('brand', brand);
    else newParams.delete('brand');
    setSearchParams(newParams);
  };

  const handleSetPriceFilter = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('price', val);
    else newParams.delete('price');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="home-page">

      {/* ---- SEARCH / CATEGORY VIEW ---- */}
      {(query || category || specialFilter) && (
        <div className="search-view animate-fade-in">
          <div className="category-header">
            <button className="back-btn" onClick={clearFilters}>← Inicio</button>
            <h2 className="category-view-title">
              {specialFilter === 'offers' ? '🔥 Ofertas' : 
               specialFilter === 'new' ? '✨ Novedades' :
               query ? `"${query}"` : 
               (DEPARTMENTS.find(d => d.key === category)?.emoji + ' ' + (DEPARTMENTS.find(d => d.key === category)?.label || category))}
            </h2>
            <button className={`filter-toggle ${(brandFilter || priceFilter) ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel animate-slide-up">
              <div className="filter-group">
                <label>Marca:</label>
                <div className="filter-chips">
                  <button className={`chip ${!brandFilter ? 'active' : ''}`} onClick={() => handleSetBrand('')}>Todas</button>
                  {brands.slice(0, 8).map(b => (
                    <button key={b} className={`chip ${brandFilter === b ? 'active' : ''}`} onClick={() => handleSetBrand(b)}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group" style={{ marginTop: '1rem' }}>
                <label>Precio:</label>
                <div className="filter-chips">
                  <button className={`chip ${!priceFilter ? 'active' : ''}`} onClick={() => handleSetPriceFilter('')}>Relevancia</button>
                  <button className={`chip ${priceFilter === 'low' ? 'active' : ''}`} onClick={() => handleSetPriceFilter('low')}>Menor a Mayor</button>
                  <button className={`chip ${priceFilter === 'high' ? 'active' : ''}`} onClick={() => handleSetPriceFilter('high')}>Mayor a Menor</button>
                </div>
              </div>
            </div>
          )}

          <div className="search-results-info">
            <span>{filteredProducts.length} artículos encontrados</span>
          </div>

          <div className="products-list-container">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              displayedProducts.map((product, idx) => (
                <div key={product.id} style={{ animationDelay: `${idx % 20 * 40}ms` }} className="animate-slide-up">
                  <ProductCard product={product} onClick={() => handleOpenProduct(product)} />
                </div>
              ))
            )}
            
            {/* Sentinel para Infinite Scroll */}
            {!isLoading && filteredProducts.length > displayLimit && (
              <div ref={observerRef} className="infinite-scroll-loader">
                <Loader2 size={24} className="animate-spin" />
                <span>Cargando más productos...</span>
              </div>
            )}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No hay productos que coincidan con los filtros.</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: '1rem' }}>Limpiar filtros</button>
            </div>
          )}
        </div>
      )}

      {/* ---- LANDING VIEW (HOME) ---- */}
      {!query && !category && !specialFilter && (
        <div className="landing-view">
          <div className="home-hero animate-fade-in">
            <div className="home-hero-text">
              <h1>Tu Distribuidora<br/>de Confianza 🏪</h1>
              <p>Precios especiales al mayoreo en todos nuestros productos.</p>
            </div>
          </div>

          <div className="quick-specials animate-slide-up">
            <button className="special-btn offer" onClick={() => handleSetSpecial('offers')}>
              <Flame size={20} />
              <span>Ofertas</span>
            </button>
            <button className="special-btn new" onClick={() => handleSetSpecial('new')}>
              <Sparkles size={20} />
              <span>Novedades</span>
            </button>
          </div>

          <section className="home-section animate-slide-up">
            <h2 className="section-title">🏬 Departamentos</h2>
            <div className="departments-grid">
              {DEPARTMENTS.map((dep, idx) => (
                <button key={dep.key} className="department-card" 
                  style={{ background: dep.color, animationDelay: `${idx * 30}ms` }}
                  onClick={() => handleSetCategory(dep.key)}>
                  <span className="dep-emoji">{dep.emoji}</span>
                  <span className="dep-label">{dep.label}</span>
                </button>
              ))}
            </div>
          </section>

          {offers.length > 0 && (
            <section className="home-section offers-highlight animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="section-header">
                <h2 className="section-title">🔥 Ofertas Relámpago</h2>
                <button className="see-all-link" onClick={() => handleSetSpecial('offers')}>Ver todo</button>
              </div>
              <div className="products-list-container">
                {offers.slice(0, 3).map((product, idx) => (
                  <div key={product.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-slide-up">
                    <ProductCard product={product} onClick={() => handleOpenProduct(product)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="home-section animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="section-title">⭐ Los más buscados</h2>
            <div className="products-list-container">
              {featured.map((product, idx) => (
                <div key={product.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-slide-up">
                  <ProductCard product={product} onClick={() => handleOpenProduct(product)} />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseProduct}
        onSelectProduct={handleOpenProduct}
      />
    </div>
  );
};

export default Home;
