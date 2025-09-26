import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/portal-pnd',
  assetPrefix: '/portal-pnd/',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
