/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // ✅ Ensures Next.js uses app directory correctly
  },
};

module.exports = nextConfig;
