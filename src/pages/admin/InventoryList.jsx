import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { Edit, Trash2, Package, Tag, Layers, Plus } from 'lucide-react';
import './Admin.css';

const InventoryList = () => {
  const { products, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-list">
      <div className="header-actions mobile-stack">
        <h2>Inventario</h2>
        <Link to="/admin/producto/nuevo" className="btn btn-primary">
          <Plus size={18} /> Añadir
        </Link>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile: Cards view */}
      <div className="product-cards-mobile">
        {filtered.map(product => (
          <div key={product.id} className="admin-product-card">
            <img src={product.imageUrl} alt={product.name} className="admin-product-img" />
            <div className="admin-product-info">
              <p className="admin-product-name">{product.name}</p>
              <p className="admin-product-category">{product.category}</p>

              <div className="admin-price-badges">
                {product.retailPrice != null && (
                  <span className="price-badge retail">
                    <Tag size={11} /> ${product.retailPrice.toFixed(2)}
                  </span>
                )}
                {product.halfWholesalePrice != null && (
                  <span className="price-badge half">
                    <Layers size={11} /> ${product.halfWholesalePrice.toFixed(2)} ({product.halfWholesaleMinQuantity}+)
                  </span>
                )}
                {product.wholesalePrice != null && (
                  <span className="price-badge box">
                    <Package size={11} /> ${product.wholesalePrice.toFixed(2)} /caja({product.boxQuantity})
                  </span>
                )}
              </div>

              <div className="admin-card-footer">
                <span className={`stock-badge ${product.stock < 20 ? 'low' : 'good'}`}>
                  Stock: {product.stock}
                </span>
                <div className="action-buttons">
                  <Link to={`/admin/producto/editar/${product.id}`} className="btn-icon text-primary">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="btn-icon text-danger">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-admin-state">No hay productos que coincidan.</div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
