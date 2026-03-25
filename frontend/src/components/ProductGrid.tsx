
import { useCart } from '../context/CartContext';



const products = [
    { id: 1, sku: 'ABR-001', name: 'Aceite Vegetal 1-2-3 (Caja 12 pz)', price: '$450.00', bulkPrice: '$420.00', img: 'a' },
    { id: 2, sku: 'LAC-045', name: 'Leche Alpura Clásica 1L (Caja 12 pz)', price: '$260.00', bulkPrice: '$240.00', img: 'b' },
    { id: 3, sku: 'LIM-089', name: 'Cloro Magia Blanca 1L (Caja 15 pz)', price: '$190.00', bulkPrice: '$175.00', img: 'c' },
    { id: 4, sku: 'BEB-102', name: 'Coca-Cola Retornable 2.5L (Caja 8 pz)', price: '$320.00', bulkPrice: '$300.00', img: 'd' },
    { id: 5, sku: 'ABR-022', name: 'Azúcar Estándar (Bulto 50kg)', price: '$1,250.00', bulkPrice: '$1,200.00', img: 'e' },
    { id: 6, sku: 'DES-005', name: 'Vaso Térmico #8 (Paquete 500 pz)', price: '$340.00', bulkPrice: '$310.00', img: 'f' },
];

export default function ProductGrid() {
    const { addToCart } = useCart();
    return (
        <div className="flex-1">
      {/* Barra superior de herramientas (Buscador y Ordenar) */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-1/2 relative">
          <input 
            type="text" 
            placeholder="Buscar por nombre o SKU..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">B</span>
        </div>
        <select className="border border-gray-300 text-gray-700 rounded-md py-2 px-4 outline-none focus:ring-2 focus:ring-brandPrimary">
          <option>Ordenar por: Relevancia</option>
          <option>Precio: Menor a Mayor</option>
          <option>Precio: Mayor a Menor</option>
          <option>Más vendidos</option>
        </select>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
            {/* Imagen simulada */}
            <div className="h-48 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
              {product.img}
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <span className="text-xs text-gray-400 font-mono mb-1">SKU: {product.sku}</span>
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-4">{product.name}</h3>
              
              {/* Bloque de Precios B2B */}
              <div className="mt-auto bg-gray-50 p-3 rounded-md border border-gray-100 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Precio Unitario:</span>
                  <span className="text-sm text-gray-500 line-through">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-brandPrimary">Precio Mayoreo (+5 cjs):</span>
                  <span className="text-xl font-extrabold text-brandSuccess">{product.bulkPrice}</span>
                </div>
              </div>

              {/* Controles de Carrito */}
              <div className="flex gap-2">
                <input 
                  type="number" 
                  defaultValue="1" 
                  min="1" 
                  className="w-20 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-brandPrimary outline-none"
                />
                
                <button 
                    onClick={() => addToCart({ ...product, quantity: 1 })} // <-- Esta es la magia
                    className="flex-1 bg-gray-900 text-white font-bold py-2 rounded-md hover:bg-brandPrimary transition-colors flex justify-center items-center"
                    >
                    <span className="mr-2">🛒</span> Agregar
                </button>   


              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}