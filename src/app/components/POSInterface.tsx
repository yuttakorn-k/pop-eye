'use client';

import { useState, useEffect, useRef } from 'react';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';
import PaymentModal from './PaymentModal';
import AddToCartAnimation from './AddToCartAnimation';
import POSFooter from './POSFooter';
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

interface AnimationState {
  id: string;
  product: Product;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
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
  const [animations, setAnimations] = useState<AnimationState[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

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

  // Global keyboard shortcuts (e.g., Ctrl+E to clear, Ctrl+P to checkout/hold)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      const key = e.key.toLowerCase();
      if (key === 'e') {
        e.preventDefault();
        clearCart();
      } else if (key === 'p') {
        e.preventDefault();
        setShowPaymentModal(true);
      } else if (key === 'm') {
        e.preventDefault();
        console.log('open customer modal');
      } else if (key === 'o') {
        e.preventDefault();
        console.log('open register/stock');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  const addToCart = (product: Product, productElement?: HTMLElement) => {
    // Add to cart immediately
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

    // Create animation if product element is provided
    if (productElement && cartRef.current) {
      const productRect = productElement.getBoundingClientRect();
      const cartRect = cartRef.current.getBoundingClientRect();
      
      const startPosition = {
        x: productRect.left + productRect.width / 2,
        y: productRect.top + productRect.height / 2
      };
      
      const endPosition = {
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2
      };

      const animationId = `${Date.now()}-${product.id}-${Math.random().toString(36).slice(2,8)}`;
      const newAnimation: AnimationState = {
        id: animationId,
        product,
        startPosition,
        endPosition
      };

      setAnimations(prev => [...prev, newAnimation]);
    }
  };

  const removeAnimation = (id: string) => {
    setAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  const updateQuantity = (productId: number, quantity: number) => {
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

  const removeFromCart = (productId: number) => {
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
      if (selectedCategory === 'ทั้งหมด') {
        await getProductsByCategory('ทั้งหมด');
      } else {
        const categoryId = categories.find(cat => cat.name_th === selectedCategory)?.id;
        if (categoryId) {
          await getProductsByCategory(categoryId);
        }
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title and Back Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToTableSelection}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 border border-gray-300"
            >
              <span>←</span>
              <span>เปลี่ยนโต๊ะ</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Popeye steak</h1>
              <p className="text-sm text-gray-600">โต๊ะ : {selectedTable}</p>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="relative max-w-md flex-1 mx-8">
            <input
              type="text"
              placeholder="ค้นหา"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>

          {/* Right Side - Time and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">วันที่</p>
              <p className="font-semibold text-gray-900">{currentTime.toLocaleDateString('th-TH')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">เวลา</p>
              <p className="font-semibold text-gray-900">{currentTime.toLocaleTimeString('th-TH')}</p>
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
        {/* Category Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {categoryOptions.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-center px-4 py-6 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Product Grid */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">กำลังโหลดสินค้า...</p>
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
        <div ref={cartRef} className="w-[420px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 shadow-lg">
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

      {/* Footer */}
      <POSFooter
        onClearCart={clearCart}
        onOpenCustomer={() => console.log('open customer modal')}
        onOpenRegister={() => console.log('open register/stock')}
        onCheckout={() => setShowPaymentModal(true)}
        onOpenSummary={() => console.log('open summary')}
      />

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

      {/* Add to Cart Animations */}
      {animations.map((animation) => (
        <AddToCartAnimation
          key={animation.id}
          animationId={animation.id}
          product={animation.product}
          startPosition={animation.startPosition}
          endPosition={animation.endPosition}
          onComplete={() => removeAnimation(animation.id)}
        />
      ))}


    </div>
  );
}
