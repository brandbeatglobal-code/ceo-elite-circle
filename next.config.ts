import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The admin reads content/*.json from disk at request time (the section
  // list is derived from the directory, not hand-listed), so those files must
  // ship with the admin routes' server bundle on Vercel.
  outputFileTracingIncludes: {
    "/admin/**": ["./content/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
