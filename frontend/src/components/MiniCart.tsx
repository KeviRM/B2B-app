// src/components/MiniCart.tsx
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function MiniCart() {
  const { cart, isCartOpen, closeCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Si no está abierto, no renderizamos nada
  if (!isCartOpen) return null;

  // Función para ir al checkout y cerrar el panel
  const goToCheckout = () => {
    closeCart();
    navigate('/carrito');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro semitransparente (Si haces clic, se cierra) */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      ></div>

      {/* El Panel Blanco que se desliza */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
        
        {/* Cabecera del Panel */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 uppercase">Tu Carrito</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Lista de Productos (Con Scroll si hay muchos) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <span className="text-4xl mb-4 block">🛒</span>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl">
                    {item.img}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Cant: {item.quantity} cajas</p>
                    <p className="text-brandSuccess font-bold mt-1">{item.bulkPrice}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie del Panel (Botón de Pago) */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button 
              onClick={goToCheckout}
              className="w-full bg-brandPrimary text-white font-bold py-4 rounded-lg shadow-md hover:bg-blue-800 transition-colors uppercase tracking-wide"
            >
              Ver Carrito
            </button>
          </div>
        )}

      </div>
    </div>
  );
}