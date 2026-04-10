// src/components/UserProfilePage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type{ ApiAddress, ApiOrder, ApiOrderItem } from '../types';


export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('Información personal');


  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ street_and_number: '', neighborhood: '', references: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Estados de Órdenes
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Proteger la ruta
  useEffect(() => {
    if (!user || !token) navigate('/login');
  }, [user, token, navigate]);

  const loadAddresses = () => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    .then(async (res) => {
      if (!res.ok) throw new Error("Error obteniendo direcciones");
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) setAddresses(data);
    })
    .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    loadAddresses();
  }, [token]);

  const handleAddAddress = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAddress)
      });
      
      const data = await response.json(); 
      if (!response.ok) {
        throw new Error(data.message || "Error del servidor al guardar.");
      }

      loadAddresses(); 
      
      setIsAddingAddress(false);
      setNewAddress({ street_and_number: '', neighborhood: '', references: '' });
    } catch (error: any) {
      alert(error.message || "Hubo un problema al guardar la dirección.");
    } finally {
      setIsSubmitting(false);
    }
  };





  // Traer el historial de pedidos
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(err => console.error("Error cargando pedidos:", err))
      .finally(() => setLoadingOrders(false));
    }
  }, [token]);





  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;




  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      <div className="flex items-center mb-10 relative border-b border-gray-300 pb-6">
        <div className="flex">

        <Link to="/" className="absolute left-0 flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-bold">Volver</span>
        </Link>
        </div>
        
        <h1 className="text-3xl font-bold w-full text-center md:text-left md:ml-32 text-gray-800">
          Perfil de Usuario
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SLIDE IZQUIERDO (Sidebar) */}
        <aside className="w-full md:w-64 shrink-0 border border-gray-300 rounded-b-2xl overflow-hidden flex flex-col h-fit">
          <div className="bg-[#333333] text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold uppercase">
               {/* Inicial del usuario */}
               {user.name.charAt(0)}
            </div>
            <span className="font-bold text-lg line-clamp-1">{user.name}</span>
          </div>

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
            
            <div className="h-16"></div> 
            
            <button 
              onClick={handleLogout}
              className="p-5 font-bold text-center text-red-600 hover:bg-red-50 transition-colors border-t border-gray-300"
            >
              Salir
            </button>
          </nav>
        </aside>

        {/* CONTENIDO DERECHO */}
        <div className="flex-1">
          
          {/* PESTAÑA: Mis Compras (Tu diseño original intacto) */}
          {activeTab === 'Mis Compras' && (
            <div className="w-full animate-[fadeIn_0.3s_ease-out]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 font-bold text-gray-800 text-lg">
                <div className="col-span-3">Num. Pedido</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-3 text-center">Total</div>
                <div className="col-span-4 text-center">Acciones</div>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-400 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 bg-white">
                    <div className="w-full md:w-3/12 font-extrabold text-3xl text-gray-800">{order.id}</div>
                    <div className="w-full md:w-2/12 flex flex-col items-center md:border-l border-gray-300">
                      <span className={`${order.statusColor} text-white px-6 py-2 rounded-full font-bold text-sm w-full text-center max-w-35`}>{order.status}</span>
                      <span className="text-sm font-bold text-gray-800 mt-2">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="w-full md:w-3/12 text-center font-bold text-green-600 text-lg md:border-l border-gray-300">{order.total}</div>
                    <div className="w-full md:w-4/12 flex flex-col xl:flex-row gap-3 justify-center pl-0 md:pl-4">
                      <button className="bg-[#333333] text-white px-4 py-3 rounded-full font-bold text-sm flex-1 hover:bg-black transition-colors">Ver Detalles</button>
                      <button className="bg-[#333333] text-white px-4 py-3 rounded-full font-bold text-sm flex-1 hover:bg-black transition-colors">Volver a Pedir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA: Información Personal (Datos Reales + Direcciones) */}
          {activeTab === 'Información personal' && (
             <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                 
                 {/* Datos de la cuenta */}
                 <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-8">
                   <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Datos de la Cuenta</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                     <p><span className="font-bold block text-sm">Nombre completo / Razón Social:</span> {user.name}</p>
                     <p><span className="font-bold block text-sm">Correo Electrónico:</span> {user.email}</p>
                     <p><span className="font-bold block text-sm">Teléfono (SMS):</span> {user.phone}</p>
                   </div>
                 </div>

                 {/* Sección de Direcciones */}
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold text-gray-800">Mis Sucursales / Direcciones</h2>
                   {!isAddingAddress && (
                     <button onClick={() => setIsAddingAddress(true)} className="text-sm font-bold text-[#333333] hover:underline">
                       + Agregar Nueva
                     </button>
                   )}
                 </div>

                 {/* Formulario de Nueva Dirección */}
                 {isAddingAddress && (
                   <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-2xl border border-gray-300 mb-6">
                     <div className="space-y-4 mb-4">
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Calle y Número</label>
                         <input type="text" required value={newAddress.street_and_number} onChange={(e) => setNewAddress({...newAddress, street_and_number: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black" placeholder="Ej. Av. Reforma 123" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Colonia</label>
                         <input type="text" required value={newAddress.neighborhood} onChange={(e) => setNewAddress({...newAddress, neighborhood: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black" placeholder="Ej. Centro" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Referencias (Opcional)</label>
                         <input type="text" value={newAddress.references} onChange={(e) => setNewAddress({...newAddress, references: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black" placeholder="Portón negro junto a la tienda" />
                       </div>
                     </div>
                     <div className="flex gap-3">
                       <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className={`text-white px-6 py-2 rounded-full font-bold text-sm transition-colors ${
                           isSubmitting 
                             ? 'bg-gray-400 cursor-not-allowed' 
                             : 'bg-[#333333] hover:bg-black'
                         }`}
                       >
                         {isSubmitting ? 'Guardando...' : 'Guardar Dirección'}
                       </button>
                       
                       <button 
                         type="button" 
                         disabled={isSubmitting}
                         onClick={() => setIsAddingAddress(false)} 
                         className="bg-white border border-gray-400 text-gray-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                       >
                         Cancelar
                       </button>
                     </div>
                   </form>
                 )}

                 {/* Lista de Direcciones Guardadas */}
                 {addresses.length === 0 && !isAddingAddress ? (
                   <p className="text-gray-500 italic p-4 border border-dashed border-gray-300 rounded-xl text-center">No has registrado ninguna dirección de entrega.</p>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {addresses.map(address => (
                       <div key={address.id} className="border border-gray-300 p-5 rounded-2xl relative bg-white">
                         {address.is_default && (
                            <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Predeterminada</span>
                         )}
                         <p className="font-bold text-gray-800 text-lg">{address.street_and_number}</p>
                         <p className="text-gray-600">{address.neighborhood}</p>
                         {address.references && <p className="text-sm text-gray-500 mt-2"> {address.references}</p>}
                       </div>
                     ))}
                   </div>
                 )}

             </div>
          )}

          {/* PESTAÑA: Favoritos (Placeholder para el futuro) */}
          {activeTab === 'Favoritos' && (
             <div className="w-full animate-[fadeIn_0.3s_ease-out] text-center py-20 text-gray-500 font-medium">
                 Aún no tienes productos marcados como favoritos.
             </div>
          )}

        </div>
      </div>
    </div>
  );
}