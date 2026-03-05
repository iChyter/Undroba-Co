'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@undroba.com' && password === 'undroba2024') {
      localStorage.setItem('undroba_admin', 'true');
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      
      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-white">Undroba</span>
              <span className="text-red-500">Co.</span>
            </h1>
            <p className="text-gray-400 mt-2">Panel de Administración</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@undroba.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-gray-400 text-sm">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
