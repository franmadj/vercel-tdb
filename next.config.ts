import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ❌ Prevents double effect calls in dev mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging.texasdebrazil.com",
      },
    ],
  },
};

export default nextConfig;
