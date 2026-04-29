import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, ShoppingCart, Search, X, Mic, Heart, ClipboardList, Moon, Sun } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const ClientLayout = () => {
  const cartCount = useCartStore(state => state.getCartCount());
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('dark-mode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Sincronizar el input con la URL
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim()) {
      navigate(`/?q=${encodeURIComponent(q)}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/', { replace: true });
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta búsqueda por voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="client-layout">
      <div className="announcement-banner">
        <span>🚚 Envío GRATIS en pedidos mayores a $2,500</span>
      </div>
      <header className="header animate-fade-in">
        <div className="header-top">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            🏪 Distribuidora
          </div>
          <div className="header-actions-right">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/carrito" className="header-cart-btn">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="¿Qué estás buscando?..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="search-actions">
            {searchQuery && (
              <button className="search-clear" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
            <button 
              className={`voice-search-btn ${isListening ? 'listening' : ''}`} 
              onClick={startVoiceSearch}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' && !searchParams.get('q') ? 'active' : ''}`}>
          <Home size={22} />
          <span>Inicio</span>
        </Link>
        <Link to="/pedidos" className={`nav-item ${location.pathname === '/pedidos' ? 'active' : ''}`}>
          <ClipboardList size={22} />
          <span>Pedidos</span>
        </Link>
        <Link to="/favoritos" className={`nav-item ${location.pathname === '/favoritos' ? 'active' : ''}`}>
          <Heart size={22} />
          <span>Favoritos</span>
        </Link>
        <Link to="/carrito" className={`nav-item ${location.pathname === '/carrito' ? 'active' : ''}`}>
          <div className="cart-icon-wrapper">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span>Mi Pedido</span>
        </Link>
      </nav>
    </div>
  );
};

export default ClientLayout;
