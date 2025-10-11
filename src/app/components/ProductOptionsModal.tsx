'use client';

import { useState, useEffect } from 'react';
import { Product } from './POSInterface';
import MenuOptionService from '../services/menuOptionService';
import { MenuOptionOut } from '../types/api';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
  type: 'checkbox' | 'radio' | 'select';
  choices?: { id: string; name: string; price: number }[];
  selectedChoice?: string;
  isRequired?: boolean;
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
  const [apiOptions, setApiOptions] = useState<MenuOptionOut[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch options from API when product changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!product) {
        console.log('No product');
        setApiOptions([]);
        return;
      }

      try {
        setLoadingOptions(true);
        console.log('🔍 Fetching options for product:', product.name, 'ID:', product.id);
        
        // ใช้ method ใหม่: ดึง option groups ของเมนูนี้โดยตรง
        const groups = await MenuOptionService.getMenuOptionGroups(product.id);
        console.log('📦 Option groups found for', product.name, ':', groups);
        
        if (groups && groups.length > 0) {
          // ดึง options ของกลุ่มแรก (หรือทุกกลุ่ม)
          const allOptions: any[] = [];
          for (const group of groups) {
            const options = await MenuOptionService.getOptionsByGroupId(group.id);
            console.log(`✅ Options loaded for group "${group.name_th}":`, options);
            allOptions.push(...options);
          }
          setApiOptions(allOptions);
        } else {
          console.warn(`⚠️ No option groups found for product "${product.name}" (ID: ${product.id})`);
          setApiOptions([]);
        }
      } catch (error) {
        console.error('❌ Error fetching options:', error);
        setApiOptions([]);
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen && product) {
      console.log('🚀 Modal opened for product:', product.name, 'ID:', product.id);
      fetchOptions();
    }
  }, [product, isOpen]);


  // Convert API options to ProductOption format
  const convertApiOptionsToProductOptions = (apiOpts: MenuOptionOut[], groupIsRequired: boolean = false): ProductOption[] => {
    // Group options by common patterns (e.g., spicy levels, doneness)
    const spicyKeywords = ['เผ็ด', 'spicy'];
    const donenessKeywords = ['สุก', 'ลวก', 'rare', 'medium', 'well'];
    const saladKeywords = ['สลัด', 'salad', 'น้ำสลัด', 'dressing'];
    
    const spicyOptions = apiOpts.filter(opt => 
      spicyKeywords.some(keyword => 
        opt.name_th.toLowerCase().includes(keyword) || 
        opt.name_en?.toLowerCase().includes(keyword)
      )
    );
    
    const donenessOptions = apiOpts.filter(opt => 
      donenessKeywords.some(keyword => 
        opt.name_th.toLowerCase().includes(keyword) || 
        opt.name_en?.toLowerCase().includes(keyword)
      )
    );

    const saladOptions = apiOpts.filter(opt => 
      saladKeywords.some(keyword => 
        opt.name_th.toLowerCase().includes(keyword) || 
        opt.name_en?.toLowerCase().includes(keyword)
      )
    );
    
    const extraOptions = apiOpts.filter(opt => 
      !spicyOptions.includes(opt) && 
      !donenessOptions.includes(opt) &&
      !saladOptions.includes(opt)
    );

    const result: ProductOption[] = [];

    // Add salad dressing group if exists (REQUIRED)
    if (saladOptions.length > 0) {
      result.push({
        id: 'salad-dressing',
        name: 'น้ำสลัด',
        price: 0,
        isSelected: false,
        type: 'radio',
        isRequired: true,
        choices: saladOptions.map(opt => ({
          id: `option-${opt.id}`,
          name: opt.name_th,
          price: opt.price
        }))
      });
    }

    // Add spicy level group if exists
    if (spicyOptions.length > 0) {
      result.push({
        id: 'spicy-level',
        name: 'ระดับเผ็ด',
        price: 0,
        isSelected: false,
        type: 'radio',
        isRequired: false,
        choices: spicyOptions.map(opt => ({
          id: `option-${opt.id}`,
          name: opt.name_th,
          price: opt.price
        }))
      });
    }

    // Add doneness group if exists (REQUIRED for steak)
    if (donenessOptions.length > 0) {
      result.push({
        id: 'doneness',
        name: 'ระดับสุก',
        price: 0,
        isSelected: false,
        type: 'radio',
        isRequired: true,
        choices: donenessOptions.map(opt => ({
          id: `option-${opt.id}`,
          name: opt.name_th,
          price: opt.price
        }))
      });
    }

    // Add extra options as checkboxes
    extraOptions.forEach(opt => {
      result.push({
        id: `option-${opt.id}`,
        name: opt.name_th,
        price: opt.price,
        isSelected: false,
        type: 'checkbox',
        isRequired: false
      });
    });

    return result;
  };

  // Get options (from API only - no fallback)
  const options = apiOptions.length > 0 
    ? convertApiOptionsToProductOptions(apiOptions)
    : [];

  // Initialize selectedOptions when modal opens or options change
  useEffect(() => {
    if (isOpen && product && options.length > 0 && !loadingOptions) {
      console.log('🔄 Initializing selectedOptions with', options.length, 'options');
      setSelectedOptions(options);
    }
  }, [isOpen, product, loadingOptions]); // ลบ options ออกจาก dependency array

  if (!isOpen || !product) return null;

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.id === optionId 
          ? { ...opt, isSelected: !opt.isSelected }
          : opt
      )
    );
  };

  const handleChoiceSelect = (optionId: string, choiceId: string) => {
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.id === optionId 
          ? { ...opt, selectedChoice: choiceId, isSelected: true }
          : opt
      )
    );
  };

  const calculateTotalPrice = () => {
    const optionsPrice = selectedOptions
      .filter(opt => opt.isSelected)
      .reduce((sum, opt) => {
        let price = opt.price;
        
        // Add price from selected choice if it's a radio option
        if (opt.type === 'radio' && opt.selectedChoice && opt.choices) {
          const selectedChoice = opt.choices.find(choice => choice.id === opt.selectedChoice);
          if (selectedChoice) {
            price += selectedChoice.price;
          }
        }
        
        return sum + price;
      }, 0);
    return product.price + optionsPrice;
  };

  // Check if all required options are selected
  const isAllRequiredOptionsSelected = (): boolean => {
    const requiredOptions = selectedOptions.filter(opt => opt.isRequired);
    
    for (const option of requiredOptions) {
      if (option.type === 'radio') {
        // For radio buttons, must have a selected choice
        if (!option.selectedChoice) {
          return false;
        }
      } else if (option.type === 'checkbox') {
        // For required checkboxes, must be selected
        if (!option.isSelected) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Get list of unselected required options
  const getUnselectedRequiredOptions = (): string[] => {
    const requiredOptions = selectedOptions.filter(opt => opt.isRequired);
    const unselected: string[] = [];
    
    for (const option of requiredOptions) {
      if (option.type === 'radio' && !option.selectedChoice) {
        unselected.push(option.name);
      } else if (option.type === 'checkbox' && !option.isSelected) {
        unselected.push(option.name);
      }
    }
    
    return unselected;
  };

  const handleAddToCart = () => {
    if (!isAllRequiredOptionsSelected()) {
      const unselected = getUnselectedRequiredOptions();
      alert(`กรุณาเลือก: ${unselected.join(', ')}`);
      return;
    }
    
    onAddToCart(product, selectedOptions, calculateTotalPrice());
    onClose();
    setSelectedOptions([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedOptions([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>
          </div>
          <p className="text-lg text-gray-600 mt-2">เลือกตัวเลือกเพิ่มเติม</p>
        </div>

        {/* Options */}
        <div className="p-8 space-y-8">
          {loadingOptions ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">กำลังโหลดตัวเลือก...</span>
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">ไม่พบตัวเลือกในระบบ</p>
              <p className="text-sm text-gray-400">
                กรุณาเพิ่มตัวเลือกสำหรับ "{product?.name}" ในระบบ
              </p>
              <p className="text-xs text-gray-300 mt-2">
                API: GET /menus/{product?.id}/option-groups
              </p>
            </div>
          ) : (
            <>
              {options.map(option => (
            <div key={option.id} className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900">
                {option.name}
                {option.isRequired && <span className="text-red-500 ml-2">*</span>}
              </h4>
              
              {option.type === 'checkbox' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={selectedOptions.find(opt => opt.id === option.id)?.isSelected || false}
                      onChange={() => handleOptionToggle(option.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={option.id} className="text-gray-900 font-medium">
                      เพิ่ม {option.name}
                    </label>
                  </div>
                  {option.price > 0 && (
                    <span className="text-green-600 font-semibold">
                      +฿{option.price}
                    </span>
                  )}
                </div>
              ) : option.type === 'radio' && option.choices ? (
                <div className="grid grid-cols-3 gap-4">
                  {option.choices.map(choice => (
                    <label
                      key={choice.id}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors min-h-[80px] ${
                        selectedOptions.find(opt => opt.id === option.id)?.selectedChoice === choice.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={option.id}
                        value={choice.id}
                        checked={selectedOptions.find(opt => opt.id === option.id)?.selectedChoice === choice.id}
                        onChange={() => handleChoiceSelect(option.id, choice.id)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 mb-2"
                      />
                      <span className="text-gray-900 font-medium text-center mb-1">{choice.name}</span>
                      {choice.price > 0 && (
                        <span className="text-green-600 font-semibold text-sm">
                          +฿{choice.price}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl text-gray-600 font-medium">ราคารวม:</span>
            <span className="text-4xl font-bold text-blue-600">
              ฿{calculateTotalPrice().toLocaleString()}
            </span>
          </div>

          {/* Required options warning */}
          {!isAllRequiredOptionsSelected() && selectedOptions.some(opt => opt.isRequired) && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">กรุณาเลือก:</span> {getUnselectedRequiredOptions().join(', ')}
              </p>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 text-lg font-medium"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!isAllRequiredOptionsSelected()}
              className={`flex-1 px-6 py-4 rounded-lg transition-colors font-bold text-lg ${
                isAllRequiredOptionsSelected()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              เพิ่มในตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
