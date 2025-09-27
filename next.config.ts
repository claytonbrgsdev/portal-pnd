import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/portal-pnd',
  assetPrefix: '/portal-pnd/',
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
