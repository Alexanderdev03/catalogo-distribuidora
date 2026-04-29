import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { Package, Tag, Layers, Flame, Sparkles } from 'lucide-react';
import './Admin.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { products, addProduct, updateProduct } = useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    imageUrl: '',
    unit: 'pieza',
    stock: '',
    allowRetail: true,
    retailPrice: '',
    allowHalfWholesale: false,
    halfWholesalePrice: '',
    halfWholesaleMinQuantity: '',
    allowBox: false,
    wholesalePrice: '',
    boxQuantity: '',
    isOffer: false,
    isNew: false,
  });

  useEffect(() => {
    if (isEditing) {
      const p = products.find(p => p.id === id);
      if (p) {
        setFormData({
          name: p.name,
          category: p.category,
          imageUrl: p.imageUrl,
          unit: p.unit,
          stock: p.stock.toString(),
          allowRetail: true,
          retailPrice: p.retailPrice?.toString() ?? '',
          allowHalfWholesale: !!p.halfWholesaleMinQuantity,
          halfWholesalePrice: p.halfWholesalePrice?.toString() ?? '',
          halfWholesaleMinQuantity: p.halfWholesaleMinQuantity?.toString() ?? '',
          allowBox: !!p.boxQuantity,
          wholesalePrice: p.wholesalePrice?.toString() ?? '',
          boxQuantity: p.boxQuantity?.toString() ?? '',
          isOffer: !!p.isOffer,
          isNew: !!p.isNew,
        });
      }
    }
  }, [id, isEditing, products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      category: formData.category,
      imageUrl: formData.imageUrl,
      unit: formData.unit,
      stock: parseInt(formData.stock, 10),
      retailPrice: formData.allowRetail ? parseFloat(formData.retailPrice) : null,
      halfWholesalePrice: formData.allowHalfWholesale ? parseFloat(formData.halfWholesalePrice) : null,
      halfWholesaleMinQuantity: formData.allowHalfWholesale ? parseInt(formData.halfWholesaleMinQuantity, 10) : null,
      wholesalePrice: formData.allowBox ? parseFloat(formData.wholesalePrice) : null,
      boxQuantity: formData.allowBox ? parseInt(formData.boxQuantity, 10) : null,
      isOffer: formData.isOffer,
      isNew: formData.isNew,
    };

    if (isEditing) {
      updateProduct(id, data);
    } else {
      addProduct(data);
    }
    navigate('/admin/inventario');
  };

  return (
    <div className="product-form-page">
      <div className="header-actions">
        <h2>{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/inventario')}>Cancelar</button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>

        {/* Info básica */}
        <div className="form-section-title">Información General</div>

        <div className="form-group">
          <label>Nombre del Producto</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Vaso desechable Jaguar No.16" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoría</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="Ej. Desechables" />
          </div>
          <div className="form-group">
            <label>Unidad base</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="form-select">
              <option value="pieza">Pieza</option>
              <option value="kg">Kilogramo (kg)</option>
              <option value="litro">Litro</option>
              <option value="bolsa">Bolsa</option>
              <option value="caja">Caja</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>URL de Imagen</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Stock Disponible</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required placeholder="100" min="0" />
          </div>
        </div>

        {/* Configuración de precios */}
        <div className="form-section-title">Configuración de Precios</div>
        <p className="form-hint">Activa los tipos de venta que aplican para este producto y configura sus precios.</p>

        {/* Nivel 1: Menudeo */}
        <div className={`pricing-level-card ${formData.allowRetail ? 'active' : ''}`}>
          <div className="pricing-level-header">
            <div className="level-header-left">
              <div className="level-icon retail"><Tag size={20} /></div>
              <div>
                <span className="level-title">Menudeo</span>
                <span className="level-subtitle">Precio para venta unitaria</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="allowRetail" checked={formData.allowRetail} onChange={handleChange} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {formData.allowRetail && (
            <div className="pricing-level-body">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Precio por {formData.unit} ($)</label>
                <input type="number" step="0.01" name="retailPrice" value={formData.retailPrice} onChange={handleChange} required={formData.allowRetail} placeholder="0.00" min="0" />
              </div>
            </div>
          )}
        </div>

        {/* Nivel 2: Medio Mayoreo */}
        <div className={`pricing-level-card ${formData.allowHalfWholesale ? 'active success' : ''}`}>
          <div className="pricing-level-header">
            <div className="level-header-left">
              <div className="level-icon half-wholesale"><Layers size={20} /></div>
              <div>
                <span className="level-title">Medio Mayoreo</span>
                <span className="level-subtitle">Descuento a partir de X piezas</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="allowHalfWholesale" checked={formData.allowHalfWholesale} onChange={handleChange} />
              <span className="toggle-slider success"></span>
            </label>
          </div>
          {formData.allowHalfWholesale && (
            <div className="pricing-level-body">
              <div className="form-row" style={{ marginBottom: 0 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>A partir de cuántas {formData.unit}s</label>
                  <input type="number" name="halfWholesaleMinQuantity" value={formData.halfWholesaleMinQuantity} onChange={handleChange} required={formData.allowHalfWholesale} placeholder="Ej. 3" min="2" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Precio por {formData.unit} ($)</label>
                  <input type="number" step="0.01" name="halfWholesalePrice" value={formData.halfWholesalePrice} onChange={handleChange} required={formData.allowHalfWholesale} placeholder="0.00" min="0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nivel 3: Caja completa */}
        <div className={`pricing-level-card ${formData.allowBox ? 'active primary' : ''}`}>
          <div className="pricing-level-header">
            <div className="level-header-left">
              <div className="level-icon box"><Package size={20} /></div>
              <div>
                <span className="level-title">Caja Completa (Mayoreo)</span>
                <span className="level-subtitle">Precio especial por caja</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="allowBox" checked={formData.allowBox} onChange={handleChange} />
              <span className="toggle-slider primary"></span>
            </label>
          </div>
          {formData.allowBox && (
            <div className="pricing-level-body">
              <div className="form-row" style={{ marginBottom: 0 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Piezas que tiene la caja</label>
                  <input type="number" name="boxQuantity" value={formData.boxQuantity} onChange={handleChange} required={formData.allowBox} placeholder="Ej. 50" min="1" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Precio por {formData.unit} en caja ($)</label>
                  <input type="number" step="0.01" name="wholesalePrice" value={formData.wholesalePrice} onChange={handleChange} required={formData.allowBox} placeholder="0.00" min="0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Etiquetas Especiales */}
        <div className="form-section-title">Etiquetas Especiales</div>
        <p className="form-hint">Añade distintivos visuales al producto para resaltarlo en la tienda.</p>

        <div className="form-row">
          <div className={`pricing-level-card ${formData.isOffer ? 'active danger' : ''}`} style={{ flex: 1, marginBottom: 0 }}>
            <div className="pricing-level-header">
              <div className="level-header-left">
                <div className="level-icon offer" style={{ background: formData.isOffer ? '#fef2f2' : '#f1f5f9', color: formData.isOffer ? '#dc2626' : '#64748b' }}>
                  <Flame size={20} />
                </div>
                <div>
                  <span className="level-title">Oferta</span>
                  <span className="level-subtitle">Muestra distintivo de fuego</span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="isOffer" checked={formData.isOffer} onChange={handleChange} />
                <span className="toggle-slider danger"></span>
              </label>
            </div>
          </div>

          <div className={`pricing-level-card ${formData.isNew ? 'active success' : ''}`} style={{ flex: 1, marginBottom: 0 }}>
            <div className="pricing-level-header">
              <div className="level-header-left">
                <div className="level-icon new" style={{ background: formData.isNew ? '#f0fdf4' : '#f1f5f9', color: formData.isNew ? '#16a34a' : '#64748b' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="level-title">Nuevo</span>
                  <span className="level-subtitle">Muestra distintivo de brillo</span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
                <span className="toggle-slider success"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
