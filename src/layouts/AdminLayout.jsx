import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, LayoutDashboard, PlusCircle, Menu, X, Store, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/inventario', icon: <Package size={20} />, label: 'Inventario' },
    { to: '/admin/producto/nuevo', icon: <PlusCircle size={20} />, label: 'Añadir' },
    { to: '/', icon: <Store size={20} />, label: 'Ver Tienda' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar desktop */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin</h2>
          <button className="sidebar-close-btn" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="admin-header-title">Panel de Control</span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
