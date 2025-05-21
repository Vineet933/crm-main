/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure any experimental features if needed
  experimental: {
    // Enable server actions if you're using them
    serverActions: true,
  },
  // Configure webpack if needed
  webpack: (config: any) => {
    return config;
  },
  // Configure image domains if you're using next/image
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
