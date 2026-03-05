'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Check, MessageCircle } from 'lucide-react';
import { Product } from '@/types';

const productsData: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Oversized Hoodie Basic',
    description: 'Hoodie oversize de algodón premium con capucha ajustable. Perfecto para cualquier estación del año. Cuello redondo con cordón de ajuste. Bolsillo canguro frontal. Tejido suave y resistente.',
    price: 85000,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Rojo'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800'
    ],
    stock: 10,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  '2': {
    id: '2',
    name: 'Streetwear Tee',
    description: 'Camiseta urbana con corte clásico y gráficos exclusivos. Algodón orgánico de alta calidad. Print duradero',
    price: 45000,
    category: 'camisetas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Blanco'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    stock: 15,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  '3': {
    id: '3',
    name: 'Cargo Pants Urban',
    description: 'Pantalón cargo con múltiples bolsillos y corte relajado.',
    price: 120000,
    category: 'pants',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Negro', 'Verde militar'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
    stock: 8,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  '4': {
    id: '4',
    name: 'Windbreaker Jacket',
    description: 'Chaqueta cortavientos ligera, ideal para layering.',
    price: 150000,
    category: 'chaquetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Rojo', 'Gris'],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
    stock: 5,
    is_featured: true,
    created_at: new Date().toISOString()
  }
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const product = productsData[params.id];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white font-bold mb-4">Producto no encontrado</h1>
          <a href="/shop" className="text-red-500 hover:text-red-400">Volver a la tienda</a>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor selecciona talla y color');
      return;
    }
    addItem(product, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const generateWhatsAppMessage = () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor selecciona talla y color');
      return;
    }
    
    const message = `🛒 *Pedido Undroba Co.*\n\n*Producto:* ${product.name}\n*Talla:* ${selectedSize}\n*Color:* ${selectedColor}\n*Precio:* $${product.price.toLocaleString()}\n\nQuiero realizar este pedido.`;
    
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === idx ? 'border-red-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-red-500 text-sm uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-red-500 mt-4">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-gray-400 leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-white font-medium mb-3">Talla</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedSize === size
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-zinc-700 text-gray-400 hover:border-zinc-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedColor === color
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-zinc-700 text-gray-400 hover:border-zinc-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Agregado
                  </>
                ) : (
                  product.stock === 0 ? 'Agotado' : 'Agregar al carrito'
                )}
              </button>
              
              <button
                onClick={generateWhatsAppMessage}
                disabled={product.stock === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle size={20} />
                Pedir por WhatsApp
              </button>
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-orange-500 text-sm">
                ⚠️ Solo quedan {product.stock} unidades
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
