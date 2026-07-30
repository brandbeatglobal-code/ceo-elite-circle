import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The admin reads content/*.json from disk at request time (the section
  // list is derived from the directory, not hand-listed), so those files must
  // ship with the admin routes' server bundle on Vercel.
  outputFileTracingIncludes: {
    "/admin/**": ["./content/**"],
  },
  // The WASM HEIC decoder loads its binary with dynamic requires that defeat
  // bundling — left internal it makes the tracer sweep the whole project into
  // the server bundle. Kept external (like sharp, which Next externalises by
  // default) it is traced conventionally instead.
  serverExternalPackages: ["heic-decode", "libheif-js"],
  experimental: {
    serverActions: {
      // Photo uploads arrive through a server action. The client resizes
      // before sending, but a HEIC straight off a phone cannot be resized in
      // most browsers and passes through at its original size.
      bodySizeLimit: "15mb",
    },
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
