import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ['192.168.8.128', 'localhost:3000']
  }
};

export default nextConfig;
