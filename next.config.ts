import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Serverful build (sem output: 'export') para suportar APIs dinâmicas
  trailingSlash: true,
  basePath: isProd ? "/portal-pnd" : "",
  assetPrefix: isProd ? "/portal-pnd/" : "",
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
