/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'}/:path*`,
      },
    ];
  },
  // 忽略路由冲突错误
  onDemandEntries: {
    // 页面保留时间（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同时保留的页面数量
    pagesBufferLength: 2,
  },
  // 忽略构建期间的某些错误
  typescript: {
    // 在构建时忽略TypeScript错误
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 