// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.exercisedb.dev",
        port: "", // geralmente vazio
        pathname: "/w/images/**", // permite todas as imagens nesse path
      },
    ],
  },
};

module.exports = nextConfig;
