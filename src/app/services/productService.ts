import apiClient from '../lib/api';
import { MenuOut, MenuCreate, MenuUpdate, CategoryOut } from '../types/api';
import { API_CONFIG } from '../config/api';

export class ProductService {
  // Get all menus (products)
  static async getProducts(): Promise<MenuOut[]> {
    try {
      const response = await apiClient.get<MenuOut[]>(API_CONFIG.ENDPOINTS.MENUS);
      return response.data;
    } catch (error: any) {
      const detail = error?.response?.data || error?.message || error;
      console.error('Error fetching products:', detail);
      throw error;
    }
  }

  // Get product by ID
  static async getProduct(id: number): Promise<MenuOut> {
    try {
      const response = await apiClient.get<MenuOut>(`${API_CONFIG.ENDPOINTS.MENUS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(productData: MenuCreate): Promise<MenuOut> {
    try {
      const response = await apiClient.post<MenuOut>(API_CONFIG.ENDPOINTS.MENUS, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: number, productData: MenuUpdate): Promise<MenuOut> {
    try {
      const response = await apiClient.put<MenuOut>(`${API_CONFIG.ENDPOINTS.MENUS}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.MENUS}/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId: number): Promise<MenuOut[]> {
    try {
      const response = await apiClient.get<MenuOut[]>(API_CONFIG.ENDPOINTS.MENUS);
      // Filter by category on the client side since API doesn't have category filter
      const allProducts = response.data;
      return allProducts.filter(product => product.category_id === categoryId);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Search products (client-side filtering)
  static async searchProducts(query: string): Promise<MenuOut[]> {
    try {
      const response = await apiClient.get<MenuOut[]>(API_CONFIG.ENDPOINTS.MENUS);
      // Filter by search query on the client side
      const allProducts = response.data;
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(product => 
        product.name_th.toLowerCase().includes(lowerQuery) ||
        product.name_en?.toLowerCase().includes(lowerQuery) ||
        product.name_mm?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get all categories
  static async getCategories(): Promise<CategoryOut[]> {
    try {
      const response = await apiClient.get<CategoryOut[]>(API_CONFIG.ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}
