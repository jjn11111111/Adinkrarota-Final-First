// Derive NEXT_PUBLIC_SUPABASE_URL from POSTGRES_HOST if not set directly
if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.POSTGRES_HOST) {
  const match = process.env.POSTGRES_HOST.match(/^db\.(.+\.supabase\.co)$/)
  if (match) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${match[1]}`
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
