/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["@shikijs/twoslash"],
  },
};

export default nextConfig;
