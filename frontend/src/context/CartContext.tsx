// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  sku: string;
  name: string;
  price: string;
  bulkPrice: string;
  quantity: number;
  img: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean; // <-- Nuevo: ¿El panel está abierto?
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void; // <-- Nuevo: Para borrar cosas
  getTotalItems: () => number;
  openCart: () => void; // <-- Nuevo: Abrir panel
  closeCart: () => void; // <-- Nuevo: Cerrar panel
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

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeFromCart, getTotalItems, openCart, closeCart }}>
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