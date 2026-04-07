// src/components/CartPage.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MPLogo from '../assets/MP_Logo.svg';

import { STORE_CONFIG } from '../config/store';


export default function CartPage() {

  const { cart, updateQuantity, removeFromCart } = useCart();


  const getNumericPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
  };
  const subtotal = cart.reduce((total, item) => {
    const priceToUse = item.bulkPrice ? getNumericPrice(item.bulkPrice) : getNumericPrice(item.price);
    return total + (priceToUse * item.quantity);
  }, 0);

    const porcentajeProgreso = Math.min((subtotal / STORE_CONFIG.FREE_SHIPPING_THRESHOLD) * 100, 100);
    const faltante = Math.max(STORE_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal, 0);
    const envio = subtotal >= STORE_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : STORE_CONFIG.BASE_SHIPPING_COST;  
    const total = subtotal + envio;
  



  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen text-center">
        <span className="text-8xl mb-6 block">
          {/* svg de carrito */}
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8 text-lg">Parece que aún no has agregado productos a tu pedido de mayoreo.</p>
        <Link to="/catalogo" className="inline-block bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-blue-900 transition-colors">
          Ir al Catálogo
        </Link>

        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* 1. Cabecera y Botón de Volver */}
      <div className="flex items-center mb-10 relative">
        <Link to="/catalogo" className="absolute left-0 flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <div className="text-xs text-left leading-tight">
            <span>Volver a</span><br /><span>Catalogo</span>
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-center w-full text-gray-900">Carrito</h1>
      </div>




      <div className="flex flex-col lg:flex-row gap-12">



        {/* COLUMNA IZQUIERDA: Productos y Barra de Progreso */}
        <div className="flex-1">
          
          {/* Barra de Progreso de Envío */}
          <div className="mb-10">
            <div className="w-full h-4 bg-gray-100 rounded-full border border-gray-300 overflow-hidden mb-2">
              <div 
                className="h-full bg-yellow-300 transition-all duration-500"
                style={{ width: `${porcentajeProgreso}%` }}
              ></div>
            </div>
            <p className="text-center text-xs font-semibold text-gray-700">

              {faltante === 0
                ? '¡Felicidades! Tienes un descuento en el envío.'
                : `Agrega $${faltante.toFixed(2)} más a tu pedido para obtener un descuento en el envío.`
              }
            </p>
          </div>




          {/* Tabla de Productos (Cabeceras) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-lg font-bold text-gray-900 text-center">
            <div className="col-span-5 text-left">Producto</div>
            <div className="col-span-2">Precio unitario</div>
            <div className="col-span-3">Cantidad</div>
            <div className="col-span-2">Subtotal</div>
          </div>








              {cart.map((item) => {
                const itemPrice = item.bulkPrice ? getNumericPrice(item.bulkPrice) : getNumericPrice(item.price);
                const itemTotal = itemPrice * item.quantity;




                return (

                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-200">

                    {/* Imagen y Nombre */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-600 rounded shrink-0 flex items-center justify-center text-3xl">
                        {item.img}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">SKU: {item.sku}</p>
                      </div>
                    </div>


                    {/* Precio Unitario */}
                    <div className="col-span-2 text-center font-medium text-gray-800">
                      <span className="md:hidden text-gray-500 text-sm mr-2">Precio:</span>
                      ${itemPrice.toFixed(2)} c/u
                    </div>

                    {/* Selector de Cantidad */}
                    <div className="col-span-3 flex items-center justify-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 font-bold text-gray-600 hover:text-black transition-colors"
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          value={item.quantity} 
                          readOnly 
                          className="w-10 text-center font-bold text-gray-900 border-x border-gray-300 py-1 outline-none" 
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 font-bold text-gray-600 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">piezas.</span>
                    </div>


                    {/* Subtotal y Eliminar */}
                    <div className="col-span-2 flex items-center justify-between md:justify-end gap-6 font-bold text-gray-900">
                      <span className="md:w-full text-center">
                        <span className="md:hidden text-gray-500 text-sm font-normal mr-2">Subtotal:</span>
                        ${itemTotal.toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-800 hover:text-red-600 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>





                  </div>

              );

              })}

        </div>

        {/* COLUMNA DERECHA: Resumen (Separada por la línea vertical en desktop) */}
        <div className="w-full lg:w-96 lg:border-l-2 lg:border-gray-400 lg:pl-10 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Resumen</h2>
          
          <div className="space-y-6 text-lg font-bold text-gray-900 mb-8">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Subtotal</span>
              <span className="font-normal text-gray-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Envío</span>
              <span className="font-normal text-gray-700">${envio.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Total a Pagar:</h3>
            <p className="text-4xl font-extrabold text-brandSuccess">${total.toFixed(2)}</p>
          </div>

            <Link to="/checkout" className="w-full bg-[#2D2D2D] text-white font-bold text-xl py-5 rounded-3xl hover:bg-black transition-colors mb-4 tracking-wide flex justify-center">
                PROCEDER A PAGAR
            </Link>

          {/* Sello de Confianza Mercado Pago */}
          <div className="text-center mt-2">
            <p className="text-sm font-semibold text-gray-600 mb-2">Pago 100% seguro</p>
            <div className="flex justify-center items-center text-blue-500 font-bold text-xl">
              
                 <img src={MPLogo} alt="Mercado Pago" className='w-sm h-sm' />
                  
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}