/** @type {import('next').NextConfig} */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
// content security headers things
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
  // {
  //   key: "Content-Security-Policy",
  //   value: `default-src * 'self' 'unsafe-eval' localhost:* thirdweb.com *.thirdweb.com *.vercel.app *.nftlabs.co *.ingest.sentry.io vitals.vercel-insights.com *.g.alchemy.com rpc.ftm.tools api.avax.network nftlabs.mypinata.cloud https:; style-src 'self' 'unsafe-eval' 'unsafe-inline' rsms.me fonts.googleapis.com; object-src 'none'; font-src rsms.me *.gstatic.com; base-uri 'none'; connect-src *; img-src * blob: data:;`,
  // },
];

const moduleExports = {
  reactStrictMode: true,
  outputFileTracing: false,
  swcMinify: false,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/portal/:match*",
        destination: "https://portal.thirdweb.com/:match*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [];
  },
  images: {
    domains: [
      "thirdweb.com",
      "ipfs.thirdweb.com",
      "portal.thirdweb.com",
      "blog.thirdweb.com",
    ],
  },
};

module.exports = moduleExports;
