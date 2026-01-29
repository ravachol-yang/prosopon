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
};

export default nextConfig;
