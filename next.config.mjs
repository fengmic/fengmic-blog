/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 优化生产构建
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 图片优化 - 使用新的 remotePatterns 配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 's1.imagehub.cc',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // 启用实验性优化功能
  experimental: {
    optimizePackageImports: ['framer-motion', 'date-fns', 'react-markdown'],
  },
  // 性能优化
  productionBrowserSourceMaps: false,
  // 禁用开发指示器（隐藏左下角的"N"按钮）
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;
