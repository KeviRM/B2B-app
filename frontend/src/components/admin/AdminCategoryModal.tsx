import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ApiCategory } from '../../types';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminCategoryModal({ isOpen, onClose }: AdminCategoryModalProps) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para crear/editar
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCategories(data))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen && token) loadCategories();
  }, [isOpen, token]);

  if (!isOpen) return null;

  // CREAR O ACTUALIZAR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    setIsSubmitting(true);
    const url = editingId 
      ? `${import.meta.env.VITE_API_URL}/admin/categories/${editingId}`
      : `${import.meta.env.VITE_API_URL}/admin/categories`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: categoryName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar');

      setCategoryName('');
      setEditingId(null);
      loadCategories(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PREPARAR EDICIÓN
  const handleEdit = (cat: ApiCategory) => {
    setEditingId(cat.id);
    setCategoryName(cat.name);
  };

  // CANCELAR EDICIÓN
  const handleCancelEdit = () => {
    setEditingId(null);
    setCategoryName('');
  };

  // ELIMINAR
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la categoría "${name}"? No podrás si ya tiene productos asignados.`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');
      
      loadCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70  backdrop-blur-[3px] animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900">Gestión de Categorías</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Zona de Formulario (Izquierda) */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
            <h3 className="font-bold text-gray-800 mb-4">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nombre</label>
                <input 
                  required 
                  type="text" 
                  value={categoryName} 
                  onChange={e => setCategoryName(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" 
                  placeholder="Ej. Salsas Especiales" 
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !categoryName.trim()} 
                  className={`flex-1 py-2 rounded-xl font-bold text-white transition-colors ${isSubmitting || !categoryName.trim() ? 'bg-gray-400' : 'bg-brandSuccess hover:bg-green-700'}`}
                >
                  {editingId ? 'Actualizar' : 'Agregar'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Zona de Lista (Derecha) */}
          <div className="w-full md:w-1/2 bg-gray-50 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500 font-bold animate-pulse">Cargando...</div>
            ) : categories.length === 0 ? (
              <div className="p-6 text-center text-gray-500 italic text-sm">No hay categorías registradas.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {categories.map(cat => (
                  <li key={cat.id} className="p-4 hover:bg-gray-100 flex justify-between items-center transition-colors">
                    <span className="font-bold text-gray-800">{cat.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Editar</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-400 hover:text-red-600 text-xs font-bold">Borrar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}