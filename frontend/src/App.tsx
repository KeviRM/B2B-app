
import { Route, Routes } from 'react-router-dom';


import Header from './components/Header';
import HomePageContent from './HomePageContent';
import Footer from './components/Footer';
import CatalogPage from './components/CatalogPage';
import MiniCart from './components/MiniCart';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import UserProfilePage from './components/UserProfilePage';
import ProductDetailPage from './components/ProductDetailPage';

import OrderDetailPage from './components/OrderDetailPage'; 

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';



import AdminLayout from './components/admin/AdminLayout';
import AdminOrdersPage from './components/admin/AdminOrdersPage';

function App() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Header />
      
      <main className="grow">
        {/* Aquí definimos qué componente se renderiza en qué URL */}
        <Routes>
          <Route path="/" element={<HomePageContent />} />
          <Route path="/catalogo" element={<CatalogPage />} />

          <Route path="/producto/:id" element={<ProductDetailPage />} />
          
          <Route path="/carrito" element={<CartPage />} /> 
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/perfil" element={<UserProfilePage />} />
          <Route path="/pedido/:id" element={<OrderDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOrdersPage />} /> 
            <Route path="ordenes" element={<AdminOrdersPage />} />
            <Route path="catalogo" element={<div className="font-bold text-2xl">Catálogo en construcción</div>} />
            <Route path="personal" element={<div className="font-bold text-2xl">Personal en construcción</div>} />
          </Route>

        </Routes>
      </main>

      <Footer />

      <MiniCart />
    </div>
  )
}

export default App;