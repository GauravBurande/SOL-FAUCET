import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.coinmarketcap.com",
      },
      {
        protocol: "https",
        hostname: "cdn3d.iconscout.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
