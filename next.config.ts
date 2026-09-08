import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "/Register",
      },
      {
        source: "/login",
        destination: "/Login",
      },
      {
        source: "/code",
        destination: "/Code",
      },
    ];
  },
};

export default nextConfig;
