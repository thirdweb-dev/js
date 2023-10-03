// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { allChains, getChainByChainId } = require("@thirdweb-dev/chains");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://thirdweb.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
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
  exclude: ["/chain/validate"],
  transform: async (config, path) => {
    // ignore og image paths
    if (path.includes("_og")) {
      return null;
    }

    // rewrite paths that include deployer to use thirdweb.eth directly
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
    // TODO - update this to instead use the chainList api
    return [
      ...allChains.map((chain) => {
        return {
          loc: `/${chain.slug}`,
          changefreq: config.changefreq,
          priority: config.priority,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
      }),
      ...(await createSearchRecordSitemaps(config)),
    ];
  },
};
/**
 * @param {{ changefreq?: any; priority?: any; autoLastmod?: any; }} config
 */
async function createSearchRecordSitemaps(config) {
  if (!process.env.TYPESENSE_CONTRACT_EXPORT_API_KEY) {
    return [];
  }
  const response = await fetch(
    "https://search.thirdweb.com/collections/contracts/documents/export?filter_by=testnet:false",
    {
      headers: {
        "x-typesense-api-key": process.env.TYPESENSE_CONTRACT_EXPORT_API_KEY,
      },
    },
  );
  const data = await response.text();
  return data
    .split("\n")
    .map((l) => {
      try {
        const parsedLine = JSON.parse(l);
        const parsedLineChain = getChainByChainId(
          parseInt(parsedLine.chain_id),
        );
        return {
          loc: `/${parsedLineChain.slug}/${parsedLine.contract_address}`,
          changefreq: config.changefreq,
          priority: config.priority,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}
