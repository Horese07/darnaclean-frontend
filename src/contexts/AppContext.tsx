import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  featured: boolean;
  onSale: boolean;
  badges: string[];
  specifications: any;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Category {
  id: number;
  name: { [key: string]: string };
  slug: string;
  description: { [key: string]: string };
  image: string;
  featured: boolean;
  subcategories: Array<{
    id: number;
    name: { [key: string]: string };
    slug: string;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface AppState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  user: User | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    subcategory?: string;
    brand?: string;
    priceRange?: [number, number];
    onSale?: boolean;
    inStock?: boolean;
  };
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
  hero?: {
    title: string;
    description: string;
    cta: string;
  };
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'SET_SORT_BY'; payload: AppState['sortBy'] }
  | { type: 'SET_HERO'; payload: { title: string; description: string; cta: string } };

const initialState: AppState = {
  products: [],
  categories: [],
  cart: [],
  user: null,
  loading: false,
  error: null,
  filters: {},
  sortBy: 'newest',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'SET_HERO':
      return { ...state, hero: action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getFilteredProducts: () => Product[];
  // Auth
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  // Admin
  adminLogin: (email: string, password: string) => Promise<User>;
  // Commandes
  createOrder: (orderData: any) => Promise<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  // Authentification utilisateur
  const login = async (email: string, password: string) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    console.log('[LOGIN] Attempting login with:', email);
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log('[LOGIN] Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[LOGIN] Error response:', errorText);
      throw new Error('Identifiants invalides');
    }
    const data = await res.json();
    console.log('[LOGIN] Success, user:', data.user);
    localStorage.setItem('darnaclean-token', data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data.user;
  };

  const register = async (registerData: any) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    console.log('[REGISTER] Attempting register with:', registerData);
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    console.log('[REGISTER] Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[REGISTER] Error response:', errorText);
      throw new Error('Erreur lors de l\'inscription');
    }
    const data = await res.json();
    console.log('[REGISTER] Success, user:', data.user);
    localStorage.setItem('darnaclean-token', data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data.user;
  };

  const logout = async () => {
    const token = localStorage.getItem('darnaclean-token');
    if (token) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      console.log('[LOGOUT] Logging out user');
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('darnaclean-token');
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  // Authentification admin (exemple, à adapter selon votre API)
  const adminLogin = async (email: string, password: string) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    console.log('[ADMIN LOGIN] Attempting admin login with:', email);
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, is_admin: true })
    });
    console.log('[ADMIN LOGIN] Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[ADMIN LOGIN] Error response:', errorText);
      throw new Error('Identifiants admin invalides');
    }
    const data = await res.json();
    console.log('[ADMIN LOGIN] Success, user:', data.user);
    localStorage.setItem('darnaclean-token', data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data.user;
  };

  // Load data on mount and when language changes
  useEffect(() => {
    loadData();
  }, [i18n.language]);

  // Synchronisation du panier avec l'API backend si utilisateur connecté
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('darnaclean-token');
      if (!token) return;
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${apiBase}/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const cartItems = await res.json();
          if (Array.isArray(cartItems)) {
            cartItems.forEach((item: CartItem) => {
              dispatch({ type: 'ADD_TO_CART', payload: item });
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier backend:', error);
      }
    };
    fetchCart();
  }, [state.user]);

  // Sauvegarde du panier côté backend à chaque modification (si connecté)
  useEffect(() => {
    const saveCart = async () => {
      const token = localStorage.getItem('darnaclean-token');
      if (!token) return;
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        await fetch(`${apiBase}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(state.cart)
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier backend:', error);
      }
    };
    saveCart();
  }, [state.cart, state.user]);

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      console.log('[LOAD DATA] Fetching products from', `${apiBase}/products`);
      // Charger les produits depuis l'API Laravel
      const productsResponse = await fetch(`${apiBase}/products?lang=${i18n.language}`);
      console.log('[LOAD DATA] Products response status:', productsResponse.status);
      if (!productsResponse.ok) {
        const errorText = await productsResponse.text();
        console.error('[LOAD DATA] Products error:', errorText);
        throw new Error('Erreur API produits');
      }

      const productsJson = await productsResponse.json();
      // Pour API: { success, data: { products: [...] } }
      let products: any[] = [];
      if (Array.isArray(productsJson)) {
        products = productsJson;
      } else if (productsJson.data?.products) {
        products = productsJson.data.products;
      } else if (productsJson.data) {
        products = productsJson.data;
      }
      // Correction : forcer le type number sur price et originalPrice, utiliser les champs localisés string name/description
      products = products.map((p: any) => ({
        ...p,
        name: p.name,
        description: p.description,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        originalPrice: typeof p.original_price === 'string' ? parseFloat(p.original_price) : (typeof p.originalPrice === 'string' ? parseFloat(p.originalPrice) : (p.original_price ?? p.originalPrice)),
      }));
      console.log('[LOAD DATA] Products loaded:', products);
      dispatch({ type: 'SET_PRODUCTS', payload: products });

      // Charger les catégories depuis l'API Laravel
      console.log('[LOAD DATA] Fetching categories from', `${apiBase}/categories`);
      const categoriesResponse = await fetch(`${apiBase}/categories`);
      console.log('[LOAD DATA] Categories response status:', categoriesResponse.status);
      if (!categoriesResponse.ok) {
        const errorText = await categoriesResponse.text();
        console.error('[LOAD DATA] Categories error:', errorText);
        throw new Error('Erreur API catégories');
      }

      const categoriesJson = await categoriesResponse.json();
      // Pour API: { success, data: { categories: [...] } }
      let categories: any[] = [];
      if (Array.isArray(categoriesJson)) {
        categories = categoriesJson;
      } else if (categoriesJson.data?.categories) {
        categories = categoriesJson.data.categories;
      } else if (categoriesJson.data) {
        categories = categoriesJson.data;
      }
      console.log('[LOAD DATA] Categories loaded:', categories);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });

      // Charger l'utilisateur connecté si token présent
      const token = localStorage.getItem('darnaclean-token');
      if (token) {
        console.log('[LOAD DATA] Fetching user with token');
        const userResponse = await fetch(`${apiBase}/auth/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('[LOAD DATA] User response status:', userResponse.status);
        if (userResponse.ok) {
          const user = await userResponse.json();
          console.log('[LOAD DATA] User loaded:', user);
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          const errorText = await userResponse.text();
          console.error('[LOAD DATA] User error:', errorText);
        }
      }

      // Charger le panier depuis l'API si utilisateur connecté (optionnel)
      // TODO: Ajouter ici si API panier côté backend

    } catch (error) {
      console.error('[LOAD DATA] Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Helper functions
  const addToCart = async (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    // Optionnel: synchroniser immédiatement côté backend
    const token = localStorage.getItem('darnaclean-token');
    if (token) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      await fetch(`${apiBase}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.id, quantity })
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const token = localStorage.getItem('darnaclean-token');
    if (token) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      await fetch(`${apiBase}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
    }
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
      const token = localStorage.getItem('darnaclean-token');
      if (token) {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        await fetch(`${apiBase}/cart/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: productId, quantity })
        });
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    const token = localStorage.getItem('darnaclean-token');
    if (token) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      await fetch(`${apiBase}/cart/clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  };

  // Commandes : création d'une commande
  const createOrder = async (orderData: any) => {
    const token = localStorage.getItem('darnaclean-token');
    if (!token) throw new Error('Utilisateur non connecté');
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiBase}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la commande');
    return await res.json();
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getFilteredProducts = () => {
    // Correction : s'assurer que state.products est toujours un tableau
    const productsArray: Product[] = Array.isArray(state.products)
      ? state.products
      : [];
    let filtered = [...productsArray];

    // Apply filters
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    if (state.filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === state.filters.subcategory);
    }

    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }

    if (state.filters.onSale) {
      filtered = filtered.filter(product => product.onSale);
    }

    if (state.filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    if (state.filters.priceRange) {
      const [min, max] = state.filters.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Apply sorting
    switch (state.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getFilteredProducts,
    login,
    register,
    logout,
    adminLogin,
    createOrder,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook d'accès au contexte global de l'application
 * (exporté séparément pour éviter le warning Fast Refresh)
 */
// ...
// Le hook useApp a été déplacé dans useApp.ts
