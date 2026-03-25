// src/components/SidebarFilters.tsx
export default function SidebarFilters() {
  return (
    <aside className="w-full md:w-64 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-fit sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b-2 border-brandPrimary pb-2">
        Filtros
      </h2>

      {/* Filtro: Categorías */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Categorías</h3>
        <div className="space-y-2">
          {['Abarrotes', 'Lácteos y Huevos', 'Limpieza', 'Bebidas', 'Desechables'].map((cat) => (
            <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-brandPrimary rounded border-gray-300 focus:ring-brandPrimary" />
              <span className="text-gray-600 group-hover:text-black transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro: Marcas */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Marcas Destacadas</h3>
        <div className="space-y-2">
          {['Nestlé', 'Alpura', 'Bimbo', 'Coca-Cola'].map((marca) => (
            <label key={marca} className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-brandPrimary rounded border-gray-300 focus:ring-brandPrimary" />
              <span className="text-gray-600 group-hover:text-black transition-colors">{marca}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Botón Limpiar */}
      <button className="w-full text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
        Limpiar todos los filtros
      </button>
    </aside>
  );
}