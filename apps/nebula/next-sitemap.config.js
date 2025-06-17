// @ts-check

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://nebula.thirdweb.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        // allow all if production
        allow: process.env.VERCEL_ENV === "production" ? ["/"] : [],
        // disallow all if not production
        disallow: ["/move-funds"],
      },
    ],
  },
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
      // => this will be exported as http(s)://<config.siteUrl>/<path>
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
