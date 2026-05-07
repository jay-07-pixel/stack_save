import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    /** Pin workspace root when multiple lockfiles exist on the machine. */
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
