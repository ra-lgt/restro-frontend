const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = withPWA({
  images: {
    domains: [
      "wellmoe-product-dev.s3.eu-west-1.amazonaws.com",
      "wellmoe-product.s3.eu-west-1.amazonaws.com",
      "s3.eu-west-1.amazonaws.com",
    ],
  },
  reactStrictMode: true,
  optimizeFonts: false,
  env: {
    backendUrl: "http://localhost:1337", // Replace with the URL of your local Strapi server
  },
});
module.exports = nextConfig;
