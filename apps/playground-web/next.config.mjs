const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  frame-src * data:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.thirdweb.com thirdweb.com *.thirdweb-dev.com vercel.live js.stripe.com;
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverSourceMaps: false,
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: "/(.*)",
      },
    ];
  },
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: "/connect/pay",
        destination: "/payments/ui-components",
        permanent: false,
      },
      {
        source: "/connect/pay/:path*",
        destination: "/payments/:path*",
        permanent: false,
      },
      {
        source: "/connect/ui",
        destination: "/wallets/headless/account-components",
        permanent: false,
      },
      {
        source: "/connect/ui/nft",
        destination: "/wallets/headless/nft-components",
        permanent: false,
      },
      {
        source: "/connect/ui/token",
        destination: "/wallets/headless/token-components",
        permanent: false,
      },
      {
        source: "/connect/ui/chain",
        destination: "/wallets/headless/chain-components",
        permanent: false,
      },
      {
        source: "/connect/ui/wallet",
        destination: "/wallets/headless/wallet-components",
        permanent: false,
      },
      {
        source: "/connect/:path*",
        destination: "/wallets/:path*",
        permanent: false,
      },
      {
        source: "/engine/airdrop",
        destination: "/transactions/airdrop-tokens",
        permanent: false,
      },
      {
        source: "/engine/minting",
        destination: "/transactions/mint-tokens",
        permanent: false,
      },
      {
        source: "/engine/webhooks",
        destination: "/transactions/webhooks",
        permanent: false,
      },
      {
        source: "/wallets/account-abstraction/sponsor",
        destination: "/account-abstraction/eip-4337",
        permanent: false,
      },
      {
        source: "/wallets/account-abstraction/7702",
        destination: "/account-abstraction/eip-7702",
        permanent: false,
      },
      {
        source: "/wallets/account-abstraction/5792",
        destination: "/account-abstraction/eip-5792",
        permanent: false,
      },
      {
        source: "/wallets/account-abstraction/native-aa",
        destination: "/account-abstraction/native-aa",
        permanent: false,
      },
      {
        source: "/wallets/headless/token-components",
        destination: "/tokens/token-components",
        permanent: false,
      },
      {
        source: "/wallets/headless/nft-components",
        destination: "/tokens/nft-components",
        permanent: false,
      },
      {
        source: "/wallets/in-app-wallet/ecosystem",
        destination: "/wallets/ecosystem-wallet",
        permanent: false,
      },
    ];
  },
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
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
