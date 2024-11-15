import type { SentryBuildOptions } from "@sentry/nextjs";
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import FRAMER_PATHS from "./framer-rewrites";
import getRedirects from "./redirects";

const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline' vercel.live;
  font-src 'self' vercel.live assets.vercel.com framerusercontent.com fonts.gstatic.com;
  frame-src * data:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.thirdweb.com *.thirdweb-dev.com vercel.live js.stripe.com framerusercontent.com events.framer.com challenges.cloudflare.com;
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

function determineIpfsGateways() {
  // add the clientId ipfs gateways
  const remotePatterns: RemotePattern[] = [];
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

const SENTRY_OPTIONS: SentryBuildOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "thirdweb-dev",
  project: "dashboard",
  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Suppresses source map uploading logs during build
  silent: true,
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/err",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
};

const baseNextConfig: NextConfig = {
  serverExternalPackages: ["pino-pretty"],
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "accept-ch",
            value: "sec-ch-viewport-width",
          },
        ],
      },
    ];
  },
  async redirects() {
    return getRedirects();
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
      // re-write /home to / (this is so that logged in users will be able to go to /home and NOT be redirected to the logged in app)
      {
        source: "/home",
        destination: "/",
      },
      ...FRAMER_PATHS.map((path) => ({
        source: path,
        destination: `https://landing.thirdweb.com${path}`,
      })),
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
  compiler: {
    emotion: true,
  },
  reactStrictMode: true,
};

function getConfig(): NextConfig {
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { withPlausibleProxy } = require("next-plausible");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { withSentryConfig } = require("@sentry/nextjs");
    return withBundleAnalyzer(
      withPlausibleProxy({
        customDomain: "https://pl.thirdweb.com",
        scriptName: "pl",
      })(
        withSentryConfig(
          {
            ...baseNextConfig,
            experimental: {
              webpackBuildWorker: true,
            },
            // @ts-expect-error - this is a valid option
            webpack: (config, { dev }) => {
              if (config.cache && !dev) {
                config.cache = Object.freeze({
                  type: "filesystem",
                  maxMemoryGenerations: 0,
                });
              }
              config.externals.push("pino-pretty");
              config.module = {
                ...config.module,
                exprContextCritical: false,
              };
              // Important: return the modified config
              return config;
            },
          },
          SENTRY_OPTIONS,
        ),
      ),
    );
  }
  // otherwise return the base
  return baseNextConfig;
}

export default getConfig();
