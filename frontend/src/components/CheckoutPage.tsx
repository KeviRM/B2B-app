// src/components/CheckoutPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type{ ApiAddress } from '../types';

import MPLogo from '../assets/MP_Logo.svg';

import { STORE_CONFIG } from '../config/store';

import { CardPayment} from '@mercadopago/sdk-react';

import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: 'es-MX'
});



export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();

  // Estados UI y Formularios
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'transferencia' | 'oxxo'>('tarjeta');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false); 

  // Estados de Direcciones
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);


  

  //  Proteger la ruta
  useEffect(() => {
    if (!user || !token) navigate('/login');
    else if (cart.length === 0 && !isSuccess) navigate('/carrito');
  }, [user, token, cart, navigate, isSuccess]);

  //  Traer las direcciones del usuario desde Laravel
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      })
      .then(res => res.json())
     .then(data => {
        if (Array.isArray(data)) {
          setAddresses(data);
          const defaultAddr = data.find(a => a.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setOrderNotes(defaultAddr.references || ''); 
          } else if (data.length > 0) {
            setSelectedAddressId(data[0].id);
            setOrderNotes(data[0].references || ''); 
          }
        }
      })
      .catch(err => console.error("Error cargando direcciones:", err))
      .finally(() => setLoadingAddresses(false));
    }
  }, [token]);



  const formatCurrency = (amount: string | number) => {
    return '$' + parseFloat(amount.toString()).toFixed(2);
  };
  

  const getNumericPrice = (priceStr: string) => parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;

  const getCurrentPrice = (item: any) => {
    let currentPrice = getNumericPrice(item.price); 
    if (item.tiers && item.tiers.length > 0) {
      const applicableTier = [...item.tiers]
        .filter((t: any) => item.quantity >= t.min_quantity)
        .sort((a: any, b: any) => b.min_quantity - a.min_quantity)[0];
      if (applicableTier) currentPrice = parseFloat(applicableTier.price);
    } else if (item.bulkPrice && item.quantity >= 12) {
      currentPrice = getNumericPrice(item.bulkPrice);
    }
    return currentPrice;
  };

  const subtotal = cart.reduce((total, item) => {
    const priceToUse = getCurrentPrice(item);
    return total + (priceToUse * item.quantity);
  }, 0);

  const FREE_SHIPPING_THRESHOLD = STORE_CONFIG.FREE_SHIPPING_THRESHOLD;
  const envio = subtotal >= FREE_SHIPPING_THRESHOLD ? STORE_CONFIG.DISCOUNT_SHIPPING : STORE_CONFIG.BASE_SHIPPING_COST;
  const total = subtotal + envio;

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Por favor selecciona una dirección de entrega.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {

      if(clearCart) clearCart();
      navigate('/perfil'); 
    }, 2000);
  };


  // --- MEMOIZACIÓN PARA EVITAR QUE MERCADO PAGO COLAPSE ---
  const mpInitialization = useMemo(() => {
    return { amount: total };
  }, [total]); 

  const mpCustomization = useMemo(() => {
    return {
      visual: {
        style: {
          theme: 'default',
          customVariables: {
            textPrimaryColor: '#111827',
            baseColor: '#1E40AF',
          }
        }
      }
    };
  }, []); 


  const handleCardPaymentSubmit = async (formData: any) => {
    
    if (!selectedAddressId) {
      alert("Por favor selecciona una dirección de entrega antes de pagar.");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Datos seguros de la tarjeta generados por MP:", formData);
    
      const orderPayload = {
        address_id: selectedAddressId,
        payment_method: 'tarjeta',
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        notes: orderNotes,
        mp_payment_data: formData 
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {


        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Error al procesar el pago');
      setIsSuccess(true);
      if(clearCart) clearCart();
      navigate('/perfil');
    } catch (error: any) {
      alert(error.message);
    }
      finally {
      setIsProcessing(false);
    }
  };

  

  if (!user || cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* Cabecera y Botón de Volver */}
      <div className="flex items-center mb-10 relative">
        <Link to="/carrito" className="absolute left-0 flex items-center text-gray-600 hover:text-black font-semibold">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <div className="text-xs text-left leading-tight">
            <span>Volver a</span><br /><span>Carrito</span>
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-center w-full text-gray-900">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/*  Formularios */}
        <div className="flex-1">
          
          {/* Direcciones y Referencias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            
            {/* Direcciones  */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dirección de Entrega</h2>
              <div className="space-y-4 mb-6">
                
                {loadingAddresses ? (
                  <p className="text-gray-500 animate-pulse">Cargando sucursales...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-red-500 font-medium text-sm">
                    No tienes direcciones. <Link to="/perfil" className="underline font-bold hover:text-red-700">Agrégala en tu perfil</Link>.
                  </p>
                ) : (
                  addresses.map((addr) => (
                    <label key={addr.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="address" 
                        checked={selectedAddressId === addr.id}
                        onChange={() => {
                          setSelectedAddressId(addr.id);
                          setOrderNotes(addr.references || ''); 
                        }}
                        className="w-6 h-6 text-blue-500 border-gray-300 focus:ring-blue-500" 
                      />
                      <span className="text-gray-800 font-medium group-hover:text-black line-clamp-2">
                         {addr.street_and_number}, {addr.neighborhood}
                      </span>
                    </label>
                  ))
                )}
                
              </div>
              <Link to="/perfil" className="inline-block px-6 py-2 border border-gray-400 rounded-lg text-gray-800 font-bold hover:bg-gray-50 transition-colors">
                + Agrega nueva dirección
              </Link>
            </div>

            {/* Referencias */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Referencias para el repartidor</h2>
              <textarea 
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full h-32 p-4 border border-gray-400 rounded-xl resize-y outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="Ej. Portón blanco, frente al parque..."
              ></textarea>
            </div>
          </div>

          {/* Fila Inferior: Método de Pago */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Método de Pago</h2>
            
            {/* Botones de Selección */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setPaymentMethod('tarjeta')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'tarjeta' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Tarjeta
              </button>
              <button 
                onClick={() => setPaymentMethod('transferencia')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'transferencia' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Transferencia
              </button>
              <button 
                onClick={() => setPaymentMethod('oxxo')}
                className={`flex-1 py-3 rounded-full font-bold transition-colors ${paymentMethod === 'oxxo' ? 'bg-[#2D2D2D] text-white' : 'border border-gray-400 text-gray-800 hover:bg-gray-50'}`}
              >
                Oxxo
              </button>
            </div>

            {/* Formulario Dinámico: Solo se muestra si es Tarjeta */}
            {paymentMethod === 'tarjeta' && (
              
              <div className="animate-[fadeIn_0.3s_ease-out] border border-gray-200 rounded-xl p-1">



                {isProcessing && (
                  <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-bold text-gray-800 text-xl mb-1">Procesando pago...</p>
                    <p className="text-sm text-gray-500 font-medium">Por favor, no cierres esta ventana</p>
                  </div>
                )}


                <CardPayment
                  initialization={mpInitialization} 
                  onSubmit={handleCardPaymentSubmit}
                  customization={mpCustomization}
                     
                />
              </div>

            )}


            {paymentMethod !== 'tarjeta' && (
              <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || !selectedAddressId}
              className={`w-full text-white font-bold text-2xl py-5 rounded-2xl transition-colors mb-6 tracking-wide flex flex-col items-center ${isProcessing || !selectedAddressId ? 'bg-gray-400 cursor-not-allowed' : 'bg-brandSuccess hover:bg-green-700'}`}
              >
                <span>{isProcessing ? 'Procesando...' : 'Confirmar Pedido'}</span>
                <span> $ {total.toFixed(2)} </span>

              </button>
            )
            }

            {/* Mensajes para otros métodos */}
            {paymentMethod === 'transferencia' && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-gray-700 font-medium">Al confirmar tu pedido, te generaremos una cuenta CLABE única para que realices tu transferencia SPEI desde la app de tu banco.</p>
              </div>
            )}
            {paymentMethod === 'oxxo' && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-gray-700 font-medium">Al confirmar tu pedido, te daremos un código de barras. Podrás ir a cualquier tienda OXXO a pagar en efectivo.</p>
              </div>
            )}

          </div>

        </div>

        {/* COLUMNA DERECHA: Resumen */}
        <div className="w-full lg:w-96 lg:border-l-2 lg:border-gray-400 lg:pl-10 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Resumen</h2>
          
          {/* Lista Dinámica de Productos del Checkout */}
          <div className="mb-8 border-b border-gray-300 pb-6 space-y-3">
            {cart.map((item) => {
              const itemTotal = getCurrentPrice(item) * item.quantity;
               return (
                <div key={item.id} className="flex justify-between items-center text-gray-800 font-bold mb-3">
                  <span className="truncate w-1/2" title={item.name}>- {item.name}</span>
                  <span className="text-sm">x {item.quantity}</span>
                  <span>${itemTotal.toFixed(2)}</span>
                </div>
               );
            })}
          </div>
          
          <div className="space-y-4 text-lg font-bold text-gray-900 mb-6">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Subtotal</span>
              <span className="font-normal text-gray-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span>Envío</span>
              <div className="text-right">
                {envio === STORE_CONFIG.DISCOUNT_SHIPPING ? (
                <>
                  {/* Precio base tachado */}
                  <span className="text-gray-400 line-through text-sm font-medium">
                    {formatCurrency(STORE_CONFIG.BASE_SHIPPING_COST)}
                  </span>
                  {/* Costo con descuento */}
                  <span className="text-[#d17a7a]">{formatCurrency(envio)}</span>
                </>
              ) : (
                /* Costo normal sin tachar nada */
                <span className="text-[#d17a7a]">{formatCurrency(envio)}</span>
              )}
              </div>
            </div>
            <div className="flex justify-between items-center text-xl pt-2">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing || !selectedAddressId}
            className={`w-full text-white font-bold text-2xl py-5 rounded-2xl transition-colors mb-6 tracking-wide flex flex-col items-center ${isProcessing || !selectedAddressId ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#16A34A] hover:bg-green-700'}`}
          >
            <span>{isProcessing ? 'Procesando...' : 'Confirmar y Pagar'}</span>
            <span>${total.toFixed(2)}</span>
          </button> */}

          {!selectedAddressId && addresses.length > 0 && (
            <p className="text-red-500 text-sm font-bold text-center -mt-4 mb-4">Selecciona una dirección para continuar</p>
          )}

          {/* Sellos de Confianza */}
          <div className="flex justify-center items-center gap-6 mt-2">
            <div className="flex items-center text-gray-600 font-bold text-sm">
              <svg className="w-10 h-10 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Pago 100%<br/>seguro</span>
            </div>
             <div className="flex justify-center items-center text-blue-500 font-bold text-xl">
              
                 <img src={MPLogo} alt="Mercado Pago" className='w-sm h-sm' />
                  
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}