// src/components/CatalogPage.tsx
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
      {/* Columna Izquierda: Filtros (Ocupa todo el ancho en móvil, 64px fijos en desktop) */}
      <SidebarFilters />
      
      {/* Columna Derecha: Buscador y Grid de Productos (Ocupa el resto del espacio) */}
      <ProductGrid />
    </div>
  );
}