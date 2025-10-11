'use client';

import { useState, useEffect } from 'react';

interface QuantityModalProps {
  isOpen: boolean;
  currentQuantity: number;
  productName: string;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export default function QuantityModal({
  isOpen,
  currentQuantity,
  productName,
  onClose,
  onConfirm
}: QuantityModalProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());

  // Update quantity when modal opens or currentQuantity changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity.toString());
    }
  }, [isOpen, currentQuantity]);

  const handleNumberClick = (number: string) => {
    if (quantity === '0') {
      setQuantity(number);
    } else {
      setQuantity(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    if (quantity.length > 1) {
      setQuantity(prev => prev.slice(0, -1));
    } else {
      setQuantity('0');
    }
  };

  const handleClear = () => {
    setQuantity('0');
  };

  const handleConfirm = () => {
    const numQuantity = parseInt(quantity);
    if (numQuantity > 0) {
      onConfirm(numQuantity);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-96 max-w-[90vw] pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">จำนวนสินค้า</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Name */}
        <div className="px-4 py-3 bg-gray-50">
          <p className="text-sm text-gray-700 font-medium truncate">{productName}</p>
        </div>

        {/* Input Display */}
        <div className="p-4 bg-white">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-4xl font-bold text-gray-900">
              {quantity}
            </span>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-3 gap-3">
            {/* Row 1: 7 8 9 */}
            {['7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-2xl text-gray-900"
              >
                {num}
              </button>
            ))}

            {/* Row 2: 4 5 6 */}
            {['4', '5', '6'].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-2xl text-gray-900"
              >
                {num}
              </button>
            ))}

            {/* Row 3: 1 2 3 */}
            {['1', '2', '3'].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-2xl text-gray-900"
              >
                {num}
              </button>
            ))}

            {/* Row 4: empty 0 backspace */}
            <div></div>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-2xl text-gray-900"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="p-4 bg-white rounded-b-xl">
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-md"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

