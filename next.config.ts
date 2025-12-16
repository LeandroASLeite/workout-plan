/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.exercisedb.dev",
        port: "",
        pathname: "/w/images/**",
      },
    ],
  },
  basePath: isProd ? "/workout-plan" : "",
  assetPrefix: isProd ? "/workout-plan/" : "",
};

module.exports = nextConfig;
