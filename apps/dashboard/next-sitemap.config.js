// @ts-check
/**
 *
 * @returns {Promise<import("@thirdweb-dev/chains").Chain[]>}
 */
async function fetchChainsFromApi() {
  const res = await fetch(`https://api.thirdweb.com/v1/chains`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  if (json.error) {
    throw new Error(json.message);
  }

  return json.data;
}

/**
 *
 * @param {number|string} chainIdOrSlug
 * @returns {Promise<import("@thirdweb-dev/chains").Chain>}
 */
async function getSingleChain(chainIdOrSlug) {
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();

  if (json.error) {
    throw new Error(json.message);
  }

  return json.data;
}

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
    const allChains = await fetchChainsFromApi();
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
  const parsedLines = data.split("\n").map((l) => JSON.parse(l));
  const chainsForLines = await Promise.all(
    parsedLines.map((parsedLine) => {
      return getSingleChain(parsedLine.chain_id)
        .then((parsedLineChain) => ({
          loc: `/${parsedLineChain.slug}/${parsedLine.contract_address}`,
          changefreq: config.changefreq,
          priority: config.priority,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        }))
        .catch(() => null);
    }),
  );
  // filter out any failed requests
  return chainsForLines.filter(Boolean);
}
