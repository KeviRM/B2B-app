import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface DashboardData {
  revenue: number;
  pending_orders: number;
  low_stock_products: {
    id: number;
    name: string;
    sku: string;
    stock: number;
    image_url: string | null;
  }[];
  sales_chart: {
    name: string;
    total: number;
  }[];
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error cargando métricas:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 font-bold text-gray-500 animate-pulse">Cargando métricas del negocio...</div>;
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Centro de Comando</h1>

      {/* Tarjetas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Tarjeta Ingresos */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl"></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Ingresos Totales</p>
            <p className="text-2xl font-black text-gray-800">
              ${data?.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Tarjeta Pedidos */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl"></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Pedidos Pendientes</p>
            <p className="text-2xl font-black text-gray-800">{data?.pending_orders}</p>
          </div>
        </div>

        {/* Tarjeta Alertas */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl"></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Alertas de Inventario</p>
            <p className="text-2xl font-black text-gray-800">{data?.low_stock_products.length}</p>
          </div>
        </div>
      </div>





    {/* Sección de Gráfica de Ventas (Últimos 7 días) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-extrabold text-gray-800 mb-6">Ventas de los últimos 7 días</h2>
        
        {data?.sales_chart && data.sales_chart.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sales_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString('es-MX')}`, 'Ingresos']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-bold">No hay ventas registradas en los últimos 7 días.</p>
          </div>
        )}
      </div>


      {/* Sección de Productos por Agotar */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-800">Productos por Agotar (Stock &le; 10)</h2>
        </div>
        
        {data?.low_stock_products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold">
            ¡Todo excelente! No hay problemas de inventario.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data?.low_stock_products.map(product => (
              <li key={product.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="text-xs font-bold text-gray-400">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {product.stock} piezas
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}