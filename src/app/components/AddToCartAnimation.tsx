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
  const durationSec = Math.min(1.35, Math.max(0.85, distance / 600));
  const arc = Math.min(160, Math.max(60, distance * 0.28));
  const overshootX = Math.sign(deltaX) * Math.min(12, Math.abs(deltaX) * 0.06);
  const overshootY = Math.sign(deltaY) * Math.min(10, Math.abs(deltaY) * 0.05);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flyToCart-${animationId} {
            0% {
              transform: translate3d(-50%, -50%, 0) translate3d(0px, 0px, 0) scale(0.9) rotate(0deg);
              opacity: 0;
              filter: drop-shadow(0px 0px 0px rgba(0,0,0,0));
            }
            12% {
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX * 0.12}px, ${deltaY * 0.12 - Math.max(24, arc * 0.22)}px, 0) scale(1.08) rotate(6deg);
              opacity: 1;
              filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.25));
            }
            38% {
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX * 0.38}px, ${deltaY * 0.38 - arc}px, 0) scale(0.98) rotate(0deg);
              opacity: 1;
              filter: drop-shadow(0px 10px 16px rgba(0,0,0,0.28));
            }
            68% {
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX * 0.68}px, ${deltaY * 0.68 - Math.max(28, arc * 0.42)}px, 0) scale(0.64) rotate(-6deg);
              opacity: 1;
              filter: drop-shadow(0px 6px 10px rgba(0,0,0,0.2));
            }
            86% {
              /* slight overshoot */
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX + overshootX}px, ${deltaY + overshootY}px, 0) scale(0.36) rotate(0deg);
              opacity: 0.9;
              filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.15));
            }
            100% {
              transform: translate3d(-50%, -50%, 0) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.32) rotate(360deg);
              opacity: 0;
              filter: drop-shadow(0px 0px 0px rgba(0,0,0,0));
            }
          }

          .fly-animation-${animationId} {
            animation: flyToCart-${animationId} ${durationSec}s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
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
          <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg border border-gray-600 bg-gray-700">
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

