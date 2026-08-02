import type { NextConfig } from "next";
import { basePath } from "./lib/base-path";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true, // stable paths on GitHub Pages / static hosts
  basePath,
};

export default nextConfig;
