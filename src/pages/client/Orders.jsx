import { useOrderStore } from '../../store/useOrderStore';
import { useCartStore } from '../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, RotateCcw, ChevronRight, Calendar } from 'lucide-react';
import './Client.css';

const Orders = () => {
  const { orders } = useOrderStore();
  const { addToCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleRepeatOrder = (order) => {
    if (window.confirm('¿Quieres reemplazar tu carrito actual con este pedido pasado?')) {
      clearCart();
      order.items.forEach(item => {
        addToCart(item.product, item.quantity);
      });
      navigate('/carrito');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page empty animate-fade-in">
        <div className="empty-state">
          <div className="empty-icon"><ClipboardList size={48} strokeWidth={1} /></div>
          <h2>No hay pedidos aún</h2>
          <p>Tus últimos pedidos enviados por WhatsApp aparecerán aquí para que puedas repetirlos fácilmente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page animate-fade-in">
      <div className="category-header">
        <h2 className="category-view-title">📋 Mis Pedidos</h2>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-history-card animate-slide-up">
            <div className="order-card-header">
              <div className="order-date">
                <Calendar size={14} />
                <span>{formatDate(order.date)}</span>
              </div>
              <span className="order-status-badge">{order.status}</span>
            </div>

            <div className="order-card-body">
              <div className="order-items-preview">
                {order.items.slice(0, 3).map(item => (
                  <span key={item.product.id} className="item-tag">
                    {item.quantity}x {item.product.name.split(' ')[0]}
                  </span>
                ))}
                {order.items.length > 3 && <span className="item-tag more">+{order.items.length - 3} más</span>}
              </div>
              
              <div className="order-summary-mini">
                <div className="mini-total">
                  <span className="label">Total:</span>
                  <span className="value">${order.total.toFixed(2)}</span>
                </div>
                {order.savings > 0 && (
                  <div className="mini-savings">Ahorro: ${order.savings.toFixed(2)}</div>
                )}
              </div>
            </div>

            <div className="order-card-actions">
              <button className="btn-repeat" onClick={() => handleRepeatOrder(order)}>
                <RotateCcw size={16} />
                Repetir Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
