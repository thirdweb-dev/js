/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  serverExternalPackages: ["@shikijs/twoslash", "prettier", "shiki"],
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
