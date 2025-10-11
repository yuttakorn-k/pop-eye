'use client';

import { useState, useRef, useEffect } from 'react';
import { CartItem } from './POSInterface';

interface ShoppingCartProps {
  cart: CartItem[];
  selectedTable: string;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onRemoveItem?: (productId: number) => void;
  onClearCart: () => void;
  totalAmount: number;
  onCheckout: () => void;
  onQuantityClick?: (productId: number, productName: string, currentQuantity: number) => void;
  onNoteClick?: (productId: number, productName: string, currentNote: string) => void;
}

export default function ShoppingCart({
  cart,
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalAmount,
  onCheckout,
  onQuantityClick,
  onNoteClick
}: ShoppingCartProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Calculate tax (7%)
  const tax = totalAmount * 0.07;
  const finalTotal = totalAmount + tax;

  const handleMenuToggle = (productId: number) => {
    if (openMenuId === productId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[productId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.left
        });
      }
      setOpenMenuId(productId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">โต๊ะ : {selectedTable}</h2>
          <span className="text-sm text-gray-600">{cart.length} รายการ</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-sm">ตะกร้าว่างเปล่า</p>
            <p className="text-xs">เลือกสินค้าเพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cart.map((item, index) => {
              // Create unique key that includes product ID and selected options
              const selectedOptionsKey = item.selectedOptions 
                ? Object.entries(item.selectedOptions)
                    .map(([group, options]) => `${group}:${options.map(opt => `${opt.name}:${opt.price}`).join(',')}`)
                    .join('|')
                : 'no-options';
              const uniqueKey = `${item.product.id}-${selectedOptionsKey}-${index}`;
              
              return (
              <div key={uniqueKey} className="p-4">
                <div className="flex items-center justify-between">
                  {/* Left Section - Number and Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-base font-medium text-gray-900 min-w-[24px]">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-lg leading-tight">
                        {item.product.name}
                      </h4>
                      {/* Display selected options as SKU */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-1">
                          {Object.entries(item.selectedOptions).map(([groupName, options]) => (
                            <div key={groupName} className="text-sm text-gray-500">
                              SKU {options.map(opt => opt.name).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Section - Price and Quantity */}
                  <div className="flex items-center gap-3 ml-4">
                    <span className="font-semibold text-gray-900 text-lg">
                      ฿{(() => {
                        let itemPrice = item.product.price;
                        
                        // Add selected options prices
                        if (item.selectedOptions) {
                          Object.values(item.selectedOptions).forEach(options => {
                            options.forEach(option => {
                              itemPrice += option.price;
                            });
                          });
                        }
                        
                        return itemPrice.toFixed(2);
                      })()}
                    </span>
                    <button
                      onClick={() => onQuantityClick?.(item.product.id, item.product.name, item.quantity)}
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[60px] flex justify-end hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-blue-600 text-base">
                        x {item.quantity}
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Note Display */}
                {item.note && (
                  <div className="ml-7 mt-2">
                    <span className="text-sm text-gray-600 italic">โน๊ต: {item.note}</span>
                  </div>
                )}
                
                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 mt-3 ml-7">
                  <button
                    onClick={() => onRemoveItem?.(item.product.id)}
                    className="w-10 h-10 rounded bg-white hover:bg-red-50 flex items-center justify-center text-red-600 hover:text-red-700 transition-colors border border-gray-300"
                    title="ลบรายการ"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onNoteClick?.(item.product.id, item.product.name, item.note || '')}
                    className="w-10 h-10 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-800 transition-colors border border-gray-300"
                    title="แก้ไขโน๊ต"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    ref={(el) => { buttonRefs.current[item.product.id] = el; }}
                    onClick={() => handleMenuToggle(item.product.id)}
                    className="w-10 h-10 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-800 transition-colors border border-gray-300"
                    title="ตัวเลือกเพิ่มเติม"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Dropdown Menu */}
      {openMenuId !== null && menuPosition && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
          />
          
          {/* Menu */}
          <div 
            className="fixed w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            <button
              onClick={() => {
                console.log('ลด', openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <span className="text-sm">ลด</span>
            </button>
            <button
              onClick={() => {
                console.log('ลด%', openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <span className="text-sm">ลด%</span>
            </button>
            <button
              onClick={() => {
                console.log('ยกเลิกส่วนลด', openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <span className="text-sm">ยกเลิกส่วนลด</span>
            </button>
            <button
              onClick={() => {
                console.log('แก้ไขราคาขาย', openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm">แก้ไขราคาขาย</span>
            </button>
          </div>
        </>
      )}

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ยอดรวม</span>
              <span className="text-sm text-gray-900">
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ภาษี 7%</span>
              <span className="text-sm text-gray-900">
                ฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-300 pt-2">
              <span className="text-lg font-semibold text-gray-900">สุทธิ</span>
              <span className="text-xl font-bold text-green-600">
                ฿{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            ชำระเงิน
          </button>
        </div>
      )}

    </div>
  );
}
