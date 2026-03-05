'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();

  const generateWhatsAppMessage = () => {
    let message = '🛒 *Nuevo pedido de Undroba Co.*\n\n';
    message += '*Productos:*\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   - Talla: ${item.selectedSize}\n`;
      message += `   - Color: ${item.selectedColor}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: $${(item.product.price * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `*Total: $${total.toLocaleString()}*\n\n`;
    message += 'Por favor confirma tu pedido.';
    
    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    const phoneNumber = '1234567890';
    const url = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 z-50"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <ShoppingBag size={20} />
                Carrito ({items.length})
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-zinc-700 mb-4" />
                  <p className="text-gray-400">Tu carrito está vacío</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 text-red-500 hover:text-red-400"
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="flex gap-4 bg-zinc-800/50 p-3 rounded-lg">
                    <div className="relative w-20 h-20 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{item.product.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {item.selectedSize} / {item.selectedColor}
                      </p>
                      <p className="text-red-500 font-bold mt-1">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1 bg-zinc-700 rounded hover:bg-zinc-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-1 bg-zinc-700 rounded hover:bg-zinc-600"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="ml-auto p-1 text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-zinc-800 space-y-4">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-red-500">${total.toLocaleString()}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Pedir por WhatsApp
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-white text-sm py-2"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
