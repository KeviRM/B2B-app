// src/components/SidebarFilters.tsx
import { useState, useEffect } from 'react';
import type{ ApiCategory } from '../types';

// Definimos qué información nos va a mandar el padre
interface SidebarProps {
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  onClearFilters: () => void;
}

export default function SidebarFilters({ selectedCategories, onCategoryToggle, onClearFilters }: SidebarProps) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error conectando con la API de categorías:", error);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="w-full md:w-64 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-fit relative z-10 md:sticky md:top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b-2 border-brandPrimary pb-2">
        Filtros
      </h2>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Categorías</h3>
        {loading ? (
          <div className="text-sm text-gray-400 animate-pulse">Cargando categorías...</div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(category.id)} // <- Lo marcamos si está en el estado del padre
                  onChange={() => onCategoryToggle(category.id)}     // <- Le avisamos al padre al hacer clic
                  className="w-4 h-4 text-brandPrimary rounded border-gray-300 focus:ring-brandPrimary" 
                />
                <span className="text-gray-600 group-hover:text-black transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Marcas Destacadas</h3>
        <div className="space-y-2">
          {['Pa\' Llevar'].map((marca) => (
            <label key={marca} className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-brandPrimary rounded border-gray-300 focus:ring-brandPrimary" />
              <span className="text-gray-600 group-hover:text-black transition-colors">{marca}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conectamos el botón de limpiar */}
      <button 
        onClick={onClearFilters}
        className="w-full text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
      >
        Limpiar todos los filtros
      </button>
    </aside>
  );
}