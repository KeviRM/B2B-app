// src/components/ProductGrid.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';


import type{ ApiProduct } from '../types';






interface ProductGridProps {
  selectedCategories: number[]; // Recibimos las categorías seleccionadas desde el padre
}



export default function ProductGrid({ selectedCategories }: ProductGridProps) {

  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('relevancia');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error conectando con la API:", error);
        setLoading(false);
      });
  }, []);

  const processedProducts = useMemo(() => {
    let result = products;

    // --- Filtrar por categoría seleccionada en el Sidebar ---
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category_id));
    }

    // Filtramos por la barra de búsqueda
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //  Ordenamos el resultado
    result = result.sort((a, b) => {
      if (sortOrder === 'precio_asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortOrder === 'precio_desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0; 
    });

    return result;
  }, [products, searchTerm, sortOrder, selectedCategories]); 

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-96">
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Cargando catálogo desde el servidor...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Barra superior de herramientas */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
        <div className="w-full sm:w-1/2 relative">
          <input 
            type="text" 
            placeholder="Buscar por nombre, descripción o SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* --- MODIFICADO: Conectamos el select al estado sortOrder --- */}
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 text-gray-700 rounded-md py-2 px-4 outline-none focus:ring-2 focus:ring-brandPrimary cursor-pointer"
        >
          <option value="relevancia">Ordenar por: Relevancia</option>
          <option value="precio_asc">Precio: Menor a Mayor</option>
          <option value="precio_desc">Precio: Mayor a Menor</option>
          <option value="mas_vendidos">Más vendidos</option>
        </select>
      </div>

      {/* Grid de Tarjetas (Ahora usamos processedProducts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {processedProducts.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-100 shadow-inner">
            <p className="text-xl font-bold">No se encontraron productos.</p>
          </div>
        )}

        {/* --- MODIFICADO: Iteramos sobre el arreglo procesado --- */}
        {processedProducts.map((product) => {
          const firstTier = product.tiers.length > 0 ? product.tiers[0] : null;
          
          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col animate-[fadeIn_0.3s_ease-out]">
              

              <Link 
                to={`/producto/${product.id}`}
                className="h-48 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300"
              >
                imagen
              </Link>  
              
              
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-gray-400 font-mono mb-1">SKU: {product.sku}</span>

                <Link to={`/producto/${product.id}`} className="font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2 hover:text-brandPrimary transition-colors cursor-pointer">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="mt-auto bg-gray-50 p-3 rounded-md border border-gray-100 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Precio Unitario:</span>
                    <span className="text-sm font-bold text-gray-700">${product.price}</span>
                  </div>
                  
                  {firstTier && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-brandPrimary">Mayoreo (+{firstTier.min_quantity} pz):</span>
                      <span className="text-xl font-extrabold text-brandSuccess">${firstTier.price}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    defaultValue="1" 
                    min="1" 
                    className="w-16 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-brandPrimary outline-none font-bold"
                  />
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      sku: product.sku,
                      name: product.name,
                      price: `$${product.price}`,
                      bulkPrice: firstTier ? `$${firstTier.price}` : `$${product.price}`,
                      quantity: 1,
                      img: ''
                    })}
                    className="flex-1 bg-gray-900 text-white font-bold py-2 rounded-md hover:bg-brandPrimary transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">🛒</span> Agregar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}