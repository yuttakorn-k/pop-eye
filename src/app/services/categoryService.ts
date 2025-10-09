import apiClient from '../lib/api';
import { ApiCategory, ApiResponse } from '../types/api';

export class CategoryService {
  // Get all categories
  static async getCategories(): Promise<ApiCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiCategory[]>>('/api/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Create new category
  static async createCategory(name: string, description?: string): Promise<ApiCategory> {
    try {
      const response = await apiClient.post<ApiResponse<ApiCategory>>('/api/categories', {
        name,
        description
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id: string, name: string, description?: string): Promise<ApiCategory> {
    try {
      const response = await apiClient.put<ApiResponse<ApiCategory>>(`/api/categories/${id}`, {
        name,
        description
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
