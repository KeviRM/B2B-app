// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import type{ Tier } from '../types';

export interface CartItem {
  id: number;
  sku: string;
  name: string;
  price: string;
  bulkPrice?: string;
  quantity: number;
  img: string;
  tiers?: Tier[];
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean; 
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void; 
  getTotalItems: () => number;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void; 
  closeCart: () => void; 

}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });
    openCart();
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };


  const clearCart = () => {
    setCart([]);
  };

  

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeFromCart, getTotalItems, updateQuantity, clearCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}