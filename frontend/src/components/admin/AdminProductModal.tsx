import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ApiProduct, Tier } from '../../types';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  productToEdit?: ApiProduct | null;
}

export default function AdminProductModal({ isOpen, onClose, onSave, productToEdit }: AdminProductModalProps) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del formulario básico
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    description: ''
  });

  // Estado para la tabla dinámica de reglas de mayoreo
  const [tiers, setTiers] = useState<Partial<Tier>[]>([]);



  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Si pasan un producto para editar, llenamos los campos
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        price: productToEdit.price.toString(),
        stock: productToEdit.stock.toString(),
        description: productToEdit.description || ''
      });
      setTiers(productToEdit.tiers || []);
      setPreviewUrl(productToEdit.image_url);
    } else {
      // Limpiar si es un producto nuevo
      setFormData({ name: '', sku: '', price: '', stock: '', description: '' });
      setTiers([]);
      setPreviewUrl(null);
    }
    setSelectedFile(null); // Limpiar selección de archivo al abrir el modal
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Manejadores de las Reglas de Mayoreo (Tiers)
  const addTier = () => setTiers([...tiers, { min_quantity: 2, price: '' }]);
  
  const removeTier = (index: number) => {
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    setTiers(newTiers);
  };

  const handleTierChange = (index: number, field: 'min_quantity' | 'price', value: string) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };



  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); 
        }
    };        

  // Enviar datos al Backend
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('sku', formData.sku);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('description', formData.description);
    
    tiers.forEach((tier, index) => {
      formDataToSend.append(`tiers[${index}][min_quantity]`, tier.min_quantity.toString());
      formDataToSend.append(`tiers[${index}][price]`, tier.price.toString());
    });

    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    if (productToEdit) {
      formDataToSend.append('_method', 'PUT');
    }


    const url = productToEdit 
      ? `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit.id}`
      : `${import.meta.env.VITE_API_URL}/admin/products`;

    try {
      const res = await fetch(url, {
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar el producto');

      onSave(); // Recargar la tabla
      onClose(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70  backdrop-blur-[3px] animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-3xl sticky top-0 z-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">


        {/* SECCIÓN 0: Imagen del Producto */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-48 h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <p className="text-xs text-gray-400 mt-2 font-bold">Sin imagen</p>
                </div>
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white font-bold text-sm">Cambiar Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Formatos: JPG, PNG, WEBP. Máx 2MB</p>
          </div>
          
          {/* SECCIÓN 1: Datos Básicos */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Información Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" placeholder="Ej. Salsa Macha Tradicional 250g" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">SKU (Código único)</label>
                <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium uppercase" placeholder="Ej. PAL-TRAD-250" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Actual (Piezas)</label>
                <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Precio Base (Al por menor)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500 font-bold">$</span>
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-bold text-gray-900" placeholder="0.00" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium resize-none" placeholder="Ingredientes, usos recomendados, etc." />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Reglas de Mayoreo (Tiers) */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Precios de Mayoreo (Opcional)</h3>
              <button type="button" onClick={addTier} className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">+ Agregar Regla</button>
            </div>
            
            {tiers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 italic">No hay descuentos por volumen. Se venderá siempre al precio base.</p>
            ) : (
              <div className="space-y-3">
                {tiers.map((tier, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-300 shadow-sm">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">A partir de (Piezas)</label>
                      <input required type="number" min="2" value={tier.min_quantity} onChange={e => handleTierChange(index, 'min_quantity', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-black font-bold" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nuevo Precio Unitario</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1.5 text-gray-500 font-bold">$</span>
                        <input required type="number" step="0.01" min="0" value={tier.price} onChange={e => handleTierChange(index, 'price', e.target.value)} className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-black font-bold text-green-700" />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeTier(index)} className="mt-5 text-red-400 hover:text-red-600 p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold text-white transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-[#333333] hover:bg-black'}`}>
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}