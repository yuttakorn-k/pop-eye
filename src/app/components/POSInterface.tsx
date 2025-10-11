'use client';

import { useState, useEffect, useRef } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import ShoppingCart from '@/app/components/ShoppingCart';
import PaymentModal from '@/app/components/PaymentModal';
import AddToCartAnimation from './AddToCartAnimation';
import QuantityModal from '@/app/components/QuantityModal';
import NoteModal from '@/app/components/NoteModal';
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
  note?: string;
  selectedOptions?: { [group: string]: { name: string; price: number }[] };
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
  onLogout?: () => void;
}

export default function POSInterface({ selectedTable, onBackToTableSelection, onLogout }: POSInterfaceProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animations, setAnimations] = useState<AnimationState[]>([]);
  const [quantityModal, setQuantityModal] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
    currentQuantity: number;
  }>({
    isOpen: false,
    productId: null,
    productName: '',
    currentQuantity: 1
  });
  const [noteModal, setNoteModal] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
    currentNote: string;
  }>({
    isOpen: false,
    productId: null,
    productName: '',
    currentNote: ''
  });
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
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

  const addToCart = (product: Product, productElement?: HTMLElement, selectedOptions?: { [group: string]: { name: string; price: number }[] }) => {
    // Add to cart immediately
    setCart(prev => {
      // Find existing item with same product and same selected options
      const existingItem = prev.find(item => {
        if (item.product.id !== product.id) return false;
        
        // Compare selected options
        const currentOptions = selectedOptions || {};
        const existingOptions = item.selectedOptions || {};
        
        // Check if options are the same
        const currentKeys = Object.keys(currentOptions).sort();
        const existingKeys = Object.keys(existingOptions).sort();
        
        if (currentKeys.length !== existingKeys.length) return false;
        
        for (const key of currentKeys) {
          if (!existingKeys.includes(key)) return false;
          const currentValues = currentOptions[key].map(opt => `${opt.name}:${opt.price}`).sort();
          const existingValues = existingOptions[key].map(opt => `${opt.name}:${opt.price}`).sort();
          if (JSON.stringify(currentValues) !== JSON.stringify(existingValues)) return false;
        }
        
        return true;
      });
      
      if (existingItem) {
        // Same product with same options - increase quantity
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Different product or different options - add new item
      return [...prev, { product, quantity: 1, selectedOptions }];
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

  const handleQuantityClick = (productId: number, productName: string, currentQuantity: number) => {
    setQuantityModal({
      isOpen: true,
      productId,
      productName,
      currentQuantity
    });
  };

  const handleQuantityConfirm = (newQuantity: number) => {
    if (quantityModal.productId !== null) {
      updateQuantity(quantityModal.productId, newQuantity);
    }
    setQuantityModal({
      isOpen: false,
      productId: null,
      productName: '',
      currentQuantity: 1
    });
  };

  const handleQuantityClose = () => {
    setQuantityModal({
      isOpen: false,
      productId: null,
      productName: '',
      currentQuantity: 1
    });
  };

  // Handle note modal
  const handleNoteClick = (productId: number, productName: string, currentNote: string) => {
    setNoteModal({
      isOpen: true,
      productId,
      productName,
      currentNote
    });
  };

  const handleNoteConfirm = (note: string) => {
    if (noteModal.productId !== null) {
      // Update the cart item with the new note
      setCart(prevCart => 
        prevCart.map(item => 
          item.product.id === noteModal.productId 
            ? { ...item, note }
            : item
        )
      );
    }
    setNoteModal({
      isOpen: false,
      productId: null,
      productName: '',
      currentNote: ''
    });
  };

  const handleNoteClose = () => {
    setNoteModal({
      isOpen: false,
      productId: null,
      productName: '',
      currentNote: ''
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => {
    let itemTotal = item.product.price;
    
    // Add selected options prices
    if (item.selectedOptions) {
      Object.values(item.selectedOptions).forEach(options => {
        options.forEach(option => {
          itemTotal += option.price;
        });
      });
    }
    
    return sum + (itemTotal * item.quantity);
  }, 0);

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
          {/* Left Side - Hamburger, Title and Back Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300"
              title="เมนูหมวดหมู่"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden transition-all duration-300">
        {/* Category Sidebar - Pushes content when open */}
        {isCategorySidebarOpen && (
          <div className="w-56 bg-white flex flex-col shadow-lg border-r border-gray-200 animate-slide-in">
            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {categoryOptions.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryChange(category);
                    }}
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
        )}

        {/* Product Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Bar with Buttons */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Settings Button */}
              <button
                onClick={() => console.log('ตั้งค่า')}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="ตั้งค่า"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              
              {/* Hold/Park Button */}
              <button
                onClick={() => console.log('พักบิล')}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
                title="พักบิล"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
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
                cart={cart}
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
            onQuantityClick={handleQuantityClick}
            onNoteClick={handleNoteClick}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="px-3 md:px-6 py-3">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <button
              onClick={clearCart}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-semibold">เคลียร์</span>
            </button>

            <button
              onClick={() => console.log('ลูกค้า')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold">ลูกค้า</span>
            </button>

            <button
              onClick={() => console.log('สลิป/บิล')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-semibold">สลิป/บิล</span>
            </button>

            <button
              onClick={() => console.log('พัก')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold">พัก</span>
            </button>

            <button
              onClick={() => console.log('สรุป')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold">สรุป</span>
            </button>

            <button
              onClick={() => console.log('more actions')}
              className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow"
              aria-label="เพิ่มเติม"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>

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

      {/* Quantity Modal */}
      <QuantityModal
        isOpen={quantityModal.isOpen}
        currentQuantity={quantityModal.currentQuantity}
        productName={quantityModal.productName}
        onClose={handleQuantityClose}
        onConfirm={handleQuantityConfirm}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        productName={noteModal.productName}
        currentNote={noteModal.currentNote}
        onClose={handleNoteClose}
        onConfirm={handleNoteConfirm}
      />

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
