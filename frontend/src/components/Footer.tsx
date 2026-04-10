// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t-4 border-brandPrimary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 1. Logo y Acerca de */}
        <div className="md:col-span-1">
          <h3 className="text-white text-2xl font-extrabold mb-4 tracking-tight">Name</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Tu aliado estratégico en distribución. Abastecemos tu negocio con los mejores precios y tiempos de entrega garantizados.
          </p>
        </div>

        {/* 2. Enlaces Rápidos */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-brandPrimary transition-colors">Inicio</a></li>
            <li><a href="#" className="hover:text-brandPrimary transition-colors">Catálogo de Productos</a></li>
            <li><a href="#" className="hover:text-brandPrimary transition-colors">Mis Compras y Pedidos</a></li>
            <li><a href="#" className="hover:text-brandPrimary transition-colors">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* 3. Información de Contacto */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Atención al Cliente</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">Ubi:</span>
              <span>Sucursal 1 - Calle 24 de Septiembre #12,<br/> Apizaco, Tlaxcala.</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">Tel:</span>
              <span>+52 (241) 123 4567</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2"></span>
              <span>ventas@distribuidora.com</span>
            </li>
          </ul>
        </div>

        {/* 4. Horarios */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Horarios de Entrega</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Lunes a Viernes: 8:00 AM - 6:00 PM</li>
            <li>Sábados: 8:00 AM - 2:00 PM</li>
            <li>Domingos: Cerrado</li>
          </ul>
        </div>

      </div>

      {/* Derechos de Autor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        <p>&copy; 2026 Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}