'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('undroba-cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('undroba-cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, size: string, color: string) => {
    setItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );
      
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.product.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
