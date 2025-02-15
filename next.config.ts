import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://capstone24.sit.kmutt.ac.th"],
    unoptimized: true,
  },
  basePath: "/nw1/admin/",
  assetPrefix: "/nw1/admin/",
};

export default nextConfig;
