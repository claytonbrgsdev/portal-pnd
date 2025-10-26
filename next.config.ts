import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Removido output: 'export' para permitir rotas dinâmicas (API) no build serverful
  trailingSlash: true,
  // Se for publicar sob um subpath específico, mantenha basePath/assetPrefix.
  // Caso contrário, defina variáveis de ambiente ou ajuste para strings vazias.
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
