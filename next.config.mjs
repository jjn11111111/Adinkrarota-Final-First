/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force clean rebuild by adding a unique config key
  env: {
    CONFIG_VERSION: 'v4-safe-auth',
  },
}

export default nextConfig
