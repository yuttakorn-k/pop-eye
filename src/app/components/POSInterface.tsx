'use client';

import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';
import PaymentModal from './PaymentModal';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { usePOSWebSocket } from '../services/websocketService';
import { MenuOut, CategoryOut } from '../types/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface POSInterfaceProps {
  selectedTable: string;
  onBackToTableSelection: () => void;
}

export default function POSInterface({ selectedTable, onBackToTableSelection }: POSInterfaceProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { products, categories, loading, error, searchProducts, getProductsByCategory } = useProducts();
  const { createOrder, loading: orderLoading } = useOrders();
  
  // WebSocket connection for real-time updates
  const { isConnected: wsConnected, lastMessage: wsMessage, posService } = usePOSWebSocket();

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (wsMessage) {
      console.log('Received WebSocket message:', wsMessage);
      // Handle different types of WebSocket messages
      switch (wsMessage.type) {
        case 'order_update':
          console.log('Order update received:', wsMessage.data);
          break;
        case 'product_update':
          console.log('Product update received:', wsMessage.data);
          // Refresh products when there's an update
          break;
        case 'category_update':
          console.log('Category update received:', wsMessage.data);
          // Refresh categories when there's an update
          break;
        case 'system_message':
          console.log('System message received:', wsMessage.data);
          break;
      }
    }
  }, [wsMessage]);

  // Convert API products to local Product format
  const localProducts: Product[] = products.map(menu => ({
    id: menu.id,
    name: menu.name_th,
    price: menu.price,
    category: categories.find(cat => cat.id === menu.category_id)?.name_th || 'ไม่ระบุ',
    image: menu.image,
    description: menu.name_en
  }));

  const categoryOptions = ['ทั้งหมด', ...categories.map(cat => cat.name_th)];

  const filteredProducts = selectedCategory === 'ทั้งหมด' 
    ? localProducts 
    : localProducts.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    if (category === 'ทั้งหมด') {
      await getProductsByCategory('ทั้งหมด');
    } else {
      const categoryId = categories.find(cat => cat.name_th === category)?.id;
      if (categoryId) {
        await getProductsByCategory(categoryId);
      }
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchProducts(query);
    } else {
      await getProductsByCategory(selectedCategory);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title and Back Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToTableSelection}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>เปลี่ยนโต๊ะ</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Popeye steak</h1>
              <p className="text-sm text-gray-400">โต๊ะ : {selectedTable}</p>
            </div>
          </div>

          {/* Right Side - Time and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">วันที่</p>
              <p className="font-semibold text-white">{currentTime.toLocaleDateString('th-TH')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">เวลา</p>
              <p className="font-semibold text-white">{currentTime.toLocaleTimeString('th-TH')}</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
              <span>⚡</span>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search and Category Filter */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categoryOptions.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-800">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-400">กำลังโหลดสินค้า...</p>
                </div>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={addToCart}
              />
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col flex-shrink-0">
          <ShoppingCart
            cart={cart}
            selectedTable={selectedTable}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            totalAmount={totalAmount}
            onCheckout={() => setShowPaymentModal(true)}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          cart={cart}
          totalAmount={totalAmount}
          onClose={() => setShowPaymentModal(false)}
          onCompletePayment={() => {
            clearCart();
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
}
