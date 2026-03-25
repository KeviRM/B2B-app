import { NavLink } from 'react-router-dom';
import logo from '../assets/logo2.png'; 
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Header() {


  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "text-black font-bold uppercase tracking-wide border-b-4 border-black pb-1" 
      : "text-gray-600 hover:text-black font-semibold uppercase tracking-wide";
  
  const { getTotalItems, openCart } = useCart();

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Navegación Izquierda */}
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink to="/" className={getNavLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={getNavLinkClass}>
              Catálogo
            </NavLink>
            {/* Como aún no tenemos página de contactos, lo dejamos apuntando a inicio o a un # */}
            <NavLink to="/contactos" className={getNavLinkClass}>
              Contactos
            </NavLink>
          </nav>

          {/*  Logo Central  */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-sm relative -bottom-4">
              
              
              <span className="text-2xl"><img src={logo} alt="Logo" /></span> 
            </div>
          </div>

          {/* 3. Acciones Derecha (Usuario y Carrito) */}
          <div className="flex items-center space-x-8">
                      
            <Link to="/perfil" className="flex items-center text-gray-800 hover:text-brandPrimary font-medium transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Mi Perfil {/* O cambiamos el texto a "Mi Perfil" */}
            </Link>
            

            <button 
            onClick={openCart}
            className="text-gray-800 hover:text-brandPrimary transition-colors relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              
              {/* Burbuja dinámica del carrito */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}