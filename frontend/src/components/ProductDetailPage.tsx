// src/components/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type{ ApiProduct } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Por ahora traemos todos y filtramos (luego haremos un endpoint individual en Laravel)
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then((data: ApiProduct[]) => {
        const found = data.find(p => p.id === Number(id));
        if (found) {
          setProduct(found);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error conectando con la API:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex-1 flex justify-center items-center h-96"><div className="text-xl font-bold text-gray-500 animate-pulse">Cargando producto...</div></div>;
  if (!product) return <div className="flex-1 flex justify-center items-center h-96"><div className="text-xl font-bold text-red-500">Producto no encontrado</div></div>;

  // --- LÓGICA DE PRECIOS ESCALONADOS ---
  const basePrice = parseFloat(product.price);
  
  // Función para obtener el precio actual según la cantidad
  const getCurrentPrice = () => {
    let current = basePrice;
    // Asumimos que los tiers vienen ordenados de menor a mayor
    product.tiers.forEach(tier => {
      if (quantity >= tier.min_quantity) {
        current = parseFloat(tier.price);
      }
    });
    return current;
  };

  const currentPrice = getCurrentPrice();
  const total = currentPrice * quantity;

  // Función para construir las filas de la tabla de descuentos
  const buildTierRows = () => {
    const rows = [];
    
    // Fila 1: Precio Base
    const nextTierQty = product.tiers.length > 0 ? product.tiers[0].min_quantity : null;
    rows.push({
      label: nextTierQty ? `1 - ${nextTierQty - 1} piezas` : '1+ piezas',
      price: basePrice,
      savings: '--',
      isActive: quantity >= 1 && (!nextTierQty || quantity < nextTierQty)
    });

    // Filas de Mayoreo
    product.tiers.forEach((tier, index) => {
      const nextTier = product.tiers[index + 1];
      const tierPrice = parseFloat(tier.price);
      const savingsPercent = Math.round(((basePrice - tierPrice) / basePrice) * 100);
      
      rows.push({
        label: nextTier ? `${tier.min_quantity} - ${nextTier.min_quantity - 1} piezas` : `${tier.min_quantity} - 50+ piezas`,
        price: tierPrice,
        savings: `${savingsPercent}%`,
        isActive: quantity >= tier.min_quantity && (!nextTier || quantity < nextTier.min_quantity)
      });
    });

    return rows;
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: `$${basePrice.toFixed(2)}`,
      bulkPrice: `$${currentPrice.toFixed(2)}`,
      quantity: quantity,
      img: 'x' // Emoji temporal hasta que tengamos imágenes
    });
    // Opcional: Redirigir al catálogo después de agregar
     navigate('/catalogo'); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* Botón Volver */}
      <div className="mb-8 relative">
        <Link to="/catalogo" className="inline-flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <div className="text-xs text-left leading-tight">
            <span>Volver a</span><br /><span>Catalogo</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* COLUMNA IZQUIERDA: Imágenes */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Imagen Principal */}
          <div className="w-full aspect-square bg-[#666666] text-white flex items-center justify-center text-4xl font-bold tracking-widest relative">
             <span className="transform -rotate-45 absolute opacity-50">IMAGEN</span>
          </div>
          {/* Miniaturas */}
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-24 bg-[#666666] shrink-0"></div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Info y Compra */}
        <div className="w-full md:w-1/2 flex flex-col">
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-800 mb-8 tracking-wide">
            <span>SKU: {product.sku}</span>
            <span className="text-gray-300">|</span>
            <span>STOCK: {product.stock} piezas</span>
          </div>

          {/* Tabla de Precios Escalonados */}
          <div className="mb-6">
            <div className="grid grid-cols-3 text-center text-sm font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-2">
              <div>Cantidad</div>
              <div>Precio Unitario</div>
              <div>Ahorro</div>
            </div>
            <div className="space-y-1">
              {buildTierRows().map((row, idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-3 text-center py-3 text-sm font-bold transition-colors ${row.isActive ? 'bg-[#999999] text-white' : 'text-gray-800 hover:bg-gray-50'}`}
                >
                  <div>{row.label}</div>
                  <div>${row.price.toFixed(2)} c/u</div>
                  <div>{row.savings}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">El descuento se aplica automáticamente al agregar la cantidad</p>
          </div>

          {/* Selector de Cantidad */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-bold text-gray-900">Ingresa Cantidad:</span>
            <div className="flex items-center border-2 border-gray-800 rounded-md overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-1.5 font-bold text-xl text-gray-800 hover:bg-gray-100">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-bold text-xl text-gray-900 border-x-2 border-gray-800 py-1.5 outline-none" 
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-1.5 font-bold text-xl text-gray-800 hover:bg-gray-100">+</button>
            </div>
            <span className="font-bold text-gray-900">piezas.</span>
          </div>

          {/* Botón Agregar */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#2D2D2D] text-white font-bold text-xl py-4 rounded-full hover:bg-black transition-colors mb-10"
          >
            Agregar al Carrito
          </button>

          {/* Cálculo de Total Dinámico */}
          <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-10 border-b border-gray-300 pb-10">
            <span>Total:</span>
            <span className="font-medium text-xl">{quantity} pza x ${currentPrice.toFixed(2)} = </span>
            <span className="text-[#16A34A]">${total.toFixed(2)}</span>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-800 text-sm leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}