// src/components/MiniCart.tsx
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function MiniCart() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Si no está abierto, no renderizamos nada
  if (!isCartOpen) return null;

  // Función para ir al checkout y cerrar el panel
  const goToCheckout = () => {
    closeCart();
    navigate('/carrito');
  };

  const getNumericPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const getCurrentPrice = (item: any) => {
    let currentPrice = getNumericPrice(item.price);
    
    if (item.tiers && item.tiers.length > 0) {
      const applicableTier = [...item.tiers]
        .filter((t: any) => item.quantity >= t.min_quantity)
        .sort((a: any, b: any) => b.min_quantity - a.min_quantity)[0];
        
      if (applicableTier) {
        currentPrice = parseFloat(applicableTier.price);
      }
    } 
    else if (item.bulkPrice && item.quantity >= 12) {
      currentPrice = getNumericPrice(item.bulkPrice);
    }
    
    return currentPrice;
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
              <span className="text-4xl mb-4 block"> </span>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center border border-gray-300 rounded-md mt-1 w-24">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 font-bold text-gray-600 hover:text-black transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center font-bold text-gray-900 border-x border-gray-300 py-0.5 outline-none text-sm" 
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 font-bold text-gray-600 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-brandSuccess font-bold mt-1">${getCurrentPrice(item).toFixed(2)} c/u</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2">
                    {/* trash */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg >
                    
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