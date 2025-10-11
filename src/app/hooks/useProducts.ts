'use client';

import { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';
import { MenuOut, CategoryOut } from '../types/api';

interface UseProductsReturn {
  products: MenuOut[];
  categories: CategoryOut[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductsByCategory: (categoryId: number | 'ทั้งหมด') => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<MenuOut[]>([]);
  const [categories, setCategories] = useState<CategoryOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getCategories()
      ]);
      console.log('✅ Products loaded from API:', productsData.length, 'items');
      console.log('✅ Categories loaded from API:', categoriesData.length, 'items');
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('❌ Failed to load from API:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(`API Error: ${errorMessage}`);
      // Don't use fallback - show empty state instead
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      if (query.trim()) {
        const data = await ProductService.searchProducts(query);
        setProducts(data);
      } else {
        await fetchProducts();
      }
    } catch (err) {
      console.error('❌ Failed to search:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(`Search Error: ${errorMessage}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId: number | 'ทั้งหมด') => {
    try {
      setLoading(true);
      setError(null);
      if (categoryId === 'ทั้งหมด') {
        const data = await ProductService.getProducts();
        setProducts(data);
      } else {
        const data = await ProductService.getProductsByCategory(categoryId);
        setProducts(data);
      }
    } catch (err) {
      console.error('❌ Failed to fetch by category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products by category';
      setError(`Category Error: ${errorMessage}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
    searchProducts,
    getProductsByCategory
  };
}

