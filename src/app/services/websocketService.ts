'use client';

import { useWebSocket } from '../hooks/useWebSocket';

// WebSocket message types for POS system
export interface POSWebSocketMessage {
  type: 'order_update' | 'product_update' | 'category_update' | 'inventory_update' | 'system_message';
  data: any;
  timestamp: string;
}

export interface OrderUpdateMessage {
  orderId: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: Array<{
    productId: number;
    quantity: number;
    status: string;
  }>;
  totalAmount: number;
  customerName?: string;
  estimatedTime?: number;
}

export interface ProductUpdateMessage {
  productId: number;
  name: string;
  price: number;
  isAvailable: boolean;
  stock?: number;
  categoryId: number;
}

export interface CategoryUpdateMessage {
  categoryId: number;
  name: string;
  isActive: boolean;
}

export interface InventoryUpdateMessage {
  productId: number;
  stock: number;
  isLowStock: boolean;
  lastUpdated: string;
}

export interface SystemMessage {
  message: string;
  level: 'info' | 'warning' | 'error';
  action?: string;
}

// WebSocket service for POS operations
export class POSWebSocketService {
  private static instance: POSWebSocketService;
  private ws: ReturnType<typeof useWebSocket> | null = null;

  static getInstance(): POSWebSocketService {
    if (!POSWebSocketService.instance) {
      POSWebSocketService.instance = new POSWebSocketService();
    }
    return POSWebSocketService.instance;
  }

  initialize(url: string) {
    // This would typically be called from a React component
    // For now, we'll create a mock implementation
    console.log('Initializing POS WebSocket service with URL:', url);
  }

  // Order-related WebSocket operations
  sendOrderUpdate(orderData: any) {
    const message: POSWebSocketMessage = {
      type: 'order_update',
      data: orderData,
      timestamp: new Date().toISOString(),
    };
    console.log('Sending order update:', message);
  }

  // Product-related WebSocket operations
  sendProductUpdate(productData: any) {
    const message: POSWebSocketMessage = {
      type: 'product_update',
      data: productData,
      timestamp: new Date().toISOString(),
    };
    console.log('Sending product update:', message);
  }

  // Category-related WebSocket operations
  sendCategoryUpdate(categoryData: any) {
    const message: POSWebSocketMessage = {
      type: 'category_update',
      data: categoryData,
      timestamp: new Date().toISOString(),
    };
    console.log('Sending category update:', message);
  }

  // Inventory-related WebSocket operations
  sendInventoryUpdate(inventoryData: any) {
    const message: POSWebSocketMessage = {
      type: 'inventory_update',
      data: inventoryData,
      timestamp: new Date().toISOString(),
    };
    console.log('Sending inventory update:', message);
  }

  // System message
  sendSystemMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    const wsMessage: POSWebSocketMessage = {
      type: 'system_message',
      data: {
        message,
        level,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
    console.log('Sending system message:', wsMessage);
  }
}

// Hook for using POS WebSocket functionality
export function usePOSWebSocket(apiUrl?: string) {
  // For development, we'll use a mock WebSocket URL
  // In production, this would connect to your actual WebSocket server
  const wsUrl = apiUrl ? `ws://${apiUrl.replace(/^https?:\/\//, '')}/ws` : 'ws://localhost:8001/ws';
  
  const {
    socket,
    isConnected,
    sendMessage,
    lastMessage,
    reconnectAttempts,
  } = useWebSocket({
    url: wsUrl,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    onMessage: (message) => {
      console.log('Received POS WebSocket message:', message);
      // Handle different message types
      switch (message.type) {
        case 'order_update':
          console.log('Order update received:', message.data);
          break;
        case 'product_update':
          console.log('Product update received:', message.data);
          break;
        case 'category_update':
          console.log('Category update received:', message.data);
          break;
        case 'inventory_update':
          console.log('Inventory update received:', message.data);
          break;
        case 'system_message':
          console.log('System message received:', message.data);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    },
    onOpen: () => {
      console.log('POS WebSocket connected');
    },
    onClose: () => {
      console.log('POS WebSocket disconnected');
    },
    onError: (error, context) => {
      console.error('POS WebSocket error. Context:', context);
    },
  });

  const posService = POSWebSocketService.getInstance();

  return {
    socket,
    isConnected,
    sendMessage,
    lastMessage,
    reconnectAttempts,
    posService,
  };
}
