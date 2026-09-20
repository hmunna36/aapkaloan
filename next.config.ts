import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Hide the Next.js dev-tools badge in the corner while developing.
  devIndicators: false,
};

export default nextConfig;
