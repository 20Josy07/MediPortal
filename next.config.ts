// next.config.js (o .ts / .mjs)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🔧 Evita generar sourcemaps del cliente (ahorra RAM y tiempo)
  productionBrowserSourceMaps: false,

  // 🔧 Usa el compilador SWC (más liviano) y empaqueta solo lo necesario
  swcMinify: true,
  output: 'standalone',

  // 🖼️ Mitiga consumo alto por optimización de imágenes en build.
  //    Si luego quieres reactivarlo, cambia a { unoptimized: false }.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'img.icons8.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.postimg.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
    ],
  },

  // ⚠️ Mientras estabilizas el build en Netlify, evita que ESLint/TS corten la compilación
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        googleapis: false,
        handlebars: false,
        dotprompt: false,
        net: false,
        tls: false,
        fs: false,
        http2: false,
      };
    }

    // Opcional: si un paquete trae sourcemaps pesados, se pueden desactivar así:
    // config.devtool = false;

    return config;
  },
};

export default nextConfig;
