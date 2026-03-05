'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'pants', label: 'Pants' },
  { value: 'chaquetas', label: 'Chaquetas' },
  { value: 'accesorios', label: 'Accesorios' }
];

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hoodies',
    stock: '',
    is_featured: false
  });
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<string[]>(['Negro']);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    alert('Producto creado correctamente');
    router.push('/admin/products');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Nuevo Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Información del Producto</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Nombre del producto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Precio</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Tallas y Colores</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-3 block">Tallas</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sizes.map(size => (
                    <span key={size} className="bg-zinc-800 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                      {size}
                      <button type="button" onClick={() => handleRemoveSize(size)} className="text-gray-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Agregar talla"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-3 block">Colores</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colors.map(color => (
                    <span key={color} className="bg-zinc-800 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                      {color}
                      <button type="button" onClick={() => handleRemoveColor(color)} className="text-gray-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Agregar color"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Imágenes</h2>
            
            <div className="space-y-3 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL de imagen"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg"
              >
                <Upload size={18} />
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Pega la URL de la imagen (ej: de Unsplash)
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
              />
              <span className="text-white">Producto destacado</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-4 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
