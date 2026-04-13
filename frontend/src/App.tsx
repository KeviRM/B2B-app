
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

function App() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
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

        </Routes>
      </main>

      <Footer />

      <MiniCart />
    </div>
  )
}

export default App;