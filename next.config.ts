import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vpo0hsfeu9o9bhxg.public.blob.vercel-storage.com',
        port: '',
        pathname: '/profiles/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

