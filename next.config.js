/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL
  }
};

module.exports = nextConfig;
