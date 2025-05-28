import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        // Add rules that override the default behavior of turbo
      },
    },
  },
};

export default nextConfig;
