import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'ecommerce-beauty-cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.quantity) }
            : item
        );
      }
      
      return [...current, { product, quantity: Math.min(quantity, product.quantity) }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(current => current.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(current =>
      current.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.quantity) };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const getOriginalTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return total + (originalPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  const getTotalSavings = useCallback(() => {
    return getOriginalTotalPrice() - getTotalPrice();
  }, [getOriginalTotalPrice, getTotalPrice]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return {
    cartItems,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getOriginalTotalPrice,
    getTotalSavings,
    openCart,
    closeCart,
  };
};
