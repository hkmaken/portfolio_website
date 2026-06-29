import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true, // stable paths on GitHub Pages / static hosts
};

export default nextConfig;
