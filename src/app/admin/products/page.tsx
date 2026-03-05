'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product } from '@/types';

const productsData: Product[] = [
  {
    id: '1',
    name: 'Oversized Hoodie Basic',
    description: 'Hoodie oversize de algodón premium',
    price: 85000,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Rojo'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
    stock: 10,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Streetwear Tee',
    description: 'Camiseta urbana con corte clásico',
    price: 45000,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Blanco'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    stock: 15,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Cargo Pants Urban',
    description: 'Pantalón cargo con múltiples bolsillos',
    price: 120000,
    category: 'pants',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Negro', 'Verde militar'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'],
    stock: 8,
    is_featured: true,
    created_at: new Date().toISOString()
  }
];

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(productsData);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, is_featured: !p.is_featured } : p
    ));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Producto</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Categoría</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Precio</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Stock</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Destacado</th>
                <th className="text-right text-gray-400 text-sm px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-500 text-sm truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 capitalize">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-white">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-green-500'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        product.is_featured ? 'bg-red-600/20 text-red-500' : 'bg-zinc-800 text-gray-500'
                      }`}
                    >
                      {product.is_featured ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-zinc-800 hover:bg-red-900/50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
