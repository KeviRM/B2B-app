// src/components/UserProfilePage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Datos simulados basados en tu mockup
const orders = [
  { 
    id: '#PED-0002', 
    status: 'En Ruta', 
    date: '19/03/26', 
    total: '$2106.00', 
    statusColor: 'bg-blue-800' // Azul para En Ruta
  },
  { 
    id: '#PED-0001', 
    status: 'Entregado', 
    date: '19/02/26', 
    total: '$1950.00', 
    statusColor: 'bg-green-700' // Verde para Entregado
  },
];

export default function UserProfilePage() {
  // Estado para controlar qué pestaña del menú lateral está activa
  const [activeTab, setActiveTab] = useState('Mis Compras');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* 1. Cabecera y Botón de Volver */}
      <div className="flex items-center mb-10 relative border-b border-gray-300 pb-6">
        <Link to="/" className="absolute left-0 flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-bold">Volver</span>
        </Link>
        <h1 className="text-3xl font-bold w-full text-center md:text-left md:ml-32 text-gray-800">
          Perfil de Usuario
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 2. SLIDE IZQUIERDO (Sidebar de Navegación) */}
        <aside className="w-full md:w-64 flex-shrink-0 border border-gray-300 rounded-b-2xl overflow-hidden flex flex-col h-fit">
          {/* Info del Usuario */}
          <div className="bg-[#333333] text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span className="font-bold text-lg">Nombre de Usuario</span>
          </div>

          {/* Opciones del Menú */}
          <nav className="flex flex-col">
            <button 
              onClick={() => setActiveTab('Información personal')}
              className={`p-5 font-bold text-center border-b border-gray-300 transition-colors ${activeTab === 'Información personal' ? 'bg-[#666666] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Información personal
            </button>
            <button 
              onClick={() => setActiveTab('Mis Compras')}
              className={`p-5 font-bold text-center border-b border-gray-300 transition-colors ${activeTab === 'Mis Compras' ? 'bg-[#666666] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Mis Compras
            </button>
            <button 
              onClick={() => setActiveTab('Favoritos')}
              className={`p-5 font-bold text-center border-b border-gray-300 transition-colors ${activeTab === 'Favoritos' ? 'bg-[#666666] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Favoritos
            </button>
            
            {/* Espaciador para empujar Salir hacia abajo si fuera necesario */}
            <div className="h-16"></div> 
            
            <button className="p-5 font-bold text-center text-gray-800 hover:bg-gray-50 transition-colors">
              Salir
            </button>
          </nav>
        </aside>

        {/* 3. CONTENIDO DERECHO (Mis Compras) */}
        <div className="flex-1">
          {activeTab === 'Mis Compras' && (
            <div className="w-full">
              
              {/* Cabecera de la Tabla */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 font-bold text-gray-800 text-lg">
                <div className="col-span-3">Num. Pedido</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-3 text-center">Total</div>
                <div className="col-span-4 text-center">Acciones</div>
              </div>

              {/* Lista de Pedidos */}
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-400 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 bg-white">
                    
                    {/* Número de Pedido */}
                    <div className="w-full md:w-3/12 font-extrabold text-3xl text-gray-800">
                      {order.id}
                    </div>
                    
                    {/* Estado y Fecha (Con separador izquierdo) */}
                    <div className="w-full md:w-2/12 flex flex-col items-center md:border-l border-gray-300">
                      <span className={`${order.statusColor} text-white px-6 py-2 rounded-full font-bold text-sm w-full text-center max-w-[140px]`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-gray-800 mt-2">
                        {order.date}
                      </span>
                    </div>

                    {/* Total (Con separador izquierdo) */}
                    <div className="w-full md:w-3/12 text-center font-bold text-green-600 text-lg md:border-l border-gray-300">
                      {order.total}
                    </div>

                    {/* Botones de Acción */}
                    <div className="w-full md:w-4/12 flex flex-col xl:flex-row gap-3 justify-center pl-0 md:pl-4">
                      {/* Aquí iría un <Link to={`/pedido/${order.id}`}> en el futuro para ver la línea de tiempo */}
                      <button className="bg-[#333333] text-white px-4 py-3 rounded-full font-bold text-sm flex-1 hover:bg-black transition-colors">
                        Ver Detalles
                      </button>
                      <button className="bg-[#333333] text-white px-4 py-3 rounded-full font-bold text-sm flex-1 hover:bg-black transition-colors">
                        Volver a Pedir
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Renderizado condicional si estuviera en 'Información personal' (Basado en tu imagen 2) */}
          {activeTab === 'Información personal' && (
             <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                 <p className="text-gray-500">Aquí irá el formulario de edición que diseñaste en "Perfil de Usuario.png".</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}