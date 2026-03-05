'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder.jpg';

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-900/50 transition-colors"
      >
        <div className="relative aspect-square bg-zinc-800 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-red-500 font-bold">Agotado</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium truncate">{product.name}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="text-red-500 font-bold text-lg mt-2">
            ${product.price.toLocaleString()}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {product.sizes?.slice(0, 4).map(size => (
              <span key={size} className="text-xs bg-zinc-800 text-gray-400 px-2 py-1 rounded">
                {size}
              </span>
            ))}
            {product.sizes?.length > 4 && (
              <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
