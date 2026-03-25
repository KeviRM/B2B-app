// src/components/CheckoutPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutPage() {
  // Estado para controlar qué método de pago está activo
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'transferencia' | 'oxxo'>('tarjeta');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* Cabecera y Botón de Volver (Igual al Carrito) */}
      <div className="flex items-center mb-10 relative">
        <Link to="/carrito" className="absolute left-0 flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <div className="text-xs text-left leading-tight">
            <span>Volver a</span><br /><span>Carrito</span>
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-center w-full text-gray-900">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* COLUMNA IZQUIERDA: Formularios */}
        <div className="flex-1">
          
          {/* Fila Superior: Direcciones y Referencias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            
            {/* Direcciones */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dirección de Entrega</h2>
              <div className="space-y-4 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="address" defaultChecked className="w-6 h-6 text-blue-500 border-gray-300 focus:ring-blue-500" />
                  <span className="text-gray-800 font-medium group-hover:text-black">Sucursal 1 - Calle 24 de Septiembre #12, Apizaco</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="address" className="w-6 h-6 text-blue-500 border-gray-300 focus:ring-blue-500" />
                  <span className="text-gray-800 font-medium group-hover:text-black">Sucursal 2 - Calle Francisco y Madero #27, Apizaco</span>
                </label>
              </div>
              <button className="px-6 py-2 border border-gray-400 rounded-lg text-gray-800 font-bold hover:bg-gray-50 transition-colors">
                + Agrega nueva dirección.
              </button>
            </div>

            {/* Referencias */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Referencias para el repartidor</h2>
              <textarea 
                className="w-full h-32 p-4 border border-gray-400 rounded-xl resize-y outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="Ej. Portón blanco, frente al parque..."
              ></textarea>
            </div>
          </div>

          {/* Fila Inferior: Método de Pago */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Método de Pago</h2>
            
            {/* Botones de Selección */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setPaymentMethod('tarjeta')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'tarjeta' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Tarjeta
              </button>
              <button 
                onClick={() => setPaymentMethod('transferencia')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'transferencia' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Transferencia
              </button>
              <button 
                onClick={() => setPaymentMethod('oxxo')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'oxxo' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Oxxo
              </button>
            </div>

            {/* Formulario Dinámico: Solo se muestra si es Tarjeta */}
            {paymentMethod === 'tarjeta' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Numero de Tarjeta:</label>
                  <input type="text" className="w-full border border-gray-400 py-3 px-4 rounded-full outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Fecha de vencimiento:</label>
                    <input type="text" placeholder="MM/YY" className="w-32 border border-gray-400 py-3 px-4 rounded-full outline-none text-center focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-900 mb-2">CVV:</label>
                    <input type="text" className="w-24 border border-gray-400 py-3 px-4 rounded-full outline-none text-center focus:border-black focus:ring-1 focus:ring-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Nombre del Titular:</label>
                  <input type="text" className="w-full border border-gray-400 py-3 px-4 rounded-full outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
              </div>
            )}

            {/* Mensajes para otros métodos */}
            {paymentMethod === 'transferencia' && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center animate-[fadeIn_0.3s_ease-out]">
                <span className="text-4xl block mb-2"></span>
                <p className="text-gray-700 font-medium">Al confirmar tu pedido, te generaremos una cuenta CLABE única para que realices tu transferencia SPEI desde la app de tu banco.</p>
              </div>
            )}
            {paymentMethod === 'oxxo' && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center animate-[fadeIn_0.3s_ease-out]">
                <span className="text-4xl block mb-2"></span>
                <p className="text-gray-700 font-medium">Al confirmar tu pedido, te daremos un código de barras. Podrás ir a cualquier tienda OXXO a pagar en efectivo.</p>
              </div>
            )}

          </div>

        </div>

        {/* COLUMNA DERECHA: Resumen (Separada por la línea vertical) */}
        <div className="w-full lg:w-96 lg:border-l-2 lg:border-gray-400 lg:pl-10 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Resumen</h2>
          
          {/* Lista de Productos del Checkout */}
          <div className="mb-8 border-b border-gray-300 pb-6">
            <div className="flex justify-between items-center text-gray-800 font-bold mb-3">
              <span>- Nombre Producto</span>
              <span className="text-sm">x 22</span>
              <span>$2046.00</span>
            </div>
            {/* Aquí se mapearían los demás productos del carrito */}
          </div>
          
          <div className="space-y-4 text-lg font-bold text-gray-900 mb-6">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Subtotal</span>
              <span className="font-normal text-gray-700">$2046.00</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Envío</span>
              <div className="text-right">
                <span className="block text-red-400 line-through text-sm">$100.00</span>
                <span className="font-normal text-gray-700">$60.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xl pt-2">
              <span>TOTAL:</span>
              <span>$2106.00</span>
            </div>
          </div>

          <button className="w-full bg-[#16A34A] text-white font-bold text-2xl py-5 rounded-2xl hover:bg-green-700 transition-colors mb-6 tracking-wide flex flex-col items-center">
            <span>Confirmar y Pagar</span>
            <span>$2106.00</span>
          </button>

          {/* Sellos de Confianza */}
          <div className="flex justify-center items-center gap-6 mt-2">
            <div className="flex items-center text-gray-600 font-bold text-sm">
              <svg className="w-10 h-10 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Pago 100%<br/>seguro</span>
            </div>
            <div className="flex items-center text-blue-500 font-bold text-xl">
              <span className="text-2xl mr-1"></span> mercado pago
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}