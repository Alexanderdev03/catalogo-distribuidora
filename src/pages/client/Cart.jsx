import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { Trash2, Plus, Minus, Send, PiggyBank } from 'lucide-react';
import './Client.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCartStore();
  const { saveOrder } = useOrderStore();

  const calculateSavings = () => {
    let retailTotal = 0;
    let currentTotal = 0;

    cart.forEach(item => {
      const { product, quantity } = item;
      retailTotal += product.retailPrice * quantity;
      
      let price = product.retailPrice;
      if (product.boxQuantity && quantity >= product.boxQuantity) {
        price = product.wholesalePrice;
      } else if (product.halfWholesaleMinQuantity && quantity >= product.halfWholesaleMinQuantity) {
        price = product.halfWholesalePrice;
      }
      currentTotal += price * quantity;
    });

    return retailTotal - currentTotal;
  };

  const savings = calculateSavings();

  const formatWhatsAppMessage = () => {
    let message = "📦 *NUEVO PEDIDO - DISTRIBUIDORA*\n\n";
    
    cart.forEach((item, index) => {
      const { product, quantity } = item;
      
      let price = product.retailPrice;
      let tier = "Menudeo";
      
      if (product.boxQuantity && quantity >= product.boxQuantity) {
        price = product.wholesalePrice;
        tier = "Caja Completa";
      } else if (product.halfWholesaleMinQuantity && quantity >= product.halfWholesaleMinQuantity) {
        price = product.halfWholesalePrice;
        tier = "Medio Mayoreo";
      }

      message += `${index + 1}. *${product.name}*\n`;
      message += `   Cantidad: ${quantity} ${product.unit}(s)\n`;
      message += `   Precio: $${price.toFixed(2)} (${tier})\n`;
      message += `   Subtotal: $${(price * quantity).toFixed(2)}\n\n`;
    });

    const total = getCartTotal();
    message += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*\n`;
    if (savings > 0) {
      message += `✨ *¡AHORRO TOTAL: $${savings.toFixed(2)}!*\n`;
    }
    message += "\n📍 Por favor, confírmenme disponibilidad y tiempo de entrega.";

    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    saveOrder(cart, getCartTotal(), savings);
    const phoneNumber = "521234567890"; // Reemplazar con el número real del admin
    const url = `https://wa.me/${phoneNumber}?text=${formatWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestros productos y encuentra los mejores precios al mayoreo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <h2 className="section-title">Tu Carrito</h2>
      
      <div className="cart-items">
        {cart.map(item => {
          const { product, quantity } = item;
          
          let currentPrice = product.retailPrice;
          let tier = null;
          
          if (product.boxQuantity && quantity >= product.boxQuantity) {
            currentPrice = product.wholesalePrice;
            tier = "Caja";
          } else if (product.halfWholesaleMinQuantity && quantity >= product.halfWholesaleMinQuantity) {
            currentPrice = product.halfWholesalePrice;
            tier = "Medio Mayoreo";
          }
          
          return (
            <div key={product.id} className="cart-item animate-slide-up">
              <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <div className="cart-item-price">
                  ${currentPrice.toFixed(2)} c/u
                  {tier && <span className={`badge-sm ${tier === 'Caja' ? 'box-badge' : 'half-badge'}`}>{tier}</span>}
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control sm">
                  <button onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))} className="qty-btn sm">
                    <Minus size={14} />
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, Math.min(product.stock, quantity + 1))} className="qty-btn sm">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="cart-item-total">
                  ${(currentPrice * quantity).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(product.id)} className="btn-icon text-danger">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary animate-slide-up">
        {savings > 0 && (
          <div className="savings-banner">
            <PiggyBank size={18} />
            <span>¡Estás ahorrando <strong>${savings.toFixed(2)}</strong> con precios de mayoreo!</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span>Total estimado</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <p className="summary-note">El pedido se enviará por WhatsApp para confirmar stock.</p>
        <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
          <Send size={20} />
          Enviar Pedido por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Cart;
