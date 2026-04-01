import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // @ts-ignore
  allowedDevOrigins: ['mamie-rooted-unprofanely.ngrok-free.dev'],
  experimental: {
    serverActions: {
      allowedOrigins: ['mamie-rooted-unprofanely.ngrok-free.dev'],
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