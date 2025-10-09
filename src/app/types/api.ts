// Menu Types (Products)
export interface MenuOut {
  id: number;
  category_id?: number;
  menu_number: number;
  name_th: string;
  name_en?: string;
  name_mm?: string;
  price: number;
  image?: string;
  is_available?: boolean;
  is_recommended?: boolean;
  options_group?: string; // Field to indicate if product has options
  created_at?: string;
  updated_at?: string;
}

export interface MenuCreate {
  category_id?: number;
  menu_number: number;
  name_th: string;
  name_en?: string;
  name_mm?: string;
  price: number;
  image?: string;
  is_available?: boolean;
  is_recommended?: boolean;
  options_group?: string;
}

export interface MenuUpdate extends Partial<MenuCreate> {}

// Category Types
export interface CategoryOut {
  id: number;
  name_th: string;
  name_en?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name_th: string;
  name_en?: string;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}

// Order Types
export interface OrderOut {
  id: number;
  table_id?: number;
  status?: string;
  total_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderCreate {
  table_id?: number;
  status?: string;
}

export interface OrderUpdate extends Partial<OrderCreate> {}

export interface OrderItemOut {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemCreate {
  order_id: number;
  menu_id: number;
  quantity: number;
  note?: string;
}

export interface OrderItemUpdate extends Partial<OrderItemCreate> {}

// Payment Types
export interface PaymentOut {
  id: number;
  order_id: number;
  amount: number;
  method?: string;
  status?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentCreate {
  order_id: number;
  amount: number;
  method?: string;
  status?: string;
}

export interface PaymentUpdate extends Partial<PaymentCreate> {}

// Table Types
export interface TableOut {
  id: number;
  table_number: number;
  qr_code?: string;
  created_at?: string;
  updated_at?: string;
}

// Staff Types
export interface StaffOut {
  id: number;
  name: string;
  role?: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  pin: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Sales Report Types
export interface SalesReport {
  date: string;
  total_orders: number;
  total_revenue: number;
  payment_methods: {
    cash: number;
    card: number;
    qr: number;
  };
  top_products: Array<{
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
