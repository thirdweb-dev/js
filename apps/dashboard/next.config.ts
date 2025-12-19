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
  style-src 'self' 'unsafe-inline' vercel.live us.posthog.com;
  font-src 'self' vercel.live assets.vercel.com framerusercontent.com fonts.gstatic.com;
  frame-src * data:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.thirdweb.com *.thirdweb-dev.com vercel.live js.stripe.com framerusercontent.com events.framer.com challenges.cloudflare.com googletagmanager.com us-assets.i.posthog.com edit.framer.com framer.com googletagmanager.com;
  connect-src * data: blob:;
  worker-src 'self' blob:;
  block-all-mixed-content;
`;

const EmbedContentSecurityPolicy = `
  ${ContentSecurityPolicy}
  frame-ancestors *;
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
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.ipfscdn.io`,
      protocol: "https",
    });
    remotePatterns.push({
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.thirdwebstorage-staging.com`,
      protocol: "https",
    });
    remotePatterns.push({
      hostname: `${process.env.API_ROUTES_CLIENT_ID}.thirdwebstorage-dev.com`,
      protocol: "https",
    });
  } else {
    // this should only happen in development
    remotePatterns.push({
      hostname: "ipfs.io",
      protocol: "https",
    });
  }
  // also add the dashboard clientId ipfs gateway if it is set
  if (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID) {
    remotePatterns.push({
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.ipfscdn.io`,
      protocol: "https",
    });
    remotePatterns.push({
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.thirdwebstorage-staging.com`,
      protocol: "https",
    });
    remotePatterns.push({
      hostname: `${process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID}.thirdwebstorage-dev.com`,
      protocol: "https",
    });
  }
  return remotePatterns;
}

const SENTRY_OPTIONS: SentryBuildOptions = {
  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "thirdweb-dev",
  project: "dashboard",
  // Suppresses source map uploading logs during build
  silent: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/err",
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
};

// add additional languages to the framer rewrite paths here (english is already included by default)
const FRAMER_ADDITIONAL_LANGUAGES = ["es"];

const baseNextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
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
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value: EmbedContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
        source: "/bridge/widget",
      },
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value: EmbedContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
        source: "/bridge/widget/:path*",
      },
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value: EmbedContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
        source: "/bridge/checkout-widget",
      },
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value: EmbedContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
        source: "/bridge/checkout-widget/:path*",
      },
    ];
  },
  images: {
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "**.thirdweb.com",
        protocol: "https",
      },
      ...determineIpfsGateways(),
    ],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async redirects() {
    return getRedirects();
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
      {
        destination: "/deployer.thirdweb.eth",
        source: "/thirdweb.eth",
      },
      {
        destination: "/deployer.thirdweb.eth/:path*",
        source: "/thirdweb.eth/:path*",
      },
      // re-write /home to / (this is so that logged in users will be able to go to /home and NOT be redirected to the logged in app)
      {
        destination: "https://landing.thirdweb.com",
        source: "/home",
      },
      // flatmap the framer paths for the default language and the additional languages
      ...FRAMER_PATHS.flatMap((path) => [
        {
          destination: `https://landing.thirdweb.com${path}`,
          source: path,
        },
        // this is for additional languages
        ...FRAMER_ADDITIONAL_LANGUAGES.map((lang) => ({
          destination: `https://landing.thirdweb.com/${lang}${path}`,
          source: `/${lang}${path}`,
        })),
      ]),
    ];
  },
};

function getConfig(): NextConfig {
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { withSentryConfig } = require("@sentry/nextjs");
    return withBundleAnalyzer(
      withSentryConfig(
        {
          ...baseNextConfig,
          // @ts-expect-error - this is a valid option
          webpack: (config) => {
            if (config.cache) {
              config.cache = Object.freeze({
                type: "memory",
              });
            }
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
    );
  }
  // otherwise return the base
  return baseNextConfig;
}

export default getConfig();
