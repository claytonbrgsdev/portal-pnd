import type { NextConfig } from "next";

// Use basePath only in production (GitHub Pages)
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Removed static export to support dynamic features like cookies/auth
  // output: 'export', // Commented out to enable dynamic rendering
  trailingSlash: true,
  ...(isProd && {
    basePath: '/portal-pnd',
    assetPrefix: '/portal-pnd/',
  }),
  images: {
    unoptimized: true
  },
  // Silence the workspace root warning
  outputFileTracingRoot: undefined,
  // Configure for dynamic rendering
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
