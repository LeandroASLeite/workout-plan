/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
