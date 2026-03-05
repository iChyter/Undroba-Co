import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const featuredProducts: Product[] = [
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
    description: 'Camiseta urbana con corte классический y gráficos exclusivos.',
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
  }
];

export default function Home() {
  return (
    <div>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-800 rounded-full blur-[96px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-white">UNDROBA</span>
            <span className="text-red-500">CO.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            Streetwear urbano para quienes definen su propio estilo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Ver colección
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/shop?category=hoodies"
              className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Hoodies
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">Destacados</h2>
            <Link href="/shop" className="text-red-500 hover:text-red-400 flex items-center gap-2">
              Ver todo <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Envíos a todo el país</h3>
              <p className="text-gray-400 text-sm">Recibe tu pedido en la puerta de tu casa</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Atención por WhatsApp</h3>
              <p className="text-gray-400 text-sm">Chatea con nosotros para pedidos rápidos</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Calidad premium</h3>
              <p className="text-gray-400 text-sm">Materiales de primera calidad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
