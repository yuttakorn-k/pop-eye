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
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      // Don't show timeout errors as they're expected when API is unavailable
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
        setError('API ไม่พร้อมใช้งาน - ใช้ข้อมูลตัวอย่าง');
      } else {
        setError(errorMessage);
      }
      // Fallback to sample data if API fails
      setProducts(getSampleProducts());
      setCategories(getSampleCategories());
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
        setError('API ไม่พร้อมใช้งาน - ใช้ข้อมูลตัวอย่าง');
      } else {
        setError(errorMessage);
      }
      // Fallback to filtering sample data
      const sampleProducts = getSampleProducts();
      const filtered = sampleProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products by category';
      if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
        setError('API ไม่พร้อมใช้งาน - ใช้ข้อมูลตัวอย่าง');
      } else {
        setError(errorMessage);
      }
      // Fallback to filtering sample data
      const sampleProducts = getSampleProducts();
      const filtered = categoryId === 'ทั้งหมด' 
        ? sampleProducts 
        : sampleProducts.filter(p => p.category_id === categoryId);
      setProducts(filtered);
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

// Fallback sample data
function getSampleProducts(): MenuOut[] {
  return [
    { id: 1, menu_number: 1, name_th: 'ไก่ทอด', price: 89, category_id: 1, is_available: true },
    { id: 2, menu_number: 2, name_th: 'ข้าวผัดกุ้ง', price: 75, category_id: 1, is_available: true },
    { id: 3, menu_number: 3, name_th: 'ต้มยำกุ้ง', price: 120, category_id: 1, is_available: true },
    { id: 4, menu_number: 4, name_th: 'ผัดไทย', price: 65, category_id: 1, is_available: true },
    { id: 5, menu_number: 5, name_th: 'น้ำส้มคั้น', price: 35, category_id: 2, is_available: true },
    { id: 6, menu_number: 6, name_th: 'น้ำมะนาว', price: 25, category_id: 2, is_available: true },
    { id: 7, menu_number: 7, name_th: 'ชาเขียว', price: 30, category_id: 2, is_available: true },
    { id: 8, menu_number: 8, name_th: 'กาแฟดำ', price: 40, category_id: 2, is_available: true },
    { id: 9, menu_number: 9, name_th: 'ส้มตำ', price: 45, category_id: 3, is_available: true },
    { id: 10, menu_number: 10, name_th: 'ลาบหมู', price: 55, category_id: 3, is_available: true },
    { id: 11, menu_number: 11, name_th: 'ยำวุ้นเส้น', price: 50, category_id: 3, is_available: true },
    { id: 12, menu_number: 12, name_th: 'ข้าวเหนียวมะม่วง', price: 60, category_id: 4, is_available: true },
  ];
}

function getSampleCategories(): CategoryOut[] {
  return [
    { id: 1, name_th: 'อาหารหลัก' },
    { id: 2, name_th: 'เครื่องดื่ม' },
    { id: 3, name_th: 'อาหารจาน' },
    { id: 4, name_th: 'ของหวาน' },
  ];
}
