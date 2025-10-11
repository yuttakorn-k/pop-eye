'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem } from './POSInterface';
import ProductImage from './ProductImage';
import MenuItemModal, { MenuItemForModal } from './MenuItemModal';
import MenuOptionService from '../services/menuOptionService';

interface ProductGridProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, productElement?: HTMLElement, selectedOptions?: { [group: string]: { name: string; price: number }[] }) => void;
}

export default function ProductGrid({ products, cart, onAddToCart }: ProductGridProps) {
  // Get quantity of a product in cart
  const getProductQuantity = (productId: number): number => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<{ [group: string]: string[] }>({});
  
  // Track which menus have option groups
  const [menusWithOptions, setMenusWithOptions] = useState<Set<number>>(new Set());
  
  // Store fetched option groups for each menu
  const [menuOptionsCache, setMenuOptionsCache] = useState<{ [menuId: number]: any[] }>({});

  // Fetch menu-option-group mappings on mount
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const mappings = await MenuOptionService.getAllMappings();
        const menuIds = new Set(mappings.map(m => m.menu_id));
        setMenusWithOptions(menuIds);
        console.log('📋 Menus with options:', Array.from(menuIds));
      } catch (error) {
        console.error('❌ Error fetching menu option mappings:', error);
      }
    };
    
    fetchMappings();
  }, []);

  // Check if product has options based on mappings
  const hasOptions = (product: Product): boolean => {
    return menusWithOptions.has(product.id);
  };

  const handleProductClick = async (product: Product, event: React.MouseEvent<HTMLDivElement>) => {
    console.log('Product clicked:', product.name);
    console.log('hasOptions result:', hasOptions(product));
    
    if (hasOptions(product)) {
      console.log('Opening options modal for:', product.name);
      
      // Fetch option groups if not cached
      if (!menuOptionsCache[product.id]) {
        console.log('🔍 Fetching option groups for menu:', product.id);
        try {
          const optionGroups = await MenuOptionService.getMenuOptionGroups(product.id);
          console.log('✅ Option groups loaded:', optionGroups);
          
          // Fetch options for each group
          const groupsWithOptions = await Promise.all(
            optionGroups.map(async (group) => {
              if (group.options && group.options.length > 0) {
                console.log(`✅ Group ${group.name_th} already has options:`, group.options.length);
                return group;
              } else {
                console.log(`🔍 Fetching options for group ${group.id}:`, group.name_th);
                const options = await MenuOptionService.getOptionsByGroupId(group.id);
                console.log(`✅ Options loaded for ${group.name_th}:`, options);
                return { ...group, options };
              }
            })
          );
          
          console.log('📦 Final groups with options:', groupsWithOptions);
          setMenuOptionsCache(prev => ({ ...prev, [product.id]: groupsWithOptions }));
        } catch (error) {
          console.error('❌ Error fetching option groups:', error);
        }
      }
      
      setSelectedProduct(product);
      setQuantity(1);
      setNote('');
      setSelectedAddons({});
      setShowOptionsModal(true);
    } else {
      console.log('Adding to cart directly:', product.name);
      onAddToCart(product, event.currentTarget);
    }
  };

  const handleModalClose = () => {
    setShowOptionsModal(false);
    setSelectedProduct(null);
    setQuantity(1);
    setNote('');
    setSelectedAddons({});
  };

  const handleToggleAddon = (group: string, option: string, checked: boolean, max: number) => {
    setSelectedAddons(prev => {
      const current = prev[group] || [];
      if (checked) {
        // Radio button: replace all selections in this group
        return { ...prev, [group]: [option] };
      } else {
        return { ...prev, [group]: current.filter(o => o !== option) };
      }
    });
  };

  const handleConfirm = () => {
    if (selectedProduct) {
      // สร้าง selectedOptions ที่มีราคาตัวเลือก
      const selectedOptionsWithPrice: { [group: string]: { name: string; price: number }[] } = {};
      
      // ดึงข้อมูลตัวเลือกพร้อมราคาจาก cache
      if (hasOptions(selectedProduct) && menuOptionsCache[selectedProduct.id]) {
        const optionGroups = menuOptionsCache[selectedProduct.id];
        
        Object.entries(selectedAddons).forEach(([groupName, selectedOptionNames]) => {
          // หา option group ที่ตรงกับ groupName
          const optionGroup = optionGroups.find(group => group.name_th === groupName);
          if (optionGroup && optionGroup.options) {
            selectedOptionsWithPrice[groupName] = selectedOptionNames.map(optionName => {
              // หาตัวเลือกที่ตรงกันและดึงราคา
              const option = optionGroup.options.find(opt => opt.name_th === optionName);
              return {
                name: optionName,
                price: option ? option.price : 0
              };
            });
          }
        });
      }
      
      // เพิ่มลงตะกร้าพร้อม selectedOptions ที่มีราคา
      onAddToCart(selectedProduct, undefined, selectedOptionsWithPrice);
      
      // ปิด modal
      handleModalClose();
    }
  };

  const calculateTotalPrice = (): number => {
    if (!selectedProduct) return 0;
    
    let total = selectedProduct.price * quantity;
    
    // เพิ่มราคาตัวเลือก
    if (hasOptions(selectedProduct) && menuOptionsCache[selectedProduct.id]) {
      const optionGroups = menuOptionsCache[selectedProduct.id];
      
      Object.entries(selectedAddons).forEach(([groupName, selectedOptionNames]) => {
        const optionGroup = optionGroups.find(group => group.name_th === groupName);
        if (optionGroup && optionGroup.options) {
          selectedOptionNames.forEach(optionName => {
            const option = optionGroup.options.find(opt => opt.name_th === optionName);
            if (option) {
              total += option.price * quantity;
            }
          });
        }
      });
    }
    
    return total;
  };

  // แปลง Product เป็น MenuItemForModal (ใช้ข้อมูลจาก API)
  const convertToMenuItemForModal = (product: Product): MenuItemForModal | null => {
    if (!product) return null;

    // ดึง addons จาก cache
    let addons: any[] = [];
    
    if (hasOptions(product) && menuOptionsCache[product.id]) {
      const optionGroups = menuOptionsCache[product.id];
      
      addons = optionGroups.map(group => ({
        groupName: group.name_th,
        required: group.is_required || false,
        max: 1, // Radio button (single selection)
        options: (group.options || []).map((opt: any) => ({
          name: opt.name_th,
          price: opt.price || 0
        }))
      }));
      
      console.log('📦 Addons from API:', addons);
    }

    return {
      id: product.id,
      name_th: product.name,
      name_en: product.description,
      price: product.price,
      image: product.image || '/placeholder-food.jpg',
      description: product.description,
      addons: addons
    };
  };


  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {products.map(product => {
          const quantity = getProductQuantity(product.id);
          const isInCart = quantity > 0;
          
          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer overflow-hidden relative ${
                isInCart 
                  ? 'border-green-500 shadow-md ring-2 ring-green-200' 
                  : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5'
              }`}
              onClick={(e) => handleProductClick(product, e)}
            >
              {/* Quantity Badge */}
              {isInCart && (
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">
                  {quantity}
                </div>
              )}
              
              <div className="w-full h-40 md:h-44 xl:h-48 bg-gray-100">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="rounded-t-xl"
                  fallbackIcon={getProductIcon(product.category)}
                />
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                <span className="text-sm md:text-base font-semibold text-blue-600">
                  ฿{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        open={showOptionsModal}
        item={convertToMenuItemForModal(selectedProduct)}
        quantity={quantity}
        note={note}
        selectedAddons={selectedAddons}
        onClose={handleModalClose}
        onChangeQuantity={setQuantity}
        onToggleAddon={handleToggleAddon}
        onChangeNote={setNote}
        onConfirm={handleConfirm}
        totalPrice={calculateTotalPrice()}
      />
    </>
  );
}

function getProductIcon(category: string): string {
  switch (category) {
    case 'ของทานเล่น':
      return '🍟';
    case 'ยำรสเด็ด':
      return '🌶️';
    case 'สลัด':
      return '🥗';
    case 'สปาเกตตี้/มักกะโรนี':
      return '🍝';
    case 'สเต็ก':
      return '🥩';
    case 'ข้าวสเต็ก':
      return '🍚';
    case 'คอมโบเซ็ต':
      return '🍽️';
    case 'เพิ่ม':
      return '➕';
    case 'เมนูข้าวผัด/จานเดียว':
      return '🍛';
    case 'เมนูข้าวไข่ข้น':
      return '🍳';
    case 'เมนูแนะนำ':
      return '⭐';
    case 'โคตรปู':
      return '🦀';
    default:
      return '🍴';
  }
}
