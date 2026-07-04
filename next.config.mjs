// 仅在 GitHub Pages 部署（子路径 /Me）时启用 basePath；
// v0 预览与本地开发访问根路径，不加前缀，避免 404。
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoBasePath = isGithubPages ? '/Me' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: repoBasePath,
  assetPrefix: repoBasePath || undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
