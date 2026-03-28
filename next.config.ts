import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // @ts-ignore
  allowedDevOrigins: ['sociologically-palaeobotanic-jarrod.ngrok-free.dev'],
  experimental: {
    serverActions: {
      allowedOrigins: ['sociologically-palaeobotanic-jarrod.ngrok-free.dev'],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;