'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('undroba_admin');
    if (!admin) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('undroba_admin');
    router.push('/');
  };

  if (!isAuthorized) return null;

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Productos' },
    { href: '/admin/products/new', icon: Package, label: 'Nuevo producto' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-white">Undroba</span>
              <span className="text-red-500">Admin</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>

            <button
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 pb-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gray-400 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block py-3 text-gray-400 hover:text-red-500"
            >
              Salir
            </button>
          </div>
        )}
      </nav>

      <main className="pt-20 px-4 pb-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
