// src/components/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();



  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();


      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          throw new Error(firstError[0]);
        }
        throw new Error(data.message || 'Error al registrar la cuenta');
      }


      login(data.token, data.user); // Auto-login tras registro exitoso
      navigate('/catalogo');
    } catch (err: any) {
      setError(err.message);
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-block text-5xl mb-4"></Link>
        <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Únete a nuestra plataforma
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nombre Completo / Razón Social
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                placeholder="Ej. Abarrotes La Esperanza"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Teléfono (Para verificación SMS)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="+52 (246) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded cursor-pointer mt-0.5"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                    He leído y acepto los{' '}
                    <a href="#" className="text-[#1E40AF] hover:underline">Términos y Condiciones</a>
                    {' '}y la{' '}
                    <a href="#" className="text-[#1E40AF] hover:underline">Política de Privacidad</a>.
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#1E40AF] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E40AF] transition-colors mt-6"
            >
              Registrar Negocio
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta corporativa?{' '}
              <Link to="/login" className="font-bold text-[#1E40AF] hover:text-blue-800">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}