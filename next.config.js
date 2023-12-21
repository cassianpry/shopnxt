/** @type {import('next').NextConfig} */
const config = require("./config");
const nextConfig = {
  env: {
    DB_URI: config.DB_URI,
    API: config.API,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
  },
  i18n: { locales: ["en-US", "pt-BR"], defaultLocale: "pt-BR" },
};

module.exports = nextConfig;
