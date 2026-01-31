import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Authlib-Injector-API-Location",
            value: "/api/yggdrasil",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/user/closet",
        destination: "/closet",
      },
    ];
  },
};

export default nextConfig;
