import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamic imports handle external packages, no additional config needed
  typescript: {
    // Ignore TypeScript errors during build (not recommended for production)
    ignoreBuildErrors: true,
  },
  // Note: Next.js 16 removed the built-in eslint configuration
  // ESLint is no longer run during builds by default
};

export default nextConfig;
