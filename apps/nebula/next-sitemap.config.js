// @ts-check

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        // allow all if production
        allow: process.env.VERCEL_ENV === "production" ? ["/"] : [],
        // disallow all if not production
        disallow: ["/move-funds"],
        userAgent: "*",
      },
    ],
  },
  siteUrl: process.env.SITE_URL || "https://nebula.thirdweb.com",
  transform: async (config, path) => {
    // ignore og image paths
    if (path.includes("_og") || path.includes("opengraph-image")) {
      return null;
    }

    // disallow /move-funds
    if (path.includes("/move-funds")) {
      return null;
    }

    return {
      alternateRefs: config.alternateRefs ?? [],
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      // => this will be exported as http(s)://<config.siteUrl>/<path>
      loc: path,
      priority: config.priority,
    };
  },
};
