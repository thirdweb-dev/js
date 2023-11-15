const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  frame-src * data:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.thirdweb.com *.thirdweb-dev.com vercel.live js.stripe.com;
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redirects = require("./redirects");

/**
 * @returns {import('next').RemotePattern[]}
 */
function determineIpfsGateways() {
  // add the clientId ipfs gateways
  const remotePatterns = [];
  if (process.env.API_ROUTES_CLIENT_ID) {
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.ipfscdn.io`,
    });
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.thirdwebstorage-staging.com`,
    });
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.thirdwebstorage-dev.com`,
    });
  } else {
    // this should only happen in development
    remotePatterns.push({
      protocol: "https",
      hostname: "ipfs.io",
    });
  }
  // also add the dashboard clientId ipfs gateway if it is set
  if (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID) {
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.ipfscdn.io`,
    });
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.thirdwebstorage-staging.com`,
    });
    remotePatterns.push({
      protocol: "https",
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.thirdwebstorage-dev.com`,
    });
  }
  return remotePatterns;
}

/** @type {import('next').NextConfig} */
const moduleExports = {
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
    return redirects();
  },
  async rewrites() {
    return [
      {
        source: "/thirdweb.eth",
        destination: "/deployer.thirdweb.eth",
      },
      {
        source: "/thirdweb.eth/:path*",
        destination: "/deployer.thirdweb.eth/:path*",
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.thirdweb.com",
      },
      ...determineIpfsGateways(),
    ],
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    esmExternals: "loose",
  },
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlausibleProxy } = require("next-plausible");

// we only want sentry on production environments
const wSentry =
  process.env.NODE_ENV === "production" ? withSentryConfig : (x) => x;

module.exports = withPlausibleProxy({
  customDomain: "https://pl.thirdweb.com",
  scriptName: "pl",
})(
  withBundleAnalyzer(
    wSentry(
      moduleExports,
      { silent: true, debug: false },
      { hideSourceMaps: false, widenClientFileUpload: true },
    ),
  ),
);
