import type { NextConfig } from "next";

// Use basePath only in production (GitHub Pages)
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
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
  // Configure for static export
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
