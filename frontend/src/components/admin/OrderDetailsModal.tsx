import type { AdminOrder } from '../../types';

interface OrderDetailsModalProps {
  order: AdminOrder;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  // Formateadores locales para que el componente sea 100% independiente
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  const formatCurrency = (amount: string | number) => '$' + parseFloat(amount.toString()).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/70 backdrop-blur-[3px] animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Pedido #PED-{order.id.toString().padStart(4, '0')}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{formatDate(order.created_at)}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Info Cliente */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">Datos del Cliente</h3>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Nombre:</span> {order.user.name}</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {order.user.email}</p>
            </div>

            {/* Info Entrega */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">Datos de Entrega</h3>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Dirección:</span> {order.address.street_and_number}, {order.address.neighborhood}</p>
              {order.notes && (
                 <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100 font-medium">
                   <span className="font-bold">Nota:</span> {order.notes}
                 </p>
              )}
            </div>
          </div>

          {/* Tabla de Productos */}
          <h3 className="font-bold text-gray-900 mb-3">Productos Solicitados</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-3 px-4 font-bold">Cant.</th>
                  <th className="py-3 px-4 font-bold">Producto</th>
                  <th className="py-3 px-4 font-bold">SKU</th>
                  <th className="py-3 px-4 font-bold text-right">Unitario</th>
                  <th className="py-3 px-4 font-bold text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-800">
                {order.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.quantity} pzas.</td>
                    <td className="py-3 px-4">{item.product.name}</td>
                    <td className="py-3 px-4 text-gray-500">{item.product.sku}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-4 text-right font-bold">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-full md:w-64 space-y-2 text-sm font-medium text-gray-700">
              <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2"><span>Envío:</span> <span>{formatCurrency(order.shipping_cost)}</span></div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-2"><span>TOTAL:</span> <span className="text-brandSuccess">{formatCurrency(order.total)}</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}