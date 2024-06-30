/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  experimental: {
    serverExternalPackages: ["@shikijs/twoslash", "prettier", "shiki"],
  },
};

export default nextConfig;
