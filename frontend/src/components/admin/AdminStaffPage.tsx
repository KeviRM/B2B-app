import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
  created_at: string;
}

interface Role {
  id: number;
  name: string;
}

export default function AdminStaffPage() {
  const { token, user: currentUser } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/staff`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      setStaff(data.staff || []);
      setRoles(data.roles || []);
    })
    .catch(err => console.error("Error de permisos o red", err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/staff`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear trabajador');
      
      alert('Trabajador agregado con éxito');
      setFormData({ name: '', email: '', password: '', role: '' }); 
      loadData(); // Recargar tabla
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar a este trabajador? Perderá acceso al sistema.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      loadData();
    } catch (err) {
      alert('No se pudo eliminar al trabajador.');
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-gray-500 animate-pulse">Cargando base de datos del personal...</div>;

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Personal y Accesos</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* TABLA DE PERSONAL (Izquierda) */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Equipo Activo</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-white">
                  <th className="py-4 px-6 font-bold">Nombre</th>
                  <th className="py-4 px-6 font-bold">Puesto / Rol</th>
                  <th className="py-4 px-6 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-800">
                {staff.map(member => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{member.name} {member.id === currentUser?.id && '(Tú)'}</div>
                      <div className="text-gray-500 text-xs">{member.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                        {member.roles[0]?.name || 'Sin Rol'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(member.id)}
                        disabled={member.id === currentUser?.id}
                        className={`font-bold transition-colors ${member.id === currentUser?.id ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                      >
                        Despedir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORMULARIO DE ALTA (Derecha) */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Registrar Trabajador</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña </label>
                <input required type="password" minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium" placeholder="Mínimo 8 caracteres" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Puesto Asignado</label>
                <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black font-medium bg-white">
                  <option value="" disabled>Selecciona un rol...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-white transition-colors mt-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#333333] hover:bg-black'}`}
              >
                {isSubmitting ? 'Registrando...' : '+ Dar de Alta'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}