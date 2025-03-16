import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
