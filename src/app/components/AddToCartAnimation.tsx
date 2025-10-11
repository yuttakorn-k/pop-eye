'use client';

import { useRef } from 'react';
import { Product } from './POSInterface';
import ProductImage from './ProductImage';

interface AddToCartAnimationProps {
  animationId: string;
  product: Product;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function AddToCartAnimation({
  animationId,
  product,
  startPosition,
  endPosition,
  onComplete
}: AddToCartAnimationProps) {
  const animationRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  const handleAnimationEnd = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  };

  // Calculate curved path parameters
  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;
  const distance = Math.hypot(deltaX, deltaY);
  const durationSec = Math.min(1.2, Math.max(0.8, distance / 500));
  const arc = Math.min(120, Math.max(40, distance * 0.25));
  const overshootX = Math.sign(deltaX) * Math.min(8, Math.abs(deltaX) * 0.04);
  const overshootY = Math.sign(deltaY) * Math.min(6, Math.abs(deltaY) * 0.03);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flyToCart-${animationId} {
            0% {
              transform: translate3d(-50%, -50%, 0) translate3d(0px, 0px, 0) scale(1);
              opacity: 1;
              filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.3));
            }
            100% {
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.2);
              opacity: 0;
              filter: drop-shadow(0px 0px 0px rgba(0,0,0,0));
            }
          }

          .fly-animation-${animationId} {
            animation: flyToCart-${animationId} ${durationSec}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            will-change: transform, opacity, filter;
            transform-origin: center center;
            backface-visibility: hidden;
            perspective: 1000px;
          }

          @media (prefers-reduced-motion: reduce) {
            .fly-animation-${animationId} {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `
      }} />
      
      <div
        ref={animationRef}
        onAnimationEnd={handleAnimationEnd}
        className={`fixed z-50 pointer-events-none fly-animation-${animationId}`}
        style={{
          left: `${startPosition.x}px`,
          top: `${startPosition.y}px`,
        }}
      >
        <div className="relative">
        {/* Product Image - starts from card size and shrinks */}
        <div className="relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-white">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              fallbackIcon={getProductIcon(product.category)}
            />
          </div>
        </div>
        </div>
      </div>
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

