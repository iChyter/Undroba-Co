'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1 text-2xl font-bold">
            <span className="text-white">Undroba</span>
            <span className="text-red-500">Co.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">Tienda</Link>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            <button 
              className="md:hidden p-2 text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-red-900/30">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Inicio</Link>
            <Link href="/shop" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Tienda</Link>
            <Link href="/admin" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
