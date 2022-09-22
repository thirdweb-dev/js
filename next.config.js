/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com unpkg.com;
  font-src 'self' fonts.gstatic.com;
  frame-src *;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.thirdweb.com;
  connect-src * data:;
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

const moduleExports = {
  reactStrictMode: true,
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
      {
        source: "/dashboard/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/dashboard/mumbai/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/thirdweb_Privacy_Policy_May_2022.pdf",
        permanent: false,
      },
      {
        source: "/tos",
        destination: "/Thirdweb_Terms_of_Service.pdf",
        permanent: false,
      },
      {
        source: "/contracts/publish",
        destination: "/contracts/release",
        permanent: false,
      },
      {
        source: "/authentication",
        destination: "/auth",
        permanent: false,
      },
      //  old (deprecated) routes
      {
        source:
          "/:network/(edition|nft-collection|token|pack|nft-drop|signature-drop|edition-drop|token-drop|marketplace|split|vote)/:address",
        destination: "/:network/:address",
        permanent: false,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["thirdweb.com", "portal.thirdweb.com", "blog.thirdweb.com"],
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  // Suppresses all logs
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.

  hideSourceMaps: false,
};
module.exports = withBundleAnalyzer(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions),
);
