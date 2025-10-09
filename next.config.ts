import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // No static export for development to allow API routes
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
  
  // Production configuration
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  })
};

export default nextConfig;
