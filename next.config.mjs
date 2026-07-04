/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Me',
  assetPrefix: '/Me',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
