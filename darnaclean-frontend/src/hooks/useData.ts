import { useState, useEffect } from 'react';
import { Product, Category, TrendingProduct, KnowledgeBase, ScrapingStats } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/data/categories.json');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useTrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [scrapingStats, setScrapingStats] = useState<ScrapingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch('/data/trending-products.json');
        if (!response.ok) throw new Error('Failed to fetch trending products');
        const data = await response.json();
        setTrendingProducts(data.trending_products);
        setScrapingStats(data.scraping_stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return { trendingProducts, scrapingStats, loading, error };
};

export const useKnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const response = await fetch('/data/chatbot-knowledge.json');
        if (!response.ok) throw new Error('Failed to fetch knowledge base');
        const data = await response.json();
        setKnowledgeBase(data.knowledge_base);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, []);

  return { knowledgeBase, loading, error };
};
