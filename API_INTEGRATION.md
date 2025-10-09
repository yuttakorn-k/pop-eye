# API Integration Guide

## Overview
This POS system is successfully integrated with the **Popeye Backend API** at `http://5.223.78.37:8001`. The system includes fallback sample data when the API is unavailable.

## API Endpoints

### Menus (Products)
- `GET /menus/` - Get all menu items
- `GET /menus/{id}` - Get menu item by ID
- `POST /menus/` - Create new menu item
- `PUT /menus/{id}` - Update menu item
- `DELETE /menus/{id}` - Delete menu item

### Orders
- `GET /orders/` - Get all orders
- `GET /orders/{id}` - Get order by ID
- `POST /orders/` - Create new order
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order

### Categories
- `GET /categories/` - Get all categories
- `POST /categories/` - Create new category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### Payments
- `GET /payments/` - Get all payments
- `GET /payments/{id}` - Get payment by ID
- `POST /payments/` - Create new payment
- `PUT /payments/{id}` - Update payment
- `DELETE /payments/{id}` - Delete payment

### Tables
- `GET /tables/` - Get all tables
- `GET /tables/{id}` - Get table by ID
- `POST /tables/` - Create new table
- `PUT /tables/{id}` - Update table
- `DELETE /tables/{id}` - Delete table

### Staff
- `GET /staff/` - Get all staff
- `GET /staff/{id}` - Get staff by ID
- `POST /staff/` - Create new staff
- `PUT /staff/{id}` - Update staff
- `DELETE /staff/{id}` - Delete staff

### Authentication
- `POST /auth/login` - Login for access token
- `GET /auth/me` - Get current user info
- `POST /auth/token` - Get token (OAuth2 form)

## Data Models

### Menu (Product)
```typescript
interface MenuOut {
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
  created_at?: string;
  updated_at?: string;
}
```

### Category
```typescript
interface CategoryOut {
  id: number;
  name_th: string;
  name_en?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Order
```typescript
interface CreateOrderRequest {
  items: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
  payment_method: 'cash' | 'card' | 'qr';
  total_amount: number;
  cash_received?: number;
  change?: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}
```

## Configuration

### Environment Variables
Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_API_URL=http://5.223.78.37:8001
```

### API Configuration
The API configuration is located in `src/app/config/api.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://5.223.78.37:8001',
  TIMEOUT: 5000,
  ENDPOINTS: {
    MENUS: '/menus/',
    ORDERS: '/orders/',
    CATEGORIES: '/categories/',
    PAYMENTS: '/payments/',
    TABLES: '/tables/',
    STAFF: '/staff/',
    AUTH: {
      LOGIN: '/auth/login',
      ME: '/auth/me',
      TOKEN: '/auth/token'
    }
  }
};
```

## CORS Solution

Since the external API doesn't have CORS headers configured, the system uses a **Next.js API proxy** to handle cross-origin requests:

### Proxy Implementation
- **Location**: `src/app/api/proxy/[...path]/route.ts`
- **Function**: Proxies all API requests to `http://5.223.78.37:8001`
- **CORS Headers**: Adds proper CORS headers for browser compatibility
- **Methods**: Supports GET, POST, PUT, DELETE, OPTIONS

### How It Works
1. Frontend makes requests to `/api/proxy/menus` instead of direct API
2. Next.js API route forwards request to external API
3. Response is returned with proper CORS headers
4. Frontend receives data without CORS issues

## Error Handling

The system includes comprehensive error handling:
- Network errors are caught and logged
- Fallback to sample data when API is unavailable
- User-friendly error messages
- Loading states for better UX
- CORS issues resolved via API proxy

## Features

### Product Management
- Real-time product loading from API
- Category filtering
- Search functionality
- Fallback to sample data

### Order Processing
- Create orders via API
- Customer information collection
- Multiple payment methods
- Order validation

### Offline Support
- Works with sample data when API is unavailable
- Graceful degradation
- Error notifications

## Development

### Running with API
1. Ensure the API server is running at `http://5.223.78.37:8001`
2. Start the development server: `npm run dev`
3. The system will automatically connect to the API

### Running Offline
1. Start the development server: `npm run dev`
2. The system will use sample data when API is unavailable
3. Error messages will indicate offline mode

## Testing API Connection

You can test the API connection by:
1. Opening browser developer tools
2. Checking the Network tab for API requests
3. Looking for error messages in the console
4. Observing the "ใช้ข้อมูลตัวอย่าง" warning in the UI

## Customization

### Adding New API Endpoints
1. Add endpoint to `src/app/config/api.ts`
2. Create service function in appropriate service file
3. Add TypeScript types in `src/app/types/api.ts`
4. Create custom hook if needed

### Modifying Data Models
1. Update types in `src/app/types/api.ts`
2. Update service functions accordingly
3. Update components to handle new fields

## Troubleshooting

### Common Issues
1. **API Connection Failed**: Check if the API server is running
2. **CORS Errors**: Ensure API server allows requests from the frontend
3. **Authentication Errors**: Check if API requires authentication tokens
4. **Data Format Mismatch**: Verify API response format matches TypeScript types

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```
