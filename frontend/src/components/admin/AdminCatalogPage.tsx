import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ApiProduct } from '../../types';
import AdminProductModal from './AdminProductModal'; // <-- 1. IMPORTAR MODAL

export default function AdminCatalogPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. ESTADOS DEL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ApiProduct | null>(null);

  const loadProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error("Error cargando catálogo", err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  // Manejadores para abrir el modal
  const handleAddNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ApiProduct) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${name}" del catálogo? Esto no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No tienes permiso o hubo un error');
      loadProducts();
    } catch (err) {
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  const formatCurrency = (amount: string | number) => '$' + parseFloat(amount.toString()).toFixed(2);

  if (loading) return <div className="py-20 text-center font-bold text-gray-500 animate-pulse">Cargando inventario...</div>;

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo y Precios</h1>
        <button 
          onClick={handleAddNew} 
          className="bg-[#333333] hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <span>+</span> Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="py-4 px-6 font-bold">Producto</th>
                <th className="py-4 px-6 font-bold">SKU</th>
                <th className="py-4 px-6 font-bold text-right">Precio Base</th>
                <th className="py-4 px-6 font-bold text-center">Niveles de Mayoreo</th>
                <th className="py-4 px-6 font-bold text-center">Stock</th>
                <th className="py-4 px-6 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">Tu catálogo está vacío.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6"><div className="font-bold text-gray-900 text-base">{product.name}</div></td>
                    <td className="py-4 px-6 text-gray-500 font-mono">{product.sku}</td>
                    <td className="py-4 px-6 text-right font-extrabold text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        {product.tiers?.length || 0} reglas
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`${product.stock < 50 ? 'text-red-600' : 'text-green-600'} font-bold`}>
                        {product.stock} pzas.
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-3">
                        {/* 4. CONECTAR BOTÓN EDITAR */}
                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Editar</button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-500 hover:text-red-700 font-bold transition-colors">Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. INYECTAR EL MODAL */}
      <AdminProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadProducts}
        productToEdit={productToEdit}
      />

    </div>
  );
}