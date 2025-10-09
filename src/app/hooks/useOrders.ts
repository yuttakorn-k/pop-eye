'use client';

import { useState } from 'react';
import { OrderService } from '../services/orderService';
import { CreateOrderRequest, ApiOrder } from '../types/api';

interface UseOrdersReturn {
  createOrder: (orderData: CreateOrderRequest) => Promise<ApiOrder>;
  loading: boolean;
  error: string | null;
}

export function useOrders(): UseOrdersReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderRequest): Promise<ApiOrder> => {
    try {
      setLoading(true);
      setError(null);
      const order = await OrderService.createOrder(orderData);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error
  };
}
