// src/components/HomePageContent.tsx
// ¡Asegúrate de tener tus imágenes en src/assets!
import camioneta from './assets/camioneta.png'; 
import atencion from './assets/icon1.png'; // Reemplaza con tus iconos reales
import ubicacion from './assets/icon2.png';
import heroImg from './assets/salsa-macha.png';

import { NavLink } from 'react-router-dom';

// --- Datos Simulados ---
const infoCards = [
  {
    id: 1,
    title: 'Cobertura',
    description: 'hacemos entregas en toda la ciudad de Apizaco y alrededores.',
    // Icono SVG de Camión
    icon: 
    <img src={ubicacion} alt="Cobertura" className="w-16 h-16" />,
  },
  {
    id: 2,
    title: 'Tiempos',
    description: 'Tiempo de entrega en menos de 24 horas',
    // Icono SVG de Billete/Precio
    icon:
    <img src={camioneta} alt="Hero"  /> 
 },
  {
    id: 3,
    title: 'Atención Personalizada',
    description: 'Siempre disponibles para atenderte.',
    // Icono SVG de Soporte
    icon:
    <img src={atencion} alt="Atención Personalizada" className="w-16 h-16" />
}
];

const bestSellers = [
  { id: 1, name: 'Caja de Aceite 1L', price: '$450.00', img: 'a' },
  { id: 2, name: 'Saco de Azúcar 50kg', price: '$1,200.00', img: 'b' },
  { id: 3, name: 'Caja de Leche Entera', price: '$240.00', img: 'c' },
  { id: 4, name: 'Papel Higiénico 40pz', price: '$180.00', img: 'd' },
  { id: 5, name: 'Frijol Pinto 25kg', price: '$850.00', img: 'f' },
];

export default function HomePageContent() {
  return (
    <div className="w-full bg-white">
      
      {/* 1. SECCIÓN HERO (Nombre, Eslogan, Botón e Imagen) */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Nombre del Negocio
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-medium">
                Surtimos tu negocio con los mejores precios de mayoreo, 
              directo a tu puerta y con la confianza de siempre.
            </p>

            <NavLink to="/catalogo">
              <button  className="bg-brandPrimary text-white font-bold px-8 py-4 rounded-md shadow-md hover:bg-blue-800 transition-colors">
                IR AL CATÁLOGO
              </button>
            </NavLink>
            
          </div>
          <div className="flex-1 flex justify-center">
            {/* Si no tienes la imagen a la mano, se mostrará este recuadro gris temporal */}
            <div className="w-full max-w-md h-80 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
               <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TARJETAS DE INFORMACIÓN */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoCards.map((card) => (
              <div key={card.id} className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gray-50 text-center flex flex-col items-center">
                <div className="w-16 h-16  text-white rounded-full flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MAPA DE UBICACIÓN */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Nuestra Ubicación</h2>
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            {/* Iframe de Google Maps apuntando a Apizaco */}
            <iframe 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              allowFullScreen 
              src="https://maps.google.com/maps?q=Apizaco,Tlaxcala&t=&z=14&ie=UTF8&iwloc=&output=embed">
            </iframe>
          </div>
        </div>
      </section>

      {/* 4. CARRUSEL DE PRODUCTOS MÁS VENDIDOS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Productos Más Vendidos</h2>
            <a href="#" className="text-brandPrimary font-semibold hover:underline hidden md:block">Ver todos &rarr;</a>
          </div>
          
          {/* Contenedor con scroll horizontal para el carrusel */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 custom-scrollbar">
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[250px] md:min-w-[280px] snap-start bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-brandPrimary transition-colors flex flex-col">
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-5xl mb-4">
                  {product.img}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                <p className="text-brandSuccess font-extrabold text-xl mt-auto pt-2">{product.price}</p>
                <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded font-medium hover:bg-black">
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}