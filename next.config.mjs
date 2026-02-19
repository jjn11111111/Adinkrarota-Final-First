/** @type {import('next').NextConfig} */
const nextConfig = {
  bundler: 'webpack',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
