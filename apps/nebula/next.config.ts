import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline' vercel.live;
  font-src 'self' vercel.live assets.vercel.com fonts.gstatic.com;
  frame-src * data:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.thirdweb.com *.thirdweb-dev.com vercel.live challenges.cloudflare.com googletagmanager.com us-assets.i.posthog.com;
  connect-src * data: blob:;
  worker-src 'self' blob:;
  block-all-mixed-content;
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

const baseNextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverSourceMaps: false,
    taint: true,
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  async headers() {
    return [
      {
        headers: [
          ...securityHeaders,
          {
            key: "accept-ch",
            value: "sec-ch-viewport-width",
          },
        ],
        // Apply these headers to all routes in your application.
        source: "/(.*)",
      },
    ];
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        destination: "https://us-assets.i.posthog.com/static/:path*",
        source: "/_ph/static/:path*",
      },
      {
        destination: "https://us.i.posthog.com/:path*",
        source: "/_ph/:path*",
      },
      {
        destination: "https://us.i.posthog.com/decide",
        source: "/_ph/decide",
      },
    ];
  },
  serverExternalPackages: ["pino-pretty"],
};

export default baseNextConfig;
