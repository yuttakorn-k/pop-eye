'use client';

import { useState } from 'react';
import { Product } from './POSInterface';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
}

interface ProductOptionsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, options: ProductOption[], totalPrice: number) => void;
}

export default function ProductOptionsModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: ProductOptionsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);

  if (!isOpen || !product) return null;

  // Sample options for demonstration - in real app, this would come from API based on options_group
  const getProductOptions = (product: Product): ProductOption[] => {
    const optionsGroup = (product as any).options_group;
    
    // Define options based on options_group value
    const optionsMap: Record<string, ProductOption[]> = {
      'spicy-food': [
        { id: 'spicy-level', name: 'ระดับเผ็ด', price: 0, isSelected: false },
        { id: 'extra-rice', name: 'ข้าวเพิ่ม', price: 15, isSelected: false },
        { id: 'extra-sauce', name: 'ซอสเพิ่ม', price: 10, isSelected: false },
      ],
      'fried-rice': [
        { id: 'spicy-level', name: 'ระดับเผ็ด', price: 0, isSelected: false },
        { id: 'extra-egg', name: 'ไข่ดาว', price: 20, isSelected: false },
        { id: 'extra-shrimp', name: 'กุ้งเพิ่ม', price: 30, isSelected: false },
      ],
      'soup': [
        { id: 'spicy-level', name: 'ระดับเผ็ด', price: 0, isSelected: false },
        { id: 'extra-mushroom', name: 'เห็ดเพิ่ม', price: 15, isSelected: false },
      ],
      'steak': [
        { id: 'doneness', name: 'ระดับสุก', price: 0, isSelected: false },
        { id: 'extra-sauce', name: 'ซอสเพิ่ม', price: 10, isSelected: false },
        { id: 'side-dish', name: 'เครื่องเคียง', price: 25, isSelected: false },
      ],
      'pasta': [
        { id: 'sauce-type', name: 'ประเภทซอส', price: 0, isSelected: false },
        { id: 'extra-cheese', name: 'ชีสเพิ่ม', price: 15, isSelected: false },
        { id: 'extra-meat', name: 'เนื้อเพิ่ม', price: 35, isSelected: false },
      ]
    };
    
    return optionsMap[optionsGroup] || [];
  };

  const options = getProductOptions(product);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.id === optionId 
          ? { ...opt, isSelected: !opt.isSelected }
          : opt
      )
    );
  };

  const calculateTotalPrice = () => {
    const optionsPrice = selectedOptions
      .filter(opt => opt.isSelected)
      .reduce((sum, opt) => sum + opt.price, 0);
    return product.price + optionsPrice;
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedOptions, calculateTotalPrice());
    onClose();
    setSelectedOptions([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">เลือกตัวเลือกเพิ่มเติม</p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {options.map(option => (
            <div key={option.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedOptions.find(opt => opt.id === option.id)?.isSelected || false}
                  onChange={() => handleOptionToggle(option.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={option.id} className="text-white font-medium">
                  {option.name}
                </label>
              </div>
              {option.price > 0 && (
                <span className="text-green-400 font-semibold">
                  +฿{option.price}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">ราคารวม:</span>
            <span className="text-2xl font-bold text-green-400">
              ฿{calculateTotalPrice().toLocaleString()}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              เพิ่มในตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
