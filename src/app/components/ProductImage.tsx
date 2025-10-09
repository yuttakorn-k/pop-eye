'use client';

import { useState } from 'react';
import { API_CONFIG } from '../config/api';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon: string;
}

export default function ProductImage({ src, alt, className = '', fallbackIcon }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="text-4xl text-blue-400">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  // Construct full image URL using the new endpoint structure
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL
    if (imagePath.startsWith('/')) {
      return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}`;
    }
    
    // If it's just a filename, use the images endpoint
    return `${API_CONFIG.IMAGE_BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES}${imagePath}`;
  };

  const imageUrl = getImageUrl(src);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-gray-400 text-2xl">
            {fallbackIcon}
          </div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover rounded-t-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
