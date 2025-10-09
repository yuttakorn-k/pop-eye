'use client';

import { useState } from 'react';
import { Product } from './POSInterface';
import ProductImage from './ProductImage';
import ProductOptionsModal from './ProductOptionsModal';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Check if product has options based on options_group field
  const hasOptions = (product: Product): boolean => {
    return !!(product as any).options_group && (product as any).options_group.trim() !== '';
  };

  const handleProductClick = (product: Product) => {
    if (hasOptions(product)) {
      setSelectedProduct(product);
      setShowOptionsModal(true);
    } else {
      onAddToCart(product);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 hover:shadow-md hover:bg-gray-600 transition-all cursor-pointer group"
            onClick={() => handleProductClick(product)}
          >
          <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-700 rounded-t-lg">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="rounded-t-lg"
              fallbackIcon={getProductIcon(product.category)}
            />
          </div>
          
          <div className="p-3">
            <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 text-center">
              {product.name}
            </h3>
            
            <div className="text-center">
              <span className="text-lg font-bold text-green-400">
                ฿{product.price.toLocaleString()}
              </span>
            </div>
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
