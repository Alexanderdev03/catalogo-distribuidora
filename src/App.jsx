import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/client/Home';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Favorites from './pages/client/Favorites';
import Orders from './pages/client/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryList from './pages/admin/InventoryList';
import ProductForm from './pages/admin/ProductForm';
import Login from './pages/admin/Login';
import { useAuthStore } from './store/useAuthStore';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas del Cliente */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="producto/:id" element={<ProductDetail />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="pedidos" element={<Orders />} />
        </Route>

        {/* Rutas del Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inventario" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="inventario" element={<InventoryList />} />
          <Route path="producto/nuevo" element={<ProductForm />} />
          <Route path="producto/editar/:id" element={<ProductForm />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
