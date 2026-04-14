import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import type { AdminOrder } from '../../types';
import OrderDetailsModal from './OrderDetailsModal'; 

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pendiente de Pago' },
  { value: 'paid', label: 'Confirmado / Pagado' },
  { value: 'processing', label: 'Preparando' },
  { value: 'shipped', label: 'En Ruta' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' }
];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // 1. Cargar las órdenes desde el Backend
  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/admin/orders`, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Accept': 'application/json' 
      }
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error cargando pedidos');
      setOrders(data);
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, [token]);

  // 2. Lógica para cambiar el estatus en tiempo real
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Error al actualizar el estado');
      
      // Actualizamos la tabla localmente sin recargar la página
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (err) {
      alert("No tienes permiso o hubo un error al cambiar el estatus.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 3. Motor de Filtrado y Búsqueda
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toString().includes(searchTerm) || 
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Formateadores
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  const formatCurrency = (amount: string | number) => '$' + parseFloat(amount.toString()).toFixed(2);

  // Selector de colores para el badge visual
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'paid':            return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':      return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'shipped':         return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':       return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':       return 'bg-red-100 text-red-800 border-red-300';
      default:                return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Cargando centro de mando...</div>;
  if (error) return <div className="text-center py-20 font-bold text-red-500">Error: {error}</div>;

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Órdenes</h1>
        <div className="bg-[#333333] text-white px-4 py-2 rounded-lg font-bold">
          Total de pedidos: {filteredOrders.length}
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-gray-400"></span>
          <input 
            type="text" 
            placeholder="Buscar por ID de pedido o nombre de cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium"
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium bg-white"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA MAESTRA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 text-sm uppercase">
                <th className="py-4 px-6 font-extrabold">Pedido</th>
                <th className="py-4 px-6 font-extrabold">Fecha</th>
                <th className="py-4 px-6 font-extrabold">Cliente</th>
                <th className="py-4 px-6 font-extrabold">Total</th>
                <th className="py-4 px-6 font-extrabold">Estatus Actual</th>
                <th className="py-4 px-6 font-extrabold text-center">Cambio Rápido</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500 italic">No se encontraron pedidos con esos filtros.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="font-extrabold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          #PED-{order.id.toString().padStart(4, '0')}
                        </button>
                        <div className="text-xs text-gray-400 mt-1">{order.items.length} productos</div>
                      </td>
                    <td className="py-4 px-6 text-sm">{formatDate(order.created_at)}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-green-600">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {STATUS_OPTIONS.find(o => o.value === order.status)?.label || order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`text-sm font-bold border border-gray-300 rounded-lg px-2 py-1 outline-none transition-colors ${
                          updatingId === order.id ? 'bg-gray-200 text-gray-500' : 'bg-white hover:border-black cursor-pointer'
                        }`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* 🌟 MODAL DE DETALLES DEL PEDIDO (COMPONENTE SEPARADO) */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

    </div>
  );
}