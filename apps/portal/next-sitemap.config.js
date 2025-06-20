/** @type {import('next-sitemap').IConfig} */
module.exports = {
  exclude: [
    // exclude v4 stuff
    "*/v4*",
    "*/react-native/v0*",
    "/wallet-sdk*",
    "/storage-sdk*",
    // exclude styleguide
    "/styleguide*",
  ],
  generateRobotsTxt: true, // (optional)
  robotsTxtOptions: {
    // disallow all crawlers on dev and preview
    policies: [
      {
        userAgent: "*",
        [process.env.VERCEL_ENV !== "preview" &&
        process.env.VERCEL_ENV !== "development"
          ? "allow"
          : "disallow"]: "/",
      },
    ],
  },
  siteUrl: process.env.SITE_URL || "https://portal.thirdweb.com",
};
