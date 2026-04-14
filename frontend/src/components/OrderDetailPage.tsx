import { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type{ ApiOrderItem } from '../types';
import { STORE_CONFIG } from '../config/store';
import { useCart } from '../context/CartContext';
import type{ ApiOrder } from '../types';


interface Order {
  id: number;
  subtotal: string;
  shipping_cost: string;
  total: string;
  status: string;
  payment_method: string;
  created_at: string;
  notes: string;
  items: ApiOrderItem[];
  address: {
    street_and_number: string;
    neighborhood: string;
  };
}



// Mapa de estados para la barra de progreso
const ORDER_STEPS = [
  { key: 'pending_payment', label: 'Esperando Pago' },
  { key: 'paid', label: 'Confirmado' },
  { key: 'processing', label: 'Preparando' },
  { key: 'shipped', label: 'En Ruta' },
  { key: 'delivered', label: 'Entregado' }
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();


  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); 

  // Motor de Descarga Real desde el Backend
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}/ticket`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      // Convertimos la respuesta en un archivo Blob
      const blob = await response.blob();
      
      // Link invisible para forzar la descarga en el navegador
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket_PED-${order?.id.toString().padStart(4, '0')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpiamos el link invisible
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("Hubo un problema al descargar el ticket.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  


  useEffect(() => {
    if (token && id) {
      fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        }
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al cargar el pedido');
        setOrder(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    }
  }, [id, token]);



  // Lógica para volver a pedir
  

    const handleReorder = (order: ApiOrder) => {
        order.items.forEach(item => {
        const productForCart = {
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,                   
            price: item.product.price,   
            img: item.product.image_url || '',      
            quantity: item.quantity,                 
            tiers: item.product.tiers || [], 
        };
        
        if (addToCart) {    
            addToCart(productForCart);
        }
        });

        alert("Productos agregados al carrito exitosamente.");
        navigate('/carrito');
    };







  // Formateadores de datos
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }) + ' Hrs.';
  };

  const formatCurrency = (amount: string | number) => {
    return '$' + parseFloat(amount.toString()).toFixed(2);
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-bold animate-pulse">Cargando detalles del pedido...</div>;
  if (error || !order) return <div className="text-center py-20 text-red-500 font-bold">{error || "Pedido no encontrado"}</div>;

  // Calculamos el índice del estado actual para colorear la barra
  const currentStepIndex = ORDER_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 bg-white min-h-screen font-sans">
      
      {/* Navegación y Cabecera */}
      <div className="mb-8 text-center relative">
        <button 
        onClick={() => navigate('/perfil', { state: { activeTab: 'Mis Compras' } })}
        className="absolute left-0 top-2 flex items-center text-gray-600 hover:text-black font-semibold"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver
      </button>
      </div>
        
<div  className="bg-white p-4 sm:p-8 rounded-xl">

  <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          #PED-{order.id.toString().padStart(4, '0')}
        </h1>
        <p className="text-gray-500 font-medium mt-2">{formatDateTime(order.created_at)}</p>

  </div>

      {/* 1. Barra de Progreso */}
      <div className="border border-gray-300 rounded-2xl p-6 mb-10">
        <h3 className="text-center font-bold text-gray-800 mb-4">Estado del pedido:</h3>
        
        {isCancelled ? (
           <div className="flex justify-center"><span className="bg-red-600 text-white font-bold px-8 py-2 rounded-full">Cancelado</span></div>
        ) : (
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-3">
            {ORDER_STEPS.map((step, index) => {
              // Lógica de colores según el progreso
              let badgeColor = 'bg-gray-500 text-white'; // Pendiente (gris)
              if (index < currentStepIndex) badgeColor = 'bg-[#16A34A] text-white'; // Completado (Verde)
              if (index === currentStepIndex) badgeColor = 'bg-[#1D4ED8] text-white'; // Actual (Azul)

              return (
                <span key={step.key} className={`px-5 py-2 rounded-full font-bold text-sm text-center ${badgeColor}`}>
                  {step.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Detalles del Cliente y Referencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4 text-gray-800 font-medium text-center">
          <p><span className="font-bold">Cliente:</span> {user?.name}</p>
          <p><span className="font-bold">Método de Pago:</span> <span className="capitalize">{order.payment_method}</span> {order.payment_method === 'tarjeta' && '(Mercado Pago)'}</p>
          <p><span className="font-bold">Dirección de Entrega:</span> {order.address.street_and_number}, {order.address.neighborhood}</p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-800 mb-2 text-center lg:text-left">Referencias:</h4>
          <div className="border border-gray-300 rounded-xl p-4 min-h-25 text-gray-600 text-sm">
            {order.notes || 'Sin referencias registradas.'}
          </div>
        </div>
      </div>

      {/* 3. Tabla de Productos */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-gray-300 text-gray-800 text-sm uppercase">
              <th className="py-4 px-2 font-bold w-24">CANT.</th>
              <th className="py-4 px-2 font-bold">NOMBRE</th>
              <th className="py-4 px-2 font-bold w-32">SKU</th>
              <th className="py-4 px-2 font-bold text-right w-40">PRECIO UNITARIO</th>
              <th className="py-4 px-2 font-bold text-right w-32">IMPORTE</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium border-b border-gray-300">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 px-2">{item.quantity} piezas.</td>
                <td className="py-4 px-2">{item.product.name}</td>
                <td className="py-4 px-2">{item.product.sku}</td>
                <td className="py-4 px-2 text-right">{formatCurrency(item.price)}</td>
                <td className="py-4 px-2 text-right text-gray-900 font-bold">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Pie de Página: Botón PDF y Totales */}
       <div className="flex  justify-end mt-10">        

        <div className="w-full md:w-80">
          <div className="flex justify-between py-2 text-lg font-bold text-gray-800">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
         <div className="flex justify-between items-center py-2 text-lg font-bold border-b border-gray-300">
            <span>Envío</span>
            <div className="flex items-center gap-3">
              {parseFloat(order.shipping_cost) === STORE_CONFIG.DISCOUNT_SHIPPING ? (
                <>
                  {/* Precio base tachado */}
                  <span className="text-gray-400 line-through text-sm font-medium">
                    {formatCurrency(STORE_CONFIG.BASE_SHIPPING_COST)}
                  </span>
                  {/* Costo con descuento */}
                  <span className="text-[#d17a7a]">{formatCurrency(order.shipping_cost)}</span>
                </>
              ) : (
                /* Costo normal sin tachar nada */
                <span className="text-[#d17a7a]">{formatCurrency(order.shipping_cost)}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between pt-4 text-xl font-extrabold text-gray-900">
            <span>TOTAL:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>


       </div>
</div>        

        <div className="flex flex-col sm:flex-row gap-4 justify-start mt-8 border-t border-gray-200 pt-8">    
            <button 
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className={`px-8 py-3 rounded-xl font-bold transition-colors ${
              isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#333333] hover:bg-black text-white'
            }`}
          >
            {isGeneratingPDF ? 'Generando...' : 'Generar Ticket en PDF'}
          </button>

          {/* BOTÓN DE RECOMPRA */}
          <button 
            onClick={() => handleReorder(order)}
            className="bg-brandSuccess hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Volver a Pedir
          </button>
        </div>


    </div>
  );
}