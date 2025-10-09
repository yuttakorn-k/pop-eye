import apiClient from '../lib/api';
import { ApiOrder, CreateOrderRequest, ApiResponse } from '../types/api';

export class OrderService {
  // Create new order
  static async createOrder(orderData: CreateOrderRequest): Promise<ApiOrder> {
    try {
      const response = await apiClient.post<ApiResponse<ApiOrder>>('/api/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get all orders
  static async getOrders(): Promise<ApiOrder[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiOrder[]>>('/api/orders');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrder(id: string): Promise<ApiOrder> {
    try {
      const response = await apiClient.get<ApiResponse<ApiOrder>>(`/api/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Promise<ApiOrder> {
    try {
      const response = await apiClient.patch<ApiResponse<ApiOrder>>(`/api/orders/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate: string, endDate: string): Promise<ApiOrder[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiOrder[]>>(
        `/api/orders?start_date=${startDate}&end_date=${endDate}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  }

  // Get today's orders
  static async getTodaysOrders(): Promise<ApiOrder[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      return this.getOrdersByDateRange(today, today);
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
      throw error;
    }
  }
}
