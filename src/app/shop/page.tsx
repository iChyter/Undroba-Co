'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const allProducts: Product[] = [
  {
    id: '1',
    name: 'Oversized Hoodie Basic',
    description: 'Hoodie oversize de algodón premium, perfecto para cualquier estación.',
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
    description: 'Camiseta urbana con corte clásico y gráficos exclusivos.',
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
    description: 'Pantalón cargo con múltiples bolsillos y corte relajado.',
    price: 120000,
    category: 'pants',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Negro', 'Verde militar'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'],
    stock: 8,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Windbreaker Jacket',
    description: 'Chaqueta cortavientos ligera, ideal para layering.',
    price: 150000,
    category: 'chaquetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Rojo', 'Gris'],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'],
    stock: 5,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Graphic Tee "Vision"',
    description: 'Camiseta con print exclusivo, algodón orgánico.',
    price: 55000,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500'],
    stock: 12,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Jogger Elite',
    description: 'Jogger de secado rápido, perfecto para cualquier actividad.',
    price: 95000,
    category: 'pants',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Gris'],
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500'],
    stock: 20,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Crop Hoodie',
    description: 'Hoodie crop moderno, combinación perfecta de estilo y comodidad.',
    price: 75000,
    category: 'hoodies',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Negro', 'Rosa', 'Gris'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'],
    stock: 7,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Oversized Tee',
    description: 'Camiseta oversize básica, tela suave y resistente.',
    price: 40000,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco', 'Gris'],
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'],
    stock: 25,
    is_featured: false,
    created_at: new Date().toISOString()
  }
];

const categories = [
  { value: 'all', label: 'Todos' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'pants', label: 'Pants' },
  { value: 'chaquetas', label: 'Chaquetas' }
];

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-low', label: 'Precio: menor a mayor' },
  { value: 'price-high', label: 'Precio: mayor a menor' }
];

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = allProducts
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      const matchesMinPrice = !minPrice || p.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || p.price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Tienda</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Filtros
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Buscar</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar producto..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Categoría</label>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          category === cat.value
                            ? 'bg-red-600 text-white'
                            : 'text-gray-400 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Precio</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                {filteredProducts.length} productos
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No se encontraron productos</p>
                <button
                  onClick={() => { setSearch(''); setCategory('all'); setMinPrice(''); setMaxPrice(''); }}
                  className="mt-4 text-red-500 hover:text-red-400"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
