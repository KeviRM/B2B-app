import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Enlaces del menú (Luego ocultaremos "Personal" si no es el dueño)
  const navLinks = [
    { path: '/admin/ordenes', label: 'Gestión de Órdenes', icon: '' },
    { path: '/admin/catalogo', label: 'Catálogo y Precios', icon: '' },
    { path: '/admin/personal', label: 'Personal y Accesos', icon: '' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR FIJO */}
      <aside className="w-64 bg-[#333333] text-white flex flex-col shrink-0 shadow-xl z-10">
        <div className="p-6 text-center border-b border-gray-600 mt-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black font-extrabold text-3xl mx-auto mb-4 shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-bold text-lg leading-tight">{user.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Panel de Administración</p>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-3 flex items-center gap-4 font-bold transition-colors ${
                  isActive 
                    ? 'bg-black border-l-4 border-green-500 text-white' 
                    : 'hover:bg-[#444444] text-gray-300 border-l-4 border-transparent'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-600">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white rounded-xl transition-colors font-bold text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO CENTRAL DINÁMICA */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}