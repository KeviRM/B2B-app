// src/components/CartPage.tsx
import { Link } from 'react-router-dom';

export default function CartPage() {
  // Simularemos los datos para que coincidan con tu mockup exactamente
  const subtotal = 1860.00;
  const envio = 100.00;
  const total = subtotal + envio;
  
  // Lógica simulada de la barra de progreso (meta de $2000 para descuento)
  const metaEnvio = 2000;
  const faltante = metaEnvio - subtotal;
  const porcentajeProgreso = Math.min((subtotal / metaEnvio) * 100, 100);

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
              Agrega ${faltante.toFixed(2)} más a tu pedido para obtener un descuento en el envió
            </p>
          </div>

          {/* Tabla de Productos (Cabeceras) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-lg font-bold text-gray-900 text-center">
            <div className="col-span-5 text-left">Producto</div>
            <div className="col-span-2">Precio unitario</div>
            <div className="col-span-3">Cantidad</div>
            <div className="col-span-2">Subtotal</div>
          </div>

          {/* Fila del Producto (Simulado según tu mockup) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-200">
            {/* Imagen y Nombre */}
            <div className="col-span-5 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-600 rounded flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Nombre Producto</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">SKU: MSOO1</p>
              </div>
            </div>
            
            {/* Precio Unitario */}
            <div className="col-span-2 text-center font-medium text-gray-800">
              $97.00 c/U
            </div>
            
            {/* Selector de Cantidad */}
            <div className="col-span-3 flex items-center justify-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button className="px-3 py-1 font-bold text-gray-600 hover:text-black">-</button>
                <input type="text" value="20" readOnly className="w-10 text-center font-bold text-gray-900 border-x border-gray-300 py-1" />
                <button className="px-3 py-1 font-bold text-gray-600 hover:text-black">+</button>
              </div>
              <span className="text-xs font-semibold text-gray-600">piezas.</span>
            </div>

            {/* Subtotal y Eliminar */}
            <div className="col-span-2 flex items-center justify-between md:justify-end gap-6 font-bold text-gray-900">
              <span className="md:w-full text-center">$1860.00</span>
              <button className="text-gray-800 hover:text-red-600 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

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
              {/* Simulación del logo de Mercado Pago */}
              <span className="text-2xl mr-1"></span> mercado pago
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}