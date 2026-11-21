import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow node:sqlite in server environment
  serverExternalPackages: ["node:sqlite"],
};

export default nextConfig;
