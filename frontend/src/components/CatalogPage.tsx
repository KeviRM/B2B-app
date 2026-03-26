// src/components/CatalogPage.tsx
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import { useState } from 'react';

export default function CatalogPage() {


  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };


  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
      {/* Columna Izquierda: Filtros (Ocupa todo el ancho en móvil, 64px fijos en desktop) */}
      <SidebarFilters
      selectedCategories={selectedCategories}
      onCategoryToggle={handleCategoryToggle}
      onClearFilters={clearFilters}
      />
      
      {/* Columna Derecha: Buscador y Grid de Productos (Ocupa el resto del espacio) */}
      <ProductGrid
      selectedCategories={selectedCategories}
      />
    </div>
  );
}