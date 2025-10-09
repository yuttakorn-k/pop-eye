'use client';

import { useState } from 'react';
import { Product } from './POSInterface';
import ProductImage from './ProductImage';
import ProductOptionsModal from './ProductOptionsModal';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, productElement?: HTMLElement) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Check if product has options based on options_group field
  const hasOptions = (product: Product): boolean => {
    return !!(product as any).options_group && (product as any).options_group.trim() !== '';
  };

  const handleProductClick = (product: Product, event: React.MouseEvent<HTMLDivElement>) => {
    if (hasOptions(product)) {
      setSelectedProduct(product);
      setShowOptionsModal(true);
    } else {
      onAddToCart(product, event.currentTarget);
    }
  };

  const handleAddToCartWithOptions = (product: Product, options: any[], totalPrice: number) => {
    // Create a modified product with options
    const productWithOptions = {
      ...product,
      price: totalPrice,
      options: options.filter(opt => opt.isSelected)
    };
    onAddToCart(productWithOptions);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
            onClick={(e) => handleProductClick(product, e)}
          >
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
      ))}
      </div>

      {/* Options Modal */}
      <ProductOptionsModal
        product={selectedProduct}
        isOpen={showOptionsModal}
        onClose={() => {
          setShowOptionsModal(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCartWithOptions}
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
