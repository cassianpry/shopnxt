/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "media.steampowered.com",
      },
      {
        protocol: "https",
        hostname: "swiperjs.com",
      },
    ],
  },

  // Matching all API routes
  source: "/api/:path*",
  headers: [
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Access-Control-Allow-Methods", value: "GET,PUT,POST,DELETE" },
    { key: "Access-Control-Allow-Headers", value: "Content-Type" },
  ],
};

module.exports = nextConfig;
