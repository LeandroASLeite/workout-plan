// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// // export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["static.exercisedb.dev"], // adicione aqui
//   },
// };

// module.exports = nextConfig;
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
