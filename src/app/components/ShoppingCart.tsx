'use client';

import { CartItem } from './POSInterface';

interface ShoppingCartProps {
  cart: CartItem[];
  selectedTable: string;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onRemoveItem?: (productId: number) => void;
  onClearCart: () => void;
  totalAmount: number;
  onCheckout: () => void;
}

export default function ShoppingCart({
  cart,
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalAmount,
  onCheckout
}: ShoppingCartProps) {
  // Calculate tax (7%)
  const tax = totalAmount * 0.07;
  const finalTotal = totalAmount + tax;

  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">โต๊ะ : {selectedTable}</h2>
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {cart.length} รายการ
        </p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-sm">ตะกร้าว่างเปล่า</p>
            <p className="text-xs">เลือกสินค้าเพื่อเริ่มต้น</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.product.id} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-base">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    ฿{item.product.price.toLocaleString()}
                  </p>
                  
                </div>
                <button
                  onClick={() => onRemoveItem?.(item.product.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity?.(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-sm text-white"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity?.(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-sm text-white"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-white text-sm">
                  ฿{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="border-t border-gray-700 p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ยอดรวม</span>
              <span className="text-sm text-white">
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ภาษี 7%</span>
              <span className="text-sm text-white">
                ฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-600 pt-2">
              <span className="text-lg font-semibold text-white">สุทธิ</span>
              <span className="text-xl font-bold text-green-400">
                ฿{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ชำระเงิน
          </button>
        </div>
      )}
    </div>
  );
}
