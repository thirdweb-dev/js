// eslint-disable-next-line @typescript-eslint/no-var-requires
const { allChains } = require("@thirdweb-dev/chains");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://thirdweb.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/_og"],
      },
    ],
  },
  transform: async (config, path) => {
    // ignore og image paths
    if (path.includes("_og")) {
      return null;
    }

    // rewwrite paths that include deployer to use thirdweb.eth directly
    if (path.includes("deployer.thirdweb.eth")) {
      path = path.replace("deployer.thirdweb.eth", "thirdweb.eth");
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
  additionalPaths: async (config) => {
    return allChains.map((chain) => {
      return {
        loc: `/${chain.slug}`,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    });
  },
};
